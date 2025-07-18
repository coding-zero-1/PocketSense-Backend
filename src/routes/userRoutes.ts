import { Router } from "express";
import { webhookController } from "../controllers/userController";

const userRouter = Router();

userRouter.post("/webhooks", webhookController);

export default userRouter;