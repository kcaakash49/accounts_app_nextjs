import { NextRequest, NextResponse } from "next/server";
import client from "@/db";
import { ActiveStatus } from "@prisma/client";

type CustomerInput = {
  name: string;
  contact: string;
  address: string;
  activeStatus: ActiveStatus;
  secondContact: string;
};

export async function POST(req: NextRequest) {
  try {
    const customers: CustomerInput[] = await req.json();

    let total = customers.length;
    let added = 0;
    let skipped = 0;
    let skippedContacts: string[] = [];

    for (const customer of customers) {
      const { name, contact, address, activeStatus, secondContact } = customer;

      const mainContact = contact.trim();
      const altContact = secondContact.trim();

      if (!name.trim() || !mainContact || !address.trim()) {
        skipped++;
        skippedContacts.push(mainContact || "(empty)");
        continue;
      }

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

    return NextResponse.json({
      message: `${added} out of ${total} customers were added successfully.`,
      added,
      skipped,
      skippedContacts
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request", details: error },
      { status: 500 }
    );
  }
}
