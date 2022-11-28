import React from "react";
import ReactDOM from 'react-dom/client';
import './index.css';
import TeamData from "./data/teams.json";
import HeaderBar from "./components/HeaderBar";
import Calendar, { loader as calendarLoader } from "./components/Calendar";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./pages/error-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HeaderBar data={TeamData} />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "c/:teamId",
        element: <Calendar />,
        loader: calendarLoader,
      },
      {
        path: "about",
        element: <div>A propos...</div>
      }
    ],
  },
]);

console.log(process.env);
console.log(process.env.URL);
process.env.MAIN_URL = "hello";
console.log(process.env.MAIN_URL);



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="antialiased">
      <div className="absolute z-0 top-0 inset-x-0 overflow-hidden pointer-events-none flex justify-end">
        <div className="w-[71.75rem] max-w-none flex-none">
          <img
            src={`${process.env.URL}/img/bg-green.avif`}
            alt="background"
          />
        </div>
      </div>
      <div className="font-custom">
        <RouterProvider router={router} />
      </div>
    </div>
  </React.StrictMode>
);