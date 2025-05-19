/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useEffect , useRef, useState } from 'react';
import CountUp from "react-countup";

import { Link } from "react-router-dom";
import VideoModal from '../../HelpVideo/VideoModal';
import { getCurrentUser } from '../../helpers/Utils';
import { encryptGlobal } from '../../constants/encryptDecrypt';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa';
import { FaUserGraduate } from 'react-icons/fa';
import { FaPaperPlane } from 'react-icons/fa';
import { FaChalkboardTeacher } from 'react-icons/fa'; 
import { FaRoute } from 'react-icons/fa';
import LatestNews from './LatestNews';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Tooltip } from "react-bootstrap";
import { Eye } from "react-feather";
import { FaBook } from 'react-icons/fa';
import { FaLifeRing } from 'react-icons/fa';
import TeamsProgDD from './TeamsProgDD';
import { useReactToPrint } from 'react-to-print';
import TCertificate from '../Certificate/TCertificate';
import { Modal } from 'react-bootstrap';

const GreetingModal = (props) => {
  
  return (
      <Modal
          show={props.show}
          size="lg"
          centered
          className="modal-popup text-center"
          onHide={props.handleClose}
          backdrop={true}
      >

          <Modal.Body>
              <figure>
              {props.poptype === "link" ? (
                  <div className="modal-body custom-modal-body">
                                    <div style={{ width: '100%', height: '400px' }}>
                      <iframe
                         
                          src={props.popLink
                            .replace("youtu.be/", "www.youtube.com/embed/")
                            .replace("watch?v=", "embed/")
                            .split("&")[0]}
                          title="Video popup"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                      ></iframe>
                      </div></div>
                  ) : (
                      <img
                          src={props.imgUrl}
                          alt="popup image"
                          className="img-fluid"
                      />
                  )}
                 
              </figure>
          </Modal.Body>
          <Modal.Footer>
          
          </Modal.Footer>
      </Modal>
  );
};

