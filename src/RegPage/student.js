/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './Styles.css';
import logo from "../assets/img/logo.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import CryptoJS from "crypto-js";
import axios from "axios";
import { districtList, collegeType, yearofstudyList, collegeNameList } from './ORGData';
import { openNotificationWithIcon } from "../helpers/Utils.js";
import { ArrowRight } from 'react-feather';

const Crew3Reg = () => {

  const [collegeNamesList, setCollegeNamesList] = useState([]);

  const handleCollegeTypeChange = (event) => {
    const collegeType = event.target.value;
    formik.setFieldValue("collegeType", collegeType);
    formik.setFieldValue('college', '');
    formik.setFieldValue('ocn', '');
    setCollegeNamesList(collegeNameList[collegeType] || []);
  };
  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      mobile: "",
      district: "",
      college: "",
      rollnumber: "",
      branch: "",
      yearofstudy: "",
      password: "",
      confirmPassword: "",
      collegeType: "",
      ocn: ""
    },

    validationSchema: Yup.object({
      full_name: Yup.string()
        .trim()
        .min(2, <span style={{ color: "red" }}>Please Enter Full Name</span>)
        .matches(
          /^[aA-zZ\s]+$/,
          <span style={{ color: "red" }}>
            Special Characters are not allowed
          </span>
        )
        .required(<span style={{ color: "red" }}>Please Enter Full Name</span>),
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
        )
        .max(255),
      mobile: Yup.string()
        .required(
          <span style={{ color: "red" }}>Please Enter Mobile Number</span>
        )
        .trim()
        .matches(
          /^\d+$/,
          <span style={{ color: "red" }}>
            Mobile number is not valid (Enter only digits)
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
      collegeType: Yup.string().required(
        <span style={{ color: "red" }}>Please Select College Type</span>
      ),
      district: Yup.string().required(
        <span style={{ color: "red" }}>Please Select District</span>
      ),
      college: Yup.string().required(
        <span style={{ color: "red" }}>Please Select College</span>
      ),
      rollnumber: Yup.string().required(
        <span style={{ color: "red" }}>Please Enter your Roll Number</span>
      ),
      branch: Yup.string().required(
        <span style={{ color: "red" }}>Please Enter  Branch/Group/Stream Name</span>
      ),
      yearofstudy: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Year of Study</span>
      ),
      password: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Password</span>
      ),
      confirmPassword: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Confirm Password</span>
      )
    }),

    onSubmit: async (values) => {
      const key = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
      const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
      const encrypted = CryptoJS.AES.encrypt(values.confirmPassword, key, {
        iv: iv,
        padding: CryptoJS.pad.NoPadding,
      }).toString();
      const body = JSON.stringify({
        full_name: values.full_name,
        username: values.email,
        mobile: values.mobile,
        district: values.district,
        college_type: values.collegeType,
        college_name: values.college === 'Other' ? values.ocn : values.college,
        roll_number: values.rollnumber,
        branch: values.branch,
        year_of_study: values.yearofstudy,
        confirmPassword: encrypted,
        type: '6'
      });

      var config = {
        method: "post",
        url: process.env.REACT_APP_API_BASE_URL + "/students/addStudent",
        headers: {
          "Content-Type": "application/json",
          Authorization: "O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870",
        },

        data: body,
      };
      await axios(config)
        .then((mentorRegRes) => {
          if (mentorRegRes?.data?.status == 201) {
            alert("sucess");
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
    },
  });
  return (
    <div className='d-flex justify-content-center align-items-center'>
      <div className="card container m-4">
        <div className="row">
          <div className="col-md-4">
            <div className="text-center mt-5" >
              <img src={logo} alt="Logo" style={{ width: '9rem' }} />
            </div>
            <div className="row m-2 mb-3">
              <div className="col-md-2">
                <span className="circle_base complete">
                  <i className="fa fa-info"></i>
                </span>
              </div>
              <div className="col-md-10">
                <span className='d-block complete_color'>Instructions</span>
                <span className='second_text'>Registration and program guidelines.</span>
              </div>
            </div>
            <div className="row m-2 mb-3">
              <div className="col-md-2">
                <span className="circle_base complete">
                  <i className="fa fa-user"></i>
                </span>
              </div>
              <div className="col-md-10">
                <span className='d-block complete_color'>Pilot Information</span>
                <span className='second_text'>Enter your personal details.</span>
              </div>
            </div>
            <div className="row m-2 mb-3">
              <div className="col-md-2">
                <span className="circle_base complete">
                  <i className="fa fa-users"></i>
                </span>
              </div>
              <div className="col-md-10">
                <span className='d-block complete_color'>Crew-1 Information</span>
                <span className='second_text'>Enter your team member-1 details.</span>
              </div>
            </div>
            <div className="row m-2 mb-3">
              <div className="col-md-2">
                <span className="circle_base complete">
                  <i className="fa fa-users"></i>
                </span>
              </div>
              <div className="col-md-10">
                <span className='d-block complete_color'>Crew-2 Information</span>
                <span className='second_text'>Enter your team member-2 details.</span>
              </div>
            </div>
            <div className="row m-2 mb-3">
              <div className="col-md-2">
                <span className="circle_base complete">
                  <i className="fa fa-users"></i>
                </span>
              </div>
              <div className="col-md-10">
                <span className='d-block complete_color'>Crew-3 Information</span>
                <span className='second_text'>Enter your team member-3 details.</span>
              </div>
            </div>


          </div>
          <div className="col-md-8 p-4 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: '#EEEEEE' }}>
            <i className="fa fa-check-circle fa-5x text-success mb-3"></i>
            <h4 className="text-success">REGISTRATION SUCCESS</h4>
            <h6 className="mb-2">Congratulations, Your account has been successfully created.</h6>
            <button
              className="btn btn-warning m-2"
              type="submit"

            >
              LOGIN
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crew3Reg;
