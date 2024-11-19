import React, { useEffect, useState } from "react";
import MyResponsiveLine from "./MyResponsiveLine";
import style from "./Dashboard.module.css";
import RecordModal from "./RecordModal";
import axios from "axios";

// 데이터 추가를 위한 유틸리티 함수
const appendData = (existingData, newEntry) => {
  const time = new Date(newEntry.value[0] * 1000).toLocaleTimeString();
  const value = parseFloat(newEntry.value[1]);

  if (time && !isNaN(value) && value !== null && value !== undefined) {
    const updatedData = [
      ...existingData,
      {
        x: time,
        y: value,
      },
    ];
    return updatedData.slice(-100); // 최근 100개의 데이터만 유지
  }
  return existingData;
};

// Dashboard 컴포넌트
const Dashboard = () => {
  const [socket, setSocket] = useState(null); // WebSocket 상태 관리
  const [metricsData, setMetricsData] = useState({
    cpu_usage: [],
    cpu_core_usage: [],
    memory_total: [],
    memory_used: [],
    disk_read_write: [],
    network_receive: [],
    network_transmit: [],
    uptime: [],
  });

  const [recordFlag, setRecordFlag] = useState(false); // 녹화 상태 플래그
  const [isOpen, setIsOpen] = useState(false); // 모달 열림 상태

  // WebSocket 연결 설정 및 이벤트 처리
  useEffect(() => {
    const ws = new WebSocket("ws://13.125.63.134:8000/ws/metrics/");
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket Connection Established");
      ws.send(JSON.stringify({ message: "Hello Prometheus" }));
    };

    ws.onmessage = (e) => {
      try {
        const receiveData = JSON.parse(e.data);
        if (receiveData?.node_exporter) {
          setMetricsData((prevData) => ({
            cpu_usage: appendData(
              prevData.cpu_usage,
              receiveData.node_exporter.cpu_usage?.[0]
            ),
            cpu_core_usage: appendData(
              prevData.cpu_core_usage,
              receiveData.node_exporter.cpu_core_usage?.[0]
            ),
            memory_total: appendData(
              prevData.memory_total,
              receiveData.node_exporter.memory_total?.[0]
            ),
            memory_used: appendData(
              prevData.memory_used,
              receiveData.node_exporter.memory_used?.[0]
            ),
            disk_read_write: appendData(
              prevData.disk_read_write,
              receiveData.node_exporter.disk_read_write?.[0]
            ),
            network_receive: appendData(
              prevData.network_receive,
              receiveData.node_exporter.network_receive?.[0]
            ),
            network_transmit: appendData(
              prevData.network_transmit,
              receiveData.node_exporter.network_transmit?.[0]
            ),
            uptime: appendData(
              prevData.uptime,
              receiveData.node_exporter.uptime?.[0]
            ),
          }));
        } else {
          console.error("Invalid data format:", receiveData);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket Connection Closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  // 녹화 버튼 핸들러
  const handleRecordButton = () => {
    if (!recordFlag) {
      setIsOpen(true);
    } else {
      setRecordFlag(false);
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            command: "stop_recording",
          })
        );
      }
      alert("You stopped recording");
    }
  };

  return (
    <div className={style.dashboard_wrapper}>
      <div className={style.floated_btn_con}>
        <button onClick={handleRecordButton}>
          {recordFlag ? "Stop" : "Record"}
        </button>
        <button
          onClick={() => {
            alert("ㅁㄹㅇㄴ");
          }}
        >
          IP Block
        </button>
        <button
          onClick={() => {
            axios
              .get("http://13.125.63.134:8000/status/recorded-sessions")
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          녹화 확인
        </button>
      </div>
      <h2>Node Exporter Metrics</h2>
      {Object.keys(metricsData).map((key) => (
        <MyResponsiveLine
          key={key}
          data={[{ id: key, data: metricsData[key] }]}
          title={key}
        />
      ))}
      {isOpen && (
        <RecordModal
          recordFlag={recordFlag}
          setRecordFlag={setRecordFlag}
          socket={socket}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
};

export default Dashboard;
