import {
  Form,
  Navigate,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { IconSearch } from "../../awesome";
import { TextField } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { useState } from "react";
import { useValidation } from "../../hooks/use-validation";
import { useAppSelector } from "../../store";
import { pageURL } from "../../common/url";
import { movieGenre } from "../../common/constants";
import { SearchPage } from "./SearchPage";
import { Alert } from "../../components/ui/Alert";

export const SearchForm = () => {
  // ----------------------------------------------
  // Handlers
  const submitHandler = (evt) => {
    let hasError = false;

    inputs.forEach((input) => {
      if (input.validate()) return;
      hasError = true;
    });
    if (hasError) return evt.preventDefault();
  };
  const resetHandler = () => {
    keyword.setValue("");
    year.setValue("");
    setGenreId("");
    setLang("");
    setMediaType("");
  };
  // ----------------------------------------------
  const [, errorMessage] = (useActionData() as ActionResult) || [];
  const isSubmitting = useNavigation().state === "submitting";

  const user = useAppSelector((store) => store.auth.user);
  const keyword = useValidation((v) => v.convertTrim().notEmpty(), "");
  const year = useValidation((v) => {
    v.convertTrim();
    if (!v.stringValue()) return true;
    return v.numberRange(1900, Number(new Date().getFullYear()) + 1);
  }, "");

  const inputs = [keyword, year];
  const [genreId, setGenreId] = useState("");
  const [lang, setLang] = useState("");
  const [mediaType, setMediaType] = useState("");

  if (!user) return <Navigate to={pageURL.login} />;

  return (
    <Form
      method="POST"
      onSubmit={submitHandler}
      className="border w-full max-w-[600px] mx-auto mt-24 grid gap-4 px-4 py-6"
    >
      <div className="flex items-center gap-3">
        <IconSearch />
        <h2>Search</h2>
        {isSubmitting && (
          <div className="flex gap-2 items-center ml-auto text-warning font-medium">
            <div className="loader"></div>
            <div>Đang tìm kiếm</div>
          </div>
        )}
      </div>
      {errorMessage && (
        <Alert>
          <div className="bg-danger">{errorMessage}</div>
        </Alert>
      )}
      <TextField
        label="Keyword"
        error={keyword.error}
        name="keyword"
        {...keyword.inputProps}
      />
      <Select
        label="Genre"
        className="text-white"
        name="genre"
        value={genreId}
        onChange={({ target }) => setGenreId(target.value)}
      >
        <option value="">All</option>
        {genreOptionsJSX}
      </Select>
      <Select
        label="Language"
        name="language"
        value={lang}
        onChange={({ target }) => setLang(target.value)}
      >
        <option value="">All</option>
        {langOptionsJSX}
      </Select>
      <Select
        label="Media Type"
        name="mediaType"
        value={mediaType}
        onChange={({ target }) => setMediaType(target.value)}
      >
        <option value="">All</option>
        {mediaTypeOptionsJSX}
      </Select>

      <TextField
        name="year"
        label="Year"
        error={year.error}
        {...year.inputProps}
      ></TextField>
      <div className="flex gap-2 ml-auto">
        <button className="btn-secondary" onClick={resetHandler} type="button">
          Reset
        </button>
        <button className="btn-secondary" disabled={isSubmitting}>
          <span>Search</span>
        </button>
      </div>
    </Form>
  );
};

// ----------------------------------------------
// Options JSX
const genreOptionsJSX = Object.entries(movieGenre).map(([key, value]) => {
  return (
    <option value={value} key={key}>
      {key.slice(0, 1).toUpperCase() + key.slice(1)}
    </option>
  );
});
const langOptionsJSX = Object.entries({
  en: "English",
  ja: "Japan",
  ko: "Korea",
}).map(([lang, langText]) => (
  <option key={lang} value={lang}>
    {langText}
  </option>
));

const mediaTypeOptionsJSX = Object.entries({
  movie: "Movie",
  tv: "TV",
  person: "Person",
}).map(([type, typeText]) => (
  <option key={type} value={type}>
    {typeText}
  </option>
));

// ----------------------------------------------
type ActionResult = Awaited<ReturnType<(typeof SearchPage)["action"]>>;
