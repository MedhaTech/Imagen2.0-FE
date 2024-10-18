/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Form, Label, Card } from "reactstrap";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { openNotificationWithIcon, getCurrentUser } from "../../helpers/Utils";
import { useDispatch } from "react-redux";
import { teacherCreateMultipleStudent } from "../store/teacher/actions";
import { useLocation } from "react-router-dom";
import { encryptGlobal } from "../../constants/encryptDecrypt";
import { useNavigate } from "react-router-dom";

// import { all_routes } from "../../Router/all_routes";
const studentBody = {
  full_name: "",
  Age: "",
  Grade: "",
  Gender: "",
  disability: "",
  // username: "",
};
const grades = [6, 7, 8, 9, 10, 11, 12];
const allowedAge = [10, 11, 12, 13, 14, 15, 16, 17, 18];

const CreateMultipleMembers = ({ id }) => {
  const [teamId, setTeamId] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  // const [itemDataErrors, setItemDataErrors] = useState([]);
  const tempStudentData = {
    team_id: teamId,
    role: "STUDENT",
    full_name: "",
    Age: "",
    Grade: "",
    Gender: "",
    disability: "",
    // username: "",
  };
  const dispatch = useDispatch();
  const [itemDataErrors, setItemDataErrors] = useState([studentBody]);
  const currentUser = getCurrentUser("current_user");

  //   const history = useHistory();
  const navigate = useNavigate();

  const [isClicked, setIsClicked] = useState(false);
  const [teamname, setTeamname] = useState("");
  const [teamemail, setTeamemail] = useState("");

  const [teamNameError, setTeamNameError] = useState("");

  // const handleteamname = (e) => {
  //   const numericValue = e.target.value;
  //   const trimmedValue = numericValue.trim();
  //   setTeamname(trimmedValue);

  //   if (trimmedValue.length < 1) {
  //     setTeamNameError("Please Enter Team Name");
  //   } else {
  //     setTeamNameError("");
  //   }
  // };
  const handleteamname = (e) => {
    const inputValue = e.target.value;
    //const lettersOnly = inputValue.replace(/[^a-zA-Z\s]/g, "");
    const patternOnlyalfa = /^[a-zA-Z0-9\s]*$/;
    setTeamname(inputValue);

    if (inputValue.trim().length < 1) {
      setTeamNameError("Please Enter Team Name");
    } else if (!patternOnlyalfa.test(inputValue)) {
      setTeamNameError("Only alphanumeric characters are allowed");
    } else {
      setTeamNameError("");
    }
  };
  // const handleteamemail = (e) => {
  //   const numericValue = e.target.value;
  //   const trimmedValue = numericValue.trim();

  //   setTeamemail(trimmedValue);
  // };
  const [emailError, setEmailError] = useState("");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const handleteamemail = (e) => {
    const numericValue = e.target.value;
    const trimmedValue = numericValue.trim();
    setTeamemail(trimmedValue);

    if (!emailPattern.test(trimmedValue)) {
      setEmailError("Enter a valid email address");
    } else {
      setEmailError("");
    }
  };
  const [studentData, setStudentData] = useState([
    {
      team_id: teamId,
      role: "STUDENT",
      full_name: "",
      Age: "",
      Grade: "",
      Gender: "",
      // username: "",
      disability: "",
    },
    {
      team_id: teamId,
      role: "STUDENT",
      full_name: "",
      Age: "",
      Grade: "",
      Gender: "",
      // username: "",
      disability: "",
    },
    {
      team_id: teamId,
      role: "STUDENT",
      full_name: "",
      Age: "",
      Grade: "",
      Gender: "",
      // username: "",
      disability: "",
    },
  ]);
  let pattern = /^[A-Za-z\s]+$/;
  // const emailRegex = /[A-Za-z-@+.-]*$/;
  const emailRegex = /^[\w.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const handleChange = (e, i) => {
    let newItem = [...studentData];
    const dataKeys = Object.keys(studentBody);
    if (e.target) {
      dataKeys.some((item) => {
        if (e.target.name === item) {
          newItem[i][e.target.name] = e.target.value;
          let errCopy = [...itemDataErrors];
          if (item === "full_name") {
            let check = e.target.value;
            if (check && check.match(pattern)) {
              const { index } = check.match(pattern);
              if (index) {
                const foo = { ...errCopy[i] };
                foo[e.target.name] = "Only alphanumeric characters are allowed";
                errCopy[i] = { ...foo };
                setItemDataErrors(errCopy);
                return;
              }
            }
          }
          // if (item === "username") {
          //   let check = e.target.value;
          //   if (check && check.match(emailRegex)) {
          //     const { index } = check.match(emailRegex);
          //     if (index) {
          //       const foo = { ...errCopy[i] };
          //       foo[e.target.name] = "Enter Valid Mail Id";
          //       errCopy[i] = { ...foo };
          //       setItemDataErrors(errCopy);
          //       return;
          //     }
          //   }
          // }
          const foo = { ...errCopy[i] };
          foo[e.target.name] = "";
          errCopy[i] = { ...foo };
          setItemDataErrors(errCopy);
        }
        return;
      });
    }

    setStudentData(newItem);
  };
  const validateItemData = () => {
    const errors = studentData.map((item, i) => {
      let err = {};
      if (!item.full_name.trim()) {
        err["full_name"] = (
          <span style={{ color: "red" }}>Please Enter Full Name</span>
        );
      } else if (!/^[A-Za-z\s]+$/i.test(item.full_name)) {
        err["full_name"] = (
          <span style={{ color: "red" }}>
            Only alphabetical characters and spaces are allowed
          </span>
        );
      }
      // if (!item.full_name.trim())
      //   err["full_name"] = (
      //     <span style={{ color: "red" }}>Please Enter Full Name</span>
      //   );
      // if (item.full_name && item.full_name.match(pattern)) {
      //   const { index } = item.full_name.match(pattern);
      //   if (index) {
      //     err["full_name"] = (
      //       <span style={{ color: "red" }}>Only alphanumeric are allowed</span>
      //     );
      //   }
      // }

      // if (!item.username.trim()) err["username"] = "Email is Required";
      // if (item.username) {
      //     const start = item.username.indexOf('@');
      //     const main = item.username.substring(start);
      //     const checkarry = ['@gmail.com', '@outlook.com', '@yahoo.com'];
      //     const text = checkarry.includes(main);
      //     if (!text) {
      //         err['username'] = 'Enter Valid Mail Id';
      //     }
      // }

      if (!item.Age)
        err["Age"] = <span style={{ color: "red" }}>Please Select Age</span>;

      if (!item.disability)
        err["disability"] = (
          <span style={{ color: "red" }}>Please Select Disability Status</span>
        );
      if (!item.Grade)
        err["Grade"] = (
          <span style={{ color: "red" }}>Please Select Class</span>
        );
      if (!item.Gender)
        err["Gender"] = (
          <span style={{ color: "red" }}>Please Select Gender</span>
        );
      if (Object.values(err).length === 0) {
        return { ...studentBody, i };
      }
      return { ...err, i };
    });
    // const combinedErrors = [...errors, teamErrors];
    setItemDataErrors(errors.filter((item) => Object.values(item).length > 0));
    const filterEmpty = errors.filter((item) => {
      const ce = { ...item };
      delete ce.i;
      return Object.values(ce).filter(Boolean).length > 0;
    });
    if (filterEmpty.length > 0) {
      return false;
    } else {
      return true;
    }
  };
  const addItem = () => {
    if (!validateItemData()) {
      return;
    } else {
      setStudentData([...studentData, tempStudentData]);
    }
  };
  const containsDuplicates = (array) => {
    if (array.length !== new Set(array).size) {
      return true;
    }
    return false;
  };
  const removeItem = (i) => {
    let newItems = [...studentData];
    newItems.splice(i, 1);
    setStudentData(newItems);
  };
  const handleSumbit = () => {
    // alert("hii");
    if (!validateItemData()) return;
    //setIsClicked(true);
    const checkDuplicateName = containsDuplicates(
      studentData.map((item) => item.full_name)
    );
    if (checkDuplicateName) {
      openNotificationWithIcon(
        "error",
        "Not allows Duplicate student names in team"
      );
      setIsClicked(false);
      return;
    }
    const body = {
      mentor_id: JSON.stringify(currentUser?.data[0]?.mentor_id),
      team_name: teamname,
      team_email: teamemail,
    };
    var config = {
      method: "post",
      url: process.env.REACT_APP_API_BASE_URL + "/teams",
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
      data: body,
    };
    axios(config)
      .then(function (response) {
        if (response.status === 201) {
          const newTeamId = response.data.data[0].profile.team_id;
          setTeamId(response.data.data[0].profile.team_id);
          openNotificationWithIcon("success", "Team Created Successfully");
          setIsClicked(true);
          const updatedStudentData = studentData.map((student) => ({
            ...student,
            team_id: JSON.stringify(newTeamId),
          }));
          setTimeout(() => {
            dispatch(
              teacherCreateMultipleStudent(
                updatedStudentData,
                navigate,
                setIsClicked
              )
            );
          }, 2000);
          // if (teamId) {
          //   setTimeout(() => {
          //     dispatch(
          //       teacherCreateMultipleStudent(
          //         updatedStudentData,
          //         navigate,
          //         setIsClicked
          //       )
          //     );
          //   }, 5000);
          // }

          // dispatch(
          //   teacherCreateMultipleStudent(studentData, navigate, setIsClicked)
          // );
        } else {
          openNotificationWithIcon("error", "Opps! Something Wrong");
        }
      })
      .catch(function (error) {
        if (error.response.data.status === 400) {
          // console.log(error, "eee");
          openNotificationWithIcon(
            "error",
            "Duplicate team names are not allowed"
          );
        }
      });
    // dispatch(teacherCreateMultipleStudent(studentData, navigate, setIsClicked));
  };

  const button = teamname && teamemail && studentData;
 
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="add-item d-flex">
          <div className="page-title">
            <h4>Team and Students Registration into YFSI</h4>
            <h6>Create new team and add students</h6>
          </div>
        </div>
        <ul className="table-top-head">
          <li>
            <div className="page-btn">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/mentorteams")}
              >
                <i className="fas fa-arrow-left"></i> Back to Teams
              </button>
            </div>
          </li>
        </ul>
      </div>

      <div className="card">
        <div className="card-body pb-0">
          <div className="card-title-head">
            <h6>TEAM DETAILS</h6>
          </div>
          <Row className="mb-3 modal-body-table search-modal-header">
            <Col md={6}>
              <Label className="form-label">
                Team Name
                <span required className="p-1">
                  *
                </span>
              </Label>
              <input
                className="form-control"
                placeholder="Enter Team Name"
                id="teamname"
                name="teamname"
                onChange={(e) => handleteamname(e)}
                value={teamname}
              />
              {teamNameError && (
                <span style={{ color: "red" }}>{teamNameError}</span>
              )}
            </Col>
            <Col md={6} className="mb-xl-0">
              <Label className="form-label">
                Team Email Address
                <span required className="p-1">
                  *
                </span>
              </Label>
              <input
                className="form-control"
                placeholder="Enter Email Address"
                id="teamemail"
                name="teamemail"
                type="email"
                onChange={(e) => handleteamemail(e)}
                value={teamemail}
              />
              {emailError && <span style={{ color: "red" }}>{emailError}</span>}
            </Col>
          </Row>
          <div className="card-title-head">
            <h6>STUDENTS DETAILS</h6>
          </div>
          {studentData.map((item, i) => {
            const foundErrObject = { ...itemDataErrors[i] };
            return (
              <div key={i + item} className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mt-2 mb-2">STUDENT {i + 1} DETAILS</h6>
                  {i > 1 && (
                    <button
                      onClick={() => removeItem(i)}
                      className="btn btn-sm btn-square btn-soft-danger"
                    >
                      <i className="fa-solid fa-xmark"></i> Remove
                    </button>
                  )}
                </div>
                {/* <hr /> */}
                <Row className="mb-3 modal-body-table search-modal-header">
                  {/* <Row> */}
                  <Col md={3}>
                    <Label className="form-label">
                      Full Name
                      <span required className="p-1">
                        *
                      </span>
                    </Label>
                    <input
                      className="form-control"
                      placeholder="Enter Full Name"
                      id="full_name"
                      name="full_name"
                      onChange={(e) => {
                        handleChange(e, i);
                      }}
                      value={item.full_name}
                    />
                    {foundErrObject?.full_name ? (
                      <small className="error-cls">
                        {foundErrObject.full_name}
                      </small>
                    ) : null}
                  </Col>
                  {/* <Col md={6} className="mb-xl-0">
                        <Label className="form-label">
                          Email Address
                          <span required className="p-1">
                            *
                          </span>
                        </Label>
                        <input
                          className="form-control"
                          placeholder="Enter Email Id"
                          id="username"
                          name="username"
                          onChange={(e) => {
                            handleChange(e, i);
                          }}
                          value={item.username}
                        />
                        {foundErrObject?.username ? (
                          <small className="error-cls">
                            {foundErrObject.username}
                          </small>
                        ) : null}
                      </Col> */}
                  {/* </Row> */}
                  <Col md={2} className="mb-xl-0">
                    <Label htmlFor="inputState" className="form-label">
                      Age
                      <span required className="p-1">
                        *
                      </span>
                    </Label>
                    <select
                      id="inputState"
                      className="form-select"
                      name="Age"
                      value={item.Age}
                      onChange={(e) => handleChange(e, i)}
                    >
                      <option value={""}>Select Age</option>
                      {allowedAge.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    {foundErrObject?.Age ? (
                      <small className="error-cls">{foundErrObject.Age}</small>
                    ) : null}
                  </Col>
                  <Col md={3} className="mb-xl-0">
                    <Label htmlFor="inputState" className="form-label">
                      Disability
                      <span required className="p-1">
                        *
                      </span>
                    </Label>
                    <select
                      id="inputState"
                      className="form-select"
                      name="disability"
                      value={item.disability}
                      onChange={(e) => handleChange(e, i)}
                    >
                      <option value="">Select Status</option>
                      <option value="No">No</option>
                      <option value="Physically Challenged">
                        Physically Challenged
                      </option>
                      <option value="Visually Challenged">
                        Visually Challenged
                      </option>
                      <option value="Locomotor Disability">
                        Locomotor Disability
                      </option>
                      <option value="Intellectual Disability">
                        Intellectual Disability
                      </option>
                      <option value="Learning Disability">
                        Learning Disability
                      </option>
                      <option value="Hearing Impaired">Hearing Impaired</option>
                      <option value="Autism or Cerebral Palsy or Other">
                        Autism/Cerebral Palsy/Other
                      </option>
                      <option value="Others">Others</option>
                    </select>
                    {foundErrObject?.disability ? (
                      <small className="error-cls">
                        {foundErrObject.disability}
                      </small>
                    ) : null}
                  </Col>

                  <Col md={2}>
                    <Label htmlFor="inputState" className="form-label">
                      Class
                      <span required className="p-1">
                        *
                      </span>
                    </Label>
                    <select
                      id="inputState"
                      className="form-select"
                      name="Grade"
                      value={item.Grade}
                      onChange={(e) => handleChange(e, i)}
                    >
                      <option value="">Select Class</option>
                      {grades.map((item) => (
                        <option key={item} value={item}>
                          Class {item}
                        </option>
                      ))}
                    </select>
                    {foundErrObject?.Grade ? (
                      <small className="error-cls">
                        {foundErrObject?.Grade}
                      </small>
                    ) : null}
                  </Col>
                  <Col md={2} className="mb-5 mb-xl-0">
                    <Label htmlFor="inputState" className="form-label">
                      Gender
                      <span required className="p-1">
                        *
                      </span>
                    </Label>

                    <select
                      id="inputState"
                      className="form-select"
                      name="Gender"
                      value={item.Gender}
                      onChange={(e) => handleChange(e, i)}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Prefer Not to Mention">Prefer Not to Mention</option>
                    </select>
                    {foundErrObject?.Gender ? (
                      <small className="error-cls">
                        {foundErrObject?.Gender}
                      </small>
                    ) : null}
                  </Col>
                </Row>
              </div>
            );
          })}
        </div>
      </div>

      <Row>
        <Col className="mt-2 text-left">
          {!isClicked ? (
            <button
              type="submit"
              className="btn btn-warning text-left"
              onClick={handleSumbit}
              disabled={!button}
            >
              CREATE TEAM
            </button>
          ) : (
            <button type="button" className="btn btn-warning text-right">
              CREATE TEAM
            </button>
          )}
          {/* {studentData.length < 4 && (
                  <div className="">
                    <button
                      // label={"Add More"}
                      onClick={addItem}
                      // btnClass={
                      //   studentData.length != 3 ? "primary" : "default"
                      // }
                      // size="small"
                      disabled={studentData.length === 3}
                    >
                      Add More
                    </button>
                  </div>
                )} */}
        </Col>
        {/* <Col className="mt-2 text-right">
            <button
              type="button"
              className="btn btn-secondary m-2 ml-auto"
              onClick={() => navigate("/mentorteams")}
            >
              Discard
            </button>
          </Col> */}
        <Col className="mt-2 d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-secondary "
            onClick={() => navigate("/mentorteams")}
          >
            DISCARD
          </button>
        </Col>
      </Row>
    </div>
  );
};
export default CreateMultipleMembers;
