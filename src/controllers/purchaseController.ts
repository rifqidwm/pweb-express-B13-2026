// src/controllers/purchaseController.ts (Orang A)
// Referensi modul: 16.3 ($transaction bentuk array), 16.2 (decrement)
import type { Request, Response } from "express";
import prisma from "../config/prisma";
import { HttpError } from "../utils/http-error";
import { parseId } from "../utils/parse";
import { sendSuccess } from "../utils/response";

// POST /api/players/:player_id/heroes  body: { heroId, currency: "BP" | "DIAMOND" }
export const buyHero = async (req: Request, res: Response) => {
  // TODO (periksa berurutan, berhenti di yang pertama gagal):
  // 1. heroId kosong, atau currency bukan BP/DIAMOND -> 400
  // 2. player tidak ditemukan -> 404
  // 3. hero tidak ditemukan -> 404
  // 4. harga hero untuk currency itu null -> 400 (contoh: Freya tanpa harga BP)
  // 5. player sudah punya hero (findUnique playerId_heroId) -> 409
  // 6. saldo kurang dari harga -> 400
  // Simpan: prisma.$transaction([
  //   player.update (bp/diamond: { decrement: harga }),
  //   playerHero.create (currency, pricePaid),
  // ])
  // Response 201: hero yang dibeli, currency, harga, saldo BP & Diamond terbaru
  throw new HttpError(501, "buyHero belum diimplementasikan");
};
