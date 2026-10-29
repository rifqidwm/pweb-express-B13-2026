// src/controllers/playerController.ts (Orang C)
// Referensi modul: 13.1 (CRUD userController), 16.2 (increment)
import type { Request, Response } from "express";
import prisma from "../config/prisma";
import { HttpError } from "../utils/http-error";
import { parseId } from "../utils/parse";
import { sendSuccess } from "../utils/response";

// POST /api/players  body: { nickname }
export const createPlayer = async (req: Request, res: Response) => {
  // TODO:
  // 1. nickname kosong -> 400
  // 2. nickname sudah dipakai -> 409
  // 3. create (bp & diamond dari default schema) -> 201
  throw new HttpError(501, "createPlayer belum diimplementasikan");
};

// GET /api/players/:player_id
export const getPlayerById = async (req: Request, res: Response) => {
  // TODO:
  // - parseId(req.params.player_id)
  // - findUnique + include heroes (PlayerHero) beserta data hero-nya
  // - tidak ada -> 404
  throw new HttpError(501, "getPlayerById belum diimplementasikan");
};

// PATCH /api/players/:player_id  body: { nickname }
export const updatePlayer = async (req: Request, res: Response) => {
  // TODO (urutan soal, BEDA dengan updateUser di modul, jadi cek manual):
  // 1. player tidak ada (findUnique) -> 404
  // 2. nickname kosong -> 400
  // 3. nickname sudah dipakai player LAIN -> 409
  // 4. update -> 200
  throw new HttpError(501, "updatePlayer belum diimplementasikan");
};

// DELETE /api/players/:player_id
export const deletePlayer = async (req: Request, res: Response) => {
  // TODO:
  // - prisma.player.delete; jika tidak ada, P2025 -> 404 (errorHandler)
  // - PlayerHero ikut terhapus karena onDelete: Cascade
  throw new HttpError(501, "deletePlayer belum diimplementasikan");
};

// POST /api/players/:player_id/topup  body: { amount }
export const topUpDiamond = async (req: Request, res: Response) => {
  // TODO:
  // 1. amount bukan bilangan bulat > 0 -> 400 (Number.isInteger)
  // 2. player tidak ada -> 404
  // 3. update diamond: { increment: amount } -> 200 + saldo diamond terbaru
  throw new HttpError(501, "topUpDiamond belum diimplementasikan");
};

// POST /api/players/:player_id/matches  body: { result: "WIN" | "LOSE" }
export const playMatch = async (req: Request, res: Response) => {
  // TODO:
  // 1. result bukan WIN/LOSE -> 400
  // 2. player tidak ada -> 404
  // 3. update bp: { increment: WIN 300 / LOSE 100 } -> 200 + BP didapat + saldo BP terbaru
  throw new HttpError(501, "playMatch belum diimplementasikan");
};
