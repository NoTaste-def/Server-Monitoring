import React, { useEffect, useState } from "react";
import MyResponsiveLine from "./MyResponsiveLine";
import RecordModal from "./RecordModal";
import SessionListModal from "./SessionListModal";
import style from "./Dashboard.module.css";
import axios from "axios";

const Dashboard = () => {
  const [socket, setSocket] = useState(null);
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

  const [IPData, setIPData] = useState({});
  const [recordFlag, setRecordFlag] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isSessionListModalOpen, setIsSessionListModalOpen] = useState(false);
  const [sessionList, setSessionList] = useState([]); // 세션 리스트 상태

  // 데이터 추가 유틸리티 함수
  const appendData = (existingData, newEntry) => {
    const time = new Date(newEntry.value[0] * 1000).toLocaleTimeString();
    // value[0]을 시간으로
    const value = parseFloat(newEntry.value[1]);
    // value[1]을 값으로 사용

    if (time && !isNaN(value) && value !== null && value !== undefined) {
      // x축 값이 있고, NaN null undefined 값이 없을때 데이터 추가.
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

  // WebSocket 연결 설정
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

        if (receiveData?.ip_requests) {
          setIPData(receiveData.ip_requests); // 실시간 IP 데이터 업데이트
        }

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
    if (recordFlag) {
      // Stop Recording
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            command: "stop_recording",
          })
        );
        console.log("Stop Recording command sent");
      } else {
        console.error(
          "WebSocket is not open. Cannot send Stop Recording command."
        );
      }
      setRecordFlag(false); // 녹화 중지
    } else {
      // Start Recording
      setIsRecordModalOpen(true); // 녹화 모달 열기
    }
  };

  // 세션 데이터 가져오기
  const fetchSessionData = () => {
    axios
      .get("http://13.125.63.134/status/recorded-sessions/")
      .then((res) => {
        setSessionList(res.data.sessions); // 세션 리스트 저장
        setIsSessionListModalOpen(true); // 세션 리스트 모달 열기
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className={style.dashboard_wrapper}>
      {/* 실시간 IP 데이터 표시 */}
      <div className={style.floated_ip_con}>
        {IPData && typeof IPData === "object" ? (
          Object.entries(IPData).map(([ip, count], index) => (
            <div className={style.each_ip_object} key={index}>
              <span>
                <strong>{ip}</strong>: {count} req
              </span>
              <button
                onClick={() => {
                  const updatedIPData = { ...IPData };
                  delete updatedIPData[ip];
                  setIPData(updatedIPData);
                }}
                className={style.ip_deletion_btn}
              ></button>
            </div>
          ))
        ) : (
          <div>No IP data available</div>
        )}
      </div>

      {/* 버튼 영역 */}
      <div className={style.floated_btn_con}>
        <button onClick={handleRecordButton}>
          {recordFlag ? "Record Stop" : "Record Start"}
        </button>
        <button onClick={fetchSessionData}>View</button>
      </div>

      {/* 실시간 데이터 시각화 */}
      <h2>Node Exporter Metrics</h2>
      {Object.keys(metricsData).map((key) => (
        <MyResponsiveLine
          key={key}
          data={[{ id: key, data: metricsData[key] }]}
          title={key}
        />
      ))}

      {/* 녹화 모달 */}
      {isRecordModalOpen && (
        <RecordModal
          isOpen={isRecordModalOpen}
          setIsOpen={setIsRecordModalOpen}
          socket={socket}
          recordFlag={recordFlag}
          setRecordFlag={setRecordFlag}
        />
      )}

      {/* 세션 리스트 모달 */}
      {isSessionListModalOpen && (
        <SessionListModal
          sessions={sessionList}
          onClose={() => setIsSessionListModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
