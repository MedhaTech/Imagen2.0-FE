/* eslint-disable no-unused-vars */
/* eslint-disable indent */
// import React, {useState} from 'react';
import { Modal, Form, FormGroup } from 'react-bootstrap';
// import { InputBox } from '../stories/InputBox/InputBox';
import { Label } from 'reactstrap';
import { Button } from '../stories/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { getNormalHeaders, openNotificationWithIcon,getCurrentUser } from '../helpers/Utils';
import { KEY } from '../constants/defaultValues';
import CryptoJS from 'crypto-js';
import { useDispatch } from 'react-redux';
import { getAdminEvalutorsList } from '../redux/actions';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
const Register = (props) => {
    // here we can add admin / eadmin //
    const [isProcessing, setIsProcessing] = useState(false);
    const handleClose = () => {};
    const dispatch = useDispatch();
    const currentUser = getCurrentUser("current_user");
const navigate=useNavigate();
    const phoneRegExp = /^[0-9]+$/;
    const inputEmail = {
        type: 'email',
        placeholder: 'Enter Email Address',
         className:"form-control"
    };
    const inputPhone = {
        type: 'text',
        placeholder: 'Enter Mobile Number',
        className:"form-control"
    };

    const inputName = {
        type: 'text',
        placeholder: 'Enter Full Name',
          className:"form-control "
    };
    // const inputCity = {
    //     type: 'text',
    //     placeholder: 'District Name',
    //     className: 'defaultInput'
    // };

    const validationForEvaluator = Yup.object({
        full_name: Yup.string()
            .trim()
            .min(2, 'Enter Full Name')
            .matches(/^[a-zA-Z\s._-]+$/, 'Not allowed')
            .required('Please Enter Full Name'),
        mobile: Yup.string()
            .required('Please Enter Mobile Number')
            .trim()
            .matches(phoneRegExp, 'Contact number is not valid')
            .min(10, 'Number is less than 10 digits')
            .max(10, 'Please enter valid number'),
        username: Yup.string()
            .trim()
            .email('Invalid Email Id')
            .required('Please Enter Email Address'),
        // district: Yup.string().trim().required('Required')
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            mobile: '',
            full_name: '',
            password: '',
            role: 'EVALUATOR'
            // district: ''
        },

        validationSchema: validationForEvaluator,

        onSubmit: async (values) => {
            setIsProcessing(true);
            const axiosConfig = getNormalHeaders(KEY.User_API_Key);

            values.password = values.mobile.trim();

            const key = CryptoJS.enc.Hex.parse(
                '253D3FB468A0E24677C28A624BE0F939'
            );
            const iv = CryptoJS.enc.Hex.parse(
                '00000000000000000000000000000000'
            );
            const encrypted = CryptoJS.AES.encrypt(values.password, key, {
                iv: iv,
                padding: CryptoJS.pad.NoPadding
            }).toString();
            values.password = encrypted;
            const body = JSON.stringify({
                full_name: values.full_name.trim(),
                mobile: values.mobile.trim(),

                username: values.username.trim(),
                role: values.role.trim(),
                password: encrypted
            });
            var config = {
                method: 'post',
                url:
                    process.env.REACT_APP_API_BASE_URL + '/evaluators/register',
                headers: {
                    'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser?.data[0]?.token}`,

                },

                data: body
            };
            // console.log(body);
            // const actualUrl = URL.evaluatorRegister;
            await axios(config)
                // .post(actualUrl, JSON.stringify(values, null, 2), axiosConfig)
                .then((evaluatorRegRes) => {
                    if (evaluatorRegRes?.data?.status == 201) {
                        const evaluatorId = evaluatorRegRes?.data?.data[0].evaluator_id;
                        // console.log(evaluatorId,"11");

                        localStorage.setItem('eavlId', JSON.stringify(evaluatorId));
                        dispatch(getAdminEvalutorsList());
                        setTimeout(()=>{
                            openNotificationWithIcon(
                                'success',
                                "Evaluator Added Successfully"
                            );
                        navigate("/evaluator/selecting-states",{district:{evaluatorId}});

                            props.setShow(false);
                        },[3000]);

                    }
                })
                .catch((err) => {
                     if(err?.response?.data?.status === 400){
                                openNotificationWithIcon("error", err.response.data?.message !== "Bad Request" ?  err.response.data?.message :"Email id is Invalid");
                                }else{
                                  openNotificationWithIcon("error", "Email id is Invalid");
                                }
                    // openNotificationWithIcon(
                    //     'error',
                    //     err.response.data?.message
                    // );
                    // formik.setErrors({
                    //     check: err.response && err?.response?.data?.message
                    // });
                    props.setShow(false);
                    return err.response;
                });
        }
    });

    return (
        <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="assign-evaluator ChangePSWModal teacher-register-modal py-3 px-3"
        backdrop="static"
        scrollable={true}
    >
        <Modal.Header closeButton onHide={handleClose}>
            <Modal.Title
                id="contained-modal-title-vcenter"
                className="w-100 d-block text-center text-primary"
            >
                {'Add New Evaluator'}
            </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <div>
                <Form
                    className="form-row row  mt-0 px-5"
                    onSubmit={formik.handleSubmit}
                    isSubmitting
                >
                    <div
                        className={`row justify-content-center pe-md-0 add-admin`}
                    >
                        <div className={`col-md-6 p-2 w-100`}>
                            <FormGroup
                                className={`form-group mt-md-0 mt-5 `}
                                md={12}
                            >
                                <Label className="mb-2" htmlFor="name">
                                    User Full Name
                                    <span required style={{ marginLeft: '5px' }}>*</span>
                                </Label>

                                <input
                                    {...inputName}
                                    id="full_name"
                                    name="full_name"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.full_name}
                                    maxLength={100}
                                />

                                {formik.touched.full_name &&
                                formik.errors.full_name ? (
                                    <small className="error-cls" style={{color:"red"}}>
                                        {formik.errors.full_name}
                                    </small>
                                ) : null}
                            </FormGroup>
                        </div>
                        <div className="col-md-6 p-2 w-100">
                            <FormGroup
                                className={`form-group  w-100`}
                                md={12}
                            >
                                <Label className="mb-2" htmlFor="username">
                                    Email Address 
                                    <span required style={{ marginLeft: '5px' }}>*</span>
                                </Label>

                                <input
                                    {...inputEmail}
                                    id="username"
                                    name="username"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.username}
                                    maxLength={100}
                                    // isDisabled={stepTwoData.mobile ? true : false}
                                />

                                {formik.touched.username &&
                                formik.errors.username ? (
                                    <small className="error-cls" style={{color:"red"}}>
                                        {formik.errors.username}
                                    </small>
                                ) : null}
                            </FormGroup>
                           
                        </div>
                        <div className="col-md-6 p-2 w-100">
                            <FormGroup
                                className={`form-group  w-100`}
                                md={12}
                            >
                                <Label className="mb-2" htmlFor="mobile">
                                    Mobile Number & Pwd
                                    <span required style={{ marginLeft: '5px' }}>*</span>
                                </Label>

                                <input
                                    {...inputPhone}
                                    id="mobile"
                                    name="mobile"
                                    // onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.mobile}
                                    onChange={(e) => {
                                        const inputValue = e.target.value;
                                        const numericValue = inputValue.replace(
                                          /\D/g,
                                          ""
                                        );
                                        formik.setFieldValue("mobile", numericValue);
                                      }}
                                      maxLength={10}
                                      minLength={10}
                                />

                                {formik.touched.mobile &&
                                formik.errors.mobile ? (
                                    <small className="error-cls" style={{color:"red"}}>
                                        {formik.errors.mobile}
                                    </small>
                                ) : null}
                            </FormGroup>
                           
                        </div>
                    </div>
                    {/* <div className="mb-3 mt-3 text-center">
                        <button 
                        className={
                            !(formik.dirty && formik.isValid)
                                ? 'btn btn-light'
                                : "btn btn-primary"
                        } 
                        disabled={!(formik.dirty && formik.isValid)}
                        type="submit">
                          Add Evaluator
                        </button>
                      </div> */}
                      <div className="mb-3 mt-3 text-center">
        {isProcessing ? (
          <button 
            className="btn btn-primary" 
            type="button" 
            disabled
          >
            Processing...
          </button>
        ) : (
          <button
            className={
              !(formik.dirty && formik.isValid)
                ? 'btn btn-light'
                : "btn btn-primary"
            }
            disabled={!(formik.dirty && formik.isValid)}
            type="submit"
          >
            Add Evaluator
          </button>
        )}
      </div>
                </Form>
            </div>
        </Modal.Body>
    </Modal>
        // <Modal
        //     {...props}
        //     size="lg"
        //     aria-labelledby="contained-modal-title-vcenter"
        //     centered
        //     className="assign-evaluator ChangePSWModal teacher-register-modal  py-3 px-3"
        //     backdrop="static"
        //     scrollable={true}
        // >
        //     <Modal.Header closeButton onHide={handleClose}>
        //         <Modal.Title
        //             id="contained-modal-title-vcenter"
        //             className="w-100 d-block text-center"
        //         >
        //             {'ADD EVALUATOR'}
        //         </Modal.Title>
        //     </Modal.Header>

        //     <Modal.Body>
        //         <div>
        //             <Form
        //                 className="form-row row  mt-0 pb-5"
        //                 onSubmit={formik.handleSubmit}
        //                 isSubmitting
        //             >
        //                 <div className={`row justify-content-center pe-md-0`}>
        //                     <div className={`col-md-6 p-2 w-100 `}>
        //                         <FormGroup
        //                             className={`form-group mt-md-0 mt-5`}
        //                             md={12}
        //                         >
        //                             <Label className="mb-2" htmlFor="name">
        //                                Full Name
        //                             </Label>

        //                             <input
        //                                 {...inputName}
        //                                 id="full_name"
        //                                 name="full_name"
        //                                 onChange={formik.handleChange}
        //                                 onBlur={formik.handleBlur}
        //                                 value={formik.values.full_name}
        //                                 maxLength={100}
        //                             />

        //                             {formik.touched.full_name &&
        //                             formik.errors.full_name ? (
        //                                 <small className="error-cls">
        //                                     {formik.errors.full_name}
        //                                 </small>
        //                             ) : null}
        //                         </FormGroup>
        //                     </div>

        //                     <div className="col-md-6 p-0">
        //                         <FormGroup
        //                             className="form-group mt-md-0 mt-5"
        //                             md={12}
        //                         >
        //                             <Label className="mb-2" htmlFor="mobile">
        //                                 Contact Number
        //                             </Label>
        //                             {/* <InputWithMobileNoComp {...inputPhone} id='mobile' name='mobile' /> */}
        //                             <input
        //                                 {...inputPhone}
        //                                 id="mobile"
        //                                 name="mobile"
        //                                 onChange={formik.handleChange}
        //                                 onBlur={formik.handleBlur}
        //                                 value={formik.values.mobile}
        //                                 maxLength={10}
        //                             />

        //                             {formik.touched.mobile &&
        //                             formik.errors.mobile ? (
        //                                 <small className="error-cls">
        //                                     {formik.errors.mobile}
        //                                 </small>
        //                             ) : null}
        //                         </FormGroup>
        //                     </div>
        //                 </div>

        //                 <div className="mt-5">
        //                     <Button
        //                         label={'Add Evaluator'}
        //                         btnClass={
        //                             !(formik.dirty && formik.isValid)
        //                                 ? 'default'
        //                                 : 'primary'
        //                         }
        //                         size="large "
        //                         type="submit"
        //                         disabled={!(formik.dirty && formik.isValid)}
        //                     />
        //                 </div>
        //             </Form>
        //         </div>
        //     </Modal.Body>
        // </Modal>
    );
};

export default Register;