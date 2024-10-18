/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getCurrentUser } from "../helpers/Utils";
import { useTranslation } from "react-i18next";
import "sweetalert2/src/sweetalert2.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";

const ChangePwd = (props) => {
  // here we can change the  teacher password //
  const currentUser = getCurrentUser("current_user");
  //const history = useHistory();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, SetError] = useState("");
  const [responce, SetResponce] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [errorText, setErrorText] = useState("");
  const [isOldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setNewPasswordVisible] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      oldPassword: Yup.string().required(
        <span style={{ color: "red" }}>Required</span>
      ),
      newPassword: Yup.string().required(
        <span style={{ color: "red" }}>Required</span>
      ),
      confirmPassword: Yup.string().required(
        <span style={{ color: "red" }}>Required</span>
      ),
    }),

    onSubmit: (values) => {
      if (values.newPassword.length < 8) {
        SetError("New Password must be 8-character minimum");
      } else if (values.oldPassword === values.newPassword) {
        SetError("Old Password and New Password are same");
      } else if (values.newPassword !== values.confirmPassword) {
        SetError("New Password and Confirm Password not same");
      } else {
        const key = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
        const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
        const old1 = CryptoJS.AES.encrypt(values.oldPassword, key, {
          iv: iv,
          padding: CryptoJS.pad.NoPadding,
        }).toString();
        const new1 = CryptoJS.AES.encrypt(values.newPassword, key, {
          iv: iv,
          padding: CryptoJS.pad.NoPadding,
        }).toString();

        const body = JSON.stringify({
          user_id: JSON.stringify(currentUser?.data[0]?.user_id),
          old_password: old1,
          new_password: new1,
        });
        var config = {
          method: "put",
          url: process.env.REACT_APP_API_BASE_URL + "/students/changePassword",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser?.data[0]?.token}`,
          },
          data: body,
        };
        axios(config)
          .then(function (response) {
            SetResponce("Password updated successfully");
            setTimeout(() => {
              SetResponce("");
              navigate("/student-dashboard");
            }, 2000);
          })
          .catch(function (error) {
            SetError(error.response.data.message);
          });
      }
    },
  });
  useEffect(() => {
    SetError("");
    setErrorText("");
  }, [formik.values]);
  //----password fields initial state and hide show password
  const [oldPassType, setOldPassType] = useState("password");
  const [newPassType, setNewPassType] = useState("password");
  const [confirmPassType, setConfirmPassType] = useState("password");
  const oldPassword = {
    type: oldPassType,
    placeholder: "Enter Current Password",
    className: "defaultInput",
  };

  const newPassword = {
    //  here we can generate new password //
    type: newPassType,
    placeholder: "Enter New Password",
    className: "defaultInput",
  };

  const confirmPassword = {
    // here  newPassword  is confirmPassword //
    type: confirmPassType,
    placeholder: "Confirm New Password",
  };

  const handleShowPassword = (name) => {
    // here we can see the password //
    // here name = Password //
    switch (name) {
      case oldPassword:
        name?.type === "password"
          ? (setOldPassType("text"), setOldPasswordVisible(true))
          : (setOldPassType("password"), setOldPasswordVisible(false));
        break;
      case newPassword:
        name?.type === "password"
          ? (setNewPassType("text"), setNewPasswordVisible(true))
          : (setNewPassType("password"), setNewPasswordVisible(false));
        break;
      case confirmPassword:
        name?.type === "password"
          ? (setConfirmPassType("text"), setPasswordVisible(true))
          : (setConfirmPassType("password"), setPasswordVisible(false));
        break;
    }
  };
  return (
    <div className="page-wrapper">
      {/* <div className="content"> */}
        <div className="login-wrapper reset-pass-wrap bg-img">
          <div className="login-content">
            <form action="success-3" onSubmit={formik.handleSubmit}>
              <div className="login-userset">
                <div className="login-userheading">
                  <h3>Change password?</h3>
                  <h4>
                    A strong password helps prevent unauthorized access to your
                    account.
                  </h4>
                </div>
                <div className="form-login mb-2">
                  <label>Current Password</label>
                  <div className="pass-group">
                    <input
                      className="pass-input"
                      {...oldPassword}
                      id="oldPassword"
                      name="oldPassword"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.oldPassword}
                    />
                    <div
                      className={`fas toggle-password ${
                        isOldPasswordVisible ? "fa-eye" : "fa-eye-slash"
                      }`}
                      onClick={() => {
                        handleShowPassword(oldPassword);
                      }}
                    ></div>
                  </div>
                  {formik.touched.oldPassword && formik.errors.oldPassword ? (
                    <small className="error-cls">
                      {formik.errors.oldPassword}
                    </small>
                  ) : null}
                </div>
                <div className="form-login mb-2">
                  <label>New Password</label>
                  <div className="pass-group">
                    <input
                      className="pass-inputs"
                      {...newPassword}
                      id="newPassword"
                      name="newPassword"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.newPassword}
                    />
                    <div
                      className={`fas toggle-password ${
                        isNewPasswordVisible ? "fa-eye" : "fa-eye-slash"
                      }`}
                      onClick={() => {
                        handleShowPassword(newPassword);
                      }}
                    ></div>
                  </div>
                  <small className="mt-2">
                    8-character minimum; case sensitive
                  </small>
                  <br />
                  {formik.touched.newPassword && formik.errors.newPassword ? (
                    <small className="error-cls">
                      {formik.errors.newPassword}
                    </small>
                  ) : null}
                </div>
                <div className="form-login mb-2">
                  <label> Confirm New Password</label>
                  <div className="pass-group">
                    <input
                      className="pass-inputa"
                      {...confirmPassword}
                      id="confirmPassword"
                      name="confirmPassword"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.confirmPassword}
                    />
                    <div
                      className={`fas toggle-password ${
                        isPasswordVisible ? "fa-eye" : "fa-eye-slash"
                      }`}
                      onClick={() => {
                        handleShowPassword(confirmPassword);
                      }}
                    ></div>
                  </div>
                  {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword ? (
                    <small className="error-cls">
                      {formik.errors.confirmPassword}
                    </small>
                  ) : null}
                </div>
                <b style={{ color: "red" }}>{error}</b>
                <b style={{ color: "#3BB143" }}>{responce}</b>
                <div className="form-login">
                  <button className="btn btn-login" type="submit">
                    Change Password{"  "} <FontAwesomeIcon icon={faKey} />
                  </button>
                </div>
                <div className="signinform text-center">
                  <h4>
                    <Link to={"/student-dashboard"} className="hover-a">
                      {" "}
                      Cancel{" "}
                    </Link>
                  </h4>
                </div>
              </div>
            </form>
          </div>
        </div>
      {/* </div> */}
    </div>
  );
};

export default ChangePwd;
