import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function DepartmentPage() {
  const { id } = useParams();
  const [department, setDepartment] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:3001/api/departments/${id}`).then((res) => res.json()),
      fetch(`http://localhost:3001/api/departments/${id}/products`).then((res) => res.json()),
    ])
      .then(([deptData, productData]) => {
        setDepartment(deptData.name);
        setProducts(productData.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading department...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{department} Department</h2>
      <p>{products.length} product(s) found</p>
      <Link to="/">← Back to All Products</Link>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 20 }}>
        {products.length === 0 ? (
          <p>No products found in this department.</p>
        ) : (
          products.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ border: "1px solid #ccc", padding: 10 }}>
                <h3>{product.name}</h3>
                <p>₹{product.retail_price}</p>
                <p><strong>{product.brand}</strong></p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default DepartmentPage;
