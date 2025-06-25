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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CalendarIcon,
  EditIcon,
  UserIcon,
  MailIcon,
  ShieldIcon,
  ClockIcon,
} from "lucide-react";
import { format } from "date-fns";

const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function AccountPage() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to update user profile
      console.log("Update profile:", data);

      // For now, just simulate success
      setTimeout(() => {
        setIsEditing(false);
        setIsLoading(false);
        // Refresh user data after update
        refreshUser();
      }, 1000);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset({
      username: user?.username || "",
      email: user?.email || "",
    });
    setIsEditing(false);
  };

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
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <EditIcon className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
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

            {isEditing ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex space-x-2">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
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
            )}
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
