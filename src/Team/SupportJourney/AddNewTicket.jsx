/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Row, Col, Label, Card, CardBody, Input } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, PlusCircle } from "react-feather";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { getCurrentUser, openNotificationWithIcon } from "../../helpers/Utils";
import { createDiscussionChats } from "../../Teacher/store/mentors/actions";
import { getDiscussionList } from "../../redux/actions";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const TeacherSupport = () => {
  const { t } = useTranslation();
      const navigate = useNavigate();
  
 
 

 

 

  const currentUser = getCurrentUser("current_user");
  const dispatch = useDispatch();

  const fileHandler = (e) => {
    // Handles file selection and reads the selected file

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
    formik1.setFieldValue("file_name", file);
  };

  const formik1 = useFormik({
    initialValues: {
      ticketDetails: "",
      file_name: "",
      url: "",
    },

    validationSchema: Yup.object({
      ticketDetails: Yup.string().required("Required"),
      file_name: Yup.mixed(),
      url: Yup.string(),
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
        const body = {
          query_details: values.ticketDetails,
          district: currentUser?.data[0]?.district
        };
        if (values.file_name !== "") {
          body["file"] = values.file_name;
        }
        if (values.url !== "") {
          body["link"] = values.url;
        }

        dispatch(createDiscussionChats(body));
        setTimeout(() => {
          dispatch(getDiscussionList(currentUser?.data[0]));
        }, 500);
        navigate(
          '/discussion-chat'
      );
      } catch (error) {
        console.log(error);
      }
    },
  });
 

 

 
  return (
    <>
     

     
          <div className="page-wrapper">
            <div className="content">
              <div className="page-header justify-content-between">
                <div className="page-title">
                  <h4>Ask Your Question</h4>
                </div>
                <div className="page-btn">
                  <button
                    className="btn btn-added"
                    onClick={() =>
                      navigate(
                            '/discussion-chat'
                        )
                    }
                  >
                    Back To List
                  </button>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <form onSubmit={formik1.handleSubmit}>
                    <div className="row">
                     
                      <div className="mb-3">
                        <label className="form-label">
                          Description <span>*</span>
                        </label>
                        <textarea
                         style={{ borderColor: '#d1d9e8' }}
                          className="text-form form-control"
                          placeholder="Enter Details"
                          id="ticketDetails"
                          name="ticketDetails"
                          rows={4}
                          onChange={formik1.handleChange}
                          onBlur={formik1.handleBlur}
                          value={formik1.values.ticketDetails}
                        />
                        {formik1.touched.ticketDetails &&
                        formik1.errors.ticketDetails ? (
                          <small className="error-cls text-danger">
                            {formik1.errors.ticketDetails}
                          </small>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <Label className="mb-2" htmlFor="url">
                          Link
                        </Label>
                        <Input
                          type="text"
                          name="url"
                          id="url"
                          style={{ borderColor: '#d1d9e8' }}
                          placeholder="Please enter the link"
                          onChange={formik1.handleChange}
                          onBlur={formik1.handleBlur}
                          value={formik1.values.url}
                        />
                        {formik1.touched.url && formik1.errors.url && (
                          <small className="error-cls">
                            {formik1.errors.url}
                          </small>
                        )}
                      </div>
                      <div className="mb-3">
                        <Label className="mb-2" htmlFor="file_name">
                          File
                        </Label>
                        <div className="d-flex" style={{ gap: '0', justifyContent: 'flex-start' }}>
                          <input
                            type="file"
                            id="file_name"
                            name="file_name"
                            style={{
                              display: "none"
                            }}
                            accept="image/jpeg,image/png,application/msword,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={(e) => fileHandler(e)}
                            onBlur={formik1.handleBlur}
                          />
                          <button
                            className="btn btn-primary add-em-payroll"
                            type="button"
                            onClick={() => {
                              document.getElementById("file_name").click();
                            }}
                            disabled={formik1.values.file_name} 
                          >
                            Upload File
                          </button>
                          {formik1.values.file_name ? (
                            <span className="ml-2 mx-2 mt-2" >
                              {formik1.values.file_name.name}
                            </span>
                          ) : (
                            <span className="ml-2 mx-2 mt-2" >
                              {formik1.initialValues.file_name}
                            </span>
                          )}
                        </div>
                        {formik1.touched.file_name &&
                          formik1.errors.file_name && (
                            <small className="error-cls">
                              {formik1.errors.file_name}
                            </small>
                          )}
                      </div>
                      <div className="col-lg-12">
                        <div className="view-btn">
                          <button
                            id="discard"
                            type="button"
                            className="btn btn-reset me-2"
                            onClick={() =>
                              navigate(
                                    '/discussion-chat'
                                )
                            }
                          >
                            Discard
                          </button>
                          <button type="submit" className="btn btn-save">
                          Post Your Question
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              {/* /add */}
            </div>
          </div>
      {/* /Add Ticket end */}

    
    </>
  );
};

export default TeacherSupport;
