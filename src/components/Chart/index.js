import { Doughnut } from "react-chartjs-2";
import { useState } from "react";
import ChartLegend from "./legend";

const Chart = ({ data, onClick }) => {
  // eslint-disable-next-line
  const [hoverIndex, setHoverIndex] = useState(null);

  const handleLegendHover = (index) => {
    setHoverIndex(index);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    onClick: onClick,
  };

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          flex: 2,
          width: "250px",
          height: "250px",
          marginTop: "16px",
        }}
      >
        <Doughnut data={data} options={options} />
      </div>
      <div style={{ flex: 1 }}>
        <ChartLegend data={data} onLegendHover={handleLegendHover} />
      </div>
    </div>
  );
};

export default Chart;
