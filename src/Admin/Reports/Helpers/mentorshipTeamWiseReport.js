/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { CSVLink } from "react-csv";
import { getCurrentUser } from "../../../helpers/Utils";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { notification } from "antd";
import { openNotificationWithIcon } from "../../../helpers/Utils";
import * as XLSX from "xlsx";
import { it } from "date-fns/locale";

const mentorshipReport = () => {
  const navigate = useNavigate();
  const [isDownload, setIsDownload] = useState(false);
  const [mentorshipReportsData, setmentorshipReportsData] = useState(
    []
  );
  const currentUser = getCurrentUser("current_user");

  const handleExport = () => {
    const newDate = new Date();
    const formattedDate = `${newDate.getUTCDate()}/${1 + newDate.getMonth()
      }/${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
    const ws = XLSX.utils.json_to_sheet(mentorshipReportsData); // Converts the JSON data to a sheet
    const wb = XLSX.utils.book_new(); // Creates a new workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1"); // Appends the sheet to the workbook
    XLSX.writeFile(wb, `MentorTeamWiseDetailedReport_${formattedDate}.xlsx`); // Triggers download of the Excel file
  };



  const handleDownload = () => {
    setIsDownload(true);
    fetchData();
  };

  useEffect(() => {
    if (mentorshipReportsData.length > 0) {
      handleExport();
    }
  }, [mentorshipReportsData]);

  const fetchData = () => {
    const config = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/reports/mentorshipteamWiseReport`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          const IdeaData = response.data.data || [];
          const newdatalist = IdeaData.map((item) => {
            return {
              "Mentor Name": item.full_name,
              "Email": item.email,
              "Mobile": item.mobile,
              "CID": item.challenge_response_id,
              "Theme": item.theme,
              "Idea Title": item.title,
              "Team Members": item.team_members === null ? '' : JSON.stringify(item.team_members),
              "Areas of Expertise": item.areas_of_expertise,
              "College Name": item.college_name,
              "Understanding the Market":item.MS_1 === null ? 'INCOMPLETE' : item.MS_1,
              "Market Linkage Opportunities":item.MS_2 === null ? 'INCOMPLETE' : item.MS_2,
              "Prototype/Idea Refinement":item.MS_3 === null ? 'INCOMPLETE' : item.MS_3,
              "User Feedback and Iteration":item.MS_4 === null ? 'INCOMPLETE' : item.MS_4,
              "Final Idea Submission":item.MS_5 === null ? 'INCOMPLETE' : item.MS_5,
              "Business Plan Development":item.MS_6 === null ? 'INCOMPLETE' : item.MS_6,
              "Pitch Readiness":item.MS_7 === null ? 'INCOMPLETE' : item.MS_7,
              "Mentor Summary Report":item.MS_8 === null ? 'INCOMPLETE' : item.MS_8
            };
          });

          setmentorshipReportsData(newdatalist);
          if (response.data.data.length > 0) {
            openNotificationWithIcon(
              "success",
              "Report Downloaded Successfully"
            );
          } else {
            openNotificationWithIcon("error", "No Data Found");
          }
          setIsDownload(false);
        }
      })
      .catch(function (error) {
        console.log(error);
        setIsDownload(false);
      });
  };

  return (
    <div className="page-wrapper">

      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Mentor Team wise Detailed Report</h4>
              <h6>
                Mentor Team wise Details - Idea,Team members,Milestone Status
              </h6>
            </div>
          </div>
          <div className="page-btn">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/reports")}
            >
              <i className="fas fa-arrow-left"></i> Back
            </button>
          </div>
        </div>

        <Container className="RegReports userlist">
          <div className="reports-data mt-2 mb-2">
            <Row className="align-items-center mt-3 mb-2">
              <Col
                md={3}
                className="d-flex align-items-center justify-content-center"
              >
                <button
                  onClick={handleDownload}
                  type="button"
                  disabled={isDownload}
                  className="btn btn-primary"
                >
                  {isDownload ? "Downloading" : "Download Report"}
                </button>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default mentorshipReport;
