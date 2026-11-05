import type { Request, Response } from "express";
import prisma from "../config/prisma";
import { HttpError } from "../utils/http-error";

type Currency = "BP" | "DIAMOND";

const isCurrency = (value: unknown): value is Currency =>
  value === "BP" || value === "DIAMOND";

// POST /api/players/:player_id/heroes
// Express 5 meneruskan error dari handler async ke errorHandler secara otomatis,
// jadi cukup `throw new HttpError(...)`.
export const buyHero = async (req: Request, res: Response) => {
  const body = req.body ?? {};
  const { heroId, currency } = body as { heroId?: unknown; currency?: unknown };
  const playerId = Number(req.params.player_id);

  // 1. heroId kosong, atau currency bukan BP/DIAMOND -> 400
  if (
    heroId === undefined ||
    heroId === null ||
    heroId === "" ||
    !Number.isInteger(Number(heroId)) ||
    !isCurrency(currency)
  ) {
    throw new HttpError(400, "heroId wajib diisi dan currency harus BP atau DIAMOND");
  }
  const heroIdNum = Number(heroId);

  // 2. Player tidak ditemukan -> 404
  const player = Number.isInteger(playerId)
    ? await prisma.player.findUnique({ where: { id: playerId } })
    : null;
  if (!player) {
    throw new HttpError(404, "Player tidak ditemukan");
  }

  // 3. Hero tidak ditemukan -> 404
  const hero = await prisma.hero.findUnique({ where: { id: heroIdNum } });
  if (!hero) {
    throw new HttpError(404, "Hero tidak ditemukan");
  }

  // 4. Harga hero untuk currency tersebut kosong -> 400
  const price = currency === "BP" ? hero.priceBP : hero.priceDiamond;
  if (price === null || price === undefined) {
    throw new HttpError(400, `Hero ${hero.name} tidak bisa dibeli dengan ${currency}`);
  }

  // 5. Player sudah memiliki hero tersebut -> 409
  const owned = await prisma.playerHero.findUnique({
    where: { playerId_heroId: { playerId: player.id, heroId: hero.id } },
  });
  if (owned) {
    throw new HttpError(409, `Player sudah memiliki hero ${hero.name}`);
  }

  // 6. Saldo kurang dari harga -> 400
  const balance = currency === "BP" ? player.bp : player.diamond;
  if (balance < price) {
    throw new HttpError(400, `Saldo ${currency} tidak cukup untuk membeli hero ${hero.name}`);
  }

  // Simpan dengan transaction: kurangi saldo + catat kepemilikan, berhasil/gagal bersama.
  const [updatedPlayer] = await prisma.$transaction([
    prisma.player.update({
      where: { id: player.id },
      data:
        currency === "BP"
          ? { bp: { decrement: price } }
          : { diamond: { decrement: price } },
    }),
    prisma.playerHero.create({
      data: {
        playerId: player.id,
        heroId: hero.id,
        currency,
        pricePaid: price,
      },
    }),
  ]);

  res.status(201).json({
    status: true,
    message: "Hero berhasil dibeli",
    data: {
      hero: { id: hero.id, name: hero.name },
      currency,
      pricePaid: price,
      balance: { bp: updatedPlayer.bp, diamond: updatedPlayer.diamond },
    },
  });
};
