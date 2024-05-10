import { Provider } from "react-redux";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./pages/ErrorPage";
import { RootLayout } from "./pages/RootLayout";
import { store } from "./store";
import { HomePage } from "./pages/home/HomePage";
import { LoginTokenPage } from "./pages/LoginTokenPage";
import { pageURL } from "./common/url";
import { SearchPage } from "./pages/search/SearchPage";

const router = createBrowserRouter([
  {
    element: (
      <RootLayout>
        <Outlet />
      </RootLayout>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: pageURL.login,
        element: <LoginTokenPage />,
        action: LoginTokenPage.action,
      },
      {
        path: pageURL.search,
        element: <SearchPage />,
        action: SearchPage.action,
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
