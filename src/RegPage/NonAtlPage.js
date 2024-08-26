/* eslint-disable indent */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import Select from "./Select";
import * as Yup from "yup";
import CryptoJS from "crypto-js";
import { openNotificationWithIcon } from "../helpers/Utils.js";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight } from "feather-icons-react";
import user from "../assets/img/icons/user-icon.svg";
import play from "../assets/img/playicon.png";
import copy from "../assets/img/copyrights.png";
import { stateList, districtList } from "./ORGData.js";

import {
  getStateData,
  getFetchDistData,
} from "../redux/studentRegistration/actions";
import { decryptGlobal, encryptGlobal } from "../constants/encryptDecrypt";
import OtpInput from "react-otp-input-rc-17";
import logo from "../assets/img/logo.png";

const NonAtlPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [diceBtn, setDiceBtn] = useState(true);
  // const [diesCode, setDiesCode] = useState("");
  const [orgData, setOrgData] = useState({});
  const [error, setError] = useState("");
  const [errors, setErrors] = useState("");
  const [btn, setBtn] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [stateData, setStateData] = React.useState("");
  const [districts, setDistricts] = React.useState([]);
  const [pinCode, setPinCode] = useState("");
  const [schoolname, setSchoolname] = useState("");
  //const [newDistrict, setnewDistrict] = useState("");
  const [textData, setTextData] = useState("");
  const [fullStatesNames, setFullStatesNames] = useState([]);
  const [fullDistrictsNames, setFullDistrictsNames] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [schoolBtn, setSchoolBtn] = useState(false);
  const [checkBox, setCheckBox] = useState(false);
  const [checkBox1, setCheckBox1] = useState(false);
  const [change, setChange] = useState("Send OTP");
  const [areInputsDisabled, setAreInputsDisabled] = useState(false);
  const [disable, setDisable] = useState(false);
  const [timer, setTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [btnOtp, setBtnOtp] = useState(false);
  const [otpRes, setOtpRes] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [mentorData, setMentorData] = useState({});
  const [wtsNum, setWtsNum] = useState("");
  const [condition, setCondition] = useState(false);
  const [buttonData, setButtonData] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const diesCodes = JSON.parse(localStorage.getItem("diesCode"));
  const [mentData, setMentData] = useState({});
  const [districtOptions, setDistrictOptions] = useState([]);
  const [secondUser, setSecondUser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [person, setPerson] = useState(true);

  const handleMouseEnter = () => {
    setIsTooltipVisible(true);
  };
  // useEffect(() => {
  //   if (orgData.organization_name !== "") {
  //     handleRegister();
  //   }
  // }, [orgData.organization_name]);
  useEffect(() => {
    handleRegister();
  }, []);

  // const fullStatesNames = useSelector(
  //   (state) => state?.studentRegistration?.regstate
  // );

  // useEffect(() => {
  //   dispatch(getStateData());
  // }, []);

  // useEffect(() => {
  //   if (stateData !== "") {
  //     dispatch(getFetchDistData(stateData));
  //   }
  //   setdistrict("");
  // }, [stateData]);
  // const fiterDistData = useSelector(
  //   (state) => state?.studentRegistration?.fetchdist
  // );
  // useEffect(() => {
  //   stateApi();
  // }, []);
  const stateApi = () => {
    var config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL + `/organizations/states`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870",
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setFullStatesNames(response.data.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // useEffect(() => {
  //   if (stateData !== "") {
  //     districtApi(stateData);
  //   }
  //   // setdistrict("");
  // }, [stateData]);
  // const districtApi = (item) => {
  //   const distParam = encryptGlobal(
  //     JSON.stringify({
  //       state: item,
  //     })
  //   );

  //   var config = {
  //     method: "get",
  //     url:
  //       process.env.REACT_APP_API_BASE_URL +
  //       `/organizations/districts?Data=${distParam}`,
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870",
  //     },
  //   };
  //   axios(config)
  //     .then(function (response) {
  //       if (response.status === 200) {
  //         setFullDistrictsNames(response.data.data);
  //       }
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // };
  const handleOnChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    const trimmedValue = numericValue.trim();

    setDiesCode(trimmedValue);

    if (trimmedValue.length === 11 && checkBox1) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }

    setOrgData();
    setError("");
  };

  const handleCheckbox1 = (e, click) => {
    if (click) {
      setCheckBox1(true);
      if (diesCode.length === 11) {
        setIsButtonEnabled(true);
      }
      //formik.setFieldValue("whatapp_mobile", formik.values.mobile);
      //setWtsNum(formik.values.mobile);
    } else {
      setCheckBox1(false);
      setIsButtonEnabled(false);
      //formik.setFieldValue("whatapp_mobile", "");
    }
  };

  const handleRegister = (e) => {
    const body = JSON.stringify({
      organization_code: diesCodes,
    });

    var config = {
      method: "post",
      url: process.env.REACT_APP_API_BASE_URL + "/organizations/checkOrg",
      headers: {
        "Content-Type": "application/json",
        Authorization: "O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870",
      },
      data: body,
    };
    axios(config)
      .then(function (response) {
        // if (response?.status == 200) {
        //   //console.log(response,"eivnir");
        //   setError("Another Teacher is already registered in given School");
        //   setDiceBtn(true);
        //   setBtn(false);
        // }
        // if(response?.status == 200) {
        //   console.log(response,"eivnir");
        //   if (Object.keys(response?.data?.data[0]).length && response?.data?.data[0].category === "Non ATL") {
        //     setOrgData(response?.data?.data[0]);
        //       formik.setFieldValue(
        //         "organization_code",
        //         response?.data?.data[0].organization_code
        //       );
        //       setDiceBtn(false);
        //       setSchoolBtn(true);
        //     //setBtn(true);
        //     //setDiceBtn(false);
        //     setBtn(false);
        //     //setSchoolBtn(true);
        //   }
        // }
        if (response?.status == 200) {
          if (
            response?.data?.data[0] &&
            process.env.REACT_APP_USEDICECODE == 1
          ) {
            if (
              Object.keys(
                response?.data?.data[0].length &&
                  response?.data?.data[0].mentor !== null
              )
            ) {
              // setOrgData(response?.data?.data[0]);
              setSecondUser(true);
              formik.setFieldValue(
                "organization_code",
                response?.data?.data[0].organization_code
              );
              // setTextData(response?.data?.data[0].address);
              // setPinCode(response?.data?.data[0].pin_code);
              // setSchoolname(response?.data?.data[0].organization_name);
              // setDiesCode(response?.data?.data[0].organization_code);
              // setStateData(response?.data?.data[0].state);
              // setdistrict(response?.data?.data[0].district);

              // setDiceBtn(false);
              setSchoolBtn(true);
            } else {
              setError(
                "Entered Code belongs to Atl school. Kindly register as ATL"
              );
            }
          }
        }
      })
      .catch(function (error) {
        if (error?.response?.data?.status === 404) {
          setBtn(true);
          // setDiceBtn(false);
          setCondition(true);
        }
      });

    // e.preventDefault();
  };
  useEffect(() => {
    if (diesCodes.length > 0) {
      setBtn(true);
    }
  }, [diesCodes]);
  const handlePincode = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    const trimmedValue = numericValue.trim();
    setPinCode(trimmedValue);

    if (trimmedValue.length < 6 && trimmedValue.length > 0) {
      setErrors("Pin code must be at least 6 digits");
    } else {
      setErrors("");
    }
  };
  const handleOnChangeSchool = (e) => {
    let inputValue = e.target.value;
    inputValue = inputValue.slice(0, 40);
    const isValidInput =
      /^[a-zA-Z0-9\s]+$/.test(inputValue) || inputValue === "";
    if (isValidInput) {
      setSchoolname(inputValue);
    }
  };

  const handleStateChange = (event) => {
    const state = event.target.value;
    setStateData(state);
    setSelectedDistrict("");
    setDistricts(districtList[state] || []);
  };
  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };

  const handleOnChangeAddress = (e) => {
    const inputValues = e.target.value;
    const isValidInputs =
      /^[a-zA-Z0-9\s]+$/.test(inputValues) || inputValues === "";
    if (isValidInputs) {
      setTextData(inputValues);
    }
  };
  localStorage.setItem("mentorData", JSON.stringify(mentorData));
  localStorage.setItem("orgData", JSON.stringify(orgData));

  const handleSubmit = (e) => {
    const body = {
      state: stateData,
      district: selectedDistrict,
      pin_code: pinCode,
      category: "Non ATL",
      organization_code: diesCodes,
      organization_name: schoolname,
      //new_district: newDistrict,
      address: textData,
    };
    setOrgData(body);
    setBtn(false);
    setSchoolBtn(true);

    e.preventDefault();
  };

  useEffect(() => {
    if (stateData && selectedDistrict && pinCode.length >5 && schoolname && textData) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [stateData, selectedDistrict, pinCode, schoolname, textData]);
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const formik = useFormik({
    initialValues: {
      full_name: "",
      organization_code: diesCodes,
      // username: '',
      mobile: "",
      whatapp_mobile: "",
      role: "MENTOR",
      qualification: "-",
      reg_status: false,
      otp: "",
      password: "",
      gender: "",
      title: "",
      email: "",
      click: false,
      checkbox: false,
    },

    validationSchema: Yup.object({
      full_name: Yup.string()
        .trim()
        .min(2, <span style={{ color: "red" }}>Please Enter Full Name</span>)

        .matches(/^[aA-zZ\s]+$/, "Special Characters are not allowed")
        .required(<span style={{ color: "red" }}>Please Enter Full Name</span>),

      mobile: Yup.string()
        .required(
          <span style={{ color: "red" }}>Please Enter Mobile Number</span>
        )
        .trim()
        .matches(
          /^\d+$/,
          "Please enter a valid email address"
          // <span style={{ color: "red" }}>
          //   Mobile number is not valid (Enter only digits)
          // </span>
        )
        .max(
          10,
          <span style={{ color: "red" }}>
            Please enter only 10 digit valid number
          </span>
        )
        .min(
          10,
          <span style={{ color: "red" }}>Number is less than 10 digits</span>
        ),
      email: Yup.string()
        .email(
          <span style={{ color: "red" }}>Please Enter Valid Email Address</span>
        )
        .required(
          <span style={{ color: "red" }}>Please Enter Email Address</span>
        )
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Email Must be VALID"
          //<span style={{ color: "red" }}>Please Enter Valid Email Address</span>
        )
        .max(255),
      whatapp_mobile: Yup.string()
        .required(
          <span style={{ color: "red" }}>Please Enter WhatsApp Number</span>
        )
        .trim()
        .matches(
          /^\d+$/,
          <span style={{ color: "red" }}>
            Mobile number is not valid (Enter only digit)
          </span>
        )
        .max(
          10,
          <span style={{ color: "red" }}>
            Please enter only 10 digit valid number
          </span>
        )
        .min(
          10,
          <span style={{ color: "red" }}>Number is less than 10 digits</span>
        ),
      gender: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Gender</span>
      ),
      title: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Title</span>
      ),
    }),

    onSubmit: async (values) => {
      setIsSubmitting(true);

      if (values.otp.length < 5) {
        setErrorMsg(true);
      } else {
        var pass = values.email.trim();
        var myArray = pass.split("@");
        let newPassword = myArray[0];
        if (values.password !== newPassword) {
          setFieldValue("password", newPassword);
        }
        const key = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
        const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
        const encrypted = CryptoJS.AES.encrypt(newPassword, key, {
          iv: iv,
          padding: CryptoJS.pad.NoPadding,
        }).toString();
        const body = {
          full_name: values.full_name.trim(),
          mobile: values.mobile.trim(),
          whatapp_mobile: values.whatapp_mobile.trim(),
          username: values.email.trim(),
          qualification: values.qualification.trim(),
          role: values.role.trim(),
          gender: values.gender,
          title: values.title,
          reg_status: values.reg_status,
          password: encrypted,
        };
        handleRegist(body);
      }
    },
  });

  const handleCheckbox = (e, click) => {
    if (click) {
      setCheckBox(click);
      formik.setFieldValue("whatapp_mobile", formik.values.mobile);
      setWtsNum(formik.values.mobile);
    } else {
      setCheckBox(click);
      formik.setFieldValue("whatapp_mobile", "");
    }
  };
  useEffect(() => {
    setCheckBox(false);
    formik.setFieldValue("whatapp_mobile", "");
  }, [formik.values.mobile.length == 0]);
  const handleEmailChange = (e) => {
    formik.handleChange(e);
    const emailValue = e.target.value;
    const emailParts = emailValue.split("@");
    const newPassword = emailParts[0] || "";

    if (formik.values.password !== newPassword) {
      formik.setFieldValue("password", newPassword);
    }
  };
  const handleSendOtp = async (e) => {
    formik.setFieldValue("mobile", formik.values.mobile);
    setTimer(60);

    setOtpSent(true);
    setChange("Resend OTP");
    setDisable(false);
    setAreInputsDisabled(true);

    const body = JSON.stringify({
      username: formik.values.email,
      mobile: formik.values.mobile,
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
          // console.log(UNhashedPassword, "111111111111111111111111111");
          setOtpRes(JSON.parse(UNhashedPassword));
          openNotificationWithIcon("success", "OTP sent to Email Id");
          setBtnOtp(true);
          setPerson(false);
          setTimeout(() => {
            setOtpSent("Resend OTP");
            setDisable(true);
            // setHoldKey(false);
            setTimer(0);
          }, 60000);
        }
      })
      .catch(function (error) {
        if (error?.response?.data?.status === 406) {
          openNotificationWithIcon("error", error?.response?.data?.message);

          setDisable(true);
          setAreInputsDisabled(false);
          setTimer(0);
          // setTimeout(() => {
          //   setDisable(true);
          //   setHoldKey(false);
          //   setTimer(0);
          // }, 1000);
        }
      });
    e.preventDefault();
  };
  const handleOtpChange = (e) => {
    formik.setFieldValue("otp", e);
    setErrorMsg(false);
  };

  const handleRegist = (mentorregdata) => {
    setMentorData(mentorregdata);
    const body = JSON.stringify({
      state: stateData,
      district: selectedDistrict,
      pin_code: pinCode,
      category: "Non ATL",
      organization_code: diesCodes,
      organization_name: schoolname,
      address: textData,
    });

    if (condition) {
      var config = {
        method: "post",
        url: process.env.REACT_APP_API_BASE_URL + `/organizations/createOrg`,
        headers: {
          "Content-Type": "application/json",
          Authorization: "O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870",
        },
        data: body,
      };
      axios(config)
        .then(function (response) {
          if (response?.status == 201) {
            mentorregdata["organization_code"] =
              response.data.data[0].organization_code;
            handelMentorReg(mentorregdata);
          }
        })

        .catch(function (error) {
          console.log(error);
        });
    } else {
      mentorregdata["organization_code"] = diesCodes;
      handelMentorReg(mentorregdata);
    }
    // var config = {
    //   method: "post",
    //   url: process.env.REACT_APP_API_BASE_URL + `/organizations/createOrg`,
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: "O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870",
    //   },
    //   data: body,
    // };
    // axios(config)
    //   .then(function (response) {
    //     if (response?.status == 201) {
    //       mentorregdata["organization_code"] =
    //         response.data.data[0].organization_code;
    //       handelMentorReg(mentorregdata);
    //     }
    //   })

    //   .catch(function (error) {
    //     console.log(error);
    //   });
  };
  const handelMentorReg = async (body) => {
    var config = {
      method: "post",
      url: process.env.REACT_APP_API_BASE_URL + "/mentors/register",
      headers: {
        "Content-Type": "application/json",
        Authorization: "O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870",
      },

      data: JSON.stringify(body),
    };

    await axios(config)
      .then((mentorRegRes) => {
        if (mentorRegRes?.data?.status == 201) {
          setMentData(mentorRegRes.data && mentorRegRes.data.data[0]);
          setTimeout(() => {
            apiCall(mentorRegRes.data && mentorRegRes.data.data[0]);
          }, 3000);

          // setMentorData(mentorRegRes?.data);
        }
      })
      .catch((err) => {
        openNotificationWithIcon("error", err.response.data?.message);
        // setBtn(false);
        formik.setErrors({
          check: err.response && err?.response?.data?.message,
        });
        return err.response;
      });
  };
  useEffect(()=>{
    setOtpRes(0);
    setBtnOtp(false);
    formik.setFieldValue("otp", "");
  
  },[formik.values.mobile]);
  useEffect(()=>{
    setOtpRes(0);
    setBtnOtp(false);
    formik.setFieldValue("otp", "");
  
  },[formik.values.email]);
  async function apiCall(mentData) {
    // Dice code list API //
    // where list = diescode  //
    const body = JSON.stringify({
      school_name: orgData.organization_name,
      udise_code: orgData.organization_code,
      // atl_code: mentorDaTa.organization_code,
      district: orgData.district,
      state: orgData.state,
      pin_code: orgData.pin_code,
      email: mentData.username,
      mobile: mentData.mobile,
    });
    var config = {
      method: "post",
      url: process.env.REACT_APP_API_BASE_URL + "/mentors/triggerWelcomeEmail",
      headers: {
        "Content-Type": "application/json",
        Authorization: "O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870",
      },
      data: body,
    };

    await axios(config)
      .then(async function (response) {
        if (response.status == 200) {
          setButtonData(response?.data?.data[0]?.data);
          navigate("/non-atl-success");

          openNotificationWithIcon("success", "Email sent successfully");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  // useEffect(() => {
  //   if (timer > 0) {
  //     const intervalId = setInterval(() => {
  //       setTimer((prevTimer) => prevTimer - 1);
  //     }, 1000);
  //     return () => clearInterval(intervalId);
  //   } else if (timer === 0 && otpSent) {
  //     setAreInputsDisabled(false);
  //     setOtpSent(false);
  //   }
  // }, [timer, otpSent]);
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
      formik.values.title.length > 0 &&
      formik.values.full_name.length > 0 &&
      formik.values.gender.length > 0 &&
      formik.values.mobile.length > 0 &&
      formik.values.email.length > 0 &&
      formik.values.whatapp_mobile.length > 0
    ) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [
    formik.values.title,
    formik.values.full_name,
    formik.values.gender,
    formik.values.username,
    formik.values.email,

    formik.values.whatapp_mobile,
  ]);
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper register-wrap bg-img">
          <div className="login-content">
            <form action="signin" onSubmit={formik.handleSubmit}>
              <div className="login-userset">
                <div className="login-logo logo-normal" onClick={handleLogoClick}>
                  <img src={logo} alt="Logo" />
                  {/* <ImageWithBasePath src="assets/img/logo.png" alt="img" /> */}
                </div>
                {/* <Link className="login-logo logo-white">
                  <ImageWithBasePath src="assets/img/logo-white.png" alt />
                </Link> */}
                {/* <div className="login-userheading">
                  <h3 className="icon-container ">
                    {" "}
                    Non-ATL School Teacher Registration{" "}
                    <a
                      href="https://www.youtube.com/watch?v=q40BSRm_cJM" 
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleIconClick}
                    >
                      <img
                        src={play}
                        className="icon"
                        alt="play"
                        style={{ verticalAlign: "middle", width: "7%" }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      />{" "}
                    </a>
                    {isTooltipVisible && (
                      <div className="tooltip">Watch Demo</div>
                    )}
                    {isModalVisible && (
                      <div className="modal-overlay" onClick={handleCloseModal}>
                        <div
                          className="modal"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span
                            className="close-button"
                            onClick={handleCloseModal}
                          >
                            &times;
                          </span>
                          <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/watch?v=q40BSRm_cJM" // Replace with the desired video URL
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="YouTube video"
                          ></iframe>
                        </div>
                      </div>
                    )}
                  </h3>
                  <h4>Register New Teacher account</h4>
                </div> */}
                {/* {diceBtn && ( */}
                {/* <div className="form-login mb-3"> */}
                {/* <label className="form-label">School UDISE Code</label> */}
                {/* <div className="form-addons">
                      <input
                        type="text"
                        className="form-control mb-3"
                        id="organization_code"
                        onChange={(e) => handleOnChange(e)}
                        value={diesCode}
                        maxLength={11}
                        minLength={11}
                        name="organization_code"
                        placeholder="Enter 11 digit UDISE Code"
                      />
                      <img src={user} alt="user" />
                    </div> */}

                {/* {error ? (
                      <p
                        style={{
                          color: "red",
                        }}
                      >
                        {error}
                      </p>
                    ) : null} */}

                {/* <div className="form-login authentication-check">
                      <div className="row">
                        <div className="col-12 d-flex align-items-center justify-content-between">
                          <div className="custom-control custom-checkbox">
                            <label className="checkboxs ps-4 mb-0 pb-0 line-height-1">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="click"
                                disabled={
                                  9999999999 <
                                  formik.values.diesCode <
                                  99999999999
                                    ? false
                                    : true
                                }
                                checked={checkBox1}
                                onClick={(e) => handleCheckbox1(e, !checkBox1)}
                              />
                              <span className="checkmarks" />I agree to the
                              Terms & Privacy
                            </label>
                          </div>
                        </div>
                      </div>
                    </div> */}

                {/* {diceBtn && (
                      <div className="form-login">
                        <button
                          type="button"
                          className="btn btn-login mb-3"
                          onClick={(e) => handleRegister(e)}
                          disabled={!isButtonEnabled}
                        >
                          {" "}
                          Proceed
                        </button>
                        <p className="form-login mb-3">
                          Already have an account ?
                          <b>
                            <Link className="hover-a" to={"/login"}>
                              {"  "} Login Instead
                            </Link>
                          </b>
                        </p>
                      </div>
                    )} */}
                {/* <br /> */}
                {/* <p className="text-center">
                      Copyright{" "}
                      <img
                        src={copy}
                        className="copy"
                        alt="copy"
                        style={{ verticalAlign: "middle", width: "5%" }}
                      />{" "}
                      SIM 2024. All rights reserved
                    </p> */}
                {/* </div> */}
                {/* )} */}
                {btn && (
                  <>
                    <div className="col-xl-12">
                      <div className="row g-3 mt-0">
                        <div className="col-md-6">
                          <label htmlFor="inputState" className="form-label">
                            State
                          </label>
                          <select
                            id="inputState"
                            className="form-select"
                            value={stateData}
                            onChange={handleStateChange}
                          >
                            <option value="">Select State</option>
                            {stateList.map((state) => (
                              <option key={state} value={state}>
                                {state}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="inputState" className="form-label">
                            District
                          </label>
                          <select
                            id="inputState"
                            className="form-select"
                            value={selectedDistrict}
                            onChange={handleDistrictChange}
                          >
                            <option value="">Select District</option>
                            {districts.map((district) => (
                              <option key={district} value={district}>
                                {district}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Pin Code</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Your Pin Code"
                            id="pin_code"
                            name="pin_code"
                            onChange={(e) => handlePincode(e)}
                            value={pinCode}
                          />
                          {errors && <p style={{ color: "red" }}>{errors}</p>}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label"> School Name</label>
                          <input
                            id="organization_name"
                            onChange={(e) => handleOnChangeSchool(e)}
                            value={schoolname}
                            name="organization_name"
                            placeholder="Enter Your School Name"
                            type="text"
                            className="form-control"
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label"> School Address</label>
                          <input
                            id="address"
                            onChange={(e) => handleOnChangeAddress(e)}
                            value={textData}
                            name="address"
                            placeholder="Enter Your School Address"
                            type="text"
                            className="form-control"
                          />
                        </div>
                        {/* <div className="col-md-6">
                          <label className="form-label">
                            {" "}
                            New District Name (if applicable)
                          </label>
                          <input
                            id="new_district"
                            onChange={(e) => handleOnChangeNewDistrict(e)}
                            value={newDistrict}
                            name="new_district"
                            placeholder="Enter New District"
                            type="text"
                            className="form-control"
                          />
                        </div> */}
                        <div className="form-login">
                          <button
                            type="button"
                            className="btn btn-login mb-3"
                            onClick={(e) => handleSubmit(e)}
                            disabled={!showButton}
                          >
                            {" "}
                            PROCEED
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {schoolBtn && (
                  <div className="col-xl-12">
                    {person && (
                    <div className="card">
                      <div className="card-body">
                        <div className="card-subtitle fw-semibold">
                          UDISE Code : {""}
                          {orgData?.organization_code}
                          <br />
                          School Name : {""}
                          {orgData?.organization_name}
                          <br />
                          {/* City Name : {""}
                          {orgData?.city ? orgData?.city : " N/A"} <br /> */}
                          District Name :{" "}
                          {orgData?.district ? orgData?.district : " N/A"}
                          <br />
                          State Name :{" "}
                          {orgData?.state ? orgData?.state : " N/A"} <br />
                          {/* PinCode :{" "}
                          {orgData?.pin_code ? orgData?.pin_code : " N/A"}{" "}
                          <br /> */}
                        </div>
                      </div>
                    </div>
                     )} 
                    <div className="card">
                      <div className="card-body">
                        <div className="row g-3 mt-0">
                          {/* {person && ( */}
                          <>
                            <div className="col-md-3">
                              <label
                                htmlFor="inputState"
                                className="form-label"
                              >
                                Title
                              </label>
                              <select
                                id="inputState"
                                className="form-select"
                                // disabled={holdKey ? true : false}
                                disabled={areInputsDisabled}
                                name="title"
                                value={formik.values.title}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                              >
                                <option value="">Title</option>
                                <option value="Dr">Dr</option>
                                <option value="Mr">Mr</option>
                                <option value="Miss">Miss</option>
                                <option value="Mrs">Mrs</option>
                              </select>
                              {formik.touched.title && formik.errors.title ? (
                                <small className="error-cls">
                                  {formik.errors.title}
                                </small>
                              ) : null}
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Full Name</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Full Name"
                                id="full_name"
                                disabled={areInputsDisabled}
                                name="full_name"
                                // onChange={formik.handleChange}
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  const lettersOnly = inputValue.replace(
                                    /[^a-zA-Z\s]/g,
                                    ""
                                  );
                                  formik.setFieldValue(
                                    "full_name",
                                    lettersOnly
                                  );
                                }}
                                onBlur={formik.handleBlur}
                                value={formik.values.full_name}
                              />
                              {formik.touched.full_name &&
                              formik.errors.full_name ? (
                                <small className="error-cls">
                                  {formik.errors.full_name}
                                </small>
                              ) : null}
                            </div>
                            <div className="col-md-3">
                              <label
                                htmlFor="inputState"
                                className="form-label"
                              >
                                Gender
                              </label>
                              <select
                                id="inputState"
                                className="form-select"
                                disabled={areInputsDisabled}
                                name="gender"
                                value={formik.values.gender}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                              >
                                <option value="">Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Prefer Not to Mention">
                                  Prefer Not to Mention{" "}
                                </option>
                              </select>
                              {formik.touched.gender && formik.errors.gender ? (
                                <small className="error-cls">
                                  {formik.errors.gender}
                                </small>
                              ) : null}
                            </div>
                            <div className="col-md-6">
                              <label
                                htmlFor="inputEmail4"
                                className="form-label"
                              >
                                Email
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                id="inputEmail4"
                                disabled={areInputsDisabled}
                                name="email"
                                onChange={handleEmailChange}
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
                            <div className="col-md-6">
                              <label
                                htmlFor="inputPassword4"
                                className="form-label"
                              >
                                Password
                              </label>
                              <input
                                type="text"
                                disabled={true}
                                // isDisabled={true}
                                name="password"
                                id="password"
                                defaultValue="readonly"
                                // readOnly="readonly"
                                className="form-control"
                                value={formik.values.password}
                              />
                              {formik.touched.password &&
                              formik.errors.password ? (
                                <small className="error-cls">
                                  {formik.errors.password}
                                </small>
                              ) : null}
                            </div>
                            <div
                              className="col-md-6"
                              style={{ marginTop: "2.5rem" }}
                            >
                              <label className="form-label">
                                Mobile Number
                              </label>

                              <input
                                type="text"
                                className="form-control"
                                id="inputEmail4"
                                disabled={areInputsDisabled}
                                name="mobile"
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  const numericValue = inputValue.replace(
                                    /\D/g,
                                    ""
                                  );
                                  formik.setFieldValue("mobile", numericValue);
                                }}
                                maxLength={10}
                                minLength={10}
                                onBlur={formik.handleBlur}
                                value={formik.values.mobile}
                              />

                              {formik.touched.mobile && formik.errors.mobile ? (
                                <small className="error-cls">
                                  {formik.errors.mobile}
                                </small>
                              ) : null}
                            </div>
                            <div className="col-md-6">
                              <div className="d-flex align-items-center justify-content-between">
                                <div
                                  style={{
                                    display: "flex",
                                  }}
                                >
                                  <span> Same </span>
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="click"
                                    disabled={
                                      (formik.values.mobile.length > 0
                                        ? false
                                        : true) || areInputsDisabled
                                    }
                                    id="click"
                                    checked={checkBox}
                                    onClick={(e) =>
                                      handleCheckbox(e, !checkBox)
                                    }
                                  />
                                </div>
                              </div>
                              <label className="form-label">
                                WhatsApp Number
                              </label>

                              <input
                                type="text"
                                className="form-control"
                                id="inputEmail4"
                                disabled={areInputsDisabled}
                                name="whatapp_mobile"
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  const numericValue = inputValue.replace(
                                    /\D/g,
                                    ""
                                  );
                                  formik.setFieldValue(
                                    "whatapp_mobile",
                                    numericValue
                                  );
                                  if (numericValue !== formik.values.mobile) {
                                    setCheckBox(false);
                                  }
                                }}
                                maxLength={10}
                                minLength={10}
                                onBlur={formik.handleBlur}
                                value={formik.values.whatapp_mobile}
                              />

                              {formik.touched.whatapp_mobile &&
                              formik.errors.whatapp_mobile ? (
                                <small className="error-cls">
                                  {formik.errors.whatapp_mobile}
                                </small>
                              ) : null}
                            </div>
                          </>
                          {/* )} */}
                          {/* {person && ( */}
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
                                  {/* {timer > 0
                                    ? `Otp will expire in 00:${
                                        timer < 10 ? `0${timer}` : timer
                                      } seconds`
                                    : "Otp expired"} */}
                                  {timer > 0
                                    ? `Access Resend OTP in ${timer < 10 ? `0${timer}` : timer} sec`
                                    : "Resend OTP enabled"}
                                </p>
                              </div>

                              <div className="login-content user-login text-center justify-content-center">
                                <div className="login-userset">
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
                                      <div className="forms-block text-center" >
                                        <div style={{
                                          display: 'flex',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                        }}>
                                          <OtpInput
                                            numInputs={6}
                                            // isDisabled={false}
                                            disabled={false}
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
                         
                          {btnOtp && (
                            <div className="form-login">
                              <button
                                className="btn btn-login"
                                type="submit"
                                disabled={
                                  isSubmitting ||
                                  !(
                                    formik.values.otp.length === 6 &&
                                    formik.values.otp === otpRes
                                  )
                                }
                              >
                                 {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin me-2" />
                Processing your Registration
              </>
            ) : (
              "Verify My Account"
            )}
                                {/* Verify My Account */}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonAtlPage;
