"use client";

import { useAuth } from "@/lib/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

import {
  CalendarIcon,
  EditIcon,
  UserIcon,
  MailIcon,
  ShieldIcon,
  ClockIcon,
} from "lucide-react";

export default function AccountPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Information Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-xl">Profile Information</CardTitle>
              <CardDescription>
                Your personal account details and information.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg">
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">{user.username}</h3>
                <Badge variant="secondary" className="flex items-center w-fit">
                  <ShieldIcon className="h-3 w-3 mr-1" />
                  {user.role}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center text-sm font-medium text-muted-foreground">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Username
                </Label>
                <p className="text-sm">{user.username}</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center text-sm font-medium text-muted-foreground">
                  <MailIcon className="h-4 w-4 mr-2" />
                  Email Address
                </Label>
                <p className="text-sm">{user.email}</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center text-sm font-medium text-muted-foreground">
                  <ShieldIcon className="h-4 w-4 mr-2" />
                  Role
                </Label>
                <p className="text-sm">{user.role}</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center text-sm font-medium text-muted-foreground">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Member Since
                </Label>
                <p className="text-sm">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {user.lastLoginAt && (
                <div className="space-y-2">
                  <Label className="flex items-center text-sm font-medium text-muted-foreground">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Last Login
                  </Label>
                  <p className="text-sm">
                    {new Date(user.lastLoginAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    at{" "}
                    {new Date(user.lastLoginAt).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Statistics Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Account Statistics</CardTitle>
            <CardDescription>
              Your activity and usage statistics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Account ID
                </Label>
                <p className="text-sm font-mono">#{user.id}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Account Type
                </Label>
                <p className="text-sm">Standard</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Status
                </Label>
                <Badge variant="default" className="w-fit">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
