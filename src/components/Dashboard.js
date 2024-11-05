import React, { useEffect, useState } from "react";
import MyResponsiveLine from "./MyResponsiveLine";

// 새로운 데이터를 기존 데이터에 추가하여 누적하는 함수
const appendData = (existingData, newEntry) => {
  const time = new Date(newEntry.value[0] * 1000).toLocaleTimeString();
  const value = parseFloat(newEntry.value[1]);

  // 값이 유효한지 확인하고, 그렇지 않다면 데이터를 추가하지 않음
  if (!isNaN(value) && value !== undefined && value !== null) {
    return [
      ...existingData,
      {
        x: time,
        y: value,
      },
    ];
  }

  // 유효하지 않은 경우 기존 데이터 반환
  return existingData;
};

const Dashboard = () => {
  const [metricsData, setMetricsData] = useState({
    cpu_usage: [],
    cpu_core_usage: [],
    load_average_1: [],
    load_average_5: [],
    load_average_15: [],
    memory_total: [],
    memory_used: [],
    disk_read_write: [],
    network_receive: [],
    network_transmit: [],
    uptime: [],
  });

  useEffect(() => {
    const socket = new WebSocket("ws://13.125.63.134:8000/ws/metrics/");

    socket.onopen = () => {
      console.log("WebSocket Connection Established");
      socket.send(JSON.stringify({ message: "Hello Prometheus" }));
    };

    socket.onmessage = (e) => {
      const receiveData = JSON.parse(e.data);

      // 데이터를 누적하여 갱신
      setMetricsData((prevData) => ({
        cpu_usage: appendData(
          prevData.cpu_usage,
          receiveData.node_exporter.cpu_usage[0],
          "CPU Usage"
        ),
        cpu_core_usage: appendData(
          prevData.cpu_core_usage,
          receiveData.node_exporter.cpu_core_usage[0],
          "CPU Core Usage"
        ),
        load_average_1: appendData(
          prevData.load_average_1,
          receiveData.node_exporter.load_average_1[0],
          "Load Average 1m"
        ),
        load_average_5: appendData(
          prevData.load_average_5,
          receiveData.node_exporter.load_average_5[0],
          "Load Average 5m"
        ),
        load_average_15: appendData(
          prevData.load_average_15,
          receiveData.node_exporter.load_average_15[0],
          "Load Average 15m"
        ),
        memory_total: appendData(
          prevData.memory_total,
          receiveData.node_exporter.memory_total[0],
          "Memory Total"
        ),
        memory_used: appendData(
          prevData.memory_used,
          receiveData.node_exporter.memory_used[0],
          "Memory Used"
        ),
        disk_read_write: appendData(
          prevData.disk_read_write,
          receiveData.node_exporter.disk_read_write[0],
          "Disk Read/Write"
        ),
        network_receive: appendData(
          prevData.network_receive,
          receiveData.node_exporter.network_receive[0],
          "Network Receive"
        ),
        network_transmit: appendData(
          prevData.network_transmit,
          receiveData.node_exporter.network_transmit[0],
          "Network Transmit"
        ),
        uptime: appendData(
          prevData.uptime,
          receiveData.node_exporter.uptime[0],
          "Uptime"
        ),
      }));
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
        <MyResponsiveLine
          key={key}
          data={[{ id: key, data: metricsData[key] }]}
          title={key}
        />
      ))}
    </div>
  );
};

export default Dashboard;
