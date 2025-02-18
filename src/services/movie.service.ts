import { Movie, MovieCreationAttributes } from "../models/movie.model";
import { HttpError } from "../utils/httpError.util";

const getAllMovies = async () => {
    const movies = await Movie.findAll();
    return movies;
};

const getMovieById = async (mid: string) => { 
    const movie = await Movie.findByPk(mid); 
    if (!movie) throw new HttpError("Movie not found", 400); 
    return movie; 
  }; 

const getmovieByTitle = async (title: string) => { 
    const movie = await Movie.findOne({ where :{ title }}); 
    if (!movie) throw new HttpError("movie not found", 400); 
    return movie; 
  };

const createMovie = async(title: string, 
    release_year: number, 
    director: string, 
    duration_minutes: number,
    synopsis: string,
    poster_url: string) => {

    const movie = await Movie.findOne({ where :{ title }});

    if (movie){
        throw new HttpError("Movie already exists", 400);
    }

      // Crea la nueva película
    const newMovieData: MovieCreationAttributes = {
    title,
    release_year,
    director,
    duration_minutes,
    synopsis,
    poster_url,
    };

    const newMovie = await Movie.create(newMovieData);

    return newMovie;
};

const deleteMovieById = async (mid: string) => { 
    const movie = await Movie.findByPk(mid); 
    if (!movie) throw new HttpError("movie not found", 400); 
    await movie.destroy(); // Usa destroy para eliminar el usuario
    return { message: "movie deleted successfully" }; 
  };

  const updateMovieById = async (mid: string, title?: string, 
    release_year?: number, 
    director?: string, 
    duration_minutes?: number,
    synopsis?: string,
    poster_url?: string) => {
    const movie = await Movie.findByPk(mid);
    if (!movie) throw new HttpError("movie not found", 400);
  
    // Actualiza solo los campos proporcionados
    if (title) movie.title = title;
    if (release_year) movie.release_year = release_year;
    if (director) movie.director = director;
    if (duration_minutes) movie.duration_minutes = duration_minutes;
    if (synopsis) movie.synopsis = synopsis;
    if (poster_url) movie.poster_url = poster_url;
  
    await movie.save(); // Guarda los cambios
    return movie;
  };

export const movieService = {
    getAllMovies,
    getMovieById,
    getmovieByTitle,
    createMovie,
    deleteMovieById,
    updateMovieById,
}