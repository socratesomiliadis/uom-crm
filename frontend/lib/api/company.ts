"use server";

import { CompanyCreateDto, CompanyDto } from "./types";
import { fetchDirect } from "./utils";
import { revalidateTag } from "next/cache";
import { TAGS } from "@/lib/constants";
export async function getCompanies() {
  try {
    const companies = await fetchDirect<CompanyDto[]>("/companies", {
      method: "GET",
    });

    return companies;
  } catch (error) {
    console.error(error);
  }
}

export async function getCompanyById(id: number) {
  try {
    const company = await fetchDirect<CompanyDto>(
      `/companies/${id}`,
      {
        method: "GET",
      },
      TAGS.COMPANY
    );

    return company;
  } catch (error) {
    console.error(error);
  }
}

export async function createCompany(company: CompanyCreateDto) {
  try {
    await fetchDirect(
      "/companies",
      {
        method: "POST",
        body: JSON.stringify(company),
      },
      TAGS.COMPANY
    );
  } catch (error) {
    console.error(error);
  }
  revalidateTag(TAGS.COMPANY);
}

export async function updateCompany(id: number, company: CompanyCreateDto) {
  try {
    await fetchDirect(
      `/companies/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(company),
      },
      TAGS.COMPANY
    );
  } catch (error) {
    console.error(error);
  }
  revalidateTag(TAGS.COMPANY);
}

export async function deleteCompany(id: number) {
  try {
    await fetchDirect(
      `/companies/${id}`,
      {
        method: "DELETE",
      },
      TAGS.COMPANY
    );
  } catch (error) {
    console.error(error);
  }

  revalidateTag(TAGS.COMPANY);
}
