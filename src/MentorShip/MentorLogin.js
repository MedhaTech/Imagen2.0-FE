/* eslint-disable indent */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import React, { useState, useLayoutEffect } from "react";
import { connect } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import CryptoJS from "crypto-js";
import { useNavigate,Link } from "react-router-dom";
import logo from "../assets/img/newts.png";
import { openNotificationWithIcon } from "../helpers/Utils";
import { mentorShipLoginUser } from "../MentorShip/store/actions";
import user from "../assets/img/icons/user-icon.svg";

const MentorshipLogin = (props) => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const inputUserId = {
    type: "text",
    placeholder: "Please Enter Email",
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
      username: "",
      password: "",
    },

    validationSchema: Yup.object({
      username: Yup.string()
      .email()
        .trim()
        .min(2, "Please Enter Email")
        .required("Please Enter Email"),
      password: Yup.string().required("Please Enter Password"),
    }),
    onSubmit: (values) => {
         localStorage.clear();
      if (
        localStorage.getItem("current_user") &&
        localStorage.getItem("module")
      ) {
        openNotificationWithIcon(
          "error",
           "Clear your browser cache and try logging in"
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
        username: values.username,
        password: encrypted,
        // role: 'STATE',
      };

      props.mentorShipLoginUserAction(body, navigate, "MENTORSHIP");
    },
  });
  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper reset-pass-wrap bg-img">
          <div className="login-content">
            <form onSubmit={formik.handleSubmit} action="index">
              <div className="login-userset">
                <div className="login-logo logo-normal">
                  <img
                    src={logo}
                    alt="Logo"
                  />
                </div>
               
                <div className="login-userheading">
                  <h3>Mentor Login</h3>
                    <h4>
                    Access the Mentor Panel Using Your Email and Password.
                  </h4>
                </div>
                <div className="form-login mb-3">
                  <label className="form-label">Email</label>
                  <div className="form-addons">
                    <input
                      {...inputUserId}
                      id="username"
                      className="form- control"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.username}
                    />
                    {formik.touched.username && formik.errors.username ? (
                      <small className="error-cls" style={{ color: "red" }}>{formik.errors.username}</small>
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
                      placeholder="Please Enter password"
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
                                   <div className="col-12 d-flex align-items-center justify-content-end">
                                   
                                     <div className="text-end">
                                       <Link className="forgot-link" to="/mentorship-forgot-psw">
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
                    <Link className="hover-a" to={"/mentorship-registration"}>
                      {" "}
                      Click Here
                    </Link>
                  </h4>
                </div> 
                 <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                <p>Copyright © {currentYear}  <b>YFSI.</b> All rights reserved</p>
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
  mentorShipLoginUserAction: mentorShipLoginUser,
})(MentorshipLogin);
