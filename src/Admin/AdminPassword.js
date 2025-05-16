/* eslint-disable no-undef */
/* eslint-disable indent */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CryptoJS from "crypto-js";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ChevronUp } from "feather-icons-react/build/IconComponents";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { getCurrentUser } from "../helpers/Utils";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../Admin/store/admin/actions";

const AdminPassword = () => {
  const dispatch = useDispatch();

  const data = useSelector((state) => state?.admin?.toggle_header);
  const currentUser = getCurrentUser("current_user");
  const [error, SetError] = useState("");
  const [responce, SetResponce] = useState("");
  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  );

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Please Enter Your Old Password"),
      newPassword: Yup.string().required("Please Enter Your New Password"),
      confirmPassword: Yup.string().required(
        "Please Enter Your Confirm Password"
      ),
    }),

    onSubmit: async (values) => {
      if (values.newPassword.length < 8) {
        SetError("New Password must be 8-character minimum");
      } else if (values.oldPassword === values.newPassword) {
        SetError("Old Password and New Password are same");
      } else if (values.newPassword !== values.confirmPassword) {
        SetError("New Password and Confirm Password not same");
      } else {
        const key = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
        const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
        const old1 = CryptoJS.AES.encrypt(values.oldPassword, key, {
          iv: iv,
          padding: CryptoJS.pad.NoPadding,
        }).toString();
        const new1 = CryptoJS.AES.encrypt(values.newPassword, key, {
          iv: iv,
          padding: CryptoJS.pad.NoPadding,
        }).toString();

        const body = JSON.stringify({
          user_id: JSON.stringify(currentUser?.data[0]?.user_id),
          old_password: old1,
          new_password: new1,
        });

        var config = {
          method: "put",
          url: process.env.REACT_APP_API_BASE_URL + "/admins/changePassword",
          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${currentUser?.data[0]?.token}`,
          },
          data: body,
        };
        axios(config)
          .then(function (response) {
            if (response.status === 202) {
              SetResponce(response.data.message);
              // setTimeout(() => {
              //   props.btnSubmit();
              // }, 1000);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
  });
  useEffect(() => {
    SetError("");
  }, [formik.values]);
  const [oldPassType, setOldPassType] = useState("password");
  const [newPassType, setNewPassType] = useState("password");
  const [confirmPassType, setConfirmPassType] = useState("password");
  const oldPassword = {
    type: oldPassType,
    placeholder: "Please Enter Your Old Password",
    className: "defaultInput",
  };

  const newPassword = {
    type: newPassType,
    placeholder: "Please Enter Your New Password",
    className: "defaultInput",
  };

  const confirmPassword = {
    type: confirmPassType,
    placeholder: "Please Enter Your Confirm Password",
    className: "defaultInput",
  };
  const handleShowPassword = (name) => {
    // here name = password //
    // here we can see the password //
    switch (name) {
      case oldPassword:
        name?.type === "password"
          ? setOldPassType("text")
          : setOldPassType("password");
        break;
      case newPassword:
        name?.type === "password"
          ? setNewPassType("text")
          : setNewPassType("password");
        break;
      case confirmPassword:
        name?.type === "password"
          ? setConfirmPassType("text")
          : setConfirmPassType("password");
        break;
    }
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Change Password</h4>
          </div>
        </div>
        <ul className="table-top-head">
          <li></li>
          <li></li>
          <li>
            <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
              <Link
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                id="collapse-header"
                className={data ? "active" : ""}
                onClick={() => {
                  dispatch(setToogleHeader(!data));
                }}
              >
                <ChevronUp />
              </Link>
            </OverlayTrigger>
          </li>
        </ul>
        <form onSubmit={formik.handleSubmit}>
          <div className="card">
            <div className="card-body">
              <div className="profile-set">
                <div className="profile-head"></div>
                <div className="profile-top">
                  <div className="profile-content"></div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-sm-12">
                  <div className="input-blocks">
                    <label className="form-label">Old Password</label>
                    <input
                      {...oldPassword}
                      id="oldPassword"
                      name="oldPassword"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.oldPassword}
                    />
                    <div
                      className="pointer position-absolute top-50 end-0 me-4 mt-1"
                      onClick={() => {
                        handleShowPassword(oldPassword);
                      }}
                    >
                      {oldPassword?.type === "password" ? (
                        <FaEyeSlash size={18} />
                      ) : (
                        <FaEye size={18} />
                      )}
                    </div>
                    {formik.touched.oldPassword && formik.errors.oldPassword ? (
                      <small className="error-cls">
                        {formik.errors.oldPassword}
                      </small>
                    ) : null}
                  </div>
                </div>
                <div className="col-lg-4 col-sm-12">
                  <div className="input-blocks">
                    <label>New Password</label>
                    <input
                      {...newPassword}
                      id="newPassword"
                      name="newPassword"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.newPassword}
                    />
                    <div
                      className="pointer position-absolute top-50 end-0 me-4 mt-1"
                      style={{ bottom: "4rem" }}
                      onClick={() => {
                        handleShowPassword(newPassword);
                      }}
                    >
                      {newPassword?.type === "password" ? (
                        <FaEyeSlash size={18} />
                      ) : (
                        <FaEye size={18} />
                      )}
                    </div>
                    {formik.touched.newPassword && formik.errors.newPassword ? (
                      <small className="error-cls">
                        {formik.errors.newPassword}
                      </small>
                    ) : null}
                  </div>
                </div>
                <div className="col-lg-4 col-sm-12">
                  <div className="input-blocks">
                    <label className="form-label">Confirm Password</label>
                    <input
                      {...confirmPassword}
                      id="confirmPassword"
                      name="confirmPassword"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.confirmPassword}
                    />
                    <div
                      className="pointer position-absolute top-50 end-0 me-4 mt-1"
                      onClick={() => {
                        handleShowPassword(confirmPassword);
                      }}
                    >
                      {confirmPassword?.type === "password" ? (
                        <FaEyeSlash size={18} />
                      ) : (
                        <FaEye size={18} />
                      )}
                    </div>
                    {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword ? (
                      <small className="error-cls">
                        {formik.errors.confirmPassword}
                      </small>
                    ) : null}
                  </div>
                </div>
                {error}
                {responce}
                <div className="form-login">
                  <button
                    type="submit"
                    className={`btn btn-warning  ${
                      !(formik.dirty && formik.isValid) ? "default" : "primary"
                    }`}
                    disabled={!(formik.dirty && formik.isValid)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPassword;
