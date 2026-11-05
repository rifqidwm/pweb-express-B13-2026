// src/routes/index.ts
import { Router } from "express";
import heroRouter from "./hero.routes";
import playerRouter from "./player.routes";
import purchaseRouter from "./purchase.routes";
import skinRouter from "./skin.routes";
import statisticRouter from "./statistic.routes";

const router = Router();

router.use("/heroes", heroRouter);
router.use("/skins", skinRouter);
router.use("/players", playerRouter);
router.use("/players", purchaseRouter);
router.use("/statistics", statisticRouter);

export default router;
