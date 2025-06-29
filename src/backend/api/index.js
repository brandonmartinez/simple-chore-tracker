import express from "express";
const router = express.Router();
import logger from "../logger.js";
import peopleRouter from "./people.js";
import choresRouter from "./chores.js";
import rewardsRouter from "./rewards.js";
import timePeriodsRouter from "./timePeriods.js";

router.use(peopleRouter);
router.use(choresRouter);
router.use(rewardsRouter);
router.use(timePeriodsRouter);

export default router;
