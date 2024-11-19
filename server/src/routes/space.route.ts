import { Router } from "express";
import { forgetPasswordController } from "../controllers/auth.control.js";
import { verifyCookie } from "../middlewares/auth.middleware.js";
import { validate } from "../utils/validate.js";

const router = Router();

router.use(verifyCookie);

router.route("/forgot-password").post(validate, forgetPasswordController);

export default router;
