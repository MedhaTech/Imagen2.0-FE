/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTableExtensions from 'react-data-table-component-extensions';
import DataTable, { Alignment } from 'react-data-table-component';
import { encryptGlobal } from "../../constants/encryptDecrypt";
import { getCurrentUser } from "../../helpers/Utils";
import { CheckCircle } from "react-feather";
import { IoHelpOutline } from "react-icons/io5";

const StudentMilestone = (props) => {
  const [milestoneList, setmilestoneList] = useState([]);
  const currentUser = getCurrentUser('current_user');
  useEffect(() => {
    fetchTecResourceList();
  }, []);
  async function fetchTecResourceList() {
    const fectchTecParam = encryptGlobal(
      JSON.stringify({
        challenge_response_id: localStorage.getItem("CID")
      })
    );
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/students/milestones?Data=${fectchTecParam}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser?.data[0]?.token}`
          }
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
        name: 'No',
        selector: (row, key) => key + 1,
        sortable: true,
        width: '7rem'
      },
      {
        name: 'Name',
        selector: (row) => row.name,
        width: '15rem'
      },

      {
        name: 'Details',
        selector: (row) => row.description,
        width: '30rem'
      },
      {
        name: 'Status',
        selector: (record) =>
          record.status === "COMPLETED" ? (
            <CheckCircle size={20} color="#28C76F" />
          ) : (
            <IoHelpOutline size={20} color="#FF0000" />
          ),
        width: '10rem'
      }
    ]
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-title">
          <h4>Student Milestone</h4>
          <br />
        </div>
        <DataTableExtensions
          print={false}
          export={false}
          filter={false}
          {...milestoneData}
          exportHeaders
        >
          <DataTable
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

  );
};
export default StudentMilestone;
