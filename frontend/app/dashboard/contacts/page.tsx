import { getContacts } from "@/lib/api/contact";
import DataTableDemo from "./data-table";
import { ContactDto } from "@/lib/api/types";

export default async function ContactsPage() {
  const contacts = await getContacts();

  return <DataTableDemo data={contacts as ContactDto[]} />;
}
