import React from "react";
import ReactDOM from 'react-dom/client';
import './index.css';
import TeamData from "./data/teams.json";
import HeaderBar from "./components/HeaderBar";
import Calendar, { loader as calendarLoader, defaultLoader as defaultCalendarLoader } from "./components/Calendar";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./pages/error-page";
import AboutPage from "./pages/about-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HeaderBar data={TeamData} />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "c/:teamId",
        element: <Calendar display_past={false} />,
        loader: calendarLoader,
      },
      {
        path: "",
        element: <Calendar display_past={false} />,
        loader: defaultCalendarLoader,
      },
      {
        path: "about",
        element: <AboutPage />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="antialiased">
      <div className="absolute z-0 top-0 inset-x-0 overflow-hidden pointer-events-none flex justify-end">
        <div className="w-[71.75rem] max-w-none flex-none">
          <img
            src={`${process.env.PUBLIC_URL}/img/bg-green.avif`}
            alt="background"
          />
        </div>
      </div>
      <RouterProvider router={router} />
      <footer className="flex text-sm px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 max-w-[1280px] mx-auto text-[#334155]">
        <p>
          Créé par <a href="https://www.simonmyway.com/?ref=calabssa" className="underline">Simon Myway</a>
        </p>
        <p className="ml-auto text-right">
          Code open source sur <a href="https://github.com/simonpicard/calabssa.be" className="underline">GitHub</a>
        </p>
      </footer>
    </div>
  </React.StrictMode>
);