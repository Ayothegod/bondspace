import { Router } from "express";
import { forgetPasswordController } from "../controllers/auth.control.js";
import { verifyCookie } from "../middlewares/auth.middleware.js";
import { validate } from "../utils/validate.js";
import {
  createAGroupChat,
  createOrGetAOneOnOneChat,
  getGroupChatDetails,
  searchAvailableUsers,
  addNewParticipantInGroupChat,
  deleteGroupChat,
  deleteOneOnOneChat,
  getAllChats,
  leaveGroupChat,
  removeParticipantFromGroupChat,
  renameGroupChat,
} from "../controllers/chat.control.js";

const router = Router();

router.use(verifyCookie);

router.route("/").get(getAllChats);
router.route("/forgot-password").post(validate, forgetPasswordController);

router.route("/users").get(searchAvailableUsers);

router.route("/c/:receiverId").post(validate, createOrGetAOneOnOneChat);

router.route("/group").post(validate, createAGroupChat);

router
  .route("/group/:chatId")
  .get(validate, getGroupChatDetails)
  .patch(validate, renameGroupChat)
  .delete(validate, deleteGroupChat);

router
  .route("/group/:chatId/:participantId")
  .post(validate, addNewParticipantInGroupChat)
  .delete(validate, removeParticipantFromGroupChat);

router.route("/leave/group/:chatId").delete(validate, leaveGroupChat);

router.route("/remove/:chatId").delete(validate, deleteOneOnOneChat);

export default router;
