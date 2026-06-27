import prisma from "../lib/prisma";

export async function createContactMapping(
  integrationId: string,
  wixContactId: string,
  hubspotContactId: string,
  source: "wix" | "hubspot",
) {
  return prisma.contactMapping.create({
    data: {
      integrationId,
      wixContactId,
      hubspotContactId,
      lastSyncSource: source,
      lastSyncAt: new Date(),
    },
  });
}

export async function updateSyncSource(
  mappingId: string,
  source: "wix" | "hubspot",
) {
  return prisma.contactMapping.update({
    where: {
      id: mappingId,
    },
    data: {
      lastSyncSource: source,
      lastSyncAt: new Date(),
    },
  });
}

export async function createSyncLog(
  integrationId: string,
  source: string,
  action: string,
  status: string,
  payloadHash?: string,
) {
  return prisma.syncLog.create({
    data: {
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substring(2, 10),

      syncId:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substring(2, 10),

      integrationId,
      source,
      action,
      status,
      payloadHash,
    },
  });
}
