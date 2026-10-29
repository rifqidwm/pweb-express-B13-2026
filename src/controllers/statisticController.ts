// src/controllers/statisticController.ts (Orang A)
// Referensi modul: 15 (count, aggregate, groupBy), 13.2 (getPostStats + Promise.all)
import type { Request, Response } from "express";
import prisma from "../config/prisma";
import { HttpError } from "../utils/http-error";
import { sendSuccess } from "../utils/response";

// GET /api/statistics
export const getStatistics = async (req: Request, res: Response) => {
  // TODO:
  // - totalPlayers      : prisma.player.count()
  // - totalHeroesOwned  : prisma.playerHero.count()
  // - totalDiamond      : prisma.player.aggregate({ _sum: { diamond: true } })
  // - mostOwnedHero     : playerHero.groupBy by heroId, orderBy _count desc, take 1,
  //                       lalu ambil nama hero-nya + jumlah pemilik
  // - heroesPerRole     : hero.groupBy by role, _count
  // Jalankan yang tidak saling bergantung dengan Promise.all
  throw new HttpError(501, "getStatistics belum diimplementasikan");
};
