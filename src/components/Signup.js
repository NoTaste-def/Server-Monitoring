import React, { useState } from "react";
import style from "./Signup.module.css";
import axios from "axios";

const URL = "http://13.125.63.134/api";
// const URL = "http://10.0.2.25:8000/api"; // 모종의 이유로 리퀘스트 안감.

const Signup = () => {
  const [name, setName] = useState("");
  const [Id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [visible, setVisible] = useState(["password", "password"]);

  const [pswVisibleFlag, setPswVisibleFlag] = useState(false);
  const [confirmVisibleFlag, setConfirmVisibleFlag] = useState(false);

  const signupRequest = () => {
    axios
      .post(`${URL}/register/`, {
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

  const handleVisible = (index) => {
    // 0 => password
    // 1 => confirm

    let copy = [...visible];
    if (copy[index] === "password") {
      copy[index] = "text";
      setVisible(copy);
      if (index === 0) setPswVisibleFlag(true);
      else setConfirmVisibleFlag(true);
    } else {
      copy[index] = "password";
      setVisible(copy);
      if (index === 0) setPswVisibleFlag(false);
      else setConfirmVisibleFlag(false);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.login}>
        <h1>Sign Up</h1>

        <form className={style.form_container}>
          <div className={style.input_container}>
            <div>
              <label className={style.input_label} htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={style.input_box}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div>
              <label className={style.input_label} htmlFor="id">
                ID
              </label>
              <input
                type="text"
                id="id"
                name="id"
                className={style.input_box}
                onChange={(e) => {
                  setId(e.target.value);
                }}
              />
            </div>
            <div>
              <label className={style.input_label} htmlFor="password">
                Password
              </label>
              <button
                className={style.set_visible_btn}
                type="button"
                onClick={(e) => handleVisible(0)}
              >
                {pswVisibleFlag ? "⦿" : "◉"}
              </button>
              <input
                type={visible[0]}
                id="password"
                name="password"
                className={style.input_box}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div>
              <label className={style.input_label} htmlFor="confirmPassword">
                Confirm Password
              </label>
              <button
                className={style.set_visible_btn}
                type="button"
                onClick={(e) => handleVisible(1)}
              >
                {confirmVisibleFlag ? "⦿" : "◉"}
              </button>
              <input
                type={visible[1]}
                id="confirmPassword"
                name="confirmPassword"
                className={style.input_box}
                onChange={(e) => {
                  setConfirm(e.target.value);
                }}
              />
            </div>
            {/* <div className="checkbox">
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
            </div> */}
          </div>
          <p id="sign">
            Already have an account? <a href="/login">Sign in</a>
          </p>
          <button
            id="account"
            className={style.signup_btn}
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
