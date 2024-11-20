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
  .delete(validate);

// NOTE: space participants
router
  .route("/:spaceId/:participantId")
  .post(validate, addNewParticipantToSpace)
  .delete(validate, removeParticipantFromSpace);

// router.route("/leave/s/:spaceId").delete(validate);

export default router;

// why does the user get added to the spaxc but the user is not added to the chat under the space??

//     const updatedSpace = await prisma.space.update({
//       where: {
//         id: spaceId,
//       },
//       data: {
//         participants: {
//           connect: {
//             id: participantId,
//           },
//         },
//         Chat: {
//           update: {
//             id: participantId,
//           },
//         },
//       },
//       include: {
//         participants: {
//           select: {
//             id: true,
//             username: true,
//             avatar: true,
//             email: true,
//           },
//         },
//         Chat: true
//       },
//     });
