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
// import logo from "../assets/img/new-logo.png";
import logo from "../assets/img/logo.png";
import email from "../assets/img/icons/mail.svg";
const LoginEvaluator = (props) => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();
    const [password, handlePassword] = useState('password');
    //-for evaluator registration modal
    const [registerModalShow, setRegisterModalShow] = useState(false);
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
            email: Yup.string().required('Required').email("Must be a valid email"),
            password: Yup.string().required('Required')
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

    const inputPassword = {
        placeholder: 'Enter password',
        showEyeIcon: true
    };

    const logInBtn = {
        label: 'Login',
        size: 'large'
    };

    // const handleShow = (e, type) => {
    //     if (type === 'password') {
    //         handlePassword('text');
    //     } else {
    //         handlePassword('password');
    //     }
    // };
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
                      // className="logo-image"
                    />
                  </div>
  
                  <div className="login-userheading">
                    {/* <h3>Evaluator Login</h3> */}
                    <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Evaluator Login &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h3>
                    <h4>
                    Access the Evaluator panel using your Email and Password.
                  </h4>
                    {/* <h4>
                      Access the Dreamspos panel using your email and passcode.
                    </h4> */}
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
                        // className="pass-input form-control"
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
                  {/* <div className="form-login authentication-check">
                    <div className="row">
                      <div className="col-12 d-flex align-items-center justify-content-between">
                        <div className="custom-control custom-checkbox">
                          <label className="checkboxs ps-4 mb-0 pb-0 line-height-1">
                            <input type="checkbox" className="form-control" />
                            <span className="checkmarks" />
                            Remember me
                          </label>
                        </div>
                        <div className="text-end">
                          <Link className="forgot-link">Forgot Password?</Link>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="form-login">
                    <button
                      type="submit"
                      className={`btn btn-login ${
                        !(formik.dirty && formik.isValid) ? "default" : "primary"
                      }`}
                    
                      disabled={!(formik.dirty && formik.isValid)}
                    >
                      Sign In
                    </button>
                  </div> */}
                    <div className="form-login" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                
                <button
                  // className="btn btn-login"
                  type="submit"
                  className={`btn btn-login ${
                    !(formik.dirty && formik.isValid) ? "default" : "primary"
                  }`}
                  // btnClass={
                  //   !(formik.dirty && formik.isValid) ? "default" : "primary"
                  // }
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
        // <React.Fragment>
        //     <div className="container-fluid  SignUp Login">
        //         {/* <UsersPage /> */}
        //         <Row className="row-flex height-100">
        //             <div className="col-md-4 aside mobile-header">
        //                 <Carousel>
        //                     <Carousel.Item>
        //                         <div className="mobile_tab-hide">
        //                             <figure>
        //                                 <img
        //                                     src={image_1}
        //                                     alt="image_1"
        //                                     className="img-fluid img-1"
        //                                 />
        //                             </figure>
        //                         </div>
        //                     </Carousel.Item>
        //                     <Carousel.Item>
        //                         <div className="mobile_tab-hide">
        //                             <figure>
        //                                 <img
        //                                     src={image_2}
        //                                     alt="image_2"
        //                                     className="img-fluid img-2"
        //                                 />
        //                             </figure>
        //                         </div>
        //                     </Carousel.Item>
        //                     {/* <Carousel.Item>
        //                 <div className="mobile_tab-hide">
        //                     <figure>
        //                         <img
        //                             src={ellipse_2}
        //                             alt="ellipse_2"
        //                             className="img-fluid img-3"
        //                         />
        //                     </figure>
        //                 </div>
        //                     </Carousel.Item> */}
        //                 </Carousel>
        //             </div>

        //             <Col xs={12} sm={12} md={8} xl={8} className="article">
        //                 <Row className="logo">
        //                     <a href={process.env.REACT_APP_LANDING_PAGE_URL}>
        //                         <Col
        //                             md={12}
        //                             className="d-flex justify-content-center align-items-center"
        //                         >
        //                             <img
        //                                 src={logo}
        //                                 alt="Logo"
        //                                 className="logo-image"
        //                             />
        //                         </Col>
        //                     </a>
        //                 </Row>
        //                 <Row className=" article-header mb-4">
        //                     <h4 className="mb-4 d-flex justify-content-center align-elements-center">
        //                         Evaluator Login
        //                     </h4>
        //                 </Row>

        //                 <Row className="mt-5">
        //                     <Col md={12}>
        //                         <Form onSubmit={formik.handleSubmit}>
        //                             <div className="form-row row mb-5">
        //                                 <Col
        //                                     className="form-group"
        //                                     xs={12}
        //                                     sm={12}
        //                                     md={12}
        //                                     xl={12}
        //                                 >
        //                                     <Label
        //                                         className="mb-2"
        //                                         htmlFor="email"
        //                                     >
        //                                         Mobile Number
        //                                     </Label>
        //                                     <InputBox
        //                                         {...inputUserId}
        //                                         id="email"
        //                                         name="email"
        //                                         onChange={formik.handleChange}
        //                                         onBlur={formik.handleBlur}
        //                                         value={formik.values.email}
        //                                     />

        //                                     {formik.touched.email &&
        //                                     formik.errors.email ? (
        //                                         <small className="error-cls">
        //                                             Required
        //                                         </small>
        //                                     ) : null}
        //                                 </Col>
        //                             </div>
        //                             <div className="w-100 clearfix" />

        //                             <div className="form-row row mb-5">
        //                                 <Col
        //                                     className="form-group"
        //                                     xs={12}
        //                                     sm={12}
        //                                     md={12}
        //                                     xl={12}
        //                                 >
        //                                     <Label
        //                                         className="mb-2"
        //                                         htmlFor="Password"
        //                                     >
        //                                         Password
        //                                     </Label>
        //                                     <InputBox
        //                                         {...inputPassword}
        //                                         id="password"
        //                                         name="password"
        //                                         type="password"
        //                                         onChange={formik.handleChange}
        //                                         onBlur={formik.handleBlur}
        //                                         value={formik.values.password}
        //                                     />

        //                                     {formik.touched.password &&
        //                                     formik.errors.password ? (
        //                                         <small className="error-cls">
        //                                             Required
        //                                         </small>
        //                                     ) : null}
        //                                 </Col>

        //                                 {/* <Col
        //                                     className="form-group"
        //                                     xs={12}
        //                                     sm={12}
        //                                     md={12}
        //                                     xl={12}
        //                                 >
        //                                     <Row className="keepme_login">
        //                                         <Col className="col-sm-4">
        //                                             <FormGroup check>
        //                                                 <Input
        //                                                     type="checkbox"
        //                                                     name="acceptedTerms"
        //                                                     className="my-auto"
        //                                                     onClick={(e) =>
        //                                                         handleShow(
        //                                                             e,
        //                                                             password
        //                                                         )
        //                                                     }
        //                                                 />
        //                                                 <small className="text-bold ">
        //                                                     {' '}
        //                                                     Show Password
        //                                                 </small>
        //                                             </FormGroup>
        //                                         </Col>
        //                                         <Col className="col-sm-8 text-right">
        //                                             <Link
        //                                                 exact="true"
        //                                                 to="/evaluator/forgotpassword"
        //                                                 className="text-link pt-1"
        //                                             >
        //                                                 Forgot your password
        //                                             </Link>
        //                                         </Col>
        //                                     </Row>
        //                                 </Col> */}
        //                             </div>
        //                             <div className="form-row row mb-5">
        //                                 <Col
        //                                     className="form-group"
        //                                     xs={12}
        //                                     sm={12}
        //                                     md={12}
        //                                     xl={12}
        //                                 >
        //                                     <Button
        //                                         {...logInBtn}
        //                                         type="submit"
        //                                         btnClass={
        //                                             !(
        //                                                 formik.dirty &&
        //                                                 formik.isValid
        //                                             )
        //                                                 ? 'default'
        //                                                 : 'primary'
        //                                         }
        //                                         disabled={
        //                                             !(
        //                                                 formik.dirty &&
        //                                                 formik.isValid
        //                                             )
        //                                         }
        //                                         style={{ borderRadius: '0' }}
        //                                     />
        //                                     <div
        //                                         className="text-primary text-center fs-4 pointer pt-1 mt-4"
        //                                         onClick={() =>
        //                                             setRegisterModalShow(true)
        //                                         }
        //                                     >
        //                                         Sign Up
        //                                     </div>
        //                                 </Col>
        //                             </div>
        //                         </Form>
        //                     </Col>
        //                 </Row>
        //             </Col>
        //         </Row>
        //     </div>
        //     {registerModalShow && (
        //         <Register
        //             show={registerModalShow}
        //             setShow={setRegisterModalShow}
        //             onHide={() => setRegisterModalShow(false)}
        //         />
        //     )}
        // </React.Fragment>
    );
};

const mapStateToProps = ({ admin }) => {
    const { loading, error, currentUser } = admin;
    return { loading, error, currentUser };
};

export default connect(mapStateToProps, {
    evaluatorLoginUserAction: evaluatorLoginUser
})(LoginEvaluator);