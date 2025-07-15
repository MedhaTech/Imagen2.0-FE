/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ImageWithBasePath from "../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import success from "../assets/img/chek.png";
import logo from "../assets/img/newts.png";

const AtlSucess = () => {
  const navigate = useNavigate();
 
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
                <h3 style={{ color: "DarkGreen" }}> Congratulations...</h3>

                <h4 className="mb-3">
                  {" "}
                  Congratulations, Your Account has been Successfully Created.
                </h4>
              
              </div>
             
            </div>
            <div className="text-center">
              <div className="signinform">
                <h4>
                  Want to Login ?
                  <Link className="hover-a" to={"/institution"}>
                    {" "}
                    Login
                  </Link>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtlSucess;
