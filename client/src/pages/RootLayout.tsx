import { createPortal } from "react-dom";
import NavBar from "../components/app/layout/NavBar";
import { Suspense, useEffect, useState } from "react";
import { storage } from "../storage/storage";
import { appAPI } from "../api/appAPI";
import { getDetailRespError } from "../api/axios-client";
import { store } from "../store";
import { authSlice } from "../store/auth-slice";
import { Await } from "react-router-dom";
import { utils } from "../utils/utils";

let tryFirstLogin = () => {
  const loginPromise = (async () => {
    const clearUser = () => {
      store.dispatch(authSlice.actions.logout());
      storage.auth.clear();
    };
    // ----------------------------------------------
    const userToken = storage.auth.read()?.token;
    if (!userToken) return;

    while (true) {
      const [resp, error] = await appAPI.getAuth(userToken).safe();
      if (error) {
        const { network } = getDetailRespError(error);
        if (network) continue;
      }
      if (!resp.user) return clearUser();
      break;
    }

    console.log("login done!");
  })();
  return (tryFirstLogin = () => loginPromise)();
};

export const RootLayout = ({ children }) => {
  const [isLogging, setLogging] = useState(
    !utils.isPromiseResolved(tryFirstLogin())
  );

  useEffect(() => {
    if (!isLogging) return;
    tryFirstLogin().then(() => setLogging(false));
  }, []);

  if (isLogging) {
    return (
      <div className="mx-auto w-full text-3xl grid justify-items-center mt-4 gap-4">
        <div className="loader"></div>
        <h2>Logging ...</h2>
      </div>
    );
  }

  return (
    <>
      <header className="grid">
        <NavBar />
      </header>
      <section className="grid mx-auto">{children}</section>
    </>
  );
};
