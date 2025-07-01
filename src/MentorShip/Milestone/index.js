/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTableExtensions from "react-data-table-component-extensions";
import DataTable, { Alignment } from "react-data-table-component";
import { encryptGlobal } from "../../constants/encryptDecrypt";
import { getCurrentUser } from "../../helpers/Utils";
import { CheckCircle } from "react-feather";
import { IoHelpOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { TbMessageDots } from "react-icons/tb";
import { BiLogoMicrosoftTeams } from "react-icons/bi";

const Milestone = (props) => {
  const location = useLocation();
  const [milestoneList, setmilestoneList] = useState([]);
  const currentUser = getCurrentUser("current_user");
  const navigate = useNavigate();
  const cid = location.state?.challenge_response_id;
  const [teamId, setTeamId] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [progressReady, setProgressReady] = useState(false);
  const [studentCount, setStudentCount] = useState([]);
  const [hide, setHide] = useState(false);
  useEffect(() => {
    if (currentUser.data[0]?.user_id) {
      teamNameandIDsbymentorid(currentUser.data[0]?.user_id);
    }
  }, [currentUser.data[0]?.user_id]);
  useEffect(() => {
    if (cid) {
      setTeamId(cid);
    }
  }, [cid]);

  async function fetchTecResourceList() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/milestone_progress/milestoneQuestion`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser?.data[0]?.token}`,
          },
        }
      );
      if (response.status === 200) {
        setmilestoneList(response.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const milestoneData = {
    data: milestoneList || [],
    columns: [
      {
        name: "No",
        selector: (row, key) => key + 1,
        sortable: true,
        width: "6rem",
      },
      {
        name: "Name",
        selector: (row) => row.name,
        width: "15rem",
      },

      {
        name: "Details",
        selector: (row) => row.description,
        width: "30rem",
      },
      ...(progressReady
        ? [
            {
              name: "Status",
              selector: (record) => {
                const matchedProgress = progressData?.find(
                  (item) =>
                    item.milestone_id === record.milestone_id &&
                    item.challenge_response_id === teamId
                );
                const status = matchedProgress?.status;
                return status === "COMPLETED" ? (
                  <div className="d-flex align-items-center gap-2">
                    <CheckCircle size={20} color="#28C76F" />
                  </div>
                ) : (
                  <IoHelpOutline size={20} color="#FF0000" />
                );
              },
              width: "10rem",
            },
          ]
        : []),

      ...(progressReady
        ? [
            {
              name: "Actions",
              left: true,
              width: "15rem",
              cell: (record) => {
                const matchedProgress = Array.isArray(progressData)
                  ? progressData.find(
                      (item) => item.milestone_id === record.milestone_id
                    )
                  : null;

                return (
                  <>
                    {matchedProgress ? (
                      <button
                        className="btn btn-info btn-sm me-1"
                        onClick={() => handleEdit(record)}
                        title="Edit Progress"
                      >
                        <i data-feather="edit" className="feather-edit" />{" "}
                        Update
                      </button>
                    ) : (
                      <button
                        className="btn btn-success btn-sm me-1"
                        onClick={() => handleEdit(record)}
                        title="Create Progress"
                      >
                        <i data-feather="plus" className="feather-plus" /> Add
                      </button>
                    )}
                  </>
                );
              },
            },
          ]
        : []),
    ],
  };

  const handleEdit = (data) => {
    const matchedProgress = progressData?.find(
      (item) => item.milestone_id === data?.milestone_id
    );

    navigate("/addnote", {
      state: {
        noteId: data?.note,
        uploadId: data?.upload,
        milestone_id: data?.milestone_id,
        milestone_progress_id: matchedProgress?.milestone_progress_id || "",
        challenge_response_id: teamId,
        file: matchedProgress?.file || "",
        status: matchedProgress?.status || "",
        note: matchedProgress?.note || "",
      },
    });
  };

  useEffect(() => {
    if (teamId) {
      fetchTecResourceList();
      submittedApi(teamId);
      setHide(true);
    }
  }, [teamId]);

  const teamNameandIDsbymentorid = (user_id) => {
    const teamApi = encryptGlobal(
      JSON.stringify({
        user_id: user_id,
      })
    );
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/mentorships/seletedteams?Data=${teamApi}`,
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

  const submittedApi = (teamId) => {
    // This function fetches idea submission details from the API //

    const Param = encryptGlobal(
      JSON.stringify({
        challenge_response_id: teamId,
      })
    );
    var configidea = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/milestone_progress?Data=${Param}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(configidea)
      .then(function (response) {
        if (response.status === 200) {
          if (response.data.data) {
            setProgressData(response.data.data);

            setProgressReady(true);
          }
        }
      })
      .catch(function (error) {
        if (error.response.status === 404) {
          // setNoData(true);
        }
      });
  };
  const customStyles = {
    head: {
      style: {
        fontSize: "1em",
      },
    },
  };
  const handleChat = (item) => {
    setTeamId(item.challenge_response_id);
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          {/* <div className="add-item d-flex">
            <div className="page-title">
              <h4>Milestone</h4>
            </div>
          </div> */}
          <div className="add-item d-flex justify-content-between align-items-center mb-3 w-100">
  <div className="page-title">
    <h4 className="mb-0">Milestone</h4>
  </div>
  {hide && (
  <button className="btn btn-outline-primary" onClick={() => setHide(false)}>
  Back to Cards
  </button>
  )}
</div>

        </div>
        {!hide && (
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
                            className="btn btn-outline-success text-center w-auto me-1"
                            onClick={() => handleChat(student)}
                          >
                            <TbMessageDots size="20px" /> Message
                          </button>
                        </div>
                      </div>
                      <div className="profile-info">
                        <div className="profile-pic active-profile">
                          <div style={{ width: "64px", height: "64px" }}>
                            <BiLogoMicrosoftTeams
                              style={{ width: "100%", height: "100%", color:"#28C76F"}}
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
                <p className="text-center text-muted">
                  There are no teams assigned yet.
                </p>
              )}
            </div>
          </div>
        )}
        {hide && (
          <div style={{ marginTop: "1rem" }}>
            
            <DataTableExtensions
              print={false}
              export={false}
              filter={false}
              {...milestoneData}
              exportHeaders
            >
              <DataTable
                defaultSortField="id"
                customStyles={customStyles}
                defaultSortAsc={false}
                pagination
                highlightOnHover
                fixedHeader
                subHeaderAlign={Alignment.Center}
              />
            </DataTableExtensions>
          </div>
        )}
      </div>
    </div>
  );
};
export default Milestone;
