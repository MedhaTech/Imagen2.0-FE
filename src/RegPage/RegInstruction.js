/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React from 'react';
import './Styles.css';
import logo from "../assets/img/newts.png";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

const RegInstruction = () => {
  const navigate = useNavigate();
  return (
    <div className='d-flex justify-content-center align-items-center'>
      <div className="card container m-4">
        <div className="row">
          <div className="col-md-4">
            <div className="text-center mt-5" >
              <img src={logo} alt="Logo" style={{ width: '9rem' }} />
            </div>
            <div className="row m-2 mb-3">
              <div className="col-md-2">
                <span className="circle_base current">
                  <i className="fa fa-info"></i>
                </span>
              </div>
              <div className="col-md-10">
                <span className='d-block current_color'>Instructions</span>
                <span className='second_text'>Registration and program guidelines.</span>
              </div>
            </div>
            <div className="row m-2 mb-3">
              <div className="col-md-2">
                <span className="circle_base ">
                  <i className="fa fa-user"></i>
                </span>
              </div>
              <div className="col-md-10">
                <span className='d-block'>Pilot Information</span>
                <span className='second_text'>Enter your personal details.</span>
              </div>
            </div>
            <div className="row m-2 mb-3">
              <div className="col-md-2">
                <span className="circle_base ">
                  <i className="fa fa-users"></i>
                </span>
              </div>
              <div className="col-md-10">
                <span className='d-block'>Crew-1 Information</span>
                <span className='second_text'>Enter your team member-1 details.</span>
              </div>
            </div>
            <div className="row m-2 mb-3">
              <div className="col-md-2">
                <span className="circle_base">
                  <i className="fa fa-users"></i>
                </span>
              </div>
              <div className="col-md-10">
                <span className='d-block'>Crew-2 Information</span>
                <span className='second_text'>Enter your team member-2 details.</span>
              </div>
            </div>
            <div className="row m-2 mb-3">
              <div className="col-md-2">
                <span className="circle_base">
                  <i className="fa fa-users"></i>
                </span>
              </div>
              <div className="col-md-10">
                <span className='d-block'>Crew-3 Information</span>
                <span className='second_text'>Enter your team member-3 details.</span>
              </div>
            </div>
            <div className="row m-2 mb-3 mt-3">
  <div className="col-md-10 ps-3">
    <span className="mt-5 p">Already have an account?</span>
    <span className="second_text"> 
      <Link className="hover-a" to={"/login"} style={{color:"blue"}}>
        {" "} Click Here
      </Link>
    </span>
  </div>
</div>
<div className="row m-2 mb-3 mt-3">
  <div className="col-md-10 ps-3">
    <span className="mt-5 p">Register as an Institution</span>

    <span className="second_text"> 
      <Link className="hover-a" to={"/institution-registration"} style={{color:"blue"}}>
        {" "}Click Here 
      </Link>
    </span>
  </div>
</div>

           
          </div>
          <div className="col-md-8 p-4" style={{ backgroundColor: '#EEEEEE' }}>
            <div className="mn-ht-600">
              <h5 className='headertitle'>Who can register ?</h5>
              <ul style={{ paddingLeft: '3rem', listStyle: 'disc' }}>
                <li>Are you <b>16 years or older?</b></li>
                <li>Are you studying <b>diploma/UG/PG in a college within the state? </b></li>
                <li>Do you have a <b>passion for innovation, entrepreneurship, and making an impact?</b></li>
              </ul>
              <p className='mt-2'> If your answer to all these questions is <b>“Yes”</b>, then you’re good to go! 🚀</p>
              <h5 className="headertitle">How can you register?</h5>
              <p ><span style={{paddingLeft: '2rem',fontWeight:"bold"}}>1. Form a Team</span>
                        <ul style={{paddingLeft: '5rem',listStyleType:"disc"}}>
                            <li >
                            Teams must have <b>1 to 4 participants</b>.
                            </li>
                            <li >One member will act as the <b>“Pilot”</b> (team leader) and be the main point of contact.</li>
                            <li >
                            Other members are the <b>“Crew”</b>.
                            </li>
                        </ul>
                            </p>
                            <p ><span style={{paddingLeft: '2rem',fontWeight:"bold"}}>2. Pilot Starts Registration</span>
                        <ul style={{paddingLeft: '5rem',listStyleType:"disc"}}>
                            <li >
                            Enter the Pilot’s personal details.
                            </li>
                            <li >Choose a <b>unique team name</b> and set a <b>team password</b>.</li>
                            <li >
                            Add the details of all Crew members.
                            </li>
                        </ul>
                            </p>
                        <p ><span style={{paddingLeft: '2rem',fontWeight:"bold"}}>3. Set Up Team Logins
                        </span>
                        <ul style={{paddingLeft: '5rem',listStyleType:"disc"}}>
                            <li >
                            All team members log in using their registered email and the team password (default).
                            </li>
                            <li >Members can reset and create their own passwords anytime.</li>
                        </ul>
                            </p>
                        <p ><span style={{paddingLeft: '2rem',fontWeight:"bold"}}>4. Manage Your Team
                        </span>
                        <ul style={{paddingLeft: '5rem',listStyleType:"disc"}}>
                            <li >
                            The Pilot can edit Crew details or add members until the program begins.
                            </li>
                        </ul>
                            </p>
                            <h5 className="headertitle">Need Help?
                            </h5>
                            <ul style={{ paddingLeft: '3rem', listStyle: 'disc' }}>
                <li><b>Raise a Ticket : </b> Use the support option on the website</li>
                <li><b>FAQs :</b> Check our FAQ section for answers.
                </li>
              </ul>
              <p className='mt-2'> Join now and unlock your potential in innovation and entrepreneurship! 💡
              </p>

             
            </div>
            <button
              type="button"
              className="btn btn-warning m-2"
              onClick={() => navigate("/pilotReg")}
            >
              Proceed
              <span>
                {" "}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegInstruction;
