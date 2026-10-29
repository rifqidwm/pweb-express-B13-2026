// src/controllers/skinController.ts (Orang B)
// Referensi modul: 13.2 (include relasi), 14 (filtering & pagination)
import type { Request, Response } from "express";
import prisma from "../config/prisma";
import { HttpError } from "../utils/http-error";
import { parseId } from "../utils/parse";
import { sendSuccess } from "../utils/response";

// GET /api/skins?page=1&limit=10&heroId=18&rarity=GRAND
export const getAllSkins = async (req: Request, res: Response) => {
  // TODO:
  // - page default 1, limit default 10
  // - heroId: filter skin milik hero tersebut (ubah ke Number)
  // - rarity: filter rarity (nilai enum, contoh GRAND)
  // - include: { hero: { select: { id: true, name: true } } }
  // - prisma.$transaction([findMany, count]) dengan where yang SAMA + metadata
  throw new HttpError(501, "getAllSkins belum diimplementasikan");
};

// GET /api/skins/:skin_id
export const getSkinById = async (req: Request, res: Response) => {
  // TODO:
  // - parseId(req.params.skin_id)
  // - findUnique + include: { hero: true }
  // - tidak ada -> 404
  throw new HttpError(501, "getSkinById belum diimplementasikan");
};
