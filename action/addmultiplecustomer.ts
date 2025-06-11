"use server";

import client from "@/db";
import { ActiveStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

type CustomerInput = {
  name: string;
  contact: string;
  address: string;
  activeStatus: ActiveStatus;
  secondContact: string;
};

export async function addMultipleCustomers(customers: CustomerInput[]) {
  let total = customers.length;
  let added = 0;
  let skipped = 0;
  let skippedContacts: string[] = [];

  for (const customer of customers) {
    const { name, contact, address, activeStatus, secondContact } = customer;

    // Trim and normalize contacts
    const mainContact = contact.trim();
    const altContact = secondContact.trim();

    if (!name.trim() || !mainContact || !address.trim()) {
      skipped++;
      skippedContacts.push(mainContact || "(empty)");
      continue;
    }

    // Check for duplicates
    const existing = await client.customer.findFirst({
      where: {
        OR: [
          { contact: mainContact },
          { secondContact: mainContact },
          { contact: altContact },
          { secondContact: altContact }
        ]
      }
    });

    if (existing) {
      skipped++;
      skippedContacts.push(mainContact);
      continue;
    }

    // Save if not duplicate
    try {
      await client.customer.create({
        data: {
          name: name.trim(),
          contact: mainContact,
          address: address.trim(),
          activeStatus,
          secondContact: altContact === "" ? null : altContact
        }
      });

      added++;
    } catch (e) {
      skipped++;
      skippedContacts.push(mainContact);
    }
  }

  revalidatePath("/dashboard/customers");
  revalidatePath("/dashboard");

  return {
    message: `${added} out of ${total} customers were added successfully.`,
    added,
    skipped,
    skippedContacts
  };
}
