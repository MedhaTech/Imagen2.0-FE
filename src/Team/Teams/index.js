/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, List, Label, Card } from "reactstrap";

import { encryptGlobal } from "../../constants/encryptDecrypt";
import "react-data-table-component-extensions/dist/index.css";
import { getCurrentUser, openNotificationWithIcon } from "../../helpers/Utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Tooltip } from "react-bootstrap";
import { getAdminTeamMembersList } from "../../redux/actions";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import "./tables.css";
import user from "../../assets/img/user.png";
import { PlusCircle } from "feather-icons-react/build/IconComponents";
import Avatar from "react-string-avatar";

const Dashboard = (props) => {
  const navigate = useNavigate();
  const [teamsArray, setTeamsArray] = useState([]);
  const currentUser = getCurrentUser("current_user");
  const [hidebutton, setHideButton] = useState("");
  const [ideaStatus,setIdeaStatus]=useState("");
  useEffect(() => {
    teamListbymentorid();
  }, []);
  const TeamId =
    currentUser?.data[0]?.type_id === 0
      ? currentUser?.data[0]?.student_id
      : currentUser?.data[0]?.type_id;

  const teamListbymentorid = () => {
    const queryteam = encryptGlobal(
      JSON.stringify({
        team: true,
        student_id: TeamId,
      })
    );
    var config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL + `/students?Data=${queryteam}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setTeamsArray(response.data.data);
          setHideButton(response.data.count);
          // console.log(response, "Single user");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  // const handleCreate = (student_id) => {
  //   // where item = team name //
  //   // where we can add team member details //
  //   navigate(`/student-teamAdd`,
  //     { state: { student_id: student_id } }
  //   );
  // };

  const renderEditTooltip = (name) => (
    <Tooltip id="refresh-tooltip">{`Edit ${name} Details`}</Tooltip>
  );
  const renderDelTooltip = (name) => (
    <Tooltip id="refresh-tooltip">{`Delete ${name}`}</Tooltip>
  );
  const renderViewTooltip = (name) => (
    <Tooltip id="refresh-tooltip" {...props}>
      {`View ${name}`}
    </Tooltip>
  );

  const viewDetails = (student_id) => {
    navigate(`/student-teamView`, { state: { student_id: student_id } });
  };

  const handleEditData = (student_id) => {
    navigate(`/student-teamEdit`, { state: { student_id: student_id } });
  };
useEffect(()=>{
  stuIdeaSubStatus();
},[]);
  const stuIdeaSubStatus = () => {
    const ideaSubApi = encryptGlobal(
      JSON.stringify({
        student_id: currentUser?.data[0]?.type_id === 0 ? currentUser?.data[0]?.student_id : currentUser?.data[0]?.type_id
      })
    );
    var config = {
      method: 'get',
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/challenge_response/submittedDetails?Data=${ideaSubApi}`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json', 
        Authorization: `Bearer ${currentUser.data[0]?.token}`
      }
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          // console.log(response, "ideaSubApi");
          setIdeaStatus(response.data.data[0].status);
        }
      })
      .catch(function (error) {
        // console.log(error,"error");
        if (error.response.data.status === 404) {
          // setStuIdeaSub("Not Started");
        }

      });
  };
  const handleDeleteStudent = (id) => {
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
        const delparamId = encryptGlobal(JSON.stringify(id));
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
              teamListbymentorid();
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

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Manage Team</h4>
                {/* <h6>You can &quot;Create Teams&quot; & then &quot;View&quot; , &quot;Edit&quot; , &quot;Delete&quot; & &quot;Swap&quot; students in teams</h6> */}
              </div>
            </div>
            {currentUser?.data[0]?.type_id === 0 && hidebutton < 4 && (
              <ul className="table-top-head">
                <li>
                  <div className="page-btn mb-2">
                    <Link
                      to="/student-teamAdd"
                      className="btn btn-added btn-primary"
                    >
                      <PlusCircle className="me-2" style={{ color: "white" }} />
                      Add Crew Member
                    </Link>
                  </div>
                </li>
              </ul>
            )}
          </div>
          <div className="employee-grid-widget" style={{ height: "300px" }}>
            <div className="row">
              {teamsArray.map((student, i) => (
                <div key={i} className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
                  <div
                    className="employee-grid-profile"
                    style={{ height: "300px" }}
                  >
                    <div className="profile-head">
                      <div className="profile-head-action">
                        {currentUser?.data[0]?.type_id === 0 && (
                          <OverlayTrigger
                            placement="top"
                            overlay={renderEditTooltip(student.full_name)}
                          >
                            <div
                              className="btn text-info"
                              style={{ fontSize: "1rem" }}
                              onClick={() => handleEditData(student.student_id)}
                            >
                              {" "}
                              <i data-feather="edit" className="feather-edit" />
                            </div>
                          </OverlayTrigger>
                        )}
                        {currentUser?.data[0]?.type_id === 0 && student.type !== 0 && ideaStatus !== "SUBMITTED" && (
                          <OverlayTrigger
                            placement="top"
                            overlay={renderDelTooltip(student?.full_name)}
                          >
                            <div
                              className="btn text-danger"
                              style={{ fontSize: "1rem" }}
                              
                              onClick={() =>
                                handleDeleteStudent(student?.student_id)
                              }
                            >
                              {" "}
                              <i
                                data-feather="trash-2"
                                className="feather-trash-2"
                              />
                            </div>
                          </OverlayTrigger>
                        )}
                        <OverlayTrigger
                          placement="top"
                          overlay={renderViewTooltip(student?.full_name)}
                        >
                          <div
                            className="btn text-dark"
                            onClick={() => viewDetails(student?.student_id)}
                          >
                            {<i data-feather="eye" className="feather-eye" />}{" "}
                          </div>
                        </OverlayTrigger>
                      </div>
                    </div>
                    <div className="profile-info">
                      <div className="profile-pic active-profile">
                        {/* <img
                          src={user}
                          alt="Profile"
                          style={{ width: "64px", height: "64px" }}
                        /> */}
                        <Avatar
                          initials={student?.full_name
                            .split(" ")
                            .map((w) => w.charAt(0))
                            .join("")}
                          bgColor="#36adf2"
                          textColor="black"
                          roundShape="true"
                          pictureResolution={256}
                          width={64}
                        ></Avatar>
                      </div>
                      <h4 style={{ color: "orange" }}>{student.full_name}</h4>
                    </div>
                    <ul className="department">
                      <li>
                        Mobile<span>{student.mobile}</span>{" "}
                      </li>
                      <li>
                        Roll Number
                        <span>
                          {student.roll_number.length > 12
                            ? `${student.roll_number.slice(0, 12)}...`
                            : student.roll_number}
                        </span>
                      </li>
                      {/* <li>
                        Roll Number<span>{student.roll_number}</span>{" "}
                      </li> */}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* <Row className="pt-2">
                    <Card className="w-100 p-5">
                      <div>
                        <Label className="text-danger">
                            Instructions for adding Teams :
                        </Label>
                        <h4 style={{fontWeight:"bold"}}>
                        Who Can Register?
                        </h4>
                        <ul >
                            <li style={{listStyleType:"disc"}}>
                            Are you 16 years or older?
                            </li>
                            <li style={{listStyleType:"disc"}}>Are you studying diploma/UG/PG in a college within the state?</li>
                            <li style={{listStyleType:"disc"}}>
                            Do you have a passion for innovation, entrepreneurship, and making an impact?
                            </li>
                        </ul>
                        <br/>
                        <p>If your answer to all these questions is <b>“Yes”</b>, then you’re good to go! 🚀
                        </p>
                        <h4 style={{fontWeight:"bold"}}>
                        How Can You Register?

                        </h4>
                          <p ><span style={{fontWeight:"bold"}}>1. Form a Team</span>
                        <ul >
                            <li style={{listStyleType:"disc"}}>
                            Teams must have <b>1 to 4 participants</b>.
                            </li>
                            <li style={{listStyleType:"disc"}}>One member will act as the <b>“Pilot”</b> (team leader) and be the main point of contact.</li>
                            <li style={{listStyleType:"disc"}}>
                            Other members are the <b>“Crew”</b>.
                            </li>
                        </ul>
                            </p>
                        <p ><span style={{fontWeight:"bold"}}>2. Pilot Starts Registration</span>
                        <ul >
                            <li style={{listStyleType:"disc"}}>
                            Enter the Pilot’s personal details.
                            </li>
                            <li style={{listStyleType:"disc"}}>Choose a <b>unique team name</b> and set a <b>team password</b>.</li>
                            <li style={{listStyleType:"disc"}}>
                            Add the details of all Crew members.
                            </li>
                        </ul>
                            </p>
                        <p ><span style={{fontWeight:"bold"}}>3. Set Up Team Logins
                        </span>
                        <ul >
                            <li style={{listStyleType:"disc"}}>
                            All team members log in using their registered email and the team password (default).
                            </li>
                            <li style={{listStyleType:"disc"}}>Members can reset and create their own passwords anytime.</li>
                        </ul>
                            </p>
                        <p ><span style={{fontWeight:"bold"}}>4. Manage Your Team
                        </span>
                        <ul >
                            <li style={{listStyleType:"disc"}}>
                            The Pilot can edit Crew details or add members until the program begins.
                            </li>
                        </ul>
                            </p>
                        </div>
                    </Card>
                </Row> */}
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
