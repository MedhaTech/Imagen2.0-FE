/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React from "react";
// import Layout from '../Layout';
import { Row, Col, FormGroup, Label, Form, Input } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "../../stories/Button";
import { getCurrentUser, openNotificationWithIcon } from "../../helpers/Utils";
import { useTranslation } from "react-i18next";
// import { useHistory } from 'react-router-dom';
import axios from "axios";
import { encryptGlobal } from "../../constants/encryptDecrypt";
import { useNavigate } from "react-router-dom";
import { stateList } from "../../RegPage/ORGData";
import Select from "../Reports/Helpers/Select";

const EditLatestNews = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const allData = ["All States", ...stateList];
  const newsID = JSON.parse(localStorage.getItem("newsID"));
  const currentUser = getCurrentUser("current_user");
  // const history = useHistory();
  const inputDICE = {
    type: "text",
    className: "defaultInput",
  };

  const fileHandler = (e) => {
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
//   console.log(newsID, "newsID");
  const formik = useFormik({
    initialValues: {
      role: newsID && newsID.category,
      details: newsID && newsID.details,
      file_name: newsID && newsID.file_name,
      url: newsID && newsID.url,
      state: newsID?.state,
      new_status: newsID && newsID.new_status,
    },

    validationSchema: Yup.object({
      role: Yup.string()
        .optional()
        .oneOf(["Institution", "Student"])
        .required("Role is Required"),
    //   state: Yup.string().required("Please Select State"),

      details: Yup.string().optional().required("details is Required"),
      new_status: Yup.string()
        .optional()
        .oneOf(["0", "1"])
        .required("New Status type is Required"),
      // file_name: Yup.mixed(),
      // url: Yup.string()
    }),
    onSubmit: async (values) => {
      try {
        if (
          values.file_name !== null &&
          values.file_name !== "" &&
          typeof values.file_name !== "string"
        ) {
          const fileData = new FormData();
          fileData.append("file", values.file_name);

          const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/latest_news/latestnewsFileUpload`,
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
          status: "ACTIVE",
          category: values.role,
          details: values.details,
        //   state: values.state,

          new_status: values.new_status,
        };
        if (values.file_name !== "" && values.file_name !== null) {
          body["file_name"] = values.file_name;
        }
        // if (values.url !== "" && values.url !== null) {
        //   body["url"] = values.url;
        // }
        if (values.url) {
          body["url"] = values.url;
        } else {
          body["url"] = "";
        }
        const newsId = encryptGlobal(JSON.stringify(newsID.latest_news_id));
        const response = await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/latest_news/${newsId}`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currentUser?.data[0]?.token}`,
            },
          }
        );

        if (response.status === 200) {
          navigate("/latest-news");
          openNotificationWithIcon(
            "success",
            "Latest News Updated Successfully"
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
  const handleStateChange = (event) => {
    const state = event.target.value;
    formik.setFieldValue("state", state);
  };
  return (
    <div className="page-wrapper">
       {/* <h4 className="m-2" 
        style={{ position: 'sticky', top: '70px', zIndex: 1000, padding: '10px',backgroundColor: 'white', display: 'inline-block' , color: '#fe9f43',fontSize:"16px" }}
        >Latest News
        </h4> */}
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Edit Latest News</h4>
              <h6>You can modify details in this Latest News</h6>
            </div>
          </div>
        </div>
        <div className="EditPersonalDetails new-member-page">
          <Row>
            <Col className="col-xl-10 offset-xl-1 offset-md-0">
              <div>
                <Form onSubmit={formik.handleSubmit} isSubmitting>
                  <div className="create-ticket register-block">
                    {/* <FormGroup className="form-group" md={12}> */}
                    <Row className="mb-3 modal-body-table search-modal-header">
                      <Col md={6}>
                        <Label className="mb-2" htmlFor="role">
                          Role
                          <span required>*</span>
                        </Label>
                        <select
                          name="role"
                          id="role"
                          className="form-control custom-dropdown"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.role}
                        >
                          <option value="">Select Role</option>
                          <option value="Institution">Institution</option>
                          <option value="Student">Student</option>
                        </select>
                        {formik.touched.role && formik.errors.role && (
                          <small className="error-cls" style={{ color: "red" }}>
                            {formik.errors.role}
                          </small>
                        )}
                      </Col>
                      <Col md={6}>
                        <Label className="mb-2" htmlFor="new_status">
                          New Icon Status
                          <span required>*</span>
                        </Label>
                        <select
                          name="new_status"
                          id="new_status"
                          className="form-control custom-dropdown"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.new_status}
                        >
                          <option value="">Select New Status</option>
                          <option value="0">Disable</option>
                          <option value="1">Enable</option>
                        </select>
                        {formik.touched.new_status &&
                          formik.errors.new_status && (
                            <small
                              className="error-cls"
                              style={{ color: "red" }}
                            >
                              {formik.errors.new_status}
                            </small>
                          )}
                      </Col>
                      {/* <Col md={4}>
                        <Label className="form-label" htmlFor="state">
                          State
                          <span required>*</span>
                        </Label>
                        <Select
                          list={allData}
                          setValue={(value) =>
                            formik.setFieldValue("state", value)
                          } // Update Formik state
                          placeHolder={"Select State"}
                          value={formik.values.state} // Bind the Formik state value
                        />
                        {formik.errors.state ? (
                          <small className="error-cls" style={{ color: "red" }}>
                            {formik.errors.state}
                          </small>
                        ) : null}
                      </Col> */}
                    </Row>
                    <Row className="mb-3 modal-body-table search-modal-header">
                      <Label className="mb-2" htmlFor="details">
                        Details
                        <span required>*</span>
                      </Label>
                      <Input
                        type="text"
                        {...inputDICE}
                        id="details"
                        name="details"
                        placeholder="Please enter the details"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.details}
                      />
                      {formik.touched.details && formik.errors.details && (
                        <small className="error-cls" style={{ color: "red" }}>
                          {formik.errors.details}
                        </small>
                      )}
                    </Row>
                    <Row className="mb-3 modal-body-table search-modal-header">
                      <Col md={4}>
                        <Label className="mb-2" htmlFor="file_name">
                          File
                        </Label>
                        <div className="d-flex align-items-center">
                          <input
                            type="file"
                            id="file_name"
                            name="file_name"
                            style={{
                              display: "none",
                            }}
                            accept="image/jpeg,image/png,application/msword,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={(e) => fileHandler(e)}
                            onBlur={formik.handleBlur}
                          />
                          <Button
                            label="Upload File"
                            btnClass="primary me-2"
                            size="small"
                            onClick={() => {
                              document.getElementById("file_name").click();
                            }}
                          />

                          {formik.values.file_name ? (
                            <button
                              className="btn btn-info m-2"
                              type="button"
                              // disabled={!formik.values.attachments}
                              onClick={() => {
                                if (formik.values.file_name instanceof File) {
                                  const fileURL = URL.createObjectURL(
                                    formik.values.file_name
                                  );
                                  window.open(fileURL, "_blank");
                                } else {
                                  window.open(
                                    formik.values.file_name,
                                    "_blank"
                                  );
                                }
                              }}
                            >
                              {formik.values.file_name instanceof File
                                ? formik.values.file_name.name
                                : formik.values.file_name.substring(
                                    formik.values.file_name.lastIndexOf("/") + 1
                                  )}
                            </button>
                          ) : null}
                          {formik.values.file_name &&
                          formik.values.file_name.name ? (
                            <span className="ml-2">
                              {/* {formik.values.file_name.name} */}
                            </span>
                          ) : (
                            <span className="ml-2">
                              {formik.initialValues.file_name &&
                                formik.initialValues.file_name.name}
                            </span>
                          )}
                        </div>
                        {formik.touched.file_name &&
                          formik.errors.file_name && (
                            <small
                              className="error-cls"
                              style={{ color: "red" }}
                            >
                              {formik.errors.file_name}
                            </small>
                          )}
                      </Col>
                      <Col md={8}>
                        <Label className="mb-2" htmlFor="url">
                          Link
                        </Label>
                        <Input
                          type="text"
                          name="url"
                          id="url"
                          placeholder="Please enter the link"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.url}
                        />
                        {formik.touched.url && formik.errors.url && (
                          <small className="error-cls" style={{ color: "red" }}>
                            {formik.errors.url}
                          </small>
                        )}
                      </Col>
                    </Row>
                    {/* </FormGroup> */}
                  </div>

                  {/* <hr className="mt-4 mb-4" /> */}
                  <Row>
                    <div style={buttonContainerStyle}>
                      <button
                        className={`btn btn-warning ${
                          !formik.dirty || !formik.isValid
                            ? "default"
                            : "primary"
                        }`}
                        disabled={!formik.dirty || !formik.isValid}
                        type="submit"
                        style={buttonStyle}
                      >
                        Submit Details
                      </button>
                      <button
                        type="cancel"
                        onClick={() => navigate("/latest-news")}
                        className="btn btn-secondary"
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

export default EditLatestNews;
