import type { APIRoute } from "astro";
import axios from "axios";

import prisma from "../../../lib/prisma";
import { getValidAccessToken } from "../../../lib/hubspot";

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.json();

    console.log("FORM PAYLOAD:");
    console.log(JSON.stringify(formData, null, 2));

    const accessToken = await getValidAccessToken();

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

    const properties: Record<string, any> = {};

    /*
    |--------------------------------------------------------------------------
    | Dynamic Field Mapping
    |--------------------------------------------------------------------------
    */

    const mappings = await prisma.fieldMapping.findMany();

    for (const mapping of mappings) {
      const value = formData[mapping.wixField];

      if (value !== undefined && value !== null && value !== "") {
        properties[mapping.hubspotProperty] = value;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Auto Detect Common Fields
    |--------------------------------------------------------------------------
    */

    for (const [key, value] of Object.entries(formData)) {
      if (!value) continue;

      const lowerKey = key.toLowerCase();

      if (lowerKey.includes("email") && !properties.email) {
        properties.email = value;
      }

      if (
        (lowerKey.includes("first") || lowerKey.includes("firstname")) &&
        !properties.firstname
      ) {
        properties.firstname = value;
      }

      if (
        (lowerKey.includes("last") || lowerKey.includes("lastname")) &&
        !properties.lastname
      ) {
        properties.lastname = value;
      }

      if (lowerKey.includes("phone") && !properties.phone) {
        properties.phone = value;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    if (!properties.email) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email field not found",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    properties.lead_timestamp = new Date().toISOString();

    console.log("Mapped HubSpot Properties:");
    console.log(JSON.stringify(properties, null, 2));

    /*
    |--------------------------------------------------------------------------
    | Create HubSpot Contact
    |--------------------------------------------------------------------------
    */

    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        properties,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    /*
    |--------------------------------------------------------------------------
    | Create Contact Mapping
    |--------------------------------------------------------------------------
    */

    await prisma.contactMapping.create({
      data: {
        integrationId: integration.id,
        wixContactId: `wix-${Date.now()}`,
        hubspotContactId: String(response.data.id),
        lastSyncSource: "wix",
        lastSyncAt: new Date(),
      },
    });

    console.log(`Mapping Created: Wix -> ${response.data.id}`);

    /*
    |--------------------------------------------------------------------------
    | Sync Log
    |--------------------------------------------------------------------------
    */

    const uniqueId =
      Date.now().toString() + "-" + Math.random().toString(36).substring(2, 10);

    const syncId =
      Date.now().toString() + "-" + Math.random().toString(36).substring(2, 10);

    await prisma.syncLog.create({
      data: {
        id: uniqueId,
        integrationId: integration.id,
        syncId,
        source: "form",
        action: "lead_capture",
        status: "success",
        payloadHash: JSON.stringify(formData),
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        contactId: response.data.id,
        mappedProperties: properties,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error: any) {
    console.error("HUBSPOT ERROR:", error.response?.data || error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
        details: error.response?.data,
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
