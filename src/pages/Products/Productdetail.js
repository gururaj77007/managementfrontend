import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react"; // You need to change "QRCodeSVG" to "QRCode"

const groceryCategories = [
  "Fresh Produce",
  "Dry Goods",
  "Carpentry",
  "Miscellaneous",
  "Electronics",
];

const statusOptions = ["Active", "Inactive"];

function ProductDetail() {
  const [product, setProduct] = useState({});
  const { productId } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Variant state
  const [newVariant, setNewVariant] = useState({
    name: "",
    status: "Active",
    price: 0,
    discount: 0,
  });

  const [editedVariants, setEditedVariants] = useState([]); // Edited variants
  const [editingVariantIndex, setEditingVariantIndex] = useState(null); // Keep track of the currently edited variant

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageUrlChange = (e, index) => {
    const newUrls = [...imageUrls];
    newUrls[index] = e.target.value;
    setImageUrls(newUrls);
  };

  const handleAddImageUrl = () => {
    setImageUrls([...imageUrls, newImageUrl]);
    setNewImageUrl(""); // Clear the input field after adding
  };

  const handleEditVariant = (index) => (e) => {
    const { name, value } = e.target;
    const updatedVariants = [...editedVariants];
    updatedVariants[index] = { ...updatedVariants[index], [name]: value };
    setEditedVariants(updatedVariants);
  };

  const handleSaveEditedVariant = (index) => {
    const updatedVariants = [...product.variants];
    updatedVariants[index] = editedVariants[index];
    setProduct({ ...product, variants: updatedVariants });
    setEditedVariants([]);
    setEditingVariantIndex(null); // Clear the editing variant index
  };

  // Variant input change
  const handleNewVariantChange = (e) => {
    const { name, value } = e.target;
    setNewVariant({ ...newVariant, [name]: value });
  };

  const handleAddVariant = () => {
    setProduct({ ...product, variants: [...product.variants, newVariant] });
    setNewVariant({
      name: "",
      status: "Active",
      price: 0,
      discount: 0,
    });
  };

  useEffect(() => {
    // Fetch product data by ID
    axios
      .get(`http://192.168.29.18:3015/products/${productId}`)
      .then((response) => {
        setProduct(response.data);
        setImageUrls(response.data.imageUrl || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [productId]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const updatedProduct = { ...product, imageUrl: imageUrls };

    // Make a PUT request to update the product
    axios
      .put(`http://192.168.29.18:3015/products/${productId}`, updatedProduct)
      .then((response) => {
        setProduct(response.data);
        setImageUrls(response.data.imageUrl || []);
        setEditedVariants([]);
        setEditingVariantIndex(null); // Clear the editing variant index
        setEditMode(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Product Details</h2>

      <div className="border p-4 rounded-lg shadow-md">
        {editMode ? (
          // Edit Mode
          <form onSubmit={handleEditSubmit}>
            <div className="mb-4">
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-600"
              >
                Product Name:
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={product.productName}
                onChange={handleInputChange}
                className="mt-1 p-2 border rounded-lg w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-600"
              >
                Category:
              </label>
              <select
                id="category"
                name="category"
                value={product.category}
                onChange={handleInputChange}
                className="mt-1 p-2 border rounded-lg w-full"
              >
                {groceryCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="group"
                className="block text-sm font-medium text-gray-600"
              >
                Group:
              </label>
              <input
                type="text"
                id="group"
                name="group"
                value={product.group}
                onChange={handleInputChange}
                className="mt-1 p-2 border rounded-lg w-full"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="houseId"
                className="block text-sm font-medium text-gray-600"
              >
                House ID:
              </label>
              <input
                type="text"
                id="houseId"
                name="houseId"
                value={product.houseId}
                onChange={handleInputChange}
                className="mt-1 p-2 border rounded-lg w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="basevariant"
                className="block text-sm font-medium text-gray-600"
              >
                House ID:
              </label>
              <input
                type="text"
                id="basevariant"
                name="basevariant"
                value={product.basevariant}
                onChange={handleInputChange}
                className="mt-1 p-2 border rounded-lg w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-600"
              >
                Price:
              </label>
              <input
                type="text"
                id="price"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                className="mt-1 p-2 border rounded-lg w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="unit"
                className="block text-sm font-medium text-gray-600"
              >
                Unit:
              </label>
              <input
                type="text"
                id="unit"
                name="unit"
                value={product.unit}
                onChange={handleInputChange}
                className="mt-1 p-2 border rounded-lg w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-600"
              >
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                value={product.Description}
                onChange={handleInputChange}
                className="mt-1 p-2 border rounded-lg w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-600"
              >
                Status:
              </label>
              <select
                id="status"
                name="status"
                value={product.status}
                onChange={handleInputChange}
                className="mt-1 p-2 border rounded-lg w-full"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <h4 className="text-lg font-semibold mt-4">Variants</h4>
            <ul>
              {product.variants.map((variant, index) => (
                <li key={index}>
                  <div className="mb-4">
                    <label
                      htmlFor={`variantName-${index}`}
                      className="block text-sm font-medium text-gray-600"
                    >
                      Variant Name:
                    </label>
                    <input
                      type="text"
                      id={`variantName-${index}`}
                      name={`variantName-${index}`}
                      value={editedVariants[index]?.name || variant.name}
                      onChange={handleEditVariant(index)}
                      className="mt-1 p-2 border rounded-lg w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor={`variantStatus-${index}`}
                      className="block text-sm font-medium text-gray-600"
                    >
                      Status:
                    </label>
                    <select
                      id={`variantStatus-${index}`}
                      name={`variantStatus-${index}`}
                      value={editedVariants[index]?.status || variant.status}
                      onChange={handleEditVariant(index)}
                      className="mt-1 p-2 border rounded-lg w-full"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor={`variantPrice-${index}`}
                      className="block text-sm font-medium text-gray-600"
                    >
                      Price:
                    </label>
                    <input
                      type="text"
                      id={`variantPrice-${index}`}
                      name={`variantPrice-${index}`}
                      value={editedVariants[index]?.price || variant.price}
                      onChange={handleEditVariant(index)}
                      className="mt-1 p-2 border rounded-lg w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor={`variantDiscount-${index}`}
                      className="block text-sm font-medium text-gray-600"
                    >
                      Discount:
                    </label>
                    <input
                      type="text"
                      id={`variantDiscount-${index}`}
                      name={`variantDiscount-${index}`}
                      value={
                        editedVariants[index]?.discount || variant.discount
                      }
                      onChange={handleEditVariant(index)}
                      className="mt-1 p-2 border rounded-lg w-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSaveEditedVariant(index)}
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
                  >
                    Save Variant
                  </button>
                </li>
              ))}
            </ul>
            <div className="  mt-10 mb-4">
              <label
                htmlFor="newVariantName"
                className="block text-sm font-medium text-gray-600"
              >
                New Variant Name:
              </label>
              <input
                type="text"
                id="newVariantName"
                name="newVariantName"
                value={newVariant.name}
                onChange={handleNewVariantChange}
                className="mt-1 p-2 border rounded-lg w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="newVariantStatus"
                className="block text-sm font-medium text-gray-600"
              >
                New Variant Status:
              </label>
              <select
                id="newVariantStatus"
                name="newVariantStatus"
                value={newVariant.status}
                onChange={handleNewVariantChange}
                className="mt-1 p-2 border rounded-lg w-full"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="newVariantPrice"
                className="block text-sm font-medium text-gray-600"
              >
                New Variant Price:
              </label>
              <input
                type="text"
                id="newVariantPrice"
                name="newVariantPrice"
                value={newVariant.price}
                onChange={handleNewVariantChange}
                className="mt-1 p-2 border rounded-lg w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="newVariantDiscount"
                className="block text-sm font-medium text-gray-600"
              >
                New Variant Discount:
              </label>
              <input
                type="text"
                id="newVariantDiscount"
                name="newVariantDiscount"
                value={newVariant.discount}
                onChange={handleNewVariantChange}
                className="mt-1 p-2 border rounded-lg w-full"
              />
              <button
                type="button"
                onClick={handleAddVariant}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
              >
                Add Variant
              </button>
            </div>
            <div className="mb-4">
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-600"
              >
                Image URLs:
              </label>
              {imageUrls.map((url, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    id={`imageUrl-${index}`}
                    name={`imageUrl-${index}`}
                    value={url}
                    onChange={(e) => handleImageUrlChange(e, index)}
                    className="mt-1 p-2 border rounded-lg w-full"
                  />
                  {url && (
                    <img
                      src={url}
                      alt={`Image ${index + 1}`}
                      className="mt-2 max-w-full h-auto"
                    />
                  )}
                </div>
              ))}
              {/* New Image URL Input */}
              <div className="mb-2">
                <input
                  type="text"
                  id="newImageUrl"
                  name="newImageUrl"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Enter a new image URL"
                  className="mt-1 p-2 border rounded-lg w-full"
                />
              </div>
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
              >
                Add Image
              </button>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="ml-2 text-gray-600"
            >
              Cancel
            </button>
          </form>
        ) : (
          // View Mode
          <>
            <h3 className="text-lg font-semibold mb-2">
              {product?.productName}
            </h3>
            <p className="text-gray-600">
              Price: ${product?.price?.toFixed(2) || "N/A"}
            </p>
            <p className="text-gray-600">
              Description: {product?.Description || "N/A"}
            </p>
            <p className="text-gray-600">
              baseVariant: {product?.basevariant || "N/A"}
            </p>
            <p className="text-gray-600 mt-10">
              House ID: {product?.houseId || "N/A"}
            </p>
            <p className="text-gray-600">
              Category: {product?.category || "N/A"}
            </p>
            <p className="text-gray-600">Group: {product?.group || "N/A"}</p>
            <p className="text-gray-600">Status: {product?.status || "N/A"}</p>
            <p className="text-gray-600">Unit: {product?.unit || "N/A"}</p>
            <h4 className="text-lg font-semibold mt-4">Variants</h4>
            {product.variants && product.variants.length > 0 ? (
              <ul>
                {product.variants.map((variant, index) => (
                  <li key={index}>
                    <div className="mb-4">
                      <p className="text-gray-600">
                        Variant Name: {variant.name}
                      </p>
                      <p className="text-gray-600">Status: {variant.status}</p>
                      <p className="text-gray-600">Price: {variant.price}</p>
                      <p className="text-gray-600">
                        Discount: {variant.discount}
                      </p>
                      <button
                        type="button"
                        onClick={() => setEditingVariantIndex(index)}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
                      >
                        Edit Variant
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No variants available</p>
            )}

            <div className="mt-4">
              {product?.imageUrl &&
                product.imageUrl.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="max-w-full h-auto"
                  />
                ))}
              <div className="ml-40">
                <QRCodeSVG value={product._id} />
              </div>
            </div>

            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
