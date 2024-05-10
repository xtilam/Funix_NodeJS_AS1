import { Suspense } from "react";
import { Await } from "react-router-dom";

const loaddingJSX = (
  <div className="grid items-center gap-4 text-center">
    <div className="loader mx-auto text-4xl" />
    <h3>Loading ...</h3>
  </div>
);

export const waitLoaderRoute = <T,>(
  promise: Promise<T>,
  renderCallback: (data: T) => JSX.Element
) => (
  <Suspense fallback={loaddingJSX}>
    <Await resolve={promise}>{renderCallback}</Await>
  </Suspense>
);
