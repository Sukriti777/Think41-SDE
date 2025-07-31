import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function DepartmentsList() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/departments")
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data.departments);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading departments...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Departments</h2>
      <ul>
        {departments.map((dept) => (
          <li key={dept.id}>
            <Link to={`/departments/${dept.id}`}>
              {dept.name} ({dept.product_count})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DepartmentsList;
