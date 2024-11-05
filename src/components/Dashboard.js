import React, { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";

const MyResponsiveLine = ({ data }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      min: "auto",
      max: "auto",
      stacked: true,
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
);

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://13.125.63.134:8000/ws/metrics/");

    socket.onopen = () => {
      console.log("WebSocket Connection Established");
      socket.send(JSON.stringify({ message: "Hello Prometheus" }));
    };

    socket.onmessage = (e) => {
      const receiveData = JSON.parse(e.data);

      // 예: cpu_usage 데이터 변환
      const formattedData = [
        {
          id: "cpu_usage",
          color: "hsl(158, 70%, 50%)",
          data: receiveData.node_exporter.cpu_usage.map((entry) => ({
            x: new Date(entry.value[0] * 1000).toLocaleTimeString(), // 타임스탬프를 x 축으로 변환
            y: parseFloat(entry.value[1]), // y 축은 값으로 변환
          })),
        },
      ];

      setChartData(formattedData);
    };

    socket.onclose = () => {
      console.log("WebSocket Connection Closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div style={{ height: "500px" }}>
      {chartData.length > 0 ? (
        <MyResponsiveLine data={chartData} />
      ) : (
        <h1>Waiting for Data...</h1>
      )}
    </div>
  );
};

export default Dashboard;
