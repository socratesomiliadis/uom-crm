"use server";

import { OpportunityCreateDto, OpportunityDto } from "./types";
import { fetchDirect } from "./utils";
import { TAGS } from "@/lib/constants";
import { revalidateTag } from "next/cache";

export async function getOpportunities() {
  try {
    const opportunities = await fetchDirect<OpportunityDto[]>(
      "/opportunities",
      {
        method: "GET",
      },
      TAGS.OPPORTUNITY
    );

    return opportunities;
  } catch (error) {
    console.error(error);
  }
}

export async function createOpportunity(opportunity: OpportunityCreateDto) {
  await fetchDirect(
    "/opportunities",
    {
      method: "POST",
      body: JSON.stringify(opportunity),
    },
    TAGS.OPPORTUNITY
  );

  revalidateTag(TAGS.OPPORTUNITY);
}

export async function updateOpportunity(
  id: number,
  opportunity: OpportunityCreateDto
) {
  await fetchDirect(
    `/opportunities/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(opportunity),
    },
    TAGS.OPPORTUNITY
  );

  revalidateTag(TAGS.OPPORTUNITY);
}

export async function deleteOpportunity(id: number) {
  try {
    await fetchDirect(
      `/opportunities/${id}`,
      {
        method: "DELETE",
      },
      TAGS.OPPORTUNITY
    );
  } catch (error) {
    console.error(error);
  }

  revalidateTag(TAGS.OPPORTUNITY);
}
