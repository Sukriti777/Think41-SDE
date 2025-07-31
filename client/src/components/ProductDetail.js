import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch(() => setError(true));
  }, [id]);

  if (error) return <p>Product not found.</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <Link to="/">← Back to Products</Link>
      <h1>{product.name}</h1>
      <p><strong>Brand:</strong> {product.brand}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Price:</strong> ₹{product.retail_price}</p>
      <p><strong>Department:</strong> {product.department}</p>
      <p><strong>SKU:</strong> {product.sku}</p>
    </div>
  );
}

export default ProductDetail;
