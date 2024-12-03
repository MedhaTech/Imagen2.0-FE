/* eslint-disable indent */
import React from 'react';
import { Row, Col, FormGroup, Label, Form, Input } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '../../stories/Button';
import { getCurrentUser, openNotificationWithIcon } from '../../helpers/Utils';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { stateList } from "../../RegPage/ORGData";


const CreateResource = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const currentUser = getCurrentUser('current_user');
//   const allData = ["All States", ...stateList];

    const inputDICE = {
        type: 'text',
        className: 'defaultInput'
    };

    const fileHandler = (e) => {
        let file = e.target.files[0];
        
        if (!file) {
            return;
        }

        let pattern = /^[a-zA-Z0-9_-\s]{0,}$/;
        const fileName = file.name.split('.').slice(0, -1).join('.');
        const isValidFileName = pattern.test(fileName);

        const maxFileSize = 10000000;
        const isOverMaxSize = file.size > maxFileSize;
        const allowedTypes = ['image/jpeg', 'image/png','application/msword','application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if(!allowedTypes.includes(file.type)){
            openNotificationWithIcon('error', t('Accepting only png,jpg,jpeg,pdf,doc,docx Only'));
            return;
        }

        if (isOverMaxSize) {
            openNotificationWithIcon('error', t('student.less_10MB'));
            return;
        }

        if (!isValidFileName) {
            openNotificationWithIcon(
                'error',
                "Only alphanumeric and '_' are allowed"
            );
            return;
        }

        formik.setFieldValue('attachments', file);
    };
    const handleTypeChnage = () => {
        formik.setFieldValue('attachments', '');
    };

    const formik = useFormik({
        initialValues: {
            role: '',
            description: '',
            type: '',
            // state: "",
            attachments: ''
        },
        validationSchema: Yup.object({
            role: Yup.string()
                .optional()
                .oneOf(['Institution', 'Student']).required('Role is Required'),
            description: Yup.string()
                .optional()
                .required('Details is Required'),
    //   state: Yup.string().required("Please Select State"),

            type: Yup.string()
                .optional()
                .oneOf(['file', 'link']).required('Type is Required'),
            attachments: Yup.string().required('Attachments are required'),
        }),
        onSubmit: async (values) => {
            try {
                if (values.type === 'file') {
                    const fileData = new FormData();
                    fileData.append('file', values.attachments);

                    const response = await axios.post(
                        `${process.env.REACT_APP_API_BASE_URL}/resource/resourceFileUpload`,
                        fileData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `Bearer ${currentUser?.data[0]?.token}`
                            }
                        }
                    );
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

                    description: values.description,
                    attachments: values.attachments
                };

                const response = await axios.post(
                    `${process.env.REACT_APP_API_BASE_URL}/resource`,
                    body,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${currentUser?.data[0]?.token}`
                        }
                    }
                );

                if (response.status === 201) {
                    navigate('/adminresources');
                    openNotificationWithIcon(
                        'success',
                        'Resource Updated Successfully'
                    );
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
    //   const handleStateChange = (event) => {
    //     const state = event.target.value;
    //     formik.setFieldValue("state", state);
    //   };
    return (
        <div className="page-wrapper">
             <h4 className="m-2" 
        style={{ position: 'sticky', top: '70px', zIndex: 1000, padding: '10px',backgroundColor: 'white', display: 'inline-block' , color: '#fe9f43',fontSize:"16px" }}
        >Resources
        </h4>
        <div className="content">
            <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4>Add Resource</h4>
                            <h6>You can add new resource by submitting details here</h6>
                        </div>
                    </div>
                </div>
            <div className="EditPersonalDetails new-member-page">
                <Row>
                    <Col className="col-xl-10 offset-xl-1 offset-md-0">
                        <div>
                            <Form onSubmit={formik.handleSubmit} isSubmitting>
                                <div className="create-ticket register-block">
                                    <Row className="mb-3 modal-body-table search-modal-header">
                                        <Col md={6}>
                                            <Label className="mb-2" htmlFor="role">
                                                Role
                                                <span required>*</span>
                                            </Label>
                                            <select
                                                name="role"
                                                id="role"
                                                className="form-control custom-dropdown"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.role}
                                                style={{
                                                    color: formik.values.role
                                                        ? 'black'
                                                        : 'initial',
                                                    fontWeight: formik.values.role
                                                        ? 'bold'
                                                        : 'normal'
                                                }}
                                            >
                                                <option value="" disabled={true}>
                                                    Select role
                                                </option>
                                                <option value="Institution">
                                                    Institution
                                                </option>
                                                <option value="Student">
                                                    Student
                                                </option>
                                            </select>
                                            {formik.touched.role &&
                                                formik.errors.role && (
                                                    <small className="error-cls" style={{color:"red"}}>
                                                        {formik.errors.role}
                                                    </small>
                                                )}
                                        </Col>
                                        {/* <Col md={4}>
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
                                        <Col  md={6}>
                                            <Label
                                                className="mb-2"
                                                htmlFor="description"
                                            >
                                                Details
                                                <span required>*</span>
                                            </Label>
                                            <Input
                                                {...inputDICE}
                                                id="description"
                                                type="text"
                                                name="description"
                                                placeholder="Please enter details"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.description}
                                            />
                                            {formik.touched.description &&
                                                formik.errors.description && (
                                                    <small className="error-cls" style={{color:"red"}}>
                                                        {formik.errors.description}
                                                    </small>
                                                )}
                                        </Col>
                                    </Row>
                                    <Row className="mb-3 modal-body-table search-modal-header">
                                        <Col >
                                            <Label className="mb-2" htmlFor="type">
                                                Type
                                                <span required>*</span>
                                            </Label>
                                            <select
                                                name="type"
                                                id="type"
                                                placeholder="Please select submission type"
                                                className="form-control custom-dropdown"
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    handleTypeChnage();
                                                }}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.type}
                                                style={{
                                                    color: formik.values.type
                                                        ? 'black'
                                                        : 'initial',
                                                    fontWeight: formik.values.type
                                                        ? 'bold'
                                                        : 'normal'
                                                }}
                                            >
                                                <option disabled={true} value="">
                                                    Select type
                                                </option>
                                                <option value="file">File</option>
                                                <option value="link">Link</option>
                                            </select>
                                            {formik.touched.type &&
                                                formik.errors.type && (
                                                    <small className="error-cls" style={{color:"red"}}>
                                                        {formik.errors.type}
                                                    </small>
                                                )}
                                        </Col>
                                        <Col>
                                        {formik.values.type === 'file' && (
                                            <>
                                                <Label
                                                    className="mb-2"
                                                    htmlFor="attachments"
                                                >
                                                    File
                                                </Label>
                                                <div className="d-flex align-items-center">
                                                    <input
                                                        type="file"
                                                        id="attachments"
                                                        name="attachments"
                                                        style={{
                                                            display: 'none'
                                                        }}
                                                        accept="image/jpeg,image/png,application/msword,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                        onChange={(e) =>
                                                            fileHandler(e)
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                    />
                                                    <Button
                                                        label="Upload File "
                                                        btnClass="primary"
                                                        size="small"
                                                        onClick={() => {
                                                            document
                                                                .getElementById(
                                                                    'attachments'
                                                                )
                                                                .click();
                                                        }}
                                                    />
                                                    {formik.values
                                                        .attachments &&
                                                    formik.values.attachments
                                                        .name ? (
                                                        <span className="ml-2">
                                                            {
                                                                formik.values
                                                                    .attachments
                                                                    .name
                                                            }
                                                        </span>
                                                    ) : (
                                                        <span className="ml-2">
                                                            {formik
                                                                .initialValues
                                                                .attachments &&
                                                                formik
                                                                    .initialValues
                                                                    .attachments
                                                                    .name}
                                                        </span>
                                                    )}
                                                </div>
                                                {formik.touched.attachments &&
                                                    formik.errors
                                                        .attachments && (
                                                        <small className="error-cls" style={{color:"red"}}>
                                                            {
                                                                formik.errors
                                                                    .attachments
                                                            }
                                                        </small>
                                                    )}
                                            </>
                                        )}

                                        {formik.values.type === 'link' && (
                                            <FormGroup
                                                className="form-group"
                                                md={12}
                                            >
                                                <Label
                                                    className="mb-2"
                                                    htmlFor="attachments"
                                                >
                                                    Link
                                                </Label>
                                                <Input
                                                    type="text"
                                                    name="attachments"
                                                    id="attachments"
                                                    placeholder="Please enter the link"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={
                                                        formik.values
                                                            .attachments
                                                    }
                                                />
                                                {formik.touched.attachments &&
                                                    formik.errors
                                                        .attachments && (
                                                        <small className="error-cls" style={{color:"red"}}>
                                                            {
                                                                formik.errors
                                                                    .attachments
                                                            }
                                                        </small>
                                                    )}
                                            </FormGroup>
                                        )}
                                        </Col>
                                    </Row>
                                </div>

                                <Row>
                                    <div style={buttonContainerStyle} className='mt-3'>
                                        <button
                                            type="submit"
                                            className='btn btn-warning'
                                            style={buttonStyle}
                                        >
                                            Submit details
                                        </button>

                                    
                                        <button
                                            className='btn btn-secondary'
                                            type="button"

                                            style={{ marginLeft: 'auto' }} 
                                            onClick={() => navigate('/adminresources')}
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

export default CreateResource;
