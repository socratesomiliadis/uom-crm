import { getActivityById } from "@/lib/api/activity";
import { getContactById } from "@/lib/api/contact";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  Clock,
  User,
  FileText,
  CheckCircle,
  Circle,
  ArrowLeft,
  Mail,
  Phone,
  Users,
  StickyNote,
  ClipboardList,
  Edit,
} from "lucide-react";
import Link from "next/link";
import AddOrEditActivityForm, { ActivityData } from "../add-edit-activity-form";

interface ActivityPageProps {
  params: {
    id: string;
  };
}

const activityTypeConfig = {
  CALL: {
    icon: Phone,
    color: "bg-blue-100 text-blue-800",
    bgColor: "bg-blue-50",
  },
  EMAIL: {
    icon: Mail,
    color: "bg-green-100 text-green-800",
    bgColor: "bg-green-50",
  },
  MEETING: {
    icon: Users,
    color: "bg-purple-100 text-purple-800",
    bgColor: "bg-purple-50",
  },
  NOTE: {
    icon: StickyNote,
    color: "bg-yellow-100 text-yellow-800",
    bgColor: "bg-yellow-50",
  },
  TASK: {
    icon: ClipboardList,
    color: "bg-orange-100 text-orange-800",
    bgColor: "bg-orange-50",
  },
};

export default async function ActivityPage({ params }: ActivityPageProps) {
  const activityId = parseInt(params.id);

  if (isNaN(activityId)) {
    notFound();
  }

  try {
    const activity = await getActivityById(activityId);

    if (!activity) {
      notFound();
    }

    // Fetch contact details if contactId exists
    const contact = activity.contactId
      ? await getContactById(activity.contactId)
      : null;

    const typeConfig = activityTypeConfig[activity.type];
    const TypeIcon = typeConfig.icon;

    return (
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 size-14 flex items-center justify-center rounded-lg ${typeConfig.bgColor}`}
              >
                <TypeIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {activity.subject || `${activity.type} Activity`}
                </h1>
                <p className="text-muted-foreground">Activity #{activity.id}</p>
              </div>
            </div>
          </div>
          <AddOrEditActivityForm
            activityToEdit={activity as ActivityData}
            triggerButton={
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit Activity
              </Button>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activity Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Activity Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={typeConfig.color}>{activity.type}</Badge>
                  <div className="flex items-center gap-2">
                    {activity.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-400" />
                    )}
                    <span
                      className={
                        activity.completed ? "text-green-600" : "text-gray-500"
                      }
                    >
                      {activity.completed ? "Completed" : "Pending"}
                    </span>
                  </div>
                </div>

                {activity.subject && (
                  <div>
                    <h3 className="font-semibold text-lg">
                      {activity.subject}
                    </h3>
                  </div>
                )}

                {activity.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            {contact && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Associated Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.firstName} ${contact.lastName}`}
                      />
                      <AvatarFallback>
                        {contact.firstName?.[0]}
                        {contact.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Link
                        href={`/dashboard/contacts/${contact.id}`}
                        className="text-lg font-semibold hover:text-blue-600 transition-colors"
                      >
                        {contact.firstName} {contact.lastName}
                      </Link>
                      {contact.email && (
                        <p className="text-muted-foreground">{contact.email}</p>
                      )}
                      {contact.phone && (
                        <p className="text-muted-foreground">{contact.phone}</p>
                      )}
                    </div>
                    <Link href={`/dashboard/contacts/${contact.id}`}>
                      <Button variant="outline" size="sm">
                        View Contact
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Date & Time Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <CalendarDays className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Activity Date</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.activityDate).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {activity.dueDate && (
                    <div className="flex items-start gap-3">
                      <div className="bg-orange-100 p-2 rounded-full">
                        <Clock className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">Due Date</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.dueDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-start gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <CalendarDays className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Created</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Clock className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Last Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {contact && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <a href={`mailto:${contact.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Email Contact
                      </a>
                    </Button>
                    {contact.phone && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        asChild
                      >
                        <a href={`tel:${contact.phone}`}>
                          <Phone className="w-4 h-4 mr-2" />
                          Call Contact
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <Link href={`/dashboard/contacts/${contact.id}`}>
                        <User className="w-4 h-4 mr-2" />
                        View Contact
                      </Link>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching activity:", error);
    notFound();
  }
}
