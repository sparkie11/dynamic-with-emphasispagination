import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(5);
  const [skips, setSkips] = useState(0);
  const [limits, setLimits] = useState(5);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const link = `https://dummyjson.com/products?skip=${skips}&limit=${limits}&select=title,price,rating,id`;
        const response = await fetch(link);
        const data = await response.json();
        setProducts(data.products);
        setTotal(data.total);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [skips, limits]);

  const handleOpts = (e) => {
    const value = parseInt(e.target.value);
    setProductsPerPage(value);
    setCurrentPage(1);
    setSkips(0);
    setLimits(value);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSkips((pageNumber - 1) * productsPerPage);
  };

  const totalPages = Math.ceil(total / productsPerPage);

  return (
    <div className="mt-4 bg-success">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Title</th>
            <th scope="col">Price</th>
            <th scope="col">Rating</th>
            <th scope="col">
              <select
                id="productsPerPage"
                onChange={handleOpts}
                value={productsPerPage}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.title}</td>
              <td>{product.price}</td>
              <td>{product.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
      />
    </div>
  );
}

function Pagination({ currentPage, totalPages, paginate }) {
  const pageNumbers = [];

  const MAX_VISIBLE_PAGES = 5; // Maximum number of visible pages

  if (totalPages <= MAX_VISIBLE_PAGES) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    const halfVisiblePages = Math.floor(MAX_VISIBLE_PAGES / 2);
    let startPage = currentPage - halfVisiblePages;
    let endPage = currentPage + halfVisiblePages;

    if (startPage <= 0) {
      startPage = 1;
      endPage = MAX_VISIBLE_PAGES;
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = totalPages - MAX_VISIBLE_PAGES + 1;
    }

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }
  }

  return (
    <nav>
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            onClick={() => paginate(currentPage - 1)}
            className="page-link"
          >
            Previous
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${currentPage === number ? "active" : ""}`}
          >
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            onClick={() => paginate(currentPage + 1)}
            className="page-link"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}

function App() {
  return (
    <div className="App">
      <div className="container bg-danger">
        <ProductList />
      </div>
    </div>
  );
}

export default App;
