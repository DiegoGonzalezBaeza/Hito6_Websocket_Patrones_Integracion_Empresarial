import { Review,ReviewCreationAttributes } from "../models/review.model";
import { HttpError } from "../utils/httpError.util";

const getAllReviews = async () => {
    const reviews = await Review.findAll();
    return reviews;
};

const getReviewById = async (rid: string) => { 
    const review = await Review.findByPk(rid); 
    if (!review) throw new HttpError("Review not found", 400); 
    return review; 
  };

const getallReviewsByMovieId = async (mid: string) => { 
    const reviews = await Review.findAll({ where :{ mid }}); 
    if (!reviews) throw new HttpError("Reviews not found", 400);
    return reviews;
    };

const createReview = async(
    uid: string,
    mid: string,
    rating: number,
    review_text: string
    ) => {
    
    const review = await Review.findOne({ where :{ uid, mid }});
    if (review){
        throw new HttpError("Review already exists", 400);
    }

      // Crea la nueva película
    const newReviewData: ReviewCreationAttributes = {
    uid, 
    mid, 
    rating, 
    review_text,
    };
      // Crea la nueva reseña
    const newReview = await Review.create(newReviewData);

    return newReview;
    };

const deleteReviewById = async (rid: string) => {
    const review = await Review.findByPk(rid);
    if (!review) throw new HttpError("Review not found", 400);
    await review.destroy(); // Usa destroy para eliminar el usuario
    return { message: "Review deleted successfully" };
    };

const updateReviewById = async (rid: string, rating?: number, review_text?: string) => {
    const review = await Review.findByPk(rid);
    if (!review) throw new HttpError("Review not found", 400);
  
    // Actualiza solo los campos proporcionados
    if (rating) review.rating = rating;
    if (review_text) review.review_text = review_text;
  
    await review.save(); // Guarda los cambios
    return review;
  };

export const reviewService = {
    getAllReviews,
    getReviewById,
    getallReviewsByMovieId,
    createReview,
    deleteReviewById,
    updateReviewById,
};  

