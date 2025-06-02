import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";

// Common Header component
function Header({ title }: { title: string }) {
  return (
    <header className="w-full h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">
          User Menu
        </button>
      </div>
    </header>
  );
}

// ==== Contacts Page ==== //
export function ContactsPage() {
  // Dummy contacts data
  const contacts = [
    {
      id: 1,
      firstName: "Jane",
      lastName: "Doe",
      company: "Acme Corp",
      email: "jane.doe@acme.com",
      phone: "555-1234",
    },
    {
      id: 2,
      firstName: "John",
      lastName: "Smith",
      company: "Globex Inc",
      email: "john.smith@globex.com",
      phone: "555-5678",
    },
    {
      id: 3,
      firstName: "Alice",
      lastName: "Johnson",
      company: "Synth Ltd",
      email: "alice.j@synth.com",
      phone: "555-9012",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Contacts" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-2">
              <Input placeholder="Search contacts..." className="w-64" />
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acme">Acme Corp</SelectItem>
                  <SelectItem value="globex">Globex Inc</SelectItem>
                  <SelectItem value="synth">Synth Ltd</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="default" className="flex items-center gap-2">
              <PlusCircle size={20} />
              New Contact
            </Button>
          </div>
          <Card className="rounded-2xl shadow">
            <CardHeader>
              <CardTitle className="text-xl">Contact List</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((c) => (
                    <TableRow key={c.id} className="hover:bg-gray-50">
                      <TableCell>
                        {c.firstName} {c.lastName}
                      </TableCell>
                      <TableCell>{c.company}</TableCell>
                      <TableCell>{c.email}</TableCell>
                      <TableCell>{c.phone}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm" variant="ghost" className="ml-2">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

// ==== Companies Page ==== //
export function CompaniesPage() {
  const companies = [
    {
      id: 1,
      name: "Acme Corp",
      industry: "Manufacturing",
      website: "acme.com",
      city: "Metropolis",
    },
    {
      id: 2,
      name: "Globex Inc",
      industry: "Technology",
      website: "globex.com",
      city: "Gotham",
    },
    {
      id: 3,
      name: "Synth Ltd",
      industry: "Pharma",
      website: "synth.com",
      city: "Neo Tokyo",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Companies" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <Input placeholder="Search companies..." className="w-64" />
            <Button variant="default" className="flex items-center gap-2">
              <PlusCircle size={20} />
              New Company
            </Button>
          </div>
          <Card className="rounded-2xl shadow">
            <CardHeader>
              <CardTitle className="text-xl">Company List</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((cmp) => (
                    <TableRow key={cmp.id} className="hover:bg-gray-50">
                      <TableCell>{cmp.name}</TableCell>
                      <TableCell>{cmp.industry}</TableCell>
                      <TableCell>{cmp.website}</TableCell>
                      <TableCell>{cmp.city}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm" variant="ghost" className="ml-2">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

// ==== Opportunities Page ==== //
export function OpportunitiesPage() {
  const opportunities = [
    {
      id: 1,
      title: "Q3 Widget Order",
      contact: "Jane Doe",
      amount: "$25,000",
      stage: "NEW",
      closeDate: "2025-09-30",
    },
    {
      id: 2,
      title: "Platform Upgrade",
      contact: "John Smith",
      amount: "$75,000",
      stage: "PROPOSAL",
      closeDate: "2025-11-15",
    },
    {
      id: 3,
      title: "Pharma Deal",
      contact: "Alice Johnson",
      amount: "$150,000",
      stage: "NEGOTIATION",
      closeDate: "2025-12-20",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Opportunities" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-2">
              <Input placeholder="Search opportunities..." className="w-64" />
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="default" className="flex items-center gap-2">
              <PlusCircle size={20} />
              New Opportunity
            </Button>
          </div>
          <Card className="rounded-2xl shadow">
            <CardHeader>
              <CardTitle className="text-xl">Opportunity List</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Close Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opportunities.map((opp) => (
                    <TableRow key={opp.id} className="hover:bg-gray-50">
                      <TableCell>{opp.title}</TableCell>
                      <TableCell>{opp.contact}</TableCell>
                      <TableCell>{opp.amount}</TableCell>
                      <TableCell>{opp.stage}</TableCell>
                      <TableCell>{opp.closeDate}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm" variant="ghost" className="ml-2">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

// ==== Activities Page ==== //
export function ActivitiesPage() {
  const activities = [
    {
      id: 1,
      date: "2025-06-01",
      type: "Call",
      contact: "Jane Doe",
      subject: "Follow-up",
      completed: false,
    },
    {
      id: 2,
      date: "2025-05-30",
      type: "Email",
      contact: "John Smith",
      subject: "Proposal sent",
      completed: true,
    },
    {
      id: 3,
      date: "2025-05-28",
      type: "Meeting",
      contact: "Alice Johnson",
      subject: "Demo",
      completed: false,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Activities" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-2">
              <Input placeholder="Search activities..." className="w-64" />
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="default" className="flex items-center gap-2">
              <PlusCircle size={20} />
              New Activity
            </Button>
          </div>
          <Card className="rounded-2xl shadow">
            <CardHeader>
              <CardTitle className="text-xl">Activity Log</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((act) => (
                    <TableRow key={act.id} className="hover:bg-gray-50">
                      <TableCell>{act.date}</TableCell>
                      <TableCell>{act.type}</TableCell>
                      <TableCell>{act.contact}</TableCell>
                      <TableCell>{act.subject}</TableCell>
                      <TableCell>{act.completed ? "Yes" : "No"}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm" variant="ghost" className="ml-2">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

// ==== Settings Page ==== //
export function SettingsPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Settings" />
        <main className="flex-1 overflow-y-auto p-6">
          <Card className="mx-auto mt-10 w-full max-w-xl rounded-2xl shadow">
            <CardHeader>
              <CardTitle className="text-xl">User Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Username</label>
                  <Input
                    defaultValue="current_user"
                    disabled
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <Input defaultValue="user@example.com" className="w-full" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Password</label>
                  <Input
                    type="password"
                    placeholder="New password"
                    className="w-full"
                  />
                </div>
                <div className="pt-4">
                  <Button variant="default" className="w-full">
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default function TestPage() {
  return (
    <div>
      <ContactsPage />
      <CompaniesPage />
      <OpportunitiesPage />
      <ActivitiesPage />
      <SettingsPage />
    </div>
  );
}
