/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "reactstrap";
import axios from "axios";

import * as Yup from "yup";
import { useFormik } from "formik";
// eslint-disable-next-line no-unused-vars
import { getCurrentUser, openNotificationWithIcon } from "../../helpers/Utils";
import { encryptGlobal } from "../../constants/encryptDecrypt";

import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
import moment from "moment";

const StudentMentorship = (props) => {
  const location = useLocation();
  const studentData = location.state || {};
  const [predata, setPreData] = useState([]);
  const [chatId, setChatId] = useState("");
  const currentUser = getCurrentUser("current_user");
  const navigate = useNavigate();
  const TeamId =
    currentUser?.data[0]?.type_id === 0
      ? currentUser?.data[0]?.student_id
      : currentUser?.data[0]?.type_id;
  useEffect(() => {
    submittedApi();
  }, []);
  useEffect(() => {
    if (chatId) {
      mentorgetApi();
    }
  }, [chatId]);
  const submittedApi = () => {
    // This function fetches idea submission details from the API //

    const Param = encryptGlobal(
      JSON.stringify({
        student_id: TeamId,
      })
    );
    var configidea = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/challenge_response/submittedDetails?Data=${Param}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(configidea)
      .then(function (response) {
        if (response.status === 200) {
          if (response.data.data && response.data.data.length > 0) {
            setChatId(response.data.data[0].chatbox_id);
          }
        }
      })
      .catch(function (error) {
        if (error.response.status === 404) {
          //   seterror4( true);
        }
      });
  };
  const mentorgetApi = () => {
    const surveyApi = encryptGlobal(JSON.stringify(chatId));
    var config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL + `/chatboxs/${surveyApi}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setPreData(response.data.data[0].chatbox_replies);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const formik = useFormik({
    initialValues: {
      description: "",
    },

    validationSchema: Yup.object({
      description: Yup.string().required(
        "Please Enter Message for your Mentor"
      ),
    }),
    onSubmit: async (values, { resetForm }) => {
      const body = JSON.stringify({
        chatbox_id: chatId,
        reply_details: values.description.trim(),
      });
      var config = {
        method: "post",
        url: process.env.REACT_APP_API_BASE_URL + "/chatbox_replies",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.data[0]?.token}`,
        },

        data: body,
      };
      await axios(config)
        .then((mentorRegRes) => {
          if (mentorRegRes?.data?.status == 201) {
            const mentorData = mentorRegRes?.data?.data[0];
            openNotificationWithIcon("success", "Message sent Successfully");
            resetForm();
            mentorgetApi();
          }
        })
        .catch((err) => {
          if (err?.response?.data?.status === 406) {
            openNotificationWithIcon("error", err.response.data?.message);
          }

          return err.response;
        });
    },
  });

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-title">
          <h4>Chat Box</h4>
          <br />
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            className="EditPersonalDetails new-member-page"
            style={{ width: "60%" }}
          >
            <Row>
              <form onSubmit={formik.handleSubmit}>
                <Card className="aside">
                  {predata?.length > 0 &&
                    predata.map((data, i) => {
                      return data.created_by == currentUser.data[0]?.user_id ? (
                        <div className="text-end" key={i}>
                          <div className="m-2">
                            {data.created_name} <FaUserCircle />
                          </div>
                          <div
                            key={i}
                            style={{
                              display: "inline-block",
                              width: "fit-content",
                              borderStyle: "solid",
                              borderWidth: "thin",
                              borderColor: "aquamarine",
                              borderRadius: "1rem",
                              padding: "0.5rem 1rem",
                              margin: "0.5rem 1rem 1rem 1rem",
                            }}
                          >
                            {" "}
                            {data.reply_details}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="m-2">
                            <FaUserCircle /> {data.created_name}
                          </div>{" "}
                          <div
                            key={i}
                            style={{
                              width: "fit-content",
                              borderStyle: "solid",
                              borderWidth: "thin",
                              borderColor: "aquamarine",
                              borderRadius: "1rem",
                              padding: "0.5rem 1rem",
                              margin: "0.5rem 1rem 1rem 1rem",
                            }}
                          >
                            {" "}
                            {data.reply_details}
                          </div>
                        </div>
                      );
                    })}
                  <Row className="p-2">
                    <Col md={12}>
                      <div>
                        <label className="form-label">
                          Message your Mentor <span>*</span>
                        </label>
                        <textarea
                          className="text-form form-control"
                          placeholder="Enter Message for your Mentor"
                          id="description"
                          name="description"
                          rows={4}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.description}
                        />
                        {formik.touched.description &&
                        formik.errors.description ? (
                          <small className="error-cls text-danger">
                            {formik.errors.description}
                          </small>
                        ) : null}
                      </div>
                    </Col>
                  </Row>
                </Card>
                <div className="mb-3">
                  <Row>
                    <div className="col-lg-12">
                      <div className="view-btn d-flex justify-content-between">
                        {/* <button
                          type="button"
                          onClick={() => navigate("/student-Mentorship")}
                          className="btn btn-secondary me-2"
                        >
                          Discard
                        </button> */}
                        <button type="submit" className="btn btn-warning">
                          Send
                        </button>
                      </div>
                    </div>
                  </Row>
                </div>
              </form>

              {/* </Col> */}
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StudentMentorship;
