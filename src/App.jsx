
import { useState, useEffect } from "react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/products";

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    productName: "",
    category: "",
    price: "",
    quantity: "",
    description: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // READ products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // CREATE or UPDATE product
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const productData = {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity)
    };

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage(
        editingId
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Load product into form for editing
  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      productName: product.productName,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      description: product.description || ""
    });

    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // DELETE product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setMessage("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      productName: "",
      category: "",
      price: "",
      quantity: "",
      description: ""
    });

    setEditingId(null);
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div>
          <h1>Product Management</h1>
          <p>Manage your inventory in one place.</p>
        </div>
        <span className="total">
          Total Products: {products.length}
        </span>
      </header>

      {error && <div className="alert error">{error}</div>}
      {message && <div className="alert success">{message}</div>}

      <section className="form-section">
        <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input
              type="text"
              name="productName"
              placeholder="Product name"
              value={form.productName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              min="0"
              step="1"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <textarea
            name="description"
            placeholder="Product description"
            value={form.description}
            onChange={handleChange}
            rows="3"
          />

          <div className="form-buttons">
            <button type="submit" className="primary-btn">
              {editingId ? "Update Product" : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="table-section">
        <h2>Product Inventory</h2>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p className="empty">No products found. Add your first product!</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.productName}</td>
                    <td>{product.category}</td>
                    <td>{product.price}</td>
                    <td>{product.quantity}</td>
                    <td>{product.description}</td>
                    <td>
                      <div className="actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
