import React, { useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import style from "./MyResponsiveLine.module.css";

const MyResponsiveLine = ({ data, title }) => {
  const [width, setWidth] = useState(800); // 넓이만 상태로 설정
  const MIN_WIDTH = 800;
  const FIXED_HEIGHT = 300; // 고정 높이

  const handleDrag = (e) => {
    // 새로운 너비 계산
    const newWidth = Math.max(
      MIN_WIDTH,
      e.clientX - e.target.parentElement.offsetLeft
    );
    setWidth(newWidth);
  };

  return (
    <div
      className={style.graph_card}
      style={{
        width: `${width}px`,
        height: `${FIXED_HEIGHT}px`, // 고정 높이 사용
        marginBottom: "20px",
      }}
    >
      <h3>{title}</h3>
      <div
        style={{
          width: "100%",
          height: `calc(100% - 40px)`, // h3 태그 높이 고려
        }}
      >
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: false,
            reverse: false,
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Time",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Value",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          colors={{ scheme: "nivo" }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              translateX: 100,
              itemWidth: 80,
              itemHeight: 20,
              symbolSize: 12,
            },
          ]}
        />
      </div>
      <div className={style.resize_handle} draggable onDrag={handleDrag}></div>
    </div>
  );
};

export default MyResponsiveLine;
