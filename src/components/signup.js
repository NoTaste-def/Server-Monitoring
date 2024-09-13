import React, { useState } from "react";
import "./signup.css";
import axios from "axios";

const URL = "13.125.63.134/api";

const Signup = () => {
  const [name, setName] = useState("");
  const [Id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const signupRequest = () => {
    axios
      .post(`${URL}/register`, {
        username: Id,
        name: name,
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
    <div className="container">
      <div className="login">
        <h1>Sign Up</h1>

        <form className="form_container">
          <div className="input_container">
            <div>
              <label className="input_label" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="input_box"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="input_label" htmlFor="id">
                ID
              </label>
              <input
                type="text"
                id="id"
                name="id"
                className="input_box"
                onChange={(e) => {
                  setId(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="input_label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="input_box"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="input_label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="input_box"
                onChange={(e) => {
                  setConfirm(e.target.value);
                }}
              />
            </div>
            <div className="checkbox">
              <input
                type="checkbox"
                id="agree"
                name="agree"
                value="policy"
                required
              />
              <label htmlFor="agree" style={{ color: "rgb(150,150,150)" }}>
                By creating an account you agree to our{" "}
                <a href="#">Privacy Policy</a>
              </label>
            </div>
          </div>
          <p id="sign">
            Already have an account? <a href="/login">Sign in</a>
          </p>
          <button
            id="account"
            className="signup_btn"
            onClick={(e) => {
              e.preventDefault();
              if (password !== confirm) {
                e.preventDefault();
                alert("비밀번호를 확인해주세요");
              } else {
                alert("회원가입 요청");
                signupRequest();
              }
            }}
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
