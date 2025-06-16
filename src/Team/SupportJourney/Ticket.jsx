/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect,useRef  } from "react";
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
import { HiOutlineLink } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaReply } from "react-icons/fa";
import { BiLinkExternal } from "react-icons/bi";
import Avatar from "react-string-avatar";
import { FaComment } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { MdAttachFile } from "react-icons/md";
import { BiSolidLike,BiSolidDislike } from "react-icons/bi";
const TicketsPage = () => {
  const { t } = useTranslation();
  const { discussionChats } = useSelector((state) => state.mentors);
  const currentUser = getCurrentUser("current_user");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [itemsToDisplay, setItemsToDisplay] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const observerRef = useRef(null); 
  useEffect(() => {
    dispatch(getDiscussionList(currentUser?.data[0]));
  }, []);
  useEffect(() => {
    if (discussionChats && discussionChats.length > 0) {
    const initialItems = discussionChats.slice(0, itemsPerPage);
    setItemsToDisplay(initialItems);
    }
  }, [discussionChats]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreItems(); 
        }
      },
      { threshold: 1.0 } // Fully visible
    );

    if (observerRef.current) {
      observer.observe(observerRef.current); 
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current); 
    };
  }, [observerRef.current, currentPage]);

  const loadMoreItems = () => {
    // Load next batch of items
    if (currentPage * itemsPerPage < discussionChats.length) {
      const nextPage = currentPage + 1;
      const newItems = discussionChats.slice(0, nextPage * itemsPerPage);
      setItemsToDisplay(newItems);
      setCurrentPage(nextPage);
    }
  };
  // if (!discussionChats || discussionChats.length === 0) {
  //   return <p>No tickets available.</p>;
  // }


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
          {
            itemsToDisplay.map((discussion,index) => (
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
                     {discussion?.link && (
  <p className="card-text mb-2 mx-3">
    <a
      href={discussion.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <BiLinkExternal size={20} style={{ marginRight: "10px" }} />
    </a>
  </p>
)}
 {discussion?.file && (
  <p className="card-text mb-2 mx-3">
    <a
      href={discussion.file}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <MdAttachFile size={20} style={{ marginRight: "10px" }} />
    </a>
  </p>
)}

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
         
          }
 {currentPage * itemsPerPage < discussionChats.length && (
        <div ref={observerRef} style={{ height: "1px" }} />
      )}


      {currentPage * itemsPerPage >= discussionChats.length && (
        <p style={{ textAlign: "center", marginTop: "1rem" }}>No more Discussions to display.</p>
      )}
        </div>
      </div>
    </div>
  );
};
export default TicketsPage;
