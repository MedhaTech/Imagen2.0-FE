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

const DBStu = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser("current_user");
  const [cidList, setCidList] = useState([]);
  const [data, setData] = useState([]);

  const [mentorUserId, setMentorUserId] = useState("");
  useEffect(() => {
    mentorChatBox(currentUser?.data[0]?.user_id);
  }, []);
  useEffect(() => {
    if (mentorUserId) {
      challengesListApi();
    }
  }, [mentorUserId]);

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

          setMentorUserId(response.data.data[0].mentorship_user_id);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const challengesListApi = () => {
    const surveyApi = encryptGlobal(
      JSON.stringify({ mentorship_user_id: mentorUserId })
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
      createChatboxid(challengeId,student);
    }
  };
  const createChatboxid = (challengeId,student) => {
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
 
  const handleMilestone =(item)=>{
    console.log(item,"item");
      navigate(`/mentor-milestone`, {
            state: {
      challenge_response_id:item,
            },
          });
  };
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
            <div className="col-xl-4 col-sm-6 col-12 mb-1 mt-1">
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
                  <h5>{/* {totalMentorCount} */}</h5>
                  <h6>My Teams</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-sm-6 col-12  mb-1 mt-1">
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
                  <h5>{/* {totalStudentCount} */}</h5>
                  <h6>Upcoming Sessions</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-sm-6 col-12 mb-1 mt-1">
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
                  <h5>{/* {totalteamsCount} */}</h5>
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
                  <div className="card">
                    <div className="card-body"style={{ padding: '1rem' }}>
                      <div >
                        {/* <div>
                          <p>
                            <span
                              style={{ fontSize: "14px", fontWeight: "bold",marginBottom:"1rem" }}
                            >
                              Theme Name :{" "}
                            </span>
                            <span
                              style={{ fontSize: "12px", fontWeight: "bold" ,marginBottom:"1rem"}}
                            >
                              {discussion.theme}
                            </span>
                            <br />
                            <span
                              style={{ fontSize: "14px", fontWeight: "bold" }}
                            >
                              Team Members :{" "}
                            </span>
                            <span style={{ fontSize: "12px" }}>
                              {discussion.team_members?.[0]
                                ?.split(" ")
                                .join(", ")}
                            </span>
                            <br />{" "}
                            <span
                              style={{ fontSize: "14px", fontWeight: "bold" }}
                            >
                              Idea Description :{" "}
                            </span>
                            <span style={{ fontSize: "12px" }}>
                              {discussion.idea_describe}
                            </span>
                          </p>
                        </div> */}
                     <div style={{ marginBottom: "0.5rem" }}>
  <span style={{ fontSize: "14px", fontWeight: "bold" }}>
    Theme Name:{" "}
  </span>
  <span style={{ fontSize: "12px", fontWeight: "bold" }}>
    {discussion.theme}
  </span>
</div>
<div style={{ marginBottom: "0.5rem" }}>
  <span style={{ fontSize: "14px", fontWeight: "bold" }}>
    Team Members:{" "}
  </span>
  <span style={{ fontSize: "12px" }}>
    {discussion.team_members?.[0]?.split(" ").join(", ")}
  </span>
</div>

<div >
  <span style={{ fontSize: "14px", fontWeight: "bold" }}>
    Idea Description:{" "}
  </span>
  <span style={{ fontSize: "12px" }}>
    {discussion.idea_describe}
  </span>
</div>

                      </div>
                      {/* <div className="mt-2 text-end">
                        <button
                          type="button"
                          className="btn btn-outline-info text-center w-auto me-1"
                          onClick={() => handleMessage(discussion.challenge_response_id)}
                          disabled={currentUser?.data[0]?.chatbox === '0'}
                        >
                          <BiSolidMessageRounded size={20} /> 
                          Message
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline-primary text-center w-auto me-1"
                            onClick={() => navigate("/schedule-calls")}
                        >
                          <IoIosVideocam size={20} />
                           Schedule Call
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline-success text-center w-auto"
                          
                           onClick={() => navigate("/mentor-milestone")}
                        >
                          <BsListCheck size={20} />
                           Milestones
                        </button>
                      </div> */}
                 <div
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end', // Aligns right on all screens
    gap: '0.5rem',
    marginTop: '0.5rem',
  }}
>
  <button
    type="button"
    style={{ whiteSpace: 'nowrap' }}
    className="btn btn-outline-info mb-1"
    onClick={() => handleMessage(discussion.challenge_response_id)}
    disabled={currentUser?.data[0]?.chatbox === '0'}
  >
    <span className="d-none d-md-inline" style={{ marginRight: '5px' }}>
      <BiSolidMessageRounded size={20} />
    </span>
    Message
  </button>

  <button
    type="button"
    style={{ whiteSpace: 'nowrap' }}
    className="btn btn-outline-primary mb-1"
    onClick={() => navigate("/schedule-calls")}
  >
    <span className="d-none d-md-inline" style={{ marginRight: '5px' }}>
      <IoIosVideocam size={20} />
    </span>
    Schedule Call
  </button>

  <button
    type="button"
    style={{ whiteSpace: 'nowrap' }}
    className="btn btn-outline-success mb-1"
    // onClick={() => navigate("/mentor-milestone")}
    onClick={() => handleMilestone(discussion.challenge_response_id)}

  >
    <span className="d-none d-md-inline" style={{ marginRight: '5px' }}>
      <BsListCheck size={20} />
    </span>
    Milestones
  </button>
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
