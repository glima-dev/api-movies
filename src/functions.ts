import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "./database";
import {
  IMovie,
  IPagination,
  MovieCreate,
  MovieResult,
  TypesInputCategories,
} from "./interfaces";

const createMovie = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const { categories, ...moviePayload } = request.body;

    const queryTemplate: string = format(
      `
              INSERT INTO
                  movies(%I, categories)
              VALUES
                  (%L, '{%s}')
              RETURNING *;
          `,
      Object.keys(moviePayload),
      Object.values(moviePayload),
      Object.values(categories)
    );

    const queryResult: MovieResult = await client.query(queryTemplate);
    const newMovie: IMovie = queryResult.rows[0];

    return response.status(201).json(newMovie);
  } catch (error) {
    return response.status(409).json({
      message: "Movie already exists.",
    });
  }
};

const listMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  let page = Number(request.query.page) || 1;
  let perPage = Number(request.query.perPage) || 5;

  let order = request.query.order;
  let sort = request.query.sort;

  if (
    (order !== "price" && order !== "duration") ||
    (sort !== "asc" && sort !== "desc")
  )
    order = "id";
  if (sort !== "asc" && sort !== "desc") sort = "asc";

  if (isNaN(page) || page <= 0) page = 1;
  if (isNaN(perPage) || perPage <= 0 || perPage > 5) perPage = 5;

  let queryString: string = `
      SELECT
          *
      FROM
          movies
      `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [],
  };

  let queryResult: MovieResult = await client.query(queryConfig);

  const entireMovieListRows: number = queryResult.rowCount;

  queryString = format(
    `
    SELECT
        *
    FROM
        movies
    ORDER BY %I %s
    OFFSET %L LIMIT %L;
`,
    order,
    sort,
    perPage * (page - 1),
    perPage
  );

  const baseUrl: string = `http://localhost:3000/movies`;

  const prevPage: string | null =
    page <= 1 || entireMovieListRows - (perPage * page - perPage) < -perPage + 1
      ? null
      : `${baseUrl}?page=${page - 1}&perPage=${perPage}`;

  const nextPage: string | null =
    entireMovieListRows - perPage * page <= 0
      ? null
      : `${baseUrl}?page=${page + 1}&perPage=${perPage}`;

  queryResult = await client.query(queryString);

  const count: number = queryResult.rowCount;

  const pagination: IPagination = {
    prevPage,
    nextPage,
    count,
    data: queryResult.rows,
  };

  return response.status(200).json(pagination);
};

const listMoviesCategory = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { category } = request.params;

  const queryTemplate: string = `
      SELECT
          *
      FROM
          movies
      WHERE $1 ILIKE ANY(categories);
      `;

  const queryConfig: QueryConfig = {
    text: queryTemplate,
    values: [category],
  };

  const queryResult: MovieResult = await client.query(queryConfig);
  const filteredMovies: IMovie[] = queryResult.rows;

  if (filteredMovies.length === 0) {
    return response.status(404).json({ message: "Category not found" });
  }

  const result = {
    count: queryResult.rowCount,
    totalPrice: filteredMovies.reduce((a, b) => a + b.price, 0),
    filteredBy: category,
    data: filteredMovies,
  };

  return response.status(200).json({ result });
};

const updateMovie = async (
  request: Request,
  response: Response
): Promise<Response> => {
  let { body } = request;
  body = body.categories
    ? { ...body, categories: `{${body.categories.toString()}}` }
    : body;

  if (body.name) {
    const queryCheckNameString: string = `
      SELECT
          *
      FROM
          movies
      WHERE
          name = $1;
      `;

    const queryConfig: QueryConfig = {
      text: queryCheckNameString,
      values: [body.name],
    };

    const queryResult: MovieResult = await client.query(queryConfig);

    if (queryResult.rowCount) {
      return response.status(409).json({
        message: "Movie already exists.",
      });
    }
  }

  const updateColumns: string[] = Object.keys(body);
  const updateValues: string[] = Object.values(body);

  const queryString: string = `
    UPDATE "movies"
    SET (%I) = ROW(%L)
    WHERE id = $1
    RETURNING *;
  `;

  const queryFormat: string = format(queryString, updateColumns, updateValues);

  const queryConfig: QueryConfig = {
    text: queryFormat,
    values: [request.params.id],
  };

  const queryResult: MovieResult = await client.query(queryConfig);

  return response.status(200).json(queryResult.rows[0]);
};

const deleteMovie = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { params } = request;

  const queryString: string = `
        DELETE FROM
            movies
        WHERE
            id = $1;    
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [params.id],
  };

  await client.query(queryConfig);

  return response.status(204).send();
};

export {
  createMovie,
  listMovies,
  updateMovie,
  deleteMovie,
  listMoviesCategory,
};
