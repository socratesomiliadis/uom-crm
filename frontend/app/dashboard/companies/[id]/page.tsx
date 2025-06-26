import { notFound } from "next/navigation";
import { getCompanyById } from "@/lib/api/company";
import { getContacts } from "@/lib/api/contact";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Globe,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Edit,
  Users,
  TrendingUp,
  FileText,
} from "lucide-react";
import Link from "next/link";
import AddOrEditCompanyForm, { CompanyData } from "../add-edit-company-form";

interface CompanyPageProps {
  params: {
    id: string;
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { id } = await params;
  const companyId = parseInt(id);

  if (isNaN(companyId)) {
    notFound();
  }

  const [company, allContacts] = await Promise.all([
    getCompanyById(companyId),
    getContacts(),
  ]);

  if (!company) {
    notFound();
  }

  // Get the primary contact (first contact associated with this company)
  const primaryContact = allContacts?.find(
    (contact) => contact.companyId === companyId
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFullAddress = () => {
    const addressParts = [
      company.addressLine1,
      company.addressLine2,
      company.city,
      company.state,
      company.postalCode,
      company.country,
    ].filter(Boolean);

    return addressParts.join(", ");
  };

  const addressAsMapQuery = () => {
    const addressParts = [
      company.addressLine1,
      company.city,
      company.state,
      company.country,
    ].filter(Boolean);

    return addressParts.join("+");
  };

  const getContactInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          {/* Company Logo Placeholder */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
            {company.industry && (
              <Badge variant="secondary" className="mt-2">
                {company.industry}
              </Badge>
            )}
          </div>
        </div>
        <AddOrEditCompanyForm
          companyToEdit={company as CompanyData}
          triggerButton={
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit Company
            </Button>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Company Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Company Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Company Name
                  </label>
                  <p className="text-sm text-gray-900">{company.name}</p>
                </div>
                {company.industry && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Industry
                    </label>
                    <p className="text-sm text-gray-900">{company.industry}</p>
                  </div>
                )}
                {company.website && (
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-500">
                      Website
                    </label>
                    <div className="flex items-center mt-1">
                      <Globe className="w-4 h-4 mr-2 text-gray-400" />
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        {company.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getFullAddress() ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-900">{getFullAddress()}</p>
                  {/* Map Placeholder */}
                  <div className="mt-4 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      id="canvas-for-googlemap"
                    >
                      <iframe
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        src={`https://www.google.com/maps/embed/v1/place?q=${addressAsMapQuery()}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}
                      ></iframe>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No address information available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Company Stats Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Company Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">
                    {allContacts?.filter(
                      (contact) => contact.companyId === companyId
                    ).length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Contacts</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-sm text-gray-600">
                    Active Opportunities
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <FileText className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-600">89</div>
                  <div className="text-sm text-gray-600">Total Activities</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="font-medium">{formatDate(company.createdAt)}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-medium">{formatDate(company.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Primary Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Primary Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {primaryContact ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {getContactInitials(
                        primaryContact.firstName,
                        primaryContact.lastName
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {primaryContact.firstName} {primaryContact.lastName}
                      </p>
                      {primaryContact.jobTitle && (
                        <p className="text-xs text-gray-500">
                          {primaryContact.jobTitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <a
                        href={`mailto:${primaryContact.email}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {primaryContact.email}
                      </a>
                    </div>
                    {primaryContact.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <a
                          href={`tel:${primaryContact.phone}`}
                          className="text-gray-900 hover:text-gray-700"
                        >
                          {primaryContact.phone}
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full"
                    >
                      <Link href={`/dashboard/contacts/${primaryContact.id}`}>
                        View Contact
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500 mb-3">
                    No contacts found for this company
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/dashboard/contacts/new?companyId=${company.id}`}
                    >
                      Add Contact
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Meeting scheduled</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email sent</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Note added</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
