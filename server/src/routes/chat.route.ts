import { Router } from "express";
import {
  addNewParticipantInGroupChat,
  createAGroupChat,
  createOrGetAOneOnOneChat,
  deleteGroupChat,
  deleteOneOnOneChat,
  getAllChats,
  getGroupChatDetails,
  leaveGroupChat,
  removeParticipantFromGroupChat,
  renameGroupChat,
  searchAvailableUsers,
} from "../controllers/chat.control.js";
import { verifyCookie } from "../middlewares/auth.middleware.js";
import { validate } from "../utils/validate.js";

const router = Router();

router.use(verifyCookie);

router.route("/").get(getAllChats);

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
