import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.tsx";
import Login from "./routes/login.tsx";
import Play from "./routes/play.tsx";
import Register from "./routes/register.tsx";
import Root, { RootError, Loader as rootLoader } from "./routes/root.tsx";
import Onboard from "./routes/onboard.tsx";
import JoinSpace from "./routes/joinSpace.tsx";
import CreateSpace from "./routes/createSpace.tsx";

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
    path: "/onboard",
    element: <Onboard />,
    errorElement: <RootError />,
    children: [
      {
        path: "join",
        element: <JoinSpace />,
      },
      {
        path: "create",
        element: <CreateSpace />,
      },
    ],
  },
  {
    element: <MainLayout />,
    errorElement: <RootError />,
    // errorElement: <MainLayoutError />,
    children: [
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
