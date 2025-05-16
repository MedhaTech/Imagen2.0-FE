/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';

import { BsUpload } from 'react-icons/bs';
import { Button } from '../../../stories/Button';
import { connect } from 'react-redux';
import { getAdminEvalutorsList } from '../../../redux/actions';
import { AlertOctagon,PlusCircle, Check} from 'feather-icons-react/build/IconComponents';


import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import logout from '../../../assets/img/logout.svg';
import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

import { updateEvaluator } from '../../../redux/actions';
import { useDispatch } from 'react-redux';
import Register from '../../../Evaluator/Register';
import { MaskedEmail ,MaskedMobile} from '../../../RegPage/MaskedData.js';

const TicketsPage = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

   
    const [registerModalShow, setRegisterModalShow] = useState(false);
   
    useEffect(() => {
        props.getEvaluatorListAction();
    }, []);

  
    const handleEdit = (item) => {
        navigate("/edit-evaluator", {
            state:item});
        localStorage.setItem('mentor', JSON.stringify(item));
    };

    const handleStatus = (status, id, type, all, item) => {
        // where we can update the status Active to InActive //
        // where id = student id / mentor id  / admin id / evaluator  id//
        // where status = status //
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons
            .fire({
                title: `You are attempting to ${
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
                text: 'Are you sure?',
                imageUrl: `${logout}`,
                showCloseButton: true,
                confirmButtonText: status,
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                reverseButtons: false
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    if (type && type === 'evaluator') {
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

                   
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire(
                        'Cancelled',
                        'Not updated successfully',
                        'error'
                    );
                }
            });
    };
    const handleDic = (item) => {
        // where we can select district //
        // where item = district //
        navigate("/evaluator/selecting-states");
       
        localStorage.setItem('eavlId', JSON.stringify(item));
    };
    const evaluatorsData = {
        data: props.evalutorsList,
        columns: [
            {
                name: 'No',
                selector: (row) => row.id,
                cellExport: (row) => row.index,
                width: '6rem'
            },
            {
                name: 'Evaluator Name',
                selector: (row) => row.user.full_name,
                cellExport: (row) => row.user.full_name,
                width: '12rem'
            },
            {
                name: 'Email Id',
                selector: (row) =><MaskedEmail email={row?.user?.username} />,
                cellExport: (row) => row.user.username,
                width: '14rem'
            },
            {
                name: 'Mobile No & Pwd',
                selector: (row) =>  <MaskedMobile mobile={row?.mobile} />,
                cellExport: (row) => row.mobile,
                width: '10rem'
            },
            {
                name: 'Districts',
                selector: (row) => row.district,
                cellExport: (row) => row.district,
                omit: true,
                width: '11rem'
            },
            {
                name: 'Status',
                cellExport: (row) => row.status,
                cell: (row) => [
                   
                    <span key={row.evaluator_id} className={`${
                        row.status === 'ACTIVE' ? "badge bg-success" : "badge bg-danger"
                    }`}>{row.status}</span>
                ],
                width: '7rem'
            },
            {
                name: 'Actions',
                sortable: false,
                center: true,
                width: '25rem',
                cellExport: (row) => {},
                cell: (record) => [
                  
                    <div
                    key={record.id}
                    onClick={() => {
                        let status =
                            record?.status === 'ACTIVE'
                                ? 'INACTIVE'
                                : 'ACTIVE';
                        handleStatus(
                            status,
                            record?.evaluator_id,
                            'evaluator',
                            record
                        );
                    }}
                >
                    {record?.status === 'ACTIVE' ? (
                        <div  className="btn btn-light m-2">
                            Inactive&nbsp;<AlertOctagon style={{ height: 15, width: 15 }}/>
                        </div>
                    ) : (
                        <div className="btn btn-success m-2">
                            Active&nbsp;<Check className="m-1"  style={{ height: 15, width: 15 }}/>
                        </div>
                    )}
                </div>,
                    <div
                        key={record.id}
                        onClick={() => handleEdit(record)}
                        style={{ marginRight: '10px' }}
                    >
                        <div className="btn btn-primary m-2">Edit</div>
                    </div>,
                   
                      <div
                      key={record}
                      onClick={() => handleDic(record)}
                      style={{ marginRight: '10px' }}
                  >
                      <div className="btn btn-info m-2">
                          Districts
                      </div>
                  </div>
                  
                ]
            }
        ]
    };
    const customStyles = {
        rows: {
          style: {
            fontSize: "13px",
          },
        },
        headCells: {
          style: {
            fontSize: "14px",
          },
        },
        cells: {
          style: {
            fontSize: "13px",
          },
        },
      };
    return (
        <div>
        <div className="page-wrapper">
          <div className="content">
            <div className="row">
            <Container className="ticket-page ">
                <Row className="">
                    <div className="page-header">
                    <h4>Evaluator List</h4>
                    
                    <div className="page-btn text-right">
                        <Button
                            label={
                                <>
                                  <PlusCircle className="me-2" style={{ color: "white" }} />
                                  <b>Add New Evaluator</b>
                                </>
                              }
                            btnClass="primary"
                            size="small"
                            shape="btn-square"
                            Icon={BsUpload}
                            onClick={() => setRegisterModalShow(true)}
                        />
                        

                    </div>
                    </div>
                    <div className="ticket-data">
                        <div className="my-2" >
                            <DataTableExtensions
                                {...evaluatorsData}
                                exportHeaders
                                print={false}
                                export={false}
                            >
                                <DataTable
                                    responsive={true}
                                    data={props.evalutorsList}
                                    defaultSortField="id"
                                    defaultSortAsc={false}
                          customStyles={customStyles}

                                    pagination
                                    highlightOnHover
                                    fixedHeader
                                    subHeaderAlign={Alignment.Center}
                                />
                            </DataTableExtensions>
                        </div>
                    </div>
                </Row>
            </Container>
            {registerModalShow && (
                <Register
                    show={registerModalShow}
                    setShow={setRegisterModalShow}
                    onHide={() => setRegisterModalShow(false)}
                />
            )}
        </div>
        </div>
        </div>
        </div>
    );
};

const mapStateToProps = ({
    adminEvalutors
   
}) => {
    const { evalutorsList } = adminEvalutors;
   
    return {
        evalutorsList
       
    };
};
export default connect(mapStateToProps, {
  
    getEvaluatorListAction: getAdminEvalutorsList
   
})(TicketsPage);
