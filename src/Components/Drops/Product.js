// ProductsList.js
import React from "react";

const ProductsList = ({ products }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Products List</h2>
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="mb-2 rounded"
              style={{ width: "100%", height: "auto" }}
            />
            <p>{product.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
