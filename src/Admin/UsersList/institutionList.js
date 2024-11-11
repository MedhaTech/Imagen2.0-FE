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
import { useNavigate } from 'react-router-dom';

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
import { stateList ,districtList} from '../../RegPage/ORGData.js';


const TicketsPage = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [tableData, settableData] = React.useState([]);
    const [showspin, setshowspin] = React.useState(false);
const[applicant,setApplicant]=useState("");
const [gender,setGender]=useState("");
const [institution,setInstitution]=useState("");
    // const district = localStorage.getItem('dist');
    const [menter, activeMenter] = useState(false);
    const [loading, setLoading] = useState(false);
const updateStatesList=["All States",...stateList];

const fiterDistData = [...districtList["Tamil Nadu"]];
  fiterDistData.unshift("All Districts");
    const [tab, setTab] = useState('1');
    const [mentorDist, setmentorDist] = useState('');
    const [newDist, setNewDists] = useState('');
    const [fetchData, setFetchData] = useState(false);
    const [state,setState]=useState("");
    let State = localStorage.getItem('state');

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
                district: state ,
               
            })
        );
        await axios
        .get(`${URL.getMentors}?Data=${resparam}`, axiosConfig)
            .then(function (response) {
                if (response.status === 200) {
                    console.log(response,"11");
                    const updatedWithKey =
                        response.data &&
                        response.data.data[0] &&
                        response.data.data[0].dataValues.map((item, i) => {
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
            // navigate("/student-view",{state:{ data: item,
            //     num: num}}
               
            // );
           
            localStorage.setItem('studentId', item.user_id);
            localStorage.setItem('studentData', JSON.stringify(item));
        } 
           
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
                name: 'Full Name',
                selector: (row) => row?.full_name,
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }} 
                    >
                        {row?.full_name}
                    </div>
                ),
                cellExport: (row) => row?.full_name,
                width: '9rem'
            },
            {
                name: 'Email Address',
                selector: (row) => row?.username_email,
                width: '13rem'
            },
            {
                name: 'Mobile No',
                selector: (row) => row?.mobile,
                cellExport: (row) => row?.mobile,
                width: '10rem'
            },
            {
                name: 'District',
                selector: (row) => row.district,
                cellExport: (row) => row.district,
                width: '8rem'
            },
            {
                name: 'College Type',
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                    >
                        {row?.college_type
}
                    </div>
                ),
                selector: (row) => row?.college_type,
                cellExport: (row) => row?.college_type,
                width: '10rem'
            },

            {
                name: 'College Name',
                selector: (row) => row?.college_name,
                cellExport: (row) => row?.college_name,
                width: '18rem'
            },
            // {
            //     name: 'Roll number',
            //     selector: (row) => row?.roll_number,
            //     width: '10rem'
            // },

            // {
            //     name: 'Branch',
            //     selector: (row) => row?.branch,
            //     width: '6rem'
            // },
            // {
            //     name: 'Year of Study',
            //     selector: (row) => row?.year_of_study,
            //     width: '8rem'
            // },
           
            // {
            //     name: 'Actions',
            //     sortable: false,
            //     width: '10rem',
            //     cell: (record) => [
            //         <div
            //             key={record.id}
            //             onClick={() => handleSelect(record, '1')}
            //             style={{ marginRight: '10px' }}
            //         >
            //             <div className="btn btn-primary  mr-5">View</div>
            //         </div>

            //     ]
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
                    <h2 className='mb-2'>Institution Users List</h2>
                    <Container fluid className="px-0">
                                        <Row className="align-items-center">
                                            <Col md={2}>
                                                {/* <div className="my-3 d-md-block d-flex justify-content-center"> */}
                                                    <Select
                                                        list={fiterDistData}
                                                        setValue={setState}
                                                        placeHolder={
                                                            'District'
                                                        }
                                                        value={state}
                                                         className="form-select"
                                                    />
                                                {/* </div> */}
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
