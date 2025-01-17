/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge } from 'reactstrap';
import DataTableExtensions from 'react-data-table-component-extensions';
import DataTable, { Alignment } from 'react-data-table-component';
import { getCurrentUser } from '../../../helpers/Utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { encryptGlobal } from '../../../constants/encryptDecrypt.js';

const Evalprocess = () => {
    const navigate = useNavigate();
    const [evalList, setEvalList] = useState([]);
    const currentUser = getCurrentUser('current_user');
    useEffect( () => {
        handleEvalList();
    }, []);
    async function handleEvalList() {
        //  handleEvalList Api where we can see list of all evaluationProcess //
        const adstatus = encryptGlobal(
            JSON.stringify({
                status: 'ALL'
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/evaluationProcess?Data=${adstatus}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };
        await axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setEvalList(
                        response.data &&
                            response.data.data[0] &&
                            response.data.data[0].dataValues
                    );
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const handleDic = (item) => {
        // where we can select district //
        // where item = district //
        navigate("/eadmin/selectingDistricts-evaluationProcess");
        // history.push({
        //     pathname: '/eadmin/selectingDistricts-evaluationProcess'
        // });
        localStorage.setItem('eavlId', JSON.stringify(item));
    };
    const evalData = {
        data: evalList && evalList.length > 0 ? evalList : [],
        columns: [
            {
                name: <span style={{ fontWeight: 550 }}>No</span>,
                selector: (row, key) => key + 1,
                width: '6%'
            },
            {
                name: <span style={{ fontWeight: 550 }}>Level Name</span>,
                selector: (row) => row.level_name,
                sortable: true,
                width: '12%'
            },
            {
                name: <span style={{ fontWeight: 550 }}>Evaluation Schema</span>,
                selector: (row) => row.eval_schema,
                width: '15%'
            },
            {
                name: <span style={{ fontWeight: 550 }}>No of Evaluators per idea</span>,
                selector: (row) => row.no_of_evaluation,
                width: '15%'
            },
            {
                name: <span style={{ fontWeight: 550 }}>Status</span>,
                cell: (row) => [
                    <Badge
                        key={row.evaluation_process_id}
                        className={`bg ${row.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'}`}
                    >
                        {row.status}
                    </Badge>
                ],
                width: '7%'
            },
            {
                name: <span style={{ fontWeight: 550 }}>Actions</span>,
                selector: 'action',
                center: true,
                width: '40%',
                cell: (record) => [
                    <>
                        <div
                            key={record}
                            onClick={() => handleDic(record)}
                            style={{ marginRight: '12px' }}
                        >
                            <div className="btn btn-info mx-2">
                                Districts
                            </div>
                        </div>
                    </>
                ]
            }
        ]
    };
    

    //evaluation status

    // const [ideaList, setIdeaList] = useState([]);

    // useEffect(() => {
    //     handlepopupList();
    // }, []);
    // async function handlepopupList() {
    //     //  handlePopupList Api where we can see list of all resource //
    //     let config = {
    //         method: 'get',
    //         url: process.env.REACT_APP_API_BASE_URL + '/popup',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${currentUser?.data[0]?.token}`
    //         }
    //     };
    //     await axios(config)
    //         .then(function (response) {
    //             if (response.status === 200) {
    //                 setIdeaList(response?.data?.data[0]?.dataValues[2]);
    //             }
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // }

    // const Statusfunc = async (item, id) => {
    //     let config = {
    //         method: 'put',
    //         url: process.env.REACT_APP_API_BASE_URL + `/popup/${id}`,
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${currentUser?.data[0]?.token}`
    //         },
    //         data: item
    //     };
    //     await axios(config)
    //         .then(function (response) {
    //             if (response.status === 200) {
    //                 openNotificationWithIcon(
    //                     'success',
    //                     item.on_off === '1' && id === 3
    //                         ? 'Evaluation Inprogress'
    //                         : 'Evaluation Completed'
    //                 );
    //                 handlepopupList();
    //             }
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // };

    // const handleStatus = (item, id) => {
    //     Statusfunc({ on_off: `${item}` }, id);
    // };

    ///////////////////////
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
            <Container className="ticket-page">
                <Row className="pt-3">
                    <Row className="mb-2 mb-sm-5 mb-md-5 mb-lg-0">
                        <Col className="col-auto">
                            <h4>Evaluation Process</h4>
                        </Col>
                    </Row>

                    <div className="my-2">
                        <DataTableExtensions
                            {...evalData}
                            exportHeaders
                            print={false}
                            export={false}
                        >
                            <DataTable
                                data={setEvalList}
                                defaultSortField="id"
                                defaultSortAsc={false}
                                pagination
                                highlightOnHover
                          customStyles={customStyles}

                                fixedHeader
                                subHeaderAlign={Alignment.Center}
                            />
                        </DataTableExtensions>
                    </div>
                    {/* <Row className="pt-3">
                        <Row className="mb-2 mb-sm-5 mb-md-5 mb-lg-2 mt-2 mt-sm-5 mt-md-5 mt-lg-5">
                            <Col className="col-auto">
                                <h2>Evaluation Status</h2>
                            </Col>
                        </Row>
                        <Card className="p-5">
                            <Row>
                                <Col>
                                    <h2>
                                        status :{' '}
                                        <span
                                            className={
                                                ideaList.on_off === '1'
                                                    ? 'text-danger'
                                                    : 'text-success'
                                            }
                                        >
                                            {ideaList.on_off === '1'
                                                ? 'Evaluation Inprogress'
                                                : 'Evaluation Completed'}
                                        </span>
                                    </h2>
                                    {ideaList.on_off === '1' ? (
                                        <Button
                                            label="Completed"
                                            btnClass="primary mx-3"
                                            size={'small'}
                                            shape="btn-square"
                                            backgroundColor={'green'}
                                            onClick={() =>
                                                handleStatus(
                                                    '0',
                                                    ideaList.popup_id
                                                )
                                            }
                                        />
                                    ) : (
                                        <Button
                                            label="Incomplete"
                                            btnClass="primary mx-3"
                                            size={'small'}
                                            shape="btn-square"
                                            backgroundColor={'red'}
                                            onClick={() =>
                                                handleStatus(
                                                    '1',
                                                    ideaList.popup_id
                                                )
                                            }
                                        />
                                    )}
                                    <p className="p-5">
                                        Note : Before clicking on Completed
                                        button, please make sure all evaluation
                                        progress Completed.
                                    </p>
                                </Col>
                            </Row>
                        </Card>
                    </Row> */}
                </Row>
            </Container>
            </div></div>
            </div></div>

    );
};

export default Evalprocess;
