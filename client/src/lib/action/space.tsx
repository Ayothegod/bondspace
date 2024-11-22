

import React from 'react';
import './App.css';

const App = () => {
  return (
    <div className="grid-container">
      {/* First column with 3 rows */}
      <div className="first-column">
        <div className="item">Item 1</div>
        <div className="item">Item 2</div>
        <div className="item">Item 3</div>
      </div>

      {/* Second column occupying all rows */}
      <div className="second-column">
        <div className="item large-item">Item 4</div>
      </div>

      {/* Third column with 3 rows */}
      <div className="third-column">
        <div className="item">Item 5</div>
        <div className="item">Item 6</div>
        <div className="item">Item 7</div>
      </div>
    </div>
  );
};

export default App;


.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr; /* 3 columns with variable widths */
  grid-template-rows: repeat(3, 1fr); /* 3 equal-height rows */
  gap: 1rem; /* Optional spacing between grid items */
  height: 100vh; /* Adjust as needed */
}

.first-column {
  grid-column: 1; /* First column */
  grid-row: 1 / span 3; /* Occupies all 3 rows */
  display: grid;
  grid-template-rows: repeat(3, 1fr); /* 3 rows inside this column */
}

.second-column {
  grid-column: 2; /* Second column */
  grid-row: 1 / span 3; /* Occupies all 3 rows */
}

.third-column {
  grid-column: 3; /* Third column */
  grid-row: 1 / span 3; /* Occupies all 3 rows */
  display: grid;
  grid-template-rows: repeat(3, 1fr); /* 3 rows inside this column */
}

.item {
  background: #f0f0f0;
  border: 1px solid #ccc;
  padding: 1rem;
  text-align: center;
}

.large-item {
  background: #ddd;
  height: 100%; /* Ensure it spans full height */
}
