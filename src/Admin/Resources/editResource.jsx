/* eslint-disable indent */
import React from 'react';
import { Row, Col, FormGroup, Label, Form,Input } from 'reactstrap';
// import { BreadcrumbTwo } from '../../stories/BreadcrumbTwo/BreadcrumbTwo';
import { Button } from '../../stories/Button';
import { useFormik } from 'formik';
import { getCurrentUser, openNotificationWithIcon } from '../../helpers/Utils';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import axios from 'axios';
import { encryptGlobal } from '../../constants/encryptDecrypt';
import { useNavigate } from 'react-router-dom';


const EditResource = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const resID = JSON.parse(localStorage.getItem('resID'));
    const currentUser = getCurrentUser('current_user');
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

        formik.setFieldValue('attachments', file);
    };
    const handleTypeChnage = () => {
        formik.setFieldValue('attachments', '');
    };
    const formik = useFormik({
        initialValues: {
            role: resID && resID.role,
            description: resID && resID.description,
            type: resID && resID.type,
            attachments: (resID && resID.attachments) || ''
        },
        validationSchema: Yup.object({
            role: Yup.string()
                .optional()
                .oneOf(['mentor', 'student'], 'Role is Required'),
            description: Yup.string()
                .optional()
                .required('Details is Required'),
            type: Yup.string()
                .optional()
                .oneOf(['file', 'link'], 'Submission type is Required'),
            attachments: Yup.string().required('Attachments are required'),
        }),
        onSubmit: async (values) => {
            try {
                if (
                    values.type === 'file' &&
                    values.attachments !== null &&
                    values.attachments !== '' &&
                    typeof values.attachments !== 'string'
                ) {
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
                    //       'File Updated Successfully'
                    //     );
                    //   } else {
                    //     openNotificationWithIcon('error', 'Opps! Something Wrong');
                    //   }
                }

                const body = {
                    status: 'ACTIVE',
                    role: values.role,
                    type: values.type,
                    description: values.description,
                    attachments: values.attachments
                };
                const editParam = encryptGlobal(
                    JSON.stringify(resID.resource_id)
                );

                const response = await axios.put(
                    `${process.env.REACT_APP_API_BASE_URL}/resource/${editParam}`,
                    body,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${currentUser?.data[0]?.token}`
                        }
                    }
                );

                if (response.status === 200) {
                    navigate('/adminresources');
                    //props.history.push('/admin/Resources');
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


    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4>Edit Resource</h4>
                            <h6>You can modify details in this resourse</h6>
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
                                            <Col>
                                                <Label className="mb-2" htmlFor="role">
                                                    Role
                                                </Label>
                                                <select
                                                    name="role"
                                                    id="role"
                                                    className="form-control custom-dropdown"
                                                    value={formik.values.role}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                >
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
                                                htmlFor="description"
                                            >
                                                Description
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
                                            <Col>
                                            <Label className="mb-2" htmlFor="type">
                                                Type
                                            </Label>
                                            <select
                                                name="type"
                                                id="type"
                                                className="form-control custom-dropdown"
                                                value={formik.values.type}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    handleTypeChnage();
                                                }}
                                                onBlur={formik.handleBlur}
                                            >
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
                                                        <button
                                                            className='btn btn-info mx-2'
                                                            type="button"
                                                            onClick={() => {
                                                                window.open(
                                                                    formik.values
                                                                        .attachments,
                                                                    '_blank'
                                                                );
                                                            }}
                                                        >
                                                            Download
                                                        </button>
                                                        
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
                                                        {...inputDICE}
                                                        type="text"
                                                        id="attachments"
                                                        name="attachments"
                                                        placeholder="Enter link"
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
                                    {/* <Row>
                                        <Col className="col-xs-12 col-sm-6">
                                            <Button
                                                label="Discard"
                                                btnClass="secondary"
                                                size="small"
                                                onClick={() => navigate('/adminresources')}
                                                
                                            />
                                        </Col>
                                        <Col className="submit-btn col-xs-12 col-sm-6">
                                            <Button
                                                label="Submit details"
                                                type="submit"
                                                btnClass={
                                                    !formik.dirty || !formik.isValid
                                                        ? 'default'
                                                        : 'primary'
                                                }
                                                size="small"
                                                disabled={!formik.dirty}
                                            />
                                        </Col>
                                    </Row> */}
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default EditResource;
