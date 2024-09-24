/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect,useState } from 'react';
import { Row, Col, Form, Label, FormGroup } from 'reactstrap';
// import { withRouter } from 'react-router-dom';
import './style.scss';
// import Layout from '../../Admin/Layout';
// import { Button } from '../../stories/Button';
import axios from 'axios';
// import { InputBox } from '../../stories/InputBox/InputBox';
import * as Yup from 'yup';
import { useFormik } from 'formik';
// import { BreadcrumbTwo } from '../../stories/BreadcrumbTwo/BreadcrumbTwo';
import { URL, KEY } from '../../constants/defaultValues';
import {
    getNormalHeaders,
    openNotificationWithIcon
} from '../../helpers/Utils';
import Select from './Select';
import {
    // getDistrictData,
    getStateData,
    getFetchDistData
} from '../../redux/studentRegistration/actions';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { categoryValue, stateValue } from './constentText';
import { useNavigate } from "react-router-dom";
import { stateList,districtList } from '../../RegPage/ORGData';
const AddNewSchool = (props) => {
    const filterCategory = ['ATL', 'Non ATL'];
    const navigate = useNavigate();
    const [districts, setDistricts] = useState([]);

    const dispatch = useDispatch();
    const inputDICE = {
        type: 'text',
       className:"form-control"
    };
   
   


    const formik = useFormik({
        initialValues: {
            organization_name: '',
            organization_code: '',
            city: '',
            district: '',
            state: '',
            status: 'ACTIVE',
            category: '',
            unique_code: '',
            pin_code: '',
            address: ''
        },

        validationSchema: Yup.object({
            unique_code: Yup.string()
                .matches(
                    /^[A-Za-z0-9/-]*$/,
                    'Please enter only alphanumeric characters'
                )
                .trim()
                .optional(),
            organization_name: Yup.string()
            .max(40, 'Please Enter Valid Organization Name')
            .matches(/^[a-zA-Z0-9\s]+$/, 'Organization Name can only contain letters, numbers, and spaces')
            .required('Organization Name is Required'),
                organization_code: Yup.string()
                .matches(/^[0-9]*$/, 'Please enter Numeric values')
                .max(11, 'Please enter only 11 digit valid Udise code')
                .min(11, 'Udise code is less than 11 digits')
                .required('UDISE Code is Required'),
            address: Yup.string()
                .optional()
                .matches(/^[a-zA-Z0-9\s\-,/._-]+$/, 'please enter valid address'),
            pin_code: Yup.string()
                .matches(/^[0-9]*$/, 'Please enter Numeric values')
                .optional(),
                // .required('Please Enter PinCode'),
            district: Yup.string()
                // .matches(/^[aA-zZ\s]+$/, 'Invalid district')
                .required('District is Required'),
            category: Yup.string()
                // .matches(/^[aA-zZ\s]+$/, 'Invalid category')
                .required('category is Required'),
            state: Yup.string().required('State is required'),
            // .optional()
            // .matches(/^[aA-zZ\s]+$/, 'Invalid State'),
            // principal_email: Yup.string()
            //     .optional()
            //     .email('Invalid email address format'),
            // principal_name: Yup.string()
            //     .optional()
            //     .matches(/^[aA-zZ\s/^.*$/]+$/, 'Invalid Name')
            //     .trim(),
            city: Yup.string().matches(
                /^[aA-zZ\s/^.*$/]+$/,
                'please enter valid city name'
            )
            .optional()
        }),

        onSubmit: async (values) => {
            const body = JSON.stringify({
          organization_code: values.organization_code.trim(),
          organization_name: values.organization_name.trim(),
          state: values.state.trim(),
          category: values.category.trim(),
          district: values.district.trim(),
            });
            if (
            values.city !== values.city
            ) {
                body['city'] = values.city;
            }else if (values.address !== values.address){
                body['address'] = values.address;
            }else if (values.unique_code !== values.unique_code){
                body['unique_code'] = values.unique_code;
            }else if (values.pin_code !== values.pin_code){
                body['pin_code'] = values.pin_code;
            }
            var config = {
                method: 'post',
                url: process.env.REACT_APP_API_BASE_URL + '/organizations/createOrg',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870'
                },
                data: body
            };
            await axios(config)
                .then(async function (response) {
                    if (response.status == 201) {
                        openNotificationWithIcon(
                                            'success',
                                            'School Create Successfully'
                                        );
                                        navigate('/institution-registration');
                    }
                })
                .catch( (err) =>{
                    openNotificationWithIcon(
                                    'error',
                                    err.response.data.message
                                );
                                return err.response;
                });
            // const axiosConfig = getNormalHeaders(KEY.User_API_Key);
            // await axios
            //     .post(
            //         `${URL.createOrganization}`,
            //         JSON.stringify(values, null, 2),
            //         axiosConfig
            //     )
            //     .then((checkOrgRes) => {
            //         if (checkOrgRes.status == 201) {
            //             openNotificationWithIcon(
            //                 'success',
            //                 'School Create Successfully'
            //             );
            //             navigate('/institutions');
            //         }
            //     })
            //     .catch((err) => {
            //         openNotificationWithIcon(
            //             'error',
            //             err.response.data.message
            //         );
            //         return err.response;
            //     });
        }
    });
  
    const handleStateChange = (event) => {
      const state = event.target.value;
      formik.setFieldValue("state", state);
      formik.setFieldValue("district", ""); 
      setDistricts(districtList[state] || []);
    };
  
    const handleDistrictChange = (event) => {
      formik.setFieldValue("district", event.target.value);
    };
   
    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      };
    
      const buttonStyle = {
        marginRight: '10px',
      };
      const handleInputChange = (e) => {
        const numericValue = e.target.value.replace(/\D/g, "").slice(0, 11);
        formik.setFieldValue('organization_code', numericValue);
      };
    
    return (
        <div className="page-wrapper">
        <div className="content">
            <div className="EditPersonalDetails new-member-page">
                <Row>
                    <Col className="col-xl-10 offset-xl-1 offset-md-0">
                        {/* <BreadcrumbTwo {...headingDetails} /> */}
                        <h3 className="mb-5"> Add New Institution Details</h3>

                        <div>
                            <Form onSubmit={formik.handleSubmit} isSubmitting>
                                <div className="create-ticket register-block">
                                        <Row  className="mb-3 modal-body-table search-modal-header">
                                            <Col md={4}>
                                                <Label
                                                    className="form-label"
                                                    htmlFor="organization_code"
                                                    // style={{ fontSize: 15 }}
                                                >
                                                    UDISE Code
                                                    <span required>*</span>
                                                </Label>
                                                <input
                                                    {...inputDICE}
                                                    id="organization_code"
                                                    name="organization_code"
                                                    placeholder="Please enter UDISE Code"
                                                    onChange={(e) => handleInputChange(e)}
                                                    onBlur={formik.handleBlur}
                                                    value={
                                                        formik.values
                                                            .organization_code
                                                    }
                                                />
                                                {formik.touched
                                                    .organization_code &&
                                                formik.errors
                                                    .organization_code ? (
                                                    <small className="error-cls" style={{color:"red"}}>
                                                        {
                                                            formik.errors
                                                                .organization_code
                                                        }
                                                    </small>
                                                ) : null}
                                            </Col>
                                            <Col md={4}>
                                                <Label
                                                    className="form-label"
                                                    htmlFor="state"
                                                >
                                                    State
                                                    <span required>*</span>

                                                </Label>
                                                <select
                            id="inputState"
                            className="form-select"
                            onChange={(e) => handleStateChange(e)}
                          >
                            <option value="">Select State</option>
                            {stateList.map((state) => (
                              <option key={state} value={state}>
                                {state}
                              </option>
                            ))}
                          </select>

                                                {formik.touched.state &&
                                                formik.errors.state ? (
                                                    <small className="error-cls" style={{color:"red"}}>
                                                        {formik.errors.state}
                                                    </small>
                                                ) : null}
                                            </Col>
                                            <Col md={4}>
                                                <Label
                                                   className="form-label"
                                                    htmlFor="district"
                                                >
                                                    District
                                                    <span required>*</span>
                                                </Label>
                                                {/* <Col md={3}> */}
                                                <select
                            id="inputState"
                            className="form-select"
                            value={formik.values.district}
                            onChange={(e)=>handleDistrictChange(e)}
                          >
                            <option value="">Select District</option>
                            {districts.map((district) => (
                              <option key={district} value={district}>
                                {district}
                              </option>
                            ))}
                          </select>
                                               
                                                {formik.touched.district &&
                                                formik.errors.district ? (
                                                    <small className="error-cls" style={{color:"red"}}>
                                                        {formik.errors.district}
                                                    </small>
                                                ) : null}
                                            </Col>
                                           
                                           
                                        </Row>
                                        <Row className="mb-3 modal-body-table search-modal-header">
                                        <Col md={4}>
                                                <Label
                                                    // className="mb-2"
                                                   className="form-label"
                                                    htmlFor="category"
                                                >
                                                    category
                                                    <span required>*</span>
                                                </Label>
                                                {/* <Col md={3}> */}
                                                    {' '}
                                                    <select
                            id="inputState"
              name="category"
                            className="form-select"
                            onBlur={formik.handleBlur}
                            value={formik.values.category}
                            onChange={
                                formik.handleChange
                            }
                          >
                            <option value="">Select Category</option>
                            {filterCategory.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>

                                                {formik.touched.category &&
                                                formik.errors.category ? (
                                                    <small className="error-cls" style={{color:"red"}}>
                                                        {formik.errors.category}
                                                    </small>
                                                ) : null}
                                            </Col>
                                           
                                            <Col md={4}>
                                                <Label
                                                    className="form-label"
                                                    htmlFor="organization_name"
                                                    // style={{ fontSize: 15 }}
                                                >
                                                    Institute/School Name
                                                    <span required>*</span>
                                                </Label>
                                                <input
                                                    {...inputDICE}
                                                    id="organization_name"
                                                    name="organization_name"
                                                    placeholder="Please enter Institute/School name"
                                                    onChange={(e) => {
                                                        let inputValue = e.target.value;
                                                        inputValue = inputValue.slice(0, 40);
                                                        formik.setFieldValue('organization_name', inputValue);
                                                      }}
                                                    onBlur={formik.handleBlur}
                                                    value={
                                                        formik.values
                                                            .organization_name
                                                    }
                                                />
                                                {formik.touched
                                                    .organization_name &&
                                                formik.errors
                                                    .organization_name ? (
                                                    <small className="error-cls" style={{color:"red"}}>
                                                        {
                                                            formik.errors
                                                                .organization_name
                                                        }
                                                    </small>
                                                ) : null}
                                            </Col>
                                            <Col md={4}>
                                                <Label
                                                   className="form-label"
                                                    htmlFor="address"
                                                >
                                                    Address
                                                    {/* <span required>*</span> */}
                                                </Label>
                                                <input
                                                    {...inputDICE}
                                                    id="address"
                                                    name="address"
                                                    placeholder="Please enter Address"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={
                                                        formik.values.address
                                                    }
                                                />
                                                {formik.touched.address &&
                                                formik.errors.address ? (
                                                    <small className="error-cls" style={{color:"red"}}>
                                                        {formik.errors.address}
                                                    </small>
                                                ) : null}
                                            </Col>
                                        </Row>

                                        <Row className="mb-3 modal-body-table search-modal-header">
                                        <Col md={4}>
                                                <Label
                                                   className="form-label"
                                                    htmlFor="pin_code"
                                                    // style={{ fontSize: 15 }}
                                                >
                                                    PinCode
                                                    {/* <span required>*</span> */}
                                                </Label>
                                                <input
                                                    {...inputDICE}
                                                    id="pin_code"
                                                    name="pin_code"
                                                    placeholder="Please enter PinCode"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={
                                                        formik.values.pin_code
                                                    }
                                                />
                                                {formik.touched.pin_code &&
                                                formik.errors.pin_code ? (
                                                    <small className="error-cls">
                                                        {formik.errors.pin_code}
                                                    </small>
                                                ) : null}
                                            </Col>
                                        <Col md={4}>
                                                <Label
                                                   className="form-label"
                                                    htmlFor="unique_code"
                                                    // style={{ fontSize: 15 }}
                                                >
                                                    ATL Code
                                                    {/* <span required>*</span> */}
                                                </Label>
                                                <input
                                                    {...inputDICE}
                                                    id="unique_code"
                                                    name="unique_code"
                                                    maxLength={11}
                                                    placeholder="Please enter Atl Code"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={
                                                        formik.values
                                                            .unique_code
                                                    }
                                                    // isDisabled={holdKey ? true : false}
                                                />
                                                {formik.touched.unique_code &&
                                                formik.errors.unique_code ? (
                                                    <small className="error-cls" style={{color:"red"}}>
                                                        {
                                                            formik.errors
                                                                .unique_code
                                                        }
                                                    </small>
                                                ) : null}
                                            </Col>
                                           
                                            <Col md={4}>
                                                <Label
                                                   className="form-label"
                                                    htmlFor="city"
                                                >
                                                    City
                                                </Label>
                                                <input
                                                    {...inputDICE}
                                                    id="city"
                                                    name="city"
                                                    placeholder="Please enter city"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.city}
                                                />
                                                {formik.touched.city &&
                                                formik.errors.city ? (
                                                    <small className="error-cls" style={{color:"red"}}>
                                                        {formik.errors.city}
                                                    </small>
                                                ) : null}
                                            </Col>
                                        </Row>
                                </div>

                                <Row>
                        <div style={buttonContainerStyle}>
                          <button type="submit" className="btn btn-warning" style={buttonStyle}>
                            Submit
                          </button>
                        
                          <button
                            onClick={() => navigate("/institution-registration")}
                            type="button"
                            className="btn btn-secondary"
                            style={{ marginLeft: 'auto' }} 
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

export default AddNewSchool;
