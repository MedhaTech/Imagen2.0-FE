/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'reactstrap';
// import { Tabs } from 'antd';
// import Layout from '../../Admin/Layout';
import { BsUpload } from 'react-icons/bs';
import { Button } from '../../stories/Button';
import { connect } from 'react-redux';
import {
    getAdmin,
    getAdminEvalutorsList,
    getAdminMentorsList,
    getAdminMentorsListSuccess,
    updateMentorStatus
} from '../../redux/actions';
import axios from 'axios';
import { URL, KEY } from '../../constants/defaultValues.js';

import { getNormalHeaders } from '../../helpers/Utils';
// import { useHistory } from 'react-router-dom';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import logout from '../../assets/img/logout.png';
import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import Select from './Select.js';


import { Badge } from 'react-bootstrap';
import CommonPage from '../../components/CommonPage';
import { useDispatch } from 'react-redux';
import dist from 'react-data-table-component-extensions';
// import ClipLoader from 'react-spinners/ClipLoader';
import { encryptGlobal } from '../../constants/encryptDecrypt.js';
import { stateList } from '../../RegPage/ORGData.js';
// const { TabPane } = Tabs;

// const SelectDists = ({
//     // stateList,
//     getDistrictsListAction,
//     getStateDataListAction,
//     dists,
//     tab,
//     setDist,
//     newDist,
//     drop
// }) => {
//     const [loading, setLoading] = useState(false);
//     // console.log(stateList, 'id');
//     // useEffect(() => {
//     //     if (tab && (tab == 1 || tab == 2)) getDistrictsListAction();
//     // }, [tab]);
//     // console.log();
//     const handleDists = (e) => {
//         // console.log(e,"e");
//         // setNewDist(e.target.value);
//         setLoading(true);
//         setTimeout(() => {
//             setLoading(false);
//         }, 2000);
//         setDist(e.target.value);
//         localStorage.setItem('dist', e.target.value);
//     };
//         // console.log(dist,"e");

//     return (
//         <select
//             onChange={handleDists}
//             name="districts"
//             id="districts"
//             value={newDist}
//             className="text-capitalize"
//         >
//             <option value="">Select State</option>

