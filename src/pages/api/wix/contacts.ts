import type { APIRoute } from "astro";
import { submittedContact } from "@wix/crm";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    console.log("WIX CONTACT REQUEST");
    console.log(JSON.stringify(body, null, 2));

    const result = await submittedContact.appendOrCreateContact({
      info: {
        name: {
          first: body.firstName || "",
          last: body.lastName || "",
        },

        emails: {
          items: body.email
            ? [
                {
                  email: body.email,
                },
              ]
            : [],
        },

        phones: {
          items: body.phone
            ? [
                {
                  phone: body.phone,
                },
              ]
            : [],
        },
      },
    });

    console.log("WIX CONTACT CREATED");
    console.log(JSON.stringify(result, null, 2));

    return new Response(
      JSON.stringify({
        success: true,
        result,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error: any) {
    console.error("WIX CONTACT ERROR");
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

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      success: true,
      route: "working",
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
