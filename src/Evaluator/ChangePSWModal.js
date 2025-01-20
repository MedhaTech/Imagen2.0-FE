/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Label } from 'reactstrap';
import axios from 'axios';
// import { InputBox } from '../stories/InputBox/InputBox';
import CryptoJS from 'crypto-js';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getCurrentUser, openNotificationWithIcon } from '../helpers/Utils';
import { useTranslation } from 'react-i18next';
import male from "../assets/img/imazenlogo1.jpg";

import 'sweetalert2/src/sweetalert2.scss';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
// import Layout from './Layout';
import { useNavigate,Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
const ChangePSWModal = () => {
    // here we can change the password //
    const currentUser = getCurrentUser('current_user');
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [error, SetError] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [responce, SetResponce] = useState('');
    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        },

        validationSchema: Yup.object({
            oldPassword: Yup.string()
                .required(t('login.error_required'))
                .min(8, 'Minimum 8 characters required'),
            newPassword: Yup.string()
                .required(t('login.error_required'))
                .min(8, 'Minimum 8 characters required'),
            confirmPassword: Yup.string()
                .required(t('login.error_required'))
                .min(8, 'Minimum 8 characters required')
        }),

        onSubmit: async (values) => {
            if (values.newPassword.length < 8) {
                SetError(
                  <span style={{ color: "red" }}>
                    New Password must be 8-character minimum
                  </span>
                );
              } else if (values.oldPassword === values.newPassword) {
                SetError(
                  <span style={{ color: "red" }}>
                    Old Password and New Password are same
                  </span>
                );
              } else if (values.newPassword !== values.confirmPassword) {
                SetError(
                  <span style={{ color: "red" }}>
                    New Password and Confirm Password not same
                  </span>
                );
            } else {
                const key = CryptoJS.enc.Hex.parse(
                    '253D3FB468A0E24677C28A624BE0F939'
                );
                const iv = CryptoJS.enc.Hex.parse(
                    '00000000000000000000000000000000'
                );
                const old1 = CryptoJS.AES.encrypt(values.oldPassword, key, {
                    iv: iv,
                    padding: CryptoJS.pad.NoPadding
                }).toString();
                const new1 = CryptoJS.AES.encrypt(values.newPassword, key, {
                    iv: iv,
                    padding: CryptoJS.pad.NoPadding
                }).toString();
                const body = JSON.stringify({
                    user_id: JSON.stringify(currentUser?.data[0]?.user_id),
                    old_password: old1,
                    new_password: new1
                });
                var config = {
                    method: 'put',
                    url:
                        process.env.REACT_APP_API_BASE_URL +
                        '/evaluators/changePassword',
                    headers: {
                        'Content-Type': 'application/json',

                        Authorization: `Bearer ${currentUser?.data[0]?.token}`
                    },
                    data: body
                };
                console.warn('config', config);
                axios(config)
                    .then(function (response) {
                        if (response.status === 202) {
                            SetResponce(response.data.message);
                            openNotificationWithIcon(
                                'success',
                                response?.data?.message
                            );
                            setTimeout(() => {
                                navigate('/evaluator/submitted-ideas');
                            }, 1000);
                        }
                    })
                    .catch(function (error) {
                        openNotificationWithIcon(
                            'error',
                            error?.response?.data?.message
                        );
                        console.log(error);
                    });
            }
        }
    });
    useEffect(() => {
        SetError('');
    }, [formik.values]);
    //----password fields initial state and hide show password
    const [oldPassType, setOldPassType] = useState('password');
    const [newPassType, setNewPassType] = useState('password');
    const [confirmPassType, setConfirmPassType] = useState('password');

    const [isOldPasswordVisible, setOldPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setNewPasswordVisible] = useState(false);
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const oldPassword = {
        type: oldPassType,
        placeholder: t('changepswd.Enter_current_password_here'),
        className: 'defaultInput'
    };

    const newPassword = {
        type: newPassType,
        placeholder: t('changepswd.Create_new_password_here'),
        className: 'defaultInput'
    };

    const confirmPassword = {
        type: confirmPassType,
        placeholder: t('changepswd.Verify_New_password'),
        className: 'defaultInput'
    };
    const handleOnCancel = () => {
        // here we can cancel the changes //
        history.push('/evaluator/submitted-ideas');
    };
    const handleShowPassword = (name) => {
        // here we can see the password //
        // here name = password //
        switch (name) {
            case oldPassword:
                name?.type === "password"
                  ? (setOldPassType("text"), setOldPasswordVisible(true))
                  : (setOldPassType("password"), setOldPasswordVisible(false));
                break;
              case newPassword:
                name?.type === "password"
                  ? (setNewPassType("text"), setNewPasswordVisible(true))
                  : (setNewPassType("password"), setNewPasswordVisible(false));
                break;
              case confirmPassword:
                name?.type === "password"
                  ? (setConfirmPassType("text"), setPasswordVisible(true))
                  : (setConfirmPassType("password"), setPasswordVisible(false));
                break;
        }
    };
    const formLoginStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    };
    const buttonStyle = {
      marginRight: '10px'
    };
  
    const cancelLinkStyle = {
      marginLeft: 'auto'
    };
    return (
      <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Change Password</h4>
            <p>
              A strong password helps prevent unauthorized access to your
              account.
            </p>
            {/* <h6>User Profile</h6> */}
          </div>
          <div>
            {/* <button onClick={() => handleEdit() }className={"btn btn-primary"}>
                      <img src={edit} alt="Edit" />
                    </button> */}
            {/* <h4>Update Personal Details.</h4> */}
          </div>
        </div>
        {/* /product list */}
        <form onSubmit={formik.handleSubmit}>
        <div className="card">
          <div className="card-body">
            <div className="profile-set">
              <div className="profile-head"></div>
              <div className="profile-top">
                <div className="profile-content">
                  <div className="profile-contentimg">
                    <img src={male} alt="Male" id="blah" />

                    <div className="profileupload"></div>
                  </div>

                  <div className="profile-contentname"></div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks" style={{ position: "relative" }}>
                  <label className="form-label">Current Password</label>
                  <input
                    className="pass-input"
                    {...oldPassword}
                    id="oldPassword"
                    name="oldPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.oldPassword}
                    style={{ paddingRight: '30px' }}
                  />
                  <div
                      className={`fas toggle-password ${
                        isOldPasswordVisible ? "fa-eye" : "fa-eye-slash"
                      }`}
                      onClick={() => {
                        handleShowPassword(oldPassword);
                      }}
                      style={{
                        position: 'absolute',
                        right: '10px',  
                        top: '70%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                      }}
                    ></div>
                </div>
                {formik.touched.oldPassword && formik.errors.oldPassword ? (
                  <small className="error-cls mb-2" style={{ color: "red" }}>
                    {formik.errors.oldPassword}
                  </small>
                ) : null}
              </div>
              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks" style={{ position: "relative" }}>
                  <label className="form-label">New Password</label>
                  <input
                    className="pass-inputs"
                    {...newPassword}
                    id="newPassword"
                    name="newPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.newPassword}
                  />

                  <div
                    className={`fas toggle-password ${
                      isNewPasswordVisible ? "fa-eye" : "fa-eye-slash"
                    }`}
                    onClick={() => {
                      handleShowPassword(newPassword);
                    }}
                    style={{
                      position: 'absolute',
                      right: '10px',  
                      top: '70%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                    }}
                  ></div>
                </div>
                <small>
                  8-character minimum; case sensitive
                </small>
                <br />
                {formik.touched.newPassword && formik.errors.newPassword ? (
                  <small className="error-cls mb-2" style={{ color: "red" }}>
                    {formik.errors.newPassword}
                  </small>
                ) : null}
              </div>
              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks" style={{ position: "relative" }}>
                  <label className="form-label">Confirm New Password</label>
                  <input
                    className="pass-inputa"
                    {...confirmPassword}
                    id="confirmPassword"
                    name="confirmPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                  />

                  <div
                    className={`fas toggle-password ${
                      isPasswordVisible ? "fa-eye" : "fa-eye-slash"
                    }`}
                    onClick={() => {
                      handleShowPassword(confirmPassword);
                    }}
                    style={{
                      position: 'absolute',
                      right: '10px',  
                      top: '70%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                    }}
                  ></div>
                </div>
                {formik.touched.confirmPassword &&
                formik.errors.confirmPassword ? (
                  <small className="error-cls mb-2" style={{ color: "red" }}>
                    {formik.errors.confirmPassword}
                  </small>
                ) : null}
              </div>
               <div className="form-login mt-3" style={formLoginStyle}>
                                <button
                                  style={buttonStyle}
                                  
                                  type="submit"
                                  className={`btn btn-warning  ${
                                    !(formik.dirty && formik.isValid) ? "default" : "primary"
                                  }`}
                                  disabled={!(formik.dirty && formik.isValid)}
                                >
                                  Change Password <FontAwesomeIcon icon={faKey} />

                                </button>
                                <Link className="btn btn-cancel" to={"/evaluator/submitted-ideas"}  style={cancelLinkStyle}>
                                  Cancel
                                </Link>
                              </div>
            </div>

            {/* </div> */}
          </div>
        </div>
        </form>
      </div>
    </div>
      
    );
};

export default ChangePSWModal;
