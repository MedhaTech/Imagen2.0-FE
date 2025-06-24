/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect, useState } from "react";
import { encryptGlobal } from "../../constants/encryptDecrypt";
import { getCurrentUser, setCurrentUser } from "../../helpers/Utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BiLogoMicrosoftTeams } from "react-icons/bi";
import { MdEventNote } from "react-icons/md";
const MentorCalls = () => {
  const currentUser = getCurrentUser("current_user");
  const navigate = useNavigate();
  const [studentCount, setStudentCount] = useState([]);
  const [data, setData] = useState([]);
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
  const mentorGetApi = (id) => {
    const surveyApi = encryptGlobal(
      JSON.stringify({
        challenge_response_id: id,
      })
    );
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/schedule_calls?Data=${surveyApi}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          const apiData = response.data?.data;
console.log(response,"res");
          if (
            Array.isArray(apiData) &&
            (apiData.length === 0 ||
              (apiData.length === 1 && Object.keys(apiData[0]).length === 0))
          ) {
            setTimeout(()=>{
              navigate("/add-event", { state: { id } });
            },500);
          } else {
             setTimeout(()=>{
               navigate("/edit-event", { state: { id } });
            },500);

          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleChat = (student) => {
    
    mentorGetApi(student.challenge_response_id);
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Schedule Calls</h4>
                <h6>Manage your Calls</h6>
              </div>
            </div>
          </div>

          <div className="employee-grid-widget">
            <div className="row">
              {studentCount?.length > 0 ? (
                studentCount.map((student, i) => (
                  <div key={i} className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
                    <div className="employee-grid-profile">
                      <div className="profile-head">
                        <div className="profile-head-action">
                          <button
                            type="button"
                            className="btn btn-outline-warning text-center w-auto me-1"
                            onClick={() => handleChat(student)}
                          >
                            <MdEventNote size="20px" /> Create Event
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
        </div>
      </div>
    </div>
  );
};

export default MentorCalls;
