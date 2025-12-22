import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Marketplace } from "@/app/features/marketplace";

export default async function MarketplacePage() {
  const session = await auth();

  let userProfile = null;
  if (session?.user?.id) {
    userProfile = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        discord_username: true,
        embark_id: true,
      },
    });
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">السوق</h1>
          <p className="text-muted-foreground">
            قم بشراء وبيع العناصر مع لاعبين آخرين
          </p>
        </div>
        <Marketplace session={session} userProfile={userProfile} />
      </div>
    </main>
  );
}
