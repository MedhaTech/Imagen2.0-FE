/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React,{useEffect} from 'react';
import './Styles.css';
import logo from "../assets/img/newap.png";
import { ArrowRight } from 'react-feather';
import { useNavigate } from 'react-router-dom';

const RegSuccess = () => {
  const navigate = useNavigate();
 

  return (
    <div className='d-flex justify-content-center align-items-center'>
      <div className="card container m-4">
        <div className="row" 
        style={{height:"600px"}}
        >
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
            <h4 className="text-success mb-2"style={{fontSize:"1.7rem"}}>REGISTRATION SUCCESS</h4>
            <h6 className="mb-2 mt-2"style={{fontSize:"1.5rem"}}>Congratulations, Your Account has been Successfully Created.</h6>
            <button
              // className="btn btn-warning m-2"
               className="btn btn-warning m-4 p-3 px-5"
              type="submit"
              onClick={() => navigate("/login")}
            >
              LOGIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegSuccess;
