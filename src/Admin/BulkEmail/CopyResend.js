/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState } from "react";
import { Row, Col, FormGroup, Label, Form } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getCurrentUser, openNotificationWithIcon } from "../../helpers/Utils";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { stateList, } from "../../RegPage/ORGData";
const ResendEmail = () => {
    const resID = JSON.parse(localStorage.getItem('resID'));

  const currentUser = getCurrentUser("current_user");
  const allData = ["All States", ...stateList];
  const navigate = useNavigate();
 
  const inputDICE = {
    type: "text",
    className: "form-control",
  };
  const inputDICE1 = {
    type: "text",
    className: "form-control",
  };
 
  const formik = useFormik({
    initialValues: {
      msg: resID && resID.msg,
      subject: resID && resID.subject,
     
      state: "",
      
    },
    validationSchema: Yup.object({
        msg: Yup.string().required("Role is Required"),
     
        state: Yup.string().optional(),
        subject: Yup.string().required("Subject is Required"),

     
     
    }),
    onSubmit: async (values) => {
      try {
       
        const body = {
          msg: values.msg,
          state: values.state,
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

        if (response.status === 201) {

          navigate("/emailList");
          openNotificationWithIcon("success", "PopUp Created Successfully");
        } 
      } catch (error) {
        if (error.response.status === 420) {
          openNotificationWithIcon("error", "PopUp for this State & Role already exists");
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
                        To
                        </Label>
                        <textarea
                          {...inputDICE}
                          id="msg"
                          name="msg"
                          placeholder="Please enter Message"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.msg}
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
                        </Label>
                        <textarea
                          {...inputDICE1}
                          id="subject"
                          name="subject"
                          rows={5} 
                          placeholder="Please enter Subject"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.subject}
                        />
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
                            State
                          </Label>
                          <select
                            id="inputState"
                            className="form-select"
                            onChange={(e) => handleStateChange(e)}
                          >
                            <option value="">Select State</option>
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
                        label="Submit details"
                        type="submit"
                        className={`btn btn-warning ${
                          !(formik.dirty && formik.isValid)
                            ? "default"
                            : "warning"
                        }`}
                        disabled={!formik.dirty}
                      >
                        Submit details
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
