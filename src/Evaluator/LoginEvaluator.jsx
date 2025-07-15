/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState } from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { evaluatorLoginUser } from '../redux/actions';
import { openNotificationWithIcon } from "../helpers/Utils";

import CryptoJS from 'crypto-js';
import logo from "../assets/img/newts.png";
import email from "../assets/img/icons/mail.svg";
const LoginEvaluator = (props) => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();
    //-for evaluator registration modal
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState);
      };
    React.useLayoutEffect(() => {
        const moduleName = localStorage.getItem('module');
        if (
            localStorage.getItem('current_user') &&
            localStorage.getItem('module')
        ) {
            moduleName === "MENTOR"
            ? navigate("/teacher-dashboard")
            : moduleName === "ADMIN"
            ? navigate("/admin-dashboard")
            : moduleName === "EVALUATOR"
            ? navigate("/evaluator/submitted-ideas")
            : moduleName === "EADMIN"
            ? navigate("/eadmin/dashboard")
            : navigate("/dashboard");
        }
    }, []);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },

        validationSchema: Yup.object({
            email: Yup.string().required('Please Enter Your Email Address').email("Must be a valid email"),
            password: Yup.string().required('Please Enter Your Password')
        }),
        // EVALUATOR ROLE
        onSubmit: (values) => {
          localStorage.clear();
            if (
                localStorage.getItem('current_user') &&
                localStorage.getItem('module')
            ) {
                openNotificationWithIcon(
                    'error',
                   
                      "Clear your browser cache and try logging in"
                );
                return;
            }
            const key = CryptoJS.enc.Hex.parse(
                '253D3FB468A0E24677C28A624BE0F939'
            );
            const iv = CryptoJS.enc.Hex.parse(
                '00000000000000000000000000000000'
            );
            const encrypted = CryptoJS.AES.encrypt(
                values.password.trim(),
                key,
                {
                    iv: iv,
                    padding: CryptoJS.pad.NoPadding
                }
            ).toString();
            const body = {
                username: values.email,
                password: encrypted,
                role: 'EVALUATOR'
            };
            props.evaluatorLoginUserAction(body,navigate, 'EVALUATOR');
        }
    });

    const inputUserId = {
        type: 'text',
        placeholder: 'Please Enter Evaluator Email Address'
    };

   

   
    return (
        <div className="main-wrapper">
        <div className="account-content">
          <div className="login-wrapper admin-wrap bg-img">
            <div className="login-content">
              <form onSubmit={formik.handleSubmit} action="index">
                <div className="login-userset">
                  <div className="login-logo logo-normal">
                    <img
                      src={logo}
                      alt="Logo"
                    />
                  </div>
  
                  <div className="login-userheading">
                    <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Evaluator Login &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h3>
                    <h4>
                    Access the Evaluator panel using your Email and Password.
                  </h4>
                   
                  </div>
                  <div className="form-login mb-3">
                    <label className="form-label">Email Address</label>
                    <div className="form-addons">
                      <input
                        {...inputUserId}
                        id="email"
                        className="form- control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                      />
                      {formik.touched.email && formik.errors.email ? (
                        <small className="error-cls" style={{ color: "red" }}>{formik.errors.email}</small>
                      ) : null}
  
                      <img src={email} alt="Email" />
                    </div>
                  </div>
                  <div className="form-login mb-3">
                    <label className="form-label">Password</label>
                    <div className="pass-group">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        id="password"
                        placeholder="Please Enter password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                      />
                     
                      <div
                        className={`fas toggle-password ${
                          isPasswordVisible ? "fa-eye" : "fa-eye-slash"
                        }`}
                        onClick={togglePasswordVisibility}
                      ></div>
                    </div>
                    {formik.touched.password && formik.errors.password ? (
                        <small className="error-cls" style={{ color: "red" }}>{formik.errors.password}</small>
                      ) : null}
                  </div>
                 
                
                    <div className="form-login" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                
                <button
                  type="submit"
                  className={`btn btn-login ${
                    !(formik.dirty && formik.isValid) ? "default" : "primary"
                  }`}
                 
                  disabled={!(formik.dirty && formik.isValid)}
                >
                  Sign In
                </button>
              </div>
              <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                    <p>Copyright © {currentYear}  <b>YFSI.</b> All rights reserved</p>
                </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    );
};

const mapStateToProps = ({ admin }) => {
    const { loading, error, currentUser } = admin;
    return { loading, error, currentUser };
};

export default connect(mapStateToProps, {
    evaluatorLoginUserAction: evaluatorLoginUser
})(LoginEvaluator);