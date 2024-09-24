/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useEffect , useRef, useState } from 'react';
import CountUp from "react-countup";
import {
  RotateCcw,
} from "feather-icons-react/build/IconComponents";
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
import { CheckCircle } from "react-feather";
import { FaPlay } from 'react-icons/fa';
import LatestNews from './LatestNews';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Tooltip } from "react-bootstrap";
import { Eye } from "react-feather";
import { FaBook } from 'react-icons/fa';
import { FaLifeRing } from 'react-icons/fa';
import { FaPoll } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa';
import TeamsProgDD from './TeamsProgDD';
import { GiAchievement } from 'react-icons/gi';
import { useReactToPrint } from 'react-to-print';
import TCertificate from '../Certificate/TCertificate';
import SchoolTeamPDF from './SchoolTeamPDF';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2';
import logout from '../../assets/img/support.png';

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
          {/* <Modal.Header closeButton></Modal.Header> */}

          <Modal.Body>
              <figure>
              {props.poptype === "link" ? (
                  <div className="modal-body custom-modal-body">
                                    <div style={{ width: '100%', height: '400px' }}>
                      <iframe
                         
                          src={props.popLink}
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
                  {/* <img
                      src={props.imgUrl}
                      alt="popup image"
                      className="img-fluid"
                  /> */}
              </figure>
          </Modal.Body>
          <Modal.Footer>
            {props.state !=null &&   
            <Link
              to={props.state}
              type="button"
              className="product-img"
            >
              <button
                label={"Navigate"}
                className="btn btn-warning"
              >
                Navigate
              </button>
            </Link>}
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
  // console.log(state,"sss");

/////////////////NEW CODE//////////////////////////////////

  const renderRefreshTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Refresh
    </Tooltip>
  );
  const renderViewTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Redirect
    </Tooltip>
  );
  const handleRefresh = () => {
    window.location.reload();
  };

  const navigate = useNavigate();
  const [teamCountLoading, setTeamCountLoading] = useState(true);
  const [stuCountLoading, setStuCountLoading] = useState(true);
  const [ideaCountLoading, setIdeaCountLoading] = useState(true);
  const [teacCourseLoading, setTeacCourseLoading] = useState(true);
  const [teacPostSLoading, setTeacPostSLoading] = useState(true);
  const [whatsappLink, setWhatsappLink] = useState('');

  const [message, setMessage] = useState('');
  
  useEffect(() => {
    
    const newListParam = encryptGlobal(
      JSON.stringify({
        state:currentUser.data[0]?.state,
        role:currentUser.data[0]?.role
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
              // console.log(res,"res");
              setShowsPopup(true);
              setPopType(res?.data?.data[0]?.type);

                setPopLink(res?.data?.data[0]?.url);
              setImgUrl(res?.data?.data[0]?.url);
                setState(res?.data?.data[0]?.navigate);

              // if(res?.data?.data[0]?.type == "link"){

              // }else{
              //   setImgUrl(res?.data?.data[0]?.url);
              //   setState(res?.data?.data[0]?.navigate);
              // }
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
  const redirectToCourse = () => {
    navigate(`/mentorcourse/1`);
  };
  const redirectToPost = () => {
    navigate(`/mentorpostsurvey`);
  };
  
  const currentUser = getCurrentUser('current_user');


  useEffect(() => {
    if (currentUser?.data[0]?.user_id) {
        mentorTeamsCount();
        mentorIdeaCount();
        mentorStudentCount();
        mentorcoursepercentage();
        mentorpostsurvey();
        fetchwhatsapplink();
        scroll();
       
    }
  }, [currentUser?.data[0]?.user_id]);
 
  const [teamsCount, setTeamsCount] = useState();
  const [ideaCount, setIdeaCount] = useState();
  const [studentCount, setStudentCount] = useState();
  const [coursepercentage, setCoursepercentage] = useState();
  const [teacPostSurvey, setTeacPostSurvey] = useState();

 
  const mentorTeamsCount = () => {
    const teamApi = encryptGlobal(
        JSON.stringify({
            mentor_id: currentUser?.data[0]?.mentor_id
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
                setTeamsCount(response.data.data[0].teams_count);
                setTeamCountLoading(false);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
  };
  const mentorIdeaCount = () => {
      const ideaApi = encryptGlobal(
          JSON.stringify({
              mentor_id: currentUser?.data[0]?.mentor_id
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
                // console.log(response, 'idea count');

                  setIdeaCount(response.data.data[0].idea_count);
                  setIdeaCountLoading(false);
              }
          })
          .catch(function (error) {
              console.log(error);
          });
  };
  const mentorStudentCount = () => {
      const studentApi = encryptGlobal(
          JSON.stringify({
              mentor_id: currentUser?.data[0]?.mentor_id
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
  const mentorcoursepercentage = () => {
      const corseApi = encryptGlobal(
          JSON.stringify({
              user_id: currentUser?.data[0]?.user_id
          })
      );
      var config = {
          method: 'get',
          url:
              process.env.REACT_APP_API_BASE_URL +
              `/dashboard/mentorpercentage?Data=${corseApi}`,
          headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${currentUser.data[0]?.token}`
          }
      };
      axios(config)
          .then(function (response) {
              if (response.status === 200) {
                  const per = Math.round(
                      (response.data.data[0].currentProgress /
                          response.data.data[0].totalProgress) *
                          100
                  );
                  setCoursepercentage(per);
                  setTeacCourseLoading(false);
              }
          })
          .catch(function (error) {
              console.log(error);
          });
  };
  const mentorpostsurvey = () => {
    const postsurveyApi = encryptGlobal(
        JSON.stringify({
            user_id: currentUser?.data[0]?.user_id
        })
    );
    var config = {
        method: 'get',
        url:
            process.env.REACT_APP_API_BASE_URL +
            `/dashboard/mentorSurveyStatus?Data=${postsurveyApi}`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${currentUser.data[0]?.token}`
        }
    };
    axios(config)
        .then(function (response) {
            if (response.status === 200) {
                // console.log(response);
                const po = (response.data.data[0].postSurvey);
                setTeacPostSurvey(po);
                setTeacPostSLoading(false);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    };
    //////whatsapp///// 
    const fetchwhatsapplink = () => {
      // Function to fetch the WhatsApp link from the API
      const statenameApi = encryptGlobal(
        JSON.stringify({
          state_name : currentUser?.data[0]?.state 
        })
      );
      var config = {
        method: 'get',
        url:
            process.env.REACT_APP_API_BASE_URL +
            `/dashboard/whatappLink?Data=${statenameApi}`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${currentUser.data[0]?.token}`
        }
        };
        axios(config)
        .then(function (response) {
            if (response.status === 200) {
                // console.log(response);
                setWhatsappLink(response.data.data[0].whatapp_link);
                setMessage(response.data.data[0].mentor_note);
                // console.log(response.data.data[0].mentor_note,"message");
            }
        })
        .catch(function (error) {
            console.log(error);
        }
      );
    };
      
    /////////videoModal////////////////////
    const [video , setVideo] = useState("");
    //const [videoName , setVideoName] = useState("");
    const [show , setShow] = useState(false);

    const renderTooltip = (props) => (
      <Tooltip id="pdf-tooltip" {...props} >
        Watch Demo
      </Tooltip>
    );
    const handleShow = (i) => {
      setVideo(vimeoId[i]);
      setShow(true);
    };
    const vimeoId = ["https://www.youtube.com/embed/sT3I44RzZAI?si=W92OEckd0iS7rHvZ",
        "https://www.youtube.com/embed/dWpG-TMyMrQ?si=J2NcbBCjxeelG2Us",
        "https://www.youtube.com/embed/siaE-HPVvk0?si=GnJZoZgwLjGMmco7",
        "https://www.youtube.com/embed/fse1a6IaeB0?si=DHOB_c2ngQV3C6SX",
        "https://www.youtube.com/embed/LYS2A3ozZRU?si=Ds2b_17nrPiYH1aF",
        "https://www.youtube.com/embed/OIsCwczsT0o?si=I6tpZPCZAMqvwIK-",
        ];



  const handleCertificateDownload = () =>{
    handlePrintCertificate();
  };

  const handleNavigation = () => {
    navigate("/instructions", { state: { instruction: message } });
  };

  const scroll = () => {
        const section = document.querySelector('#start');
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
// console.log(message,"m");
    
  const componentRef = useRef();
  const handlePrintCertificate = useReactToPrint({
      content: () => componentRef.current
  });
  const handleClose = () => {
    setShowsPopup(false);
};

const handleWhatsapp = () => {
  const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
          confirmButton: 'btn btn-submit',
      },
      buttonsStyling: false
  });

  swalWithBootstrapButtons
      .fire({
          title: "<h4>Looking for Support?</h4>",
          text: "Pls contact your State Program Officer.",
          imageUrl: `${logout}`,
          confirmButtonText: 'Ok',
      });
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
              <h6>here&apos;s what&apos;s happening with your School Innovation Marathon 2024 journey.</h6>
            </div>
            <div className="d-flex align-items-center">
              <div className="action-table-data">
                <div className="edit-delete-action">
                  <OverlayTrigger placement="top" overlay={renderTooltip}>
                    <Link
                        to="#"
                        className="me-2 p-2"
                        onClick={() => handleShow(5)}
                        {...(show ? { 'data-bs-toggle': 'modal', 'data-bs-target': '#add-units' } : {})}
                        
                    >
                      <FaPlay  style={{color:"red"}} />
                    </Link>
                  </OverlayTrigger>
                </div>
              </div>
              {/* <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                <Link data-bs-toggle="tooltip" data-bs-placement="top" onClick={handleRefresh} >
                  <RotateCcw className="feather feather-rotate-ccw feather-16" />
                </Link>
              </OverlayTrigger> */}
            </div>
          </div>
          {/* Teacher dashboard stats */}
          <div className="row">
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash2 w-100">
                <div className="dash-widgetimg">
                  <span>
                    <FaChalkboardTeacher size={30} style={{color:"royalblue"}}/>
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  {teacCourseLoading ? ( 
                            <Loader />
                        ) : coursepercentage === 0 ? (
                      <>
                        <h5>To know about SIM</h5>
                        <a onClick={redirectToCourse} href='#' >
                          Click here & Start Course
                        </a>
                      </>
                    ) : (
                      <>
                        <h5>
                          <CountUp start={0} end={coursepercentage} duration={2} /> %
                        </h5> 
                        <h6>Teacher Course</h6>
                      </>
                  )}
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
            {/* Row two other features */}
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-count" onClick={redirectToPost} >
                  <div className="dash-widgetcontent">
                    {teacPostSLoading ? ( 
                        <Loader />
                      ) : ideaCount != teamsCount ? (
                        <>
                          <h5>All teams yet to submit ideas for Post-Survey to enable</h5>
                        </>
                      ) : (teacPostSurvey === "COMPLETED"? (
                        <>
                          
                          <h4>Post Survey</h4>
                          <h5>Submitted <CheckCircle size={15} color="white" /></h5>
                        </>
                      ):(
                        <>
                          <h4>Post Survey</h4>
                          <h5>Click here to complete</h5>
                        </>
                      ))}
                  </div>
                <div className="dash-imgs" >
                  <FaPoll />
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das1">
                      {teacPostSurvey != "COMPLETED" ? (
                          <>
                          <div className="dash-counts">
                            <h4>Get Certificate</h4>
                            <h5>After taking Post survey</h5>
                          </div>
                          <div className="dash-imgs" >
                              <GiAchievement size={30} />
                          </div>
                          </>
                        ):(
                          <>
                            <div className="dash-counts">
                              <h4>Congrats</h4>
                              {/* <h5>Download Certificate</h5> */}
                              <h5>Certificate enables soon</h5>
                            </div>
                            <div className="dash-imgs" 
                            // onClick={handleCertificateDownload}
                            >
                                <GiAchievement size={30} />
                            </div>
                          </>
                        )}
                  {/* </div>
                  <div className="dash-imgs" onClick={handleCertificateDownload}>
                      <GiAchievement size={30} />
                  </div> */}
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das2">
                <div className="dash-counts">
                  <h4>Teams Progress</h4>
                  <h5>& login&apos;s - check here</h5>
                </div>
                <SchoolTeamPDF />
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das3">
                <div className="dash-counts">
                  <h4>Join Whatsapp</h4>
                  <h5>Support here</h5>
                </div>
                <div className="dash-imgs" >
                {whatsappLink === null ? (
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" >
                    <FaWhatsapp onClick={handleWhatsapp} style={{color:"white"}}/>
                  </a>
                ):
                (
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" >
                      <FaWhatsapp style={{color:"white"}}/>
                    </a>
                )}
                </div>
              </div>
            </div>
          </div>
          {/* Quicklinks , Latest News */}
          <div className="row">
            {/* Quick links */}
            <div className="col-xl-6 col-sm-12 col-12 d-flex">
              <div className="card flex-fill default-cover w-100 mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0">SIM Road Map </h4>
                  <div className="dropdown" onClick={handleNavigation} >
                    <Link to="/instructions"  className="view-all d-flex align-items-center">
                      <span className="ps-2 d-flex align-items-center">
                        <FaRoute size={30} />
                      </span>
                    </Link>
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
                                <FaUsers size={30} style={{marginRight : "10px", color:"orange"}}/>
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
                            <div className="action-table-data">
                              <div className="edit-delete-action">
                                <OverlayTrigger placement="top" overlay={renderTooltip}>
                                  <Link
                                      to="#"
                                      className="me-2 p-2"
                                      onClick={() => handleShow(0)}
                                      {...(show ? { 'data-bs-toggle': 'modal', 'data-bs-target': '#add-units' } : {})}
                                      
                                  >
                                    <FaPlay  style={{color:"red"}} />
                                  </Link>
                                </OverlayTrigger>
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
                                to={"/mentorcourse/1"}
                                className="product-img"
                              >
                                <FaChalkboardTeacher size={30} style={{marginRight : "10px", color:"orange"}} />
                              </Link>
                              <div className="info">
                                <Link to={"/mentorcourse/1"}>
                                  <h4>Teacher Course</h4>
                                </Link>
                                <p className="dull-text">Know more about your role</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="action-table-data">
                              <div className="edit-delete-action">
                                <OverlayTrigger placement="top" overlay={renderTooltip}>
                                  <Link
                                      to="#"
                                      className="me-2 p-2"
                                      onClick={() => handleShow(1)}
                                      {...(show ? { 'data-bs-toggle': 'modal', 'data-bs-target': '#add-units' } : {})}
                                      
                                  >
                                    <FaPlay  style={{color:"red"}} />
                                  </Link>
                                </OverlayTrigger>
                              </div>
                            </div>
                          </td>
                          <td>
                            {teacCourseLoading ? ( 
                                <Loader />
                              ) : ((coursepercentage === 0) ?  (
                              <>
                                <span
                                  className={"badge badge-linedangered"}
                                  onClick={redirectToCourse}
                                >
                                  Not Started
                                </span>
                              </>
                            ) : ((coursepercentage != 100) ? (
                              <>
                                <span
                                  className={"badge badge-bgdanger"}
                                  onClick={redirectToCourse}
                                >
                                  InProgress
                                </span>
                              </>
                            ):(
                              <>
                                <span
                                  className={"badge badge-linesuccess"}
                                >
                                  Completed
                                </span>
                              </>
                            )))}
                          </td>
                          <td>
                            <div className="action-table-data">
                              <div className="edit-delete-action">
                                <OverlayTrigger placement="top" overlay={renderViewTooltip}>
                                  <Link data-bs-toggle="tooltip" data-bs-placement="top" className="me-2 p-2" to={"/mentorcourse/1"} >
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
                                to={"/mentorpostsurvey"}
                                className="product-img"
                              >
                                <FaPoll size={30} style={{marginRight : "10px", color:"orange"}} />
                              </Link>
                              <div className="info">
                                <Link to={"/mentorpostsurvey"}>
                                  <h4>Post Survey</h4>
                                </Link>
                                <p className="dull-text">Complete survey & Get Certificate</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="action-table-data">
                              <div className="edit-delete-action">
                                <OverlayTrigger placement="top" overlay={renderTooltip}>
                                  <Link
                                      to="#"
                                      className="me-2 p-2"
                                      onClick={() => handleShow(2)}
                                      {...(show ? { 'data-bs-toggle': 'modal', 'data-bs-target': '#add-units' } : {})}
                                      
                                  >
                                    <FaPlay  style={{color:"red"}} />
                                  </Link>
                                </OverlayTrigger>
                              </div>
                            </div>
                          </td>
                          <td>
                            {teacPostSLoading ? ( 
                                <Loader />
                              ) : teacPostSurvey != "COMPLETED" ?  (
                              <>
                                <span
                                  className={"badge badge-linedangered"}
                                  onClick={redirectToPost}
                                >
                                  Pending
                                </span>
                              </>
                            ) : (
                              <>
                                <span
                                  className={"badge badge-linesuccess"}
                                >
                                  Completed
                                </span>
                              </>
                            )}
                          </td>
                          <td>
                            <div className="action-table-data">
                              <div className="edit-delete-action">
                                <OverlayTrigger placement="top" overlay={renderViewTooltip}>
                                  <Link data-bs-toggle="tooltip" data-bs-placement="top" className="me-2 p-2" to={"/mentorpostsurvey"} >
                                    <Eye className="feather-view" />
                                  </Link>
                                </OverlayTrigger>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <hr/>
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
                            <div className="action-table-data">
                              <div className="edit-delete-action">
                                <OverlayTrigger placement="top" overlay={renderTooltip}>
                                  <Link
                                      to="#"
                                      className="me-2 p-2"
                                      onClick={() => handleShow(3)}
                                      {...(show ? { 'data-bs-toggle': 'modal', 'data-bs-target': '#add-units' } : {})}
                                      
                                  >
                                    <FaPlay  style={{color:"red"}} />
                                  </Link>
                                </OverlayTrigger>
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
                                <FaLifeRing size={30} style={{marginRight : "10px", color:"orange"}} />
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
                            <div className="action-table-data">
                              <div className="edit-delete-action">
                                <OverlayTrigger placement="top" overlay={renderTooltip}>
                                  <Link
                                      to="#"
                                      className="me-2 p-2"
                                      onClick={() => handleShow(4)}
                                      {...(show ? { 'data-bs-toggle': 'modal', 'data-bs-target': '#add-units' } : {})}
                                      
                                  >
                                    <FaPlay  style={{color:"red"}} />
                                  </Link>
                                </OverlayTrigger>
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
            {/* Latest News */}
            <div className="col-xl-6 col-sm-12 col-12 d-flex">
              <LatestNews />
            </div>
          </div>
          {/* Teams Progress */}
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
