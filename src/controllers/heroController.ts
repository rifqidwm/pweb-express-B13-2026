// src/controllers/heroController.ts (Orang B)
// Referensi modul: 13.2 (getAllPosts, getPostById, createPost), 14 (filtering & pagination)
import type { Request, Response } from "express";
import prisma from "../config/prisma";
import { HttpError } from "../utils/http-error";
import { parseId } from "../utils/parse";
import { sendSuccess } from "../utils/response";

// GET /api/heroes?page=1&limit=10&search=la&role=MARKSMAN
export const getAllHeroes = async (req: Request, res: Response) => {
  // TODO:
  // - page default 1, limit default 10 (pola getAllPosts)
  // - search: name contains, mode "insensitive"
  // - role: filter role (nilai enum, contoh MARKSMAN)
  // - prisma.$transaction([findMany, count]) dengan where yang SAMA
  // - sendSuccess(..., metadata { currentPage, limit, totalItems, totalPages })
  throw new HttpError(501, "getAllHeroes belum diimplementasikan");
};

// GET /api/heroes/:hero_id
export const getHeroById = async (req: Request, res: Response) => {
  // TODO:
  // - parseId(req.params.hero_id)
  // - findUnique + include: { skins: true }
  // - tidak ada -> 404
  throw new HttpError(501, "getHeroById belum diimplementasikan");
};

// POST /api/heroes
// body: name, role, lane, releaseYear, priceBP (boleh kosong), priceDiamond (boleh kosong)
export const createHero = async (req: Request, res: Response) => {
  // TODO (urutan pemeriksaan sesuai soal):
  // 1. name, role, lane, atau releaseYear kosong -> 400
  // 2. nama hero sudah ada (findUnique by name) -> 409
  // 3. create -> 201 berisi hero baru
  throw new HttpError(501, "createHero belum diimplementasikan");
};
