import { notFound } from "next/navigation";
import { getOpportunityById } from "@/lib/api/opportunity";
import { getContactById } from "@/lib/api/contact";
import { getCompanyById } from "@/lib/api/company";
import { getActivities } from "@/lib/api/activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TrendingUp,
  User,
  Building2,
  Calendar,
  DollarSign,
  Edit,
  FileText,
  Clock,
  Target,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import AddOrEditOpportunityForm, {
  OpportunityData,
} from "../add-edit-opportunity-form";

interface OpportunityPageProps {
  params: {
    id: string;
  };
}

export default async function OpportunityPage({
  params,
}: OpportunityPageProps) {
  const { id } = await params;
  const opportunityId = parseInt(id);

  if (isNaN(opportunityId)) {
    notFound();
  }

  const [opportunity, allActivities] = await Promise.all([
    getOpportunityById(opportunityId),
    getActivities(),
  ]);

  if (!opportunity) {
    notFound();
  }

  // Get contact and company details
  const contact = await getContactById(opportunity.contactId);
  const company = contact?.companyId
    ? await getCompanyById(contact.companyId)
    : null;

  // Get activities for this opportunity
  const opportunityActivities =
    allActivities?.filter(
      (activity) => activity.contactId === opportunity.contactId
    ) || [];

  // Get recent activities (last 5)
  const recentActivities = opportunityActivities
    .sort(
      (a, b) =>
        new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime()
    )
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(amount));
  };

  const getStageColor = (stage: string) => {
    const colors = {
      NEW: "bg-blue-100 text-blue-800",
      QUALIFIED: "bg-green-100 text-green-800",
      PROPOSAL: "bg-yellow-100 text-yellow-800",
      NEGOTIATION: "bg-orange-100 text-orange-800",
      WON: "bg-emerald-100 text-emerald-800",
      LOST: "bg-red-100 text-red-800",
    };
    return colors[stage as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStageIcon = (stage: string) => {
    const icons = {
      NEW: Target,
      QUALIFIED: CheckCircle,
      PROPOSAL: FileText,
      NEGOTIATION: AlertTriangle,
      WON: CheckCircle,
      LOST: XCircle,
    };
    return icons[stage as keyof typeof icons] || Target;
  };

  const getActivityTypeIcon = (type: string) => {
    const icons = {
      CALL: Phone,
      EMAIL: Mail,
      MEETING: User,
      NOTE: FileText,
      TASK: Target,
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  const getStageProgress = (stage: string) => {
    const progress = {
      NEW: 20,
      QUALIFIED: 40,
      PROPOSAL: 60,
      NEGOTIATION: 80,
      WON: 100,
      LOST: 0,
    };
    return progress[stage as keyof typeof progress] || 0;
  };

  const isCloseDateOverdue = opportunity.closeDate
    ? new Date(opportunity.closeDate) < new Date() &&
      !["WON", "LOST"].includes(opportunity.stage)
    : false;

  const StageIcon = getStageIcon(opportunity.stage);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          {/* Opportunity Icon */}
          <div
            className={`w-20 h-20 rounded-lg flex items-center justify-center ${
              opportunity.stage === "WON"
                ? "bg-green-100"
                : opportunity.stage === "LOST"
                ? "bg-red-100"
                : "bg-blue-100"
            }`}
          >
            <StageIcon
              className={`w-10 h-10 ${
                opportunity.stage === "WON"
                  ? "text-green-600"
                  : opportunity.stage === "LOST"
                  ? "text-red-600"
                  : "text-blue-600"
              }`}
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {opportunity.title}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStageColor(opportunity.stage)}>
                {opportunity.stage}
              </Badge>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(opportunity.amount)}
              </span>
            </div>
          </div>
        </div>
        <AddOrEditOpportunityForm
          opportunityToEdit={opportunity as OpportunityData}
          triggerButton={
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit Opportunity
            </Button>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Opportunity Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Opportunity Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Opportunity Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Title
                  </label>
                  <p className="text-sm text-gray-900">{opportunity.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Value
                  </label>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(opportunity.amount)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Stage
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStageColor(opportunity.stage)}>
                      {opportunity.stage}
                    </Badge>
                  </div>
                </div>
                {opportunity.closeDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Expected Close Date
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span
                        className={`text-sm ${
                          isCloseDateOverdue
                            ? "text-red-600 font-medium"
                            : "text-gray-900"
                        }`}
                      >
                        {formatDate(opportunity.closeDate)}
                      </span>
                      {isCloseDateOverdue && (
                        <Badge variant="destructive">Overdue</Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">
                  Progress
                </label>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      opportunity.stage === "WON"
                        ? "bg-green-500"
                        : opportunity.stage === "LOST"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${getStageProgress(opportunity.stage)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {getStageProgress(opportunity.stage)}% complete
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          {contact && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Associated Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
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
                    <div>
                      <h3 className="font-semibold text-lg">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      {contact.jobTitle && (
                        <p className="text-gray-600">{contact.jobTitle}</p>
                      )}
                      <div className="flex items-center gap-4 mt-1">
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          {contact.email}
                        </a>
                        {contact.phone && (
                          <a
                            href={`tel:${contact.phone}`}
                            className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            {contact.phone}
                          </a>
                        )}
                      </div>
                    </div>
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

          {/* Company Information */}
          {company && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{company.name}</h3>
                    {company.industry && (
                      <Badge variant="secondary" className="mt-1">
                        {company.industry}
                      </Badge>
                    )}
                    {company.website && (
                      <div className="mt-2">
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          {company.website}
                        </a>
                      </div>
                    )}
                  </div>
                  <Link href={`/dashboard/companies/${company.id}`}>
                    <Button variant="outline" size="sm">
                      View Company
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Recent Activities
                </div>
                <Link href={`/dashboard/activities?contactId=${contact?.id}`}>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivities.length > 0 ? (
                <div className="space-y-3">
                  {recentActivities.map((activity) => {
                    const ActivityIcon = getActivityTypeIcon(activity.type);
                    return (
                      <div
                        key={activity.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="p-2 bg-white rounded-lg">
                          <ActivityIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <Link
                            href={`/dashboard/activities/${activity.id}`}
                            className="font-medium hover:text-blue-600"
                          >
                            {activity.subject || activity.type}
                          </Link>
                          <p className="text-sm text-gray-500">
                            {formatDate(activity.activityDate)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500 mb-3">
                    No activities found for this opportunity
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/dashboard/activities/new?contactId=${contact?.id}`}
                    >
                      Add Activity
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Opportunity Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(opportunity.amount)}
                  </div>
                  <div className="text-sm text-gray-600">Deal Value</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Target className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">
                    {getStageProgress(opportunity.stage)}%
                  </div>
                  <div className="text-sm text-gray-600">Progress</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <FileText className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-600">
                    {opportunityActivities.length}
                  </div>
                  <div className="text-sm text-gray-600">Activities</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Info */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="font-medium">
                    {formatDate(opportunity.createdAt)}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-medium">
                    {formatDate(opportunity.updatedAt)}
                  </p>
                </div>
              </div>
              {opportunity.closeDate && (
                <>
                  <Separator />
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Expected Close</p>
                      <p
                        className={`font-medium ${
                          isCloseDateOverdue ? "text-red-600" : ""
                        }`}
                      >
                        {formatDate(opportunity.closeDate)}
                      </p>
                    </div>
                  </div>
                </>
              )}
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
                </>
              )}

              {contact && (
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/dashboard/contacts/${contact.id}`}>
                    <User className="w-4 h-4 mr-2" />
                    View Contact
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
