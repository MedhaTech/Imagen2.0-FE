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

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Tooltip } from "react-bootstrap";

import {
  getAdminTeamMembersList,
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
  const [finalteamlist, setFinalteamlist] = useState([]);
  const [selectedstudent, setselectedstudent] = useState();
  const [teamchangeobj, setteamchangeObj] = useState({});
  const [value, setvalue] = useState("");

  useEffect(() => {
    teamListbymentorid();
  }, []);

  const teamListbymentorid = () => {
    const queryparm = encryptGlobal(
      JSON.stringify({
        college_name: currentUser.data[0]?.college_name,
      })
    );
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/students/ListOfPilotStudent?Data=${queryparm}`,
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
    var teamObj = {};
    var teamlist = [];
    teamsList.map((teams, index) => {
      var key = index + 1;
      if (teams.crewCount < 3 && teams.ideaStatus === null) {
        teamObj[teams.full_name] = teams.student_id;
        teamlist.push(teams.full_name);
      }
      return teamsArrays.push({
        ...teams,
        key,
        crewMembers: JSON.parse(teams.crewDetails),
      });
    });
    setteamlist(teamlist);
    setteamchangeObj(teamObj);
    setTeamsArray(teamsArrays);
  }, [teamsList]);

  const handleCreate = (item) => {
    // where item = team name //
    // where we can add team member details //
    navigate(`/addstudent`, { state: { student_id: item.student_id } });
  };
  const handleEditData = (student_id) => {
    navigate(`/Institution-student-edit`, {
      state: { student_id: student_id },
    });
  };

  const renderAddTooltip = (name, number) => (
    <Tooltip id="refresh-tooltip">
      {`Add Crew-${number} Member to ${name}`}
    </Tooltip>
  );
  const renderEditTooltip = (name) => (
    <Tooltip id="refresh-tooltip">{`Edit ${name} Details`}</Tooltip>
  );
  const renderSwitchTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Change Team
    </Tooltip>
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
    navigate(`/view-profile`, { state: { student_id: student_id } });
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
        selector: (row) => (
          <div>
            <strong
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}
            >
              {row?.full_name.length > 10 ? `${row?.full_name.slice(0, 10)}...` : row?.full_name}
            </strong>
            <OverlayTrigger
              placement="top"
              overlay={renderEditTooltip(row?.full_name)}
            >
              <div
                className="btn text-info"
                style={{ fontSize: "1rem" }}
                onClick={() => handleEditData(row.student_id)}
              >
                {" "}
                <i data-feather="edit" className="feather-edit" />
              </div>
            </OverlayTrigger>
            {row.ideaStatus === null && (
              <OverlayTrigger
                placement="top"
                overlay={renderDelTooltip(row?.full_name)}
              >
                <div
                  className="btn text-danger"
                  style={{ fontSize: "1rem", cursor: "pointer" }}
                  onClick={() => handleDeletePilot(row.student_id)}
                >
                  <i data-feather="trash-2" className="feather-trash-2" />
                </div>
              </OverlayTrigger>
            )}

            <OverlayTrigger
              placement="top"
              overlay={renderViewTooltip(row?.full_name)}
            >
              <div
                className="btn text-dark"
                style={{ fontSize: "1rem" }}
                onClick={() => viewDetails(row.student_id)}
              >
                {<i data-feather="eye" className="feather-eye" />}{" "}
              </div>
            </OverlayTrigger>
          </div>
        ),
        width: "23%",
      },
      {
        name: <b style={{ color: "crimson" }}>Crew-1</b>,
        selector: (row) => (
          <div>
            {row?.crewMembers?.length >= 1 ? (
              <>
                {" "}
                <strong
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                  }}
                >
                  {row?.crewMembers[0]?.full_name.length > 10 ? `${row?.crewMembers[0]?.full_name.slice(0, 10)}...` : row?.crewMembers[0]?.full_name}
                </strong>
                <OverlayTrigger
                  placement="top"
                  overlay={renderEditTooltip(row?.crewMembers[0]?.full_name)}
                >
                  <div
                    className="btn text-info"
                    style={{ fontSize: "1rem" }}
                    onClick={() =>
                      handleEditData(row?.crewMembers[0]?.student_id)
                    }
                  >
                    {" "}
                    <i data-feather="edit" className="feather-edit" />
                  </div>
                </OverlayTrigger>
                {row.ideaStatus === null && (
                  <OverlayTrigger placement="top" overlay={renderSwitchTooltip}>
                    <div
                      className="btn text-dark"
                      style={{ fontSize: "1rem" }}
                      onClick={() =>
                        handleSwitchTeam(
                          row?.crewMembers[0]?.student_id,
                          row?.full_name
                        )
                      }
                    >
                      {" "}
                      <i data-feather="user" className="feather-user" />
                    </div>
                  </OverlayTrigger>
                )}
                {row.ideaStatus === null && (
                  <OverlayTrigger
                    placement="top"
                    overlay={renderDelTooltip(row?.crewMembers[0]?.full_name)}
                  >
                    <div
                      className="btn text-danger"
                      style={{ fontSize: "1rem" }}
                      onClick={() =>
                        handleDeleteStudent(row?.crewMembers[0]?.student_id)
                      }
                    >
                      {" "}
                      <i data-feather="trash-2" className="feather-trash-2" />
                    </div>
                  </OverlayTrigger>
                )}
                <OverlayTrigger
                  placement="top"
                  overlay={renderViewTooltip(row?.crewMembers[0]?.full_name)}
                >
                  <div
                    className="btn text-dark"
                    style={{ fontSize: "1rem" }}
                    onClick={() => viewDetails(row?.crewMembers[0]?.student_id)}
                  >
                    {<i data-feather="eye" className="feather-eye" />}{" "}
                  </div>
                </OverlayTrigger>
              </>
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={renderAddTooltip(row?.full_name, 1)}
              >
                <div
                  className="btn text-success"
                  style={{ fontSize: "1rem" }}
                  onClick={() => handleCreate(row)}
                >
                  {" "}
                  <i
                    data-feather="plus-circle"
                    className="feather-plus-circle"
                  />
                </div>
              </OverlayTrigger>
            )}
          </div>
        ),
        width: "23%",
      },
      {
        name: <b style={{ color: "crimson" }}>Crew-2</b>,
        selector: (row) => (
          <div>
            {row?.crewMembers?.length >= 2 ? (
              <>
                {" "}
                <strong
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                  }}
                >
                  {row?.crewMembers[1]?.full_name.length > 10 ? `${row?.crewMembers[1]?.full_name.slice(0, 10)}...` : row?.crewMembers[1]?.full_name}

                </strong>
                <OverlayTrigger
                  placement="top"
                  overlay={renderEditTooltip(row?.crewMembers[1]?.full_name)}
                >
                  <div
                    className="btn text-info"
                    style={{ fontSize: "1rem" }}
                    onClick={() =>
                      handleEditData(row?.crewMembers[1]?.student_id)
                    }
                  >
                    {" "}
                    <i data-feather="edit" className="feather-edit" />
                  </div>
                </OverlayTrigger>
                {row.ideaStatus === null && (
                  <OverlayTrigger placement="top" overlay={renderSwitchTooltip}>
                    <div
                      className="btn text-dark"
                      style={{ fontSize: "1rem" }}
                      onClick={() =>
                        handleSwitchTeam(
                          row?.crewMembers[1]?.student_id,
                          row?.full_name
                        )
                      }
                    >
                      {" "}
                      <i data-feather="user" className="feather-user" />
                    </div>
                  </OverlayTrigger>
                )}
                {row.ideaStatus === null && (
                  <OverlayTrigger
                    placement="top"
                    overlay={renderDelTooltip(row?.crewMembers[1]?.full_name)}
                  >
                    <div
                      className="btn text-danger"
                      style={{ fontSize: "1rem" }}
                      onClick={() =>
                        handleDeleteStudent(row?.crewMembers[1]?.student_id)
                      }
                    >
                      {" "}
                      <i data-feather="trash-2" className="feather-trash-2" />
                    </div>
                  </OverlayTrigger>
                )}
                <OverlayTrigger
                  placement="top"
                  overlay={renderViewTooltip(row?.crewMembers[1]?.full_name)}
                >
                  <div
                    className="btn text-dark"
                    onClick={() => viewDetails(row?.crewMembers[1]?.student_id)}
                  >
                    {<i data-feather="eye" className="feather-eye" />}{" "}
                  </div>
                </OverlayTrigger>
              </>
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={renderAddTooltip(row?.full_name, 2)}
              >
                <div
                  className="btn text-success"
                  style={{ fontSize: "1rem" }}
                  onClick={() => handleCreate(row)}
                >
                  {" "}
                  <i
                    data-feather="plus-circle"
                    className="feather-plus-circle"
                  />
                </div>
              </OverlayTrigger>
            )}
          </div>
        ),
        width: "23%",
      },
      {
        name: <b style={{ color: "crimson" }}>Crew-3</b>,
        selector: (row) => (
          <div>
            {row?.crewMembers?.length >= 3 ? (
              <>
                {" "}
                <strong
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                  }}
                >
                  {row?.crewMembers[2]?.full_name.length > 10 ? `${row?.crewMembers[2]?.full_name.slice(0, 10)}...` : row?.crewMembers[2]?.full_name}

                </strong>
                <OverlayTrigger
                  placement="top"
                  overlay={renderEditTooltip(row?.crewMembers[2]?.full_name)}
                >
                  <div
                    className="btn text-info"
                    style={{ fontSize: "1rem" }}
                    onClick={() =>
                      handleEditData(row?.crewMembers[2]?.student_id)
                    }
                  >
                    {" "}
                    <i data-feather="edit" className="feather-edit" />
                  </div>
                </OverlayTrigger>
                {row.ideaStatus === null && (
                  <OverlayTrigger placement="top" overlay={renderSwitchTooltip}>
                    <div
                      className="btn text-dark"
                      style={{ fontSize: "1rem" }}
                      onClick={() =>
                        handleSwitchTeam(
                          row?.crewMembers[2]?.student_id,
                          row?.full_name
                        )
                      }
                    >
                      {" "}
                      <i data-feather="user" className="feather-user" />
                    </div>
                  </OverlayTrigger>
                )}
                {row.ideaStatus === null && (
                  <OverlayTrigger
                    placement="top"
                    overlay={renderDelTooltip(row?.crewMembers[2]?.full_name)}
                  >
                    <div
                      className="btn text-danger"
                      style={{ fontSize: "1rem" }}
                      onClick={() =>
                        handleDeleteStudent(row?.crewMembers[2]?.student_id)
                      }
                    >
                      {" "}
                      <i data-feather="trash-2" className="feather-trash-2" />
                    </div>
                  </OverlayTrigger>
                )}
                <OverlayTrigger
                  placement="top"
                  overlay={renderViewTooltip(row?.crewMembers[2]?.full_name)}
                >
                  <div
                    className="btn text-dark"
                    onClick={() => viewDetails(row?.crewMembers[2]?.student_id)}
                  >
                    {<i data-feather="eye" className="feather-eye" />}{" "}
                  </div>
                </OverlayTrigger>
              </>
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={renderAddTooltip(row?.full_name, 3)}
              >
                <div
                  className="btn text-success"
                  style={{ fontSize: "1rem" }}
                  onClick={() => handleCreate(row)}
                >
                  {" "}
                  <i
                    data-feather="plus-circle"
                    className="feather-plus-circle"
                  />
                </div>
              </OverlayTrigger>
            )}
          </div>
        ),
        width: "23%",
      },
    ],
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
        const delparamId = encryptGlobal(id);
        var config = {
          method: "delete",
          url: process.env.REACT_APP_API_BASE_URL + "/students/" + delparamId,
          headers: {
            "Content-Type": "application/json",
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
          url:
            process.env.REACT_APP_API_BASE_URL +
            "/students/" +
            delparamId +
            "/deleteAllData",
          headers: {
            "Content-Type": "application/json",
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

  const customStyles = {
    head: {
      style: {
        fontSize: "1em", // Adjust as needed
      },
    },
  };
  const handleSwitchTeam = (id, teamName) => {
    var filterarray = teamlist.filter((item) => item !== teamName);
    setFinalteamlist(filterarray);
    setselectedstudent(id);
    setShow(true);
  };

  const handleChangeStudent = (name) => {
    const body = {
      type: teamchangeobj[name].toString(),
    };
    const stuparamId = encryptGlobal(JSON.stringify(selectedstudent));
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
          teamListbymentorid();
          openNotificationWithIcon("success", "Successfully Shifted Student");
        } else {
          openNotificationWithIcon(
            "error",
            "Opps! Student shift was unsuccessful"
          );
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
              </div>
            </div>
            <ul className="table-top-head">
              <li>
                <div className="page-btn mb-2">
                  <Link
                    to="/CreatepilotStudent"
                    className="btn btn-added btn-primary"
                  >
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
             
              aria-labelledby="contained-modal-title-vcenter"
              centered
              className="assign-evaluator ChangePSWModal teacher-register-modal"
              backdrop="static"
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
                    list={finalteamlist}
                    setValue={setvalue}
                    placeHolder={"Please Select team"}
                    value={value}
                  />
                </div>

                <div className="text-center">
                  <button
                    label={"Submit"}
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
