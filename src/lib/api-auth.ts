import prisma from './prisma';

export async function validateApiKey(apiKey: string | null): Promise<boolean> {
  if (!apiKey) return false;

  try {
    const key = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      select: { isActive: true, id: true },
    });

    if (!key || !key.isActive) return false;

    // Fire-and-forget update of lastUsed
    prisma.apiKey
      .update({
        where: { id: key.id },
        data: { lastUsed: new Date() },
      })
      .catch(() => {
        // Silently ignore update errors
      });

    return true;
  } catch {
    return false;
  }
}
