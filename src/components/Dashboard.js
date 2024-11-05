import React, { useEffect, useState } from "react";
import MyResponsiveLine from "./MyResponsiveLine";

const appendData = (existingData, newEntry) => {
  const time = new Date(newEntry.value[0] * 1000).toLocaleTimeString();
  const value = parseFloat(newEntry.value[1]);

  if (time && !isNaN(value) && value !== null && value !== undefined) {
    return [
      ...existingData,
      {
        x: time,
        y: value,
      },
    ];
  }
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

      setMetricsData((prevData) => ({
        cpu_usage: appendData(
          prevData.cpu_usage,
          receiveData.node_exporter.cpu_usage[0]
        ),
        cpu_core_usage: appendData(
          prevData.cpu_core_usage,
          receiveData.node_exporter.cpu_core_usage[0]
        ),
        load_average_1: appendData(
          prevData.load_average_1,
          receiveData.node_exporter.load_average_1[0]
        ),
        load_average_5: appendData(
          prevData.load_average_5,
          receiveData.node_exporter.load_average_5[0]
        ),
        load_average_15: appendData(
          prevData.load_average_15,
          receiveData.node_exporter.load_average_15[0]
        ),
        memory_total: appendData(
          prevData.memory_total,
          receiveData.node_exporter.memory_total[0]
        ),
        memory_used: appendData(
          prevData.memory_used,
          receiveData.node_exporter.memory_used[0]
        ),
        disk_read_write: appendData(
          prevData.disk_read_write,
          receiveData.node_exporter.disk_read_write[0]
        ),
        network_receive: appendData(
          prevData.network_receive,
          receiveData.node_exporter.network_receive[0]
        ),
        network_transmit: appendData(
          prevData.network_transmit,
          receiveData.node_exporter.network_transmit[0]
        ),
        uptime: appendData(
          prevData.uptime,
          receiveData.node_exporter.uptime[0]
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
