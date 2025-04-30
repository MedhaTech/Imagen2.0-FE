/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState } from "react";
// import Layout from '../../Admin/Layout';
import { Row, Col, FormGroup, Label, Form } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "../../stories/Button";
// import { InputBox } from '../../stories/InputBox/InputBox';
import { getCurrentUser, openNotificationWithIcon } from "../../helpers/Utils";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { URL, KEY } from '../../constants/defaultValues';
import { stateList,districtList } from "../../RegPage/ORGData";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { encryptGlobal } from "../../constants/encryptDecrypt";

const ResendEmail = () => {
    const resID = JSON.parse(localStorage.getItem('resID'));

  const currentUser = getCurrentUser("current_user");
  // const allData = ["All States", ...stateList];
  const navigate = useNavigate();
  // const inputDICE = {
  //     type: 'text',
  //    className:"form-control"
  // };
  const inputDICE = {
    type: "text",
    className: "form-control",
  };
  const inputDICE1 = {
    type: "text",
    className: "form-control",
  };
 const allData = [...districtList["Telangana"]];
 allData.unshift("All Districts");
  const formik = useFormik({
    initialValues: {
      msg: resID && resID.msg,
      subject: resID && resID.subject,
     
      state: "",
      
    },
    validationSchema: Yup.object({
        msg: Yup.string().required("Email content is Required"),

        
        state: Yup.string().required("Please select state"),
        subject: Yup.string().required("Subject is Required"),

     
     
    }),
    onSubmit: async (values) => {
      try {
        const body = {
          msg: values.msg,
          district: values.state,
          subject: values.subject,
        };
    
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/admins/bulkEmail`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currentUser?.data[0]?.token}`,
            },
          }
        );
    
        if (response.status === 200) {
          navigate("/emailList");
          openNotificationWithIcon("success", "Email Sent Successfully");
        }
      } catch (error) {
        // Handle the 400 status error and check the message for the subject validation issue
        if (error.response?.status === 400) {
          const errorMessage = error.response?.data?.errors?.[0];
    
          if (errorMessage?.includes('fails to match the required pattern')) {
            openNotificationWithIcon("error", "Special characters in subject not allowed");
          } else {
            openNotificationWithIcon("error", "Please Select State Name");
          }
        } 
      }
    },
    
   
  });


  const handleStateChange = (event) => {
    const state = event.target.value;
    formik.setFieldValue("state", state);
  };
 
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="EditPersonalDetails new-member-page">
          <Row>
            <Col className="col-xl-10 offset-xl-1 offset-md-0">
              <h4 className="mt-2 mb-2">Resend Email</h4>
              <div>
                <Form onSubmit={formik.handleSubmit} isSubmitting>
                  <div className="create-ticket register-block">
                    <FormGroup className="form-group" md={12}>
                      <Row className="mb-3 modal-body-table search-modal-header">
                      <Col md={12}>
                        <Label className="form-label" htmlFor="msg">
                        Email Content
                          {/* <span required>*</span> */}
                        </Label>
                        <ReactQuill 
                          style={{ 
                            backgroundColor: "white", 
                            
                          }} 
                          id="msg"
                          name="msg"
                          value={formik.values.msg}
                          onChange={(value) => formik.setFieldValue("msg", value)} 
                          onBlur={() => formik.setFieldTouched("msg", true)} 
                          placeholder="Please Enter Content for Email"
                        />

                        {formik.touched.msg && formik.errors.msg ? (
                          <small className="error-cls" style={{ color: "red" }}>
                            {formik.errors.msg}
                          </small>
                        ) : null}
                      </Col>
                      </Row>
                      <Row className="mb-3 modal-body-table search-modal-header">

                      <Col md={12}>
                        <Label className="form-label" htmlFor="subject">
                          Subject
                          {/* <span required>*</span> */}
                        </Label>
                        <textarea
                          {...inputDICE1}
                          id="subject"
                          name="subject"
                          rows={1}  // Set rows to 1 to limit the height
                          style={{ height: 'auto', resize: 'none' }} // Ensure it stays only one row tall
                          placeholder="Please Enter Subject"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.subject}
                        />
                        {/* <ReactQuill
            id="subject"
            name="subject"
            value={formik.values.subject}
            onChange={(value) => formik.setFieldValue("subject", value)}
            onBlur={() => formik.setFieldTouched("subject", true)} 
            placeholder="Please enter Subject"
          /> */}
                        {formik.touched.subject && formik.errors.subject ? (
                          <small className="error-cls" style={{ color: "red" }}>
                            {formik.errors.subject}
                          </small>
                        ) : null}
                      </Col>
                      </Row>
                      <Row className="mb-3 modal-body-table search-modal-header">
                        <Col md={6}>
                          <Label className="form-label" htmlFor="state">
                            District
                            {/* <span required>*</span> */}
                          </Label>
                          <select
                            id="inputState"
                            className="form-select"
                            onChange={(e) => handleStateChange(e)}
                          >
                            <option value="">Select District</option>
                            {allData.map((state) => (
                              <option key={state} value={state}>
                                {state}
                              </option>
                            ))}
                          </select>

                          {formik.touched.state && formik.errors.state ? (
                            <small
                              className="error-cls"
                              style={{ color: "red" }}
                            >
                              {formik.errors.state}
                            </small>
                          ) : null}
                        </Col>
                      </Row>
                     
                    </FormGroup>
                  </div>

                 
                  <Row className="d-flex justify-content-between">
                    <Col className="col-xs-12 col-sm-6 d-flex justify-content-start">
                      <button
                        label="Submit Details"
                        type="submit"
                        className={`btn btn-warning ${
                          !(formik.dirty && formik.isValid)
                            ? "default"
                            : "warning"
                        }`}
                        disabled={!formik.dirty}
                      >
                        Trigger Email
                      </button>
                    </Col>

                    <Col className="col-xs-12 col-sm-6 d-flex justify-content-end">
                      <button
                        type="cancel"
                        className="btn btn-secondary"
                        onClick={() => navigate("/emailList")}
                      >
                        Discard
                      </button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ResendEmail;
