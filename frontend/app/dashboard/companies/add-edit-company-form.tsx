"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createCompany, updateCompany } from "@/lib/api/company";

const formSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  industry: z.string().optional(),
  website: z.string().url("Invalid website URL").or(z.literal("")).optional(),
  addressLine1: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

type CompanyDataFromSchema = z.infer<typeof formSchema>;
export interface CompanyData extends CompanyDataFromSchema {
  id: number;
}

interface AddOrEditCompanyFormProps {
  triggerButton?: React.ReactNode;
  companyToEdit?: CompanyData;
  isOpen?: boolean;
  onClose?: () => void;
  noTrigger?: boolean;
}

export default function AddOrEditCompanyForm({
  triggerButton,
  companyToEdit,
  isOpen: externalIsOpen,
  onClose,
  noTrigger,
}: AddOrEditCompanyFormProps) {
  const isEditMode = !!companyToEdit;
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Use external control if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onClose !== undefined ? onClose : setInternalIsOpen;

  const defaultFormValues = useMemo(() => {
    if (isEditMode && companyToEdit) {
      return {
        name: companyToEdit.name,
        industry: companyToEdit.industry,
        website: companyToEdit.website || "",
        addressLine1: companyToEdit.addressLine1,
        city: companyToEdit.city,
        state: companyToEdit.state,
        country: companyToEdit.country,
        postalCode: companyToEdit.postalCode,
      };
    }
    return {
      name: "",
      industry: "",
      website: "",
      addressLine1: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    };
  }, [isEditMode, companyToEdit]);

  const form = useForm<CompanyDataFromSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(defaultFormValues);
    }
  }, [isOpen, defaultFormValues, form]);

  async function onSubmit(values: CompanyDataFromSchema) {
    try {
      if (isEditMode && companyToEdit) {
        await updateCompany(companyToEdit.id, values);
      } else {
        await createCompany(values);
      }
      if (onClose) {
        onClose();
      } else {
        setInternalIsOpen(false);
      }
    } catch (error) {
      console.error("Failed to save company:", error);
    }
  }

  const dialogTitle = isEditMode ? "Edit Company" : "Add New Company";
  const submitButtonText = isEditMode ? "Save Changes" : "Create Company";
  const triggerButtonText = isEditMode ? "Edit Company" : "Add Company";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (onClose && !open) {
          onClose();
        } else {
          setInternalIsOpen(open);
        }
      }}
    >
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      {!triggerButton && !externalIsOpen && !noTrigger && (
        <DialogTrigger asChild>
          <Button className="ml-auto cursor-pointer">
            {triggerButtonText}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent aria-describedby="company-form">
        <DialogHeader>
          <DialogTitle className="font-medium text-2xl tracking-tight">
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Company Information</h3>
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Technology, Healthcare"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Address</h3>
              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Street address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>State/Province</FormLabel>
                      <FormControl>
                        <Input placeholder="State or Province" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Postal/ZIP code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                {submitButtonText}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => form.reset(defaultFormValues)}
              >
                Reset Form
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
