/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect, useState } from "react";
import { RiTeamFill } from "react-icons/ri";
import { SiTicktick } from "react-icons/si";
import { SlCalender } from "react-icons/sl";
import { FaCircleUser } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { encryptGlobal } from "../../constants/encryptDecrypt";
import axios from "axios";
import { getCurrentUser, openNotificationWithIcon } from "../../helpers/Utils";
import { RxDotFilled } from "react-icons/rx";
import { BsListCheck } from "react-icons/bs";
import { IoIosVideocam } from "react-icons/io";
import { BiSolidMessageRounded } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { AiOutlineSchedule } from "react-icons/ai";
const DBStu = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser("current_user");
  const [cidList, setCidList] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    mentorChatBox(currentUser?.data[0]?.user_id);
    mentorTeamCount(currentUser?.data[0]?.user_id);
    mentorsetMilestoneCount(currentUser?.data[0]?.user_id);
    mentorschedule_calls(currentUser?.data[0]?.user_id);
    challengesListApi(currentUser?.data[0]?.user_id);
  }, []);
 

   const [teamCount, setTeamCount] = useState([]);
  const mentorTeamCount = (id) => {
    const surveyApi = encryptGlobal(
      JSON.stringify({
        user_id: id,
      })
    );
    var config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL + `/dashboard/MSteamCount?Data=${surveyApi}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setTeamCount(response.data.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const [milestoneCount, setMilestoneCount] = useState([]);
  const mentorsetMilestoneCount = (id) => {
    const surveyApi = encryptGlobal(
      JSON.stringify({
        user_id: id,
      })
    );
    var config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL + `/dashboard/MmileStoneCount?Data=${surveyApi}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setMilestoneCount(response.data.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const [completedCall, setCompletedCall] = useState([]);
  const [incompletedCall, setIncompletedCall] = useState([]);
  const mentorschedule_calls = (id) => {
    const surveyApi = encryptGlobal(
      JSON.stringify({
        user_id: id,
      })
    );
    var config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL + `/dashboard/MschedulecallsCount?Data=${surveyApi}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setCompletedCall(response.data.data[0].scheduleCompleted);
          setIncompletedCall(response.data.data[0].scheduleCompleted);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const mentorChatBox = (id) => {
    const surveyApi = encryptGlobal(
      JSON.stringify({
        user_id: id,
      })
    );
    var config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL + `/chatboxs?Data=${surveyApi}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setData(response.data.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const challengesListApi = (id) => {
    const surveyApi = encryptGlobal(
      JSON.stringify({ mentorship_user_id: id})
    );
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/challenge_response/ideasformentorship?Data=${surveyApi}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          // console.log(response, "cid");
          setCidList(response.data.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleMessage = (student) => {
    const challengeId = student;
    const mentorId = currentUser.data[0]?.user_id;

    const matchingChatbox = data.find(
      (chat) =>
        chat.challenge_response_id === challengeId &&
        chat.mentorship_user_id === mentorId
    );

    if (matchingChatbox) {
      const chatboxId = matchingChatbox.chatbox_id;

      navigate(`/add-Mchat?id=${challengeId}`, {
        state: {
          ...student,
          chatbox_id: chatboxId,
        },
      });
    } else {
      createChatboxid(challengeId, student);
    }
  };
  const createChatboxid = (challengeId, student) => {
    const body = JSON.stringify({
      challenge_response_id: challengeId,
      mentorship_user_id: currentUser.data[0]?.user_id,
    });

    var config = {
      method: "post",
      url: process.env.REACT_APP_API_BASE_URL + `/chatboxs`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
      data: body,
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          // const response = response.data.data;
          // setData(response.data.data);

          navigate(`/add-Mchat?id=${challengeId}`, {
            state: {
              ...student,
              chatbox_id: response.data.data.chatbox_id,
            },
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleMilestone = (item) => {
    navigate(`/mentor-milestone`, {
      state: {
        challenge_response_id: item,
      },
    });
  };
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      <div className="page-wrapper" id="start">
        <div className="content">
          <div className="welcome d-lg-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center welcome-text">
              <h3 className="d-flex align-items-center">
                <span style={{ fontSize: "30px" }}>👋</span>
                {/* &nbsp;Hi {currentUser?.data[0]?.full_name}&nbsp; */}
              </h3>

              <h6>
                {" "}
                here&apos;s what&apos;s happening with your Youth for Social
                Impact 2025 today.
              </h6>
            </div>
          </div>
          <div className="row m-3">
            <div className="col-xl-3 col-sm-6 col-12 mb-1 mt-1">
              <div
                className="dash-widget dash2 w-100"
                style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
              >
                <div className="dash-widgetimg">
                  <span>
                    <RiTeamFill
                      style={{ width: "70%", height: "auto", color: "blue" }}
                    />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>{teamCount}</h5>
                  <h6>My Teams</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12  mb-1 mt-1">
              <div
                className="dash-widget dash1 w-100"
                style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
              >
                <div className="dash-widgetimg">
                  <span>
                    <SlCalender size={30} style={{ color: "#800080" }} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>{incompletedCall}</h5>
                  <h6>Upcoming Sessions</h6>
                </div>
              </div>
            </div>
             <div className="col-xl-3 col-sm-6 col-12  mb-1 mt-1">
              <div
                className="dash-widget dash1 w-100"
                style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
              >
                <div className="dash-widgetimg">
                  <span>
                    <AiOutlineSchedule size={35} style={{ color: "#28C76F" }} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>{completedCall}</h5>
                  <h6>Completed sessions</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 mb-1 mt-1">
              <div
                className="dash-widget dash3 w-100"
                style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
              >
                <div className="dash-widgetimg">
                  <span>
                    <SiTicktick size={30} style={{ color: "green" }} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>{milestoneCount}</h5>
                  <h6>Milestone</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <h5 className="mb-3">My Assigned Ideas</h5>

            {cidList && cidList.length > 0 ? (
              cidList.map((discussion) => (
                <div
                  key={discussion.challenge_response_id}
                  className="col-md-12"
                >
                  <div className="card" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                    <div className="card-body" style={{ padding: "1rem" }}>
                    
                      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "1rem",
    // marginBottom: "1rem",
  }}
>
  <div style={{ flex: "1 1 auto", minWidth: "250px" }}>
    <div style={{ marginBottom: "1rem" ,marginTop:"1rem"}}>
      <span style={{ fontSize: "16px", fontWeight: "bold" }}>
        Theme Name:{" "}
      </span>
      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
        {discussion.theme}
      </span>
    </div>
    <div style={{ marginBottom: "1rem" ,marginTop:"1rem"}}>
      <span style={{ fontSize: "16px", fontWeight: "bold" }}>
        Team Members:{" "}
      </span>
      <span style={{ fontSize: "14px" }}>
        {discussion.team_members?.[0]?.split(" ").join(", ")}
      </span>
    </div>
    <div style={{ marginBottom: "1rem" ,marginTop:"1rem"}}>
      <span style={{ fontSize: "16px", fontWeight: "bold" }}>
        Idea Description:{" "}
      </span>
      <span style={{ fontSize: "14px" }}>{discussion.idea_describe}</span>
    </div>
  </div>

  <div
    style={{
      display: "flex",
      // flexDirection: "column",
      // alignItems: "flex-start",
      flexDirection: isMobile ? "row" : "column",
        alignItems: isMobile ? "center" : "flex-start",
        flexWrap: isMobile ? "wrap" : "nowrap",
      gap: "0.5rem",
    }}
  >
    <button
      type="button"
      style={{ whiteSpace: "nowrap" }}
      className="btn btn-outline-info"
      onClick={() => handleMessage(discussion.challenge_response_id)}
      disabled={currentUser?.data[0]?.chatbox === "0"}
    >
      <span className="d-none d-md-inline" style={{ marginRight: "5px" }}>
        <BiSolidMessageRounded size={20} />
      </span>
      Message
    </button>

    <button
      type="button"
       style={{ whiteSpace: "nowrap"}}
      className="btn btn-outline-primary"
      onClick={() => navigate("/schedule-calls")}
    >
      <span className="d-none d-md-inline" style={{ marginRight: "5px" }}>
        <IoIosVideocam size={20} />
      </span>
      Schedule Call
    </button>

    <button
      type="button"
      style={{ whiteSpace: "nowrap"}}
      className="btn btn-outline-success"
      onClick={() => handleMilestone(discussion.challenge_response_id)}
    >
      <span className="d-none d-md-inline" style={{ marginRight: "5px" }}>
        <BsListCheck size={20} />
      </span>
      Milestones
    </button>
  </div>
</div>

                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No assigned Ideas are available.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DBStu;
