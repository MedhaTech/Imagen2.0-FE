/* eslint-disable indent */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/logo.png";
import email from "../assets/img/icons/mail.svg";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { URL, KEY } from "../constants/defaultValues";
import { useNavigate } from "react-router-dom";
import { getNormalHeaders, openNotificationWithIcon } from "../helpers/Utils";

const Forgotpassword = () => {
  const [errorMsg, seterrorMsg] = useState("");
  const navigate = useNavigate();
  
  const formik = useFormik({
    initialValues: {
      email: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email(
          <span style={{ color: "red" }}>Must be a valid email address</span>
        )
        .required(
          <span style={{ color: "red" }}>
            Please Enter Registered Email ID
          </span>
        )
        .max(255)
        .trim(),
    }),

    onSubmit: async (values) => {
      const axiosConfig = getNormalHeaders(KEY.User_API_Key);
      await axios
        .put(
          `${URL.putstudentforgotPassword}`,
          JSON.stringify(values, null, 2),
          axiosConfig
        )
        .then((checkOrgRes) => {
          if (checkOrgRes.status == 202) {
            openNotificationWithIcon(
              "success",
              "Password sent to your registered email address"
            );
            seterrorMsg("");
            setTimeout(() => {
              navigate("/student");
            }, 2000);
            
          }
        })
        .catch((err) => {
          seterrorMsg(err.response.data.message);
          return err.response;
        });
    },
  });
  useEffect(()=>{
    seterrorMsg("");
  },[formik.values.email]);
  
  const handleLogoClick = () => {
    navigate('/');
  };
  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper forgot-pass-wrap bg-img">
          <div className="login-content">
            <form onSubmit={formik.handleSubmit} action="index">
              <div className="login-userset">
                <div className="login-logo logo-normal" onClick={handleLogoClick}>
                  <img
                    src={logo}
                    alt="Logo"
                    // className="logo-image"
                  />
                </div>
                {/* <Link to={route.dashboard} className="login-logo logo-white">
                  <ImageWithBasePath src="assets/img/logo-white.png" alt />
                </Link> */}
                <div className="login-userheading">
                  <h3>Forgot your YFSI password?</h3>
                  {/* <h4>
                    If you forgot your password, well, then we’ll email you
                    instructions to reset your password.
                  </h4> */}
                </div>
                <div className="form-login">
                  <label>Email</label>
                  <div className="form-addons">
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter Your Registered Email Address"
                      className="form- control mb-2"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <small className="error-cls">
                        {" "}
                        {formik.errors.email}
                      </small>
                    ) : null}
                    <img src={email} alt="Email" />
                  </div>
                </div>
                {errorMsg === "User not found" && (
                  <b className="text-danger m-3">
                    Please Enter Registered Email Address
                  </b>
                )}
                <div className="form-login d-flex justify-content-center align-items-center">
                  <button
                    className={`btn btn-login ${
                      !(formik.dirty && formik.isValid) ? "default" : "primary"
                    }`}
                    disabled={!(formik.dirty && formik.isValid)}
                    type="submit"
                  >
                      Send Password
                  </button>
                </div>
                <div className="signinform d-flex justify-content-center align-items-center">
                  <h4>
                    Return to
                    <Link to="/student" className="hover-a">
                      {" "}
                      Login{" "}
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
    </div>
  );
};

export default Forgotpassword;
