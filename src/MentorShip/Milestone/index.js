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
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import ToggleButton from "../../Admin/UsersList/Toggle";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { BsMicrosoftTeams } from "react-icons/bs";

const Milestone = (props) => {
   const location = useLocation();
  const [milestoneList, setmilestoneList] = useState([]);
  const currentUser = getCurrentUser("current_user");
  const dispatch = useDispatch();
  const navigate = useNavigate();
 const cid = location.state?.challenge_response_id;
const [teamId, setTeamId] = useState(null);
  const [showDefault, setshowDefault] = useState(true);
  const [progressData, setProgressData] = useState([]);
  const [progressReady, setProgressReady] = useState(false);
    const [teamsList, setTeamsList] = useState([]);

  useEffect(() => {
    if (currentUser.data[0]?.user_id) {
      setshowDefault(true);
      teamNameandIDsbymentorid(currentUser.data[0]?.user_id);
    }
  }, [currentUser.data[0]?.user_id]);
 useEffect(() => {
    if (cid) {
      setTeamId(cid);
    }
  }, [cid]);
 
  
  useEffect(() => {
    fetchTecResourceList();
  }, []);
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

      // {
      //   name: "Update Status",
      //   width: "10rem",
      //   center: true,

      //   cell: (record) => (
      //     <ToggleButton
      //       isEnabled={record.chatbox === 1 || record.chatbox === "1"}
      //       onToggle={(newStatus) =>
      //         handleStatusOfChat(record, newStatus, "chatbox")
      //       }
      //     />
      //   ),
      // },
      // {
      //   name: "Actions",
      //   left: true,
      //   width: "15rem",
      //   cell: (record) => [
      //     <>
      //       <button
      //         className="btn btn-info btn-sm"
      //         onClick={() => handleEdit(record)}
      //       >
      //         <i data-feather="edit" className="feather-edit" /> Edit
      //       </button>
      //     </>,
      //   ],
      // },
        ...(progressReady
    ? [
   {
  name: "Actions",
  left: true,
  width: "15rem",
  cell: (record) => {
    const matchedProgress = Array.isArray(progressData)
      ? progressData.find((item) => item.milestone_id === record.milestone_id)
      : null;

    return (
      <>
        {matchedProgress ? (
          <button
            className="btn btn-info btn-sm me-1"
            onClick={() => handleEdit(record)}
            title="Edit Progress"
          >
            <i data-feather="edit" className="feather-edit" /> Update
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
}
 ]
    : []),


    ],
  };

  const handleEdit = (data) => {
    // console.log(data,"of cid");
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

 const handleSelectChange = (selectedOption) => {
    // setTeamId(selectedOption ? selectedOption.label : "");
     setTeamId(selectedOption ? Number(selectedOption.value) : "");
  };
  useEffect(() => {
    if (teamId) {
      submittedApi(teamId);
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
          setTeamsList(response.data.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  // const customer = teamsList.map((team) => ({
  //   value: team.student_id,
  //   label: team.challenge_response_id,
  // }));
const customer = teamsList.map((team) => ({
  value: team.challenge_response_id,               
  label: `${team.challenge_response_id}`,      
}));

 
 
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
            // console.log(response, "res");
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
        fontSize: "1em", // Adjust as needed
      },
    },
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-title">
          <div className="row align-items-center">
            <div className="col-md-3">
              <h4 className="mb-0">Milestone</h4>

            </div>
           
            <div className="col-md-6 text-md-end mt-2 mt-md-0">
              <div className="form-sort select-bluk">
                <Select
                  classNamePrefix="react-select"
                  options={customer}
                  placeholder="Choose a Team"
                  onChange={handleSelectChange}
                  // value={customer.find((option) => option.value === teamId)}
                  value={customer.find((option) => Number(option.value) === Number(teamId))}

                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              </div>
            </div>
          </div>
        </div>

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
      </div>
    </div>
  );
};
export default Milestone;
