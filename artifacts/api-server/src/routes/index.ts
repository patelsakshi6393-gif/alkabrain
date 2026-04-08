import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import templatesRouter from "./templates";
import campaignsRouter from "./campaigns";
import leadsRouter from "./leads";
import integrationsRouter from "./integrations";
import billingRouter from "./billing";
import creditsRouter from "./credits";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(templatesRouter);
router.use(campaignsRouter);
router.use(leadsRouter);
router.use(integrationsRouter);
router.use(billingRouter);
router.use(creditsRouter);

export default router;
