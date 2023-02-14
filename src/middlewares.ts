import { Request, Response, NextFunction, json } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";
import { MovieResult, TypesInputCategories, RequiredKeys } from "./interfaces";

const ensureMovieExistsMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = Number(request.params.id);

  const queryString: string = `
        SELECT
            *
        FROM
            movies
        WHERE
            id = $1;
`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: MovieResult = await client.query(queryConfig);

  if (!queryResult.rowCount) {
    return response.status(404).json({
      message: "Movie not found!",
    });
  }

  return next();
};

const checkCategoryMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  if (
    (request.method === "PATCH" && request.body.categories) ||
    request.method === "POST"
  ) {
    const { categories } = request.body;
    const typeInputs: TypesInputCategories[] = [
      "Drama",
      "Suspense",
      "Terror",
      "Comédia",
      "Ação",
      "Aventura",
    ];

    const errors: string[] = [];

    categories.forEach((key: any): boolean => {
      if (!typeInputs.includes(key)) {
        errors.push(key);
        return false;
      }
      return true;
    });

    if (errors.length !== 0) {
      const message: string = `Category invalid input ${errors}`;
      return response.status(400).json({ message });
    }

    const checkDuplicateCategory: boolean = categories.some(
      (element: string, index: number) => {
        return categories.indexOf(element) !== index;
      }
    );

    if (checkDuplicateCategory) {
      const message: string = `Category list cannot contain duplicate values!`;
      return response.status(409).json({ message });
    }
  }

  return next();
};

const validateBodyMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const bodyKeys: Array<string> = Object.keys(request.body);
  const { body } = request;
  const requiredKeys: Array<RequiredKeys> = [
    "name",
    "duration",
    "description",
    "price",
    "categories",
    "discount",
    "stock",
  ];

  let bodyRequiredKeys: boolean;

  if (request.method === "PATCH") {
    bodyRequiredKeys = requiredKeys.some((requiredKey: string) =>
      bodyKeys.includes(requiredKey)
    );
  } else {
    const mandatoryRequestValues = requiredKeys.filter(
      (element) =>
        element !== "description" &&
        element !== "discount" &&
        element !== "stock"
    );
    bodyRequiredKeys = mandatoryRequestValues.every((requiredKey: string) =>
      bodyKeys.includes(requiredKey)
    );
  }

  const notRequiredKeysTest: boolean = bodyKeys.every((bodyKey: any) =>
    requiredKeys.includes(bodyKey)
  );

  if (!bodyRequiredKeys || !notRequiredKeysTest)
    return response.status(400).json({
      message: `Invalid entry - Expected: ${requiredKeys.join(", ")}`,
    });

  if (body.name) {
    if (typeof body.name !== "string")
      return response.status(400).json({
        message: "Name field must be string",
      });
  }
  if (body.description) {
    if (typeof body.description !== "string")
      return response.status(400).json({
        message: "Description field must be string",
      });
  }
  if (body.duration) {
    if (typeof body.duration !== "number")
      return response.status(400).json({
        message: "Duration field must be a number",
      });
  }
  if (body.categories) {
    if (typeof body.categories !== "object")
      return response.status(400).json({
        message: "Categories field must be an array",
      });
  }
  if (body.discount) {
    if (typeof body.discount !== "number")
      return response.status(400).json({
        message: "Discount field must be a number",
      });
  }
  if (body.stock) {
    if (typeof body.stock !== "number")
      return response.status(400).json({
        message: "Stock field must be a number",
      });
  }
  if (body.price) {
    if (typeof body.price !== "number")
      return response.status(400).json({
        message: "Price field must be a number",
      });
  }

  return next();
};

export {
  ensureMovieExistsMiddleware,
  checkCategoryMiddleware,
  validateBodyMiddleware,
};
