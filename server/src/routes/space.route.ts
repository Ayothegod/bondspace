import { Router } from "express";
import {
  addNewParticipantToSpace,
  createASpace,
  getSpaceDetails,
  removeParticipantFromSpace,
  renameSpace,
} from "../controllers/space.control.js";
import { verifyCookie } from "../middlewares/auth.middleware.js";
import { validate } from "../utils/validate.js";

const router = Router();

router.use(verifyCookie);

router.route("/").post(validate, createASpace);

// NOTE: space resource
router
  .route("/:spaceId")
  .get(validate, getSpaceDetails)
  .patch(validate, renameSpace)
  // .delete(validate);

// NOTE: space participants
router
  .route("/:spaceId/:participantId")
  .post(validate, addNewParticipantToSpace)
  .delete(validate, removeParticipantFromSpace);

export default router;

