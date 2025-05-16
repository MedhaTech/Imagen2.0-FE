/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import {
  getCurrentUser,
  openNotificationWithIcon,

} from '../../helpers/Utils';
import axios from 'axios';
import Select from "react-select";

const InstOption = () => {
  const currentUser = getCurrentUser('current_user');
  useEffect(() => {
    AllCollegesApi();
  }, []);
  const AllCollegesApi = () => {
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/dashboard/CollegeNameForCollegeType`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          const apiData = response.data.data || [];
          const collegeNames = apiData.map((college) => college.college_name);
          setCollegeNamesList(collegeNames);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const [collegeNamesList, setCollegeNamesList] = useState([]);
  const collegeOptions = collegeNamesList.map((item) => ({
    value: item,
    label: item,
  }));
  const [oldCollegeName, setOldCollegeName] = useState(null);
  const [newcolleheName, setNewcolleheName] = useState('');
 
  const handleOldCollegeName = (oldCollegeName) => {
    setOldCollegeName(oldCollegeName);
  };

  const handleNewCollegeName = (e) => {
    setNewcolleheName(e.target.value);
  };
  const handleUpdate = () => {
    if (oldCollegeName === '' || newcolleheName === '') {
      openNotificationWithIcon(
        "error",
        "College Name and New College Name should not be empty"
      );
      return;
    }
    var config = {
      method: "put",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/admins/updateInstitutionOption`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
      data: {
        oldcn: oldCollegeName.value,
        newcn: newcolleheName
      }
    };
    axios(config)
      .then(function (response) {
        if (response.status === 202) {
          openNotificationWithIcon(
            "success",
            "College Name Updated"
          );
          AllCollegesApi();
          document.getElementById('ocn').value = '';
          setOldCollegeName(null);
          setNewcolleheName('');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="page-title">

              <h4>College Name Change Option</h4>
              <div className="row g-3 mt-0">
                <div className={`col-md-6`}>
                  <label htmlFor="college" className="form-label">
                    Old College Name
                  </label>
                  &nbsp;
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    *
                  </span>
                  <Select
                    value={oldCollegeName}
                    classNamePrefix="react-select"
                    isClearable={true}
                    options={collegeOptions}
                    placeholder=" Type here to Select old College Name"
                    onChange={handleOldCollegeName}
                  />
                </div>
                <div className={`col-md-6`}>
                  <label htmlFor="ocn" className="form-label">
                    New College Name
                  </label>
                  &nbsp;
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    *
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    id="ocn"
                    placeholder="Enter New College Name"
                    name="ocn"
                    onChange={(e) => {
                      handleNewCollegeName(e);
                    }}
                  />

                </div>
                <div className={`col-md-1`}>
                  <button
                    className="btn btn-warning m-2"
                    type="button"
                    onClick={handleUpdate}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstOption;
