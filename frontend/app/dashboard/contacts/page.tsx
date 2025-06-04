import { getContacts } from "@/lib/api/contact";
import DataTableDemo from "./data-table";
import { getCompanyById } from "@/lib/api/company";

export default async function ContactsPage() {
  const contacts = await getContacts();

  const contactsWithCompany = await Promise.all(
    contacts?.map(async (contact) => ({
      ...contact,
      company: contact.companyId
        ? await getCompanyById(contact.companyId)
        : null,
    })) || []
  );

  return <DataTableDemo data={contactsWithCompany || []} />;
}
