import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.tsx";
import Home from "./routes/home.tsx";
import Login from "./routes/login.tsx";
import Register from "./routes/register.tsx";
import Root, { RootError, Loader as rootLoader } from "./routes/root.tsx";
import Play from "./routes/play.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <RootError />,
    loader: rootLoader,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <RootError />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <RootError />,
  },
  {
    element: <MainLayout />,
    errorElement: <RootError />,
    // errorElement: <MainLayoutError />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/play",
        element: <Play />,
      },
    ],
  },
]);

export default function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