const MentorDashboard = () => {
  const [showsPopup, setShowsPopup] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [popLink, setPopLink] = useState('');
  const [poptype, setPopType] = useState('');


  const[state,setState]=useState("");

/////////////////NEW CODE//////////////////////////////////

 
  const renderViewTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Redirect
    </Tooltip>
  );
 

  const navigate = useNavigate();
  const [teamCountLoading, setTeamCountLoading] = useState(true);
  const [stuCountLoading, setStuCountLoading] = useState(true);
  const [ideaCountLoading, setIdeaCountLoading] = useState(true);
 

  
  useEffect(() => {
               // This function fetches Institutions popup from the API //
     
    const newListParam = encryptGlobal(
      JSON.stringify({
        role:"Institution"
      })
  );
    var config = {
        method: 'get',
        url: process.env.REACT_APP_API_BASE_URL + `/popup?Data=${newListParam}`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${currentUser.data[0]?.token}`
        }
    };
    axios(config)
        .then(function (res) {
            if (res.status === 200 && res.data.data[0]?.on_off === '1') {
              setShowsPopup(true);
              setPopType(res?.data?.data[0]?.type);

                setPopLink(res?.data?.data[0]?.url);
              setImgUrl(res?.data?.data[0]?.url);
             
            }
        })
        .catch(function (error) {
            setShowsPopup(false);
            console.log(error);
        });
}, []);
  const Loader = () => (
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );

  const redirectToTeams = () => {
    navigate(`/mentorteams`);
  };
 
  const currentUser = getCurrentUser('current_user');


  useEffect(() => {
    if (currentUser?.data[0]?.user_id) {
        mentorTeamsCount();
        mentorIdeaCount();
        mentorStudentCount();
       
       
    }
  }, [currentUser?.data[0]?.user_id]);
 
  const [teamsCount, setTeamsCount] = useState();
  const [ideaCount, setIdeaCount] = useState();
  const [studentCount, setStudentCount] = useState();

 
  const mentorTeamsCount = () => {
    // Function to fetch the Teams Count from the API

    const teamApi = encryptGlobal(
        JSON.stringify({
          college_name: currentUser?.data[0]?.college_name
        })
    );
    var config = {
        method: 'get',
        url:
            process.env.REACT_APP_API_BASE_URL +
            `/dashboard/teamCount?Data=${teamApi}`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${currentUser.data[0]?.token}`
        }
    };
    axios(config)
        .then(function (response) {
            if (response.status === 200) {
                setTeamsCount(response.data.data[0].teamCount);
                setTeamCountLoading(false);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
  };
  const mentorIdeaCount = () => {
    // Function to fetch the Ideas Count from the API

      const ideaApi = encryptGlobal(
          JSON.stringify({
            college_name: currentUser?.data[0]?.college_name
          })
      );
      var config = {
          method: 'get',
          url:
              process.env.REACT_APP_API_BASE_URL +
              `/dashboard/ideaCount?Data=${ideaApi}`,
          headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${currentUser.data[0]?.token}`
          }
      };
      axios(config)
          .then(function (response) {
              if (response.status === 200) {

                  setIdeaCount(response.data.data[0].idea_count);
                  setIdeaCountLoading(false);
              }
          })
          .catch(function (error) {
              console.log(error);
          });
  };
  const mentorStudentCount = () => {
    // Function to fetch the Students Count from the API

      const studentApi = encryptGlobal(
          JSON.stringify({
            college_name: currentUser?.data[0]?.college_name
          })
      );
      var config = {
          method: 'get',
          url:
              process.env.REACT_APP_API_BASE_URL +
              `/dashboard/studentCount?Data=${studentApi}`,
          headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${currentUser.data[0]?.token}`
          }
      };
      axios(config)
          .then(function (response) {
              if (response.status === 200) {
                  setStudentCount(response.data.data[0].student_count);
                  setStuCountLoading(false);
              }
          })
          .catch(function (error) {
              console.log(error);
          });
  };
 
    /////////videoModal////////////////////
    const [video , setVideo] = useState("");
    const [show , setShow] = useState(false);

  
    const vimeoId = ["https://www.youtube.com/embed/sT3I44RzZAI?si=W92OEckd0iS7rHvZ",
        "https://www.youtube.com/embed/dWpG-TMyMrQ?si=J2NcbBCjxeelG2Us",
        "https://www.youtube.com/embed/siaE-HPVvk0?si=GnJZoZgwLjGMmco7",
        "https://www.youtube.com/embed/fse1a6IaeB0?si=DHOB_c2ngQV3C6SX",
        "https://www.youtube.com/embed/LYS2A3ozZRU?si=Ds2b_17nrPiYH1aF",
        "https://www.youtube.com/embed/OIsCwczsT0o?si=I6tpZPCZAMqvwIK-",
        ];



 

 
    
  const componentRef = useRef();
  const handlePrintCertificate = useReactToPrint({
      content: () => componentRef.current
  });
  const handleClose = () => {
    setShowsPopup(false);
};





  return (
    <>
     <GreetingModal
                handleClose={handleClose}
                show={showsPopup}
                imgUrl={imgUrl}
                popLink={popLink}
poptype={poptype}
                state={state}
            ></GreetingModal>
    <div style={{ display: 'none' }}>
                <TCertificate
                    ref={componentRef}
                    title={currentUser?.data[0]?.title}
                    full_name={currentUser?.data[0]?.full_name}
                    organization_name={currentUser?.data[0]?.organization_name}
                />
    </div>
    <div>
      <div className="page-wrapper" id="start">
        <div className="content">
          {/* Welcome user */}
          <div className="welcome d-lg-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center welcome-text">
              <h3 className="d-flex align-items-center">
                <span style={{ fontSize: '30px' }}>👋</span>
                &nbsp;Hi {currentUser?.data[0]?.full_name},
              </h3>
              &nbsp;
              <h6>here&apos;s what&apos;s happening with your Youth for Social Impact 2025 journey.</h6>
            </div>
            <div className="d-flex align-items-center">
             
            </div>
          </div>
          <div className="row">
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash2 w-100">
                <div className="dash-widgetimg">
                  <span>
                    <FaChalkboardTeacher size={30} style={{color:"royalblue"}}/>
                  </span>
                </div>
                <div className="dash-widgetcontent">
                 
                        <h5>To know about YFSI</h5>
                        
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget w-100">
                <div className="dash-widgetimg">
                  <span>
                    <FaUsers size={30} style={{ color: 'crimson' }} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                    {teamCountLoading ? ( 
                      <Loader />
                    ) : teamsCount === 0 ?  (
                    <>
                      <h5>Yet to Create Teams?</h5>
                      <a onClick={redirectToTeams} href='#'>
                        Click here to Create Teams
                      </a>
                    </>
                  ) : (
                    <>
                      <h5>
                        <CountUp start={0} end={teamsCount} duration={2} />
                      </h5>
                      <h6>Teams Created</h6>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash1 w-100">
                <div className="dash-widgetimg">
                  <span>
                    <FaUserGraduate size={30} style={{color:"mediumseagreen"}} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                    {stuCountLoading ? ( 
                        <Loader />
                      ) : studentCount === 0 ? (
                        <>
                          <h5>Students not added?</h5>
                          <a onClick={redirectToTeams} href='#'>
                            Click here & Add students
                          </a>
                        </>
                      ) : (
                        <>
                          <h5>
                            <CountUp start={0} end={studentCount} duration={2} />
                          </h5>
                          <h6>Students Enrolled</h6>
                        </>
                      )}
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash3 w-100">
                <div className="dash-widgetimg">
                  <span>
                    <FaPaperPlane size={30} style={{ color: 'purple' }}/>
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  {ideaCountLoading ? ( 
                          <Loader />
                      ) : ideaCount === 0 ? (
                      <>
                        <h5>No Idea Submissions!</h5>
                        <h6>Kindly check teams progress</h6>
                      </>
                    ) : (
                      <>
                        <h5>
                          <CountUp start={0} end={ideaCount} duration={2} />
                        </h5>
                        <h6>Idea Submissions</h6>
                      </>
                    )}
                </div>
              </div>
            </div>
           
          
           
          </div>
          <div className="row">
            <div className="col-xl-6 col-sm-12 col-12 d-flex">
              <div className="card flex-fill default-cover w-100 mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0">YFSI Road Map </h4>
                  <div className="dropdown" 
                   >
                      <span className="ps-2 d-flex align-items-center">
                        <FaRoute size={30} />
                      </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-borderless best-seller">
                      <tbody>
                        <tr>
                          <td>
                            <div className="product-info">
                              <Link
                                to={"/mentorteams"}
                                className="product-img"
                              >
                                <FaUsers size={30} style={{marginRight : "10px", color:"#28c76f"}}/>
                              </Link>
                              <div className="info">
                                <Link to={"/mentorteams"}>
                                  <h4>Teams</h4>
                                </Link>
                                <p className="dull-text">Create , View , Edit , Delete</p>
                              </div>
                            </div>
                          </td>
                        
                          <td>
                            {teamCountLoading ? ( 
                                <Loader />
                              ) : teamsCount === 0 ?  (
                              <>
                                <span
                                  className={"badge badge-linedangered"}
                                  onClick={redirectToTeams}
                                >
                                  Not Created
                                </span>
                              </>
                            ) : (
                              <>
                                <span
                                  className={"badge badge-linesuccess"}
                                  onClick={redirectToTeams}
                                >
                                  Add More
                                </span>
                              </>
                            )}
                          </td>
                          <td>
                            <div className="action-table-data">
                              <div className="edit-delete-action">
                                <OverlayTrigger placement="top" overlay={renderViewTooltip}>
                                  <Link data-bs-toggle="tooltip" data-bs-placement="top" className="me-2 p-2" to={"/mentorteams"} >
                                    <Eye className="feather-view" />
                                  </Link>
                                </OverlayTrigger>
                              </div>
                            </div>
                          </td>

                        
                        </tr>
                        <tr>
                          <td>
                            <div className="product-info">
                              <Link
                                to={"/tecresource"}
                                className="product-img"
                              >
                                <FaBook size={30} style={{marginRight : "10px", color:"orange"}} />
                              </Link>
                              <div className="info">
                                <Link to={"/tecresource"}>
                                  <h4>Resources</h4>
                                </Link>
                                <p className="dull-text">Find supportive docs here</p>
                              </div>
                            </div>
                          </td>
                         
                          <td>
                            <span
                              className={"badge badge-linesuccess"}
                            >
                              References
                            </span>
                          </td>
                          <td>
                            <div className="action-table-data">
                              <div className="edit-delete-action">
                                <OverlayTrigger placement="top" overlay={renderViewTooltip}>
                                  <Link data-bs-toggle="tooltip" data-bs-placement="top" className="me-2 p-2"  to={"/tecresource"} >
                                    <Eye className="feather-view" />
                                  </Link>
                                </OverlayTrigger>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="product-info">
                              <Link
                                to={"/mentorsupport"}
                                className="product-img"
                              >
                                <FaLifeRing size={30} style={{marginRight : "10px", color:"#00cfe8"}} />
                              </Link>
                              <div className="info">
                                <Link to={"/mentorsupport"}>
                                  <h4>Support</h4>
                                </Link>
                                <p className="dull-text">Raise your queries here</p>
                              </div>
                            </div>
                          </td>
                        
                          <td>
                            <span
                              className={"badge badge-linesuccess"}
                            >
                              HelpLine
                            </span>
                          </td>
                          <td>
                            <div className="action-table-data">
                              <div className="edit-delete-action">
                                <OverlayTrigger placement="top" overlay={renderViewTooltip}>
                                  <Link data-bs-toggle="tooltip" data-bs-placement="top" className="me-2 p-2" to={"/mentorsupport"} >
                                    <Eye className="feather-view" />
                                  </Link>
                                </OverlayTrigger>
                              </div>
                            </div>
                          </td>
                        </tr>
                        
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-sm-12 col-12 d-flex">
              <LatestNews />
            </div>
          </div>
          <div>
            <TeamsProgDD  user={currentUser?.data}  setIdeaCount={setIdeaCount}/>
          </div>
        </div>
      </div>
    </div>
    {show &&  <VideoModal v={video} setShow={setShow}/>}
    </>
  );
};

export default MentorDashboard;
