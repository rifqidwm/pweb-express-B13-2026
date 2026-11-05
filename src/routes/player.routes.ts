// src/routes/player.routes.ts
import { Router } from "express";
import {
  createPlayer,
  deletePlayer,
  getPlayerById,
  playMatch,
  topUpDiamond,
  updatePlayer,
} from "../controllers/playerController";

const router = Router();

router.post("/", createPlayer);
router.get("/:player_id", getPlayerById);
router.patch("/:player_id", updatePlayer);
router.delete("/:player_id", deletePlayer);
router.post("/:player_id/topup", topUpDiamond);
router.post("/:player_id/matches", playMatch);
// POST /:player_id/heroes ada di purchase.routes.ts

export default router;
