import React, { useState } from "react";
import style from "./RecordModal.module.css";

const RecordModal = ({
  isOpen,
  setIsOpen,
  socket,
  recordFlag,
  setRecordFlag,
}) => {
  const [name, setName] = useState("");

  const handleRecordStartButton = () => {
    if (!name.trim()) {
      alert("Session name cannot be empty.");
      return;
    }

    if (socket) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            command: "start_recording",
            session_name: name,
          })
        );
      } else {
        socket.onopen = function () {
          socket.send(
            JSON.stringify({
              command: "start_recording",
              session_name: name,
            })
          );
        };
      }
      console.log("Start Recording command sent");
      setRecordFlag(true);
      setIsOpen(false);
    } else {
      console.error("Socket is not initialized.");
    }
  };

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
    }
  };

  const handleModalCloseButton = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={style.modal_background} />
      <div className={style.modal_wrapper}>
        <form
          className={style.modal_input_box}
          onSubmit={(e) => e.preventDefault()}
        >
          <span>Session Name: </span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </form>
        <nav className={style.modal_nav}>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleRecordStartButton();
            }}
            className={style.record_trigger_btn}
          >
            Start Record
          </button>
          <button onClick={handleModalCloseButton} className={style.close_btn}>
            Close
          </button>
        </nav>
      </div>
    </>
  );
};

export default RecordModal;
