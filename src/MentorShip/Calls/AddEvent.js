/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React from 'react';
import { Row, Col, FormGroup, Label, Form, Input } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getCurrentUser, openNotificationWithIcon } from '../../helpers/Utils';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddEvent = () => {
    const currentUser = getCurrentUser('current_user');
    const navigate = useNavigate();
    const inputDICE = {
        type: 'text',
        className: 'defaultInput'
    };

  

    const formik = useFormik({
        initialValues: {
            details: '',
            url: '',
            status: "",
        },
        validationSchema: Yup.object({
            status: Yup.string().optional().oneOf(["COMPLETED", "INCOMPLETE"]),
            details: Yup.date().optional().required("Date & time is required"),
            url: Yup.string()
        }),
        onSubmit: async (values) => {
            try {
              
                const body = {
                     status: values.status,
                    details: values.details,

                };
               
                if (values.url !== '') {
                    body['url'] = values.url;
                }

                const response = await axios.post(
                    `${process.env.REACT_APP_API_BASE_URL}/latest_news`,
                    body,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${currentUser?.data[0]?.token}`
                        }
                    }
                );

                if (response.status === 201) {
                    // navigate('/schedule-calls');
                    // openNotificationWithIcon(
                    //     'success',
                    //     'Latest News Created Successfully'
                    // );
                } else {
                    openNotificationWithIcon('error', 'Opps! Something Wrong');
                }
            } catch (error) {
                console.log(error);
            }
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
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4>Add Schedule Calls</h4>
                            <h6>You can add new events by submitting details here</h6>
                        </div>
                    </div>
                </div>
            <div className="EditPersonalDetails new-member-page">
                <Row>
                    <Col className="col-xl-10 offset-xl-1 offset-md-0">
                        <div>
                            <Form onSubmit={formik.handleSubmit} isSubmitting>
                                <div className="create-ticket register-block">
                                    {/* <FormGroup className="form-group" md={12}> */}
                                        <Row className="mb-3 modal-body-table search-modal-header">
                                  
                                        <Label className="mb-2" htmlFor="url">
                                            Link
                                        </Label>
                                        <Input
                                            type="text"
                                            name="url"
                                            id="url"
                                            placeholder="Please enter the link"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.url}
                                        />
                                        {formik.touched.url &&
                                            formik.errors.url && (
                                                <small className="error-cls">
                                                    {formik.errors.url}
                                                </small>
                                            )}
                                </Row>
                                        <Row className="mb-3 modal-body-table search-modal-header">
                                        <Label
                                            className="mb-2"
                                            htmlFor="details"
                                        >
                                            Date & Time <span style={{ color: "red" }}>*</span>
                                        </Label>
                                        {/* <Input
                                            type="text"
                                            {...inputDICE}
                                            id="details"
                                            name="details"
                                            placeholder="Please enter details"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.details}
                                        /> */}
                                        <DatePicker
    selected={formik.values.details}
    onChange={(val) => formik.setFieldValue("details", val)}
    onBlur={formik.handleBlur}
    showTimeSelect
    dateFormat="Pp" 
    placeholderText="Select date and time"
    className="form-control"
    name="details"
    id="details"
  />
                                        {formik.touched.details &&
                                            formik.errors.details && (
                                                <small className="error-cls" style={{color:"red"}}>
                                                    {formik.errors.details}
                                                </small>
                                            )}
                                </Row>
                                                                       <Row className="mb-3 modal-body-table search-modal-header">
                                  
                                        <Label className="mb-2" htmlFor="url">
                                            Status
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
                                </Row>
                                </div>

                                <Row>
                                    <div style={buttonContainerStyle} className='mt-3'>
                                        <button
                                            type="submit"
                                            className='btn btn-warning'
                                            style={buttonStyle}
                                        >
                                            Submit Details
                                        </button>

                                    
                                        <button
                                            className='btn btn-secondary'
                                            type="button"

                                            style={{ marginLeft: 'auto' }} 
                                            onClick={()=>navigate("/schedule-calls")}
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

export default AddEvent;
