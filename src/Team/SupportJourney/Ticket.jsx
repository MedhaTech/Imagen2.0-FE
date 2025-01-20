/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, PlusCircle } from "react-feather";
import { getCurrentUser, openNotificationWithIcon } from "../../helpers/Utils";
import { createSupportTickets } from "../../Teacher/store/mentors/actions";
import { getDiscussionList } from "../../redux/actions";
import { FaComments, FaFile, FaLink } from "react-icons/fa";
import DataTableExtensions from "react-data-table-component-extensions";
import DataTable, { Alignment } from "react-data-table-component";
import {
  getSupportTicketById,
  getDiscussionChatById,
} from "../../Teacher/store/mentors/actions";
import { useNavigate } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaReply } from "react-icons/fa";
import Avatar from "react-string-avatar";
import { FaComment } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { BiSolidLike,BiSolidDislike } from "react-icons/bi";
const TicketsPage = () => {
  const { discussionChats } = useSelector((state) => state.mentors);
  const language = useSelector((state) => state?.mentors.mentorLanguage);
  const currentUser = getCurrentUser("current_user");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();
  useEffect(() => {
    dispatch(getDiscussionList(currentUser?.data[0]));
  }, []);
  console.log(discussionChats, "supportTickets");
  {
    /* <FaComments className="me-1" /> */
  }
  {
    /* <FaCircleUser size={30} style={{marginRight:"16px"}} />{discussion.created_by} */
  }
  {
    /* <FaReply size={20} style={{ marginRight: "10px" }} /> */
  }

  // Remove "about" from the string
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Discussion Forum</h4>
              <h6>Raise your queries here</h6>
            </div>
          </div>
          <div className="page-btn">
            <button
              className="btn btn-primary add-em-payroll"
              type="button"
              onClick={() => navigate("/new-chat")}
            >
              <PlusCircle className="me-2" />
              Ask Question
            </button>
          </div>
        </div>
        <div className="row">
          {discussionChats && discussionChats.length > 0 ? (
            discussionChats.map((discussion) => (
              <div key={discussion.discussion_forum_id} className="col-md-12">
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex"style={{ gap: '0', justifyContent: 'flex-start' }}>
                      <Avatar
                        initials={discussion.created_by
                          ?.split(" ")
                          .map((w) => w.charAt(0))
                          .join("")}
                        bgColor="#36adf2"
                        textColor="black"
                        roundShape="true"
                        pictureResolution={25}
                        height={30}
                        width={30}
                      />
                      <div className="mx-3">
                        <p
                          className="mb-0 card-text"
                          style={{ fontSize: "16px", fontWeight: "bold" }}
                        >
                          {discussion.created_by}
                        </p>
                      </div>
                    </div>
                    <div className="mx-5">
                      {/* <h5 className="mb-0 card-title">
                        {discussion.query_category}
                      </h5> */}
                      <p className="mb-0 card-text">
                        {discussion.query_details}
                      </p>
                    </div>
                    <div className="d-flex align-items-center mx-5 mt-3 " style={{ gap: '0', justifyContent: 'flex-start' }}>
                    <p className="card-text mb-2 mx-3">
                    <BiSolidLike size={20}
                          style={{ marginRight: "10px" }}/>
                      </p>
                      <p className="card-text mb-2 mx-3">
                    <BiSolidDislike size={20}
                          style={{ marginRight: "10px" }}/>
                      </p>
                      <p className="card-text mb-2 mx-3">
                        <Link
                          to={`/Discussion-Chat-Response?id=${discussion.discussion_forum_id}`}
                          className="d-flex align-items-center"
                        >
                          <FaComment size={20} style={{ marginRight: "5px" }} />

                          {discussion.replies_count}
                        </Link>
                      </p>

                      <p className="card-text mb-2 mx-3">
                        <FaCircleUser
                          size={20}
                          style={{ marginRight: "10px" }}
                        />
                        {(() => {
                          const timeAgo = formatDistanceToNow(
                            new Date(discussion.created_at),
                            { addSuffix: true }
                          );
                          return timeAgo.replace(/^about\s/, "");
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No discussions available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketsPage;
