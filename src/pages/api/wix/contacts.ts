import { contacts } from "@wix/crm";

export async function GET() {
  try {
    const result = await contacts.queryContacts().find();

    return new Response(JSON.stringify(result, null, 2), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify(
        {
          message: error?.message,
          error,
        },
        null,
        2,
      ),
      {
        status: 500,
      },
    );
  }
}
