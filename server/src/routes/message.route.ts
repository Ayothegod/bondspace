import { Router } from "express";
import {
  deleteMessage,
  getAllMessages,
  sendMessage,
} from "../controllers/message.control.js";
import { verifyCookie } from "../middlewares/auth.middleware.js";
import { validate } from "../utils/validate.js";

const router = Router();

router.use(verifyCookie);

router
  .route("/:spaceId")
  .get(validate, getAllMessages)

router.route("/:chatId").post(validate, sendMessage);

router.route("/:chatId/:messageId").delete(validate, deleteMessage);

export default router;
