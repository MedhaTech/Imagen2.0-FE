/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../helpers/Utils";
import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";
import { encryptGlobal } from "../constants/encryptDecrypt";
import axios from "axios";
import Avatar from 'react-string-avatar';

const TeacherProfile = () => {
  const location = useLocation();

  const currentUser = getCurrentUser("current_user");
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const user = currentUser.data[0]?.student_id;
  useEffect(() => {
    mentorViewApi();
  }, [user]);
  const handleEditData = () => {
    navigate("/studentProfileEdit", {
      state: {
        gender: data.gender,
        college_town: data.college_town,
      },
    });
  };

  const mentorViewApi = () => {
    // this function fetches current user all details from the API 

    let supId;
    if (typeof user !== "string") {
      supId = encryptGlobal(JSON.stringify(user));
    } else {
      supId = encryptGlobal(user);
    }
    var config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL + `/students/${supId}`,
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
  const maskEmail = (email) => {
    if (!email || !email.includes('@')) return email; 
    const [username, domain] = email.split('@');
    const maskedUsername = username.slice(0, 3) + '****'; 
    return `${maskedUsername}@${domain}`;
  };
  const maskMobileNumber = (mobile) => {
    if (!mobile || mobile.length < 10) return mobile; 
    return mobile.slice(0, -3).replace(/\d/g, '*') + mobile.slice(-3);
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>My Profile</h4>
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
                  
                  <Avatar  initials={(data?.full_name?.split(' ').map(w => w.charAt(0)).join('')) || 'NN'}  bgColor="#36adf2" textColor="black" roundShape="true" pictureResolution={256}  height={100}  width={110}></Avatar>

                  
                  <div className="profileupload"></div> 
                  </div>
                  <div className="profile-contentname">
                    <h2>{data?.full_name}</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Student Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data?.full_name}
                    readOnly="readonly"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Gender</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data.gender}
                    readOnly="readonly"
                  />
                </div>
              </div>
                             <div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data.dateofbirth}
                    readOnly="readonly"
                  />
                </div>
              </div> <div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Disability Status</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data.disability}
                    readOnly="readonly"
                  />
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Area of Residence</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={maskEmail(data?.area)}
                    readOnly="readonly"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    defaultValue={maskEmail(currentUser?.data[0]?.name)}
                    readOnly="readonly"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label>Mobile Number</label>
                  <input
                    type="email"
                    className="form-control"
                    defaultValue={maskMobileNumber(data?.mobile)}
                    readOnly="readonly"
                  />
                </div>
              </div>

              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">District</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data.district}
                    readOnly="readonly"
                  />
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label>College Town</label>
                  <input
                    type="email"
                    className="form-control"
                    defaultValue={data.college_town !== null && data.college_town !== '' ? data.college_town : "-"}
                    readOnly="readonly"
                  />
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">College Type</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data.college_type}
                    readOnly="readonly"
                  />
                </div>
              </div>
             {data.college_type == "Other" &&( <><div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">College Name</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="Other"
                    readOnly="readonly" />
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                  <div className="input-blocks">
                    <label className="form-label">Other College Name</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={data.college_name}
                      readOnly="readonly" />
                  </div>
                </div></>)}
               {data.college_type !== "Other" &&( <div className="col-lg-7 col-sm-12">
                  <div className="input-blocks">
                    <label className="form-label">College Name</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={data.college_name}
                      readOnly="readonly" />
                  </div>
                </div>)}
              <div className={`col-lg-${
    data.college_type !== "Other" ? "5" : "4"
  } col-sm-12`}>
                <div className="input-blocks">
                  <label className="form-label">
                    Roll Number Provided by the College
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data.roll_number}
                    readOnly="readonly"
                  />
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label"> Branch/Group/Stream</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data.branch}
                     readOnly="readonly"
                  />
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">APAAR ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={data?.id_number ? data.id_number : "-"}
                    readOnly="readonly"
                  />
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Year of Study</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data.year_of_study}
                    readOnly="readonly"
                  />
                </div>
              </div>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
