import { appAPI } from "../../api/appAPI";
import { SearchForm } from "./SearchForm";
import { SearchResult } from "./SearchResult";

export const SearchPage = () => {
  return (
    <div className="grid gap-4 p-5">
      <SearchForm />
      <SearchResult />
    </div>
  );
};

const action = async ({ request }) => {
  const data: any = Object.fromEntries((await request.formData()).entries());
  const [results, error] = await appAPI.searchMovie(data).safe();
  console.log(error?.message, error);
  return [results?.results, error?.message] as const;
};

// ----------------------------------------------
SearchPage.action = action;
