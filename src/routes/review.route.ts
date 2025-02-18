import { Router } from "express";
import { reviewController } from "../controllers/review.controller";
import { verifyToken } from "../middlewares/jwt.middleware";

const router = Router();

router.get("/", reviewController.getReviews);

router.get("/:rid", reviewController.getReview);

router.get("/movie/:mid", reviewController.getReviewsByMovieId);

router.post("/", verifyToken, reviewController.createReview);

router.delete("/:rid", verifyToken, reviewController.deleteReview);

router.put("/:rid", verifyToken, reviewController.updateReview);

export default router;