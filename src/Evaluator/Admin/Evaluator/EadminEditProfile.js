/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect } from "react";

import axios from "axios";
import { useLocation } from "react-router-dom";
import male from "../../../assets/img/imazenlogo1.jpg";
import { MaskedEmail, MaskedMobile } from "../../../RegPage/MaskedData.js";

import * as Yup from "yup";
import { useFormik } from "formik";
import {
  getCurrentUser,
  openNotificationWithIcon,
} from "../../../helpers/Utils";
import { useNavigate } from "react-router-dom";
import { getAdminEvalutorsList } from "../../../redux/actions";
import { useDispatch } from "react-redux";

import { encryptGlobal } from "../../../constants/encryptDecrypt";
const EditProfile = (props) => {
  // here we can edit the users details //
  const phoneRegExp = /^[0-9]+$/;

  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser("current_user");
  const dispatch = useDispatch();
  const mentorData = location.state || {};

 

 

  const getValidationSchema = (data) => {
    // where data = mentorData //
    const adminValidation = Yup.object({
      name: Yup.string()
        .matches(/^[a-zA-Z\s._-]+$/, 'Not allowed')
        .min(2, "Please Enter a Full Name")
        .required("Please Enter Full Name"),
      email: Yup.string()
        .optional()
        .trim()
        .email("Please Enter Valid Email Id"),
      mobile: Yup.string()
        .optional()
        .trim()
        .min(10, "Number is less than 10 digits")
        .max(10, "Please Enter Valid Number"),
     
    });
    if (data?.mentor_id)
      if (data?.evaluator_id)
       
        adminValidation["district"] = Yup.string()
          .matches(/^[aA-zZ\s]+$/, "Invalid District Name ")
          .min(2, "Enter a valid district")
          .required("District is Required");
    return adminValidation;
  };
  const getInitialValues = (data) => {
    const commonInitialValues = {
      name: mentorData?.full_name || mentorData?.user?.full_name,
      email: "",
      mobile: "",
    
    };
    
    return commonInitialValues;
  };
  const formik = useFormik({
    initialValues: getInitialValues(mentorData),
    validationSchema: getValidationSchema(mentorData),
    onSubmit: (values) => {
    
      const full_name = values.name;
      const email = values.email;

      const evlId = encryptGlobal(JSON.stringify(mentorData.evaluator_id));
      const body = {
        full_name: full_name,
      };

     
      if (values.mobile && mentorData?.mobile !== values.mobile) {
        body["mobile"] = values.mobile;
    }
    if (email && mentorData?.user?.username !== email) {
        body["username"] = email;
    }

      const url = process.env.REACT_APP_API_BASE_URL + `/evaluators/${evlId}`;

      var config = {
        method: "put",
        url: url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.data[0]?.token}`,
        },
        data: body,
      };
      axios(config)
        .then(function (response) {
          if (response.status === 200) {
            mentorData?.evaluator_id
              ? dispatch(getAdminEvalutorsList())
              : mentorData?.admin_id && dispatch(getAdmin());
            openNotificationWithIcon("success", "Updated Successfully");
            setTimeout(() => {
              navigate("/eadmin/evaluator");
            }, 200);
          }
        })
        .catch(function (error) {
          console.log(error);
          if(error?.response?.data?.status === 400){
            openNotificationWithIcon("error", error.response.data?.message !== "Bad Request" ?  error.response.data?.message :"Email Id is Invalid");
            }else{
              openNotificationWithIcon("error", "Email Id is Invalid");
            }
        });
    },
  });

  const formLoginStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };
  const buttonStyle = {
    marginRight: "10px",
  };

  const cancelLinkStyle = {
    marginLeft: "auto",
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Evaluator Edit Profile</h4>
            <h6>User Profile</h6>
          </div>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="card">
            <div className="card-body">
              <div className="profile-set">
                <div className="profile-head"></div>
                <div className="profile-top">
                  <div className="profile-content">
                    <div className="profile-contentimg">
                      <img src={male} alt="Female" id="blah" />
                    </div>
                    <div className="profile-contentname">
                      <h2>{mentorData?.user.full_name || mentorData?.full_name }</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="form-login col-lg-4 col-sm-12">
                  <div className="input-blocks">
                    <label className="form-label">Evaluator Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      onChange={formik.handleChange}
                     
                      onBlur={formik.handleBlur}
                      value={formik.values.name}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <small className="error-cls" style={{color:"red"}}>{formik.errors.name}</small>
                    ) : null}
                  </div>
                </div>
             

                <div className="form-login col-lg-4 col-sm-12">
                  <div className="input-blocks">
                    <label
                                               htmlFor="email"
                                               className="form-label d-flex align-items-center"
                                             >
                                               Email : &nbsp;
                                               <MaskedEmail email={mentorData?.user.username} />
                                               &nbsp;
                                             </label>
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      name="email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                    />

                    {formik.touched.email &&
                    formik.errors.email ? (
                      <small className="error-cls" style={{color:"red"}}>
                        {formik.errors.email}
                      </small>
                    ) : null}
                  </div>
                </div>
                <div className="form-login col-lg-4 col-sm-12">
                  <div className="input-blocks">
                   <label
                                               htmlFor="email"
                                               className="form-label d-flex align-items-center"
                                             >
                                               Mobile Number : &nbsp;
                                               <MaskedMobile mobile={mentorData?.mobile} />
                                               &nbsp;
                                             </label>
                    <input
                      type="text"
                      className="form-control"
                      id="mobile"
                      name="mobile"
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const numericValue = inputValue.replace(
                          /\D/g,
                          ""
                        );
                        formik.setFieldValue("mobile", numericValue);
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.mobile}
                      maxLength={10}
                      minLength={10}
                    />

                    {formik.touched.mobile && formik.errors.mobile ? (
                      <small className="error-cls" style={{color:"red"}}>
                        {formik.errors.mobile}
                      </small>
                    ) : null}
                  </div>
                </div>
               

                <div className="form-login" style={formLoginStyle}>
                  <button
                    style={buttonStyle}
                    type="submit"
                    className={`btn btn-warning  ${
                      !formik.dirty || !formik.isValid ? "default" : "primary"
                    }`}
                    disabled={!formik.dirty || !formik.isValid}
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => navigate("/eadmin/evaluator")}
                    type="button"
                    className="btn btn-secondary"
                    style={{ marginLeft: "auto" }}
                   
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
