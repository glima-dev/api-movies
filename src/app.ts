import express, { Application, json } from "express";
import { startDatabase } from "./database";
import {
  createMovie,
  deleteMovie,
  listMovies,
  listMoviesCategory,
  updateMovie,
} from "./functions";
import {
  checkCategoryMiddleware,
  ensureMovieExistsMiddleware,
  validateBodyMiddleware,
} from "./middlewares";

const app: Application = express();
app.use(json());

app.post(
  "/movies",
  validateBodyMiddleware,
  checkCategoryMiddleware,
  createMovie
);
app.get("/movies", listMovies);
app.get("/movies/:category", listMoviesCategory);
app.patch(
  "/movies/:id",
  validateBodyMiddleware,
  ensureMovieExistsMiddleware,
  checkCategoryMiddleware,
  updateMovie
);
app.delete("/movies/:id", ensureMovieExistsMiddleware, deleteMovie);

const PORT: number = 3000;
const runningMsg: string = `Server running on http://localhost:${PORT}`;
app.listen(PORT, async () => {
  await startDatabase();
  console.log(runningMsg);
});
