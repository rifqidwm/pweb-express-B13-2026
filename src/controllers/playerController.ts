import type { Request, Response } from "express";
import prisma from "../config/prisma";
import { HttpError } from "../utils/http-error";
import { parseId } from "../utils/parse";
import { sendSuccess } from "../utils/response";

const playerSelect = {
  id: true,
  nickname: true,
  bp: true,
  diamond: true,
  createdAt: true,
};

export const createPlayer = async (req: Request, res: Response) => {
  const { nickname } = req.body ?? {};

  if (typeof nickname !== "string" || !nickname.trim()) {
    throw new HttpError(400, "Nickname wajib diisi");
  }

  const existingPlayer = await prisma.player.findUnique({
    where: { nickname: nickname.trim() },
  });
  if (existingPlayer) {
    throw new HttpError(409, "Nickname sudah dipakai");
  }

  const player = await prisma.player.create({
    data: { nickname: nickname.trim() },
    select: playerSelect,
  });

  sendSuccess(res, 201, "Player berhasil dibuat", player);
};

export const getPlayerById = async (req: Request, res: Response) => {
  const id = parseId(req.params.player_id);

  const player = await prisma.player.findUnique({
    where: { id },
    select: {
      ...playerSelect,
      heroes: {
        select: {
          heroId: true,
          currency: true,
          pricePaid: true,
          hero: { select: { name: true } },
        },
        orderBy: { id: "asc" },
      },
    },
  });

  if (!player) throw new HttpError(404, "Player tidak ditemukan");

  const data = {
    ...player,
    heroes: player.heroes.map((item) => ({
      heroId: item.heroId,
      name: item.hero.name,
      currency: item.currency,
      pricePaid: item.pricePaid,
    })),
  };

  sendSuccess(res, 200, "Berhasil mengambil data player", data);
};

export const updatePlayer = async (req: Request, res: Response) => {
  const id = parseId(req.params.player_id);
  const { nickname } = req.body ?? {};

  // Cek manual karena urutan soal 404 -> 400 -> 409
  const player = await prisma.player.findUnique({ where: { id } });
  if (!player) throw new HttpError(404, "Player tidak ditemukan");

  if (typeof nickname !== "string" || !nickname.trim()) {
    throw new HttpError(400, "Nickname wajib diisi");
  }

  const nicknameOwner = await prisma.player.findUnique({
    where: { nickname: nickname.trim() },
  });
  if (nicknameOwner && nicknameOwner.id !== id) {
    throw new HttpError(409, "Nickname sudah dipakai player lain");
  }

  const updatedPlayer = await prisma.player.update({
    where: { id },
    data: { nickname: nickname.trim() },
    select: playerSelect,
  });

  sendSuccess(res, 200, "Player berhasil diupdate", updatedPlayer);
};

export const deletePlayer = async (req: Request, res: Response) => {
  const id = parseId(req.params.player_id);

  await prisma.player.delete({ where: { id } });

  sendSuccess(res, 200, "Player berhasil dihapus");
};

export const topUpDiamond = async (req: Request, res: Response) => {
  const id = parseId(req.params.player_id);
  const { amount } = req.body ?? {};

  if (!Number.isInteger(amount) || amount <= 0) {
    throw new HttpError(400, "Amount harus bilangan bulat lebih dari 0");
  }

  const player = await prisma.player.update({
    where: { id },
    data: { diamond: { increment: amount } },
    select: { id: true, diamond: true },
  });

  sendSuccess(res, 200, "Top up berhasil", {
    playerId: player.id,
    amount,
    diamond: player.diamond,
  });
};

export const playMatch = async (req: Request, res: Response) => {
  const id = parseId(req.params.player_id);
  const { result } = req.body ?? {};

  if (result !== "WIN" && result !== "LOSE") {
    throw new HttpError(400, "Result harus WIN atau LOSE");
  }

  const bpEarned = result === "WIN" ? 300 : 100;

  const player = await prisma.player.update({
    where: { id },
    data: { bp: { increment: bpEarned } },
    select: { id: true, bp: true },
  });

  sendSuccess(res, 200, "Hadiah match berhasil ditambahkan", {
    playerId: player.id,
    result,
    bpEarned,
    bp: player.bp,
  });
};