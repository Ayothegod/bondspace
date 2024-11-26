import { Router } from "express";
import { getChatDetails, renameChat } from "../controllers/chat.control.js";
import { verifyCookie } from "../middlewares/auth.middleware.js";
import { validate } from "../utils/validate.js";
import { createGame, endGame, joinGame, leaveGame, startGame } from "../controllers/game.control.js";

const router = Router();

router.use(verifyCookie);

// Game routes
router.route("/create").post(validate, createGame);
router.route("/:gameId/join").post(validate, joinGame);
router.route("/:gameId/start").post(validate, startGame);
router.route("/:gameId/end").post(validate, endGame);

// // Player routes
router.route("/:gameId/leave").post(validate, leaveGame);


// // Round routes
// router.post("/:gameId/round/start", gameController.startRound);
// router.post("/:gameId/round/end", gameController.endRound);

// // Action routes
// router.post("/:gameId/round/:roundId/action", gameController.addAction);


// // Utility routes
// router.get("/:gameId", gameController.getGameDetails);

export default router;
