/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React from "react";
import { Container, Row, Col, Form, Label, Input } from "reactstrap";
import { getCurrentUser, openNotificationWithIcon } from "../../helpers/Utils";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useLocation, useNavigate } from "react-router-dom";

const BulkIdeaAssign = () => {
  const currentUser = getCurrentUser("current_user");
  const navigate = useNavigate();
  const location = useLocation();
  const mentorship_user_id = location.state.user_id || {};

  const formik = useFormik({
    initialValues: {
      cids: "",
    },
    validationSchema: Yup.object({
      cids: Yup.string()
        .required(`cid's is Required`)
        .matches(/^[0-9,]+$/, "Only Digit or Comma"),
    }),
    onSubmit: async () => {
      handleAlert();
    },
  });
  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 0 0 0",
  };

  const handleAlert = () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
      allowOutsideClick: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `You want to Assign these Idea's to Mentor?`,
        showCloseButton: true,
        confirmButtonText: "Confirm",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        reverseButtons: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          if (result.isConfirmed) {
            handleUpdateIdeas();
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire("Cancelled", "", "error");
        }
      });
  };
  const handleUpdateIdeas = () => {
    // this function accept / reject the Idea //
    const body = JSON.stringify({
      mentorship_user_id: mentorship_user_id,
      cids: formik.values.cids.split(","),
    });
    var config = {
      method: "put",
      url: `${
        process.env.REACT_APP_API_BASE_URL +
        "/challenge_response/CIDGroupMentorId"
      }`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
      data: body,
    };
    axios(config)
      .then(function (response) {
        openNotificationWithIcon(
          "success",
          response?.data?.message == "OK"
            ? "Idea's Assign to Mentor Successfully"
            : response?.data?.message
        );
        navigate("/admin-mentorship-list");
      })
      .catch(function (error) {
        openNotificationWithIcon("error", error?.response?.data?.message);
      });
  };
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <Container className="ticket-page">
              <Row className="pt-3">
                <Row className="mb-2 mb-sm-5 mb-md-5 mb-lg-0">
                  <Col className="col-auto mb-3">
                    <h4>Assign Ideas to Mentor</h4>
                  </Col>
                </Row>
                <Form onSubmit={formik.handleSubmit} isSubmitting>
                  <div className="create-ticket register-block">
                    <Row className="modal-body-table search-modal-header">
                      <Label className="mb-2" htmlFor="cids">
                        {`Cid's`}
                        <span required>*</span>
                      </Label>
                      <Input
                        type="text"
                        id="cids"
                        name="cids"
                        placeholder="Please enter cid's with comma separated"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.cids}
                      />
                      {formik.touched.cids && formik.errors.cids && (
                        <small className="error-cls" style={{ color: "red" }}>
                          {formik.errors.cids}
                        </small>
                      )}
                      <div style={buttonContainerStyle}>
                        <button type="submit" className="btn btn-warning">
                          {"Assign Ideas"}
                        </button>
                        <button
                          className="btn btn-warning m-2"
                          type="button"
                          onClick={() => navigate("/admin-mentorship-list")}
                        >
                          Cancel
                        </button>
                      </div>
                    </Row>
                  </div>
                </Form>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkIdeaAssign;
