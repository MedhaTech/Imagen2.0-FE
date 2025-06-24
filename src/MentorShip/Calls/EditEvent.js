/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React,{useEffect, useState} from "react";
import { Row, Col, FormGroup, Label, Form, Input } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getCurrentUser, openNotificationWithIcon } from "../../helpers/Utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
import { encryptGlobal } from "../../constants/encryptDecrypt";

const EditEvent = () => {
  const currentUser = getCurrentUser("current_user");
  const navigate = useNavigate();
 const location = useLocation();
const cid = location.state?.id;
const [callId,setCallId]=useState("");
const [data,setData]=useState([]);
useEffect(()=>{
mentorGetApi(cid);
},[]);
 const mentorGetApi = (id) => {
    const surveyApi = encryptGlobal(
      JSON.stringify({
        challenge_response_id: id,
      })
    );
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/schedule_calls?Data=${surveyApi}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setData(response?.data?.data[0]);
          setCallId(response?.data?.data[0]?.schedule_call_id);
          console.log(response,"api");
       
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
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
          status: values.status,
          mentorship_user_id: currentUser?.data[0]?.user_id,
        };

        if (values.meet_link !== "") {
          body["meet_link"] = values.meet_link;
        }
const teamparamId = encryptGlobal(JSON.stringify(data?.schedule_call_id));

        const response = await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/schedule_calls/${teamparamId}`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currentUser?.data[0]?.token}`,
            },
          }
        );

        if (response.status === 200) {
          navigate('/schedule-calls');
          openNotificationWithIcon(
              'success',
              'Event Updated Successfully'
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
useEffect(() => {
    if (data) {
      formik.setValues({
        meet_link: data.meet_link || "",
        timing: data.timing || "",
        status: data.status || "",
      });
    }
  }, [data]);
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Edit Schedule Calls</h4>
              <h6>You can edit events by submitting timing here</h6>
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
                      />
                      {formik.touched.timing && formik.errors.timing && (
                        <small className="error-cls" style={{ color: "red" }}>
                          {formik.errors.timing}
                        </small>
                      )}
                    </Row>
                    <Row className="mb-3 modal-body-table search-modal-header">
                                       <Col md={6}>
                                         <Label className="mb-2" htmlFor="status">
                                           Status
                                           <span required>*</span>
                                         </Label>
                                         <select
                                           name="status"
                                           id="status"
                                           className="form-control custom-dropdown"
                                           onChange={formik.handleChange}
                                           onBlur={formik.handleBlur}
                                           value={formik.values.status}
                                         >
                                           <option value="">Select Status</option>
                                           <option value="COMPLETED">COMPLETED</option>
                                           <option value="INCOMPLETE">INCOMPLETE</option>
                                         </select>
                                         {formik.touched.status && formik.errors.status && (
                                           <small className="error-cls" style={{ color: "red" }}>
                                             {formik.errors.status}
                                           </small>
                                         )}
                                       </Col>
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
                        onClick={() => navigate("/schedule-calls")}
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

export default EditEvent;
