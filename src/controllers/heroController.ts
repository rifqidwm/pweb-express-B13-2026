// src/controllers/heroController.ts
import type { Request, Response } from "express";
import prisma from "../config/prisma";
import type { Lane, Role } from "../generated/prisma/client";
import { HttpError } from "../utils/http-error";
import { parseId } from "../utils/parse";
import { sendSuccess } from "../utils/response";

const HERO_ROLES = [
  "TANK",
  "FIGHTER",
  "ASSASSIN",
  "MAGE",
  "MARKSMAN",
  "SUPPORT",
] as const;

const HERO_LANES = ["EXP", "GOLD", "MID", "JUNGLE", "ROAM"] as const;

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

// GET /api/heroes?page=1&limit=10&search=la&role=MARKSMAN
export const getAllHeroes = async (req: Request, res: Response) => {
  const page = parsePositiveQueryInteger(req.query.page, "page", 1);
  const limit = parsePositiveQueryInteger(req.query.limit, "limit", 10);
  const skip = (page - 1) * limit;

  if (!Number.isSafeInteger(skip)) {
    throw new HttpError(400, "Kombinasi page dan limit terlalu besar");
  }

  let search: string | undefined;
  if (req.query.search !== undefined) {
    if (typeof req.query.search !== "string") {
      throw new HttpError(400, "search harus berupa teks");
    }
    search = req.query.search.trim() || undefined;
  }

  let role: Role | undefined;
  if (req.query.role !== undefined) {
    if (typeof req.query.role !== "string" || req.query.role.trim() === "") {
      throw new HttpError(400, "role tidak valid");
    }

    const normalizedRole = req.query.role.trim().toUpperCase();
    if (!HERO_ROLES.includes(normalizedRole as (typeof HERO_ROLES)[number])) {
      throw new HttpError(400, "Role hero tidak valid");
    }
    role = normalizedRole as Role;
  }

  const where = {
    ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
    ...(role ? { role } : {}),
  };

  const [heroes, totalItems] = await prisma.$transaction([
    prisma.hero.findMany({
      where,
      orderBy: { id: "asc" },
      skip,
      take: limit,
    }),
    prisma.hero.count({ where }),
  ]);

  sendSuccess(res, 200, "Berhasil mengambil data hero", heroes, {
    currentPage: page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
  });
};

// GET /api/heroes/:hero_id
export const getHeroById = async (req: Request, res: Response) => {
  const heroId = parseId(req.params.hero_id);

  const hero = await prisma.hero.findUnique({
    where: { id: heroId },
    include: { skins: true },
  });

  if (!hero) {
    throw new HttpError(404, "Hero tidak ditemukan");
  }

  sendSuccess(res, 200, "Berhasil mengambil detail hero", hero);
};

const parseOptionalPrice = (value: unknown, fieldName: string): number | null => {
  if (value === undefined || value === null) return null;

  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw new HttpError(400, `${fieldName} harus berupa bilangan bulat non-negatif atau null`);
  }

  return value;
};

// POST /api/heroes
// body: name, role, lane, releaseYear, priceBP (boleh kosong), priceDiamond (boleh kosong)
export const createHero = async (req: Request, res: Response) => {
  const body = req.body as Record<string, unknown> | undefined;
  const rawName = body?.name;
  const rawRole = body?.role;
  const rawLane = body?.lane;
  const rawReleaseYear = body?.releaseYear;

  // 1. Periksa field wajib terlebih dahulu.
  if (
    typeof rawName !== "string" ||
    rawName.trim() === "" ||
    typeof rawRole !== "string" ||
    rawRole.trim() === "" ||
    typeof rawLane !== "string" ||
    rawLane.trim() === "" ||
    rawReleaseYear === undefined ||
    rawReleaseYear === null ||
    rawReleaseYear === ""
  ) {
    throw new HttpError(400, "name, role, lane, dan releaseYear wajib diisi");
  }

  const name = rawName.trim();
  const normalizedRole = rawRole.trim().toUpperCase();
  const normalizedLane = rawLane.trim().toUpperCase();

  // 2. Periksa nama duplikat sebelum validasi/pembuatan data berikutnya.
  const existingHero = await prisma.hero.findUnique({ where: { name } });
  if (existingHero) {
    throw new HttpError(409, "Nama hero sudah digunakan");
  }

  // Validasi nilai enum dan tipe data agar kesalahan input dibalas 400.
  if (!HERO_ROLES.includes(normalizedRole as (typeof HERO_ROLES)[number])) {
    throw new HttpError(400, "Role hero tidak valid");
  }
  if (!HERO_LANES.includes(normalizedLane as (typeof HERO_LANES)[number])) {
    throw new HttpError(400, "Lane hero tidak valid");
  }
  if (typeof rawReleaseYear !== "number" || !Number.isSafeInteger(rawReleaseYear) || rawReleaseYear <= 0) {
    throw new HttpError(400, "releaseYear harus berupa bilangan bulat positif");
  }

  const priceBP = parseOptionalPrice(body?.priceBP, "priceBP");
  const priceDiamond = parseOptionalPrice(body?.priceDiamond, "priceDiamond");

  // 3. Buat hero baru.
  const hero = await prisma.hero.create({
    data: {
      name,
      role: normalizedRole as Role,
      lane: normalizedLane as Lane,
      releaseYear: rawReleaseYear,
      priceBP,
      priceDiamond,
    },
  });

  sendSuccess(res, 201, "Hero berhasil ditambahkan", hero);
};
