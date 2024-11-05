import React, { useEffect, useState } from "react";
import MyResponsiveLine from "./MyResponsiveLine";

// 누적 데이터를 만드는 공통 함수
const createCumulativeData = (rawData, id) => {
  let cumulativeValue = 0;
  return [
    {
      id: `${id} (Cumulative)`,
      data: rawData.map((entry) => {
        cumulativeValue += parseFloat(entry.value[1]);
        return {
          x: new Date(entry.value[0] * 1000).toLocaleTimeString(),
          y: cumulativeValue,
        };
      }),
    },
  ];
};

const Dashboard = () => {
  const [metricsData, setMetricsData] = useState({});

  useEffect(() => {
    const socket = new WebSocket("ws://13.125.63.134:8000/ws/metrics/");

    socket.onopen = () => {
      console.log("WebSocket Connection Established");
      socket.send(JSON.stringify({ message: "Hello Prometheus" }));
    };

    socket.onmessage = (e) => {
      const receiveData = JSON.parse(e.data);
      const formattedData = {};

      // 각 메트릭을 누적 데이터 형식으로 변환
      formattedData["cpu_usage"] = createCumulativeData(
        receiveData.node_exporter.cpu_usage,
        "CPU Usage"
      );
      formattedData["cpu_core_usage"] = createCumulativeData(
        receiveData.node_exporter.cpu_core_usage,
        "CPU Core Usage"
      );
      formattedData["load_average_1"] = createCumulativeData(
        receiveData.node_exporter.load_average_1,
        "Load Average 1m"
      );
      formattedData["load_average_5"] = createCumulativeData(
        receiveData.node_exporter.load_average_5,
        "Load Average 5m"
      );
      formattedData["load_average_15"] = createCumulativeData(
        receiveData.node_exporter.load_average_15,
        "Load Average 15m"
      );
      formattedData["memory_total"] = createCumulativeData(
        receiveData.node_exporter.memory_total,
        "Memory Total"
      );
      formattedData["memory_used"] = createCumulativeData(
        receiveData.node_exporter.memory_used,
        "Memory Used"
      );
      formattedData["disk_read_write"] = createCumulativeData(
        receiveData.node_exporter.disk_read_write,
        "Disk Read/Write"
      );
      formattedData["network_receive"] = createCumulativeData(
        receiveData.node_exporter.network_receive,
        "Network Receive"
      );
      formattedData["network_transmit"] = createCumulativeData(
        receiveData.node_exporter.network_transmit,
        "Network Transmit"
      );
      formattedData["uptime"] = createCumulativeData(
        receiveData.node_exporter.uptime,
        "Uptime"
      );
      formattedData["reboots"] = createCumulativeData(
        receiveData.node_exporter.reboots,
        "Reboots"
      );

      // Prometheus 메트릭 예시
      formattedData["django_http_requests_total_by_method_total"] =
        receiveData.prometheus.django_http_requests_total_by_method_total.map(
          (entry) => ({
            id: `HTTP Requests (${entry.metric.method})`,
            data: [
              {
                x: entry.metric.method,
                y: parseFloat(entry.value[1]),
              },
            ],
          })
        );

      setMetricsData(formattedData);
    };

    socket.onclose = () => {
      console.log("WebSocket Connection Closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h2>Node Exporter Metrics</h2>
      {Object.keys(metricsData).map((key) => (
        <MyResponsiveLine key={key} data={metricsData[key]} title={key} />
      ))}
    </div>
  );
};

export default Dashboard;
