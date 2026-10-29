// prisma/seed.ts
// Jalankan: npx tsx prisma/seed.ts
// Referensi modul: 17 (raw query $executeRaw), 16.2 (createMany)
import { readFileSync } from "node:fs";
import prisma from "../src/config/prisma";
import type { Lane, Rarity, Role } from "../src/generated/prisma/client";

type HeroJson = {
  name: string;
  primaryRole: string;
  primaryLane: string;
  releaseYear: number;
  priceBP: number | null;
  priceDiamond: number | null;
};

type SkinJson = {
  name: string;
  heroId: number;
  rarity: string;
  priceDiamond: number | null;
};

const heroes: HeroJson[] = JSON.parse(
  readFileSync(new URL("../data/heroes.json", import.meta.url), "utf-8"),
);
const skins: SkinJson[] = JSON.parse(
  readFileSync(new URL("../data/skins.json", import.meta.url), "utf-8"),
);

// Samakan penulisan dengan nilai enum di schema.
// "Marksman" -> "MARKSMAN", "Gold Lane" -> "GOLD", "EXP Lane" -> "EXP"
const toEnum = (value: string) => value.trim().split(" ")[0]!.toUpperCase();

const main = async () => {
  // 1. Kosongkan semua tabel dan kembalikan id ke 1
  await prisma.$executeRaw`TRUNCATE "PlayerHero", "Player", "Skin", "Hero" RESTART IDENTITY CASCADE`;

  // 2. Hero (urutan file sudah benar: Miya id 1, Hirara id 133)
  const heroResult = await prisma.hero.createMany({
    data: heroes.map((hero) => ({
      name: hero.name,
      role: toEnum(hero.primaryRole) as Role,
      lane: toEnum(hero.primaryLane) as Lane,
      releaseYear: hero.releaseYear,
      priceBP: hero.priceBP,
      priceDiamond: hero.priceDiamond,
    })),
  });

  // 3. Skin
  const skinResult = await prisma.skin.createMany({
    data: skins.map((skin) => ({
      name: skin.name,
      heroId: skin.heroId,
      rarity: toEnum(skin.rarity) as Rarity,
      priceDiamond: skin.priceDiamond,
    })),
  });

  // 4. Player (urutan menentukan id 1, 2, 3)
  const playerResult = await prisma.player.createMany({
    data: [
      { nickname: "ArekITS", bp: 1500, diamond: 75 },
      { nickname: "SangPushRank", bp: 13000, diamond: 2892 },
      { nickname: "MageSurabaya", bp: 10000, diamond: 0 },
    ],
  });

  // 5. PlayerHero
  const playerHeroResult = await prisma.playerHero.createMany({
    data: [
      { playerId: 1, heroId: 18, currency: "BP", pricePaid: 2000 }, // Layla
      { playerId: 1, heroId: 1, currency: "BP", pricePaid: 10800 }, // Miya
      { playerId: 2, heroId: 84, currency: "DIAMOND", pricePaid: 599 }, // Ling
      { playerId: 2, heroId: 56, currency: "BP", pricePaid: 32000 }, // Gusion
    ],
  });

  console.log(`Hero       : ${heroResult.count}`);
  console.log(`Skin       : ${skinResult.count}`);
  console.log(`Player     : ${playerResult.count}`);
  console.log(`PlayerHero : ${playerHeroResult.count}`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
