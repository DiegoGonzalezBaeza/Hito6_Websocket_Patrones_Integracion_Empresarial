import { Router } from "express";
import { movieController } from "../controllers/movie.controller";  

const router = Router();

router.get("/", movieController.getMovies);

router.get("/:mid", movieController.getMovie);

router.post("/", movieController.createMovie);

router.delete("/:mid", movieController.deleteMovie);

router.put("/:mid", movieController.updateMovie);

export default router;