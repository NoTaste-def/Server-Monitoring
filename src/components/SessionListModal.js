import React, { useState } from "react";
import axios from "axios";
import MyResponsiveLine from "./MyResponsiveLine";
import style from "./SessionListModal.module.css";

const SessionListModal = ({ sessions, onClose }) => {
  const [selectedSessionData, setSelectedSessionData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 특정 세션 데이터를 가져오는 함수
  const fetchSessionData = async (sessionId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://13.125.63.134/status/recorded-session/${sessionId}/`
      );

      const { data } = response.data;
      const metricsData = {};

      const requiredKeys = [
        "cpu_usage",
        "cpu_core_usage",
        "memory_total",
        "memory_used",
        "disk_read_write",
        "network_receive",
        "network_transmit",
        "uptime",
      ];

      data.forEach((entry) => {
        const metrics = entry.metrics?.node_exporter;

        if (metrics) {
          Object.keys(metrics).forEach((key) => {
            if (requiredKeys.includes(key)) {
              if (!metricsData[key]) metricsData[key] = [];

              metrics[key].forEach((item) => {
                const value = item.value;
                const xValue = new Date(value[0] * 1000).toLocaleTimeString();
                const yValue = parseFloat(value[1]);

                if (!isNaN(yValue)) {
                  // 동일한 x 값이 이미 존재하는지 확인
                  const isDuplicate = metricsData[key].some(
                    (point) => point.x === xValue
                  );

                  // 중복된 경우 데이터를 무시하고, 중복이 없으면 추가
                  if (!isDuplicate) {
                    metricsData[key].push({ x: xValue, y: yValue });
                  }
                }
              });
            }
          });
        }
      });

      setSelectedSessionData(metricsData); // 각 카테고리별로 데이터 저장
      console.log("Filtered Metrics Data:", metricsData);
    } catch (error) {
      console.error("Failed to fetch session data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={style.modal_background} onClick={onClose} />
      <div className={style.modal_wrapper}>
        <div className={style.modal_header}>
          <button
            className={style.model_header_btn}
            onClick={() => setSelectedSessionData(null)}
          >
            ⏎
          </button>
          <h3>{selectedSessionData ? "Session Data" : "Session List"}</h3>
          <button className={style.model_header_btn} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={style.modal_content}>
          {selectedSessionData ? (
            <>
              {Object.keys(selectedSessionData).map((key) => {
                const chartData = selectedSessionData[key];

                if (!chartData || chartData.length === 0) {
                  console.warn(`No valid data for chart: ${key}`);
                  return null;
                }

                // MyResponsiveLine에 카테고리별 데이터 전달
                return (
                  <MyResponsiveLine
                    key={key}
                    data={[
                      {
                        id: key,
                        data: chartData,
                      },
                    ]}
                    title={key}
                  />
                );
              })}
            </>
          ) : (
            <>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className={style.item_list_wrapper}>
                  {sessions.length > 0 ? (
                    sessions.map((session) => (
                      <div
                        key={session.id}
                        className={style.session_item}
                        onClick={() => fetchSessionData(session.id)}
                      >
                        <strong>{session.session_name}</strong>
                        <p>
                          Start: {new Date(session.start_time).toLocaleString()}
                        </p>
                        <p>
                          End: {new Date(session.end_time).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No sessions available.</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionListModal;