//             {stateList && stateList.length > 0 ? (
//                 stateList.map((item, i) => (
//                     <option key={i} value={item}>
//                         {item}
//                     </option>
//                 ))
//             ) : (
//                 <option value="">There are no District</option>
//             )}
//         </select>
//     );
// };
const TicketsPage = (props) => {
    const dispatch = useDispatch();
    // const history = useHistory();
    const [tableData, settableData] = React.useState([]);
    const [showspin, setshowspin] = React.useState(false);
const[applicant,setApplicant]=useState("");
const [gender,setGender]=useState("");
const [institution,setInstitution]=useState("");
    const district = localStorage.getItem('dist');
    const [menter, activeMenter] = useState(false);
    const [loading, setLoading] = useState(false);
const updateStatesList=["All States",...stateList];


    const [evaluater, activeEvaluater] = useState(false);
    const [tab, setTab] = useState('1');
    const [studentDist, setstudentDist] = useState(district ? district : '');
    const [mentorDist, setmentorDist] = useState('');
    const [newDist, setNewDists] = useState('');
    const [registerModalShow, setRegisterModalShow] = useState(false);
    const [fetchData, setFetchData] = useState(false);
    const [state,setState]=useState("");
    let State = localStorage.getItem('state');

//   useEffect(()=>{
//     handleideaList();
//   },[]);
    const handleclickcall = async () => {
        // where we can select district and sdg //
        // where we can see list of challenges districtwise //
        setshowspin(true);
        await handleideaList();
    };
  
    async function handleideaList() {
        // handleideaList api //
        //where we can see all ideas in districtwise //
        settableData([]);
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
       
        const resparam = encryptGlobal(
            JSON.stringify({
                // status: "ALL",
                state: state ,
                // year_of_study:applicant,
                // group:institution,
                // Gender:gender,
                // district: district !== 'All Districts' ? district : ''
                // protoType: protoType,
                // sdg: sdg !== 'All Themes' ? sdg : ''
            })
        );
        await axios
        .get(`${URL.getTeamsList}?Data=${resparam}`, axiosConfig)
            .then(function (response) {
                if (response.status === 200) {
                    // console.log(response,"11");
                    const updatedWithKey =
                        response.data &&
                        response.data.data[0] &&
                        response.data.data[0].dataValues.
                        map((item, i) => {
                            const upd = { ...item };
                            upd['key'] = i + 1;
                            return upd;
                        });
                    settableData(updatedWithKey);
                    setshowspin(false);
                }
            })
            .catch(function (error) {
                console.log(error);
                setshowspin(false);
            });
    }
// console.log(tableData,"state");
    const handleSelect = (item, num) => {
        // where item = student id / mentor id //
        localStorage.removeItem('dist');
        localStorage.removeItem('num');
        if (num == '1') {
            props.history.push({
                pathname: `/admin/userprofile`,
                data: item,
                dist: studentDist,
                num: num
            });
            localStorage.setItem('studentId', item.user_id);
            localStorage.setItem('studentData', JSON.stringify(item));
        } else {
            props.history.push({
                pathname: `/admin/userprofile`,
                data: item,
                dist: mentorDist,
                num: num
            });
        }
        localStorage.setItem('mentor', JSON.stringify(item));
    };
    const viewDetail = (item) => {
        props.history.push({
            pathname: '/admin/institution/dashboard',
            data: item
        });
        // localStorage.setItem(
        //     'institution_code',
        //     JSON.stringify(item.institution_code)
        // );
    };

    const handleEdit = (item) => {
        // where we can edit user details  //
        // where item = mentor id //
        props.history.push({
            pathname: `/admin/edit-user-profile`,
            data: item
        });
        localStorage.setItem('mentor', JSON.stringify(item));
    };

    // const handleReset = (item) => {
    //     const body = JSON.stringify({
    //         organization_code: item.organization_code,
    //         otp: false,
    //         mentor_id: item.mentor_id
    //     });
    //     var config = {
    //         method: 'put',
    //         url: process.env.REACT_APP_API_BASE_URL + '/mentors/resetPassword',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${currentUser?.data[0]?.token}`
    //         },
    //         data: body
    //     };
    //     axios(config)
    //         .then(function (response) {
    //             if (response.status === 202) {
    //                 openNotificationWithIcon(
    //                     'success',
    //                     'Reset Password Successfully Update!',
    //                     ''
    //                 );
    //             }
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // };
    // const handleDelete = () => {
    //     const swalWithBootstrapButtons = Swal.mixin({
    //         customClass: {
    //             confirmButton: 'btn btn-success',
    //             cancelButton: 'btn btn-danger'
    //         },
    //         buttonsStyling: false
    //     });

    //     swalWithBootstrapButtons
    //         .fire({
    //             title: 'You are attempting to delete Evalauaor.',
    //             text: 'Are you sure?',
    //             imageUrl: `${logout}`,
    //             showCloseButton: true,
    //             confirmButtonText: 'Delete',
    //             showCancelButton: true,
    //             cancelButtonText: 'Cancel',
    //             reverseButtons: false
    //         })
    //         .then((result) => {
    //             if (result.isConfirmed) {
    //                 swalWithBootstrapButtons.fire(
    //                     'Loged out!',
    //                     'Successfully deleted.',
    //                     'success'
    //                 );
    //             } else if (result.dismiss === Swal.DismissReason.cancel) {
    //                 swalWithBootstrapButtons.fire(
    //                     'Cancelled',
    //                     'You are Logged in',
    //                     'error'
    //                 );
    //             }
    //         });
    // };
    const handleStatusUpdateInAdmin = async (data, id) => {
        // where we can update the admin status //
        // where id = admin id //
        // where data = status //
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const upad = encryptGlobal(JSON.stringify(id));
        await axios
            .put(`${URL.updateMentorStatus + '/' + upad}`, data, axiosConfig)
            .then((user) => console.log(user))
            .catch((err) => {
                console.log('error', err);
            });
    };

    const handleStatus = (status, id, type, all) => {
        // where we can update the status Active to InActive //
        // where id = student id / mentor id  / admin id / evaluator  id//
        // where status = status //
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-submit',
                cancelButton: 'btn btn-cancel'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons
            .fire({
                title: "<h4>Are you sure?</h4>" ,
                text: `You are attempting to ${
                    status.toLowerCase() === 'active'
                        ? 'activate'
                        : 'inactivate'
                } ${
                    type && type === 'student'
                        ? 'Student'
                        : type && type === 'evaluator'
                        ? 'evaluator'
                        : type && type === 'admin'
                        ? 'Admin'
                        : 'Mentor'
                }.`,
                imageUrl: `${logout}`,
                confirmButtonText: status,
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                reverseButtons: false
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    if (type && type === 'student') {
                        props.studentStatusUpdate({ status }, id);
                        setTimeout(() => {
                            props.getStudentListAction(studentDist);
                        }, 500);
                    } else if (type && type === 'evaluator') {
                        console.warn(status, id, type);
                        dispatch(
                            updateEvaluator(
                                {
                                    status,
                                    full_name: all.user.full_name,
                                    username: all.user.username
                                },
                                id
                            )
                        );
                        setTimeout(() => {
                            props.getEvaluatorListAction();
                        }, 500);
                    } else if (type && type === 'admin') {
                        const obj = {
                            full_name: all.full_name,
                            username: all.username,
                            // mobile: all.mobile,
                            status
                        };
                        await handleStatusUpdateInAdmin({ obj }, id);

                        setTimeout(() => {
                            props.getAdminListAction();
                        }, 500);
                    } else {
                        const obj = {
                            full_name: all.full_name,
                            username: all.username,
                            // mobile: all.mobile,
                            status
                        };
                        props.mentorStatusUpdate(obj, id);
                        setTimeout(() => {
                            props.getAdminMentorsListAction('ALL', mentorDist);
                        }, 500);
                    }
                    swalWithBootstrapButtons.fire(
                        `${
                            type && type === 'student'
                                ? 'Student'
                                : type && type === 'evaluator'
                                ? 'evaluator'
                                : type && type === 'admin'
                                ? 'Admin'
                                : 'Mentor'
                        } Status has been changed!`,
                        'Successfully updated.',
                        'success'
                    );
                } 
            });
    };

 
    const StudentsData = {
        data: tableData && tableData.length > 0 ? tableData : [],
        columns: [
            {
                name: 'No',
                // selector: (row) => row.id,
                selector: (row, key) => key + 1,
                cellExport: (row) => row.index,
                width: '4rem'
            },
              {
                name: 'UDISE Code',
                selector: (row) => row?.
                mentor.organization.
                organization_code,
                cellExport: (row) => row?.mentor.
                organization.
                organization_code,
                width: '10rem'
            },

            {
                name: 'District',
                selector: (row) =>  row?.
                mentor.organization.district,
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                    >
                        {row?.
                mentor.organization.district}
                    </div>
                ),
                cellExport: (row) => row?.
                mentor.organization.district,
                width: '13rem'
            },
            {
                name: 'Team Name',
                selector: (row) => row?.team_name
                ,
                cellExport: (row) => row?.team_name
                ,
                width: '9rem'
            },
            {
                name: 'Students Count',
                selector: (row) => row.
                student_count
                ,
                cellExport: (row) => row.
                student_count
                ,
                width: '10rem'
            },
            {
                name: 'Mentor Name',
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                    >
                        {row.mentor
.full_name
                        }
                    </div>
                ),
                selector: (row) => row.mentor
                .full_name
                ,
                cellExport: (row) => row.mentor
                .full_name
                ,
                width: '10rem'
            },

            {
                name: 'Organization Name',
                selector: (row) =>row?.
                mentor.organization.organization_name,
                cellExport: (row) => row.mentor.organization.organization_name,
                width: '10rem'
            },
            // {
            //     name: 'Age',
            //     selector: (row) => row.Age,
            //     width: '4rem'
            // },

            // {
            //     name: 'Gender',
            //     selector: (row) => row.gender,
            //     width: '6rem'
            // },
            // {
            //     name: 'Email Id',
            //     selector: (row) => row.username,
            //     width: '10rem'
            // },

            // {
            //     name: 'Mobile No',
            //     selector: (row) => row.mobile,
            //     width: '8rem'
            // },
            // {
            //     name: 'Status',
            //     cell: (row) => [
            //         <Badge
            //             key={row.mentor_id}
            //             bg={`${
            //                 row.status === 'ACTIVE' ? 'secondary' : 'danger'
            //             }`}
            //         >
            //             {row.status}
            //         </Badge>
            //     ],
            //     width: '8rem'
            // },
            // {
                // name: 'Actions',
                // sortable: false,
                // width: '10rem',
                // cell: (record) => [
                    // <div
                    //     key={record.id}
                    //     // onClick={() => handleSelect(record, '1')}
                    //     style={{ marginRight: '10px' }}
                    // >
                    //     <div className="btn btn-primary  mr-5">View</div>
                    // </div>
                    // <div
                    //     key={record.id}
                    //     style={{ marginRight: '10px' }}
                    //     onClick={() => {
                    //         let status =
                    //             record?.status === 'ACTIVE'
                    //                 ? 'INACTIVE'
                    //                 : 'ACTIVE';
                    //         handleStatus(status, record?.student_id, 'student');
                    //     }}
                    // >
                    //     {record?.status === 'ACTIVE' ? (
                    //         <div className="btn btn-danger ">INACTIVE</div>
                    //     ) : (
                    //         <div className="btn btn-warning ">ACTIVE</div>
                    //     )}
                    // </div>
                // ]
            // }
        ]
    };
    const customStyles = {
        head: {
          style: {
            fontSize: "1em", // Adjust as needed
          },
        },
      };
    const showbutton =state ;
    return (
        <div className="page-wrapper">
        <div className="content">
            <Container className="ticket-page mb-50 userlist">
                <Row className="mt-0">
                    <h2>Teams List</h2>
                    <Container fluid className="px-0">
                                        <Row className="align-items-center">
                                            <Col md={2}>
                                                    <Select
                                                        list={updateStatesList}
                                                        setValue={setState}
                                                        placeHolder={
                                                            'State'
                                                        }
                                                        value={state}
                                                         className="form-select"
                                                    />
                                            </Col>
                                           
                                           
                                           
                                            <Col md={2}>
                                                <div className="text-center">
                                                    <Button
                                                        btnClass={
                                                            showbutton
                                                                ? 'primary'
                                                                : 'default'
                                                        }
                                                        size="small"
                                                        label="Search"
                                                        disabled={!showbutton}
                                                        onClick={() =>
                                                            handleclickcall()
                                                        }
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className="bg-white border card pt-3 mt-5">
                                        <DataTableExtensions
                                            print={false}
                                            export={false}
                                            {...StudentsData}
                                        >
                                            <DataTable
                                                // data={rows}
                                                data={tableData || []}
                                                defaultSortField="id"
                                    customStyles={customStyles}

                                                defaultSortAsc={false}
                                                pagination
                                                highlightOnHover
                                                fixedHeader
                                                subHeaderAlign={
                                                    Alignment.Center
                                                }
                                            />
                                        </DataTableExtensions>
                                    </div>
                                    </Container>
                </Row>
            </Container>
          
        </div>
        </div>
    );
};


export default TicketsPage;
