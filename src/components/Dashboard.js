import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://13.125.63.134:8000/ws/metrics/");

    // 웹 소켓 연결이 열렸을 때 실행될 함수
    socket.onopen = () => {
      console.log("WebSocket Connection Established");
      socket.send(JSON.stringify({ message: "Hello Prometheus" }));
    };

    // 웹 소켓을 통해 메시지를 수신할 때 실행될 함수
    socket.onmessage = (e) => {
      const receiveData = JSON.parse(e.data);
      setData(receiveData);
    };

    // 웹소켓 연결이 닫힐 때 실행될 함수
    socket.onclose = () => {
      console.log("WebSocket Connection Closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <h1>Waiting for Data...</h1>
      )}
    </div>
  );
};

export default Dashboard;
