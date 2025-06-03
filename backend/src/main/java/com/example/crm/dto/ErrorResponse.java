// backend/src/main/java/com/example/crm/dto/ErrorResponse.java
package com.example.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * A standard JSON payload for API errors.
 */
@Getter
@AllArgsConstructor
public class ErrorResponse {
    private final int status;
    private final String error;    // e.g. "Not Found", "Bad Request"
    private final String message;  // a human‐readable message
    private final String path;     // the request path that caused the error
}
