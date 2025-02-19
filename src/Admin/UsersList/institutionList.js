/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "reactstrap";
// import { Tabs } from 'antd';
import { Button } from "../../stories/Button";

import axios from "axios";
import { URL, KEY } from "../../constants/defaultValues.js";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { getNormalHeaders,getCurrentUser,openNotificationWithIcon } from "../../helpers/Utils";
import { useNavigate } from "react-router-dom";

import "sweetalert2/src/sweetalert2.scss";
import DataTable, { Alignment } from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import Select from "./Select.js";
import { PlusCircle } from "feather-icons-react/build/IconComponents";
import logout from '../../assets/img/logout.png';
import { useDispatch } from "react-redux";
import { encryptGlobal } from "../../constants/encryptDecrypt.js";
import { stateList, districtList } from "../../RegPage/ORGData.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
const TicketsPage = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tableData, settableData] = React.useState([]);
  const [showspin, setshowspin] = React.useState(false);
 const currentUser = getCurrentUser("current_user");
  const fiterDistData = [...districtList["Telangana"]];
  fiterDistData.unshift("All Districts");
  const [state, setState] = useState("");

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
        district: state,
      })
    );
    await axios
      .get(`${URL.getMentors}?Data=${resparam}`, axiosConfig)
      .then(function (response) {
        if (response.status === 200) {
          // console.log(response, "11");
          const updatedWithKey =
            response.data &&
            response.data.data[0] &&
            response.data.data[0].dataValues.map((item, i) => {
              const upd = { ...item };
              upd["key"] = i + 1;
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
  const handleReset = () => {
    // here we can reset password as  user_id //
    // here data = student_id //
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-submit',
            cancelButton: 'btn btn-cancel'
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons
        .fire({
            title: "<h4>Are you sure?</h4>",
            text: 'You are attempting to reset the password',
            imageUrl: `${logout}`,
            confirmButtonText: 'Reset Password',
            showCancelButton: true,
            cancelButtonText: "Cancel",
            reverseButtons: false
        })
        .then((result) => {
            if (result.isConfirmed) {
              handleResetApi();
            }
        })
        .catch((err) => console.log(err.response));
};
  const handleResetApi = (item) => {
    const body = JSON.stringify({
        email: item.username_email,
        otp: false,
        role:"MENTOR",
        mentor_id: item.mentor_id
    });
    var config = {
        method: 'put',
        url: process.env.REACT_APP_API_BASE_URL + '/mentors/resetPassword',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser?.data[0]?.token}`
        },
        data: body
    };
    axios(config)
        .then(function (response) {
          // console.log(response,"res");
            if (response.status === 202) {
                openNotificationWithIcon(
                    'success',
                    'Reset Password Successfully Update!',
                );
            }
        })
        .catch(function (error) {
            console.log(error);
        });
};
const handleSelect = (item, num) => {
  // where item = student id / mentor id //
  localStorage.removeItem('dist');
  localStorage.removeItem('num');
  if (num == '1') {
      navigate("/Institution-view",{state:{ data: item,
          // dist:studentDist,
          num: num}}
         
      );
     
      localStorage.setItem('studentId', item.user_id);
      localStorage.setItem('studentData', JSON.stringify(item));
  } 
     
};
const handleDeleteInstitution = (item) => {
  let supId;
  if(typeof(item.mentor_id) !== "string"){
supId = encryptGlobal(
    JSON.stringify(item.mentor_id)
  );
  }else{
   supId = encryptGlobal(item.mentor_id);

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
          url: process.env.REACT_APP_API_BASE_URL + "/mentors/" + supId,
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
                "Institution Deleted Successfully"
              );
            } else {
              openNotificationWithIcon("error", "Opps! Something Wrong");
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        MySwal.fire("Cancelled", "Institution not Deleted", "error");
      }
    });
  };
  const StudentsData = {
    data: tableData && tableData.length > 0 ? tableData : [],
    columns: [
      {
        name: "No",
        // selector: (row) => row.id,
        selector: (row, key) => key + 1,
        cellExport: (row) => row.index,
        width: "4rem",
      },

      {
        name: "Full Name",
        selector: (row) => row?.full_name,
        cell: (row) => (
          <div
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {row?.full_name}
          </div>
        ),
        cellExport: (row) => row?.full_name,
        width: "12rem",
      },
      {
        name: "Email Address",
        selector: (row) => row?.username_email,
        width: "16rem",
      },
      {
        name: "Mobile No",
        selector: (row) => row?.mobile,
        cellExport: (row) => row?.mobile,
        width: "9rem",
      },
      {
        name: "District",
        selector: (row) => row.district,
        cellExport: (row) => row.district,
        width: "8rem",
      },
      {
        name: "College Type",
        cell: (row) => (
          <div
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {row?.college_type}
          </div>
        ),
        selector: (row) => row?.college_type,
        cellExport: (row) => row?.college_type,
        width: "12rem",
      },

      {
        name: "College Name",
        selector: (row) => row?.college_name,
        cellExport: (row) => row?.college_name,
        width: "16rem",
      },
      {
        name: 'Actions',
        sortable: false,
        width: '14rem',
        cell: (record) => [
            <>
            {/* <div
            key={record.id}
            onClick={() => handleReset(record, '1')}
            style={{ marginRight: '10px' }}
          >
            <div className="btn btn-primary"><FontAwesomeIcon icon={faKey} style={{ marginRight: "5px" }} />Reset</div>
          </div> */}
          <div
                        key={record.id}
                        onClick={() => handleSelect(record, '1')}
                        style={{ marginRight: '10px' }}
                    >
                        <div className="btn btn-primary"><i data-feather="eye" className="feather-eye" style={{ marginRight: "5px" }} />View</div>
                    </div>
          <div
            key={record.id}
            onClick={() => handleDeleteInstitution(record)}
          >
              <div className="btn btn-danger"><i data-feather="trash-2" className="feather-trash-2" style={{ fontSize: "15px" }} /> Delete</div>
            </div></>
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
  const showbutton = state;
  return (
    <div className="page-wrapper">
      <div className="content">
      <div className="page-title">
                           
                           <h4 className="mb-3 mx-0">Institutions List</h4>
                           {/* <h6>Create,Reset an Institution User here </h6> */}
           
               </div>
        <Container className="ticket-page mb-50 userlist">
          <Row className="mt-0">
            {/* <h4 className="my-2 mx-0">Institutions List</h4> */}
            {/* <Container fluid className="px-0"> */}
              <Row className="align-items-center" style={{ paddingLeft: '0' }} >
                <Col md={2}>
                  <Select
                    list={fiterDistData}
                    setValue={setState}
                    placeHolder={"Select District"}
                    value={state}
                    className="form-select"
                  />
                </Col>

                <Col md={2}>
                  <div className="text-center">
                    <Button
                      btnClass={showbutton ? "primary" : "default"}
                      size="small"
                      label="Search"
                      disabled={!showbutton}
                      onClick={() => handleclickcall()}
                    />
                  </div>
                </Col>
                <Col className="d-flex justify-content-end">
                  <div className="text-center">
                    <button
                      className="btn btn-info"
                      onClick={() => navigate("/add-institution")}
                    >
                      <PlusCircle className="me-2" style={{ color: "white" }} />
                      <b>Add Institution</b>
                    </button>
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
                    subHeaderAlign={Alignment.Center}
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
