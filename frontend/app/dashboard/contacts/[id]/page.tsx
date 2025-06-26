import { notFound } from "next/navigation";
import { getContactById } from "@/lib/api/contact";
import { getCompanyById } from "@/lib/api/company";
import { getOpportunities } from "@/lib/api/opportunity";
import { getActivities } from "@/lib/api/activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Building2,
  Mail,
  Phone,
  Calendar,
  Edit,
  TrendingUp,
  FileText,
  Briefcase,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import AddOrEditContactForm, { ContactData } from "../add-edit-contact-form";

interface ContactPageProps {
  params: {
    id: string;
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { id } = await params;
  const contactId = parseInt(id);

  if (isNaN(contactId)) {
    notFound();
  }

  const [contact, allOpportunities, allActivities] = await Promise.all([
    getContactById(contactId),
    getOpportunities(),
    getActivities(),
  ]);

  if (!contact) {
    notFound();
  }

  // Get company details if contact has a company
  const company = contact.companyId
    ? await getCompanyById(contact.companyId)
    : null;

  // Get opportunities for this contact
  const contactOpportunities =
    allOpportunities?.filter(
      (opportunity) => opportunity.contactId === contactId
    ) || [];

  // Get active opportunities (not WON or LOST)
  const activeOpportunities = contactOpportunities.filter(
    (opportunity) => !["WON", "LOST"].includes(opportunity.stage)
  );

  // Calculate total opportunity value
  const totalOpportunityValue = contactOpportunities.reduce(
    (sum, opportunity) => sum + parseFloat(opportunity.amount),
    0
  );

  // Get activities for this contact
  const contactActivities =
    allActivities?.filter((activity) => activity.contactId === contactId) || [];

  // Get recent activities (last 5)
  const recentActivities = contactActivities
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

  const getActivityTypeIcon = (type: string) => {
    const icons = {
      CALL: Phone,
      EMAIL: Mail,
      MEETING: User,
      NOTE: FileText,
      TASK: Briefcase,
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          {/* Contact Avatar */}
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.firstName} ${contact.lastName}`}
            />
            <AvatarFallback className="text-2xl">
              {contact.firstName.charAt(0)}
              {contact.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {contact.firstName} {contact.lastName}
            </h1>
            {contact.jobTitle && (
              <p className="text-lg text-gray-600 mt-1">{contact.jobTitle}</p>
            )}
            {company && (
              <Link
                href={`/dashboard/companies/${company.id}`}
                className="text-blue-600 hover:text-blue-800 mt-1 inline-block"
              >
                {company.name}
              </Link>
            )}
          </div>
        </div>
        <AddOrEditContactForm
          contactToEdit={contact as ContactData}
          triggerButton={
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit Contact
            </Button>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Contact Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Full Name
                  </label>
                  <p className="text-sm text-gray-900">
                    {contact.firstName} {contact.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <div className="flex items-center mt-1">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>
                {contact.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Phone
                    </label>
                    <div className="flex items-center mt-1">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-sm text-gray-900 hover:text-gray-700"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                )}
                {contact.jobTitle && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Job Title
                    </label>
                    <p className="text-sm text-gray-900">{contact.jobTitle}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

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

          {/* Recent Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Opportunities
                </div>
                <Link href={`/dashboard/opportunities?contactId=${contact.id}`}>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contactOpportunities.length > 0 ? (
                <div className="space-y-3">
                  {contactOpportunities.slice(0, 3).map((opportunity) => (
                    <div
                      key={opportunity.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <Link
                          href={`/dashboard/opportunities/${opportunity.id}`}
                          className="font-medium hover:text-blue-600"
                        >
                          {opportunity.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={getStageColor(opportunity.stage)}
                            variant="secondary"
                          >
                            {opportunity.stage}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {formatCurrency(opportunity.amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500 mb-3">
                    No opportunities found for this contact
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/dashboard/opportunities/new?contactId=${contact.id}`}
                    >
                      Create Opportunity
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Recent Activities
                </div>
                <Link href={`/dashboard/activities?contactId=${contact.id}`}>
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
                    No activities found for this contact
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/dashboard/activities/new?contactId=${contact.id}`}
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
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">
                    {contactOpportunities.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total Opportunities
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalOpportunityValue.toString())}
                  </div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <FileText className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-600">
                    {contactActivities.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Activities</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="font-medium">{formatDate(contact.createdAt)}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-medium">{formatDate(contact.updatedAt)}</p>
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
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href={`mailto:${contact.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </a>
              </Button>
              {contact.phone && (
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={`tel:${contact.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Contact
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
