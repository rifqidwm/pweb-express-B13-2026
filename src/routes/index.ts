// src/routes/index.ts
// FILE KONTRAK BERSAMA: jangan diubah setelah skeleton di-push,
// supaya tidak ada konflik merge antar anggota.
import { Router } from "express";
import heroRouter from "./hero.routes";
import playerRouter from "./player.routes";
import purchaseRouter from "./purchase.routes";
import skinRouter from "./skin.routes";
import statisticRouter from "./statistic.routes";

const router = Router();

router.use("/heroes", heroRouter); // Orang B
router.use("/skins", skinRouter); // Orang B
router.use("/players", playerRouter); // Orang C
router.use("/players", purchaseRouter); // Orang A (POST /:player_id/heroes)
router.use("/statistics", statisticRouter); // Orang A

export default router;
