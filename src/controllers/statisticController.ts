import type { Request, Response } from "express";
import prisma from "../config/prisma";

// GET /api/statistics
export const getStatistics = async (_req: Request, res: Response) => {
  const [totalPlayers, totalHeroesOwned, diamondSum, topOwned, roleGroups] =
    await Promise.all([
      prisma.player.count(),
      prisma.playerHero.count(),
      prisma.player.aggregate({ _sum: { diamond: true } }),
      // Hero paling banyak dimiliki; heroId asc sebagai pemecah seri supaya hasil stabil
      prisma.playerHero.groupBy({
        by: ["heroId"],
        _count: { heroId: true },
        orderBy: [{ _count: { heroId: "desc" } }, { heroId: "asc" }],
        take: 1,
      }),
      prisma.hero.groupBy({
        by: ["role"],
        _count: { role: true },
        orderBy: [{ _count: { role: "desc" } }, { role: "asc" }],
      }),
    ]);

  let mostOwnedHero: { heroId: number; name: string; owners: number } | null = null;
  if (topOwned.length > 0) {
    const top = topOwned[0];
    const hero = await prisma.hero.findUnique({ where: { id: top.heroId } });
    mostOwnedHero = {
      heroId: top.heroId,
      name: hero?.name ?? "Unknown",
      owners: top._count.heroId,
    };
  }

  res.status(200).json({
    status: true,
    message: "Berhasil mengambil statistik",
    data: {
      totalPlayers,
      totalHeroesOwned,
      totalDiamond: diamondSum._sum.diamond ?? 0,
      mostOwnedHero,
      heroesPerRole: roleGroups.map((r) => ({ role: r.role, total: r._count.role })),
    },
  });
};
