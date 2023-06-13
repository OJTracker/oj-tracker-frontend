import React, { useRef, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";

const CustomDoughnut = ({ data, hoverIndex, onClick }) => {
  const chartRef = useRef(null);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Remova a legenda
      },
    },
    onClick: onClick,
  };

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = chartRef.current.chartInstance;
      chartInstance.updateHoverStyle([], {});
      if (
        hoverIndex !== null &&
        chartInstance.getDatasetMeta(0).data.labels[hoverIndex]
      ) {
        chartInstance.updateHoverStyle(
          [chartInstance.getDatasetMeta(0).data.labels[hoverIndex]],
          {}
        );
      }
    }
  }, [hoverIndex]);

  return <Doughnut ref={chartRef} data={data} options={options} />;
};

export default CustomDoughnut;
