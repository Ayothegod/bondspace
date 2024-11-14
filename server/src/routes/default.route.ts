import { Request, Router, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

router.route("/").get(
  asyncHandler(async (req: Request, res: Response) => {
    return res
      .status(200)
      .json(new ApiResponse(200, "OK", "Default working successfully", ));
  })
);

export default router;
