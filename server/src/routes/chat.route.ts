import { Router } from "express";
import { getChatDetails, renameChat } from "../controllers/chat.control.js";
import { verifyCookie } from "../middlewares/auth.middleware.js";
import { validate } from "../utils/validate.js";

const router = Router();

router.use(verifyCookie);

router
  .route("/:spaceId/:chatId")
  .get(validate, getChatDetails)
  .patch(validate, renameChat);

export default router;
