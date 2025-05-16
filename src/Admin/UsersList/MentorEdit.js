/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  getCurrentUser,
  openNotificationWithIcon,
} from "../../helpers/Utils";
import { Row, Col, Form, Label, FormGroup } from 'reactstrap';

import { useLocation } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { encryptGlobal } from "../../constants/encryptDecrypt";
import { useNavigate } from "react-router-dom";

const TeacherEditProfile = () => {
  const location = useLocation();
  const mentorData = location.state || {};
  const navigate = useNavigate();

  const currentUser = getCurrentUser("current_user");
  const getValidationSchema = () => {
    // where data = mentorData //
    const adminValidation = Yup.object({
     
      title: Yup.string().required(
        <span style={{ color: "red" }}>Please select Title</span>
      ),
      gender:Yup.string().required(
        <span style={{ color: "red" }}>Please select Gender</span>
      ),
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
    });
    return adminValidation;
  };
  const getInitialValues = (mentorData) => {
    const commonInitialValues = {
      full_name: mentorData?.full_name,
        mobile: mentorData?.mobile,
      title: mentorData?.title,
        whatapp_mobile: mentorData?.whatapp_mobile,
        gender: mentorData?.gender,
    };
    return commonInitialValues;
  };
  const formik = useFormik({
    initialValues: getInitialValues(mentorData),
    validationSchema: getValidationSchema(),
    onSubmit: (values) => {
      const full_name = values.full_name;
      const mobile = values.mobile;
      const title = values.title;
        const whatapp_mobile = values.whatapp_mobile;
        const gender = values.gender;
      const body = JSON.stringify({
        full_name: full_name,
        title: title,
        whatapp_mobile: whatapp_mobile,
        gender: gender,
        mobile: mobile,
        username: mentorData.username,
      });
      const ment = encryptGlobal(JSON.stringify(mentorData.mentor_id));
      const url = process.env.REACT_APP_API_BASE_URL + "/mentors/" + ment;
      var config = {
        method: "put",
        url: url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.data[0]?.token}`,
        },
        data: body,
      };
      axios(config)
        .then(function (response) {
          if (response.status === 200) {
            openNotificationWithIcon("success", "Updated Successfully");
           
            navigate("/mentors");
           
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  });
  const formLoginStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };
  const buttonStyle = {
    marginRight: '10px'
  };

  const cancelLinkStyle = {
    marginLeft: 'auto'
  };
  return (
    <div className="page-wrapper">
      <div className="content">
      <div className="EditPersonalDetails new-member-page">
                <Row>
                    <Col className="col-xl-10 offset-xl-1 offset-md-0">
                        <h3 className="mb-5">Edit Teacher Details</h3>
                        <div>
        <Form onSubmit={formik.handleSubmit} isSubmitting >
          <div className="create-ticket register-block">
             
          <Row  className="mb-3 modal-body-table search-modal-header">
                  <Col md={4}>
                    <label  className="form-label">Title</label>
                    <select
                      id="inputState"
                      className="form-select"
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
                      <small className="error-cls">{formik.errors.title}</small>
                    ) : null}
                  </Col>
                  <Col md={5}>
                    <label className="form-label">Teacher Name</label>
                    <input
                      type="text"
                      className="form-control"
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
                      value={formik.values.full_name}
                    />
                    {formik.touched.full_name && formik.errors.full_name ? (
                      <small className="error-cls">
                        {formik.errors.full_name}
                      </small>
                    ) : null}
                  </Col>
                  <Col md={3}>
                    <label  className="form-label">Gender</label>
                    <select
                      id="inputState"
                      className="form-select"
                      name="gender"
                      value={formik.values.gender}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    >
                      <option value="">Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Prefer Not to Mention">Prefer Not to Mention</option>
                    </select>
                    {formik.touched.gender && formik.errors.gender ? (
                      <small className="error-cls">{formik.errors.gender}</small>
                    ) : null}
                  </Col>
                  </Row>
                 
                  <Row className="mb-3 modal-body-table search-modal-header">
                 <Col md={6}>
                 <label className="form-label">
                                Mobile Number
                              </label>

                              <input
                                type="text"
                                className="form-control"
                                id="inputEmail4"
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
                 </Col>
                 <Col md={6}>
                 <label className="form-label">
                                WhatsApp Number
                              </label>

                              <input
                                type="text"
                                className="form-control"
                                id="inputEmail4"
                                name="whatapp_mobile"
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  const numericValue = inputValue.replace(
                                    /\D/g,
                                    ""
                                  );
                                  formik.setFieldValue("whatapp_mobile", numericValue);
                                }}
                                maxLength={10}
                                minLength={10}
                                onBlur={formik.handleBlur}
                                value={formik.values.whatapp_mobile}
                              />

                              {formik.touched.whatapp_mobile && formik.errors.whatapp_mobile ? (
                                <small className="error-cls">
                                  {formik.errors.whatapp_mobile}
                                </small>
                              ) : null}</Col>

              
            </Row>
            <div className="form-login" style={formLoginStyle}>
                  <button
                    style={buttonStyle}
                    
                    type="submit"
                    className={`btn btn-warning  ${
                      !(formik.dirty && formik.isValid) ? "default" : "primary"
                    }`}
                    disabled={!(formik.dirty && formik.isValid)}
                  >
                    Submit
                  </button>
                  <Link className="btn btn-cancel" to={"/mentor-view"}  style={cancelLinkStyle}>
                    Cancel
                  </Link>
                </div>
          </div>
        </Form>
      </div>
</Col>
</Row>
</div>

      </div>
    </div>
  );
};

export default TeacherEditProfile;
