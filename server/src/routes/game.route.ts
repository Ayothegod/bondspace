import { Router } from "express";
import { getChatDetails, renameChat } from "../controllers/chat.control.js";
import { verifyCookie } from "../middlewares/auth.middleware.js";
import { validate } from "../utils/validate.js";
import { createGame, joinGame } from "../controllers/game.control.js";

const router = Router();

router.use(verifyCookie);

router.route("/create").post(validate, createGame);

router.route("/:gameId/join").post(validate, joinGame);

// Game routes
// router.post("/:gameId/start", gameController.startGame);
// router.post("/:gameId/end", gameController.endGame);

// // Round routes
// router.post("/:gameId/round/start", gameController.startRound);
// router.post("/:gameId/round/end", gameController.endRound);

// // Action routes
// router.post("/:gameId/round/:roundId/action", gameController.addAction);

// // Player routes
// router.post("/:gameId/leave", gameController.leaveGame);

// // Utility routes
// router.get("/:gameId", gameController.getGameDetails);

export default router;
