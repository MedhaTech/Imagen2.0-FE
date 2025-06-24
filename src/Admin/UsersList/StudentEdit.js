/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Row, Col, Label } from "reactstrap";
import moment from "moment/moment";

import {
  getCurrentUser,
  setCurrentUser,
  openNotificationWithIcon,
} from "../../helpers/Utils";
import {
  getAdminTeamMembersList,
  // studentResetPassword
} from "../../redux/actions";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { connect, useDispatch, useSelector } from "react-redux";
import { ArrowLeft, ArrowRight } from "react-feather";
import {
  districtList,
  collegeType,
  yearofstudyList,
  genderList,
  disabilityList,
  areaList,
} from "../../RegPage/ORGData.js";
import * as Yup from "yup";
import { useFormik } from "formik";
import { encryptGlobal } from "../../constants/encryptDecrypt";
import { useNavigate } from "react-router-dom";
import female from "../../assets/img/Female_Profile.png";
import male from "../../assets/img/Male_Profile.png";
import user from "../../assets/img/user.png";
import { isString } from "antd/es/button";
import Select from "react-select";
import { MaskedEmail, MaskedMobile } from "../../RegPage/MaskedData.js";

const StuEdit = () => {
  const location = useLocation();
  const studentData = location.state || {};
  const currentUser = getCurrentUser("current_user");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  useEffect(() => {
    mentorViewApi();
  }, [studentData.student_id]);

  const mentorViewApi = () => {
    let supId;
    if (typeof studentData.student_id !== "string") {
      supId = encryptGlobal(JSON.stringify(studentData.student_id));
    } else {
      supId = encryptGlobal(studentData.student_id);
    }
    var config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL + `/students/${supId}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setData(response.data.data[0]);
          // console.log(response,"res");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const [collegeNamesList, setCollegeNamesList] = useState([]);
  const [selectedCollegeType, setSelectedCollegeType] = useState("");

  useEffect(() => {
    if (data?.college_type && data?.district) {
      AllCollegesApi(data.college_type, data?.district);
    }
  }, [data?.college_type, data?.district]);
  const handleCollegeTypeChange = (event) => {
    const selectedCollegeType = event.target.value;
    formik.setFieldValue("collegeType", selectedCollegeType);
    setSelectedCollegeType(selectedCollegeType);
    formik.setFieldValue("college", "");
    formik.setFieldValue("ocn", "");
    AllCollegesApi(selectedCollegeType, formik.values.district);
  };
  const handledistrictChange = (event) => {
    formik.setFieldValue("district", event.target.value);
    formik.setFieldValue("college", "");
    formik.setFieldValue("ocn", "");
    AllCollegesApi(formik.values.collegeType, event.target.value);
  };
  const AllCollegesApi = (item, district) => {
    const distParam = encryptGlobal(
      JSON.stringify({
        college_type: item,
        district: district,
      })
    );

    var config = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/dashboard/CollegeNameForCollegeTypeDistrict?Data=${distParam}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870",
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          // console.log(response, "res");
          const apiData = response.data.data || [];
          const collegeNames = apiData.map((college) => college.college_name);
          setCollegeNamesList([...collegeNames, "Other"]);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const collegeOptions = collegeNamesList.map((item) => ({
    value: item,
    label: item,
  }));
  // console.log(collegeNamesList,"options");
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
      collegeType: "",
      ocn: "",
      id_number: "",
      gender: "",
      college_town: "",
      dateofbirth: "",
      area: "",
      disability: "",
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
        // .optional()
        .required(
          <span style={{ color: "red" }}>Please Enter Email Address</span>
        )
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Email Must be Valid"
        )
        .max(255),
      college_town: Yup.string().optional(),
      gender: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Gender</span>
      ),
      id_number: Yup.string().optional(),
      mobile: Yup.string()
        // .optional()
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
        <span style={{ color: "red" }}>Please Select Institution District</span>
      ),
      college: Yup.string().required(
        <span style={{ color: "red" }}>Please Select College</span>
      ),
      rollnumber: Yup.string().required(
        <span style={{ color: "red" }}>Please Enter your Roll Number</span>
      ),
      branch: Yup.string().required(
        <span style={{ color: "red" }}>
          Please Enter Branch/Group/Stream Name
        </span>
      ),
      yearofstudy: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Year of Study</span>
      ),
      dateofbirth: Yup.date()
        .required(
          <span style={{ color: "red" }}>Please Select Date of Birth</span>
        )
        .min(
          moment().subtract(27, "years").startOf("day").toDate(),
          "Your age must be at most 27 years"
        )
        .max(
          moment().subtract(15, "years").endOf("day").toDate(),
          "Your age must be at least 15 years"
        ),
      disability: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Disability Status</span>
      ),
      area: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Area of Residence</span>
      ),
    }),

    onSubmit: (values) => {
      const body = {
        full_name: values.full_name,
        district: values.district,
        college_type: values.collegeType,
        college_name: values.college === "Other" ? values.ocn : values.college,
        roll_number: values.rollnumber,
        branch: values.branch,
        year_of_study: values.yearofstudy,
        gender: values.gender,
        college_town: values.college_town,
        dateofbirth: values.dateofbirth,
        disability: values.disability,
        area: values.area,
      };

      if (data && data.username_email !== values.email && values.email) {
        body["username"] = values.email;
      }

      if (data && data.mobile !== values.mobile && values.mobile) {
        body["mobile"] = values.mobile;
      }

      if (values.id_number !== "") {
        body["id_number"] = values.id_number;
      }
      const teamparamId = encryptGlobal(JSON.stringify(data?.student_id));
      var config = {
        method: "put",
        url: process.env.REACT_APP_API_BASE_URL + "/students/" + teamparamId,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.data[0]?.token}`,
        },
        data: JSON.stringify(body),
      };
      axios(config)
        .then(function (response) {
          if (response.status === 200) {
            openNotificationWithIcon(
              "success",
              "Student Details Updated Successfully"
            );
            navigate("/students");
          } else {
            openNotificationWithIcon("error", "Opps! Something Wrong");
          }
        })
        .catch(function (err) {
          if (err?.response?.data?.status === 400) {
            openNotificationWithIcon(
              "error",
              err.response.data?.message !== "Bad Request"
                ? err.response.data?.message
                : "Email id is Invalid"
            );
          } else {
            openNotificationWithIcon("error", "Email id is Invalid");
          }
        });
    },
  });
  useEffect(() => {
    if (data) {
      formik.setValues({
        full_name: data.full_name || "",
        email: data.username_email || "",
        mobile: data.mobile || "",
        district: data.district || "",
        college: data.college_name || "",
        rollnumber: data.roll_number || "",
        branch: data.branch || "",
        yearofstudy: data.year_of_study || "",
        collegeType: data.college_type || "",
        ocn: data.college_type === "Other" ? data.college_name : "",
        id_number: data.id_number || "",
        college_town: data.college_town || "",
        gender: data.gender || "",
        dateofbirth: data.dateofbirth || "",
        disability: data.disability || "",
        area: data.area || "",
      });
    }
  }, [data]);

  useEffect(() => {
    if (data?.college_type) {
      formik.setFieldValue("collegeType", data.college_type);
    }
  }, [data?.college_type]);
  useEffect(() => {
    if (data.college_name) {
      formik.setFieldValue("college", data.college_name);
    }
  }, [data.college_name]);

  console.log(formik.values.college_name, "coll");
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="login-userheading">
          <h4>Edit Student</h4>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <div className="card container m-4">
            <div className="row">
              <div
                className="col-md-12 p-4"
                style={{ backgroundColor: "#EEEEEE" }}
              >
                <form onSubmit={formik.handleSubmit}>
                  {/* <div className="login-userset"> */}
                  <div className="col-xl-12">
                    <div className="row g-3 mt-0">
                      <>
                        <div className="col-md-4">
                          <label className="form-label" htmlFor="full_name">
                            Full Name
                          </label>
                          &nbsp;
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            *
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Full Name"
                            id="full_name"
                            name="full_name"
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              const lettersOnly = inputValue.replace(
                                /[^a-zA-Z\s]/g,
                                ""
                              );
                              formik.setFieldValue("full_name", lettersOnly);
                            }}
                            onBlur={formik.handleBlur}
                            value={formik.values.full_name || ""}
                          />
                          {formik.touched.full_name &&
                          formik.errors.full_name ? (
                            <small className="error-cls">
                              {formik.errors.full_name}
                            </small>
                          ) : null}
                        </div>
                        <div className={`col-md-2`}>
                          <label htmlFor="gender" className="form-label">
                            Gender
                          </label>
                          &nbsp;
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            *
                          </span>
                          <select
                            id="gender"
                            className="form-select"
                            name="gender"
                            value={formik.values.gender}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          >
                            <option value={""}>Gender</option>
                            {genderList.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                          {formik.touched.gender && formik.errors.gender ? (
                            <small
                              className="error-cls"
                              style={{ color: "red" }}
                            >
                              {formik.errors.gender}
                            </small>
                          ) : null}
                        </div>
                        <div className={`col-md-2`}>
                          <label htmlFor="dateofbirth" className="form-label">
                            Date of Birth
                          </label>
                          &nbsp;
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            *
                          </span>
                          <input
                            type="date"
                            className="form-control"
                            id="dateofbirth"
                            name="dateofbirth"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.dateofbirth}
                          />
                          {formik.touched.dateofbirth &&
                          formik.errors.dateofbirth ? (
                            <small
                              className="error-cls"
                              style={{ color: "red" }}
                            >
                              {formik.errors.dateofbirth}
                            </small>
                          ) : null}
                        </div>
                        <div className={`col-md-4`}>
                          <label htmlFor="disability" className="form-label">
                            Disability Status
                          </label>
                          &nbsp;
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            *
                          </span>
                          <select
                            id="disability"
                            className="form-select"
                            name="disability"
                            value={formik.values.disability}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                          >
                            <option value={""}>Disability Status</option>
                            {disabilityList.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                          {formik.touched.disability &&
                          formik.errors.disability ? (
                            <small
                              className="error-cls"
                              style={{ color: "red" }}
                            >
                              {formik.errors.disability}
                            </small>
                          ) : null}
                        </div>
                        <div className={`col-md-4`}>
                          <label htmlFor="area" className="form-label">
                            Area of Residence
                          </label>
                          &nbsp;
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            *
                          </span>
                          <select
                            id="area"
                            className="form-select"
                            name="area"
                            value={formik.values.area}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                          >
                            <option value={""}>Area of Residence</option>
                            {areaList.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                          {formik.touched.area && formik.errors.area ? (
                            <small
                              className="error-cls"
                              style={{ color: "red" }}
                            >
                              {formik.errors.area}
                            </small>
                          ) : null}
                        </div>
                        <div className={`col-md-4`}>
                          <label
                            htmlFor="email"
                            className="form-label d-flex align-items-center"
                          >
                            Email
                            {/* <MaskedEmail email={data?.username_email}/> */}
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Email"
                            name="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email || ""}
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

                        <div className="col-md-4">
                          <label
                            htmlFor="email"
                            className="form-label d-flex align-items-center"
                          >
                            Mobile Number
                            {/* &nbsp;<MaskedMobile mobile={data?.mobile}/> */}
                          </label>

                          <input
                            type="text"
                            className="form-control"
                            id="mobile"
                            placeholder="Mobile"
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
                            value={formik.values.mobile || ""}
                          />

                          {formik.touched.mobile && formik.errors.mobile ? (
                            <small className="error-cls">
                              {formik.errors.mobile}
                            </small>
                          ) : null}
                        </div>
                        <div className={`col-md-4`}>
                          <label htmlFor="district" className="form-label">
                            District
                          </label>
                          &nbsp;
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            *
                          </span>
                          <select
                            id="district"
                            className="form-select"
                            name="district"
                            value={formik.values.district || ""}
                            onBlur={formik.handleBlur}
                            onChange={handledistrictChange}
                          >
                            <option value={""}>
                              Select Your Institution District
                            </option>
                            {districtList["Andhra Pradesh"].map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                          {formik.touched.district && formik.errors.district ? (
                            <small className="error-cls">
                              {formik.errors.district}
                            </small>
                          ) : null}
                        </div>
                        <div className="col-md-4">
                          <label className="form-label" htmlFor="branch">
                            College Town
                          </label>
                          &nbsp;
                          {/* <span style={{ color: "red", fontWeight: "bold" }}>
                          *
                        </span> */}
                          <input
                            type="text"
                            className="form-control"
                            placeholder="College Town"
                            id="college_town"
                            name="college_town"
                            // onChange={formik.handleChange}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              const lettersOnly = inputValue.replace(
                                /[^a-zA-Z0-9 \s]/g,
                                ""
                              );
                              formik.setFieldValue("college_town", lettersOnly);
                            }}
                            onBlur={formik.handleBlur}
                            value={formik.values.college_town}
                          />
                          {formik.touched.college_town &&
                          formik.errors.college_town ? (
                            <small className="error-cls">
                              {formik.errors.college_town}
                            </small>
                          ) : null}
                        </div>
                        <div className={`col-md-4`}>
                          <label htmlFor="collegeType" className="form-label">
                            College Type
                          </label>
                          &nbsp;
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            *
                          </span>
                          <select
                            id="collegeType"
                            className="form-select"
                            name="collegeType"
                            value={formik.values.collegeType || ""}
                            onBlur={formik.handleBlur}
                            onChange={handleCollegeTypeChange}
                          >
                            <option value={""}>Select College Type</option>
                            {collegeType.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                          {formik.touched.collegeType &&
                          formik.errors.collegeType ? (
                            <small className="error-cls">
                              {formik.errors.collegeType}
                            </small>
                          ) : null}
                        </div>

                        <div className={`col-md-6`}>
                          <label htmlFor="college" className="form-label">
                            College Name
                          </label>
                          &nbsp;
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            *
                          </span>
                          {/* <select
                              id="college"
                              className="form-select"
                              name="college"
                              value={formik.values.college || ""}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            >
                              <option value={""}>Select College Name</option>
                              {collegeNamesList.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select> */}
                          <Select
                            classNamePrefix="react-select"
                            options={collegeOptions}
                            placeholder=" Type here to Select Your College Name"
                            value={
                              collegeOptions.find(
                                (option) =>
                                  option.value === formik.values.college
                              ) === undefined
                                ? null
                                : collegeOptions.find(
                                    (option) =>
                                      option.value === formik.values.college
                                  )
                            }
                            onChange={(selectedOption) =>
                              formik.setFieldValue(
                                "college",
                                selectedOption?.value
                              )
                            }
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.college && formik.errors.college ? (
                            <small className="error-cls">
                              {formik.errors.college}
                            </small>
                          ) : null}
                        </div>
                        <div className={`col-md-6`}>
                          <label htmlFor="rollnumber" className="form-label">
                            Roll Number Provided by the College
                          </label>
                          &nbsp;
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            *
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            id="rollnumber"
                            placeholder="Roll Number"
                            name="rollnumber"
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              const lettersOnly = inputValue.replace(
                                /[^a-zA-Z0-9 \s]/g,
                                ""
                              );
                              formik.setFieldValue("rollnumber", lettersOnly);
                            }}
                            onBlur={formik.handleBlur}
                            value={formik.values.rollnumber || ""}
                          />
                          {formik.touched.rollnumber &&
                          formik.errors.rollnumber ? (
                            <small
                              className="error-cls"
                              style={{ color: "red" }}
                            >
                              {formik.errors.rollnumber}
                            </small>
                          ) : null}
                        </div>
                        {formik.values.college === "Other" && (
                          <div className={`col-md-12`}>
                            <label htmlFor="ocn" className="form-label">
                              Other College Name
                            </label>
                            &nbsp;
                            <span style={{ color: "red", fontWeight: "bold" }}>
                              *
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              id="ocn"
                              placeholder="Other College Name"
                              name="ocn"
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                const lettersOnly = inputValue.replace(
                                  /[^a-zA-Z0-9 \s]/g,
                                  ""
                                );
                                formik.setFieldValue("ocn", lettersOnly);
                              }}
                              onBlur={formik.handleBlur}
                              value={formik.values.ocn || ""}
                            />
                            {formik.touched.ocn && formik.errors.ocn ? (
                              <small
                                className="error-cls"
                                style={{ color: "red" }}
                              >
                                {formik.errors.ocn}
                              </small>
                            ) : null}
                          </div>
                        )}

                        <div className="col-md-4">
                          <label className="form-label" htmlFor="branch">
                            Branch/Group/Stream
                          </label>
                          &nbsp;
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            *
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=" Branch/Group/Stream"
                            id="branch"
                            name="branch"
                            // onChange={formik.handleChange}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              const lettersOnly = inputValue.replace(
                                /[^a-zA-Z0-9 \s]/g,
                                ""
                              );
                              formik.setFieldValue("branch", lettersOnly);
                            }}
                            onBlur={formik.handleBlur}
                            value={formik.values.branch || ""}
                          />
                          {formik.touched.branch && formik.errors.branch ? (
                            <small className="error-cls">
                              {formik.errors.branch}
                            </small>
                          ) : null}
                        </div>
                        <div className={`col-md-4`}>
                          <label htmlFor="id_number" className="form-label">
                            APAAR ID
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="id_number"
                            placeholder="APAAR ID"
                            // disabled={areInputsDisabled}
                            name="id_number"
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              const lettersOnly = inputValue.replace(
                                /[^a-zA-Z0-9 \s]/g,
                                ""
                              );
                              formik.setFieldValue("id_number", lettersOnly);
                            }}
                            onBlur={formik.handleBlur}
                            value={formik.values.id_number}
                          />
                          {formik.touched.id_number &&
                          formik.errors.id_number ? (
                            <small
                              className="error-cls"
                              style={{ color: "red" }}
                            >
                              {formik.errors.id_number}
                            </small>
                          ) : null}
                        </div>
                        <div className={`col-md-4`}>
                          <label htmlFor="yearofstudy" className="form-label">
                            Year of Study
                          </label>
                          &nbsp;
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            *
                          </span>
                          <select
                            id="yearofstudy"
                            className="form-select"
                            name="yearofstudy"
                            value={formik.values.yearofstudy}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                          >
                            <option value={""}>Select Year of Study</option>
                            {yearofstudyList.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                          {formik.touched.yearofstudy &&
                          formik.errors.yearofstudy ? (
                            <small className="error-cls">
                              {formik.errors.yearofstudy}
                            </small>
                          ) : null}
                        </div>
                      </>

                      <div className="form-login d-flex justify-content-between">
                        <button
                          // className={`btn btn-warning m-2 ${
                          //   !formik.dirty || !formik.isValid
                          //     ? "default"
                          //     : "primary"
                          // }`}
                          className="btn btn-warning m-2"
                          type="submit"
                          // disabled={!formik.isValid || !formik.dirty}
                        >
                          Submit
                        </button>
                        <button
                          className="btn btn-warning m-2"
                          type="button"
                          onClick={() => navigate("/students")}
                        >
                          {/* <ArrowLeft /> */}
                          Discard
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* </div> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StuEdit;
