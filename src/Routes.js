import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import ListSpreadsheets from "./pages/ListSpreadsheets";
import Spreadsheet from "./pages/Spreadsheet";
import History from "./pages/History";

export default function LocalRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/spreadsheet" element={<ListSpreadsheets />} />
        <Route path="/spreadsheet/:guid" element={<Spreadsheet />} />
        <Route path="/spreadsheet/:guid/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}
