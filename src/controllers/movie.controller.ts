import { Request, Response, NextFunction} from "express";
import { movieService } from "../services/movie.service";

const getMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const movies = await movieService.getAllMovies();
        res.json(movies);
    } catch (error) {
        next(error);
    }
};

const getMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { mid } = req.params;
        const movie = await movieService.getMovieById(mid);
        if (!movie) {
            res.status(404).json({ message: "Movie not found" });
        } else {
            res.json(movie);
        }
    } catch (error) {
        next(error);
    }
};

const createMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, release_year, director, duration_minutes, synopsis, poster_url } = req.body;
        const newMovie = await movieService.createMovie(title, release_year, director, duration_minutes, synopsis, poster_url);
        res.json(newMovie);
    } catch (error) {
        next(error);
    }
};

const deleteMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { mid } = req.params;
        const movie = await movieService.deleteMovieById(mid);
        res.json(movie);
    } catch (error) {
        next(error);
    }
};

const updateMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { mid } = req.params;
        const { title, release_year, director, duration_minutes, synopsis, poster_url } = req.body;
        const movie = await movieService.updateMovieById(mid, title, release_year, director, duration_minutes, synopsis, poster_url);
        res.json(movie);
    } catch (error) {
        next(error);
    }
};

export const movieController = {
    getMovies,
    getMovie,
    createMovie,
    deleteMovie,
    updateMovie,
};