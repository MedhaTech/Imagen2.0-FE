/* eslint-disable indent */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { decryptGlobal } from "../constants/encryptDecrypt.js";
import OtpInput from "react-otp-input-rc-17";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { openNotificationWithIcon } from "../helpers/Utils.js";

const Register = () => {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
 
  const [btnOtp, setBtnOtp] = useState(false);
  const [otpRes, setOtpRes] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [btn, setBtn] = useState(false);
  const [change, setChange] = useState("Send OTP");
  const [holdKey, setHoldKey] = useState(false);
  const [time] = useState("00");
  const [disable, setDisable] = useState(false);
  const [areInputsDisabled, setAreInputsDisabled] = useState(false);
  const [dropdownbtn, setDropDownbtn] = useState("");
  const [timer, setTimer] = useState(0);
  const [person, setPerson] = useState(true);
  const [design, setDesign] = useState(false);
 
  const [isSubmitting, setIsSubmitting] = useState(false);

 
  useEffect(() => {
    if (!dropdownbtn) {
      setDesign(true);
    } else {
      setDesign(false);
    }
  }, [dropdownbtn]);
  const formik = useFormik({
    initialValues: {
     
      email: "",
      
    },

    validationSchema: Yup.object({
    
      email: Yup.string()
        .email(
          <span style={{ color: "red" }}>Please Enter Valid Email Address</span>
        )
        .required(
          <span style={{ color: "red" }}>Please Enter Email Address</span>
        )
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Email Must be Valid"
        )
        .max(255),
    
    }),

    onSubmit: async (values) => {
      setIsSubmitting(true);
      if (values.otp.length < 5) {
        setErrorMsg(true);
      } 
   
    },
  });
  useEffect(() => {
    setOtpRes(0);
    setBtnOtp(false);
    formik.setFieldValue("otp", "");

  }, [formik.values.mobile]);
  useEffect(() => {
    setOtpRes(0);
    setBtnOtp(false);
    formik.setFieldValue("otp", "");

  }, [formik.values.email]);
 
  
  const handleSendOtp = async (e) => {
    setTimer(60);

    setOtpSent(true);
    setChange("Resend OTP");
    setDisable(false);
    setAreInputsDisabled(true);

    const body = JSON.stringify({
      username: formik.values.email,
      mobile: null,
    });
    var config = {
      method: "post",
      url: process.env.REACT_APP_API_BASE_URL + "/mentors/emailOtp",
      headers: {
        "Content-Type": "application/json",
        Authorization: "O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870",
      },
      data: body,
    };
    axios(config)
      .then(function (response) {
        if (response.status === 202) {
          const UNhashedPassword = decryptGlobal(response?.data?.data);
          setOtpRes(JSON.parse(UNhashedPassword));
          openNotificationWithIcon("success", "OTP Sent to Given Email Id");
          setBtnOtp(true);
          setPerson(false);
          setTimeout(() => {
            setOtpSent("Resend OTP");
            setDisable(true);
            setHoldKey(false);
            setTimer(0);
          }, 60000);
        }
      })
      .catch(function (error) {
        if (error?.response?.data?.status === 406) {
          openNotificationWithIcon("error", error?.response.data?.message);

          setDisable(true);
          setAreInputsDisabled(false);
          setTimer(0);
          
        }
      });
    e.preventDefault();
  };
  const handleOtpChange = (e) => {
    formik.setFieldValue("otp", e);
    setErrorMsg(false);
  };

 
  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            clearInterval(intervalId);
            return 0;
          }
        });
      }, 1000);
      return () => clearInterval(intervalId);
    } else if (timer === 0 && otpSent) {
      setAreInputsDisabled(false);
      setOtpSent(false);
    }
  }, [timer, otpSent]);
  useEffect(() => {
    if (
    
      formik.values.email.length >0 
    

    ) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [
   
    formik.values.email,
   
  ]);
  const handleLogoClick = () => {
    navigate('/');
  };
  useEffect(() => {
    document.body.style.overflow = 'auto'; 
    document.body.style.overflowY = 'hidden'; 
  }, []);
 
  const style = {
    overflow: 'auto',
   
    scrollbarWidth: 'none', 
    msOverflowStyle: 'none', 
  };
  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper register-wrap  bg-img">
          <div className="login-content" style={style} >
            <form action="signin" onSubmit={formik.handleSubmit}>
              <div className="login-userset">
                <div className="login-logo logo-normal" onClick={handleLogoClick}>
                  <img src={logo} alt="Logo" />
                </div>

                {person && (
                  <div className="login-userheading">
                    <h3>
                      {" "}
                      Email Validation{" "}
                    </h3>
                  </div>
                )}

                <div className="col-xl-12">
                 
                      <div className="row g-3 mt-0">
                        <>
                         
                          <div className={`col-md-12`}
                          >
                            <label
                              htmlFor="email"
                              className="form-label"
                            >
                              Email
                            </label>&nbsp;
                            <span style={{color:"red",fontWeight:"bold"}}>*</span>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              placeholder="Email"
                              disabled={areInputsDisabled}
                              name="email"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.email}
                            />
                            {formik.touched.email && formik.errors.email ? (
                              <small
                                className="error-cls"
                                style={{ color: "red" }}
                              >
                                {formik.errors.email}
                              </small>
                            ) : null}
                          </div>
                        
                         
                        </>
                        <div className="col-md-12">
                          <button
                            type="button"
                            className="btn btn-warning m-2"
                            onClick={(e) => handleSendOtp(e)}
                            disabled={
                              !formik.isValid || !formik.dirty || otpSent 
                            
                            }
                          >
                            {otpSent ? `Resend OTP (${timer})` : change}
                          </button>
                        </div>
                        {/* )} */}
                        {btnOtp && (
                          <>
                            <div className="Otp-expire text-center">
                              <p>
                                {timer > 0
                                  ? `Access Resend OTP in ${timer < 10 ? `0${timer}` : timer} sec`
                                  : "Resend OTP enabled"}
                               
                              </p>
                            </div>

                            <div className="login-content user-login">
                              <div className="login-logo">
                               
                              </div>
                              <div className="login-userset text-center justify-content-center">
                                <div className="login-userheading">
                                  <h3>Verify your Email with OTP</h3>
                                  <h4 className="verfy-mail-content">
                                    We sent a verification code to your email.
                                    Enter the code from the email in the field
                                    below
                                  </h4>
                                </div>

                                <div className="wallet-add">
                                  <div className="otp-box">
                                    <div className="forms-block text-center">
                                      <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}>
                                        <OtpInput
                                          numInputs={6}
                                          isDisabled={false}
                                          errorStyle="error"
                                          onChange={handleOtpChange}
                                          separator={<span>{"-"}</span>}
                                          isInputNum={true}
                                          isInputSecure={false}
                                          shouldAutoFocus
                                          value={formik.values.otp}
                                          placeholder={""}
                                          inputStyle={{
                                            border: "1px solid",
                                            borderRadius: "8px",
                                            width: "2.5rem",
                                            height: "2.5rem",
                                            fontSize: "2rem",
                                            color: "#000",
                                            fontWeight: "400",
                                            caretColor: "blue",
                                          }}
                                          focusStyle={{
                                            border: "1px solid #CFD3DB",
                                            outline: "none",
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {formik.values.otp.length > 5 &&
                              otpRes != formik.values.otp && (
                                <div className="form-row row text-center">
                                  <span
                                    className=" w-100 d-flex justify-content-center"
                                    style={{
                                      color: "red",
                                    }}
                                  >
                                    Invalid OTP
                                  </span>
                                </div>
                              )}
                          </>

                        )}

                       
                      </div>
                  
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
