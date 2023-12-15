import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  // Define the CSS styles for the active class
  const activePageStyle = {
    backgroundColor: "#007bff", // Fill color for the circle
    color: "white", // Text color for the current page
    borderRadius: "50%", // Make it a circle
    width: "30px", // Adjust the size of the circle as needed
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  return (
    <nav>
      <ul className="pagination flex space-x-2">
        {pageNumbers.map((pageNumber) => (
          <li
            key={pageNumber}
            className={`page-item ${
              pageNumber === currentPage ? "active" : ""
            }`}
          >
            <button
              className="page-link"
              style={pageNumber === currentPage ? activePageStyle : {}}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Pagination;
