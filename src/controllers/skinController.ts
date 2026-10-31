// src/controllers/skinController.ts (Orang B)
// Referensi modul: 13.2 (include relasi), 14 (filtering & pagination)
import type { Request, Response } from "express";
import prisma from "../config/prisma";
import type { Rarity } from "../generated/prisma/client";
import { HttpError } from "../utils/http-error";
import { parseId } from "../utils/parse";
import { sendSuccess } from "../utils/response";

const SKIN_RARITIES = [
  "COMMON",
  "EXCEPTIONAL",
  "DELUXE",
  "EXQUISITE",
  "GRAND",
  "SUPREME",
] as const;

const parsePositiveQueryInteger = (value: unknown, fieldName: string, defaultValue?: number): number => {
  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue;
    throw new HttpError(400, `${fieldName} harus berupa bilangan bulat positif`);
  }

  if (typeof value !== "string" || value.trim() === "") {
    throw new HttpError(400, `${fieldName} harus berupa bilangan bulat positif`);
  }

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new HttpError(400, `${fieldName} harus berupa bilangan bulat positif`);
  }

  return parsed;
};

// GET /api/skins?page=1&limit=10&heroId=18&rarity=GRAND
export const getAllSkins = async (req: Request, res: Response) => {
  const page = parsePositiveQueryInteger(req.query.page, "page", 1);
  const limit = parsePositiveQueryInteger(req.query.limit, "limit", 10);
  const skip = (page - 1) * limit;

  if (!Number.isSafeInteger(skip)) {
    throw new HttpError(400, "Kombinasi page dan limit terlalu besar");
  }

  const heroId = req.query.heroId === undefined
    ? undefined
    : parsePositiveQueryInteger(req.query.heroId, "heroId");

  let rarity: Rarity | undefined;
  if (req.query.rarity !== undefined) {
    if (typeof req.query.rarity !== "string" || req.query.rarity.trim() === "") {
      throw new HttpError(400, "rarity tidak valid");
    }

    const normalizedRarity = req.query.rarity.trim().toUpperCase();
    if (!SKIN_RARITIES.includes(normalizedRarity as (typeof SKIN_RARITIES)[number])) {
      throw new HttpError(400, "Rarity skin tidak valid");
    }
    rarity = normalizedRarity as Rarity;
  }

  const where = {
    ...(heroId !== undefined ? { heroId } : {}),
    ...(rarity ? { rarity } : {}),
  };

  const [skins, totalItems] = await prisma.$transaction([
    prisma.skin.findMany({
      where,
      include: {
        hero: {
          select: { id: true, name: true },
        },
      },
      orderBy: { id: "asc" },
      skip,
      take: limit,
    }),
    prisma.skin.count({ where }),
  ]);

  sendSuccess(res, 200, "Berhasil mengambil data skin", skins, {
    currentPage: page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
  });
};

// GET /api/skins/:skin_id
export const getSkinById = async (req: Request, res: Response) => {
  const skinId = parseId(req.params.skin_id);

  const skin = await prisma.skin.findUnique({
    where: { id: skinId },
    include: { hero: true },
  });

  if (!skin) {
    throw new HttpError(404, "Skin tidak ditemukan");
  }

  sendSuccess(res, 200, "Berhasil mengambil detail skin", skin);
};
