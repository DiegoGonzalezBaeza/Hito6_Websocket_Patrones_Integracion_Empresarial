import { Request, Response, NextFunction } from "express";
import { reviewService } from "../services/review.service";
import { HttpError } from "../utils/httpError.util";

const getReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviews = await reviewService.getAllReviews();
        res.json(reviews);
    } catch (error) {
        next(error);
    }
};

const getReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { rid } = req.params;
        const review = await reviewService.getReviewById(rid);
        if (!review) {
            res.status(404).json({ message: "Review not found" });
        } else {
            res.json(review);
        }
    } catch (error) {
        next(error);
    }
};

const getReviewsByMovieId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { mid } = req.params;
        const reviews = await reviewService.getallReviewsByMovieId(mid);
        if (!reviews) {
            res.status(404).json({ message: "Reviews not found" });
        } else {
            res.json(reviews);
        }
    } catch (error) {
        next(error);
    }
};

const createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { uid, mid, rating, review_text } = req.body;
        const newReview = await reviewService.createReview(uid, mid, rating, review_text);
        res.json(newReview);
    } catch (error) {
        next(error);
    }
};

const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { rid } = req.params;
        const review = await reviewService.deleteReviewById(rid);
        res.json(review);
    } catch (error) {
        next(error);
    }
};

const updateReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { rid } = req.params;
        const { rating, review_text } = req.body;
        const review = await reviewService.updateReviewById(rid, rating, review_text);
        res.json(review);
    } catch (error) {
        next(error);
    }
};

export const reviewController = {
    getReviews,
    getReview,
    getReviewsByMovieId,
    createReview,
    deleteReview,
    updateReview,
};