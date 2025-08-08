/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Row, Col, Label } from "reactstrap";
import Select from "react-select";

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
} from "../../RegPage/ORGData.js";
import * as Yup from "yup";
import { useFormik } from "formik";
import { encryptGlobal } from "../../constants/encryptDecrypt";
import { useNavigate } from "react-router-dom";
import female from "../../assets/img/Female_Profile.png";
import male from "../../assets/img/Male_Profile.png";
import user from "../../assets/img/user.png";
import { isString } from "antd/es/button";
import { MaskedEmail, MaskedMobile } from "../../RegPage/MaskedData.js";
const InstEdit = () => {
  const location = useLocation();
  const studentData = location.state || {};
  const { mentor_id, studentsData } = location.state || {};

  const currentUser = getCurrentUser("current_user");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState(studentsData);
  console.log(data, "data");

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
         if (item !== "" && district !== "") {
            if (
              item !== "Govt - Degree College" &&
              item !== "Govt - Polytechnic College" &&
              item !== "Govt - ITI College"
            ) {
              setCollegeNamesList([...collegeNames, "Other"]);
            } else {
              setCollegeNamesList(collegeNames);
            }
          }
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

      collegeType: "",
      ocn: "",
    },
    // initialValues: {
    //   full_name: data?.full_name || '',
    //   email: data.username_email,
    //   mobile: data?.mobile,
    //   district: data?.district,
    //   college: data?.college_name,
    //   rollnumber: data?.roll_number,
    //   branch: data?.branch,
    //   yearofstudy: data?.
    //   year_of_study
    //   ,
    //   collegeType: data?.college_type,
    //   ocn: data?.college_name,
    // },

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
          "Email Must be VALID"
        )
        .max(255),
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
    }),

    onSubmit: (values) => {
      // alert("hii");
      const body = {
        full_name: values.full_name,
        // mobile: String(values.mobile),
        district: values.district,
        college_type: values.collegeType,
        college_name: values.college === "Other" ? values.ocn : values.college,
      };
      if (data && data.username_email !== values.email && values.email) {
        body["username"] = values.email;
      }

      if (data && data.mobile !== values.mobile && values.mobile) {
        body["mobile"] = values.mobile;
      }
      // if (data && data.id_number !== values.id_number ) {
      //   body["id_number"] = values.id_number;
      // }

      const teamparamId = encryptGlobal(JSON.stringify(data?.mentor_id));
      var config = {
        method: "put",
        url: process.env.REACT_APP_API_BASE_URL + "/mentors/" + teamparamId,
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
              "Institution Details Updated Successfully"
            );
           navigate("/Institution-view");
            // handleView(studentData);
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

        collegeType: data.college_type || "",
        ocn: data.college_type === "Other" ? data.college_name : "",
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

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="login-userheading">
          <h4>Edit Institution</h4>
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
                        <div className="col-md-6">
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
                        <div className={`col-md-6`}>
                          <label
                            htmlFor="email"
                            className="form-label d-flex align-items-center"
                          >
                            Email
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

                        <div className="col-md-6">
                          <label
                            htmlFor="email"
                            className="form-label d-flex align-items-center"
                          >
                            Mobile Number
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
                        <div className={`col-md-6`}>
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

                        <div className={`col-md-6`}>
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
                            onMenuOpen={() => {
                                                        if (
                                                          formik.values.collegeType === "" ||
                                                          formik.values.district === ""
                                                        ) {
                                                          openNotificationWithIcon(
                                                            "error",
                                                            "District and College Type should be selected before selecting college name"
                                                          );
                                                        }
                                                      }}
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
                      </>

                      <div className="form-login d-flex justify-content-between">
                        <button
                          //                         type="submit"
                          // className={`btn btn-warning m-2 ${
                          //   !formik.dirty || !formik.isValid ? "default" : "primary"
                          // }`}
                          className="btn btn-warning m-2"
                          type="submit"
                          disabled={
                            !formik.isValid ||
                            !formik.dirty ||
                            (formik.values.college === "Other" &&
                              !formik.values.ocn)
                          }
                          // disabled={!formik.dirty || !formik.isValid}
                        >
                          Submit
                        </button>
                        <button
                          className="btn btn-warning m-2"
                          type="button"
                          onClick={() => navigate("/Institution-view")}
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

export default InstEdit;
