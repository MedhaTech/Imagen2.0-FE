/* eslint-disable react/no-unknown-property */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import { Descriptions, Input } from 'antd';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
// import { Col, Row } from 'reactstrap';
import { Button } from '../../stories/Button';
// import Layout from '../Layout';
// import {
//     deleteTempMentorById,
//     teacherResetPassword
// } from '../store/admin/actions';
import { Col, Container, Row, CardBody, CardText } from 'reactstrap';
// import './dashboard.scss';
// import { useHistory } from 'react-router-dom';
import jsPDF from 'jspdf';
import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import { URL, KEY } from '../../constants/defaultValues';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import logout from '../../assets/img/logout.png';
import { useDispatch } from 'react-redux';
import { encryptGlobal } from '../../constants/encryptDecrypt';
import {
    deleteTempMentorById,
    teacherResetPassword
} from '../store/admin/actions';
import {
    getCurrentUser,
    getNormalHeaders,
    openNotificationWithIcon
} from '../../helpers/Utils';
import { Card } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    // here we can see the registration details //
    // const history = useHistory();
    const dispatch = useDispatch();
    const pdfRef = React.useRef(null);
    const inputField = {
        type: 'text',
        className: 'defaultInput'
    };
    const navigate = useNavigate();
    const Mentor = JSON.parse(localStorage.getItem('mentor'));

    const diesdata=Mentor.organization.organization_code;

    const currentUser = getCurrentUser('current_user');
    const [diesCode, setDiesCode] = useState(diesdata);
    const [orgData, setOrgData] = useState({});
    const [mentorId, setMentorId] = useState('');
    const [SRows, setSRows] = React.useState([]);
    const [mentorTeam, setMentorTeam] = useState([]);
    const [count, setCount] = useState(0);
    const [error, setError] = useState('');
    const [isideadisable, setIsideadisable] = useState(false);
    

    const handleOnChange = (e) => {
        // we can give diescode as input //
        //where organization_code = diescode //
        localStorage.removeItem('organization_code');
        setCount(0);
        setDiesCode(e.target.value);
        setOrgData({});
        setError('');
    };
    useEffect( () => {
        // where list = diescode //
        //where organization_code = diescode //
        // const list = JSON.parse(localStorage.getItem('organization_code'));
        // setDiesCode(list);
        apiCall();
    }, []);
    async function apiCall() {
        // Dice code list API //
        // where list = diescode //
        const body = JSON.stringify({
            organization_code: diesCode
        });
        var config = {
            method: 'post',
            url: process.env.REACT_APP_API_BASE_URL + '/organizations/checkOrg',
            headers: {
                'Content-Type': 'application/json',
                Authorization : 'O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870'
            },
            data: body
        };

        await axios(config)
            .then(async function (response) {
                if (response.status == 200) {
                    setOrgData(response?.data?.data[0]);
                    setCount(count + 1);
                    setMentorId(response?.data?.data[0]?.mentor.mentor_id);
                    setError('');

                    if (response?.data?.data[0]?.mentor.mentor_id) {
                        await getMentorIdApi(
                            response?.data?.data[0]?.mentor.mentor_id
                        );
                    }
                }
            })
            .catch(function (error) {
                if (error?.response?.data?.status === 404) {
                    setError('Entered Invalid UDISE Code');
                }
                setOrgData({});
            });
    }

    const handleSearch = (e) => {
        //where we can search through diescode //
        // we can see Registration Details & Mentor Details //

        const body = JSON.stringify({
            organization_code: diesCode
        });
        var config = {
            method: 'post',
            url: process.env.REACT_APP_API_BASE_URL + '/organizations/checkOrg',
            headers: {
                'Content-Type': 'application/json',
                Authorization : 'O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870'
            },
            data: body
        };

        axios(config)
            .then(async function (response) {
                if (response.status == 200) {
                    setOrgData(response?.data?.data[0]);
                    setCount(count + 1);
                    setMentorId(response?.data?.data[0]?.mentor.mentor_id);
                    setError('');
                    if (response?.data?.data[0]?.mentor.mentor_id) {
                        await getMentorIdApi(
                            response?.data?.data[0]?.mentor.mentor_id
                        );
                    }
                }
            })
            .catch(function (error) {
                if (error?.response?.data?.status === 404) {
                    setError('Entered Invalid Unique Code');
                }
                setOrgData({});
            });
        e.preventDefault();
    };

    async function getMentorIdApi(id) {
        // Mentor Id  Api//
        // id = Mentor Id //
        let axiosConfig = getNormalHeaders(KEY.User_API_Key);
        let enParamData = encryptGlobal(
            JSON.stringify({
                mentor_id: id,
                status: 'ACTIVE',
                ideaStatus: true
            })
        );
        axiosConfig['params'] = {
            Data: enParamData
        };
        await axios
            .get(`${URL.getTeamMembersList}`, axiosConfig)
            .then((res) => {
                if (res?.status == 200) {
                    var mentorTeamArray = [];
                    res &&
                        res.data &&
                        res.data.data[0] &&
                        res.data.data[0].dataValues.length > 0 &&
                        res.data &&
                        res.data.data[0].dataValues.map((teams, index) => {
                            var key = index + 1;
                            return mentorTeamArray.push({ ...teams, key });
                        });
                    setMentorTeam(mentorTeamArray);
                }
            })
            .catch((err) => {
                return err.response;
            });
    }

    const handleEdit = () => {
        //  here  We can edit the Registration details //
        // Where data = orgData //
        navigate(
             '/admin-mentor-edit',
           { state: {
                full_name: orgData.mentor?.full_name,
                mobile: orgData.mentor?.mobile,
                username: orgData.mentor?.user?.username,
                mentor_id: orgData.mentor?.mentor_id,
                where: 'Dashbord',
                organization_code: orgData.organization_code,
                title: orgData.mentor?.title,
                gender: orgData.mentor?.gender,
                whatapp_mobile: orgData.mentor?.whatapp_mobile
            }
        });
    };
