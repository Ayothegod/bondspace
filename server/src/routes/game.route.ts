import { Router } from "express";
import { getChatDetails, renameChat } from "../controllers/chat.control.js";
import { verifyCookie } from "../middlewares/auth.middleware.js";
import { validate } from "../utils/validate.js";

const router = Router();

router.use(verifyCookie);

router
  .route("/:spaceId")
  .get(validate, getChatDetails)

  router
  .route("/:chatId")
  .patch(validate, renameChat);

export default router;
