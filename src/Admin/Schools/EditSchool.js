/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect ,useState} from 'react';
import { Row, Col, Form, Label, FormGroup } from 'reactstrap';
import './style.scss';



import axios from 'axios';
import { getCurrentUser } from '../../helpers/Utils';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from "react-router-dom";
import { stateList,districtList } from '../../RegPage/ORGData';
import {
    openNotificationWithIcon
} from '../../helpers/Utils';
import { useDispatch } from 'react-redux';

import { encryptGlobal } from '../../constants/encryptDecrypt';
const EditSchool = (props) => {
    const currentUser = getCurrentUser('current_user');
    const navigate = useNavigate();
    const listID = JSON.parse(localStorage.getItem('listId'));
    const listId =
    (history &&
        history.location &&
        history.location.item &&
        history.location.item) ||
    listID;
  
    const dispatch = useDispatch();
    const [districts, setDistricts] = useState([]);


   useEffect(()=>{
    setDistricts(
        districtList[
            
        listId.state
        ] || []
    );
   },[listId.state]);

    const inputDICE = {
        type: 'text',
          className:"form-control"
    };

    const filterCategory = ['ATL', 'Non ATL'];
    const formik = useFormik({
        initialValues: {
            organization_name: listId && listId.organization_name,
            organization_code: listId && listId.organization_code,
            unique_code: listId && listId.unique_code || "",
            pin_code: listId && listId.pin_code || "",
            city: listId && listId.city || "",
            district: listId?.district || "",
            state: listId?.state || '',
            status: listId && listId.status,
            address: listId && listId.address || "",
            category: listId && listId.category
        },

        validationSchema: Yup.object({
            organization_code: Yup.string()
                .matches(
                    /^[A-Za-z0-9/-]*$/,
                    'Please enter only alphanumeric characters'
                )
                .trim()
                .required('UDISE  Code is Required'),
            organization_name: Yup.string()
                .required('Organization  Name is Required')
                .matches(/^[a-zA-Z\s]+$/, 'Only Alpha characters are allowed'),
            unique_code: Yup.string()
                .matches(/^[A-Za-z0-9/-]*$/, 'Please enter only alphanumeric characters')
                .optional(),
            address: Yup.string()
                 .optional()
                .matches(/^[a-zA-Z0-9\s\-,/._-]+$/, 'please enter valid address'),

            pin_code: Yup.string()
                .matches(/^[0-9]*$/, 'Please enter Numeric values')
                .min(6,"please enter valid pin code")
                 .optional(),
            district: Yup.string()
                .required('District is Required'),
            category: Yup.string()
                .matches(/^[aA-zZ\s]+$/, 'Invalid category')
                .required('category is Required'),
            state: Yup.string().required('State is required'),
           
           
            city: Yup.string().matches(
                /^[aA-zZ\s/^.*$/]+$/,
                'please enter valid city'
            )
             .optional()
        }),

        onSubmit: (values) => {
            const body = {
                organization_code: values.organization_code,
                state: values.state,
                category: values.category,
                district: values.district,
                organization_name: values.organization_name,
                status: values.status
            };
            if (
                listId && listId.city !== values.city
                ) {
                    body['city'] = values.city;
                }else if (listId && listId !== values.address){
                    body['address'] = values.address;
                }else if (listId && listId !== values.unique_code){
                    body['unique_code'] = values.unique_code;
                }else if (listId && listId !== values.pin_code){
                    body['pin_code'] = values.pin_code;
                }
            const editId = encryptGlobal(
                JSON.stringify(listId.organization_id)
            );
            var config = {
                method: 'put',
                url:
                    process.env.REACT_APP_API_BASE_URL +
                    '/organizations/' +
                    editId,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${currentUser?.data[0]?.token}`
                },
                data: body
            };
            axios(config)
                .then((checkOrgRes) => {
                    if (checkOrgRes.status == 200) {
                        openNotificationWithIcon(
                            'success',
                            'School Update Successfully'
                        );
                        navigate('/institution-registration');
                    }
                })
                .catch((err) => {
                    return err.response;
                });
        }
    });


      const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      };
    
      const buttonStyle = {
        marginRight: '10px',
      };
    return (
        <div className="page-wrapper">
        <div className="content">
            <div className="EditPersonalDetails new-member-page">
                <Row>
                    <Col className="col-xl-10 offset-xl-1 offset-md-0">
                        <h3 className="mb-5">Edit Institutions Details</h3>

                        <div>
                        <Form onSubmit={formik.handleSubmit} isSubmitting >
                                <div className="create-ticket register-block">
                                        <Row  className="mb-3 modal-body-table search-modal-header">
                                            <Col md={4}>
                                                <Label
                                                    className="form-label"
                                                    htmlFor="organization_code"
                                                >
                                                    UDISE Code
                                                    <span required>*</span>
                                                </Label>
                                                <input
                                                    {...inputDICE}
                                                    id="organization_code"
                                                    name="organization_code"
                                                    placeholder="Please enter UDISE Code"
                                                    disabled="true"
                                                    onChange={
                                                        formik.handleChange
                                                    }
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
                                                      
                                                        name="state"
                                                        className="form-select"
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={
                                                            formik.values.state
                                                        }

                                                        onChange={(e) => {
                                                            const selectedState =
                                                                e.target.value;

                                                            formik.setFieldValue(
                                                                'state',
                                                                selectedState
                                                            );
                                                          

                                                            setDistricts(
                                                                districtList[
                                                                selectedState
                                                                ] || []
                                                            );
                                                        }}
                                                    >
                                                        <option value="">
                                                            Select State
                                                        </option>
                                                        {stateList.map(
                                                            (state) => (
                                                                <option
                                                                    key={state}
                                                                    value={
                                                                        state
                                                                    }
                                                                >
                                                                    {state}
                                                                </option>
                                                            )
                                                        )}
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
                                                <select
                                                       
                                                        name="district"
                                                       className="form-select"
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        value={
                                                            formik.values
                                                                .district
                                                        }
                                                        onChange={(e) => {
                                                            const selectedDistrict =
                                                                e.target.value;
                                                            formik.setFieldValue(
                                                                'district',
                                                                selectedDistrict
                                                            );
                                                        }}
                                                    >
                                                        <option value="">
                                                            Select District
                                                        </option>
                                                        {districts.map(
                                                            (district) => (
                                                                <option
                                                                    key={
                                                                        district
                                                                    }
                                                                    value={
                                                                        district
                                                                    }
                                                                >
                                                                    {district}
                                                                </option>
                                                            )
                                                        )}
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
                                                   className="form-label"
                                                    htmlFor="category"
                                                >
                                                    category
                                                    <span required>*</span>
                                                </Label>
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
                                                >
                                                    PinCode
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
                                                >
                                                    ATL Code
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
                          <button type="submit"  className={`btn btn-warning  ${
                        !(formik.dirty && formik.isValid)
                          ? "default"
                          : "primary"
                      }`}
                      disabled={!(formik.dirty && formik.isValid)} style={buttonStyle}>
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

export default EditSchool;
