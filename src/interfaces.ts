import { QueryResult } from "pg";

type RequiredKeys =
  | "name"
  | "duration"
  | "description"
  | "price"
  | "categories"
  | "discount"
  | "stock";

interface IMovie {
  id: number;
  name: string;
  description?: string | null;
  duration: number;
  price: number;
  discount?: number | undefined;
  stock?: number | undefined;
}

interface IPagination {
  prevPage: string | null;
  nextPage: string | null;
  count: number;
  data: IMovie[];
}

// CATEGORIES PODE POSSUIR APENAS OS DADOS CONTIDOS NA TIPAGEM
type TypesInputCategories =
  | "Drama"
  | "Suspense"
  | "Terror"
  | "Comédia"
  | "Ação"
  | "Aventura";

type MovieResult = QueryResult<IMovie>;
type MovieCreate = Omit<IMovie, "id">;

export {
  IMovie,
  MovieResult,
  MovieCreate,
  IPagination,
  TypesInputCategories,
  RequiredKeys,
};
