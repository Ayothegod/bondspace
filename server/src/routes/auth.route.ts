import { Router } from "express";
import {
  forgetPasswordController,
  loginController,
  registerController,
} from "../controllers/auth.control.js";
import { verifyCookie } from "../middlewares/auth.middleware.js";
import { validate } from "../utils/validate.js";

const router = Router();

router.route("/register").post(registerController);
router.route("/login").post(loginController);
router
  .route("/forgot-password")
  .post(verifyCookie, validate, forgetPasswordController);

export default router;
