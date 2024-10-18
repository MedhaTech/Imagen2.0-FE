/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, List, Label, Card, Col } from "reactstrap";
import { encryptGlobal } from "../../constants/encryptDecrypt";
import DataTable, { Alignment } from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { getCurrentUser, openNotificationWithIcon } from "../../helpers/Utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Tooltip } from "react-bootstrap";
// import { Button } from "../../.stories/Button";

import {
  getAdminTeamMembersList,
  // studentResetPassword
} from "../../redux/actions";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { connect, useDispatch, useSelector } from "react-redux";
import "./tables.css";
import Select from "../../RegPage/Select";
import { Modal } from "react-bootstrap";
import { PlusCircle } from "feather-icons-react/build/IconComponents";
const Dashboard = (props) => {
  const teamsListData = useSelector((state) => state?.teams?.teamsMembersList);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [teamsArray, setTeamsArray] = useState([]);
  const currentUser = getCurrentUser("current_user");
  const [teamsList, setTeamsList] = useState([]);
  const [show, setShow] = useState(false);
  const [teamlist, setteamlist] = useState([]);
  const [datafinal, setDataFinal] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [stuList, setStuList] = useState("");
  const [selectedstudent, setselectedstudent] = useState();
  const [IdeaStatus, setIdeaStatus] = useState("No Idea");
  const [teamchangeobj, setteamchangeObj] = useState({});
  const [value, setvalue] = useState("");
  const [ViewedTeam, setViewedTeam] = useState();

  useEffect(() => {
    teamListbymentorid();
  }, []);
  const ideaStatusfun = (id) => {
    // console.log(id, "id");
    const ideaStatusparam = encryptGlobal(
      JSON.stringify({
        team_id: id,
      })
    );
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/challenge_response/ideastatusbyteamId?Data=${ideaStatusparam}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          // console.log(response, "teamId");

          setIdeaStatus(response.data.data[0].ideaStatus);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    setDataFinal(teamsListData);
    if (selectedTeam) {
      // ideaStatusfun(selectedTeam);
    }
  }, [selectedTeam]);
  const teamListbymentorid = () => {
    var config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL + `/students/ListOfPilotStudent`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setTeamsList(response.data.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    var teamsArrays = [];
    teamsList.map((teams, index) => {
      var key = index + 1;
      return teamsArrays.push({ ...teams, key, crewMembers: JSON.parse(teams.crewDetails) });
    });
    setTeamsArray(teamsArrays);
  }, [teamsList]);
  const handleCreate = (item) => {
    // where item = team name //
    // where we can add team member details //
    navigate(`/addstudent`,
      { state: { student_id: item.student_id } }
    );
  };
  const handleEditData = (student_id) => {
    // alert("hii");
    console.log(student_id,"id");
  
    navigate(`/Institution-student-edit`, { state: { student_id: student_id} });
 
  };
 
  const renderAddTooltip = (name, number) => (
    <Tooltip id="refresh-tooltip">
      {`Add Crew-${number} Member to ${name}`}
    </Tooltip>
  );
  const renderHideTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Hide
    </Tooltip>
  );
  const renderEditTooltip = (name) => (
    <Tooltip id="refresh-tooltip">
      {`EditDetails`}
    </Tooltip>
  );
  const renderSwitchTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Change Team
    </Tooltip>
  );

  const renderDelTooltip = (name) => (
    <Tooltip id="refresh-tooltip">
      {`Delete ${name}`}
    </Tooltip>
  );
  const renderViewTooltip = (id) => (
    <Tooltip id="refresh-tooltip" {...props}>
       {`View`}
    </Tooltip>
  );
  const findTeamDetails = (id) => {
    //console.log(teamsList,"teamdetailsfunc");
    const team = teamsList.find((item) => item.team_id === id);
    setViewedTeam(team);
    //console.log(ViewedTeam , "viewed team");
  };

  const handleViewClick = (teamId, stuCount) => {
    if (selectedTeam === teamId) {
      setSelectedTeam(null);
    } else {
      //console.log(teamId,stuCount);
      findTeamDetails(teamId);
      dispatch(getAdminTeamMembersList(teamId));
      setStuList(stuCount);
      // props.getAdminTeamMembersListAction(teamId);
      setDataFinal([]);
      setTimeout(() => {
        setSelectedTeam(teamId);
      }, 1000);
    }
  };
  const viewDetails = (student_id) => {
    // console.log(student_id,"item");
  
    navigate(`/view-profile`, { state: { student_id: student_id} });
};

  const adminTeamsList = {
    data: teamsArray,
    columns: [
      {
        name: <b style={{ color: "crimson" }}>#</b>,
        selector: (row, index) => index + 1,
        width: "8%",
      },
      {
        name: <b style={{ color: "crimson" }}>Pilot Student&apos;s</b>,
        selector: (row) => <div><strong style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}>{row.full_name}</strong>
          <OverlayTrigger placement="top" overlay={renderEditTooltip(row?.student_id)}>
            <div className="btn text-info" style={{ fontSize: '1rem' }} onClick={() => handleEditData(row.student_id
)}> <i data-feather="edit" className="feather-edit" /></div>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={renderDelTooltip(row?.full_name)}>
            <div className="btn text-danger" style={{ fontSize: '1rem' }}> <i data-feather="trash-2" className="feather-trash-2" /></div>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={renderViewTooltip(row?.
student_id)}>
                    <div className="btn btn-dark btn-sm m-2"  onClick={() => viewDetails(row.student_id
)}>{<i data-feather="eye" className="feather-eye" />} </div>
                </OverlayTrigger>
        </div>
        ,
        width: "23%",
      },
      {
        name: <b style={{ color: "crimson" }}>Crew-1</b>,
        selector: (row) => <div>{row?.crewMembers?.length >= 1 ? <> <strong style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}>{row?.crewMembers[0]?.full_name}</strong>
          <OverlayTrigger placement="top" overlay={renderEditTooltip(row?.crewMembers[0]?.student_id)}>
            <div className="btn text-info" style={{ fontSize: '1rem' }} onClick={() => handleEditData(row?.crewMembers[0]?.student_id)}> <i data-feather="edit" className="feather-edit" /></div>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={renderSwitchTooltip}>
            <div className="btn text-dark" style={{ fontSize: '1rem' }}> <i data-feather="user" className="feather-user" /></div>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={renderDelTooltip(row?.crewMembers[0]?.full_name)}>
            <div className="btn text-danger" style={{ fontSize: '1rem' }} onClick={() => handleDeleteStudent(row?.crewMembers[0]?.student_id)}> <i data-feather="trash-2" className="feather-trash-2" /></div>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={renderViewTooltip(row?.crewMembers[0]?.
student_id)}>
                    <div className="btn btn-dark btn-sm m-2"  onClick={() => viewDetails(row?.crewMembers[0]?.student_id
)}>{<i data-feather="eye" className="feather-eye" />} </div>
                </OverlayTrigger>
        </>
          :
          <OverlayTrigger placement="top" overlay={renderAddTooltip(row?.full_name, 1)}>
            <div className="btn text-success" style={{ fontSize: '1rem' }} onClick={() => handleCreate(row)}> <i data-feather="plus-circle" className="feather-plus-circle" /></div>
          </OverlayTrigger>

        }</div>,
        width: "23%",
      },
      {
        name: <b style={{ color: "crimson" }}>Crew-2</b>,
        selector: (row) => <div>{row?.crewMembers?.length >= 2 ? <> <strong style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}>{row?.crewMembers[1]?.full_name}</strong>
          <OverlayTrigger placement="top" overlay={renderEditTooltip(row?.crewMembers[1]?.student_id)}>
            <div className="btn text-info" style={{ fontSize: '1rem' }} onClick={() => handleEditData(row?.crewMembers[1]?.student_id)}> <i data-feather="edit" className="feather-edit" /></div>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={renderSwitchTooltip}>
            <div className="btn text-dark" style={{ fontSize: '1rem' }}> <i data-feather="user" className="feather-user" /></div>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={renderDelTooltip(row?.crewMembers[1]?.full_name)}>
            <div className="btn text-danger" style={{ fontSize: '1rem' }} onClick={() => handleDeleteStudent(row?.crewMembers[1]?.student_id)}> <i data-feather="trash-2" className="feather-trash-2" /></div>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={renderViewTooltip(row?.crewMembers[1]?.
student_id)}>
                    <div className="btn btn-dark btn-sm m-2"  onClick={() => viewDetails(row?.crewMembers[1]?.student_id
)}>{<i data-feather="eye" className="feather-eye" />} </div>
                </OverlayTrigger>
        </>
          :
          <OverlayTrigger placement="top" overlay={renderAddTooltip(row?.full_name, 2)}>
            <div className="btn text-success" style={{ fontSize: '1rem' }} onClick={() => handleCreate(row)}> <i data-feather="plus-circle" className="feather-plus-circle" /></div>
          </OverlayTrigger>

        }</div>,
        width: "23%",
      },
      {
        name: <b style={{ color: "crimson" }}>Crew-3</b>,
        selector: (row) => <div>{row?.crewMembers?.length >= 3 ? <> <strong style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}>{row?.crewMembers[2]?.full_name}</strong>
          <OverlayTrigger placement="top" overlay={renderEditTooltip(row?.crewMembers[2]?.student_id)}>
            <div className="btn text-info" style={{ fontSize: '1rem' }} onClick={() => handleEditData(row?.crewMembers[2]?.student_id)}> <i data-feather="edit" className="feather-edit" /></div>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={renderSwitchTooltip}>
            <div className="btn text-dark" style={{ fontSize: '1rem' }}> <i data-feather="user" className="feather-user" /></div>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={renderDelTooltip(row?.crewMembers[2]?.full_name)}>
            <div className="btn text-danger" style={{ fontSize: '1rem' }} onClick={() => handleDeleteStudent(row?.crewMembers[2]?.student_id)}> <i data-feather="trash-2" className="feather-trash-2" /></div>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={renderViewTooltip(row?.crewMembers[2]?.
student_id)}>
                    <div className="btn btn-dark btn-sm m-2"  onClick={() => viewDetails(row?.crewMembers[2]?.student_id
)}>{<i data-feather="eye" className="feather-eye" />} </div>
                </OverlayTrigger>
        </>
          :
          <OverlayTrigger placement="top" overlay={renderAddTooltip(row?.full_name, 3)}>
            <div className="btn text-success" style={{ fontSize: '1rem' }} onClick={() => handleCreate(row)}> <i data-feather="plus-circle" className="feather-plus-circle" /></div>
          </OverlayTrigger>

        }</div>,
        width: "23%",
      },

      // {
      //   name: <b style={{ color: "crimson" }}>Actions</b>,
      //   cell: (params) => {
      //     return [
      //       // <div
      //       //   key={params}
      //       //   onClick={() =>
      //       //     handleViewClick(params.student_id, params.crewCount)
      //       //   }
      //       // >
      //       //   {!params.StudentCount < 4 && (

      //       //     <div>
      //       //       {selectedTeam === params.student_id ?
      //       //         <OverlayTrigger placement="top" overlay={renderHideTooltip}>
      //       //           <Link data-bs-toggle="tooltip" data-bs-placement="top" >
      //       //             <div className="btn btn-dark btn-sm m-2">{<i data-feather="eye-off" className="feather-eye-off" />} </div>
      //       //           </Link>
      //       //         </OverlayTrigger>

      //       //         :
      //       //         <OverlayTrigger placement="top" overlay={renderViewTooltip}>
      //       //           <Link data-bs-toggle="tooltip" data-bs-placement="top" >
      //       //             <div className="btn btn-info btn-sm m-2">{<i data-feather="eye" className="feather-eye" />} </div>
      //       //           </Link>
      //       //         </OverlayTrigger>
      //       //       }</div>
      //       //   )}
      //       // </div>,



      //       <div key={params} onClick={() => handleCreate(params)}>
      //         {process.env.REACT_APP_TEAM_LENGTH > params.crewCount && (
      //           <OverlayTrigger placement="top" overlay={renderAddTooltip}>
      //             <Link data-bs-toggle="tooltip" data-bs-placement="top" >
      //               <div className="btn btn-success btn-sm btn-added"> <i data-feather="plus-circle" className="feather-plus-circle" /></div>
      //             </Link>
      //           </OverlayTrigger>

      //         )}
      //       </div>,
      //     ];
      //   },
      //   width: "26%",
      //   left: true,
      // },
    ],
  };

  const handleDeleteTeam = (student) => {
    // console.log(student);
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
        const paramId = encryptGlobal(JSON.stringify(student));
        var config = {
          method: "delete",
          url: process.env.REACT_APP_API_BASE_URL + "/teams/" + paramId,
          headers: {
            "Content-Type": "application/json",
            // Accept: "application/json",
            Authorization: `Bearer ${currentUser?.data[0]?.token}`,
          },
        };
        axios(config)
          .then(function (response) {
            if (response.status === 200) {
              teamListbymentorid(currentUser?.data[0]?.mentor_id);
              // dispatch(getAdminTeamMembersList(selectedTeam));
              openNotificationWithIcon("success", "Team Deleted Successfully");

              navigate("/institution-dashboard");
            } else {
              openNotificationWithIcon("error", "Opps! Something Wrong");
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        MySwal.fire("Cancelled", "Team not Deleted", "error");
      }
    });
  };
  const handleDeleteStudent = (item) => {
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
        const delparamId = encryptGlobal(JSON.stringify(item.student_id));
        var config = {
          method: "delete",
          url: process.env.REACT_APP_API_BASE_URL + "/students/" + delparamId,
          headers: {
            "Content-Type": "application/json",
            // Accept: "application/json",
            Authorization: `Bearer ${currentUser?.data[0]?.token}`,
          },
        };
        axios(config)
          .then(function (response) {
            if (response.status === 200) {
              teamListbymentorid(currentUser?.data[0]?.mentor_id);
              dispatch(getAdminTeamMembersList(selectedTeam));
              openNotificationWithIcon(
                "success",
                "Student Deleted Successfully"
              );
              window.location.reload();
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
  const scroll = () => {
    const section = document.querySelector("#start");
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const handleEdit = (item) => {
    navigate("/studentedit", {
      state: {
        full_name: item.full_name,
        Age: item.Age,
        Gender: item.Gender,
        Grade: item.Grade,
        disability: item.disability,
        team_id: item.team_id,
        username: item?.user?.username,
        user_id: item.user_id,
        student_id: item.student_id,
      },
    });
  };
  const customStyles = {
    head: {
      style: {
        fontSize: "1em", // Adjust as needed
      },
    },
  };
  const handleSwitchTeam = (item) => {
    if (teamsListData.length > 2) {
      teamListby();
      setselectedstudent(item);
    } else {
      openNotificationWithIcon("error", "Opps! Something Wrong");
    }
  };
  const teamListby = () => {
    const teamListbymentorparam = encryptGlobal(
      JSON.stringify({
        mentor_id: currentUser?.data[0]?.mentor_id,
      })
    );

    var config = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/teams/listwithideaStatus?Data=${teamListbymentorparam}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          const teamlistobj = {};
          const listofteams = response.data.data
            .map((item) => {
              if (item.StudentCount < 3 && item.ideaStatus === null) {
                teamlistobj[item.team_name] = item.team_id;
                return item.team_name;
              }
            })
            .filter(Boolean);
          if (Object.keys(teamlistobj).length > 0) {
            let index = listofteams.indexOf(selectedTeam.team_name);

            if (index >= 0) {
              listofteams.splice(index, 1);
            }
          }

          setteamlist(listofteams);
          setteamchangeObj(teamlistobj);
          setShow(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleChangeStudent = (name) => {
    const body = {
      team_id: teamchangeobj[name].toString(),
      full_name: selectedstudent.full_name,
    };
    const stuparamId = encryptGlobal(
      JSON.stringify(selectedstudent.student_id)
    );
    var config = {
      method: "PUT",
      url: process.env.REACT_APP_API_BASE_URL + "/students/" + stuparamId,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
      data: body,
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setvalue("");
          teamListbymentorid(currentUser?.data[0]?.mentor_id);
          dispatch(getAdminTeamMembersList(selectedTeam));
          openNotificationWithIcon("success", "Successfully shifted student");
          navigate({
            pathname: "/mentorteams",
          });
          setSelectedTeam(null);
        } else {
          openNotificationWithIcon("error", "Opps! Student shift was unsuccessful");
        }
      })

      .catch(function (error) {
        console.log(error);
        if (error.message === "Request failed with status code 400") {
          openNotificationWithIcon(
            "error",
            "Same Name student already existed in seleted team"
          );
        }
      });
    setShow(false);
  };
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Enrolled Students</h4>
                {/* <h6>You can &quot;Create Teams&quot; & then &quot;View&quot; , &quot;Edit&quot; , &quot;Delete&quot; & &quot;Swap&quot; students in teams</h6> */}
              </div>
            </div>
            <ul className="table-top-head">
              <li>
                <div className="page-btn mb-2">
                  <Link to="/CreatepilotStudent" className="btn btn-added btn-primary">
                    <PlusCircle className="me-2" style={{ color: "white" }} />
                    Add Students
                  </Link>
                </div>
              </li>
            </ul>
          </div>

          {show && (
            <Modal
              show={show}
              // onHide={() => setShow(false)}
              //{...props}
              // size="sm"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              className="assign-evaluator ChangePSWModal teacher-register-modal"
              backdrop="static"
            // scrollable={true}
            >
              <Modal.Header closeButton onHide={() => setShow(false)}>
                <Modal.Title
                  id="contained-modal-title-vcenter"
                  className="w-100 d-block text-center"
                >
                  Teams Change
                </Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <div className="my-3 text-center ">
                  <h3 className="mb-sm-4 mb-3">
                    Please select Team to switch student
                  </h3>
                  <Select
                    list={teamlist}
                    setValue={setvalue}
                    placeHolder={"Please Select team"}
                    value={value}
                  />
                </div>

                <div className="text-center">
                  <button
                    label={"Submit"}
                    // btnClass={!value ? "default" : "primary"}
                    className="btn btn-warning"
                    onClick={() => handleChangeStudent(value)}
                    disabled={!value}
                  >
                    Submit
                  </button>
                </div>
              </Modal.Body>
            </Modal>
          )}
          <Row>
            <Col className="form-group">
              {/* <h4>Teams List</h4> */}
              <div className="ticket-data">
                <div className="my-2">
                  <DataTableExtensions
                    print={false}
                    export={false}
                    filter={false}
                    {...adminTeamsList}
                  >
                    <DataTable
                      data={teamsArray}
                      defaultSortField="id"
                      filter={false}
                      customStyles={customStyles}
                      defaultSortAsc={false}
                      pagination={false}
                      highlightOnHover
                      fixedHeader
                      subHeaderAlign={Alignment.Center}
                      paginationRowsPerPageOptions={[25, 50, 100]}
                      paginationPerPage={25}
                    />
                  </DataTableExtensions>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ teams }) => {
  const { teamsMembersList } = teams;
  return { teamsMembersList };
};

export default connect(mapStateToProps, {
  getAdminTeamMembersListAction: getAdminTeamMembersList,
})(Dashboard);
