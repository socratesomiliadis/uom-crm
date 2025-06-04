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
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { createContact, updateContact } from "@/lib/api/contact";
import { getCompanies } from "@/lib/api/company";
import { CompanyDto } from "@/lib/api/types";
import AddOrEditCompanyForm from "../companies/add-edit-company-form";
import { Plus } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  companyId: z.number().optional(),
});

type ContactDataFromSchema = z.infer<typeof formSchema>;
export interface ContactData extends ContactDataFromSchema {
  id: number;
}

interface AddOrEditContactFormProps {
  triggerButton?: React.ReactNode;
  contactToEdit?: ContactData;
}

export default function AddOrEditContactForm({
  triggerButton,
  contactToEdit,
}: AddOrEditContactFormProps) {
  const isEditMode = !!contactToEdit;
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);

  const defaultFormValues = useMemo(() => {
    if (isEditMode && contactToEdit) {
      return {
        firstName: contactToEdit.firstName,
        lastName: contactToEdit.lastName,
        email: contactToEdit.email,
        phone: contactToEdit.phone || "",
        jobTitle: contactToEdit.jobTitle || "",
        companyId: contactToEdit.companyId,
      };
    }
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      jobTitle: "",
      companyId: undefined,
    };
  }, [isEditMode, contactToEdit]);

  const form = useForm<ContactDataFromSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  // Convert companies to combobox options
  const companyOptions: ComboboxOption[] = useMemo(() => {
    const options: ComboboxOption[] = [{ value: "", label: "No Company" }];

    if (companies) {
      companies.forEach((company) => {
        options.push({
          value: company.id.toString(),
          label: company.name,
        });
      });
    }

    return options;
  }, [companies]);

  // Fetch companies when the dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset(defaultFormValues);
      fetchCompanies();
    }
  }, [isOpen, defaultFormValues, form]);

  const fetchCompanies = async () => {
    try {
      const companiesData = await getCompanies();
      setCompanies(companiesData || []);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    }
  };

  // Refresh companies list when company form closes
  const handleCompanyFormClose = () => {
    setIsCompanyFormOpen(false);
    fetchCompanies();
  };

  async function onSubmit(values: ContactDataFromSchema) {
    setError(null);
    try {
      if (isEditMode && contactToEdit) {
        await updateContact(contactToEdit.id, values);
      } else {
        await createContact(values);
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to save contact:", error);
      setError("Failed to save contact");
    }
  }

  const dialogTitle = isEditMode ? "Edit Contact" : "Add New Contact";
  const submitButtonText = isEditMode ? "Save Changes" : "Create Contact";
  const triggerButtonText = isEditMode ? "Edit Contact" : "Add Contact";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {triggerButton ? (
            triggerButton
          ) : (
            <Button className="ml-auto cursor-pointer">
              {triggerButtonText}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent aria-describedby="contact-form">
          <DialogHeader>
            <DialogTitle className="font-medium text-2xl tracking-tight">
              {dialogTitle}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contact Information</h3>
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="name@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Job Title (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Sales Manager" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company (Optional)</FormLabel>
                      <div className="flex gap-2">
                        <FormControl className="flex-1">
                          <Combobox
                            options={companyOptions}
                            value={field.value?.toString() || ""}
                            onValueChange={(value) => {
                              if (value === "" || value === "null") {
                                field.onChange(undefined);
                              } else {
                                field.onChange(parseInt(value));
                              }
                            }}
                            placeholder="Select a company"
                            searchPlaceholder="Search companies..."
                            emptyText="No companies found."
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setIsCompanyFormOpen(true)}
                          className="shrink-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {error && <div className="text-red-500">{error}</div>}
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

      {/* Company Creation Dialog */}
      <AddOrEditCompanyForm
        isOpen={isCompanyFormOpen}
        onClose={handleCompanyFormClose}
        noTrigger={true}
      />
    </>
  );
}
