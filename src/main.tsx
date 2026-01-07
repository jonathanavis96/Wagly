import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BringWaglyHome from "./pages/BringWaglyHome";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bring-wagly-home" element={<BringWaglyHome />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
