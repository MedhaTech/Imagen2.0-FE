/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import { useState } from 'react';
import React, { useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import DataTableExtensions from 'react-data-table-component-extensions';
import DataTable, { Alignment } from 'react-data-table-component';
import { getCurrentUser } from '../../helpers/Utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Icon from "react-feather";
const EmailList = () => {
    const navigate = useNavigate();
    const [emailList, setEmailList] = useState([]);
    const currentUser = getCurrentUser('current_user');

    useEffect(() => {
        fetchEmailList();
    }, []);
    async function fetchEmailList() {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/emails`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${currentUser?.data[0]?.token}`
                    }
                }
            );
            if (response.status === 200) {

                setEmailList(response?.data?.data[0]?.dataValues);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleEdit = (item) => {
        navigate('/resend-email');
        
    localStorage.setItem('resID', JSON.stringify(item));
};
    const emailData = {
        data: emailList || [],
        columns: [
            {
                name: 'No',
                selector: (row, key) => key + 1,
                sortable: true,
                width: '5rem'
            },
            {
                name:  'Email Subject',
                selector: (row) => row.subject,
                width: '20rem',
                sortable: true,
            },
            {
                name: 'Actions',
                center: true,
                width: '15rem',
                cell: (record) => [
                    <>
                        <div
                            key={record}
                            onClick={() => handleEdit(record)}
                           
                            style={{ marginRight: '8px' }}
                        >
                            <a className="badge badge-md bg-info">
                              
                                <Icon.Send size={15}/>  RESEND
                            </a>
                        </div>
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
                <Container className="ticket-page mb-50">
                    <Row>
                        <Row className="mb-2 mb-sm-5 mb-md-5 mb-lg-0">
                            <div className="page-header">
                                <div className="add-item d-flex">
                                    <div className="page-title">
                                        <h4>Bulk Email List</h4>
                                        <h6>Send Emails to Registered Students Based on Districts</h6>
                                    </div>
                                </div>
                                <div className="page-btn">
                                    <button
                                        type="button"
                                        className="btn btn-info"
                                        onClick={() => navigate('/create-email')}
                                    >
                                        <Icon.Mail className="me-2" style={{ color: "white" }} /><b>COMPOSE</b>
                                    </button>
                                </div>
                            </div>


                            <div className="my-2">
                                <DataTableExtensions
                                    print={false}
                                    export={false}
                                    {...emailData}
                                    exportHeaders
                                >
                                    <DataTable
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

            </div>
        </div>
    );
};

export default EmailList;
