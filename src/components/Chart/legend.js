import { useState } from "react";

import IconButton from "@mui/material/IconButton";

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import classes from "./chart.module.css";

const ChartLegend = ({ data, onLegendHover }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [hoverIndex, setHoverIndex] = useState(null);

  const itemsPerPage = 10;

  const handleItemClick = (index) => {
    const pageIndex = Math.ceil((index + 1) / itemsPerPage);
    setCurrentPage(pageIndex);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleItems = data.labels.slice(startIndex, endIndex);

  const totalPages = Math.ceil(data.labels.length / itemsPerPage);

  const showPaginationButton = totalPages > 1;

  const handleLegendHover = (index) => {
    setHoverIndex(index);
    onLegendHover(index);
  };

  const legendItems = visibleItems.map((item, index) => (
    <li
      key={`${item} - ${startIndex + index}`}
      onClick={() => handleItemClick(startIndex + index)}
      onMouseEnter={() => handleLegendHover(index)}
      onMouseLeave={() => handleLegendHover(null)}
      className={hoverIndex === index ? classes.active : ""}
      style={{ cursor: "pointer" }}
    >
      <span
        style={{
          display: "inline-block",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: data.datasets[0].backgroundColor[index],
          marginRight: "5px",
        }}
      />
      {item}
    </li>
  ));

  return (
    <>
      <ul style={{ listStyle: "none", padding: 0, marginLeft: "16px" }}>
        {legendItems}
      </ul>
      {showPaginationButton && (
        <div>
          <IconButton
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ArrowLeftIcon />
          </IconButton>
          <IconButton
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ArrowRightIcon />
          </IconButton>
        </div>
      )}
    </>
  );
};

export default ChartLegend;
