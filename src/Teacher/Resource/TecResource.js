/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../helpers/Utils";
import { encryptGlobal } from "../../constants/encryptDecrypt";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import FileGrid from "../../Team/StuResources/FileGrid";
const TecResource = () => {
  const currentUser = getCurrentUser("current_user");
  const navigate = useNavigate();
  const [resList, setResList] = useState([]);

  useEffect(() => {
    fetchResourceList();
  }, []);

  async function fetchResourceList() {
    const fectchTecParam = encryptGlobal(
      JSON.stringify({
        role: "Institution",
      })
    );

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/resource?Data=${fectchTecParam}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser?.data[0]?.token}`,
          },
        }
      );
      if (response.status === 200) {
        setResList(response.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const resData = {
    data: resList || [],
    columns: [
      {
        name: "No",
        selector: (row, key) => key + 1,
        sortable: true,
        width: "6%",
      },
      {
        name: "Details",
        selector: (row) => row.description,
        width: "65%",
      },
     
      {
        name: "File / Link",
        width: "20%",
        cell: (record) => {
          if (record.type === "file") {
            return (
                <a
                  href={record.attachments}
                  target="_blank"
                  className="badge badge-md bg-secondary"
                  rel="noopener noreferrer"
                >
                  <i className="fas fa-file-lines"></i> Navigate
                </a>
            );
          } else if (record.type === "link") {
            return (
                <a
                  href={record.attachments}
                  target="_blank"
                  className="badge badge-md bg-secondary"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-youtube"></i> Navigate
                </a>
            );
          }
          return null;
        },
      },
    ],
  };
 
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Resources</h4>
            <h6>List of  program resources</h6>
          </div>
        </div>
        <div>
          <FileGrid resList={resList} />
        </div>
       
      </div>
    </div>
  );
};

export default TecResource;
