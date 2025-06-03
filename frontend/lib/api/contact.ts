"use server";

import { ContactCreateDto } from "./types";
import { fetchDirect } from "./utils";

export async function getContacts() {
  try {
    const contacts = await fetchDirect("/contacts", {
      method: "GET",
    });

    return contacts;
  } catch (error) {
    console.error(error);
  }
}

export async function createContact(contact: ContactCreateDto) {
  try {
    await fetchDirect("/contacts", {
      method: "POST",
      body: JSON.stringify(contact),
    });
  } catch (error) {
    console.error(error);
  }
}
