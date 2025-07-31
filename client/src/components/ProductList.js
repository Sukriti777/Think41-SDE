import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Products</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {products.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ border: "1px solid #ccc", padding: 10 }}>
              <h3>{product.name}</h3>
              <p>₹{product.retail_price}</p>
              <p><strong>{product.brand}</strong></p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
