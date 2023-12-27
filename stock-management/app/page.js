"use client"
import { useState, useEffect } from 'react';
import Header from '@/components/header';
export default function Home() {
  const [productForm, setProductForm] = useState({
    slug: '',
    quantity: '',
    price: '',
  });
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState('');
  const [loading, setLoading] = useState(false);
  const [dropdown, setDropdown] = useState([]);
  const [query, setQuery] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/pdt');
        if (response.ok) {
          const { products } = await response.json();
          setProducts(products);
        } else {
          console.error('Failed to fetch products. Server returned an error.');
        }
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };

    fetchProducts();
  }, []);

  const buttonAction = async (action, slug, initialQuantity) => {
    console.log('Performing action:', action, 'on slug:', slug);
    setLoadingAction(true);

    try {
      const response = await fetch('/api/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, slug, initialQuantity }),
      });

      if (response.ok) {
        console.log('Action performed successfully. Fetching updated products...');
        
        // Fetch the updated quantity after the action
        const updatedResponse = await fetch('/api/pdt');
        if (updatedResponse.ok) {
          const { products: updatedProducts } = await updatedResponse.json();
          console.log('Updated products:', updatedProducts);
          
          setProducts(updatedProducts);
          // Close the dropdown after the action
          setDropdown([]);
        } else {
          console.error('Failed to fetch updated products. Server returned an error.');
        }
      } else {
        console.error('Failed to perform action. Server returned an error.');
      }
    } catch (error) {
      console.error('Error performing action:', error.message);
    } finally {
      setLoadingAction(false);
    }
  };
  

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/pdt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        setProductForm({
          slug: '',
          quantity: '',
          price: '',
        });
        console.log('Product added successfully!');
        setAlert('Your product has been successfully added!');
      } else {
        console.error('Failed to add product. Server returned an error.');
      }
    } catch (error) {
      console.error('Error adding product:', error.message);
    }
  };

  const handleChange = (e) => {
    setProductForm((prevForm) => ({ ...prevForm, [e.target.name]: e.target.value }));
  };

  const onDropdownEdit = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 3) {
      setLoading(true);

      try {
        const response = await fetch('/api/search?query=' + value);
        if (response.ok) {
          const { products: searchResults } = await response.json();
          setDropdown(searchResults);
        } else {
          console.error('Failed to fetch search options. Server returned an error.');
        }
      } catch (error) {
        console.error('Error fetching search options:', error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setDropdown([]);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-8 bg-gray-100">
        <div className="text-green-800 text-center">{alert}</div>
        {/* Search a product section (full-width) */}
        <div className="w-full bg-white p-6 rounded-lg mb-8">
          <h1 className="text-2xl font-bold mb-4">Search a product</h1>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="searchProduct">
              Product Name:
            </label>
            <input
              type="text"
              id="searchProduct"
              name="searchProduct"
              className="w-full border rounded px-3 py-2"
              onChange={onDropdownEdit}
              onBlur={() => setDropdown([])}
            />

            {loading && (
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="30" r="15" fill="blue">
                  <animate attributeName="cy" values="30;70;30" dur="1s" keyTimes="0;0.5;1" repeatCount="indefinite" />
                </circle>
              </svg>
            )}
            <div className="dropcontainer rounded-md">
              {dropdown.map((item) => (
                <div key={item.slug} className="flex items-center justify-between bg-yellow-200 my-3 border border-b-2 rounded-md p-3">
                  <div className="flex items-center">
                    <span className="slug font-semibold">
                      {item.slug} ({item.quantity} available for ₹{item.price})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      disabled={loadingAction}
                      className="bg-yellow-500 text-white cursor-pointer px-3 py-1 rounded-md shadow-md cursor-pointer disabled:bg-yellow-200"
                      onClick={() => buttonAction('minus', item.slug, item.quantity)}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      disabled={loadingAction}
                      className="bg-yellow-500 text-white cursor-pointer px-3 py-1 rounded-md shadow-md cursor-pointer disabled:bg-yellow-200"
                      onClick={() => buttonAction('plus', item.slug, item.quantity)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category:
            </label>
            {/* Dropdown/select for category */}
            <select id="category" name="category" className="w-full border rounded px-3 py-2">
              <option value="">Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              {/* Add more options as needed */}
            </select>
          </div>
          {/* Add more search criteria or dropdowns as needed */}
        </div>

        {/* Add a product form */}
        <div className="w-full bg-white p-6 rounded-lg mb-8">
          <h1 className="text-2xl font-bold mb-4">Add a product</h1>
          <form className="mb-8">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productName">
                Product Slug:
              </label>
              <input
                onChange={handleChange}
                type="text"
                id="productName"
                name="slug"
                className="w-full border rounded px-3 py-2"
                value={productForm.slug}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                Quantity:
              </label>
              <input
                onChange={handleChange}
                type="number"
                id="quantity"
                name="quantity"
                className="w-full border rounded px-3 py-2"
                value={productForm.quantity}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                Price:
              </label>
              <input
                onChange={handleChange}
                type="text"
                id="price"
                name="price"
                className="w-full border rounded px-3 py-2"
                value={productForm.price}
              />
            </div>
            <button
              onClick={addProduct}
              type="submit"
              className="bg-yellow-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-yellow-600 focus:outline-none focus:ring focus:border-yellow-700"
            >
              Add Product
            </button>
          </form>
        </div>

        {/* Display Current Stock table */}
        <div className="w-full bg-white p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Display Current Stock</h1>
          {/* Table to display stocks */}
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="border px-4 py-2">Product</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {/* Add rows for products */}
              {products.map((product) => (
                <tr key={product.slug}>
                  <td className="border px-4 py-2">{product.slug}</td>
                  <td className="border px-4 py-2">{product.quantity}</td>
                  <td className="border px-4 py-2">₹{product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
