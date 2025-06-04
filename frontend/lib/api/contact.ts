"use server";

import { ContactCreateDto, ContactDto } from "./types";
import { fetchDirect } from "./utils";
import { TAGS } from "@/lib/constants";
import { revalidateTag } from "next/cache";

export async function getContacts() {
  try {
    const contacts = await fetchDirect<ContactDto[]>(
      "/contacts",
      {
        method: "GET",
      },
      TAGS.CONTACT
    );

    return contacts;
  } catch (error) {
    console.error(error);
  }
}

export async function getContactById(id: number) {
  try {
    const contact = await fetchDirect<ContactDto>(
      `/contacts/${id}`,
      {
        method: "GET",
      },
      TAGS.CONTACT
    );

    return contact;
  } catch (error) {
    console.error(error);
  }
}

export async function createContact(contact: ContactCreateDto) {
  await fetchDirect(
    "/contacts",
    {
      method: "POST",
      body: JSON.stringify(contact),
    },
    TAGS.CONTACT
  );

  revalidateTag(TAGS.CONTACT);
}

export async function updateContact(id: number, contact: ContactCreateDto) {
  await fetchDirect(
    `/contacts/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(contact),
    },
    TAGS.CONTACT
  );

  revalidateTag(TAGS.CONTACT);
}

export async function deleteContact(id: number) {
  try {
    await fetchDirect(
      `/contacts/${id}`,
      {
        method: "DELETE",
      },
      TAGS.CONTACT
    );
  } catch (error) {
    console.error(error);
  }

  revalidateTag(TAGS.CONTACT);
}
