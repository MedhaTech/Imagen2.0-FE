/* eslint-disable indent */
import { useState } from 'react';
import React, { useEffect } from 'react';
import { Container, Row } from 'reactstrap';
import DataTableExtensions from 'react-data-table-component-extensions';
import DataTable, { Alignment } from 'react-data-table-component';
import { getCurrentUser } from '../../helpers/Utils';
import axios from 'axios';
import { openNotificationWithIcon } from '../../helpers/Utils';
import 'sweetalert2/src/sweetalert2.scss';
import { encryptGlobal } from '../../constants/encryptDecrypt';
import { CheckCircle } from 'react-feather';
import { IoHelpOutline } from 'react-icons/io5';
const StuscheduleCall = () => {
    const [callList, setCallList] = useState([]);
    const currentUser = getCurrentUser('current_user');
    useEffect(() => {
        handleResList();
    }, []);
    async function handleResList() {
        //  handleResList Api where we can see list of all resource //
        const query = encryptGlobal(JSON.stringify({
            challenge_response_id: localStorage.getItem("CID")
        }));
        let config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + `/schedule_calls?Data=${query}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };
        await axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setCallList(response.data && response.data.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const handleaccept = async (id, of) => {
        const param = encryptGlobal(JSON.stringify(id));
        let config = {
            method: 'put',
            url: process.env.REACT_APP_API_BASE_URL + `/schedule_calls/${param}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            },
            data: {
                stu_accept: of
            }

        };
        await axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    if (of === '1') {
                        openNotificationWithIcon(
                            "success",
                            "Meeting Accepted"
                        );
                    }
                    if (of === '0') {
                        openNotificationWithIcon(
                            "success",
                            "Meeting Declined"
                        );
                    }

                    handleResList();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const callsData = {
        data: callList && callList.length > 0 ? callList : [],
        columns: [
            {
                name: 'No',
                selector: (row, key) => key + 1,
                sortable: true,
                width: '5rem'
            },
            {
                name: 'Meeting link',
                selector: (row) => {
                    return (<a style={{ cursor: 'pointer', color: 'blue' }} href={row.meet_link} target='_blank' rel="noreferrer">{row.meet_link}</a>);
                },
                width: '30rem'
            },
            {
                name: 'Date & Time',
                selector: (row) => {
                    const date = new Date(row.timing);
                    const formattedDate = new Intl.DateTimeFormat('en-IN', {
                        dateStyle: 'full',
                        timeStyle: 'medium',
                        timeZone: 'Asia/Kolkata',
                    }).format(date);
                    return formattedDate;
                },
                width: '20rem'
            },
            {
                name: 'Acceptance',
                selector: (row) => {
                    return (
                        row.stu_accept == 1 ? <CheckCircle size={20} color="#28C76F" />
                            :
                            <IoHelpOutline size={20} color="#FF0000" />
                    );
                },
                width: '8em'
            },
            {
                name: 'Actions',
                left: true,
                width: '10rem',
                cell: (row) => [
                    <>
                        {row.stu_accept === '0' ? <button
                            className="btn btn-success btn-sm mx-3"
                            onClick={() => handleaccept(row.schedule_call_id, '1')}
                        >
                            Accept
                        </button> : <button
                            className="btn btn-danger btn-sm mx-3"
                            onClick={() => handleaccept(row.schedule_call_id, '0')}
                        >
                            Decline
                        </button>}

                    </>
                ]
            }
        ]
    };
    const customStyles = {
        rows: {
            style: {
                fontSize: "14px",
            },
        },
        headCells: {
            style: {
                fontSize: "16px",
            },
        },
        cells: {
            style: {
                fontSize: "14px",
            },
        },
    };
    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4>Schedule Calls</h4>
                        </div>
                    </div>
                </div>
                <Container className="ticket-page mb-50">
                    <Row>
                        <div className="my-2">
                            <DataTableExtensions
                                print={false}
                                export={false}
                                {...callsData}
                                exportHeaders
                            >
                                <DataTable
                                    data={callList}
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
                </Container>
            </div>
        </div>
    );
};

export default StuscheduleCall;
