// backend/src/main/java/com/example/crm/config/GlobalExceptionHandler.java
package com.example.crm.config;

import com.example.crm.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.stream.Collectors;

/**
 * GlobalExceptionHandler catches all exceptions thrown by controllers/services
 * and returns a well‐formed JSON payload (ErrorResponse) with fields:
 *   - status (int)
 *   - error  (String reason phrase)
 *   - message (detailed message)
 *   - path   (request URI)
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle ResponseStatusException (manually thrown in services/controllers).
     */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatus(
            ResponseStatusException ex,
            HttpServletRequest request
    ) {
        // ex.getStatusCode() returns HttpStatusCode (an interface),
        // so we first get the integer value, then resolve it to an HttpStatus (if possible).
        HttpStatusCode statusCode = ex.getStatusCode();        // could be ANY HttpStatusCode
        int rawValue = statusCode.value();

        // Try to turn that integer into a concrete HttpStatus enum.
        HttpStatus resolvedStatus = HttpStatus.resolve(rawValue);

        // If resolution succeeds, use its reason phrase. Otherwise, fallback to the code itself.
        String errorReason = (resolvedStatus != null)
                ? resolvedStatus.getReasonPhrase()
                : statusCode.toString();

        // ex.getReason() is the custom message passed into ResponseStatusException.
        String customMessage = (ex.getReason() != null)
                ? ex.getReason()
                : errorReason;

        ErrorResponse body = new ErrorResponse(
                rawValue,
                errorReason,
                customMessage,
                request.getRequestURI()
        );

        return ResponseEntity
                .status(rawValue)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body);
    }

    /**
     * Handle validation errors triggered by @Valid on controller method arguments.
     * Collect all field‐error messages into one combined string.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {
        // Join all field errors (e.g. "name must not be blank; email must be valid")
        String errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));

        HttpStatus status = HttpStatus.BAD_REQUEST;
        ErrorResponse body = new ErrorResponse(
                status.value(),
                status.getReasonPhrase(),
                errors,
                request.getRequestURI()
        );
        return ResponseEntity
                .status(status)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body);
    }

    /**
     * Catch‐all for any other exceptions (unexpected server errors).
     * Returns HTTP 500 Internal Server Error.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(
            Exception ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String message = (ex.getMessage() != null) ? ex.getMessage() : "Unexpected server error";

        ErrorResponse body = new ErrorResponse(
                status.value(),
                status.getReasonPhrase(),
                message,
                request.getRequestURI()
        );
        return ResponseEntity
                .status(status)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body);
    }
}
