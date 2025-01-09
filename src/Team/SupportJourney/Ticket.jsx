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
const TicketsPage = () => {
  const { discussionChats } = useSelector((state) => state.mentors);
  const language = useSelector((state) => state?.mentors.mentorLanguage);
  const currentUser = getCurrentUser("current_user");
  const dispatch = useDispatch();

  const { t } = useTranslation();
  useEffect(() => {
    dispatch(getDiscussionList(currentUser?.data[0]));
  }, []);
console.log(discussionChats,"supportTickets");
    const navigate = useNavigate();
    return (
      <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Discussion - Forum</h4>
              <h6>Raise your queries here</h6>
            </div>
          </div>
          <div className="page-btn">
            <button
              className="btn btn-primary add-em-payroll"
              type="button"
              onClick={() => navigate('/new-chat')}
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
                <div className="card mb-3" 
               
                  >
                  <div className="card-body">
                  <h5 className="card-title">{discussion.query_category}</h5>
                    <p className="card-text">{discussion.query_details}</p>
                        
                        <p className="card-text mb-2">
                    <Link
                      to={`/Discussion-Chat-Response?id=${discussion.discussion_forum_id}`}
                      className="btn btn-outline-primary m-1 rounded-1"
                    >
                      {/* <FaComments className="me-1" /> */}
                      <span className="badge bg-primary " style={{fontSize:"14px"}}
                     >

<FaReply size={20} style={{marginRight:"10px"}}/>{discussion.replies_count}
                      </span>
                    </Link>
                    <br/>
                    <FaCircleUser size={30} style={{marginRight:"16px"}} />{discussion.created_by}
                    </p>
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
