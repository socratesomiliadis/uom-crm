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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createOpportunity, updateOpportunity } from "@/lib/api/opportunity";
import { getContacts } from "@/lib/api/contact";
import { ContactDto } from "@/lib/api/types";
import { Plus } from "lucide-react";
import { DateTimePicker } from "@/components/datetime-picker";

const formSchema = z.object({
  contactId: z.number().min(1, "Contact is required"),
  title: z.string().min(1, "Title is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    }, "Amount must be a valid positive number"),
  stage: z.enum(["NEW", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"]),
  closeDate: z.string().optional(),
});

type OpportunityDataFromSchema = z.infer<typeof formSchema>;
export interface OpportunityData extends OpportunityDataFromSchema {
  id: number;
}

interface AddOrEditOpportunityFormProps {
  triggerButton?: React.ReactNode;
  opportunityToEdit?: OpportunityData;
}

export default function AddOrEditOpportunityForm({
  triggerButton,
  opportunityToEdit,
}: AddOrEditOpportunityFormProps) {
  const isEditMode = !!opportunityToEdit;
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<ContactDto[]>([]);

  const defaultFormValues = useMemo(() => {
    if (isEditMode && opportunityToEdit) {
      return {
        contactId: opportunityToEdit.contactId,
        title: opportunityToEdit.title,
        amount: opportunityToEdit.amount.toString(),
        stage: opportunityToEdit.stage,
        closeDate: opportunityToEdit.closeDate || "",
      };
    }
    return {
      contactId: undefined,
      title: "",
      amount: "",
      stage: "NEW" as const,
      closeDate: "",
    };
  }, [isEditMode, opportunityToEdit]);

  const form = useForm<OpportunityDataFromSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  // Convert contacts to combobox options
  const contactOptions: ComboboxOption[] = useMemo(() => {
    const options: ComboboxOption[] = [];

    if (contacts) {
      contacts.forEach((contact) => {
        options.push({
          value: contact.id.toString(),
          label: `${contact.firstName} ${contact.lastName}`,
        });
      });
    }

    return options;
  }, [contacts]);

  // Stage options
  const stageOptions = [
    { value: "NEW", label: "New" },
    { value: "QUALIFIED", label: "Qualified" },
    { value: "PROPOSAL", label: "Proposal" },
    { value: "NEGOTIATION", label: "Negotiation" },
    { value: "WON", label: "Won" },
    { value: "LOST", label: "Lost" },
  ];

  // Fetch contacts when the dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset(defaultFormValues);
      fetchContacts();
    }
  }, [isOpen, defaultFormValues, form]);

  const fetchContacts = async () => {
    try {
      const contactsData = await getContacts();
      setContacts(contactsData || []);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    }
  };

  async function onSubmit(values: OpportunityDataFromSchema) {
    setError(null);
    try {
      const submitData = {
        ...values,
        closeDate: values.closeDate || undefined,
      };

      if (isEditMode && opportunityToEdit) {
        await updateOpportunity(opportunityToEdit.id, submitData);
      } else {
        await createOpportunity(submitData);
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to save opportunity:", error);
      setError("Failed to save opportunity");
    }
  }

  const dialogTitle = isEditMode ? "Edit Opportunity" : "Add New Opportunity";
  const submitButtonText = isEditMode ? "Save Changes" : "Create Opportunity";
  const triggerButtonText = isEditMode ? "Edit Opportunity" : "Add Opportunity";

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
        <DialogContent aria-describedby="opportunity-form">
          <DialogHeader>
            <DialogTitle className="font-medium text-2xl tracking-tight">
              {dialogTitle}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Opportunity Information</h3>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter opportunity title"
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
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stage"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Stage</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {stageOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="contactId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact</FormLabel>
                      <FormControl>
                        <Combobox
                          options={contactOptions}
                          value={field.value?.toString() || ""}
                          onValueChange={(value) => {
                            if (value === "" || value === "null") {
                              field.onChange(undefined);
                            } else {
                              field.onChange(parseInt(value));
                            }
                          }}
                          placeholder="Select a contact"
                          searchPlaceholder="Search contacts..."
                          emptyText="No contacts found."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="closeDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Close Date (Optional)</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          value={
                            field.value ? new Date(field.value) : undefined
                          }
                          onChange={(date) =>
                            field.onChange(
                              date ? date.toISOString().split("T")[0] : ""
                            )
                          }
                          hideTime={true}
                          clearable={true}
                        />
                      </FormControl>
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
    </>
  );
}
