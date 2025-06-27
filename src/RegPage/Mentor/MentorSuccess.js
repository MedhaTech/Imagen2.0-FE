/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import success from "../../assets/img/chek.png";
import { useLocation } from "react-router-dom";

const MentorSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
   const mentorData = location.state || {};
  const handleLogoClick = () => {
    navigate('/');
  };
  return (
    <div className="main-wrapper">
      <div className="login-wrapper register-wrap bg-img">
        <div className="login-content">
          <div className="login-userset">
          
            <div className="login-logo logo-normal" onClick={handleLogoClick}>
              <img src={success} alt="Success" />
            </div>

            <div className="login-userheading ">
              <div className="text-center">
                {/* <h3 style={{ color: "DarkGreen" }}> Congratulations...</h3> */}

                <h4 className="mb-3" style={{ color: "DarkGreen" }}>
                  {" "}
                  Congratulations, {mentorData.full_name}!
                </h4>
                <h4 className="mb-3 text-center" style={{ color: "#092c4c" }}>
                  {" "}
                Your YFSI Mentor Account has been Successfully Created.
                </h4>
                <h4 className="mb-3 text-center" style={{ color: "#092c4c" }}>
                  {" "}
                Access to your account will be enabled shortly after admin approval. Stay tuned!
                </h4>
                <h4 className="second_text"> 
                      <Link className="hover-a" to={"/mentorship"} style={{color:"blue"}}>
                        {" "} Click here to login
                      </Link>
                    </h4>
               {/* <h4 style={{ color: "black" }}>
                  <b>Mentor Email Id : </b>{" "}
                  <b style={{ color: "blue" }}>{mentorData.email}</b>{" "}<br/>
                  <b>Password :</b> <b style={{ color: "blue" }}>{mentorData.mobile}</b>
                </h4> */}
              </div>
             
            </div>
            {/* <div className="text-center">
              <div className="signinform">
                <h4>
                Access will be granted once approved by Admin.
                </h4>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorSuccess;
