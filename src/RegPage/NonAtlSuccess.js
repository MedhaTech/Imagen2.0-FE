/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ImageWithBasePath from "../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Bold } from "react-feather";
import success from "../assets/img/chek.png";
import logo from "../assets/img/newap.png";

const NonAtlSuccess = () => {
  const navigate = useNavigate();
  const mentorDaTa = JSON.parse(localStorage.getItem("mentorData"));
  const orgDaTa = JSON.parse(localStorage.getItem("orgData"));
  const user = mentorDaTa.username;
  const myArray = user.split("@");
  const word = myArray[0];
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

            <div className="login-userheading">
              <div className="text-center">
                <h3 style={{ color: "DarkGreen" }}> Congratulations...</h3>

                <h4 className="mb-3">
                  {" "}
                  You have successfully registered for YFSI 2024-25
                </h4>
                <h4 style={{ color: "black" }}>
                  <b>Teacher Login ID : </b>{" "}
                  <b style={{ color: "blue" }}>{mentorDaTa.username}</b>{" "}
                  <b>Password :</b> <b style={{ color: "blue" }}>{word}</b>
                </h4>
              </div>
              <Container
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "20px",
                }}
              >
                <Row className="justify-content-center">
                  <Col
                    className="hover-a  col-md-6 col-sm-12"
                    style={{
                      // width: "50%",
                      border: "1px solid #ccc",
                      padding: "20px",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                      backgroundColor: "#f9f9f9",
                      // margin: "0 10px",
                    }}
                  >
                    <h4 className="mb-3 text-center">
                      <b>School Info</b>
                    </h4>
                    <p style={{ color: "#404040" }}>
                      UDISE Code :{" "}
                      {orgDaTa.organization_code
                        ? orgDaTa.organization_code
                        : "-"}
                    </p>
                    <p style={{ color: "#404040" }}>
                      School : {orgDaTa.organization_name}
                    </p>
                    <p style={{ color: "#404040" }}>
                      District : {orgDaTa.district}
                    </p>
                    <p style={{ color: "#404040" }}>State : {orgDaTa.state}</p>
                    <p style={{ color: "#404040" }}>
                      PinCode : {orgDaTa.pin_code} {mentorDaTa.pin_code}
                    </p>
                  </Col>
                  <Col
                    className="hover-a  col-md-6 col-sm-12 "
                    style={{
                      // width: "50%",
                      border: "1px solid #ccc",
                      padding: "20px",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                      backgroundColor: "#f9f9f9",
                      // margin: "0 10px",
                    }}
                  >
                    <h4 className="mb-3 text-center ">
                      <b>Teacher Info</b>
                    </h4>
                    <p style={{ color: "#404040" }}>
                      Teacher : {mentorDaTa.title}. {mentorDaTa.full_name}
                    </p>
                    <p style={{ color: "#404040" }}>
                      Mobile No : {mentorDaTa.mobile}
                    </p>
                    <p style={{ color: "#404040" }}>
                      WhatsApp No : {mentorDaTa.whatapp_mobile}
                    </p>
                    <p style={{ color: "#404040" }}>
                      Gender : {mentorDaTa.gender}
                    </p>
                  </Col>
                </Row>
              </Container>
            </div>
            <div className="text-center">
              <h4 className="mb-3">Take a screenshot for future reference.</h4>
              <div className="signinform">
                <h4>
                  Click here to ?
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

export default NonAtlSuccess;
