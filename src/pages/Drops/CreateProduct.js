import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function CreateProduct() {
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const { collection } = useParams();
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    houseId: "",
    category: "",
    basevariant: "",
    status: "Active",
    basevariant: "",
    imageUrl: [],
    discount: "",
    discountPercentage: "",
    Description: "",
    unit: "",
    variants: [], // Add the variants field as an empty array
    group: "",
  });

  const groceryCategories = [
    "Fresh Produce",
    "Dry Goods",
    "Carpentry",
    "Miscellaneous",
    "Electronics", // Add the Electronics category
  ];

  // Calculate discountPercentage whenever discount or price changes
  useEffect(() => {
    if (!isNaN(formData.discount) && !isNaN(formData.price)) {
      const discountValue = parseFloat(formData.discount);
      const priceValue = parseFloat(formData.price);
      if (priceValue > 0) {
        const percentage = ((discountValue / priceValue) * 100).toFixed(2);
        setDiscountPercentage(percentage);
        setFormData({
          ...formData,
          discountPercentage: percentage, // Set discountPercentage
        });
      }
    } else {
      setDiscountPercentage(0);
      setFormData({
        ...formData,
        discountPercentage: "", // Reset discountPercentage
      });
    }
  }, [formData.discount, formData.price]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRemoveImage = (index) => {
    const updatedImageUrls = [...formData.imageUrl];
    updatedImageUrls.splice(index, 1); // Remove the image URL at the specified index
    setFormData({
      ...formData,
      imageUrl: updatedImageUrls,
    });
  };

  const handleImageUrlInput = (event) => {
    const imageUrl = event.target.value;
    setFormData({
      ...formData,
      imageUrl: [...formData.imageUrl, imageUrl],
    });
    event.target.value = ""; // Clear the input field
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        {
          name: "",
          status: "Active",
          price: "",
          discount: "",
        },
      ],
    });
  };

  const removeVariant = (index) => {
    const updatedVariants = [...formData.variants];
    updatedVariants.splice(index, 1);
    setFormData({
      ...formData,
      variants: updatedVariants,
    });
  };

  const handleVariantChange = (event, index) => {
    const { name, value } = event.target;
    const updatedVariants = [...formData.variants];
    updatedVariants[index][name] = value;
    setFormData({
      ...formData,
      variants: updatedVariants,
    });
  };

  const Submit = async (event) => {
    try {
      const response = await axios.post(
        "http://localhost:3025/drops/resourceallocation/createProduct",
        { collection: collection, product: formData }
      );

      console.log("Product created:", response.data);
      window.alert("Product created successfully!");

      setFormData({
        productName: "",
        price: "",
        houseId: "",
        category: "",
        basevariant: "",
        status: "Active",
        basevariant: "",
        imageUrl: [],
        discount: "",
        discountPercentage: "",
        Description: "",
        unit: "",
        variants: [], // Clear the variants as well
        group: "",
      });

      // Reset the discount percentage
      setDiscountPercentage(0);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Create Product</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="max-w-md mx-auto"
      >
        <div className="mb-4">
          <label
            htmlFor="productName"
            className="block text-sm font-medium text-gray-700"
          >
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            className="form-input mt-1 block w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="form-input mt-1 block w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="unit"
            className="block text-sm font-medium text-gray-700"
          >
            Unit
          </label>
          <input
            type="text"
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            className="form-input mt-1 block w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="basevariant"
            className="block text-sm font-medium text-gray-700"
          >
            BaseVariant
          </label>
          <input
            type="text"
            id="basevariant"
            name="basevariant"
            value={formData.basevariant}
            onChange={handleInputChange}
            className="form-input mt-1 block w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="houseId"
            className="block text-sm font-medium text-gray-700"
          >
            House ID
          </label>
          <input
            type="text"
            id="houseId"
            name="houseId"
            value={formData.houseId}
            onChange={handleInputChange}
            className="form-input mt-1 block w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="form-select mt-1 block w-full"
            required
          >
            <option value="">Select a category</option>
            {groceryCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="form-select mt-1 block w-full"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Image URLs
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            placeholder="Enter image URLs as text and press Enter"
            onKeyUp={(event) => {
              if (event.key === "Shift") {
                handleImageUrlInput(event);
              }
            }}
            className="form-input mt-1 block w-full"
          />
          {/* Display entered image URLs */}
          {formData.imageUrl.length > 0 && (
            <div className="mb-4">
              <p>Selected Images:</p>
              {formData.imageUrl.map((url, index) => (
                <div key={index} className="flex items-center my-2">
                  <img src={url} alt={`Image ${index}`} className="mr-2" />
                  <button
                    type="button"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleRemoveImage(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="group"
            className="block text-sm font-medium text-gray-700"
          >
            Group
          </label>
          <input
            type="text"
            id="group"
            name="group"
            value={formData.group}
            onChange={handleInputChange}
            className="form-input mt-1 block w-full"
          />
        </div>

        {/* Variant section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Variants
          </label>
          {formData.variants.map((variant, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                name="name"
                placeholder="Variant Name"
                value={variant.name}
                onChange={(event) => handleVariantChange(event, index)}
                className="form-input mt-1 block w-full"
              />
              <input
                type="number"
                name="price"
                placeholder="Variant Price"
                value={variant.price}
                onChange={(event) => handleVariantChange(event, index)}
                className="form-input mt-1 block w-full"
              />
              <input
                type="number"
                name="discount"
                placeholder="Variant Discount"
                value={variant.discount}
                onChange={(event) => handleVariantChange(event, index)}
                className="form-input mt-1 block w-full"
              />
              <select
                name="status"
                value={variant.status}
                onChange={(event) => handleVariantChange(event, index)}
                className="form-select mt-1 block w-full"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="text-red-600 hover:text-red-800 mt-2"
              >
                Remove Variant
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            className="text-blue-500 hover:text-blue-700 mt-2"
          >
            Add Variant
          </button>
        </div>

        <div className="mb-4">
          <label
            htmlFor="discount"
            className="block text-sm font-medium text-gray-700"
          >
            Discount
          </label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={formData.discount}
            onChange={handleInputChange}
            className="form-input mt-1 block w-full"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="Description"
            name="Description"
            value={formData.Description}
            onChange={handleInputChange}
            className="form-textarea mt-1 block w-full"
            rows="4"
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="discountPercentage"
            className="block text-sm font-medium text-gray-700"
          >
            Discount Percentage
          </label>
          <input
            type="text"
            id="discountPercentage"
            name="discountPercentage"
            value={`${discountPercentage}%`}
            disabled
            className="form-input mt-1 block w-full"
          />
        </div>
        <div className="mb-4">
          <button
            //type="submit"
            onClick={(e) => {
              Submit();
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProduct;
