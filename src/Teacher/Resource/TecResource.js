/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../../helpers/Utils";
import { encryptGlobal } from "../../constants/encryptDecrypt";

import { useNavigate } from "react-router-dom";
import DataTableExtensions from "react-data-table-component-extensions";
import DataTable, { Alignment } from "react-data-table-component";
import axios from "axios";
const TecResource = () => {
  const currentUser = getCurrentUser("current_user");
  const navigate = useNavigate();
  const [resList, setResList] = useState([]);
  const [rows, setRows] = React.useState([]);

  useEffect(() => {
    fetchResourceList();
  }, []);

  async function fetchResourceList() {
    const fectchTecParam = encryptGlobal(
      JSON.stringify({
        role: "mentor",
      })
    );

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/resource/list?Data=${fectchTecParam}`,
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
        width: "15%",
      },
      {
        name: "Details",
        selector: (row) => row.description,
        width: "45%",
      },
      // {
      //     name: 'Type',
      //     selector: (row) => row.type,
      //     width: '25%'
      // },
      {
        name: "File/Link",
        width: "40%",
        cell: (record) => {
          if (record.type === "file") {
            return (
              <button className="btn btn-warning  mx-2">
                <a
                  href={record.attachments}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "black" }}
                >
                  Navigate
                </a>
              </button>
            );
          } else if (record.type === "link") {
            return (
              <button className="btn btn-warning  mx-2">
                <a
                  href={record.attachments}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "black" }}
                >
                  Navigate
                </a>
              </button>
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
          </div>
        </div>
        <div className="my-2">
          <DataTableExtensions
            data={rows}
            print={false}
            export={false}
            {...resData}
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
    </div>
  );
};

export default TecResource;
