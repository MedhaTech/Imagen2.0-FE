/* eslint-disable no-undef */
/* eslint-disable indent */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Row, Col,  Card, } from "reactstrap";
import axios from "axios";
import { BsMicrosoftTeams } from "react-icons/bs";

import * as Yup from "yup";
import { useFormik } from "formik";
// eslint-disable-next-line no-unused-vars
import { getCurrentUser, openNotificationWithIcon } from "../../helpers/Utils";
import { encryptGlobal } from "../../constants/encryptDecrypt";

import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
import moment from "moment";

const MentorAddChat = (props) => {
  const location = useLocation();
  const studentData = location.state || {};
  // console.log(studentData,"data");
  const [predata, setPreData] = useState([]);
  const currentUser = getCurrentUser("current_user");
  const [isloader, setIsloader] = useState(false);
const[stuList,setStuList]=useState([]);
  useEffect(() => {
    mentorgetApi();
    teamList();
  }, []);
   const teamList = () => {
      const surveyApi = encryptGlobal(
        JSON.stringify({
          challenge_response_id: studentData?.challenge_response_id,
        })
      );
      var config = {
        method: "get",
        url: process.env.REACT_APP_API_BASE_URL + `/students/CIDteamMenbers?Data=${surveyApi}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${currentUser.data[0]?.token}`,
        },
      };
      axios(config)
        .then(function (response) {
          if (response.status === 200) {
            console.log(response,"res");
            setStuList(response.data.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };
  const mentorgetApi = () => {
    const surveyApi = encryptGlobal(JSON.stringify(studentData?.chatbox_id));
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
          setIsloader(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      description: "",
    },

    validationSchema: Yup.object({
      description: Yup.string().required("Please Enter Message for your Teammates"),
    }),
    onSubmit: async (values) => {
      const body = JSON.stringify({
        chatbox_id: studentData?.chatbox_id,
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

            navigate("/mentor-chatbox");
            openNotificationWithIcon("success", "Message sent Successfully");
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
         <div className="page-header">
  <div className="d-flex flex-column mt-2">              
<div
  className="d-flex align-items-center flex-wrap gap-2 mt-2"
  style={{ justifyContent: 'space-between' }}
>
  <button
    type="button"
    className="btn btn-outline-warning text-nowrap d-flex align-items-center"
    style={{ whiteSpace: 'nowrap' }}
    disabled
  >
    <BsMicrosoftTeams size="20px" style={{ marginRight: '5px' }} />
    CID: {studentData?.challenge_response_id}
  </button>
   {/* <button
    type="button"
    className="btn btn-outline-warning text-nowrap d-flex align-items-center"
    style={{ whiteSpace: 'nowrap' }}
    disabled
  >
    <BsMicrosoftTeams size="20px" style={{ marginRight: '5px' }} />
    Team Members: {stuList.map(student => student.full_name).join(', ')}
  </button> */}
 <p className="mb-0">
    Team Members: {stuList?.length > 0 
      ? stuList.map(student => student.full_name).join(', ') 
      : "No members"}
  </p>


   
</div>
  <div className="flex-grow-1 text-center text-md-start mx-2">
    <h6 className="mb-0 mt-2">
      You can message your teammates by submitting details here
    </h6>
  </div>

</div> 
  <div className="text-end text-md-end">
    <button
      type="button"
      className="btn btn-secondary text-nowrap m-2"
      onClick={() => navigate(-1)}
      style={{ whiteSpace: 'nowrap' }}
    >
      Back
    </button>
  </div>




                </div>
        <div className="EditPersonalDetails new-member-page">
          {isloader ?(
          <Row>
            <form onSubmit={formik.handleSubmit}>
              <Card className="aside">
                {predata?.length > 0 &&
                  predata.map((data, i) => {
                    return (
                      <div
                        key={i}
                        style={{
                          borderStyle: "solid",
                          borderWidth: "thin",
                          borderColor: "aquamarine",
                          borderRadius: "1rem",
                          padding: "1.5rem 1rem",
                          margin: "1rem",
                        }}
                      >
                        <Row>
                          <Col md={12}>
                            <div
                              className="saved-text"
                              style={{
                                whiteSpace: "pre-wrap",
                                marginTop: "1rem",
                              }}
                            >
                              {data.reply_details}
                            </div>

                            <hr />
                          </Col>
                          <Col md={3}>
                            <span>
                              <FaUserCircle />{" "}
                              {data.created_by == null
                                ? data.replied_by
                                : data.created_by}
                            </span>{" "}
                          </Col>

                          {/* <Col md={6} className="text-right">
                            <span>
                              <FaRegClock />{" "}
                              {moment(data.created_at).format("LLL")}
                            </span>
                          </Col> */}
                        </Row>
                      </div>
                    );
                  })}
                <Row className="p-2">
                  <Col md={12}>
                    <div>
                      <label className="form-label">
                        Send a note to your teammates <span>*</span>
                      </label>
                      <textarea
                        className="text-form form-control"
                        placeholder="Enter your Message"
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
                      <button
                        type="button"
                        onClick={() => navigate("/mentor-chatbox")}
                        className="btn btn-secondary me-2"
                      >
                        Discard
                      </button>
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
          ):(
              <div className="spinner-border text-info" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MentorAddChat;
