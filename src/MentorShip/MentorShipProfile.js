/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState,useEffect } from "react";
import { getCurrentUser } from "../helpers/Utils";
import male from "../assets/img/imazenlogo1.jpg";
import { useNavigate } from "react-router-dom";

import { encryptGlobal } from "../constants/encryptDecrypt";
import axios from "axios";
const MentorShipProfile = () => {
  const currentUser = getCurrentUser("current_user");
    const navigate = useNavigate();
  
    const [data, setData] = useState([]);
  
 useEffect(() => {
    mentorGetApi();
  }, []);
   const mentorGetApi = () => {
      // this function fetches current user all details from the API 
  
      let supId;
      if (typeof currentUser.data[0]?.mentorship_id !== "string") {
        supId = encryptGlobal(JSON.stringify(currentUser.data[0]?.mentorship_id));
      } else {
        supId = encryptGlobal(currentUser.data[0]?.mentorship_id);
      }
      var config = {
        method: "get",
        url: process.env.REACT_APP_API_BASE_URL + `/mentorships/${supId}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${currentUser.data[0]?.token}`,
        },
      };
      axios(config)
        .then(function (response) {
          if (response.status === 200) {
            setData(response.data.data[0]);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };
     const handleEditData = () => {
    navigate("/Mentorship-ProfileEdit", {
      state: {
        full_name: data?.user?.full_name,
        college_name: data?.college_name,
        mobile: data?.mobile,
        username: data?.user?.username,
        area_of_expertise: data?.areas_of_expertise,

      },
    });
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Mentorship Profile</h4>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="profile-set">
              <div className="profile-head text-end">
                 <div
                              className="btn text-success"
                              style={{ fontSize: "1.5rem"}}
                              onClick={() => handleEditData()}
                            >
                              {" "}
                              <i data-feather="edit" className="feather-edit" />
                            </div>
              </div>
              <div className="profile-top">
                <div className="profile-content">
                  <div className="profile-contentimg">
                  <img src={male} alt="Male" id="blah" />
                  </div>
                  <div className="profile-contentname">
                    <h2>{data?.user?.full_name}</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">User Name</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data?.user?.full_name}
                    readOnly="readonly"
                  />
                </div>
              </div>
             
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    defaultValue={data?.user?.username}
                    readOnly="readonly"
                  />
                </div>
              </div>
            
               
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label>Mobile</label>
                  <input
                    type="email"
                    className="form-control"
                    defaultValue={data?.mobile}
                    readOnly="readonly"
                  />
                </div>
              </div>
               <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label>Organization / Institution</label>
                  <input
                    type="email"
                    className="form-control"
                    defaultValue={data?.college_name}
                    readOnly="readonly"
                  />
                </div>
              </div>
               <div className="col-lg-12 col-sm-12">
                <div className="input-blocks">
                  <label>Areas of Expertise</label>
                  <input
                    type="email"
                    className="form-control"
                    defaultValue={data?.areas_of_expertise}
                    readOnly="readonly"
                  />
                </div>
              </div>
             
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
    </div>
  );
};

export default MentorShipProfile;
