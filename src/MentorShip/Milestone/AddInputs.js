/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect } from "react";
// import Layout from '../Layout';
import { Row, Col, FormGroup, Label, Form, Input } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "../../stories/Button";
import { getCurrentUser, openNotificationWithIcon } from "../../helpers/Utils";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { encryptGlobal } from "../../constants/encryptDecrypt";
import { BsMicrosoftTeams } from "react-icons/bs";
const AddMilestone = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const currentUser = getCurrentUser("current_user");
  const navigate = useNavigate();
  const MentorShiptData = location.state || {};
  const inputDICE = {
    type: "text",
    className: "defaultInput",
  };
  const fileHandler = (e) => {
    // Handles file selection and reads the selected file //

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

  const formik = useFormik({
    initialValues: {
      note: "",
      file_name: MentorShiptData?.file || "",
      status: "",
    },
    validationSchema: Yup.object({
      status: Yup.string().optional().oneOf(["COMPLETED", "INCOMPLETE"]),
      // .required("Status is Required"),
      note: Yup.string().optional(),
      //   .required("Note is Required"),
      file_name: Yup.mixed(),
    }),
    // onSubmit: async (values) => {
    //   try {
    //     if (values.file_name !== "") {
    //       const fileData = new FormData();
    //       fileData.append("file", values.file_name);

    //       const response = await axios.post(
    //         `${process.env.REACT_APP_API_BASE_URL}/milestone_progress/milestoneFileUpload`,
    //         fileData,
    //         {
    //           headers: {
    //             "Content-Type": "multipart/form-data",
    //             Authorization: `Bearer ${currentUser?.data[0]?.token}`,
    //           },
    //         }
    //       );
    //       values.file_name = response?.data?.data[0].attachments[0].toString();
    //     }
    //     const body = {
    //       status: values.status,
    //       milestone_id: MentorShiptData?.milestone_id,
    //       challenge_response_id: MentorShiptData?.challenge_response_id,
    //     };
    //     if (values.file_name !== "") {
    //       body["file"] = values.file_name;
    //     }
    //     if (values.note !== "") {
    //       body["note"] = values.note;
    //     }
    //     if (!MentorShiptData?.milestone_progress_id) {
    //       const response = await axios.post(
    //         `${process.env.REACT_APP_API_BASE_URL}/milestone_progress`,
    //         body,
    //         {
    //           headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `Bearer ${currentUser?.data[0]?.token}`,
    //           },
    //         }
    //       );

    //       if (response.status === 201) {
    //         navigate("/mentor-milestone");
    //         openNotificationWithIcon(
    //           "success",
    //           "Milestone Created Successfully"
    //         );
    //       } else {
    //         openNotificationWithIcon("error", "Opps! Something Wrong");
    //       }
    //     } else {
    //       const teamparamId = encryptGlobal(
    //         JSON.stringify(MentorShiptData?.milestone_progress_id)
    //       );

    //       const response = await axios.put(
    //         `${process.env.REACT_APP_API_BASE_URL}/milestone_progress/${teamparamId}`,
    //         body,
    //         {
    //           headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `Bearer ${currentUser?.data[0]?.token}`,
    //           },
    //         }
    //       );

    //       if (response.status === 200) {
    //         navigate("/mentor-milestone");
    //         openNotificationWithIcon(
    //           "success",
    //           "Milestone Updated Successfully"
    //         );
    //       } else {
    //         openNotificationWithIcon("error", "Opps! Something Wrong");
    //       }
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },

    onSubmit: async (values) => {
      try {
        let uploadedFileName = values.file_name;

        // File Upload if selected
        if (uploadedFileName && uploadedFileName instanceof File) {
          const fileData = new FormData();
          fileData.append("file", uploadedFileName);

          const uploadRes = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/milestone_progress/milestoneFileUpload`,
            fileData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${currentUser?.data[0]?.token}`,
              },
            }
          );

          uploadedFileName = uploadRes?.data?.data[0]?.attachments?.[0] || "";
        }

        const body = {
          status: values.status,
          milestone_id: MentorShiptData?.milestone_id,
          challenge_response_id: MentorShiptData?.challenge_response_id,
        };

        if (uploadedFileName) body.file = uploadedFileName;
        if (values.note) body.note = values.note;

        if (!MentorShiptData?.milestone_progress_id) {
          const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/milestone_progress`,
            body,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${currentUser?.data[0]?.token}`,
              },
            }
          );

          if (response.status === 201) {
            navigate("/mentor-milestone", {
              state: {
                challenge_response_id: MentorShiptData?.challenge_response_id,
              },
            });

            openNotificationWithIcon(
              "success",
              "Milestone Created Successfully"
            );
          } else {
            openNotificationWithIcon("error", "Oops! Something went wrong");
          }
        } else {
          const teamparamId = encryptGlobal(
            JSON.stringify(MentorShiptData?.milestone_progress_id)
          );

          const response = await axios.put(
            `${process.env.REACT_APP_API_BASE_URL}/milestone_progress/${teamparamId}`,
            body,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${currentUser?.data[0]?.token}`,
              },
            }
          );

          if (response.status === 200) {
            navigate("/mentor-milestone", {
              state: {
                challenge_response_id: MentorShiptData?.challenge_response_id,
              },
            });

            openNotificationWithIcon(
              "success",
              "Milestone Updated Successfully"
            );
          } else {
            openNotificationWithIcon("error", "Oops! Something went wrong");
          }
        }
      } catch (error) {
        console.error("Milestone submission error:", error);
        openNotificationWithIcon(
          "error",
          "Something went wrong while submitting."
        );
      }
    },
  });
  useEffect(() => {
    if (MentorShiptData) {
      formik.setValues({
        file_name: MentorShiptData?.file || "",
        status: MentorShiptData?.status || "",
        note: MentorShiptData?.note || "",
      });
    }
  }, [MentorShiptData]);

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
            <div className="d-flex align-items-center flex-wrap gap-2 mt-2">
              {/* <button
    type="button"
     className="btn btn-outline-warning text-nowrap d-flex align-items-center"
    style={{ whiteSpace: 'nowrap' }}
    disabled
  >
    <BsMicrosoftTeams size="20px" /> CID :{MentorShiptData?.challenge_response_id}
  </button> */}

              <h6 className="mb-0">
                You can add Note and FileUpload by submitting details here
              </h6>
            </div>
          </div>
        </div>
        <div className="EditPersonalDetails new-member-page">
          <Row>
            {/* <Col className="col-xl-10 offset-xl-1 offset-md-0"> */}
            <div>
              <Form onSubmit={formik.handleSubmit} isSubmitting>
                <div className="create-ticket register-block">
                  {/* <FormGroup className="form-group" md={12}> */}
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

                  {MentorShiptData?.noteId === "1" && (
                    <Row className="mb-3 modal-body-table search-modal-header">
                      <Label className="mb-2" htmlFor="note">
                        Note
                        <span required>*</span>
                      </Label>
                      <Input
                        type="note"
                        {...inputDICE}
                        id="note"
                        name="note"
                        placeholder="Please enter note"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.note}
                      />
                      {formik.touched.note && formik.errors.note && (
                        <small className="error-cls" style={{ color: "red" }}>
                          {formik.errors.note}
                        </small>
                      )}
                    </Row>
                  )}
                  {MentorShiptData?.uploadId === "1" && (
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
                            label="Upload File "
                            btnClass="primary"
                            size="small"
                            onClick={() => {
                              document.getElementById("file_name").click();
                            }}
                          />
                          {formik.values.file_name ? (
                            <button
                              className="btn btn-info m-2"
                              type="button"
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
                          {/* {formik.values.file_name &&
                          formik.values.file_name.name ? (
                            <span className="ml-2">
                              {formik.values.file_name.name}
                            </span>
                          ) : (
                            <span className="ml-2">
                              {formik.initialValues.file_name &&
                                formik.initialValues.file_name.name}
                            </span>
                          )} */}
                        </div>
                        {formik.touched.file_name &&
                          formik.errors.file_name && (
                            <small className="error-cls">
                              {formik.errors.file_name}
                            </small>
                          )}
                      </Col>
                    </Row>
                  )}
                </div>

                <Row>
                  <div style={buttonContainerStyle} className="mt-3">
                    <button
                      type="submit"
                      className="btn btn-warning"
                      disabled={!(formik.dirty && formik.isValid)}
                      style={buttonStyle}
                    >
                      Submit Details
                    </button>

                    <button
                      className="btn btn-secondary"
                      type="button"
                      style={{ marginLeft: "auto" }}
                      onClick={() =>
                        navigate("/mentor-milestone", {
                          state: {
                            challenge_response_id:
                              MentorShiptData?.challenge_response_id,
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
            {/* </Col> */}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default AddMilestone;
