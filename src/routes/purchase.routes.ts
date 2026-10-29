// src/routes/purchase.routes.ts (Orang A)
// Dipasang di prefix /players juga (lihat routes/index.ts),
// jadi URL lengkapnya POST /api/players/:player_id/heroes
import { Router } from "express";
import { buyHero } from "../controllers/purchaseController";

const router = Router();

router.post("/:player_id/heroes", buyHero);

export default router;
