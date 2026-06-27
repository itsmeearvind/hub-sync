import type { APIRoute } from "astro";
import axios from "axios";

import { submittedContact } from "@wix/crm";

import prisma from "../../../lib/prisma";
import { getValidAccessToken } from "../../../lib/hubspot";

export const POST: APIRoute = async ({ request }) => {
  try {
    const events = await request.json();

    const integration = await prisma.integration.findFirst();

    if (!integration) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "HubSpot not connected",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const accessToken = await getValidAccessToken();

    console.log("HubSpot Webhook Received:", JSON.stringify(events, null, 2));

    for (const event of events) {
      const syncId =
        Date.now().toString() + "-" + Math.random().toString(36).slice(2);

      const hubspotContactId = String(event.objectId);

      const mapping = await prisma.contactMapping.findFirst({
        where: {
          hubspotContactId,
        },
      });

      if (!mapping) {
        console.log(`No mapping found for HubSpot Contact ${hubspotContactId}`);
        continue;
      }

      /*
      |--------------------------------------------------------------------------
      | LOOP PREVENTION
      |--------------------------------------------------------------------------
      */

      if (
        mapping.lastSyncSource === "wix" &&
        mapping.lastSyncAt &&
        Date.now() - new Date(mapping.lastSyncAt).getTime() < 30000
      ) {
        console.log(`Skipped loop for ${hubspotContactId}`);
        continue;
      }

      /*
      |--------------------------------------------------------------------------
      | FETCH HUBSPOT CONTACT
      |--------------------------------------------------------------------------
      */

      const contactResponse = await axios.get(
        `https://api.hubapi.com/crm/v3/objects/contacts/${hubspotContactId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const hubspotContact = contactResponse.data.properties || {};

      /*
      |--------------------------------------------------------------------------
      | FIELD MAPPINGS
      |--------------------------------------------------------------------------
      */

      const fieldMappings = await prisma.fieldMapping.findMany({
        where: {
          integrationId: integration.id,
        },
      });

      const wixPayload: Record<string, any> = {};

      for (const fieldMapping of fieldMappings) {
        wixPayload[fieldMapping.wixField] =
          hubspotContact[fieldMapping.hubspotProperty];
      }

      console.log("Prepared Wix Payload:", JSON.stringify(wixPayload, null, 2));

      /*
      |--------------------------------------------------------------------------
      | CREATE / UPDATE WIX CONTACT
      |--------------------------------------------------------------------------
      */

      const wixResult = await submittedContact.appendOrCreateContact({
        info: {
          name: {
            first: wixPayload.firstName || "",
            last: wixPayload.lastName || "",
          },

          emails: {
            items: wixPayload.email
              ? [
                  {
                    email: wixPayload.email,
                  },
                ]
              : [],
          },

          phones: {
            items: wixPayload.phone
              ? [
                  {
                    phone: wixPayload.phone,
                  },
                ]
              : [],
          },
        },
      });

      console.log("WIX CONTACT UPDATED:", JSON.stringify(wixResult, null, 2));

      /*
      |--------------------------------------------------------------------------
      | UPDATE MAPPING
      |--------------------------------------------------------------------------
      */

      await prisma.contactMapping.update({
        where: {
          id: mapping.id,
        },
        data: {
          lastSyncSource: "hubspot",
          lastSyncAt: new Date(),
        },
      });

      /*
      |--------------------------------------------------------------------------
      | SYNC LOG
      |--------------------------------------------------------------------------
      */

      await prisma.syncLog.create({
        data: {
          id: Date.now().toString() + "-" + Math.random().toString(36).slice(2),
          integrationId: integration.id,
          syncId,
          source: "hubspot",
          action: "update",
          status: "success",
        },
      });

      console.log(`Wix contact synced successfully: ${mapping.wixContactId}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error: any) {
    console.error("WEBHOOK ERROR");
    console.error(error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error?.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
