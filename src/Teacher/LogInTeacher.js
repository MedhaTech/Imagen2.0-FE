/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import CryptoJS from "crypto-js";
import logo from "../assets/img/logo.png";
import email from "../assets/img/icons/mail.svg";
import { teacherLoginUser } from "../redux/actions";
import { connect } from "react-redux";
import { openNotificationWithIcon } from "../helpers/Utils";
import { useNavigate } from "react-router-dom";

const LogInTeacher = (props) => {
  const navigate = useNavigate();

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const inputUserId = {
    type: "email",
    placeholder: "Please Enter Email Address",
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .required("Please Enter Your Email Address")
        .max(255)
        .trim(),
      password: Yup.string().required("Please Enter Your Password").trim(),
    }),
    // TEACHER ROLE
    onSubmit: (values) => {
      localStorage.clear();

      if (
        localStorage.getItem("current_user") &&
        localStorage.getItem("module")
      ) {
        openNotificationWithIcon(
          "error",
           "Clear your browser cache and try logging in"
          // `Another User(${localStorage.getItem(
          //   "module"
          // )}) has already logged in`
        );
        return;
      }
      const key = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
      const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
      const encrypted = CryptoJS.AES.encrypt(values.password.trim(), key, {
        iv: iv,
        padding: CryptoJS.pad.NoPadding,
      }).toString();
      const body = {
        username: values.email.trim(),
        password: encrypted,
        role: "MENTOR",
      };
      props.teacherLoginUserAction(body, navigate, "MENTOR");
    },
  });
  const handleLogoClick = () => {
    navigate('/');
  };
  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper bg-img login-pass-wrap">
          <div className="login-content">
            <form onSubmit={formik.handleSubmit} action="index">
              <div className="login-userset">
                <div className="login-logo logo-normal" onClick={handleLogoClick}>
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
                  <h3> Institution Login</h3>
                  <h4>
                    Access the Institution panel using your registered email and
                    password.
                  </h4>
                </div>
                <div className="form-login mb-3">
                  <label className="form-label">Email Address</label>
                  <div className="form-addons">
                    <input
                      {...inputUserId}
                      id="email"
                      className="form- control"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <small className="error-cls" style={{ color: "red" }}>
                        {" "}
                        {formik.errors.email}
                      </small>
                    ) : null}
                    {/* <ImageWithBasePath
                      src="assets/img/icons/mail.svg"
                      alt="img"
                    /> */}
                    <img src={email} alt="Email" />
                  </div>
                </div>
                <div className="form-login mb-3">
                  <label className="form-label">Password</label>
                  <div className="pass-group">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      id="password"
                      placeholder="Please Enter Password"
                      // className="pass-input form-control"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                    />
                    <div
                      className={`fas toggle-password ${
                        isPasswordVisible ? "fa-eye" : "fa-eye-slash"
                      }`}
                      onClick={togglePasswordVisibility}
                    ></div>
                  </div>
                  {formik.touched.password && formik.errors.password ? (
                    <small className="error-cls" style={{ color: "red" }}>
                      {formik.errors.password}
                    </small>
                  ) : null}
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
                        <Link className="forgot-link" to="/institution-forgot-psw">
                          Forgot Password?
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-login" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {/* <Link className="btn btn-login">Sign In</Link> */}
                  <button
                    type="submit"
                    className={`btn btn-login ${
                      !(formik.dirty && formik.isValid) ? "default" : "primary"
                    }`}
                    disabled={!(formik.dirty && formik.isValid)}
                  >
                    Sign In
                  </button>
                </div>
                <div className="signinform">
                  <h4>
                    Not a Institution ?
                    <Link className="hover-a" to={"/login"}>
                      {" "}
                      Click Here
                    </Link>
                  </h4>
                </div>
                {/* <div className="form-setlogin or-text">
                  <h4>OR</h4>
                </div>
                <div className="form-sociallink">
                  <ul className="d-flex">
                    <li>
                      <Link to="#" className="facebook-logo">
                        <ImageWithBasePath
                          src="assets/img/icons/facebook-logo.svg"
                          alt="Facebook"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/icons/google.png"
                          alt="Google"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="apple-logo">
                        <ImageWithBasePath
                          src="assets/img/icons/apple-logo.svg"
                          alt="Apple"
                        />
                      </Link>
                    </li>
                  </ul>
                  <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                    <p>Copyright © 2024 <b>ImaGen Ventures.</b> All rights reserved</p>
                  </div>
                </div> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = ({ teacher }) => {
  const { loading, error, currentUser } = teacher;
  return { loading, error, currentUser };
};

export default connect(mapStateToProps, {
  teacherLoginUserAction: teacherLoginUser,
})(LogInTeacher);
