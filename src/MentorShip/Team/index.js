/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import Table from "../../core/pagination/datatable";

////////////////////New Code//////////////////////////
import { getCurrentUser } from '../../helpers/Utils';
import axios from 'axios';
import { Mail } from "feather-icons-react/build/IconComponents";
import {
  IoHelpOutline,
} from "react-icons/io5";
import { CheckCircle } from 'react-feather';
import { useEffect } from 'react';
import { encryptGlobal } from '../../constants/encryptDecrypt';
import { getTeamMemberStatus } from '../../Teacher/store/teams/actions';
import { openNotificationWithIcon } from "../../helpers/Utils";
import { RiTeamFill } from "react-icons/ri";
import IdeaSubmissionCard from "../../components/IdeaSubmissionCard";

import { Row, Col } from "reactstrap";


const TeamsProgDD = ({ user, setIdeaCount }) => {

  //////////////New Code/////////////////////////
  const dispatch = useDispatch();
  const currentUser = getCurrentUser('current_user');
  const { teamsMembersStatus, teamsMembersStatusErr } = useSelector(
    (state) => state.teams
  );
  const [formData, setFormData] = useState({});

  const [noData, setNoData] = useState(false);
  const [ideaShow, setIdeaShow] = useState(false);
  const [teamId, setTeamId] = useState(null);

  const [mentorid, setmentorid] = useState('');
  const [showDefault, setshowDefault] = useState(true);
  useEffect(() => {
    if (teamId) {
      dispatch(getTeamMemberStatus(teamId, setshowDefault));
      submittedApi();
    }
  }, [teamId, dispatch]);
  const submittedApi = () => {
    // This function fetches idea submission details from the API //

    const Param = encryptGlobal(
      JSON.stringify({
        student_id: teamId

      })
    );
    var configidea = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/challenge_response/submittedDetails?Data=${Param}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(configidea)
      .then(function (response) {
        if (response.status === 200) {
          if (response.data.data && response.data.data.length > 0) {
            setFormData(response.data.data[0]);
            setNoData(false);
          }
        }
      })
      .catch(function (error) {
        if (error.response.status === 404) {
          setNoData(true);
        }

      });
  };

  const percentageBWNumbers = (a, b) => {
    return (((a - b) / a) * 100).toFixed(2);
  };
  useEffect(() => {
    if (user) {
      setmentorid(user[0].college_name);
    }
  }, [user]);
  const [teamsList, setTeamsList] = useState([]);
  useEffect(() => {
    if (mentorid) {
      setshowDefault(true);
      teamNameandIDsbymentorid(mentorid);
    }
  }, [mentorid]);

  const teamNameandIDsbymentorid = (mentorid) => {
    const teamApi = encryptGlobal(
      JSON.stringify({
        college_name: mentorid
      })
    );
    var config = {
      method: 'get',
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/mentors/pilotNameByInstName?Data=${teamApi}`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${currentUser.data[0]?.token}`
      }
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setTeamsList(response.data.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'full_name',
      width: '15rem'
    },
    {
      title: 'Pre Survey',
      dataIndex: 'pre_survey_status',
      align: 'center',
      width: '15rem',
      render: (_, record) =>
        record?.pre_survey_status ? (
          <CheckCircle size={20} color="#28C76F" />
        ) : (
          <IoHelpOutline size={20} color="#FF0000" />
        )
    },
    {
      title: 'Lesson Progress',
      dataIndex: 'address',
      align: 'center',
      width: '30rem',
      render: (_, record) => {
        let percent =
          100 -
          percentageBWNumbers(
            record.all_topics_count,
            record.topics_completed_count
          );
        return (

          <div className="progress progress-sm progress-custom progress-animate"
            role="progressbar"
            aria-valuenow={Math.round(percent) ? Math.round(percent) : '0'}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              style={{ width: `${percent}%` }}
              className={percent
                ? percent <= 25
                  ? "progress-bar bg-danger"
                  : percent > 25 && percent <= 50
                    ? "progress-bar bg-primary"
                    : percent > 50 && percent <= 75
                      ? "progress-bar bg-info"
                      : "progress-bar bg-success"
                : "progress-bar bg-danger"
              } >
              <div
                className={percent
                  ? percent <= 25
                    ? "progress-bar-value bg-danger"
                    : percent > 25 && percent <= 50
                      ? "progress-bar-value bg-primary"
                      : percent > 50 && percent <= 75
                        ? "progress-bar-value bg-info"
                        : "progress-bar-value bg-success"
                  : "progress-bar-value bg-danger"} >
                {Math.round(percent) ? Math.round(percent) : '0'}%</div>
            </div>
          </div>
        );
      }
    },
    {
      title: 'Idea Submission',
      dataIndex: 'idea_submission',
      align: 'center',
      width: '20rem',
      render: (_, record) =>
        record?.idea_submission ? (
          <CheckCircle size={20} color="#28C76F" />
        ) : (
          <IoHelpOutline size={20} color="#FF0000" />
        )
    },
    {
      title: 'Post Survey',
      dataIndex: 'post_survey_status',
      align: 'center',
      width: '10rem',
      render: (_, record) =>
        record?.post_survey_status ? (
          <CheckCircle size={20} color="#28C76F" />
        ) : (
          <IoHelpOutline size={20} color="#FF0000" />
        )
    },
    {
      title: 'Certificate',
      dataIndex: 'certificate',
      align: 'center',
      width: '10rem',
      render: (_, record) =>
        record?.certificate ? (
          <CheckCircle size={20} color="#28C76F" />
        ) : (
          <IoHelpOutline size={20} color="#FF0000" />
        )
    }
  ];


  const customer = teamsList.map((team) => ({
    value: team.student_id,
    label: team.full_name,
  }));

  const handleSelectChange = (selectedOption) => {
    setTeamId(selectedOption ? selectedOption.value : '');
  };



  ////////Email Team Credentisl////////////

  return (
    <div>
      <div className="card table-list-card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title mb-0">
            <RiTeamFill size="25" style={{
              marginRight: "6px",
              verticalAlign: "middle",
              color: "#0e4b99"
            }} />
            Team Progress</h4>

        </div>
        <div className="card-body">
          <div className="table-top">
            <div className="form-sort select-bluk">
              <Select
                classNamePrefix="react-select"
                options={customer}
                placeholder="Choose a Team"
                onChange={handleSelectChange}
                value={customer.find(option => option.value === teamId)}
              />
            </div>
            {teamId && (
              <>
                <Row>
                  <div className="singlediv">
                    <span className="fw-bold text-info">IDEA STATUS :</span>
                    <span style={{ paddingLeft: "1rem" }}>
                      {noData
                        ? <span className="text-warning">NOT STARTED</span>
                        : formData?.verified_status === "ACCEPTED"
                          ? <span className="text-success">ACCEPTED</span>
                          : formData?.verified_status === "REJECTED"
                            ? <span className="text-danger">REJECTED</span>
                            : formData?.status || <span className="text-warning">NOT STARTED</span>}
                    </span>
                  </div>
                </Row>
                <>
                  <div>
                    {!noData && (formData?.status === "SUBMITTED" || formData?.status === "DRAFT") && (
                      <button
                        className="btn btn-primary d-flex align-items-center"

                        onClick={() => setIdeaShow(true)}
                      >View Idea</button>
                    )}
                  </div>

                </>
              </>
            )}
          </div>
          <div className="table-responsive">
            {showDefault && (
              <div className="d-flex justify-content-center align-items-center">
                <h4 className="text-primary">Select a Team to check YFSI Progress</h4>
              </div>
            )}
            {teamsMembersStatus.length > 0 && !showDefault ? (
              <Table
                pagination={false}
                dataSource={teamsMembersStatus}
                columns={columns}
              />
            ) : teamsMembersStatusErr ? (
              <div
                className="d-flex justify-content-center align-items-center">
                <h4 className="text-danger">
                  There are no students in selected Team
                </h4>
              </div>
            ) : null}

          </div>
          {ideaShow && (
            <IdeaSubmissionCard
              show={ideaShow}
              handleClose={() => setIdeaShow(false)}
              response={formData}
              setIdeaCount={setIdeaCount}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default TeamsProgDD;
