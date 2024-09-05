/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React from 'react';
import './Styles.css';
import logo from "../assets/img/logo.png";
import { ArrowRight } from 'react-feather';
import { useNavigate } from 'react-router-dom';

const RegSuccess = () => {
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
                <span className="circle_base complete">
                  <i className="fa fa-info"></i>
                </span>
              </div>
              <div className="col-md-10">
                <span className='d-block complete_color'>Instructions</span>
                <span className='second_text'>Registration and program guidelines.</span>
              </div>
            </div>
            <div className="row m-2 mb-3">
              <div className="col-md-2">
                <span className="circle_base complete">
                  <i className="fa fa-user"></i>
                </span>
              </div>
              <div className="col-md-10">
                <span className='d-block complete_color'>Pilot Information</span>
                <span className='second_text'>Enter your personal details.</span>
              </div>
            </div>
            <div className="row m-2 mb-3">
              <div className="col-md-2">
                <span className="circle_base complete">
                  <i className="fa fa-users"></i>
                </span>
              </div>
              <div className="col-md-10">
                <span className='d-block complete_color'>Crew-1 Information</span>
                <span className='second_text'>Enter your team member-1 details.</span>
              </div>
            </div>
            <div className="row m-2 mb-3">
              <div className="col-md-2">
                <span className="circle_base complete">
                  <i className="fa fa-users"></i>
                </span>
              </div>
              <div className="col-md-10">
                <span className='d-block complete_color'>Crew-2 Information</span>
                <span className='second_text'>Enter your team member-2 details.</span>
              </div>
            </div>
            <div className="row m-2 mb-3">
              <div className="col-md-2">
                <span className="circle_base complete">
                  <i className="fa fa-users"></i>
                </span>
              </div>
              <div className="col-md-10">
                <span className='d-block complete_color'>Crew-3 Information</span>
                <span className='second_text'>Enter your team member-3 details.</span>
              </div>
            </div>


          </div>
          <div className="col-md-8 p-4 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: '#EEEEEE' }}>
            <i className="fa fa-check-circle fa-5x text-success mb-3"></i>
            <h4 className="text-success">REGISTRATION SUCCESS</h4>
            <h6 className="mb-2">Congratulations, Your account has been successfully created.</h6>
            <button
              className="btn btn-warning m-2"
              type="submit"
              onClick={() => navigate("/login")}
            >
              LOGIN<ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegSuccess;
