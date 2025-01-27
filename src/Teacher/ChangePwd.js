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
import male from "../assets/img/imazenlogo1.jpg";

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
          url: process.env.REACT_APP_API_BASE_URL + "/mentors/changePassword",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser?.data[0]?.token}`,
          },
          data: body,
        };
        axios(config)
          .then(function (response) {
            SetResponce("Password Updated Successfully");
            setTimeout(() => {
              SetResponce("");
              navigate("/institution-dashboard");
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
  const formLoginStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };
  const buttonStyle = {
    marginRight: '10px'
  };

  const cancelLinkStyle = {
    marginLeft: 'auto'
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Change Password</h4>
            <p>
              A strong password helps prevent unauthorized access to your
              account.
            </p>
            {/* <h6>User Profile</h6> */}
          </div>
          <div>
            {/* <button onClick={() => handleEdit() }className={"btn btn-primary"}>
                      <img src={edit} alt="Edit" />
                    </button> */}
            {/* <h4>Update Personal Details.</h4> */}
          </div>
        </div>
        {/* /product list */}
        <form onSubmit={formik.handleSubmit}>
        <div className="card">
          <div className="card-body">
            <div className="profile-set">
              <div className="profile-head"></div>
              <div className="profile-top">
                <div className="profile-content">
                  <div className="profile-contentimg">
                    <img src={male} alt="Male" id="blah" />

                    <div className="profileupload"></div>
                  </div>

                  <div className="profile-contentname"></div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks" style={{ position: "relative" }}>
                  <label className="form-label">Current Password</label>
                  <input
                    className="pass-input"
                    {...oldPassword}
                    id="oldPassword"
                    name="oldPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.oldPassword}
                    style={{ paddingRight: '30px' }}
                  />
                  <div
                      className={`fas toggle-password ${
                        isOldPasswordVisible ? "fa-eye" : "fa-eye-slash"
                      }`}
                      onClick={() => {
                        handleShowPassword(oldPassword);
                      }}
                      style={{
                        position: 'absolute',
                        right: '10px',  
                        top: '70%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                      }}
                    ></div>
                </div>
                {formik.touched.oldPassword && formik.errors.oldPassword ? (
                  <small className="error-cls">
                    {formik.errors.oldPassword}
                  </small>
                ) : null}
              </div>
              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks" style={{ position: "relative" }}>
                  <label className="form-label">New Password</label>
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
                    style={{
                      position: 'absolute',
                      right: '10px',  
                      top: '70%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                    }}
                  ></div>
                </div>
                <small>
                  8-character minimum; case sensitive
                </small>
                <br />
                {formik.touched.newPassword && formik.errors.newPassword ? (
                  <small className="error-cls">
                    {formik.errors.newPassword}
                  </small>
                ) : null}
              </div>
              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks" style={{ position: "relative" }}>
                  <label className="form-label">Confirm New Password</label>
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
                    style={{
                      position: 'absolute',
                      right: '10px',  
                      top: '70%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
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
              <b style={{ color: "red",textAlign:"center" }}>{error}</b>
              <b style={{ color: "#3BB143" }}>{responce}</b>
               <div className="form-login" style={formLoginStyle}>
                                <button
                                  style={buttonStyle}
                                  
                                  type="submit"
                                  className={`btn btn-warning  ${
                                    !(formik.dirty && formik.isValid) ? "default" : "primary"
                                  }`}
                                  disabled={!(formik.dirty && formik.isValid)}
                                >
                                  Change Password <FontAwesomeIcon icon={faKey} />

                                </button>
                                <Link className="btn btn-cancel" to={"/institution-dashboard"}  style={cancelLinkStyle}>
                                  Cancel
                                </Link>
                              </div>
            </div>

            {/* </div> */}
          </div>
        </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePwd;
