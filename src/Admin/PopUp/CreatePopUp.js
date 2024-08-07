/* eslint-disable indent */
import React,{useState} from 'react';
// import Layout from '../../Admin/Layout';
import { Row, Col, FormGroup, Label, Form } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '../../stories/Button';
// import { InputBox } from '../../stories/InputBox/InputBox';
import { getCurrentUser, openNotificationWithIcon } from '../../helpers/Utils';
import { useTranslation } from 'react-i18next';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
// import { URL, KEY } from '../../constants/defaultValues';
// import { staticData } from './index';
import { stateList,userList,navList } from '../../RegPage/ORGData';
const CreateResource = () => {
    const { t } = useTranslation();
    const currentUser = getCurrentUser('current_user');
    const [path, setPath] = useState([]);

    const navigate = useNavigate();
    // const inputDICE = {
    //     type: 'text',
    //    className:"form-control"
    // };

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
            navigate: '',
            type: '',
            state:"",
            attachments: ''
        },
        validationSchema: Yup.object({
            role: Yup.string()
               .required('Role is Required'),
                // .optional()
                // .oneOf(['mentor', 'student'], 'Role is Required'),
            navigate: Yup.string()
                .optional(),
                state:Yup.string().required("Please Select State"),

                // .required(' is Required'),
            type: Yup.string()
                .optional()
                .oneOf(['file', 'link'], 'Submission type is Required'),
                attachments: Yup.string().required('Attachments are required'),
            // attachments: Yup.mixed().when('type', {
            //     is: (val) => val === 'file',
            //     then: Yup.mixed().required('File is Required'),
            //     otherwise: Yup.string().required('Link is Required')
            // })
        }),
        onSubmit: async (values) => {
            try {
                if (values.type === 'file') {
                    const fileData = new FormData();
                    fileData.append('url', values.attachments);

                    const response = await axios.post(
                        `${process.env.REACT_APP_API_BASE_URL}/popup/popupFileUpload`,
                        fileData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `Bearer ${currentUser?.data[0]?.token}`
                            }
                        }
                    );
                    // console.log(response,"reee");
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
                    state: values.state,
                    url: values.attachments,
                    on_off:"0"
                };
                if (
                    values.navigate !== values.navigate
                    ) {
                        body['navigate'] = values.navigate;
                    }
                const response = await axios.post(
                    `${process.env.REACT_APP_API_BASE_URL}/popup`,
                    body,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${currentUser?.data[0]?.token}`
                        }
                    }
                );

                if (response.status === 201) {
                    navigate('/popup');
                    openNotificationWithIcon(
                        'success',
                        'PopUp Created Successfully'
                    );
                } else {
                    openNotificationWithIcon('error', 'Opps! Something Wrong');
                }
            } catch (error) {
                console.log(error);
            }
        }
        //   onSubmit: (values) => {

        //     const body = JSON.stringify({
        //         role: values.role,
        //         navigate: values.navigate,
        //         type: values.type,
        //         attachments: values.attachments
        //     });

        //     var config = {
        //         method: 'post',
        //         url: process.env.REACT_APP_API_BASE_URL + '/resource',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             Authorization: `Bearer ${currentUser?.data[0]?.token}`
        //         },
        //         data: body
        //     };
        //     axios(config)
        //         .then(function (response) {
        //             if (response.status === 201) {
        //                 props.history.push('/admin/Resources/index');
        //                 openNotificationWithIcon(
        //                     'success',
        //                     'Resource Created Successfully'
        //                 );
        //             } else {
        //                 openNotificationWithIcon(
        //                     'error',
        //                     'Opps! Something Wrong'
        //                 );
        //             }
        //         })
        //         .catch(function (error) {
        //             console.log(error);
        //         });
        // }
    });

    // const handleFileChange = (e) => {
    //   formik.setFieldValue('file', e.target.files[0]);
    // };
    const handleStateChange = (event) => {
        const state = event.target.value;
        formik.setFieldValue("state", state);
      };
      const handleroleChange = (event) => {
        const role = event.target.value;
        formik.setFieldValue("role", role);
        formik.setFieldValue("navigate", ""); 
      setPath(navList[role] || []);
      };
      const handlepathChange = (event) => {
        formik.setFieldValue("navigate", event.target.value);
      };
    return (
        <div className="page-wrapper">
        <div className="content">
            <div className="EditPersonalDetails new-member-page">
                <Row>
                    <Col className="col-xl-10 offset-xl-1 offset-md-0">
                        <h3 className="mt-5 mb-5 ">
                            {' '}
                            Add PopUp 
                        </h3>
                        <div>
                            <Form onSubmit={formik.handleSubmit} isSubmitting>
                                <div className="create-ticket register-block">
                                    <FormGroup className="form-group" md={12}>
                                        <Label className="mb-2" htmlFor="role">
                                            Role
                                        </Label>
                                        <select
                                            name="role"
                                            id="role"
                                           className="form-select"
                                           onChange={(e) => handleroleChange(e)}
                                            onBlur={formik.handleBlur}
                                            // value={formik.values.role}
                                            // style={{
                                            //     color: formik.values.role
                                            //         ? 'black'
                                            //         : 'initial',
                                            //     fontWeight: formik.values.role
                                            //         ? 'bold'
                                            //         : 'normal'
                                            // }}
                                        >
                                            <option value="" >
                                                Select role
                                            </option>
                                            {userList.map((state) => (
                              <option key={state} value={state}>
                                {state}
                              </option>
                              ))}
                                        </select>
                                        {formik.touched.role &&
                                            formik.errors.role && (
                                                <small className="error-cls">
                                                    {formik.errors.role}
                                                </small>
                                            )}

<Label
                                                    className="form-label"
                                                    htmlFor="state"
                                                >
                                                    State
                                                    {/* <span required>*</span> */}

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

                                        <Label className="mb-2" htmlFor="type">
                                            Type
                                        </Label>
                                        <select
                                            name="type"
                                            id="type"
                                            placeholder="Please select submission type"
                                           className="form-select"
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
                                                <small className="error-cls">
                                                    {formik.errors.type}
                                                </small>
                                            )}

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
                                                        className="form-control"
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
                                                        <small className="error-cls">
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
                                                <input
                                                    type="text"
                                                    name="attachments"
                                                    id="attachments"
                                                    className="form-control"
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
                                                        <small className="error-cls">
                                                            {
                                                                formik.errors
                                                                    .attachments
                                                            }
                                                        </small>
                                                    )}
                                                   
                                            </FormGroup>
                                        )}
                                           <Label
                                            className="mb-2"
                                            htmlFor="navigate"
                                        >
                                            Navigate Menu
                                        </Label>
                                        <select
                            id="inputState"
                            className="form-select"
                            value={formik.values.district}
                            onChange={(e)=>handlepathChange(e)}
                          >
                            <option value="">Select Path</option>
                            {path.map((path) => (
                              <option key={path} value={path}>
                                {path}
                              </option>
                            ))}
                          </select>
                                        {formik.touched.navigate &&
                                            formik.errors.navigate && (
                                                <small className="error-cls">
                                                    {formik.errors.navigate}
                                                </small>
                                            )}
                                    </FormGroup>
                                </div>

                                {/* <hr className="mt-4 mb-4" /> */}
                                <Row>
                                    <Col className="col-xs-12 col-sm-6">
                                        <div className="col-6">
                                        <button
                                            label="Submit details"
                                            type="submit"
                                            // btnClass={
                                               
                                            //     !(
                                            //         formik.dirty &&
                                            //         formik.isValid
                                            //     )
                                            //         ? 'default'
                                            //         : 'primary'
                                            // }
                                            // size="small"
                                            className={`btn btn-warning ${
                                                !(formik.dirty && formik.isValid) ? "default" : "warning"
                                              }`}
                                              // btnClass={
                                              //   !(formik.dirty && formik.isValid) ? "default" : "primary"
                                              // }
                                            //   disabled={!(formik.dirty && formik.isValid)}
                                            disabled={!formik.dirty}
                                        >
                                            Submit details
                                        </button>
                                        </div>
                                    </Col>
                                    <Col className="submit-btn col-xs-12 col-sm-6">
                                    <button
                                               
                                                type="cancel"
                                               className='btn btn-secondary'
                                                onClick={() =>
                                                   navigate(
                                                        '/popup'
                                                    )
                                                }
                                            >
                                                Discard
                                        </button>
                                       
                                    </Col>
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