/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React from 'react';
// import Layout from '../Layout';
import { Row, Col, FormGroup, Label, Form, Input } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '../../stories/Button';
import { getCurrentUser, openNotificationWithIcon } from '../../helpers/Utils';
import { useTranslation } from 'react-i18next';
// import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { encryptGlobal } from '../../constants/encryptDecrypt';
import { useNavigate } from "react-router-dom";

const EditLatestNews = (props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const newsID = JSON.parse(localStorage.getItem('newsID'));
    const currentUser = getCurrentUser('current_user');
    // const history = useHistory();
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

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'application/msword',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (!allowedTypes.includes(file.type)) {
            openNotificationWithIcon(
                'error',
                t('Accepting only png,jpg,jpeg,pdf,doc,docx Only')
            );
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

        formik.setFieldValue('file_name', file);
    };

    const formik = useFormik({
        initialValues: {
            role: newsID && newsID.category,
            details: newsID && newsID.details,
            file_name: newsID && newsID.file_name,
            url: newsID && newsID.url,
            new_status: newsID && newsID.new_status
        },
        validationSchema: Yup.object({
            role: Yup.string()
                .optional()
                .oneOf(['mentor', 'student'], 'Role is Required'),
            details: Yup.string().optional().required('details is Required'),
            new_status: Yup.string()
                .optional()
                .oneOf(['0', '1'], 'New Status type is Required'),
            file_name: Yup.mixed()
            //url: Yup.string()
        }),
        onSubmit: async (values) => {
            try {
                if (
                    values.file_name !== null &&
                    values.file_name !== '' &&
                    typeof values.file_name !== 'string'
                ) {
                    const fileData = new FormData();
                    fileData.append('file', values.file_name);

                    const response = await axios.post(
                        `${process.env.REACT_APP_API_BASE_URL}/latest_news/latestnewsFileUpload`,
                        fileData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `Bearer ${currentUser?.data[0]?.token}`
                            }
                        }
                    );
                    values.file_name =
                        response?.data?.data[0].attachments[0].toString();
                }
                const body = {
                    status: 'ACTIVE',
                    category: values.role,
                    details: values.details,
                    new_status: values.new_status
                };
                if (values.file_name !== '' && values.file_name !== null) {
                    body['file_name'] = values.file_name;
                }
                if (values.url !== '' && values.url !== null) {
                    body['url'] = values.url;
                }
                const newsId = encryptGlobal(
                    JSON.stringify(newsID.latest_news_id)
                );
                const response = await axios.put(
                    `${process.env.REACT_APP_API_BASE_URL}/latest_news/${newsId}`,
                    body,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${currentUser?.data[0]?.token}`
                        }
                    }
                );

                if (response.status === 200) {
                    navigate('/latest-news');
                    openNotificationWithIcon(
                        'success',
                        'LatestNews Updated Successfully'
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
    return (
        <div className="page-wrapper">
        <div className="content">
            <div className="EditPersonalDetails new-member-page">
                <Row>
                    <Col className="col-xl-10 offset-xl-1 offset-md-0">
                        <h3 className="mb-5">Edit LatestNews Details</h3>

                        <div>
                            <Form onSubmit={formik.handleSubmit} isSubmitting>
                                <div className="create-ticket register-block">
                                    {/* <FormGroup className="form-group" md={12}> */}
                                        <Row className="mb-3 modal-body-table search-modal-header">
                                            <Col>
                                                <Label
                                                    className="mb-2"
                                                    htmlFor="role"
                                                >
                                                    Role
                                                </Label>
                                                <select
                                                    name="role"
                                                    id="role"
                                                    className="form-control custom-dropdown"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.role}
                                                >
                                                    <option value="">
                                                        Select role
                                                    </option>
                                                    <option value="mentor">
                                                        mentor
                                                    </option>
                                                    <option value="student">
                                                        student
                                                    </option>
                                                </select>
                                                {formik.touched.role &&
                                                    formik.errors.role && (
                                                        <small className="error-cls" style={{color:"red"}}>
                                                            {formik.errors.role}
                                                        </small>
                                                    )}
                                            </Col>
                                            <Col>
                                                <Label
                                                    className="mb-2"
                                                    htmlFor="new_status"
                                                >
                                                    New Icon Status
                                                </Label>
                                                <select
                                                    name="new_status"
                                                    id="new_status"
                                                    className="form-control custom-dropdown"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={
                                                        formik.values.new_status
                                                    }
                                                >
                                                    <option value="">
                                                        Select New Status
                                                    </option>
                                                    <option value="0">
                                                        Disable
                                                    </option>
                                                    <option value="1">
                                                        Enable
                                                    </option>
                                                </select>
                                                {formik.touched.new_status &&
                                                    formik.errors
                                                        .new_status && (
                                                        <small className="error-cls" style={{color:"red"}}>
                                                            {
                                                                formik.errors
                                                                    .new_status
                                                            }
                                                        </small>
                                                    )}
                                            </Col>
                                        </Row>
                                        <Row className="mb-3 modal-body-table search-modal-header">
                                        <Label
                                            className="mb-2"
                                            htmlFor="details"
                                        >
                                            Details
                                        </Label>
                                        <Input
                                            type="text"
                                            {...inputDICE}
                                            id="details"
                                            name="details"
                                            placeholder="Please enter details"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.details}
                                        />
                                        {formik.touched.details &&
                                            formik.errors.details && (
                                                <small className="error-cls" style={{color:"red"}}>
                                                    {formik.errors.details}
                                                </small>
                                            )}
</Row >
<Row className="mb-3 modal-body-table search-modal-header">
    <Col md={4}>
                                        <Label
                                            className="mb-2"
                                            htmlFor="file_name"
                                        >
                                            File
                                        </Label>
                                        <div className="d-flex align-items-center">
                                            <input
                                                type="file"
                                                id="file_name"
                                                name="file_name"
                                                style={{
                                                    display: 'none'
                                                }}
                                                accept="image/jpeg,image/png,application/msword,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                onChange={(e) => fileHandler(e)}
                                                onBlur={formik.handleBlur}
                                            />
                                            <Button
                                                label="Upload File"
                                                btnClass="primary me-2"
                                                size="small"
                                                onClick={() => {
                                                    document
                                                        .getElementById(
                                                            'file_name'
                                                        )
                                                        .click();
                                                }}
                                            />
                                            {formik.values.file_name &&
                                            formik.values.file_name.name ? (
                                                <span className="ml-2">
                                                    {
                                                        formik.values.file_name
                                                            .name
                                                    }
                                                </span>
                                            ) : (
                                                <span className="ml-2">
                                                    {formik.initialValues
                                                        .file_name &&
                                                        formik.initialValues
                                                            .file_name.name}
                                                </span>
                                            )}

                                            {/* Display Download Button */}
                                            {formik.values.file_name && (
                                                <button
                                                    className="btn btn-warning"
                                                    // style={{ color: 'black' }}
                                                    // size="small"
                                                    // label=" "
                                                >
                                                    <a
                                                        href={
                                                            formik.values
                                                                .file_name
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        // style={{
                                                        //     color: 'black',
                                                        //     fontWeight: 'bold',
                                                        //     fontSize: '14px',
                                                        //     padding: '.5rem'
                                                        // }}
                                                        // className="btn btn-warning mx-2"
                                                    >
                                                        Download
                                                    </a>
                                                </button>
                                            )}
                                        </div>
                                        {formik.touched.file_name &&
                                            formik.errors.file_name && (
                                                <small className="error-cls" style={{color:"red"}}>
                                                    {formik.errors.file_name}
                                                </small>
                                            )}
</Col>
<Col md={8}>
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
                                                <small className="error-cls" style={{color:"red"}}>
                                                    {formik.errors.url}
                                                </small>
                                            )}
                                            </Col> 
                                            </Row>
                                    {/* </FormGroup> */}
                                </div>

                                {/* <hr className="mt-4 mb-4" /> */}
                                <Row>
                                        <div style={buttonContainerStyle}>
                                            <button
                                            className='btn btn-warning'
                                            type='submit'
                                            style={buttonStyle}
                                               
                                            >
                                                Submit details
                                        </button>
                                        <button
                                        type='cancel'
                                         onClick={() =>
                                                    navigate(
                                                        '/latest-news'
                                                    )
                                                }

                                                className='btn btn-secondary'
                                           
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

export default EditLatestNews;
