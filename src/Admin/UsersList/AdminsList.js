/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'reactstrap';

import axios from 'axios';
import { URL, KEY } from '../../constants/defaultValues.js';
import { AlertOctagon,PlusCircle, Check} from 'feather-icons-react/build/IconComponents';
import { getNormalHeaders } from '../../helpers/Utils';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import logout from '../../assets/img/logout.png';
import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import AddADmins from './AddAdmin';


import { useDispatch } from 'react-redux';
import { encryptGlobal } from '../../constants/encryptDecrypt.js';
import { stateList } from '../../RegPage/ORGData.js';
import { MaskedEmail } from '../../RegPage/MaskedData.js';

const TicketsPage = (props) => {
    const dispatch = useDispatch();
    const [tableData, settableData] = React.useState([]);
    const [showspin, setshowspin] = React.useState(false);

    const district = localStorage.getItem('dist');
   


    const [studentDist, setstudentDist] = useState(district ? district : '');
    const [mentorDist, setmentorDist] = useState('');
    const [registerModalShow, setRegisterModalShow] = useState(false);

  useEffect(()=>{
    handleideaList();
  },[]);
  
  
    async function handleideaList() {
        // handleideaList api //
        //where we can see all ideas in districtwise //
        settableData([]);
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
       
        const resparam = encryptGlobal(
            JSON.stringify({
                // status: "ALL",
                // state: state ,
                // year_of_study:applicant,
                // group:institution,
                // Gender:gender,
                // district: district !== 'All Districts' ? district : ''
                // protoType: protoType,
                // sdg: sdg !== 'All Themes' ? sdg : ''
            })
        );
        await axios
        .get(`${URL.getAdmin}?Data=${resparam}`, axiosConfig)
            .then(function (response) {
                if (response.status === 200) {
                    const updatedWithKey =
                        response.data &&
                        response.data.data.
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
  
   
    const handleStatusUpdateInAdmin = async (data, id) => {

        // where we can update the admin status //
        // where id = admin id //
        // where data = status //
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const upad = encryptGlobal(JSON.stringify(id));
        await axios
            .put(`${URL.updateAdminStatus + '/' + upad}`, data, axiosConfig)
            .then((user) => console.log(user))
            .catch((err) => {
                console.log('error', err);
            });
    };

    const handleStatus = (status, id, type, all) => {
        const stats= all.user.role === "ADMIN" ?"Admin" :"Eadmin";
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
                        ? 'Activate'
                        : 'Inactivate'
                } ${
                   stats
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
                            full_name: all.user.full_name,
                            username: all.user.username,
                            status
                        };
                        await handleStatusUpdateInAdmin( obj , id);

                        setTimeout(() => {
                            handleideaList();
                        }, 500);
                    } else {
                        const obj = {
                            full_name: all.full_name,
                            username: all.username,
                            status
                        };
                        props.mentorStatusUpdate(obj, id);
                        setTimeout(() => {
                            props.getAdminMentorsListAction('ALL', mentorDist);
                        }, 500);
                    }
                    swalWithBootstrapButtons.fire(
                        `${
                           stats
                        } Status has been changed!`,
                        'Successfully Updated.',
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
                selector: (row, key) => key + 1,
                sortable: true,
                center:true,
                cellExport: (row) => row.index,
                width: '5rem'
            },
            {
                name: 'Admin Name',
                selector: (row) => row?.user?.full_name,
                center:true,
                cellExport: (row) => row?.user?.full_name,
                sortable: true,
                width: '13rem'
            },
            {
                name: 'Email & Password',
                center:true,

                selector: (row) =><MaskedEmail email={row?.user?.username} />,
                cellExport: (row) => row?.user?.username,
                sortable: true,
                width: '14rem'
            },
            {
                name: 'Role',
                center:true,
                selector: (row) => row?.user?.role,
                sortable: true,
                width: '10rem',
                cell: (params) => [
                    params.user.role === 'ADMIN' ? (
                        <span className="badge rounded-pill bg-outline-primary">
                            Admin
                        </span>
                    ) : params.user.role === 'EADMIN' ? (
                        <span className="badge rounded-pill bg-outline-secondary">
                            E-Admin
                        </span>
                    ) : params.user.role === 'STUDENT' ? (
                        <span className="badge rounded-pill bg-outline-primary">
                            Student
                        </span>
                    ) : (
                        ''
                    )
                ]
            },
            {
                name: 'Status',
                center:true,
                sortable: true,
                cell: (row) => [
                    <span key={row.mentor_id} className={`${
                        row.status === 'ACTIVE' ? "badge bg-success" : "badge bg-danger"
                    }`}>{row.status}</span>
                   
                ],
                width: '8rem'
            },
            {
                name: 'Actions',
                center:true,
                sortable: false,
                width: '13rem',
                // left:true,
                cell: (record) => [
                    <div
                        key={record?.id}
                    ></div>,
                    <>
                    <div
                        key={record.id}
                        style={{ marginRight: '10px' }}
                        onClick={() => {
                            let status = record?.status === 'ACTIVE'
                                ? 'INACTIVE'
                                : 'ACTIVE';
                            handleStatus(
                                status,
                                record?.admin_id,
                                'admin',
                                record
                            );
                        } }
                    >
                        {record?.status === 'ACTIVE' ? (
                            <button
                            className="btn btn-light"
                        > Inactivate<AlertOctagon className="ms-1"  style={{ height: 15, width: 15 }}/>    
                        </button>
                        ) : (
                            <button
                                className="btn btn-success"
                            >
                                Activate<Check className="ms-1"  style={{ height: 15, width: 15 }}/>
                            </button>
                        )}
                    </div>
                        </>
                ]
            }
        ]
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
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4>Admins List</h4>
                            <h6>Create an Admin, Eadmin Users here</h6>
                        </div>
                    </div>
                    <div className="page-btn">
                        <button
                            type="button"
                            className="btn btn-info"
                            onClick={() =>
                                setRegisterModalShow(true)
                            }
                        >
                            <PlusCircle className="me-2" style={{color:"white"}} /><b>Add New Admin</b>
                        </button>
                    </div>
                </div>
            <Container className="ticket-page mb-50 userlist">
                <Row >
                    <Container fluid >
                                        <div className="card pt-3 mt-2">
                                        <DataTableExtensions
                                            print={false}
                                            export={false}
                                            {...StudentsData}
                                        >
                                            <DataTable
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
                                    {registerModalShow &&
                
                    <AddADmins
                        show={registerModalShow}
                        setShow={setRegisterModalShow}
                        onHide={() => setRegisterModalShow(false)}
                    />
              }
                </Row>
            </Container>
          
        </div>
        </div>
    );
};


export default TicketsPage;
