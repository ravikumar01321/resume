import { Router, type IRouter } from "express";
import healthRouter from "./health";
import resumeRouter from "./resume";
import downloadRouter from "./download";

const router: IRouter = Router();

router.use(healthRouter);
router.use(resumeRouter);
router.use(downloadRouter);

export default router;