// console.log(orgData,"org");
    const handleresetpassword = (data) => {
        //  here we can reset the password as disecode //
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-submit',
                cancelButton: 'btn btn-cancel'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons
            .fire({
                title: "<h4>Are you sure?</h4>",
                text: 'You are attempting to reset the password',
                imageUrl: `${logout}`,
                confirmButtonText: 'Reset Password',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                reverseButtons: false
            })
            .then((result) => {
                if (result.isConfirmed) {
                    dispatch(
                        teacherResetPassword({
                            username: orgData.mentor?.user?.username,
                            mentor_id: data.mentor_id,
                            otp: false
                        })
                    );
                } 
            })
            .catch((err) => console.log(err.response));
    };
    const downloadPDF = () => {
        // where we can download the Registration Details //
        const content = pdfRef.current;
        const doc = new jsPDF('p', 'px', [1280, 1020]);
        doc.html(content, {
            callback: function (doc) {
                doc.save('Detail.pdf');
            }
        });
        console.warn(content);
    };
    const viewDetails = () => {
        // where we can see all details //
        // where orgData = orgnization details , Mentor details //
        // history.push({
        //     pathname: '/admin/institution/View-More-details',
        //     data: orgData
        // });
        navigate("/mentor-details");
        localStorage.setItem('orgData', JSON.stringify(orgData));
    };
    // useEffect(() => {
    //     const popParam = encryptGlobal('2');
    //     var config = {
    //         method: 'get',
    //         url: process.env.REACT_APP_API_BASE_URL + `/popup/${popParam}`,
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Accept: 'application/json',
    //             Authorization: `Bearer ${currentUser.data[0]?.token}`
    //         }
    //     };
    //     axios(config)
    //         .then(function (response) {
    //             if (response.status === 200) {
    //                 if (response.data.data[0]?.on_off === '1') {
    //                     setIsideadisable(true);
    //                 } else {
    //                     setIsideadisable(false);
    //                 }
    //             }
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // }, []);
    const MentorsData = {
        data: mentorTeam,
        columns: [
            {
                name: 'No',
                selector: (row) => row.key,
                width: '12%'
            },
            {
                name: 'Team Name',
                selector: (row) => row.team_name,
                sortable: true,
                center: true,
                width: '25%'
            },
            {
                name: 'Student Count',
                selector: (row) => row.student_count,
                center: true,
                width: '20%'
            },
            // {
            //     name: 'Idea Sub Status',
            //     selector: (row) => row.ideaStatus,
            //     center: true,
            //     width: '25%'
            // }
            // {
            //     name: 'Actions',
            //     cell: (params) => {
            //         return [
            //             <>
            //                 {params.ideaStatus == 'SUBMITTED' && params.evaluation_status === null && (
            //                     <Button
            //                         key={params}
            //                         className={
            //                             isideadisable
            //                                 ? `btn btn-success btn-lg mr-5 mx-2`
            //                                 : `btn btn-lg mr-5 mx-2`
            //                         }
            //                         label={'REVOKE'}
            //                         size="small"
            //                         shape="btn-square"
            //                         onClick={() =>
            //                             handleRevoke(
            //                                 params.challenge_response_id,
            //                                 params.ideaStatus
            //                             )
            //                         }
            //                         disabled={!isideadisable}
            //                     />
            //                 )}
            //             </>
            //         ];
            //     },
            //     width: '20%',
            //     center: true
            // }
        ]
    };
    const handleRevoke = async (id, type) => {
        // where id = challenge response id //
        // here we  can see the Revoke button when ever idea is submitted //
        // where type = ideaStatus //
        let submitData = {
            status: type == 'DRAFT' ? 'SUBMITTED' : 'DRAFT'
        };
        const handleRevPram = encryptGlobal(JSON.stringify(id));

        var config = {
            method: 'put',
            url:
                process.env.REACT_APP_API_BASE_URL +
                '/challenge_response/updateEntry/' +
                handleRevPram,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            },
            data: submitData
        };
        axios(config)
            .then(async function (response) {
                if (response.status === 200) {
                    openNotificationWithIcon(
                        'success',
                        'Idea Submission Status Successfully Update!',
                        ''
                    );
                    await getMentorIdApi(mentorId);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleAlert = (id) => {
        // where id = mentor.userid //
        // we can delete the userid //
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-submit',
                cancelButton: 'btn btn-cancel'
            },
            buttonsStyling: false,
            allowOutsideClick: false
        });

        swalWithBootstrapButtons
            .fire({
                title: "<h4>Are you sure?</h4>",
                text:'You are Deleting this Registration' ,
                imageUrl: `${logout}`,
                confirmButtonText: 'Confirm',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                reverseButtons: false
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    if (result.isConfirmed) {
                        await deleteTempMentorById(id);
                        setOrgData({});
                        setDiesCode('');
                        navigate("/mentors");

                    }
                } 
            });
    };

    return (
        <div className="page-wrapper">
        <div className="content">
            <div className="dashboard-wrappermy-5 px-5">
                <div className="dashboard p-2">
                <h4>Dashboard </h4>
                    <div className="text-right">
                        <Button
                            label="Back"
                            size="small"
                            btnClass="primary mb-3"
                            type="cancel"
                            onClick={() => navigate('/mentors')}
                        />
                    </div>
                    <div className="row " style={{ overflow: 'auto' }}>
                        <div className=" row  col-12 col-md-12">
                            <div
                                style={{ flex: 1, overflow: 'auto' }}
                                className="bg-white rounded col-lg-12 disc-card-search col-12"
                            >
                                {/* <h2 className="mt-3">
                                    Search Registration Details
                                </h2> */}
                                {/* <Row className="text-center justify-content-md-center my-4">
                                    <Col md={9} lg={12}>
                                        <Row>
                                            <Col md={9} className="my-auto">
                                                <Input
                                                    {...inputField}
                                                    id="organization_code"
                                                    onChange={(e) =>
                                                        handleOnChange(e)
                                                    }
                                                    value={diesCode}
                                                    name="organization_code"
                                                    placeholder="Enter Unique Code"
                                                    className="w-100 mb-3 mb-md-0"
                                                    style={{
                                                        borderRadius: '60px',
                                                        padding: '9px 11px'
                                                    }}
                                                />
                                            </Col>
                                            <Col md={3} className="partner-btn">
                                                <Button
                                                    label={'Search'}
                                                    btnClass="primary tex-center my-0 py-0 mx-3 px-3"
                                                    style={{
                                                        fontSize: '15px',
                                                        height: '35px'
                                                    }}
                                                    size="small"
                                                    onClick={(e) =>
                                                        handleSearch(e)
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row> */}

                                {orgData &&
                                orgData?.organization_name &&
                                orgData?.mentor !== null ? (
                                    <>
                                        {/* <div className="mb-5 p-3" >  */}
                                        {/* <div
                                                className="container-fluid card shadow border" ref={pdfRef}
                                                // style={{
                                                //     width: '300px',
                                                //     height: '300px'
                                                // }}
                                            > */}
                                        <div ref={pdfRef}>
                                            <div className="row">
                                                <div className="col">
                                                    <h2 className="text-center m-3 text-primary ">
                                                        Registration Details
                                                    </h2>
                                                    <hr />
                                                </div>
                                            </div>
                                            <div className="row ">
                                                <div className="col">
                                                    {/* <ul className="p-0">
                                                            <li className="d-flex justify-content-between">
                                                                School:
                                                                <p>
                                                                    {
                                                                        orgData.organization_name
                                                                    }
                                                                </p>
                                                            </li>
                                                            <li className="d-flex justify-content-between">
                                                                City:{' '}
                                                                <p>
                                                                    {
                                                                        orgData.city
                                                                    }
                                                                </p>
                                                            </li>
                                                            <li className="d-flex justify-content-between">
                                                                District:{' '}
                                                                <p>
                                                                    {
                                                                        orgData.district
                                                                    }
                                                                </p>
                                                            </li>
                                                            <li className="d-flex justify-content-between">
                                                                Mentor Name:{' '}
                                                                <p>
                                                                    {
                                                                        orgData
                                                                            .mentor
                                                                            ?.full_name
                                                                    }
                                                                </p>
                                                            </li>
                                                            <li className="d-flex justify-content-between">
                                                                Mentor Mobile No
                                                                :{' '}
                                                                <p>
                                                                    {
                                                                        orgData
                                                                            .mentor
                                                                            ?.user
                                                                            ?.username
                                                                    }
                                                                </p>
                                                            </li>
                                                        </ul> */}
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>School Name</p>
                                                        </Col>
                                                        <Col
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>
                                                                {
                                                                    orgData.organization_name
                                                                }
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>State</p>
                                                        </Col>
                                                        <Col
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>
                                                                {orgData.state}
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>District</p>
                                                        </Col>
                                                        <Col
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>
                                                                {
                                                                    orgData.district
                                                                }
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>Pincode</p>
                                                        </Col>
                                                        <Col
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>
                                                                {
                                                                    orgData.pin_code
                                                                }
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>Teacher Name</p>
                                                        </Col>
                                                        <Col
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>
                                                            {
                                                                    orgData
                                                                        .mentor
                                                                        ?.title
                                                                }. {
                                                                    orgData
                                                                        .mentor
                                                                        ?.full_name
                                                                }
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>Email Id</p>
                                                        </Col>
                                                        <Col
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>
                                                                {
                                                                    orgData
                                                                        .mentor
                                                                        ?.user
                                                                        ?.username
                                                                }
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>Mobile No</p>
                                                        </Col>
                                                        <Col
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>
                                                                {
                                                                    orgData
                                                                        ?.mentor
                                                                        ?.mobile
                                                                }
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-3 pb-3">
                                                        <Col
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>
                                                                WhatsApp Mobile
                                                                No
                                                            </p>
                                                        </Col>
                                                        <Col
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>
                                                                {
                                                                    orgData
                                                                        .mentor
                                                                        ?.whatapp_mobile
                                                                }
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </div>
                                        {/* </div> */}
                                        {/* <div className="d-flex justify-content-between"> */}
                                        <div className="d-flex justify-content-between flex-column flex-md-row">
                                            <button
                                                className="btn  rounded-pill px-4  text-white mt-2 mt-md-0 ml-md-2"
                                                style={{
                                                    backgroundColor: '#ffcb34'
                                                }}
                                                onClick={handleEdit}
                                                //className="btn btn-warning btn-lg  px-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleresetpassword({
                                                        mentor_id:
                                                            orgData.mentor
                                                                .mentor_id,
                                                        username:
                                                            orgData.mentor.user
                                                                .username
                                                    })
                                                }
                                                className="btn btn-info rounded-pill px-4  text-white mt-2 mt-md-0 ml-md-2"
                                            >
                                                Reset
                                            </button>
                                            <button
                                                onClick={() => {
                                                    downloadPDF();
                                                }}
                                                className="btn btn-primary rounded-pill px-4 mt-2 mt-md-0 ml-md-2"
                                            >
                                                Download
                                            </button>

                                            <button
                                                onClick={viewDetails}
                                                className="btn btn-success rounded-pill px-4 mt-2 mt-md-0 ml-md-2"
                                            >
                                                View Details
                                            </button>

                                            <button
                                                onClick={() => {
                                                    handleAlert(
                                                        orgData.mentor?.user_id
                                                    );
                                                }}
                                                className="btn  btn-lg  rounded-pill mt-2 mt-md-0 ml-md-2"
                                                style={{
                                                    backgroundColor: '#dc3545'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>

                                        {/* <div className="mb-5 p-3"> */}
                                        {/* <div className="container-fluid card shadow border"> */}
                                        <div>
                                            <div className="row">
                                                <div className="col">
                                                    <h2 className="text-center m-3 text-primary">
                                                        Teams Registered
                                                    </h2>
                                                    <hr />
                                                </div>
                                            </div>
                                            <div>
                                                <DataTableExtensions
                                                    print={false}
                                                    export={false}
                                                    {...MentorsData}
                                                >
                                                    <DataTable
                                                        noHeader
                                                        defaultSortField="id"
                                                        defaultSortAsc={false}
                                                        highlightOnHover
                                                    />
                                                </DataTableExtensions>
                                            </div>
                                        </div>
                                        {/* </div> */}
                                    </>
                                ) : (
                                    count != 0 && (
                                        <div className="text-success fs-highlight d-flex justify-content-center align-items-center">
                                            <span>
                                                Still No Teacher Registered
                                            </span>
                                        </div>
                                    )
                                )}
                                {error && diesCode && (
                                    <div className="text-danger mt-3 p-4 fs-highlight d-flex justify-content-center align-items-center">
                                        <span>{error}</span>
                                    </div>
                                )}
                                {!diesCode && (
                                    <div className="d-flex  mt-3 p-4 justify-content-center align-items-center">
                                        <span className="text-primary fs-highlight">
                                            Enter Unique Code
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Dashboard;
