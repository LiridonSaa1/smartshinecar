import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import servicesRouter from "./services";
import bookingsRouter from "./bookings";
import reviewsRouter from "./reviews";
import analyticsRouter from "./analytics";
import settingsRouter from "./settings";
import contentRouter from "./content";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(servicesRouter);
router.use(bookingsRouter);
router.use(reviewsRouter);
router.use(analyticsRouter);
router.use(settingsRouter);
router.use(contentRouter);

export default router;
