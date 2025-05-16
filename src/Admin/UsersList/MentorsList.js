/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'reactstrap';

import { Button } from '../../stories/Button';

import axios from 'axios';
import { URL, KEY } from '../../constants/defaultValues.js';

import { getNormalHeaders } from '../../helpers/Utils';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import logout from '../../assets/img/logout.png';
import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import Select from './Select.js';
import { useNavigate } from "react-router-dom";


import { useDispatch } from 'react-redux';
import { encryptGlobal } from '../../constants/encryptDecrypt.js';
import { stateList } from '../../RegPage/ORGData.js';

const TicketsPage = (props) => {
    const dispatch = useDispatch();
    const [tableData, settableData] = React.useState([]);
    const [showspin, setshowspin] = React.useState(false);
    const district = localStorage.getItem('dist');

const updateStatesList=["All States",...stateList];
const navigate = useNavigate();


   
    const [studentDist, setstudentDist] = useState(district ? district : '');
    const [mentorDist, setmentorDist] = useState('');
   
    const [state,setState]=useState("");


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
                status: "ALL",
                state: state ,
               
            })
        );
        await axios
        .get(`${URL.getMentors}?Data=${resparam}`, axiosConfig)
            .then(function (response) {
                if (response.status === 200) {
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
    const handleSelect = (item, num) => {

        // where item = student id / mentor id //
        localStorage.removeItem('dist');
        localStorage.removeItem('num');
        if (num == '1') {
            navigate("/mentor-view",{state:{ data: item,
                num: num}}
               
            );
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
       navigate(
             '/mentor-view',
        );
       
    };

   

  
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

  

 
    const StudentsData = {
        data: tableData && tableData.length > 0 ? tableData : [],
        columns: [
            {
                name: 'No',
                selector: (row, key) => key + 1,
                cellExport: (row) => row.index,
                width: '4rem'
            },
              {
                name: 'UDISE Code',
                selector: (row) => row?.
                organization.
                organization_code,
                cellExport: (row) => row?.
                organization.
                organization_code,
                width: '8rem'
            },

            {
                name: 'District',
                selector: (row) => row.organization.district,
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                    >
                        {row.organization.district}
                    </div>
                ),
                cellExport: (row) => row.organization.district,
                width: '6rem'
            },
          
            {
                name: 'Category',
                selector: (row) => row.organization.category,
                cellExport: (row) => row.organization.category,
                width: '6rem'
            },
            {
                name: 'Institution Name',
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                    >
                        {row.organization.organization_name
                        }
                    </div>
                ),
                selector: (row) => row.organization.organization_name
                ,
                cellExport: (row) => row.organization.organization_name
                ,
                width: '10rem'
            },

            {
                name: 'Mentor Name',
                selector: (row) => row.full_name,
                cellExport: (row) => row.full_name,
                width: '10rem'
            },
           

            {
                name: 'Gender',
                selector: (row) => row.gender,
                width: '6rem'
            },
            {
                name: 'Email Id',
                selector: (row) => row.username,
                width: '10rem'
            },

            {
                name: 'Mobile No',
                selector: (row) => row.mobile,
                width: '8rem'
            },
           
            {
                name: 'Actions',
                sortable: false,
                width: '10rem',
                cell: (record) => [
                    <div
                        key={record.id}
                        onClick={() => handleSelect(record, '1')}
                        style={{ marginRight: '10px' }}
                    >
                        <div className="btn btn-primary  mr-5">View</div>
                    </div>
                    
                  
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
    const showbutton =state ;
    return (
        <div className="page-wrapper">
        <div className="content">
            <Container className="ticket-page mb-50 userlist">
                <Row className="mt-0">
                    <h2>Mentors List</h2>
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
