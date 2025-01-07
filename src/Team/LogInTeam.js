/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
// import ImageWithBasePath from "../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import CryptoJS from "crypto-js";
import logo from "../assets/img/logo.png";
import user from "../assets/img/icons/user-icon.svg";
import { loginUser } from "../redux/actions";
import { connect } from "react-redux";
import { openNotificationWithIcon } from "../helpers/Utils";
import { useNavigate } from "react-router-dom";

const LogInTeam = (props) => {
  const navigate = useNavigate();

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const inputUserId = {
    type: "text",
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
        // .email("Must be a valid email")
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
        // role: "TEAM",
      };
      props.LoginUserAction(body, navigate, "STUDENT");
    },
  });
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper bg-img email-veri-wrap">
          <div className="login-content">
            <form onSubmit={formik.handleSubmit} action="index">
              <div className="login-userset">
                <div className="login-logo logo-normal" onClick={handleLogoClick}>
                  <img
                    src={logo}
                    alt="Logo"
                  />
                  
                </div>
               
                <div className="login-userheading">
                  <h3> Student Login</h3>
                  {/* <h3>
                   Student Team Journey coming soon ...
                  </h3> */}
                  <h4>
                    Access the Student Panel Using Your Email and Password.
                  </h4>
                </div>
                <div className="form-login mb-3">
                  <label className="form-label">Email</label>
                  <div className="form-addons">
                    <input
                      {...inputUserId}
                      name="email"
                      className="form- control"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <small className="error-cls" style={{ color: "red" }}>{formik.errors.email}</small>
                    ) : null}
                   
                    <img src={user} alt="user" />
                  </div>
                </div>
                <div className="form-login mb-3">
                  <label className="form-label">Password</label>
                  <div className="pass-group">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      id="password"
                      placeholder="Please Enter Password"
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
                      <small className="error-cls" style={{ color: "red" }}>{formik.errors.password}</small>
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
                        <Link className="forgot-link" to="/student-forgot-psw">
                          Forgot Password?
                        </Link>
                      </div>
                     
                    </div>
                  </div>
                </div>
                <div className="form-login" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
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
                <div className="signinform  d-flex justify-content-center align-items-center">
                  <h4>
                  Not Yet Registered ? 
                    <Link className="hover-a" to={"/registration"}>
                      {" "}
                      Click Here
                    </Link>
                  </h4>
                </div> 
                
                
                  <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                    <p>Copyright © 2024 <b>YFSI.</b> All rights reserved</p>
                  </div>
                 
              </div>
            </form>
          </div>
        </div>
      </div> 
      {/* <div className="comming-soon-pg w-100">
        <div className="coming-soon-box">
          <div className="pos-logo" onClick={handleLogoClick}>
              <img
                  src={logo}
                  alt="Logo"
              />
          </div>
          <span>Student Team Journey</span>
          <h1>
            <span> COMING </span> SOON{" "}
          </h1>
          <p>The student team&apos;s journey will soon be enabled, offering a great experience.</p>
          <br/>
          <div className="signinform">
            <h5>
              Not a Team ?
              <Link className="hover-a" to={"/login"}>
                {" "}
                Click Here
              </Link>
            </h5>
          </div> 
          
          
          
        </div>
      </div> */}
    </div>
  );
};
const mapStateToProps = ({ teamUser }) => {
  const { loading, error, currentUser } = teamUser;
  return { loading, error, currentUser };
};

export default connect(mapStateToProps, {
  LoginUserAction: loginUser,
})(LogInTeam);
