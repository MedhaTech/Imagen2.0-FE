/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../helpers/Utils";
import { encryptGlobal } from "../../constants/encryptDecrypt";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import FileGrid from "./FileGrid";
const StuResource = () => {
  const currentUser = getCurrentUser("current_user");
  const navigate = useNavigate();
  const [resList, setResList] = useState([]);

  useEffect(() => {
    fetchResourceList();
  }, []);

  async function fetchResourceList() {
     // this function fetches all resources list from the API

    const fectchTecParam = encryptGlobal(
      JSON.stringify({
        role: "student",
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

 



return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Resources</h4>
            <h6>List of program related resources</h6>
          </div>
        </div>
        <div>
          <FileGrid resList={resList} />
        </div>
       
        
      </div>
    </div>
  );
};

export default StuResource;
