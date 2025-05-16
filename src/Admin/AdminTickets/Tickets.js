/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { Container, Row } from 'reactstrap';
import { Tabs } from 'antd';
import { getCurrentUser } from '../../helpers/Utils';
import axios from 'axios';
import { FaComments } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { encryptGlobal } from '../../constants/encryptDecrypt';
import { useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';

const AdminSupport = () => {
    const currentUser = getCurrentUser('current_user');
    const [allTicketResponse, setAllTicketResponse] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [pending, setPending] = React.useState(true);
    const [rows, setRows] = React.useState([]);
    const [fetchData, setFetchData] = useState(false);
    useEffect(() => {
         openListApi();
    }, []);

    async function listApi() {
        // where we can see all tickets //
        setFetchData(true);
       
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/supportTickets`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };
        await axios(config)
            .then(function (response) {
                if (response.status === 200) {
                   
                    setAllTicketResponse(
                        response.data.data[0] &&
                            response.data.data[0].dataValues
                    );
                    setFetchData(false);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    async function openListApi() {
        setFetchData(true);
        const openParam = encryptGlobal(
            JSON.stringify({
                status: 'OPEN',
            })
        );
        // where we can see all open tickets //
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/supportTickets?Data=${openParam}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };
        await axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setAllTicketResponse(
                        response.data.data[0] &&
                            response.data.data[0].dataValues
                    );
                    setFetchData(false);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    async function inProgressApi() {
        setFetchData(true);
        const inProgressParam = encryptGlobal(
            JSON.stringify({
                status: 'INPROGRESS',
            })
        );
        // where  we can see  all inprogress tickets //
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/supportTickets?Data=${inProgressParam}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };
        await axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setAllTicketResponse(
                        response.data.data[0] &&
                            response.data.data[0].dataValues
                    );
                    setFetchData(false);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    async function resolvedApi() {
        setFetchData(true);
        // where we ca see all resolved tickets //
        const resolvedParam = encryptGlobal(
            JSON.stringify({
                status: 'RESOLVED',
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/supportTickets?Data=${resolvedParam}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };
        await axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setAllTicketResponse(
                        response.data.data[0] &&
                            response.data.data[0].dataValues
                    );
                    setFetchData(false);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    async function invalidApi() {
        // where we can see all invalid tickets //
        const invalidParam = encryptGlobal(
            JSON.stringify({
                status: 'INVALID',
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/supportTickets?Data=${invalidParam}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };
        await axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setAllTicketResponse(
                        response.data.data[0] &&
                            response.data.data[0].dataValues
                    );
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const allData = {
        data: allTicketResponse,
        columns: [
            {
                name: 'No',
                selector: (row, key) => key + 1,
                cellExport: (row) => row.index,
                width: '4rem'
            },
           
            {
                name: 'District',
                selector: (row) => row.district,
                cellExport: (row) => row.district,
                sortable: true,
                width: '15rem'
            },
            {
                name: 'Created By',
                selector: (row) => row.created_by,
                cellExport: (row) => row.created_by,
                sortable: true,
                width: '15rem'
            },

            {
                name: 'Type',
                selector: (row) => row.query_category,
                cellExport: (row) => row.query_category,
                sortable: true,
                width: '10rem'
            },
            {
                name: ' Query Details',
                selector: (row) => row.query_details,
                cellExport: (row) => row.query_details,

                width: '20rem',
                cell: (params) => [
                    <Link
                        key={params.support_ticket_id}
                        to={`/admin/support-journey/ans-ticket?id=${params.support_ticket_id}`}
                    >
                        {params?.query_details} <FaComments />{' '}
                        {params.replies_count}{' '}
                    </Link>
                ]
            },

            {
                name: 'Status',
                selector: (row) => row.status,
                cellExport: (row) => row.status,

                width: '8rem',
                cell: (params) => [
                    params?.status === 'OPEN' ? (
                        <span className="badge bg-warning">
                            Open
                        </span>
                    ) : params?.status === 'INPROGRESS' ? (
                        <span className="badge bg-info">
                            Inprogress
                        </span>
                    ) : params?.status === 'RESOLVED' ? (
                        <span className="badge bg-success">
                            Resolved
                        </span>
                    ) : params?.status === 'INVALID' ? (
                        <span className="badge bg-danger">
                            Invalid
                        </span>
                    ) : (
                        ''
                    )
                ]
            }
        ]
    };

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(allData.data);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);
    const changeTab = async (e) => {
       
        if (e === '1') {
            await openListApi();
        } else if (e === '2') {
            await inProgressApi();
        } else if (e === '3') {
            await resolvedApi();
        } else if (e === '4') {
            await invalidApi();
        } else {
            await listApi();
        }
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
            <div className="card">
            <div className="card-header d-flex align-items-center flex-wrap justify-content-between">
                    <div className="card-title">Support Queries</div>
                    <div>
                        <ul
                            className="nav nav-pills justify-content-end nav-style-2"
                            role="tablist"
                        
                        >
                            <li className="nav-item" onClick={(key) => changeTab("1")}>
                                <Link
                                    className="nav-link active"
                                    data-bs-toggle="tab"
                                    role="tab"
                                    aria-current="page"
                                    to="#home-center"
                                    aria-selected="true"
                                    
                                >
                                    Open
                                </Link>
                            </li>
                            <li className="nav-item" onClick={(key) => changeTab("2")}>
                                <Link
                                    className="nav-link"
                                    data-bs-toggle="tab"
                                    role="tab"
                                    aria-current="page"
                                    to="#about-center"
                                    aria-selected="false"
                                    key = "2"
                                >
                                    InProgress
                                </Link>
                            </li>
                            <li className="nav-item" onClick={(key) => changeTab("3")}>
                                <Link
                                    className="nav-link"
                                    data-bs-toggle="tab"
                                    role="tab"
                                    aria-current="page"
                                    to="#services-center"
                                    aria-selected="false"
                                >
                                    Resolved
                                </Link>
                            </li>
                            <li className="nav-item" onClick={(key) => changeTab("4")}>
                                <Link
                                    className="nav-link"
                                    data-bs-toggle="tab"
                                    role="tab"
                                    aria-current="page"
                                    to="#contacts-center"
                                    aria-selected="false"
                                >
                                    Invalid
                                </Link>
                            </li>
                            <li className="nav-item" onClick={(key) => changeTab("5")}>
                                <Link
                                    className="nav-link"
                                    data-bs-toggle="tab"
                                    role="tab"
                                    aria-current="page"
                                    to="#invalid-center"
                                    aria-selected="false"
                                >
                                    All Tickets
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="card-body">
                    <div className="tab-content">
                        <div
                            className="tab-pane show active text-muted"
                            id="home-center"
                            role="tabpanel"
                        >
                            {fetchData ? (
                                    <ClipLoader

                                        color={'blue'}
                                        size={20}
                                    />
                                ) : (
                                    <div className="my-2">
                                        <DataTableExtensions
                                            print={false}
                                            export={false}
                                            {...allData}
                                            exportHeaders
                                        >
                                            <DataTable
                                                data={rows}
                                                customStyles={customStyles}
                                                defaultSortField="1"
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
                                )}
                        </div>
                        <div
                            className="tab-pane text-muted"
                            id="about-center"
                            role="tabpanel"
                        >
                            {fetchData ? (
                                    <ClipLoader
                                        color={'blue'}
                                        size={20}
                                    />
                                ) : (
                                    <div className="my-2">
                                        <DataTableExtensions
                                            print={false}
                                            export={false}
                                            {...allData}
                                            exportHeaders
                                        >
                                            <DataTable
                                                data={rows}
                                                customStyles={customStyles}
                                                defaultSortField="2"
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
                                )}
                        </div>
                        <div
                            className="tab-pane text-muted"
                            id="services-center"
                            role="tabpanel"
                        >
                            {fetchData ? (
                                    <ClipLoader
                                        color={'blue'}
                                        size={20}
                                    />
                                ) : (
                                    <div className="my-2">
                                        <DataTableExtensions
                                            print={false}
                                            export={false}
                                            {...allData}
                                            exportHeaders
                                        >
                                            <DataTable
                                                data={rows}
                                                customStyles={customStyles}
                                                defaultSortField="3"
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
                                )}
                        </div>
                        <div
                            className="tab-pane text-muted"
                            id="contacts-center"
                            role="tabpanel"
                        >
                           {fetchData ? (
                                    <ClipLoader
                                        color={'blue'}
                                        size={20}
                                    />
                                ) : (
                                    <div className="my-2">
                                        <DataTableExtensions
                                            print={false}
                                            export={false}
                                            {...allData}
                                            exportHeaders
                                        >
                                            <DataTable
                                                data={rows}
                                                defaultSortField="4"
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
                                )}
                        </div>
                        <div
                            className="tab-pane text-muted"
                            id="invalid-center"
                            role="tabpanel"
                        >
                           {fetchData ? (
                                    <ClipLoader
                                        color={'blue'}
                                        size={20}
                                    />
                                ) : (
                                    <div className="my-2">
                                        <DataTableExtensions
                                            print={false}
                                            export={false}
                                            {...allData}
                                            exportHeaders
                                        >
                                            <DataTable
                                                data={rows}
                                                defaultSortField="5"
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
                                )}
                        </div>
                    </div>
                </div>
            </div>



            </div>
            </div>
    );
};

export default AdminSupport;
