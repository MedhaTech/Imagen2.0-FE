/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect } from "react";
import { Row, Col, FormGroup, Label, Form, Input } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getCurrentUser, openNotificationWithIcon } from "../../helpers/Utils";
import axios from "axios";
import { encryptGlobal } from "../../constants/encryptDecrypt";

import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
const AddEvent = () => {
  const currentUser = getCurrentUser("current_user");
  const navigate = useNavigate();
 const location = useLocation();
const cid = location.state?.id;

  const formik = useFormik({
    initialValues: {
      timing: "",
      meet_link: "",
        status: "",
    },
    validationSchema: Yup.object({
      timing: Yup.date().optional().required("Date & time is required"),
      meet_link: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        const body = {
          timing: values.timing,
          challenge_response_id: cid,
          meet_link: values.meet_link,
          status: "INCOMPLETE",
          mentorship_user_id: currentUser?.data[0]?.user_id,
        };

        if (values.meet_link !== "") {
          body["meet_link"] = values.meet_link;
        }

        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/schedule_calls`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currentUser?.data[0]?.token}`,
            },
          }
        );

        if (response.status === 201) {
          // navigate('/schedule-calls');
          navigate("/schedule-calls", { state: { showTable: true ,challenge_response_id: cid,} });
          openNotificationWithIcon(
              'success',
              'Event Created Successfully'
          );
        } else {
          openNotificationWithIcon("error", "Opps! Something Wrong");
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const buttonStyle = {
    marginRight: "10px",
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Add Schedule Calls</h4>
              <h6>You can add new events by submitting timing here</h6>
            </div>
          </div>
        </div>
        <div className="EditPersonalDetails new-member-page">
          <Row>
            <Col className="col-xl-10 offset-xl-1 offset-md-0">
              <div>
                <Form onSubmit={formik.handleSubmit} isSubmitting>
                  <div className="create-ticket register-block">
                    <Row className="mb-3 modal-body-table search-modal-header">
                      <Label className="mb-2" htmlFor="meet_link">
                       Link
                      </Label>
                      <Input
                        type="text"
                        name="meet_link"
                        id="meet_link"
                        placeholder="Please enter the link"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.meet_link}
                      />
                      {formik.touched.meet_link && formik.errors.meet_link && (
                        <small className="error-cls">{formik.errors.meet_link}</small>
                      )}
                    </Row>
                    <Row className="mb-3 modal-body-table search-modal-header">
                      <Label className="mb-2" htmlFor="timing">
                        Date & Time <span style={{ color: "red" }}>*</span>
                      </Label>
                     
                      <DatePicker
                        selected={formik.values.timing}
                        onChange={(val) => formik.setFieldValue("timing", val)}
                        onBlur={formik.handleBlur}
                        showTimeSelect
                        dateFormat="Pp"
                        placeholderText="Select date and time"
                        className="form-control"
                        name="timing"
                        id="timing"
                         minDate={new Date()}
                      />
                      {formik.touched.timing && formik.errors.timing && (
                        <small className="error-cls" style={{ color: "red" }}>
                          {formik.errors.timing}
                        </small>
                      )}
                    </Row>
                   
                  </div>

                  <Row>
                    <div style={buttonContainerStyle} className="mt-3">
                      <button
                        type="submit"
                        className="btn btn-warning"
                        style={buttonStyle}
                      >
                        Submit Details
                      </button>

                      <button
                        className="btn btn-secondary"
                        type="button"
                        style={{ marginLeft: "auto" }}
                        // onClick={() => navigate("/schedule-calls")}
                         onClick={() =>
    navigate("/schedule-calls", {
      state: {
        showTable: true,
        challenge_response_id: cid, 
      },
    })
  }
                      >
                        Discard
                      </button>
                    </div>
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

export default AddEvent;
