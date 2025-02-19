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
import { getCurrentUser, openNotificationWithIcon } from "../../helpers/Utils";

// import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import logout from '../../assets/img/logout.png';
import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import Select from './Select.js';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

import { Badge } from 'react-bootstrap';
import CommonPage from '../../components/CommonPage';
import { useDispatch } from 'react-redux';
import dist from 'react-data-table-component-extensions';
// import ClipLoader from 'react-spinners/ClipLoader';
import { encryptGlobal } from '../../constants/encryptDecrypt.js';
import { stateList ,districtList} from '../../RegPage/ORGData.js';
// import { useNavigate } from 'react-router-dom';
// const { TabPane } = Tabs;

// const SelectDists = ({
//     // stateList,
//     getDistrictsListAction,
//     getStateDataListAction,
//     dists,
//     tab,
//     setDist,
//     newDist,
//     drop
// }) => {
//     const [loading, setLoading] = useState(false);
//     // console.log(stateList, 'id');
//     // useEffect(() => {
//     //     if (tab && (tab == 1 || tab == 2)) getDistrictsListAction();
//     // }, [tab]);
//     // console.log();
//     const handleDists = (e) => {
//         // console.log(e,"e");
//         // setNewDist(e.target.value);
//         setLoading(true);
//         setTimeout(() => {
//             setLoading(false);
//         }, 2000);
//         setDist(e.target.value);
//         localStorage.setItem('dist', e.target.value);
//     };
//         // console.log(dist,"e");

//     return (
//         <select
//             onChange={handleDists}
//             name="districts"
//             id="districts"
//             value={newDist}
//             className="text-capitalize"
//         >
//             <option value="">Select State</option>

//             {stateList && stateList.length > 0 ? (
//                 stateList.map((item, i) => (
//                     <option key={i} value={item}>
//                         {item}
//                     </option>
//                 ))
//             ) : (
//                 <option value="">There are no District</option>
//             )}
//         </select>
//     );
// };
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
 const currentUser = getCurrentUser("current_user");
const fiterDistData = [...districtList["Telangana"]];
  fiterDistData.unshift("All Districts");
    const [evaluater, activeEvaluater] = useState(false);
    const [tab, setTab] = useState('1');
    // const [studentDist, setstudentDist] = useState(district ? district : '');
    const [mentorDist, setmentorDist] = useState('');
    const [newDist, setNewDists] = useState('');
    const [registerModalShow, setRegisterModalShow] = useState(false);
    const [fetchData, setFetchData] = useState(false);
    const [state,setState]=useState("");
    const [district,setDistrict]=useState("");
    let State = localStorage.getItem('state');

