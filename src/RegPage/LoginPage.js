/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React from "react";
import ImageWithBasePath from "../core/img/imagewithbasebath";
import { Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/newtst.png";
import { Row,Col} from "reactstrap";
import { ArrowRight } from "feather-icons-react";
const LoginPage = () => {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate('/');
  };
  const currentYear = new Date().getFullYear();
  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper common-pass-wrap bg-img">
          <div className="login-content">
            <form action="index">
              <div className="login-userset">
                <div className="login-logo logo-normal" onClick={handleLogoClick}>
                  <img src={logo} alt="Logo" />
                  {/* <ImageWithBasePath src="assets/img/logo.png" alt="img" /> */}
                </div>
                {/* <Link className="login-logo logo-white">
                  <ImageWithBasePath src="assets/img/logo-white.png" alt />
                </Link> */}
                <div className="login-userheading text-center">
                  {/* <h3> Youth for Social Impact 2024</h3> */}
                  <h4>Select Your Role to Access Your Account </h4>
                </div>
                <div className="form-login mb-3">
                  <div className="form-addons text-center">
                    <Row>
                      <Row>
                        <button
                          type="button"
                          className="btn btn-warning m-2"
                          onClick={() => navigate("/student")}
                        >
                          Student Login
                          <span>
                            {" "}
                            <ArrowRight />
                          </span>
                        </button>
                      </Row>
                      <Row>
                        <button
                          type="button"
                          className="btn btn-warning m-2"
                          onClick={() => navigate("/institution")}
                        >
                          Institution Login
                          <span>
                            {" "}
                            <ArrowRight />
                          </span>
                        </button>
                      </Row>
                    </Row>
                  </div>
                </div>
                {/* <div className="signinform text-center">
                  <h4 className="mt-2 mb-3">
                    Not Yet Registered ?
                    <br/>
                    <Link className="hover-a" to={"/registration"}>
                      {" "}
                      Student Registration &nbsp;/  
                    </Link>
                    <Link className="hover-a" to={"/institution-registration"}>
                      {" "}
                      Institution Registration 
                    </Link>
                  </h4>
                </div> */}
                <div className="signinform text-center">
  <h4 className="mt-2 mb-3">Not Yet Registered?</h4>
  <Row className="d-flex justify-content-between">
  <Col xs={12} md="auto" className="mb-2 mb-md-0">
    <Link className="hover-a" to={"/registration"} style={{fontWeight:"bold",color:"blue"}}>
      Student Registration
    </Link>
  </Col>
  <Col xs={12} md="auto" className="mb-2 mb-md-0">
    or
  </Col>
  <Col xs={12} md="auto" className="mb-2 mb-md-0">
    <Link className="hover-a" to={"/institution-registration"} style={{fontWeight:"bold",color:"blue"}}>
      Institution Registration
    </Link>
  </Col>
</Row>


</div>

                <div className="my-2 d-flex justify-content-center align-items-center copyright-text">
                    <p>Copyright © {currentYear}  <b>YFSI.</b> All rights reserved</p>
                  </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
