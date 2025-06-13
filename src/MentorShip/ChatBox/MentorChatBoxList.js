/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect, useState } from "react";
import { encryptGlobal } from "../../constants/encryptDecrypt";
import { PlusCircle } from "feather-icons-react/build/IconComponents";
import { TbMessageDots } from "react-icons/tb";
import { getCurrentUser, setCurrentUser } from "../../helpers/Utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BiLogoMicrosoftTeams } from "react-icons/bi";
const MentorChatBoxList = () => {
  const currentUser = getCurrentUser("current_user");
  const navigate = useNavigate();
  const [studentCount, setStudentCount] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    mentorTeamsCount(currentUser?.data[0]?.user_id);
    mentorChatBox(currentUser?.data[0]?.user_id);
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
  const handleChat = (student) => {
    const challengeId = student.challenge_response_id;
const mentorId = currentUser.data[0]?.user_id;
    // const matchingChatbox = data.find(
    //   (chat) => chat.challenge_response_id === challengeId
    // );

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
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Chat Box</h4>
                <h6>Manage your Chats</h6>
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
                            <TbMessageDots size="20px"/> Message
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
                <p className="text-center text-muted">There are no teams assigned yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorChatBoxList;
