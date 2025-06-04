"use server";

import { ActivityCreateDto, ActivityDto } from "./types";
import { fetchDirect } from "./utils";
import { TAGS } from "@/lib/constants";
import { revalidateTag } from "next/cache";

export async function getActivities() {
  try {
    const activities = await fetchDirect<ActivityDto[]>(
      "/activities",
      {
        method: "GET",
      },
      TAGS.ACTIVITY
    );

    return activities;
  } catch (error) {
    console.error(error);
  }
}

export async function createActivity(activity: ActivityCreateDto) {
  await fetchDirect(
    "/activities",
    {
      method: "POST",
      body: JSON.stringify(activity),
    },
    TAGS.ACTIVITY
  );

  revalidateTag(TAGS.ACTIVITY);
}

export async function updateActivity(id: number, activity: ActivityCreateDto) {
  await fetchDirect(
    `/activities/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(activity),
    },
    TAGS.ACTIVITY
  );

  revalidateTag(TAGS.ACTIVITY);
}

export async function deleteActivity(id: number) {
  try {
    await fetchDirect(
      `/activities/${id}`,
      {
        method: "DELETE",
      },
      TAGS.ACTIVITY
    );
  } catch (error) {
    console.error(error);
  }

  revalidateTag(TAGS.ACTIVITY);
}
