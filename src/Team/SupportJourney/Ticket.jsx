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
import { getSupportTickets } from "../../redux/actions";
import { FaComments, FaFile, FaLink } from "react-icons/fa";
import DataTableExtensions from "react-data-table-component-extensions";
import DataTable, { Alignment } from "react-data-table-component";
import {
  createSupportTicketResponse,
  getSupportTicketById,
  SupportTicketStatusChange,
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
  const { supportTickets } = useSelector((state) => state.mentors);
  const { supportTicket } = useSelector((state) => state.mentors);
  const language = useSelector((state) => state?.mentors.mentorLanguage);
  const { t } = useTranslation();
  //const [id, setId] = useState();
  useEffect(() => {
    dispatch(getSupportTickets(currentUser?.data[0]));
  }, []);
console.log(supportTickets,"supportTickets");
    const navigate = useNavigate();



  useEffect(() => {
    formik.setFieldValue("selectStatusTicket", supportTicket.status);
  }, [supportTicket]);

  const SchoolsData = {
    data: supportTickets,
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
          <p key={params.support_ticket_id}>{params?.query_details}</p>,
        ],
      },
      {
        name: <h6>Chat</h6>,
        width: "8rem",
        cell: (params) => {
          return [
            <a
              href="#"
              key={params.support_ticket_id}
              // data-bs-toggle="offcanvas"
              // data-bs-target="#offcanvasRight"
              onClick={() => handleChat(params.support_ticket_id)}
            >
              <FaComments />{" "}
              <span className="badge rounded-pill bg-primary">
                {params.replies_count}
              </span>
            </a>,
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

  const currentUser = getCurrentUser("current_user");
  const dispatch = useDispatch();

 
 
  

  const formik = useFormik({
    initialValues: {
      ansTicket: "",
      selectStatusTicket: supportTicket.status,
      file_name: "",
      url: "",
    },

    validationSchema: Yup.object({
      ansTicket: Yup.string().required("Required"),
      selectStatusTicket: Yup.string(),
    }),

    onSubmit: async (values) => {
      try {
        if (values.file_name !== "") {
          const fileData = new FormData();
          fileData.append("file", values.file_name);

          const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/supportTickets/supportTicketFileUpload`,
            fileData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${currentUser?.data[0]?.token}`,
              },
            }
          );
          values.file_name = response?.data?.data[0].attachments[0].toString();
        }
        const ansTicket = values.ansTicket;
        const id = supportTicket.support_ticket_id;

        const bodyForm2 = {
          support_ticket_id: id,
          reply_details: ansTicket,
        };
        if (values.file_name !== "") {
          bodyForm2["file"] = values.file_name;
        }
        if (values.url !== "") {
          bodyForm2["link"] = values.url;
        }

        dispatch(createSupportTicketResponse(bodyForm2));
        dispatch(
          SupportTicketStatusChange(id, { status: values.selectStatusTicket })
        );
        document.getElementById("sendresponseID").click();
        setTimeout(() => {
          dispatch(getSupportTickets(currentUser?.data[0]));
        }, 500);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleChat = (id) => {
    dispatch(getSupportTicketById(id, language));
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
                Ask Your Query
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
