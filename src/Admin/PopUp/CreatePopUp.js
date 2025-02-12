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
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { URL, KEY } from '../../constants/defaultValues';
// import { staticData } from './index';
import { stateList, userList, navList } from "../../RegPage/ORGData";
const Createpopup = () => {
  const { t } = useTranslation();
  const currentUser = getCurrentUser("current_user");
  // const [path, setPath] = useState([]);
  // const allData = ["All States", ...stateList];
  const navigate = useNavigate();
  // const inputDICE = {
  //     type: 'text',
  //    className:"form-control"
  // };

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

    formik.setFieldValue("attachments", file);
  };
  const handleTypeChnage = () => {
    formik.setFieldValue("attachments", "");
  };

  const formik = useFormik({
    initialValues: {
      role: "",
      // navigate: "",
      type: "",
      // state: "",
      attachments: "",
    },
    validationSchema: Yup.object({
      role: Yup.string().required("Role is Required"),
      // .optional()
      // .oneOf(['mentor', 'student'], 'Role is Required'),
      navigate: Yup.string().optional(),
      // state: Yup.string().required("Please Select State"),

      // .required(' is Required'),
      type: Yup.string()
        .optional()
        .oneOf(["file", "link"]).required("Submission type is Required"),
      attachments: Yup.string().required("Attachments are required"),
      // attachments: Yup.mixed().when('type', {
      //     is: (val) => val === 'file',
      //     then: Yup.mixed().required('File is Required'),
      //     otherwise: Yup.string().required('Link is Required')
      // })
    }),
    onSubmit: async (values) => {
      try {
        if (values.type === "file") {
          const fileData = new FormData();
          fileData.append("url", values.attachments);

          const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/popup/popupFileUpload`,
            fileData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${currentUser?.data[0]?.token}`,
              },
            }
          );
          // console.log(response,"reee");
          values.attachments =
            response?.data?.data[0].attachments[0].toString();
          // if (response.status === 200) {
          //     openNotificationWithIcon(
          //       'success',
          //       'File Uploaded Successfully'
          //     );
          //   } else {
          //     openNotificationWithIcon('error', 'Opps! Something Wrong');
          //   }
        }

        const body = {
          role: values.role,
          type: values.type,
          // state: values.state,
          url: values.attachments,
          on_off: "0",
        };
        // if (values.navigate !== "") {
        //   body["navigate"] = values.navigate;
        // }
        // console.log(body,"body");
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/popup`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currentUser?.data[0]?.token}`,
            },
          }
        );

        if (response.status === 201) {
          navigate("/popup");
          openNotificationWithIcon("success", "PopUp Created Successfully");
        } 
      } catch (error) {
        //console.log(error.response.status);
        if (error.response.status === 420) {
          openNotificationWithIcon("error", "PopUp for this Role already exists");
        }
      }
    },
    //   onSubmit: (values) => {

    //     const body = JSON.stringify({
    //         role: values.role,
    //         navigate: values.navigate,
    //         type: values.type,
    //         attachments: values.attachments
    //     });

    //     var config = {
    //         method: 'post',
    //         url: process.env.REACT_APP_API_BASE_URL + '/resource',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${currentUser?.data[0]?.token}`
    //         },
    //         data: body
    //     };
    //     axios(config)
    //         .then(function (response) {
    //             if (response.status === 201) {
    //                 props.history.push('/admin/Resources/index');
    //                 openNotificationWithIcon(
    //                     'success',
    //                     'Resource Created Successfully'
    //                 );
    //             } else {
    //                 openNotificationWithIcon(
    //                     'error',
    //                     'Opps! Something Wrong'
    //                 );
    //             }
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // }
  });

  // const handleFileChange = (e) => {
  //   formik.setFieldValue('file', e.target.files[0]);
  // };
  // const handleStateChange = (event) => {
  //   const state = event.target.value;
  //   formik.setFieldValue("state", state);
  // };
  const handleroleChange = (event) => {
    const role = event.target.value;
    formik.setFieldValue("role", role);
    // formik.setFieldValue("navigate", "");
    // setPath(navList[role] || []);
  };
  //   console.log(formik.values.navigate,"nn");
  //   const handlepathChange = (event) => {
  // formik.setFieldValue("navigate", event.target.value);
  //   };
  return (
    <div className="page-wrapper">
       <h4 className="m-2" 
        style={{ position: 'sticky', top: '70px', zIndex: 1000, padding: '10px',backgroundColor: 'white', display: 'inline-block' , color: '#fe9f43',fontSize:"16px" }}
        >PopUp
        </h4>
      <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4>Add PopUp</h4>
                            <h6>You can add new PopUp by submitting details here</h6>
                        </div>
                    </div>
                </div>
        <div className="EditPersonalDetails new-member-page">
          <Row>
            <Col className="col-xl-10 offset-xl-1 offset-md-0">
              <div>
                <Form onSubmit={formik.handleSubmit} isSubmitting>
                  <div className="create-ticket register-block">
                    <FormGroup className="form-group" md={12}>
                      <Row className="mb-3 modal-body-table search-modal-header">
                        <Col md={12}>
                          <Label className="mb-2" htmlFor="role">
                            Role
                            <span required>*</span>
                          </Label>
                          <select
                            name="role"
                            id="role"
                            className="form-select"
                            onChange={(e) => handleroleChange(e)}
                            onBlur={formik.handleBlur}
                          >
                            <option value="">Select Role</option>
                            {userList.map((state) => (
                              <option key={state} value={state}>
                                {state}
                              </option>
                            ))}
                          </select>
                          {formik.touched.role && formik.errors.role && (
                            <small
                              className="error-cls"
                              style={{ color: "red" }}
                            >
                              {formik.errors.role}
                            </small>
                          )}
                        </Col>
                        {/* <Col md={6}>
                          <Label className="form-label" htmlFor="state">
                            State
                            <span required>*</span> 
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
                        </Col> */}
                      </Row>
                      <Row className="mb-3 modal-body-table search-modal-header">
                        <Col md={12}>
                          <Label className="mb-2" htmlFor="type">
                            Type
                            <span required>*</span>
                          </Label>
                          <select
                            name="type"
                            id="type"
                            placeholder="Please Select Submission Type"
                            className="form-select"
                            onChange={(e) => {
                              formik.handleChange(e);
                              handleTypeChnage();
                            }}
                            onBlur={formik.handleBlur}
                            value={formik.values.type}
                            style={{
                              color: formik.values.type ? "black" : "initial",
                              fontWeight: formik.values.type
                                ? "bold"
                                : "normal",
                            }}
                          >
                            <option disabled={true} value="">
                              Select Type
                            </option>
                            <option value="file">File</option>
                            <option value="link">Link</option>
                          </select>
                          {formik.touched.type && formik.errors.type && (
                            <small
                              className="error-cls"
                              style={{ color: "red" }}
                            >
                              {formik.errors.type}
                            </small>
                          )}
                        </Col>
                        {/* <Col md={6}>
                          <Label className="mb-2" htmlFor="navigate">
                            Navigate Menu
                          </Label>
                          <select
                            id="inputState"
                            className="form-select"
                            value={formik.values.navigate}
                            onChange={(e) => {
                              const selectedDistrict = e.target.value;
                              formik.setFieldValue(
                                "navigate",
                                selectedDistrict
                              );
                            }}
                          >
                            <option value="">Select Path</option>
                            {path.map((path) => (
                              <option key={path} value={path}>
                                {path}
                              </option>
                            ))}
                          </select>
                          {formik.touched.navigate &&
                            formik.errors.navigate && (
                              <small
                                className="error-cls"
                                style={{ color: "red" }}
                              >
                                {formik.errors.navigate}
                              </small>
                            )}
                        </Col> */}
                        {formik.values.type === "file" && (
                          <>
                            <Label className="mb-2 mt-4" htmlFor="attachments">
                              File
                            </Label>
                            <div className="d-flex align-items-center">
                              <input
                                type="file"
                                id="attachments"
                                className="form-control"
                                name="attachments"
                                style={{
                                  display: "none",
                                }}
                                accept="image/jpeg,image/png,application/msword,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                onChange={(e) => fileHandler(e)}
                                onBlur={formik.handleBlur}
                              />
                              <Button
                                label="Upload File"
                                btnClass="primary m-2"
                                size="small"
                                onClick={() => {
                                  document
                                    .getElementById("attachments")
                                    .click();
                                }}
                              />
                              {formik.values.attachments &&
                              formik.values.attachments.name ? (
                                <span className="ml-2">
                                  {formik.values.attachments.name}
                                </span>
                              ) : (
                                <span className="ml-2">
                                  {formik.initialValues.attachments &&
                                    formik.initialValues.attachments.name}
                                </span>
                              )}
                            </div>
                            {formik.touched.attachments &&
                              formik.errors.attachments && (
                                <small
                                  className="error-cls"
                                  style={{ color: "red" }}
                                >
                                  {formik.errors.attachments}
                                </small>
                              )}
                          </>
                        )}

                        {formik.values.type === "link" && (
                          <FormGroup
                            className="form-group"
                            // md={6}
                          >
                            <Col md={12}>
                              <Label className="mb-2 mt-4" htmlFor="attachments">
                                Link
                              </Label>
                              <input
                                type="text"
                                name="attachments"
                                id="attachments"
                                className="form-control"
                                placeholder="Please share Embedded link of the Video"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.attachments}
                              />
                              {formik.touched.attachments &&
                                formik.errors.attachments && (
                                  <small
                                    className="error-cls"
                                    style={{ color: "red" }}
                                  >
                                    {formik.errors.attachments}
                                  </small>
                                )}
                            </Col>
                          </FormGroup>
                        )}
                      </Row>
                    </FormGroup>
                  </div>

                  {/* <Row>
                                    <Col className="col-xs-12 col-sm-6">
                                        <div className="col-6">
                                        <button
                                            label="Submit details"
                                            type="submit"
                                           
                                            className={`btn btn-warning ${
                                                !(formik.dirty && formik.isValid) ? "default" : "warning"
                                              }`}
                                            
                                            disabled={!formik.dirty}
                                        >
                                            Submit details
                                        </button>
                                        </div>
                                    </Col>
                                    <Col className="submit-btn col-xs-12 col-sm-6">
                                    <button
                                               
                                                type="cancel"
                                               className='btn btn-secondary'
                                                onClick={() =>
                                                   navigate(
                                                        '/popup'
                                                    )
                                                }
                                            >
                                                Discard
                                        </button>
                                       
                                    </Col>
                                </Row> */}
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
                        Submit Details
                      </button>
                    </Col>

                    <Col className="col-xs-12 col-sm-6 d-flex justify-content-end">
                      <button
                        type="cancel"
                        className="btn btn-secondary"
                        onClick={() => navigate("/popup")}
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

export default Createpopup;
