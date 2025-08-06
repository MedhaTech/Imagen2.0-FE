/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'reactstrap';
import { Button } from '../../stories/Button';

import axios from 'axios';
import { URL, KEY } from '../../constants/defaultValues.js';
import { MaskedEmail ,MaskedMobile} from "../../RegPage/MaskedData.js";

import { getNormalHeaders } from '../../helpers/Utils';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, openNotificationWithIcon } from "../../helpers/Utils";

import 'sweetalert2/src/sweetalert2.scss';
import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import Select from './Select.js';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

import { useDispatch } from 'react-redux';
import { encryptGlobal } from '../../constants/encryptDecrypt.js';
import { stateList ,districtList} from '../../RegPage/ORGData.js';

const TicketsPage = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [tableData, settableData] = React.useState([]);
    const [showspin, setshowspin] = React.useState(false);

 const currentUser = getCurrentUser("current_user");
const fiterDistData = [...districtList["Telangana"]];
  fiterDistData.unshift("All Districts");

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
                district: state ,
               
            })
        );
        await axios
        .get(`${URL.getStudents}?Data=${resparam}`, axiosConfig)
            .then(function (response) {
                if (response.status === 200) {
                    const updatedWithKey =
                        response.data &&
                        response.data.data[0] &&
                        response.data.data[0].rows.map((item, i) => {
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
    // const handleSelect = (item, num) => {
    //     // where item = student id / mentor id //
      
    //     if (num == '1') {
    //         navigate("/student-view",{state:{ data: item,
    //             num: num}}
               
    //         );
    //        console.log(item,"list");
    //         localStorage.setItem('studentId', item.user_id);
    //         localStorage.setItem('studentData', JSON.stringify(item));
    //     } 
           
    // };
   const handleSelect = (item) => {
  localStorage.setItem("student_type", item?.type);
  localStorage.setItem("student_id", item?.student_id);
  localStorage.setItem("user_id", item?.user_id);

  navigate("/student-view", {
    state: {
      data: item,
    },
  });
};
useEffect(() => {
  localStorage.removeItem("student_type");
  localStorage.removeItem("student_id");
  localStorage.removeItem("user_id");
}, []);


    const handleSelect1 = (record) => {
        if (record.type === 0) {
          handleDeletePilot(record.student_id);
        } else {
          handleDeleteStudent(record.student_id);
        }
      };
    const handleDeleteStudent = (id) => {
      // this function delete the crew user //
      let supId;
      if(typeof(id) !== "string"){
    supId = encryptGlobal(
        JSON.stringify(id)
      );
      }else{
       supId = encryptGlobal(id);
  
      }
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          showCancelButton: true,
          confirmButtonColor: "#00ff00",
          confirmButtonText: "Yes, delete it!",
          cancelButtonColor: "#ff0000",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
          

            var config = {
              method: "delete",
              url: process.env.REACT_APP_API_BASE_URL + "/students/" + supId,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${currentUser?.data[0]?.token}`,
              },
            };
            axios(config)
              .then(function (response) {
                if (response.status === 200) {
                    handleideaList();
                  openNotificationWithIcon(
                    "success",
                    "Student Deleted Successfully"
                  );
                } else {
                  openNotificationWithIcon("error", "Opps! Something Wrong");
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            MySwal.fire("Cancelled", "Student not Deleted", "error");
          }
        });
      };
      const handleDeletePilot = (id) => {
      // this function delete the pilot user //

        let supId;
            if(typeof(id) !== "string"){
          supId = encryptGlobal(
              JSON.stringify(id)
            );
            }else{
             supId = encryptGlobal(id);

        
            }

        const MySwal = withReactContent(Swal);
        MySwal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          showCancelButton: true,
          confirmButtonColor: "#00ff00",
          confirmButtonText: "Yes, delete it!",
          cancelButtonColor: "#ff0000",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
           

            var config = {
              method: "delete",
              url: process.env.REACT_APP_API_BASE_URL + "/students/" + supId + "/deleteAllData",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${currentUser?.data[0]?.token}`,
              },
            };
            axios(config)
              .then(function (response) {
                if (response.status === 200) {
                    handleideaList();
                  openNotificationWithIcon(
                    "success",
                    "Student Deleted Successfully"
                  );
                } else {
                  openNotificationWithIcon("error", "Opps! Something Wrong");
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            MySwal.fire("Cancelled", "Student not Deleted", "error");
          }
        });
      };
     
    const StudentsData = {
        data: tableData && tableData.length > 0 ? tableData : [],
        columns: [
            {
                name: 'No',
                selector: (row, key) => key + 1,
                cellExport: (row) => row.index,
                center:true,
                width: '4rem'
            },

            {
                name: 'Full Name',
                selector: (row) => row?.full_name,
                center:true,
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
                width: '11rem'
            },
            {
                name: 'Email',
                center:true,
                selector: (row) => row?.username_email,

                width: '12rem'
            },
            {
                name: 'Mobile No',
                center:true,
                selector: (row) => row?.mobile,
                cellExport: (row) => row?.mobile,
                width: '10rem'
            },
            {
                name: 'District',
                center:true,
                selector: (row) => row.district,
                cellExport: (row) => row.district,
                width: '14em'
            },
            {
              name: 'Student Type',
              selector: (row) => row?.type,
              width: '10rem',
              center:true,
              cell: (row) => [
                  row.type === 0 ? (
                      <span className="badge rounded-pill bg-outline-success" style={{fontSize:"13px"}}>
                          Pilot
                      </span>
                  ) : (
                      <span className="badge rounded-pill bg-outline-secondary" style={{fontSize:"13px"}}>
                          Crew
                      </span>
                 
                  )
              ]
          },
            {
                name:'College Name',
                center:true,
                selector: (row) => row?.college_name,
                cellExport: (row) => row?.college_name,
                width: '16rem',
            },
           
          
           
            {
                name: 'Actions',
                sortable: false,
                width: '14rem',
                center:true,
                cell: (record) => [
                    <><div
                        key={record.id}
                        onClick={() => handleSelect(record, '1')}
                        style={{ marginRight: '10px' }}
                    >
                        <div className="btn btn-primary"><i data-feather="eye" className="feather-eye" style={{ marginRight: "5px" }} />View</div>
                    </div>
                    <div
                        key={record.id}
                        onClick={() => handleSelect1(record)}
                    >
                            <div className="btn btn-danger"><i data-feather="trash-2" className="feather-trash-2"style={{fontSize: "15px" }}  />Delete</div>
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
    const showbutton =state ;
    return (
        <div className="page-wrapper">
        <div className="content">
        <div className="page-title">
                           
                           <h4 className="mb-3 mx-0">Students List</h4>
           
               </div>
            <Container className="ticket-page mb-50 userlist">
                <Row className="mt-0">
                  
                                        <Row className="align-items-center" style={{ paddingLeft: '0' }} >
                                            <Col md={2}>
                                                    <Select
                                                        list={fiterDistData}
                                                        setValue={setState}
                                                        placeHolder={
                                                            'Select District'
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
                </Row>
            </Container>
          
        </div>
        </div>
    );
};


export default TicketsPage;
