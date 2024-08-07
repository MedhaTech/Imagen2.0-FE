/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import { useState } from 'react';
import React, { useEffect } from 'react';
// import Layout from '../Layout';
import { Container, Row, Col } from 'reactstrap';
import DataTableExtensions from 'react-data-table-component-extensions';
import DataTable, { Alignment } from 'react-data-table-component';
import { getCurrentUser } from '../../helpers/Utils';
import axios from 'axios';
// import { Link } from 'react-router-dom';
import { openNotificationWithIcon } from '../../helpers/Utils';
// import { Button } from '../../stories/Button';
import { useNavigate } from 'react-router-dom';
// import { ReactDOM } from 'react-dom';
// import * as ReactDOM from 'react-dom';
import Swal from 'sweetalert2/dist/sweetalert2';
import logout from '../../assets/img/logout.svg';
import { encryptGlobal } from '../../constants/encryptDecrypt';
import 'sweetalert2/src/sweetalert2.scss';
const AdminResources = () => {
    const navigate = useNavigate();
    const [resList, setResList] = useState([]);
    const [tecList, setTecList] = useState([]);
    // const [reqList, setReqList] = useState(false);

    const currentUser = getCurrentUser('current_user');

    useEffect(() => {
        fetchTecResourceList();
    }, []);
    async function fetchTecResourceList() {
        // const fectchTecParam = encryptGlobal(
        //     JSON.stringify({
        //         role: 'mentor'
        //     })
        // );
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/popup`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${currentUser?.data[0]?.token}`
                    }
                }
            );
            if (response.status === 200) {
                // console.log(response,"11");
                setTecList(response.data?.data);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const teacherData = {
        data: tecList || [],

        columns: [
            {
                name: 'No',
                selector: (row, key) => key + 1,
                sortable: true,
                width: '5rem'
            },
            {
                name: 'State',
                selector: (row) => row.
                state,
                width: '9rem'
                // center: true,
            },
            {
                name: 'Role',
                selector: (row) => row.role,
                width: '7rem'
                // center: true,
            },
            {
                name: 'Path',
                selector: (row) => row.navigate,
                width: '10rem'
            },
            {
                name: 'Enable/Disable',
                width: '9rem',
                cell: (record) => {
                    
                    if (record.on_off === '1') {
                        return (
                            <button
                                className="btn btn-danger"
                                onClick={() => {
                                    handleStatus(record
                                        , '0');
                                }}
                            >
                                Disable
                            </button>
                        );
                    } else if (record.on_off === '0') {
                        return (
                            <button
                                className="btn btn-success"
                                onClick={() => {
                                    handleStatus(record
                                        , '1');
                                }}
                            >
                                Enable
                            </button>
                        );
                    }
                }
            },
            // {
            //     name: 'Type',
            //     selector: 'type',
            //     width: '25%'
            // },
            {
                name: 'File/Link',
                width: '8rem',
                cell: (record) => {
                    if (record.type === 'file') {
                        return (
                            <button className="btn btn-warning">
                                <a
                                    href={record.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'black' }}
                                >
                                    Navigate
                                </a>
                            </button>
                        );
                    } else if (record.type === 'link') {
                        return (
                            <button className="btn btn-warning">
                                <a
                                    href={record.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'black' }}
                                >
                                    Navigate
                                </a>
                            </button>
                        );
                    }
                    return null;
                }
            },
            {
                name: 'Actions',
                center: true,
                width: '15rem',
                cell: (record) => [
                    <>
                        {/* <div
                            key={record}
                            onClick={() => handleEdit(record)}
                            style={{ marginRight: '12px' }}
                        >
                            <div className="btn btn-info">
                                Edit
                            </div>
                        </div> */}

                        <div
                            key={record}
                            onClick={() => handleTecherDelete(record)}
                            style={{ marginRight: '12px' }}
                        >
                            <div className="btn btn-danger">
                                Delete
                            </div>
                        </div>
                    </>
                ]
            }
        ]
    };
    const handleTecherDelete = (items) => {
        // here we can delete the team //
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons
            .fire({
                title: 'Are you sure you want to delete this PopUp ?',
                text: 'Are you sure?',
                imageUrl: `${logout}`,
                showCloseButton: true,
                confirmButtonText: 'Delete',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                reverseButtons: false
            })
            .then((result) => {
                if (result.isConfirmed) {
                    const resId = encryptGlobal(
                        JSON.stringify(items.popup_id)
                    );
                    var config = {
                        method: 'delete',
                        url:
                            process.env.REACT_APP_API_BASE_URL +
                            '/popup/' +
                            resId,
                        headers: {
                            'Content-Type': 'application/json',
                            // Accept: "application/json",
                            Authorization: `Bearer ${currentUser?.data[0]?.token}`
                        }
                    };
                    axios(config)
                        .then(function (response) {
                            if (response.status === 200) {
                                openNotificationWithIcon(
                                    'success',
                                    'PopUp Deleted Successfully'
                                );
                                setTimeout(()=>{

                                    fetchTecResourceList();
                                },500);
                            } else {
                                openNotificationWithIcon(
                                    'error',
                                    'Opps! Something Wrong'
                                );
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire(
                        'Cancelled',
                        'PopUp not Deleted',
                        'error'
                    );
                }
            });
    };
   
    async function handleStatus(item, value) {
        // alert("hii");
        const body = {
            role: item.role,
            type: item.type,
            url: item.url,
            state:item.state,
            on_off: value
        };
        if (
            item.navigate !== item.navigate
            ) {
                body['navigate'] = item.navigate;
            }
        const popParam = encryptGlobal(JSON.stringify(item.
            popup_id
            ));
        
        let config = {
            method: 'put',
            url: process.env.REACT_APP_API_BASE_URL + `/popup/${popParam}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            },
            data:JSON.stringify(body)
        };
        await axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    if (value === '0') {
                        openNotificationWithIcon(
                            'success',
                            'PopUp Disabled successfully'
                        );
                    } else if (value === '1') {
                        openNotificationWithIcon(
                            'success',
                            'PopUp Enabled successfully'
                        );
                    }
                    // openNotificationWithIcon(
                    //     'success',
                    //     item.on_off === '1' && id === 1
                    //         ? 'PopUp successfully Enabled'
                    //         : item.on_off === '0' && id === 1
                    //         ? 'PopUp successfully Disabled'
                    //         : item.on_off === '1' && id === 2
                    //         ? 'Idea Submission successfully Enabled'
                    //         : item.on_off === '0' && id === 2
                    //         ? 'Idea Submission successfully Disabled'
                    //         : 'Popup Image upload successfull'
                    // );
                    setTimeout(()=>{

                        fetchTecResourceList();
                    },500);
                    // setshowspin(false);
                }
            })
            .catch(function (error) {
                console.log(error);
                // setshowspin(false);
            });
    }
    // useEffect(() => {
    //     fetchResourceList();
    // }, []);
    const handleBack = (e) => {
        // here we can go back to main page //
        // setReqList(false);
    };
    const handleStudentList = async (e) => {
        // alert('hii');
        // here we can see  list of inActive institutions //
        // await fetchResourceList();
    };
    // const fetchResourceList = () => {
    //     try {
    //         const response = axios.get(
    //             `${process.env.REACT_APP_API_BASE_URL}/resource/list?role=student`,
    //             {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     Authorization: `Bearer ${currentUser?.data[0]?.token}`
    //                 }
    //             }
    //         );
    //         if (response.status === 200) {
    //             setResList(response.data?.data);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // const fetchResourceList = () => {
    //     const fectchParam = encryptGlobal(
    //         JSON.stringify({
    //             role: 'student'
    //         })
    //     );
    //     var config = {
    //         method: 'get',
    //         url:
    //             process.env.REACT_APP_API_BASE_URL +
    //             `/resource/list?Data=${fectchParam}`,
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Accept: 'application/json',
    //             Authorization: `Bearer ${currentUser.data[0]?.token}`
    //         }
    //     };
    //     axios(config)
    //         .then(function (response) {
    //             if (response.status === 200) {
    //                 setResList(response.data?.data);
    //                 setReqList(true);
    //             }
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // };
    // const resData = {
    //     data: resList || [],
    //     columns: [
    //         {
    //             name: 'No',
    //             selector: (row, key) => key + 1,
    //             sortable: true,
    //             width: '10rem'
    //         },
    //         {
    //             name: 'Role',
    //             selector: (row) => row.role,
    //             width: '15rem'
    //             // center: true,
    //         },
    //         {
    //             name: 'Details',
    //             selector: (row) => row.description,
    //             width: '40rem'
    //         },
    //         // {
    //         //     name: 'Type',
    //         //     selector: 'type',
    //         //     width: '25%'
    //         // },
    //         {
    //             name: 'File/Link',
    //             width: '10rem',
    //             cell: (record) => {
    //                 if (record.type === 'file') {
    //                     return (
    //                         <button className="btn btn-warning  mx-2">
    //                             <a
    //                                 href={record.attachments}
    //                                 target="_blank"
    //                                 rel="noopener noreferrer"
    //                                 style={{ color: 'black' }}
    //                             >
    //                                 Navigate
    //                             </a>
    //                         </button>
    //                     );
    //                 } else if (record.type === 'link') {
    //                     return (
    //                         <button className="btn btn-warning  mx-2">
    //                             <a
    //                                 href={record.attachments}
    //                                 target="_blank"
    //                                 rel="noopener noreferrer"
    //                                 style={{ color: 'black' }}
    //                             >
    //                                 Navigate
    //                             </a>
    //                         </button>
    //                     );
    //                 }
    //                 return null;
    //             }
    //         },
    //         {
    //             name: 'Actions',
    //             center: true,
    //             width: '25rem',
    //             cell: (record) => [
    //                 <>
    //                     <div
    //                         key={record}
    //                         onClick={() => handleEdit(record)}
    //                         style={{ marginRight: '12px' }}
    //                     >
    //                         <div className="btn btn-primary btn-lg mx-2">
    //                             EDIT
    //                         </div>
    //                     </div>

    //                     <div
    //                         key={record}
    //                         onClick={() => handleDelete(record)}
    //                         style={{ marginRight: '12px' }}
    //                     >
    //                         <div className="btn btn-primary btn-lg mx-2">
    //                             DELETE
    //                         </div>
    //                     </div>
    //                 </>
    //             ]
    //         }
    //     ]
    // };
    const handleEdit = (item) => {
        // where we can edit level name, no of evaluation //
        history.push({
            pathname: '/admin/Resources/editResource'
        });
        localStorage.setItem('resID', JSON.stringify(item));
    };

    const handleDelete = (item) => {
        // here we can delete the team //
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons
            .fire({
                title: 'Are you sure you want to delete this Resource ?',
                text: 'Are you sure?',
                imageUrl: `${logout}`,
                showCloseButton: true,
                confirmButtonText: 'Delete',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                reverseButtons: false
            })
            .then((result) => {
                if (result.isConfirmed) {
                    const delParam = encryptGlobal(
                        JSON.stringify(item.resource_id)
                    );
                    var config = {
                        method: 'delete',
                        url:
                            process.env.REACT_APP_API_BASE_URL +
                            '/resource/' +
                            delParam,
                        headers: {
                            'Content-Type': 'application/json',
                            // Accept: "application/json",
                            Authorization: `Bearer ${currentUser?.data[0]?.token}`
                        }
                    };
                    axios(config)
                        .then(function (response) {
                            if (response.status === 200) {
                                openNotificationWithIcon(
                                    'success',
                                    'Resource Deleted Successfully'
                                );
                                // fetchResourceList();
                            } else {
                                openNotificationWithIcon(
                                    'error',
                                    'Opps! Something Wrong'
                                );
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire(
                        'Cancelled',
                        'Team not Deleted',
                        'error'
                    );
                }
            });
    };
    const customStyles = {
        head: {
          style: {
            fontSize: "1em", // Adjust as needed
          },
        },
      };
    return (
        <div className="page-wrapper">
        <div className="content">
            <Container className="ticket-page mb-50">
                <Row>
                    <Row className="mb-2 mb-sm-5 mb-md-5 mb-lg-0">
                        <Col className="col-auto">
                          <h3> PopUp List </h3>
                        </Col>
                        <Col className="ml-auto text-right">
                           
                                    <button
                                        className='btn btn-info'
                                        onClick={() =>
                                        navigate(
                                                '/create-popup'
                                            )
                                        }
                                    >Create-PopUp</button>
                        </Col>
                       
                            <div className="my-2">
                                <DataTableExtensions
                                    print={false}
                                    export={false}
                                    {...teacherData}
                                    exportHeaders
                                >
                                    <DataTable
                                        // data={setResList}
                                        // noHeader
                                        defaultSortField="id"
                                    customStyles={customStyles}

                                        defaultSortAsc={false}
                                        pagination
                                        highlightOnHover
                                        fixedHeader
                                        subHeaderAlign={Alignment.Center}
                                    />
                                </DataTableExtensions>
                            </div>
                    </Row>
                </Row>
            </Container>
            {/* <h1>hi</h1> */}
        </div>
        </div>
    );
};

export default AdminResources;