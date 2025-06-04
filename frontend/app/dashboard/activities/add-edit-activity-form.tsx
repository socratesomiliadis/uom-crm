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
import { createActivity, updateActivity } from "@/lib/api/activity";
import { getContacts } from "@/lib/api/contact";
import { ContactDto } from "@/lib/api/types";
import { Plus } from "lucide-react";
import { DateTimePicker } from "@/components/datetime-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  contactId: z.number().min(1, "Contact is required"),
  type: z.enum(["CALL", "EMAIL", "MEETING", "NOTE", "TASK"]),
  subject: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  activityDate: z.string().min(1, "Activity date is required"),
  dueDate: z.string().optional().nullable(),
  completed: z.boolean(),
});

type ActivityDataFromSchema = z.infer<typeof formSchema>;
export interface ActivityData extends ActivityDataFromSchema {
  id: number;
}

interface AddOrEditActivityFormProps {
  triggerButton?: React.ReactNode;
  activityToEdit?: ActivityData;
}

export default function AddOrEditActivityForm({
  triggerButton,
  activityToEdit,
}: AddOrEditActivityFormProps) {
  const isEditMode = !!activityToEdit;
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<ContactDto[]>([]);

  const defaultFormValues = useMemo(() => {
    if (isEditMode && activityToEdit) {
      return {
        contactId: activityToEdit.contactId,
        type: activityToEdit.type,
        subject: activityToEdit.subject || "",
        description: activityToEdit.description || "",
        activityDate: activityToEdit.activityDate,
        dueDate: activityToEdit.dueDate || "",
        completed: activityToEdit.completed,
      };
    }
    return {
      contactId: undefined,
      type: "CALL" as const,
      subject: "",
      description: "",
      activityDate: new Date().toISOString(),
      dueDate: "",
      completed: false,
    };
  }, [isEditMode, activityToEdit]);

  const form = useForm<ActivityDataFromSchema>({
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

  // Activity type options
  const typeOptions = [
    { value: "CALL", label: "Call" },
    { value: "EMAIL", label: "Email" },
    { value: "MEETING", label: "Meeting" },
    { value: "NOTE", label: "Note" },
    { value: "TASK", label: "Task" },
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

  async function onSubmit(values: ActivityDataFromSchema) {
    setError(null);
    try {
      const submitData = {
        ...values,
        contactId: values.contactId || null,
        subject: values.subject || null,
        description: values.description || null,
        dueDate: values.dueDate || null,
      };

      if (isEditMode && activityToEdit) {
        await updateActivity(activityToEdit.id, submitData);
      } else {
        await createActivity(submitData);
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to save activity:", error);
      setError("Failed to save activity");
    }
  }

  const dialogTitle = isEditMode ? "Edit Activity" : "Add New Activity";
  const submitButtonText = isEditMode ? "Save Changes" : "Create Activity";
  const triggerButtonText = isEditMode ? "Edit Activity" : "Add Activity";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {triggerButton ? (
            triggerButton
          ) : (
            <Button className="ml-auto cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              {triggerButtonText}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent aria-describedby="activity-form">
          <DialogHeader>
            <DialogTitle className="font-medium text-2xl tracking-tight">
              {dialogTitle}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Activity Information</h3>
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Subject (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter activity subject"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {typeOptions.map((option) => (
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter activity description"
                          rows={3}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="activityDate"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Activity Date</FormLabel>
                        <FormControl>
                          <DateTimePicker
                            value={
                              field.value ? new Date(field.value) : undefined
                            }
                            onChange={(date) =>
                              field.onChange(date ? date.toISOString() : "")
                            }
                            // hideTime={true}
                            clearable={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Due Date (Optional)</FormLabel>
                        <FormControl>
                          <DateTimePicker
                            value={
                              field.value ? new Date(field.value) : undefined
                            }
                            onChange={(date) =>
                              field.onChange(date ? date.toISOString() : "")
                            }
                            // hideTime={true}
                            clearable={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="completed"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Completed</FormLabel>
                      </div>
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
