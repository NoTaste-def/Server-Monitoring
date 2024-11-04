import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";

const URL = "http://13.125.63.134/api";
// const URL = "http://10.0.2.25:8000/api"; // 모종의 이유로 리퀘스트 안감.

const Login = () => {
  const [isBlind, setIsBlind] = useState("password");
  const [Id, setId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const toSignup = () => {
    navigate("/signup");
  };

  const loginRequest = () => {
    axios
      .post(`${URL}/login/`, {
        username: Id,
        password: password,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="login-main-container">
      <div className="login-info-container">
        <div className="login-id-input">
          <label className="un_label" htmlFor="UserName">
            ID
          </label>
          <input
            type="text"
            id="UserName"
            className="UserName"
            onChange={(e) => {
              setId(e.target.value);
            }}
          />
        </div>
        <div className="login-pw-input">
          <label className="pw_label" htmlFor="UserPassword">
            PW
          </label>
          <input
            type={isBlind}
            id="UserPassword"
            className="UserPassword"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="btn-container">
          <button
            className="login-button"
            onClick={(e) => {
              e.preventDefault();
              alert("로그인 요청");
              loginRequest();
            }}
          >
            LOGIN
          </button>
          <button className="user-join" onClick={toSignup}>
            REGISTER
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

//Server Monitoring