//   useEffect(()=>{
//     handleideaList();
//   },[]);
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
                // year_of_study:applicant,
                // group:institution,
                // Gender:gender,
                // district: district !== 'All Districts' ? district : ''
                // protoType: protoType,
                // sdg: sdg !== 'All Themes' ? sdg : ''
            })
        );
        await axios
        .get(`${URL.getStudents}?Data=${resparam}`, axiosConfig)
            .then(function (response) {
                if (response.status === 200) {
                    // console.log(response,"11");
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
// console.log(state,"state");
    const handleSelect = (item, num) => {
        // where item = student id / mentor id //
        localStorage.removeItem('dist');
        localStorage.removeItem('num');
        if (num == '1') {
            navigate("/student-view",{state:{ data: item,
                // dist:studentDist,
                num: num}}
               
            );
           
            localStorage.setItem('studentId', item.user_id);
            localStorage.setItem('studentData', JSON.stringify(item));
        } 
           
    };
    const viewDetail = (item) => {
        props.history.push({
            pathname: '/student-view',
            data: item
        });
        // localStorage.setItem(
        //     'institution_code',
        //     JSON.stringify(item.institution_code)
        // );
    };

    const handleEdit = (item) => {
        // where we can edit user details  //
        // where item = mentor id //
        props.history.push({
            pathname: `/admin/edit-user-profile`,
            data: item
        });
        localStorage.setItem('mentor', JSON.stringify(item));
    };

    // const handleReset = (item) => {
    //     const body = JSON.stringify({
    //         organization_code: item.organization_code,
    //         otp: false,
    //         mentor_id: item.mentor_id
    //     });
    //     var config = {
    //         method: 'put',
    //         url: process.env.REACT_APP_API_BASE_URL + '/mentors/resetPassword',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${currentUser?.data[0]?.token}`
    //         },
    //         data: body
    //     };
    //     axios(config)
    //         .then(function (response) {
    //             if (response.status === 202) {
    //                 openNotificationWithIcon(
    //                     'success',
    //                     'Reset Password Successfully Update!',
    //                     ''
    //                 );
    //             }
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // };
    // const handleDelete = () => {
    //     const swalWithBootstrapButtons = Swal.mixin({
    //         customClass: {
    //             confirmButton: 'btn btn-success',
    //             cancelButton: 'btn btn-danger'
    //         },
    //         buttonsStyling: false
    //     });

    //     swalWithBootstrapButtons
    //         .fire({
    //             title: 'You are attempting to delete Evalauaor.',
    //             text: 'Are you sure?',
    //             imageUrl: `${logout}`,
    //             showCloseButton: true,
    //             confirmButtonText: 'Delete',
    //             showCancelButton: true,
    //             cancelButtonText: 'Cancel',
    //             reverseButtons: false
    //         })
    //         .then((result) => {
    //             if (result.isConfirmed) {
    //                 swalWithBootstrapButtons.fire(
    //                     'Loged out!',
    //                     'Successfully deleted.',
    //                     'success'
    //                 );
    //             } else if (result.dismiss === Swal.DismissReason.cancel) {
    //                 swalWithBootstrapButtons.fire(
    //                     'Cancelled',
    //                     'You are Logged in',
    //                     'error'
    //                 );
    //             }
    //         });
    // };
  
//  console.log(tableData,"table");
    const handleSelect1 = (record) => {
        if (record.type === 0) {
          handleDeletePilot(record.student_id);
        } else {
          handleDeleteStudent(record.student_id);
        }
      };
    const handleDeleteStudent = (id) => {
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
                // Accept: "application/json",
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
                // Accept: "application/json",
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
     
//  console.log(tableData,"table");
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
                width: '11rem'
            },
            {
                name: 'Email',
                selector: (row) => row?.username_email,
                width: '12rem'
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
                // left:true,
                width: '14em'
            },

            {
                name:'College Name',
                selector: (row) => row?.college_name,
                cellExport: (row) => row?.college_name,
                width: '16rem',
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
           
            {
                name: 'Actions',
                sortable: false,
                width: '14rem',
                // left:true,
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
                    // <div
                    //     key={record.id}
                    //     style={{ marginRight: '10px' }}
                    //     onClick={() => {
                    //         let status =
                    //             record?.status === 'ACTIVE'
                    //                 ? 'INACTIVE'
                    //                 : 'ACTIVE';
                    //         handleStatus(status, record?.student_id, 'student');
                    //     }}
                    // >
                    //     {record?.status === 'ACTIVE' ? (
                    //         <div className="btn btn-danger ">INACTIVE</div>
                    //     ) : (
                    //         <div className="btn btn-warning ">ACTIVE</div>
                    //     )}
                    // </div>
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
                           {/* <h6>Edit,Reset an Students here </h6> */}
           
               </div>
            <Container className="ticket-page mb-50 userlist">
                <Row className="mt-0">
                    {/* <h4 className="my-2 mx-0">Students List</h4> */}
                    {/* <Container fluid className="px-0"> */}
                                        <Row className="align-items-center" style={{ paddingLeft: '0' }} >
                                            <Col md={2}>
                                                {/* <div className="my-3 d-md-block d-flex justify-content-center"> */}
                                                    <Select
                                                        list={fiterDistData}
                                                        setValue={setState}
                                                        placeHolder={
                                                            'Select District'
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
                                    {/* </Container> */}
                </Row>
            </Container>
          
        </div>
        </div>
    );
};


export default TicketsPage;
