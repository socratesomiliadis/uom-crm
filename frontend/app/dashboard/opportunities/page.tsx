import { getOpportunities } from "@/lib/api/opportunity";
import { getContactById } from "@/lib/api/contact";
import DataTableDemo from "./data-table";

export default async function OpportunitiesPage() {
  const opportunities = await getOpportunities();

  const opportunitiesWithContact = await Promise.all(
    opportunities?.map(async (opportunity) => ({
      ...opportunity,
      contact: await getContactById(opportunity.contactId),
    })) || []
  );

  return <DataTableDemo data={opportunitiesWithContact || []} />;
}
