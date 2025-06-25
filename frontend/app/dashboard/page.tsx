import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Building2,
  Target,
  Activity,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { getCompanies } from "@/lib/api/company";
import { getContacts } from "@/lib/api/contact";
import { getOpportunities } from "@/lib/api/opportunity";
import { getActivities } from "@/lib/api/activity";
import { ScrollArea } from "@/components/ui/scroll-area";

// Stats Cards Component
async function StatsCards() {
  const [companies, contacts, opportunities, activities] = await Promise.all([
    getCompanies(),
    getContacts(),
    getOpportunities(),
    getActivities(),
  ]);

  const totalRevenue =
    opportunities?.reduce((sum, opp) => {
      if (opp.stage === "WON") {
        return sum + parseFloat(opp.amount);
      }
      return sum;
    }, 0) || 0;

  const pipelineValue =
    opportunities?.reduce((sum, opp) => {
      if (opp.stage !== "WON" && opp.stage !== "LOST") {
        return sum + parseFloat(opp.amount);
      }
      return sum;
    }, 0) || 0;

  const completedActivities =
    activities?.filter((activity) => activity.completed).length || 0;
  const totalActivities = activities?.length || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalRevenue.toLocaleString()} €
          </div>
          <p className="text-xs text-muted-foreground">
            From {opportunities?.filter((o) => o.stage === "WON").length || 0}{" "}
            won deals
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Pipeline Value</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {pipelineValue.toLocaleString()} €
          </div>
          <p className="text-xs text-muted-foreground">
            From{" "}
            {opportunities?.filter(
              (o) => o.stage !== "WON" && o.stage !== "LOST"
            ).length || 0}{" "}
            active deals
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Active Companies</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{companies?.length || 0}</div>
          <p className="text-xs text-muted-foreground">
            {contacts?.length || 0} contacts total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Activity Rate</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalActivities > 0
              ? Math.round((completedActivities / totalActivities) * 100)
              : 0}
            %
          </div>
          <p className="text-xs text-muted-foreground">
            {completedActivities} of {totalActivities} completed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Opportunities Pipeline Chart Component
async function OpportunitiesPipeline() {
  const opportunities = await getOpportunities();

  if (!opportunities) return null;

  const pipelineData = opportunities.reduce((acc, opp) => {
    acc[opp.stage] = (acc[opp.stage] || 0) + parseFloat(opp.amount);
    return acc;
  }, {} as Record<string, number>);

  const stages = ["NEW", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"];
  const stageColors = {
    NEW: "bg-blue-500",
    QUALIFIED: "bg-yellow-500",
    PROPOSAL: "bg-orange-500",
    NEGOTIATION: "bg-purple-500",
    WON: "bg-green-500",
    LOST: "bg-red-500",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5" />
          Sales Pipeline
        </CardTitle>
        <CardDescription>Opportunities by stage and value</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stages.map((stage) => {
            const value = pipelineData[stage] || 0;
            const count = opportunities.filter((o) => o.stage === stage).length;
            return (
              <div key={stage} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      stageColors[stage as keyof typeof stageColors]
                    }`}
                  />
                  <span className="font-medium">{stage}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
                <span className="font-semibold">
                  {value.toLocaleString()} €
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Recent Activities Component
async function RecentActivities() {
  const activities = await getActivities();

  if (!activities) return null;

  const recentActivities = activities
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10);

  const activityIcons = {
    CALL: "📞",
    EMAIL: "✉️",
    MEETING: "👥",
    NOTE: "📝",
    TASK: "✅",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5" />
          Recent Activities
        </CardTitle>
        <CardDescription>
          Latest customer interactions and tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <ScrollArea className="h-84 px-6" type="always">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 my-2 rounded-lg border"
            >
              <span className="text-lg">{activityIcons[activity.type]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{activity.type}</span>
                  {activity.completed && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {activity.subject || activity.description || "No description"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(activity.activityDate).toLocaleDateString("el-GR")}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Companies Table Component
async function CompaniesTable() {
  const companies = await getCompanies();

  if (!companies) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5" />
          Companies Overview
        </CardTitle>
        <CardDescription>All registered companies in your CRM</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-40 px-6 overflow-x-auto" type="always">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">Company</th>
                <th className="text-left p-2 font-medium">Industry</th>
                <th className="text-left p-2 font-medium">Location</th>
                <th className="text-left p-2 font-medium">Website</th>
                <th className="text-left p-2 font-medium">Added</th>
              </tr>
            </thead>
            <tbody>
              {companies.slice(0, 10).map((company) => (
                <tr key={company.id} className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">{company.name}</td>
                  <td className="p-2 text-muted-foreground">
                    {company.industry || "N/A"}
                  </td>
                  <td className="p-2 text-muted-foreground">
                    {[company.city, company.state, company.country]
                      .filter(Boolean)
                      .join(", ") || "N/A"}
                  </td>
                  <td className="p-2">
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Visit
                      </a>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </td>
                  <td className="p-2 text-muted-foreground text-sm">
                    {new Date(company.createdAt).toLocaleDateString("el-GR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Loading Skeleton Component
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px] mb-2" />
              <Skeleton className="h-3 w-[160px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 p-3 border rounded-lg">
                  <Skeleton className="h-6 w-6 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-[120px] mb-1" />
                    <Skeleton className="h-3 w-[180px] mb-1" />
                    <Skeleton className="h-3 w-[80px]" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-4 w-[200px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[140px]" />
                <Skeleton className="h-4 w-[60px]" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Dashboard Page
export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-0">
      <Suspense fallback={<DashboardSkeleton />}>
        <div className="space-y-6">
          <StatsCards />

          <div className="grid gap-6 md:grid-cols-2">
            <OpportunitiesPipeline />
            <RecentActivities />
          </div>

          <CompaniesTable />
        </div>
      </Suspense>
    </div>
  );
}
