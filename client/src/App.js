import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import DepartmentsList from "./components/DepartmentsList";
import DepartmentPage from "./components/DepartmentPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/departments" element={<DepartmentsList />} />
        <Route path="/departments/:id" element={<DepartmentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
