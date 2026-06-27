// import { contacts } from "@wix/crm";

// export default contacts.onContactCreated(async (event) => {
//   try {
//     const contact = event.entity;

//     const email =
//       contact?.primaryInfo?.email || contact?.info?.emails?.items?.[0]?.email;

//     const firstName = contact?.info?.name?.first || "";

//     const lastName = contact?.info?.name?.last || "";

//     const phone = contact?.info?.phones?.items?.[0]?.phone || "";

//     console.log("Wix Contact Created");

//     console.log({
//       firstName,
//       lastName,
//       email,
//       phone,
//     });

//     const response = await fetch("http://localhost:5001/api/forms/submit", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         firstName,
//         lastName,
//         email,
//         phone,

//         utm_source: "wix_form",
//         utm_medium: "website",
//         utm_campaign: "wix_submission",

//         pageUrl: "",
//         referrer: "",
//       }),
//     });

//     const result = await response.json();

//     console.log("HubSpot Sync Result:", result);
//   } catch (error) {
//     console.error("Wix Contact Sync Error:", error);
//   }
// });
import { contacts } from "@wix/crm";

console.log("EVENT FILE LOADED");

export default contacts.onContactUpdated(async (event) => {
  console.log("CONTACT UPDATED EVENT FIRED");
  console.log(JSON.stringify(event, null, 2));
});
