import "./index.css";

import Calendar, {
  loader as calendarLoader,
  defaultLoader as defaultCalendarLoader,
} from "./components/Calendar";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import AboutPage from "./pages/about-page";
import ErrorPage from "./pages/error-page";
import MainPage from "./pages/main-page";
import React from "react";
import ReactDOM from "react-dom/client";
import TeamData from "./data/teams.json";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage data={TeamData} />,
    errorElement: <ErrorPage data={TeamData} />,
    children: [
      {
        path: "c/:teamId",
        element: <Calendar />,
        loader: calendarLoader,
      },
      {
        path: "",
        element: <Calendar />,
        loader: defaultCalendarLoader,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
