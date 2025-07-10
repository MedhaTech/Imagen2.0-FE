/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect, useState } from "react";
import { encryptGlobal } from "../../constants/encryptDecrypt";
import {
  getCurrentUser,
  setCurrentUser,
  openNotificationWithIcon,
} from "../../helpers/Utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BiLogoMicrosoftTeams } from "react-icons/bi";
import { MdEventNote } from "react-icons/md";
import DataTableExtensions from "react-data-table-component-extensions";
import DataTable, { Alignment } from "react-data-table-component";
import { CheckCircle } from "react-feather";
import { IoHelpOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";
const MentorCalls = () => {
  const currentUser = getCurrentUser("current_user");
  const location = useLocation();

  const navigate = useNavigate();
  const [studentCount, setStudentCount] = useState([]);
  const [data, setData] = useState([]);
  const [hide, setHide] = useState(false);
  const [teamId, setTeamId] = useState(null);
  const [callList, setCallList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const cid = location.state?.challenge_response_id;

  useEffect(() => {
    mentorTeamsCount(currentUser?.data[0]?.user_id);
  }, []);

  const mentorTeamsCount = (id) => {
    const surveyApi = encryptGlobal(
      JSON.stringify({
        user_id: id,
      })
    );
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/mentorships/seletedteams?Data=${surveyApi}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setStudentCount(response.data.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleChat = (student) => {
    setTeamId(student.challenge_response_id);
    localStorage.setItem("selectedCID", student.challenge_response_id);
  };
  const handleAddEvent = () => {
    const cid = localStorage.getItem("selectedCID");

    navigate("/add-event", {
      state: { id: cid },
    });
  };
useEffect(() => {
  if (cid) {
    setTeamId(cid); 
    localStorage.setItem("selectedCID", cid);
  }
}, [cid]);
  useEffect(() => {
    if (teamId) {
      handleResList(teamId);
      setHide(true);
    }
  }, [teamId]);

  async function handleResList(teamId) {
    //  handleResList Api where we can see list of all resource //
    const query = encryptGlobal(
      JSON.stringify({
        challenge_response_id: teamId,
      })
    );
    let config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL + `/schedule_calls?Data=${query}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
    };
    await axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setCallList(response.data && response.data.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const callsData = {
    data: callList && callList.length > 0 ? callList : [],
    columns: [
      {
        name: "No",
        selector: (row, key) => key + 1,
        sortable: true,
        width: "5rem",
      },
      {
        name: "Meeting link",
        selector: (row) => {
          return (
            <a
              style={{ cursor: "pointer", color: "blue" }}
              href={row.meet_link}
              target="_blank"
              rel="noreferrer"
            >
              {row.meet_link}
            </a>
          );
        },
        width: "30rem",
      },
      {
        name: "Date & Time",
        selector: (row) => {
          const date = new Date(row.timing);
          const formattedDate = new Intl.DateTimeFormat("en-IN", {
            dateStyle: "full",
            timeStyle: "medium",
            timeZone: "Asia/Kolkata",
          }).format(date);
          return formattedDate;
        },
        width: "20rem",
      },
      {
        name: "Acceptance of Student",
        selector: (row) => {
          return row.stu_accept == 1 ? (
            <CheckCircle size={20} color="#28C76F" />
          ) : (
            <IoHelpOutline size={20} color="#FF0000" />
          );
        },
        center: true,
        width: "13rem",
      },
      {
        name: "Actions",
        left: true,
        width: "10rem",
        cell: (record) => [
          <>
            <button
              className="btn btn-info btn-sm me-1"
              onClick={() => handleEdit(record)}
              title="Edit Progress"
            >
              <i data-feather="edit" className="feather-edit" /> Update
            </button>
          </>,
        ],
      },
    ],
  };
  const handleEdit = (data) => {
    navigate("/edit-event", { state: data });
  };
  useEffect(() => {
    const shouldShowTable = location.state?.showTable;
    const challengeResponseId = location.state?.challenge_response_id;

    if (shouldShowTable && challengeResponseId) {
      setHide(true);
      handleResList(challengeResponseId);
    }
  }, [location.state]);
  const customStyles = {
    rows: {
      style: {
        fontSize: "14px",
      },
    },
    headCells: {
      style: {
        fontSize: "16px",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
      },
    },
  };
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex justify-content-between align-items-center mb-3 w-100">
              <div className="page-title">
                <h4 className="mb-0">Schedule Calls</h4>
              </div>
              {hide && (
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleAddEvent}
                  >
                    Add Event
                  </button>

                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setHide(false);
                       setTeamId(null);
                      localStorage.removeItem("selectedStudent");
                    }}
                  >
                    Back to Cards
                  </button>
                </div>
              )}
            </div>
          </div>
          {!hide && (
            <div className="employee-grid-widget">
              <div className="row">
                {studentCount?.length > 0 ? (
                  studentCount.map((student, i) => (
                    <div
                      key={i}
                      className="col-xxl-3 col-xl-4 col-lg-6 col-md-6"
                    >
                      <div className="employee-grid-profile">
                        <div className="profile-head">
                          <div className="profile-head-action">
                            <button
                              type="button"
                              className="btn btn-outline-warning text-center w-auto me-1"
                              onClick={() => handleChat(student)}
                            >
                              <MdEventNote size="20px" />
                              Event
                            </button>
                          </div>
                        </div>
                        <div className="profile-info">
                          <div className="profile-pic active-profile">
                            <div style={{ width: "64px", height: "64px" }}>
                              <BiLogoMicrosoftTeams
                                style={{ width: "100%", height: "100%" }}
                              />
                            </div>
                          </div>
                          <h4 style={{ color: "orange" }}>
                            CID : {student?.challenge_response_id}
                          </h4>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted">
                    There are no teams assigned yet.
                  </p>
                )}
              </div>
            </div>
          )}
          {hide && (
            <div style={{ marginTop: "1rem" }}>
              <DataTableExtensions
                print={false}
                export={false}
                {...callsData}
                exportHeaders
              >
                <DataTable
                  data={callList}
                  // noHeader
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
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorCalls;
