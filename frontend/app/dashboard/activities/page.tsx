import { getActivities } from "@/lib/api/activity";
import { getContactById } from "@/lib/api/contact";
import DataTableDemo from "./data-table";

export default async function ActivitiesPage() {
  const activities = await getActivities();

  const activitiesWithContact = await Promise.all(
    activities?.map(async (activity) => ({
      ...activity,
      contact: activity.contactId
        ? await getContactById(activity.contactId)
        : null,
    })) || []
  );

  return <DataTableDemo data={activitiesWithContact || []} />;
}
