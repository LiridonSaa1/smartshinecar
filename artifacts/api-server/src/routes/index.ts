import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import servicesRouter from "./services";
import bookingsRouter from "./bookings";
import reviewsRouter from "./reviews";
import analyticsRouter from "./analytics";
import settingsRouter from "./settings";
import contentRouter from "./content";
import storageRouter from "./storage";
import messagesRouter from "./messages";
import customerRouter from "./customer";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(customerRouter);
router.use(servicesRouter);
router.use(bookingsRouter);
router.use(reviewsRouter);
router.use(analyticsRouter);
router.use(settingsRouter);
router.use(contentRouter);
router.use(storageRouter);
router.use(messagesRouter);

export default router;
