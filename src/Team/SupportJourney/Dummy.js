/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Row, Col, Label, Card, CardBody, Input } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, PlusCircle } from "react-feather";
import axios from "axios";
import Select from "react-select";
import * as Yup from "yup";
import { useFormik } from "formik";
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
import { UncontrolledAlert } from "reactstrap";
import { useNavigate } from "react-router-dom";

import { FaUserCircle } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";

const TicketsPage = () => {
  const { discussionChats } = useSelector((state) => state.mentors);
  // const { supportTicket } = useSelector((state) => state.mentors);
  const language = useSelector((state) => state?.mentors.mentorLanguage);
  const currentUser = getCurrentUser("current_user");
  const dispatch = useDispatch();

  const { t } = useTranslation();
  useEffect(() => {
    dispatch(getDiscussionList(currentUser?.data[0]));
  }, []);
console.log(discussionChats,"supportTickets");
    const navigate = useNavigate();



 

  const SchoolsData = {
    data: discussionChats,
    columns: [
      {
        name: <h6>No</h6>,
        selector: (row) => row.id,
        width: "4rem",
      },
      {
        name: <h6>Query Category</h6>,
        selector: (row) => row.query_category,
        sortable: true,
        width: "10rem",
      },
      {
        name: <h6>Query Details</h6>,
        selector: (row) => row.query_details,
        sortable: true,
        width: "30rem",

        cell: (params) => [
          <p key={params.
            discussion_forum_id
            }>{params?.query_details}</p>,
        ],
      },
      {
        name: <h6>Chat</h6>,
        width: "8rem",
        cell: (params) => {
          return [
            <Link
              key={params.
                discussion_forum_id
                }
              // data-bs-toggle="offcanvas"
              // data-bs-target="#offcanvasRight"
              // onClick={() => handleChat(params.
              //   discussion_forum_id
              //   )}
              to={`/Discussion-Chat-Response?id=${params.discussion_forum_id}`}
            >
              <FaComments />{" "}
              <span className="badge rounded-pill bg-primary">
                {params.replies_count}
              </span>
            </Link>,
          ];
        },
      },
      {
        name: <h6>Status</h6>,
        width: "8rem",
        cell: (params) => [
          params.status === "OPEN" ? (
            <span className="badge bg-secondary">
                            Open
                        </span>
                    ) : params?.status === 'INPROGRESS' ? (
                        <span className="badge bg-info">
                            Inprogress
                        </span>
                    ) : params?.status === 'RESOLVED' ? (
                        <span className="badge bg-success">
                            Resolved
                        </span>
                    ) : params?.status === 'INVALID' ? (
                        <span className="badge bg-light text-dark">
                            Invalid
                        </span>
                    ) : (
                        ''
                    )
        ],
      },
    ],
  };

 
 

    return (
        <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Discussion - Form</h4>
                <h6>Raise your queries here</h6>
              </div>
            </div>
            <div className="page-btn">
              <button
                className="btn btn-primary add-em-payroll"
                type="button"
                onClick={() =>
                  navigate(
                        '/new-chat'
                    )
                }
                
              >
                <PlusCircle className="me-2" />
                Ask Question
              </button>
            </div>
          </div>
          {/* /product list */}
          <div className="card table-list-card">
            <div className="card-body">
              <div className="table-responsive">
                <DataTableExtensions
                  {...SchoolsData}
                  exportHeaders
                  export={false}
                  print={false}
                >
                  <DataTable
                    // data={rows}
                    defaultSortField="id"
                    defaultSortAsc={false}
                    pagination
                    highlightOnHover
                    fixedHeader
                    subHeaderAlign={Alignment.Center}
                  />
                </DataTableExtensions>
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
    );
};

export default TicketsPage;
