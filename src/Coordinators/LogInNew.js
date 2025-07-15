/* eslint-disable indent */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import React, { useState, useLayoutEffect } from "react";
// import ImageWithBasePath from "../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/newap.png";
// import email from "../assets/img/icons/mail.svg";
import { openNotificationWithIcon } from "../helpers/Utils";
import { coordinatorLoginUser } from "../Coordinators/store/Coordinator/actions";

const StateLogin = (props) => {
  const navigate = useNavigate();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const inputUserId = {
    type: "text",
    placeholder: "Please Enter State Name",
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };
  useLayoutEffect(() => {
    const moduleName = localStorage.getItem("module");

    if (
      localStorage.getItem("current_user") &&
      localStorage.getItem("module")
    ) {
      moduleName === "MENTOR"
        ? navigate("/institution-dashboard")
        : moduleName === "ADMIN"
        ? navigate("/admin-dashboard")
        : moduleName === "EVALUATOR"
        ? navigate("/evaluator/submitted-ideas")
        : moduleName === "EADMIN"
        ? navigate("/eadmin/dashboard")
        : navigate("/dashboard");
    }
  }, []);
  const formik = useFormik({
    initialValues: {
      district: "",
      password: "",
    },

    validationSchema: Yup.object({
      district: Yup.string()
        .trim()
        .min(2, "Please Enter State Name")
        .matches(/^[aA-zZ\s]+$/, "Special Characters are not allowed")
        .required("Required"),
      password: Yup.string().required("required"),
    }),
    onSubmit: (values) => {
      if (
        localStorage.getItem("current_user") &&
        localStorage.getItem("module")
      ) {
        openNotificationWithIcon(
          "error",
          `Another User(${localStorage.getItem(
            "module"
          )}) has already logged in`
        );
        return;
      }
      const key = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
      const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
      const encrypted = CryptoJS.AES.encrypt(values.password, key, {
        iv: iv,
        padding: CryptoJS.pad.NoPadding,
      }).toString();
      const body = {
        username: values.district,
        password: encrypted,
        // role: 'STATE',
      };

      props.coordinatorLoginUserAction(body, navigate, "STATE");
    },
  });
  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper bg-img">
          <div className="login-content">
            <form onSubmit={formik.handleSubmit} action="index">
              <div className="login-userset">
                <div className="login-logo logo-normal">
                  <img
                    src={logo}
                    alt="Logo"
                    // className="logo-image"
                  />
                  {/* <ImageWithBasePath src="assets/img/logo.png" alt="img" /> */}
                </div>
                {/* <Link className="login-logo logo-white">
                  <ImageWithBasePath src="assets/img/logo-white.png" alt />
                </Link> */}
                <div className="login-userheading">
                  <h3>State Coordinator Login</h3>
                </div>
                <div className="form-login mb-3">
                  <label className="form-label">State Name</label>
                  <div className="form-addons">
                    <input
                      {...inputUserId}
                      id="district"
                      className="form- control"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.district}
                    />
                    {formik.touched.district && formik.errors.district ? (
                      <small className="error-cls">Required</small>
                    ) : null}
                    {/* <ImageWithBasePath
                      src="assets/img/icons/mail.svg"
                      alt="img"
                    /> */}
                    {/* <img src={email} alt="Email" /> */}
                  </div>
                </div>
                <div className="form-login mb-3">
                  <label className="form-label">Password</label>
                  <div className="pass-group">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      id="password"
                      placeholder="Please Enter password"
                      // className="pass-input form-control"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <small className="error-cls">Required</small>
                    ) : null}
                    <span
                      className={`fas toggle-password ${
                        isPasswordVisible ? "fa-eye" : "fa-eye-slash"
                      }`}
                      onClick={togglePasswordVisibility}
                    ></span>
                  </div>
                </div>
                <div className="form-login authentication-check">
                  <div className="row">
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <div className="custom-control custom-checkbox">
                        <label className="checkboxs ps-4 mb-0 pb-0 line-height-1">
                          <input type="checkbox" className="form-control" />
                          <span className="checkmarks" />
                          Remember me
                        </label>
                      </div>
                      <div className="text-end">
                        <Link className="forgot-link">Forgot Password?</Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-login">
                  {/* <Link
                    className="btn btn-login"
                    type="submit"
                    btnClass={
                      !(formik.dirty && formik.isValid) ? "default" : "primary"
                    }
                    disabled={!(formik.dirty && formik.isValid)}
                  >
                    Sign In
                  </Link> */}
                  <button
                    // className="btn btn-login"
                    type="submit"
                    className={`btn btn-login ${
                      !(formik.dirty && formik.isValid) ? "default" : "primary"
                    }`}
                    // btnClass={
                    //   !(formik.dirty && formik.isValid) ? "default" : "primary"
                    // }
                    disabled={!(formik.dirty && formik.isValid)}
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = ({ admin }) => {
  const { loading, error, currentUser } = admin;
  return { loading, error, currentUser };
};

export default connect(mapStateToProps, {
  coordinatorLoginUserAction: coordinatorLoginUser,
})(StateLogin);
