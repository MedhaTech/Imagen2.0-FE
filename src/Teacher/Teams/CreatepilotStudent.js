/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './Styles.css';
import { useFormik } from "formik";
import * as Yup from "yup";
import CryptoJS from "crypto-js";
import axios from "axios";
import { districtList, collegeType, yearofstudyList, collegeNameList,genderList } from '../../RegPage/ORGData.js';
import { openNotificationWithIcon,getCurrentUser } from "../../helpers/Utils.js";
import { ArrowRight ,ArrowLeft} from 'react-feather';
import { useNavigate } from 'react-router-dom';

const CreatepilotStudent = () => {
  const navigate = useNavigate();
  // const [collegeNamesList, setCollegeNamesList] = useState([]);
  const currentUser = getCurrentUser("current_user");

  // const handleCollegeTypeChange = (event) => {
  //   const collegeType = event.target.value;
  //   formik.setFieldValue("collegeType", collegeType);
  //   formik.setFieldValue('college', '');
  //   formik.setFieldValue('ocn', '');
  //   setCollegeNamesList(collegeNameList[collegeType] || []);
  // };
  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      mobile: "",
      district: "",
      // college: "",
      rollnumber: "",
      branch: "",
      yearofstudy: "",
      password: "",
      confirmPassword: "",
      // collegeType: "",
      // ocn: "",
      id_number:"",
      gender: "",
      college_town: "",
    },

    validationSchema: Yup.object({
      full_name: Yup.string()
        .trim()
        .min(2, <span style={{ color: "red" }}>Please Enter Full Name</span>)
        .matches(
          /^[aA-zZ\s]+$/,
          <span style={{ color: "red" }}>
            Special Characters are not allowed
          </span>
        )
        .required(<span style={{ color: "red" }}>Please Enter Full Name</span>),
      email: Yup.string()
        .email(
          <span style={{ color: "red" }}>Please Enter Valid Email Address</span>
        )
        .required(
          <span style={{ color: "red" }}>Please Enter Email Address</span>
        )
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Email Must be VALID"
        )
        .max(255),
         college_town: Yup.string().optional(),
                          gender: Yup.string().required(
                                 <span style={{ color: "red" }}>Please Select Gender</span>
                               ),
      mobile: Yup.string()
        .required(
          <span style={{ color: "red" }}>Please Enter Mobile Number</span>
        )
        .trim()
        .matches(
          /^\d+$/,
          <span style={{ color: "red" }}>
            Mobile number is not valid (Enter only digits)
          </span>
        )
        .max(
          10,
          <span style={{ color: "red" }}>
            Please enter only 10 digit valid number
          </span>
        )
        .min(
          10,
          <span style={{ color: "red" }}>Number is less than 10 digits</span>
        ),
        id_number: Yup.string().optional(),
      // collegeType: Yup.string().required(
      //   <span style={{ color: "red" }}>Please Select collegeType</span>
      // ),
      district: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Institution District</span>
      ),
      // college: Yup.string().required(
      //   <span style={{ color: "red" }}>Please Select college</span>
      // ),
      rollnumber: Yup.string().required(
        <span style={{ color: "red" }}>Please Enter Roll Number</span>
      ),
      branch: Yup.string().required(
        <span style={{ color: "red" }}>Please Enter  Branch/Group/Stream Name</span>
      ),
      yearofstudy: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Year of Study</span>
      ),
      // password: Yup.string().required(
      //   <span style={{ color: "red" }}>Please Enter Password</span>
      // ),
        password: Yup.string()
            .min(8, () => <span style={{ color: "red" }}>Password must be at least 8 characters</span>)
            .matches(/[a-z]/, () => <span style={{ color: "red" }}>Password must contain at least one lowercase letter</span>)
            .matches(/[A-Z]/, () => <span style={{ color: "red" }}>Password must contain at least one uppercase letter</span>)
            .matches(/\d/, () => <span style={{ color: "red" }}>Password must contain at least one number</span>)
            .matches(/[@$!%*?&]/, () => <span style={{ color: "red" }}>Password must contain at least one special character (@$!%*?&)</span>)
            .required(() => <span style={{ color: "red" }}>Please Enter Password</span>),
      confirmPassword: Yup.string().required(
        <span style={{ color: "red" }}>Please Enter Confirm Password</span>
      )
    }),

    onSubmit: async (values) => {
      const key = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
      const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
      const encrypted = CryptoJS.AES.encrypt(values.confirmPassword, key, {
        iv: iv,
        padding: CryptoJS.pad.NoPadding,
      }).toString();
      const body = {
        full_name: values.full_name,
        username: values.email,
        mobile: values.mobile,
        district: values.district,
        college_type: currentUser?.data[0]?.college_type,
        college_name: currentUser?.data[0]?.college_name,
        // college_type: values.collegeType,
        // college_name: values.college === 'Other' ? values.ocn : values.college,
        roll_number: values.rollnumber,
        branch: values.branch,
        year_of_study: values.yearofstudy,
        gender:values.gender,
        college_town: values.college_town,
        confirmPassword: encrypted
      };
      if (values.id_number !== "") {
        body["id_number"] = values.id_number;
      }
      var config = {
        method: "post",
        url: process.env.REACT_APP_API_BASE_URL + "/students/register",
        headers: {
          "Content-Type": "application/json",
          Authorization: "O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870",
        },

        data: JSON.stringify(body),
      };
      await axios(config)
        .then((pilotstudent) => {
          if (pilotstudent?.data?.status == 201) {
            sessionStorage.setItem('studentpilotKey', pilotstudent?.data?.data[0]?.student_id);
            navigate("/AddCrew1Stu");
            openNotificationWithIcon("success", "Pilot Student Created Successfully");
          }
        })
        .catch((err) => {
          if(err?.response?.data?.status === 406){
            openNotificationWithIcon("error", err.response.data?.message);
  
            }else{
  
              openNotificationWithIcon("error", "Email id is Invalid");
            }
          // setBtn(false);
          formik.setErrors({
            check: err.response && err?.response?.data?.message,
          });
          return err.response;
        });
    },
  });
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="login-userheading">
          <h4>Create Pilot Student</h4>
        </div>
        <div className='d-flex justify-content-center align-items-center'>
          <div className="card container m-4">
            <div className="row">
              <div className="col-md-12 p-4" style={{ backgroundColor: '#EEEEEE' }}>
                <form action="signin" onSubmit={formik.handleSubmit}>
                  <div className="login-userset">
                    <div className="col-xl-12">
                      <div className="row g-3 mt-0">
                        <>
                          <div className="col-md-6">
                            <label className="form-label" htmlFor="full_name">Full Name</label>&nbsp;
                            <span style={{color:"red",fontWeight:"bold"}}>*</span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Full Name"
                              id="full_name"
                              name="full_name"
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                const lettersOnly = inputValue.replace(
                                  /[^a-zA-Z\s]/g,
                                  ""
                                );
                                formik.setFieldValue(
                                  "full_name",
                                  lettersOnly
                                );
                              }}
                              onBlur={formik.handleBlur}
                              value={formik.values.full_name}
                            />
                            {formik.touched.full_name &&
                              formik.errors.full_name ? (
                              <small className="error-cls">
                                {formik.errors.full_name}
                              </small>
                            ) : null}
                          </div>
                           <div className={`col-md-6`}
                                                    >
                                                     <label htmlFor="gender" className="form-label">
                                                                          Gender
                                                                        </label>&nbsp;
                                                      <span style={{color:"red",fontWeight:"bold"}}>*</span>
                                                      <select
                                                                                                     id="gender"
                                                                                                     className="form-select"
                                                                                                     name="gender"
                                                                                                     value={formik.values.gender}
                                                                                                     onChange={formik.handleChange}
                                                                                                     onBlur={formik.handleBlur}
                                                                                                   >
                                                                                                     <option value={""}>Gender</option>
                                                                                                     {genderList.map((item) => (
                                                                                                       <option key={item} value={item}>
                                                                                                         {item}
                                                                                                       </option>
                                                                                                     ))}
                                                                                                   </select>
                                                                                                   {formik.touched.gender && formik.errors.gender ? (
                                                                                                     <small className="error-cls" style={{ color: "red" }}>
                                                                                                       {formik.errors.gender}
                                                                                                     </small>
                                                                                                   ) : null}
                                                    </div>
                          <div className={`col-md-6`}
                          >
                            <label
                              htmlFor="email"
                              className="form-label"
                            >
                              Email
                            </label>&nbsp;
                            <span style={{color:"red",fontWeight:"bold"}}>*</span>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              placeholder="Email"
                              name="email"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.email}
                            />
                            {formik.touched.email && formik.errors.email ? (
                              <small
                                className="error-cls"
                                style={{ color: "red" }}
                              >
                                {formik.errors.email}
                              </small>
                            ) : null}
                          </div>

                          <div className="col-md-6"
                          >
                            <label className="form-label" htmlFor="mobile">
                              Mobile Number
                            </label>&nbsp;
                            <span style={{color:"red",fontWeight:"bold"}}>*</span>

                            <input
                              type="text"
                              className="form-control"
                              id="mobile"
                              placeholder="Mobile"
                              name="mobile"
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                const numericValue = inputValue.replace(
                                  /\D/g,
                                  ""
                                );
                                formik.setFieldValue("mobile", numericValue);
                              }}
                              maxLength={10}
                              minLength={10}
                              onBlur={formik.handleBlur}
                              value={formik.values.mobile}
                            />

                            {formik.touched.mobile && formik.errors.mobile ? (
                              <small className="error-cls">
                                {formik.errors.mobile}
                              </small>
                            ) : null}
                          </div>
                          <div className={`col-md-6`}
                          >
                            <label
                              htmlFor="district"
                              className="form-label"
                            >
                             Institution District
                            </label>&nbsp;
                            <span style={{color:"red",fontWeight:"bold"}}>*</span>
                            <select
                              id="district"
                              className="form-select"
                              name="district"
                              value={formik.values.district}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            >
                              <option value={""}>Select Your Institution District</option>
                              {districtList["Telangana"].map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                            {formik.touched.district &&
                              formik.errors.district ? (
                              <small className="error-cls">
                                {formik.errors.district}
                              </small>
                            ) : null}
                          </div>
                          <div className="col-md-6">
                        <label className="form-label" htmlFor="branch">
                          College Town
                        </label>
                        &nbsp;
                        {/* <span style={{ color: "red", fontWeight: "bold" }}>
                          *
                        </span> */}
                        <input
                          type="text"
                          className="form-control"
                          placeholder="College Town"
                          id="college_town"
                          name="college_town"
                          // onChange={formik.handleChange}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const lettersOnly = inputValue.replace(
                              /[^a-zA-Z0-9 \s]/g,
                              ""
                            );
                            formik.setFieldValue("college_town", lettersOnly);
                          }}
                          onBlur={formik.handleBlur}
                          value={formik.values.college_town}
                        />
                        {formik.touched.college_town &&
                        formik.errors.college_town ? (
                          <small className="error-cls">
                            {formik.errors.college_town}
                          </small>
                        ) : null}
                      </div>
                          {/* <div className={`col-md-4`}
                          >
                            <label
                              htmlFor="collegeType"
                              className="form-label"
                            >
                              College Type
                            </label>&nbsp;
                            <span style={{color:"red",fontWeight:"bold"}}>*</span>
                            <select
                              id="collegeType"
                              className="form-select"
                              name="collegeType"
                              value={formik.values.collegeType}
                              onBlur={formik.handleBlur}
                              onChange={handleCollegeTypeChange}
                            >
                              <option value={""}>College Type</option>
                              {collegeType.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                            {formik.touched.collegeType &&
                              formik.errors.collegeType ? (
                              <small className="error-cls">
                                {formik.errors.collegeType}
                              </small>
                            ) : null}
                          </div> */}

                          {/* <div className={`col-md-6`}
                          >
                            <label
                              htmlFor="college"
                              className="form-label"
                            >
                              College Name
                            </label>&nbsp;
                            <span style={{color:"red",fontWeight:"bold"}}>*</span>
                            <select
                              id="college"
                              className="form-select"
                              name="college"
                              value={formik.values.college}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            >
                              <option value={""}>College Name</option>
                              {collegeNamesList.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                            {formik.touched.college &&
                              formik.errors.college ? (
                              <small className="error-cls">
                                {formik.errors.college}
                              </small>
                            ) : null}
                          </div> */}
                          <div className={`col-md-6`}
                          >
                            <label
                              htmlFor="rollnumber"
                              className="form-label"
                            >
                              Roll Number Provided by the College
                            </label>&nbsp;
                            <span style={{color:"red",fontWeight:"bold"}}>*</span>
                            <input
                              type="text"
                              className="form-control"
                              id="rollnumber"
                              placeholder="Roll Number"
                              name="rollnumber"
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                const lettersOnly = inputValue.replace(
                                  /[^a-zA-Z0-9 \s]/g,
                                  ""
                                );
                                formik.setFieldValue(
                                  "rollnumber",
                                  lettersOnly
                                );
                              }}
                              onBlur={formik.handleBlur}
                              value={formik.values.rollnumber}
                            />
                            {formik.touched.rollnumber && formik.errors.rollnumber ? (
                              <small
                                className="error-cls"
                                style={{ color: "red" }}
                              >
                                {formik.errors.rollnumber}
                              </small>
                            ) : null}
                          </div>
                          {/* {formik.values.college === 'Other' &&
                            <div className={`col-md-12`}
                            >
                              <label
                                htmlFor="ocn"
                                className="form-label"
                              >
                                Other College Name
                              </label>&nbsp;
                              <span style={{color:"red",fontWeight:"bold"}}>*</span>
                              <input
                                type="text"
                                className="form-control"
                                id="ocn"
                                placeholder="Other College Name"
                                name="ocn"
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  const lettersOnly = inputValue.replace(
                                    /[^a-zA-Z0-9 \s]/g,
                                    ""
                                  );
                                  formik.setFieldValue(
                                    "ocn",
                                    lettersOnly
                                  );
                                }}
                                onBlur={formik.handleBlur}
                                value={formik.values.ocn}
                              />
                              {formik.touched.ocn && formik.errors.ocn ? (
                                <small
                                  className="error-cls"
                                  style={{ color: "red" }}
                                >
                                  {formik.errors.ocn}
                                </small>
                              ) : null}
                            </div>
                          } */}


                          <div className="col-md-6">
                            <label className="form-label" htmlFor="branch"> Branch/Group/Stream</label>&nbsp;
                            <span style={{color:"red",fontWeight:"bold"}}>*</span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder=" Branch/Group/Stream"
                              id="branch"
                              name="branch"
                              // onChange={formik.handleChange}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                const lettersOnly = inputValue.replace(
                                  /[^a-zA-Z0-9 \s]/g,
                                  ""
                                );
                                formik.setFieldValue(
                                  "branch",
                                  lettersOnly
                                );
                              }}
                              onBlur={formik.handleBlur}
                              value={formik.values.branch}
                            />
                            {formik.touched.branch &&
                              formik.errors.branch ? (
                              <small className="error-cls">
                                {formik.errors.branch}
                              </small>
                            ) : null}
                          </div>
                          <div className={`col-md-6`}
                      >
                        <label
                          htmlFor="id_number"
                          className="form-label"
                        >
                          APAAR ID
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="id_number"
                          placeholder="APAAR ID"
                          name="id_number"
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const lettersOnly = inputValue.replace(
                              /[^a-zA-Z0-9 \s]/g,
                              ""
                            );
                            formik.setFieldValue(
                              "id_number",
                              lettersOnly
                            );
                          }}
                          onBlur={formik.handleBlur}
                          value={formik.values.id_number}
                        />
                        {formik.touched.id_number && formik.errors.id_number ? (
                          <small
                            className="error-cls"
                            style={{ color: "red" }}
                          >
                            {formik.errors.id_number}
                          </small>
                        ) : null}
                      </div>
                          <div className={`col-md-6`}
                          >
                            <label
                              htmlFor="yearofstudy"
                              className="form-label"
                            >
                              Year of Study
                            </label>&nbsp;
                            <span style={{color:"red",fontWeight:"bold"}}>*</span>
                            <select
                              id="yearofstudy"
                              className="form-select"
                              name="yearofstudy"
                              value={formik.values.yearofstudy}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            >
                              <option value={""}>Select Year of Study</option>
                              {yearofstudyList.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                            {formik.touched.yearofstudy &&
                              formik.errors.yearofstudy ? (
                              <small className="error-cls">
                                {formik.errors.yearofstudy}
                              </small>
                            ) : null}
                          </div>

                          <div className={`col-md-6`}
                          >
                            <label
                              htmlFor="password"
                              className="form-label"
                            >
                              Password
                            </label>&nbsp;
                            <span style={{color:"red",fontWeight:"bold"}}>*</span>
                            <input
                              type="text"
                              name="password"
                              placeholder="Password"
                              id="password"
                              className="form-control"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.password}
                            />
                            {formik.touched.password &&
                              formik.errors.password ? (
                              <small className="error-cls">
                                {formik.errors.password}
                              </small>
                            ) : null}
                          </div>
                          <div className={`col-md-6`}
                          >
                            <label
                              htmlFor="confirmPassword"
                              className="form-label"
                            >
                              Confirm Password
                            </label>&nbsp;
                            <span style={{color:"red",fontWeight:"bold"}}>*</span>
                            <input
                              type="text"
                              name="confirmPassword"
                              placeholder="Confirm Password"
                              id="confirmPassword"
                              className="form-control"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.confirmPassword}
                            />
                            {formik.touched.confirmPassword &&
                              formik.errors.confirmPassword ? (
                              <small className="error-cls">
                                {formik.errors.confirmPassword}
                              </small>
                            ) : null}
                            {
                              (formik.values.confirmPassword !== '' && !(formik.values.password === formik.values.confirmPassword)) &&
                              <small className="text-danger">
                                Confirm Password is not same as Password
                              </small>
                            }
                          </div>
                        </>

                        <div className="form-login d-flex justify-content-between">
                          
                          <button
                            className="btn btn-warning m-2"
                            type="submit"
                            onClick={() => navigate("/mentorteams")}

                          >
                            {/* <ArrowLeft /> */}
                            Back
                          </button>
                          <button
                            className="btn btn-warning m-2"
                            type="submit"
                            disabled={
                              !formik.isValid || !formik.dirty || !(formik.values.password === formik.values.confirmPassword)
                            }
                          >
                            PROCEED
                            {/* <ArrowRight /> */}
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatepilotStudent;
