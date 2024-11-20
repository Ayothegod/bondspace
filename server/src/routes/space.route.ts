import { Router } from "express";
import { forgetPasswordController } from "../controllers/auth.control.js";
import { verifyCookie } from "../middlewares/auth.middleware.js";
import { validate } from "../utils/validate.js";
import {
  addNewParticipantToSpace,
  createASpace,
} from "../controllers/space.control.js";

const router = Router();

router.use(verifyCookie);

router.route("/").post(validate, createASpace);

router.route("/:spaceId").get().patch().delete();

router
  .route("/:spaceId/:participantId")
  .post(validate, addNewParticipantToSpace)
  .delete(validate);

router.route("/leave/s/:spaceId").delete(validate);

router.route("/remove/:spaceId").delete(validate);

router.route("/forgot-password").post(validate, forgetPasswordController);

export default router;
