import { Router } from "express";
import {
  forgetPasswordController,
  userProfile,
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

router.use(verifyCookie);

router.route("/user/:id").get(userProfile);

export default router;
