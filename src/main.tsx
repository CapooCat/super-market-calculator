import React from "react";
import { createRoot } from "react-dom/client";
import App from "../src/App";
import "@/style/index.scss";
import { router } from "@/config/router.config";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
