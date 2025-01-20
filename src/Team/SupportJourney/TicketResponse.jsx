/* eslint-disable indent */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Row, Col, Form, Label, Card, CardBody, Input } from "reactstrap";
// import { withRouter } from 'react-router-dom';
import { Button } from "../../stories/Button";
import axios from "axios";

import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
// eslint-disable-next-line no-unused-vars
import { getCurrentUser, openNotificationWithIcon } from "../../helpers/Utils";
import { getDiscussionList } from "../../redux/actions";

import {
  createSupportTicketResponse,
  createDiscussionChatResponse,
  getDiscussionChatById,
  SupportTicketStatusChange,
} from "../../Teacher/store/mentors/actions";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
import moment from "moment";
import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaComments, FaFile, FaLink } from "react-icons/fa";
import { UncontrolledAlert } from "reactstrap";

const StateRes = (props) => {
  const { search } = useLocation();
  const currentUser = getCurrentUser("current_user");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = new URLSearchParams(search).get("id");
  const { discussionChat } = useSelector((state) => state?.mentors);
  const language = useSelector((state) => state?.mentors.mentorLanguage);

  useEffect(() => {
    dispatch(getDiscussionList(currentUser?.data[0]));
  }, []);
  useEffect(() => {
    dispatch(getDiscussionChatById(id, language));
  }, []);

  const formik = useFormik({
    initialValues: {
      ansTicket: "",
      // selectStatusTicket: discussionChat?.status,
      file_name: "",
      url: "",
    },

    validationSchema: Yup.object({
      ansTicket: Yup.string().required("Required"),
      // selectStatusTicket: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        if (values.file_name !== "") {
          const fileData = new FormData();
          fileData.append("file", values.file_name);

          const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/discussionForums/discussionForumFileUpload`,
            fileData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${currentUser?.data[0]?.token}`,
              },
            }
          );
          values.file_name = response?.data?.data[0].attachments[0].toString();
        }
        const ansTicket = values.ansTicket;
        const id = discussionChat.discussion_forum_id;

        const body = {
          discussion_forum_id: id,
          reply_details: ansTicket,
        };
        if (values.file_name !== "") {
          body["file"] = values.file_name;
        }
        if (values.url !== "") {
          body["link"] = values.url;
        }

        dispatch(createDiscussionChatResponse(body));
        // dispatch(
        //   SupportTicketStatusChange(id, { status: values.selectStatusTicket })
        // );
        navigate("/discussion-chat");
        // document.getElementById("sendresponseID").click();
        setTimeout(() => {
          dispatch(getDiscussionList(currentUser?.data[0]));
        }, 500);
      } catch (error) {
        console.log(error);
      }
    },
    // onSubmit: (values) => {
    //     const ansTicket = values.ansTicket;
    //     const body = JSON.stringify({
    //         support_ticket_id: id,
    //         reply_details: ansTicket
    //         // selectStatusTicket: values.selectStatusTicket
    //     });

    //     dispatch(createSupportTicketResponse(body));
    //     dispatch(
    //         SupportTicketStatusChange(id, {
    //             status: values.selectStatusTicket
    //         })
    //     );
    //     navigate('/state-support');

    //     setTimeout(() => {
    //         dispatch(getSupportTicketById(id, language));
    //     }, 500);
    // }
  });

  const fileHandlerforFormik = (e) => {
    let file = e.target.files[0];

    if (!file) {
      return;
    }

    let pattern = /^[a-zA-Z0-9_-\s]{0,}$/;
    const fileName = file.name.split(".").slice(0, -1).join(".");
    const isValidFileName = pattern.test(fileName);

    const maxFileSize = 10000000;
    const isOverMaxSize = file.size > maxFileSize;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      openNotificationWithIcon(
        "error",
        t("Accepting only png,jpg,jpeg,pdf,doc,docx Only")
      );
      return;
    }

    if (isOverMaxSize) {
      openNotificationWithIcon("error", t("student.less_10MB"));
      return;
    }

    if (!isValidFileName) {
      openNotificationWithIcon(
        "error",
        "Only alphanumeric and '_' are allowed"
      );
      return;
    }
    formik.setFieldValue("file_name", file);
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="EditPersonalDetails new-member-page">
          <Row>
            {/* <Col className="col-xl-10 offset-xl-1 offset-md-0"> */}
            <form onSubmit={formik.handleSubmit}>
              <Card className="aside">
                <div
                  style={{
                    borderStyle: "solid",
                    borderWidth: "thin",
                    borderColor: "aqua",
                    borderRadius: "1rem",
                    padding: "1.5rem 1rem",
                    margin: "1rem",
                  }}
                >
                  <Row>
                    <Col md={12}>
                      <div
                          className="saved-text"
                          style={{ whiteSpace: "pre-wrap", marginTop: "1rem" }}
                        >
                          {discussionChat?.query_details}
                        </div>
                      {/* <strong>{supportTicket?.query_details}</strong> */}
                      <hr />
                    </Col>
                    <Col md={3}>
                      <span>
                        <FaUserCircle /> {discussionChat?.created_by}
                      </span>{" "}
                    </Col>
                    <Col md={3} className="text-right">
                      {discussionChat?.link && (
                        <a
                          href={discussionChat?.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaLink />
                          {"Link "}
                        </a>
                      )}
                      {discussionChat?.file && (
                        <a
                          href={discussionChat?.file}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaFile />
                          {"File"}
                        </a>
                      )}
                    </Col>
                    <Col md={6} className="text-right">
                      <span>
                        <FaRegClock />{" "}
                        {moment(discussionChat.created_at).format(
                          // 'Do MMM, YYYY HH:mm',
                          "LLL"
                        )}
                      </span>
                    </Col>
                  </Row>
                </div>

                {discussionChat?.discussion_forum_replies?.length > 0 &&
                  discussionChat.discussion_forum_replies.map((data, i) => {
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
                              style={{ whiteSpace: "pre-wrap", marginTop: "1rem" }}
                            >
                              {data.reply_details}
                            </div>
                            {/* <strong style={{ whiteSpace: "pre-line" }}>
                              {data.reply_details}
                            </strong> */}
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
                          <Col md={3} className="text-right">
                            {data?.link && (
                              <a
                                href={data?.link}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <FaLink />
                                {"Link "}
                              </a>
                            )}
                            {data?.file && (
                              <a
                                href={data?.file}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <FaFile />
                                {"File"}
                              </a>
                            )}
                          </Col>
                          <Col md={6} className="text-right">
                            <span>
                              <FaRegClock />{" "}
                              {moment(data.created_at).format(
                                // 'Do MMM, YYYY HH:mm',
                                "LLL"
                              )}
                            </span>
                          </Col>
                        </Row>
                      </div>
                    );
                  })}

                {/* {discussionChat?.status != "INVALID" &&
                discussionChat?.status != "RESOLVED" ? ( */}
                  <Row    style={{
                   
                    padding: "1.2rem",
                  }}>
                    <Col md={12}>
                      <div>
                        <label className="form-label">
                          Description <span>*</span>
                        </label>
                        <textarea
                          className="text-form form-control"
                          style={{ borderColor: '#d1d9e8' }}

                          placeholder="Enter Details"
                          id="ansTicket"
                          name="ansTicket"
                          rows={4}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.ansTicket}
                        />
                        {formik.touched.ansTicket && formik.errors.ansTicket ? (
                          <small className="error-cls text-danger">
                            {formik.errors.ansTicket}
                          </small>
                        ) : null}
                      </div>
                      <div className="mb-3 mt-3">
                        <Label className="mb-2" htmlFor="url">
                          Link
                        </Label>
                        <Input
                          type="text"
                          name="url"
                          id="url"
                          style={{ borderColor: '#d1d9e8' }}

                          placeholder="Please enter the link"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.url}
                        />
                        {formik.touched.url && formik.errors.url && (
                          <small className="error-cls">
                            {formik.errors.url}
                          </small>
                        )}
                      </div>
                      <div className="mb-3">
                        <Label className="mb-2" htmlFor="file_name">
                          File
                        </Label>
                        <div className="d-flex align-items-center">
                          <input
                            type="file"
                            id="file_name2"
                            name="file_name"
                            style={{
                              display: "none",
                            }}
                            accept="image/jpeg,image/png,application/msword,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={(e) => fileHandlerforFormik(e)}
                            onBlur={formik.handleBlur}
                          />
                          <button
                            className="btn btn-primary add-em-payroll"
                            type="button"
                            onClick={() => {
                              document.getElementById("file_name2").click();
                            }}
                            disabled={formik.values.file_name} 
                          >
                            Upload File
                          </button>
                          {formik.values.file_name ? (
                            <span className="ml-2 mx-2 mt-2">
                              {formik.values.file_name.name}
                            </span>
                          ) : (
                            <span className="ml-2 mx-2 mt-2">
                              {formik.initialValues.file_name}
                            </span>
                          )}
                        </div>
                        {formik.touched.file_name &&
                          formik.errors.file_name && (
                            <small className="error-cls">
                              {formik.errors.file_name}
                            </small>
                          )}
                      </div>
                      {/* <div className="mb-3">
                        <Label className="mb-2">Select Status</Label>
                        <Col className="form-group" md={12}>
                          <select
                            name=" selectStatusTicket"
                            id=" selectStatusTicket"
                            className="form-control custom-dropdown"
                            onChange={(e) => {
                              formik.setFieldValue(
                                "selectStatusTicket",
                                e.target.value
                              );
                            }}
                            onBlur={formik.handleBlur}
                            value={formik.values.selectStatusTicket}
                          >
                            <option value="" disabled={true}>
                              {discussionChat?.status
                                ? discussionChat?.status
                                : "Select Status"}
                            </option>
                            <option value="OPEN">OPEN</option>
                            <option value="INPROGRESS">INPROGRESS</option>
                            <option value="RESOLVED">RESOLVED</option>
                            <option value="INVALID">INVALID</option>
                          </select>
                          {formik.touched.selectStatusTicket &&
                            formik.errors.selectStatusTicket && (
                              <small className="error-cls">
                                {formik.errors.selectStatusTicket}
                              </small>
                            )}
                        </Col>
                      </div> */}
                    </Col>
                  </Row>
                {/* // ) : (
                //   <UncontrolledAlert color="danger" className="mb-2">
                //     Chat window closed. 
                //   </UncontrolledAlert>
                // )} */}
              </Card>

              <div className="mb-3">
                <Row>
                  {discussionChat.status != "INVALID" &&
                  discussionChat.status != "RESOLVED" ? (
                    <div className="col-lg-12">
                      <div className="view-btn d-flex justify-content-between">
                        <button
                          type="button"
                          onClick={() => navigate("/discussion-chat")}
                          className="btn btn-secondary me-2"
                        >
                          Discard
                        </button>
                        <button type="submit" className="btn btn-warning">
                          Post Your Answer
                        </button>
                      </div>
                    </div>
                  ) : null}
                </Row>
              </div>
            </form>
            {/* <div>
                            <Form onSubmit={formik.handleSubmit} isSubmitting>
                                <Card className="card mb-4 my-3 comment-card px-0 card-outline-warning">
                                    <CardBody>
                                        <p>
                                            <b>{supportTicket.query_details}</b>
                                        </p>
                                        <hr />
                                        <Row>
                                            <Col md={6}>
                                                <span>
                                                    <FaUserCircle />{' '}
                                                    {supportTicket.created_by}
                                                </span>{' '}
                                            </Col>
                                            <Col md={6} className="text-right">
                                                <span>
                                                    <FaRegClock />{' '}
                                                    {moment(
                                                        supportTicket.created_at
                                                    ).format(
                                                        'LLL'
                                                    )}
                                                </span>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>

                                {supportTicket?.support_ticket_replies?.length >
                                    0 &&
                                    supportTicket.support_ticket_replies.map(
                                        (data, i) => {
                                            return (
                                                <>
                                                    <Card className="card mb-4 my-3 comment-card card-outline-success">
                                                        <CardBody>
                                                            <p>
                                                                {
                                                                    data.reply_details
                                                                }
                                                            </p>
                                                            <hr />
                                                            <Row>
                                                                <Col md={6}>
                                                                    <span>
                                                                        <FaUserCircle />{' '}
                                                                        {
                                                                            data.created_by
                                                                        }
                                                                    </span>{' '}
                                                                </Col>
                                                                <Col
                                                                    md={6}
                                                                    className="text-right"
                                                                >
                                                                    <span>
                                                                        <FaRegClock />{' '}
                                                                        {moment(
                                                                            data.created_at
                                                                        ).format(
                                                                            'LLL'
                                                                        )}
                                                                    </span>
                                                                </Col>
                                                            </Row>
                                                        </CardBody>
                                                    </Card>
                                                </>
                                            );
                                        }
                                    )}

                                {supportTicket.status != 'INVALID' ? (
                                    <Row>
                                        <Card className="aside p-4 py-4">
                                            <Col md={12}>
                                                <Label
                                                    className="name-req mt-5"
                                                    htmlFor="ticket"
                                                >
                                                    Details
                                                    <span
                                                        required
                                                        className="p-1"
                                                    >
                                                        *
                                                    </span>
                                                </Label>
                                                <textArea
                                                    className={'defaultInput'}
                                                    placeholder="Enter reply comments"
                                                    id="ansTicket"
                                                    name="ansTicket"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={
                                                        formik.values.ansTicket
                                                    }
                                                />

                                                {formik.touched.ansTicket &&
                                                formik.errors.ansTicket ? (
                                                    <small className="error-cls">
                                                        {
                                                            formik.errors
                                                                .ansTicket
                                                        }
                                                    </small>
                                                ) : null}
                                            </Col>

                                            <Col
                                                className="form-group my-5  mb-md-0"
                                                md={12}
                                            >
                                                <Label
                                                    className="mb-2"
                                                    htmlFor="select status"
                                                >
                                                    Select Status
                                                </Label>
                                                <Col
                                                    className="form-group"
                                                    md={12}
                                                >
                                                   
                                                    <select
                                                        name=" selectStatusTicket"
                                                        id=" selectStatusTicket"
                                                        className="form-control custom-dropdown"
                                                       
                                                        onChange={(e) => {
                                                            formik.setFieldValue(
                                                                'selectStatusTicket',
                                                                e.target.value
                                                            );
                                                        }}
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={
                                                            formik.values
                                                                .selectStatusTicket
                                                        }
                                                    >
                                                        <option
                                                            value=""
                                                            disabled={true}
                                                        >
                                                            {supportTicket &&
                                                            supportTicket.status
                                                                ? supportTicket.status
                                                                : 'Select Status'}
                                                        </option>
                                                        <option value="OPEN">
                                                            OPEN
                                                        </option>
                                                        <option value="INPROGRESS">
                                                            INPROGRESS
                                                        </option>
                                                        <option value="RESOLVED">
                                                            RESOLVED
                                                        </option>
                                                        <option value="INVALID">
                                                            INVALID
                                                        </option>
                                                    </select>
                                                    {formik.touched
                                                        .selectStatusTicket &&
                                                        formik.errors
                                                            .selectStatusTicket && (
                                                            <small className="error-cls">
                                                                {
                                                                    formik
                                                                        .errors
                                                                        .selectStatusTicket
                                                                }
                                                            </small>
                                                        )}
                                                </Col>

                                                <Col
                                                    className="form-group mt-5  mb-md-0"
                                                    md={12}
                                                ></Col>
                                            </Col>
                                        </Card>
                                    </Row>
                                ) : null}

                                <hr className="mt-4 mb-4"></hr>
                                <Row>
                                    {supportTicket.status != 'INVALID' ? (
                                        <Col className="col-xs-12 col-sm-6">
                                            <Button
                                                label="Discard"
                                                btnClass="secondary"
                                                size="small"
                                                onClick={() =>
                                                    (
                                                        '/state-support'
                                                    )
                                                }
                                            />
                                        </Col>
                                    ) : (
                                        <Col className="col-xs-12 col-sm-6">
                                            <Button
                                                label="Back"
                                                btnClass="secondary"
                                                size="small"
                                                onClick={() =>
                                                    navigate(
                                                        '/state-support'
                                                    )
                                                }
                                            />
                                        </Col>
                                    )}
                                    {supportTicket.status != 'INVALID' ? (
                                        <Col className="submit-btn col-xs-12 col-sm-6">
                                            <Button
                                                label="Submit"
                                                type="submit"
                                                btnClass={
                                                    !(
                                                        formik.dirty &&
                                                        formik.isValid
                                                    )
                                                        ? 'default'
                                                        : 'primary'
                                                }
                                                size="small"
                                                disabled={
                                                    !(
                                                        formik.dirty &&
                                                        formik.isValid
                                                    )
                                                }
                                            />
                                        </Col>
                                    ) : null}
                                </Row>
                            </Form>
                        </div> */}
            {/* </Col> */}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default StateRes;
