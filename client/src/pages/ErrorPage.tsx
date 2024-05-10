import { useMemo } from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import { RootLayout } from "./RootLayout";

const getCurURL = () => `${window.location.pathname}${window.location.search}`;

export const ErrorPage = () => {
  const reloadClickHandler = () => navigate(redirectURL);
  const err: any = useRouteError();
  const navigate = useNavigate();
  const redirectURL = useMemo(getCurURL, []);
  console.log({ err });
  let message = "Some thing went wrong";

  if (err?.status) {
    switch (err.status) {
      case 404:
        message = "Resource not found";
    }
  }

  const errorDate = new Date();

  return (
    <RootLayout>
      <div className="grid justify-items-start mt-12 min-w-[800px] mx-auto  p-4 text-white">
        <h2>Error: {message}!</h2>
        <i>
          Error Time:
          {" " + errorDate.toISOString()}
        </i>
        <button className="btn" onClick={reloadClickHandler}>
          Reload page
        </button>
      </div>
    </RootLayout>
  );
};
