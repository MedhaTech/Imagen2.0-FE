
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React , { useEffect, useState }from "react";
import CountUp from "react-countup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "react-bootstrap";
import { RiTeamFill } from "react-icons/ri";
////////my code/////////////
import { getCurrentUser } from "../../helpers/Utils";
import FeatherIcon from "feather-icons-react";
import LatestNews from './LatestNews';
import { Eye } from "react-feather";
import { FaBook, FaLightbulb } from 'react-icons/fa';
import { FaPoll } from 'react-icons/fa';
import { FaRoute } from 'react-icons/fa';
import { FaChalkboardTeacher } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import VideoModal from '../../HelpVideo/VideoModal';
import { encryptGlobal } from '../../constants/encryptDecrypt';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { getTeamMemberStatus } from "../../Teacher/store/teams/actions";
import Table from "../../core/pagination/datatable";
import { CheckCircle } from "react-feather";
import { IoHelpOutline } from "react-icons/io5";

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

const DBStu = () => {
  const [showsPopup, setShowsPopup] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const[state,setState]=useState("");
  const dispatch = useDispatch();
  const { teamsMembersStatus, teamsMembersStatusErr } = useSelector(
    (state) => state.teams
  );
  /////////my code//////////////////
  const currentUser = getCurrentUser("current_user");
  const [selectedLanguage, setSelectedLanguage] = useState('Select Language');
  const navigate = useNavigate();
  const [stuPreSLoading, setStuPreSLoading] = useState(true);
  const [stuCourseLoading, setStuCourseLoading] = useState(true);
  const [stuPostSLoading, setStuPostSLoading] = useState(true);
  const [stuIdeaLoading, setStuIdeaLoading] = useState(true);
  const [stuPostSurvey, setStuPostSurvey] = useState("");
  const [stuPreSurvey, setStuPreSurvey] = useState("");
  const [stuIdeaSub, setStuIdeaSub] = useState("");
  const [coursepercentage, setCoursepercentage] = useState();
  const [video , setVideo] = useState("");
  const [show , setShow] = useState(false);
   const [popLink, setPopLink] = useState('');
    const [poptype, setPopType] = useState('');
  const language = useSelector(
    (state) => state?.studentRegistration?.studentLanguage
);
const teamId = currentUser?.data[0]?.type_id === 0 
  ? currentUser?.data[0]?.student_id 
  : currentUser?.data[0]?.type_id;
useEffect(() => {
  if (teamId) {
    dispatch(getTeamMemberStatus(teamId, setshowDefault));
  }
}, [teamId, dispatch]);
useEffect(() => {
  if(teamsMembersStatus.length != 0){
    // setStuInstructionsLoading(false);
  }
}, [teamsMembersStatus]);


useEffect(() => {
  const popParam = encryptGlobal(
    JSON.stringify({
      role:currentUser.data[0]?.role    })
);
  var config = {
      method: 'get',
      url: process.env.REACT_APP_API_BASE_URL + `/popup?Data=${popParam}`,
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
  const percentageBWNumbers = (a, b) => {
    return (((a - b) / a) * 100).toFixed(2);
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "full_name",
      width: "15rem",
    },
    {
      title: "Pre Survey",
      dataIndex: "pre_survey_status",
      align: "center",
      width: "15rem",
      render: (_, record) =>
        record.pre_survey_status ? ( 
          <CheckCircle size={20} color="#28C76F" />
        ) : (
          <IoHelpOutline size={20} color="#FF0000" />
        ),
    },
    {
      title: "Lesson Progress",
      dataIndex: "address",
      align: "center",
      width: "30rem",
      render: (_, record) => {
        let percent =
          100 -
          percentageBWNumbers(
            record.all_topics_count,
            record.topics_completed_count
          );
        return (
          <>
          <div
            className="progress progress-sm progress-custom progress-animate"
            role="progressbar"
            aria-valuenow={Math.round(percent) ? Math.round(percent) : "0"}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
           style={{ width: `${percent}%` }}
              className={
                percent
                  ? percent <= 25
                    ? "progress-bar bg-danger"
                    : percent > 25 && percent <= 50
                    ? "progress-bar bg-primary"
                    : percent > 50 && percent <= 75
                    ? "progress-bar bg-info"
                    : "progress-bar bg-success"
                  : "progress-bar bg-danger"
              }
            >
              <div
                className={
                  percent
                    ? percent <= 25
                      ? "progress-bar-value bg-danger"
                      : percent > 25 && percent <= 50
                      ? "progress-bar-value bg-primary"
                      : percent > 50 && percent <= 75
                      ? "progress-bar-value bg-info"
                      : "progress-bar-value bg-success"
                    : "progress-bar-value bg-danger"
                }
              >
                {Math.round(percent) ? Math.round(percent) : "0"}%
              </div>
            </div>
          </div>
          </>
        );
      },
    },
    {
      title: "Idea Submission",
      dataIndex: "idea_submission",
      align: "center",
      width: "20rem",
      render: (_, record) =>
        record?.idea_submission ? (
          <CheckCircle size={20} color="#28C76F" />
        ) : (
          <IoHelpOutline size={20} color="#FF0000" />
        ),
    },
    {
      title: "Post Survey",
      dataIndex: "post_survey_status",
      align: "center",
      width: "10rem",
      render: (_, record) =>
        record?.post_survey_status ? (
          <CheckCircle size={20} color="#28C76F" />
        ) : (
          <IoHelpOutline size={20} color="#FF0000" />
        ),
    },
    {
      title: "Certificate",
      dataIndex: "certificate",
      align: "center",
      width: "10rem",
      render: (_, record) =>
        record?.certificate ? (
          <CheckCircle size={20} color="#28C76F" />
        ) : (
          <IoHelpOutline size={20} color="#FF0000" />
        ),
    },
  ];
  const redirectToPreSurvey = () => {
    navigate(`/studentpresurvey`);
  };
  const redirectToCourse = () => {
    navigate(`/studentcourseMenu`);
  };
  const redirectToPost = () => {
    navigate(`/studentpostsurvey`);
  };
  const redirectToIdea = () => {
    navigate(`/idea`);
  };

  const renderTooltip = (props) => (
    <Tooltip id="pdf-tooltip" {...props} >
      Watch Demo
    </Tooltip>
  );
  const renderViewTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Redirect
    </Tooltip>
  );

  const handleShow = (i) => {
    setVideo(vimeoId[i]);
    setShow(true);
  };
  const vimeoId = ["https://www.youtube.com/embed/CiYa_iLdpXo?si=8t7wj1idLOrW4se0",
      "https://www.youtube.com/embed/q40BSRm_cJM?si=ALZHPloc04lqH25O",
      "https://www.youtube.com/embed/eCYCvTu03X4?si=3zA5lyM9UOUoW5Yb",
      "https://www.youtube.com/embed/s-LUZN38Fik?si=rz10HpY0ZqDaYqD6",
      "https://www.youtube.com/embed/1WvwMypdVaY?si=8GPHpUqV7Jdewh__",
      ];

  

  const scroll = () => {
    const section = document.querySelector('#start');
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (currentUser?.data[0]?.user_id) {
        stuCoursePercent();
        stuBadgesCount();
        stuQuizCount();
        stuVideosCount();
        stuSurveyStatus();
        stuIdeaSubStatus();
        scroll();
    }
  }, [currentUser?.data[0]?.user_id]);
  const [badges,setBadges] = useState(0);
  const [quiz,setQuiz] = useState(0);
  const [videos,setVideos] = useState(0);
  const [showDefault, setshowDefault] = useState(true);

  const stuSurveyStatus = () => {
    const surveyApi = encryptGlobal(
        JSON.stringify({
            user_id: currentUser?.data[0]?.user_id
        })
    );
    var config = {
        method: 'get',
        url:
            process.env.REACT_APP_API_BASE_URL +
            `/dashboard/stuPrePostStats?Data=${surveyApi}`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${currentUser.data[0]?.token}`
        }
    };
    axios(config)
        .then(function (response) {
            if (response.status === 200) {
                const po = (response.data.data[0].post_survey_completed_date);
                const pre = (response.data.data[0].pre_survey_completed_date);
                setStuPostSurvey(po);
                setStuPreSurvey(pre);
                setStuPostSLoading(false);
                setStuPreSLoading(false);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    };
    const stuIdeaSubStatus = () => {
      const ideaSubApi = encryptGlobal(
        JSON.stringify({
          student_id: currentUser?.data[0]?.type_id === 0 ? currentUser?.data[0]?.student_id : currentUser?.data[0]?.type_id
        })
      );
      var config = {
        method: 'get',
        url:
          process.env.REACT_APP_API_BASE_URL +
          `/challenge_response/submittedDetails?Data=${ideaSubApi}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json', 
          Authorization: `Bearer ${currentUser.data[0]?.token}`
        }
      };
      axios(config)
        .then(function (response) {
          if (response.status === 200) {
            setStuIdeaSub(response.data.data[0].status);
            setStuIdeaLoading(false);
          }
        })
        .catch(function (error) {
          if (error.response.data.status === 404) {
            setStuIdeaSub("Not Started");
            setStuIdeaLoading(false);
          }
  
        });
    };
  const stuCoursePercent = () => {
    const corseApi = encryptGlobal(
        JSON.stringify({
            user_id: currentUser?.data[0]?.user_id
        })
    );
    var config = {
        method: 'get',
        url:
            process.env.REACT_APP_API_BASE_URL +
            `/dashboard/stuCourseStats?Data=${corseApi}`,
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
                    (response.data.data[0].topics_completed_count /
                        response.data.data[0].all_topics_count) *
                        100
                );
                setCoursepercentage(per);
                setStuCourseLoading(false);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
  };

  const stuBadgesCount = () => {
    const badgeApi = encryptGlobal(
        JSON.stringify({
          user_id: currentUser?.data[0]?.user_id
        })
    );
    var config = {
        method: 'get',
        url:
            process.env.REACT_APP_API_BASE_URL +
            `/dashboard/stuBadgesStats?Data=${badgeApi}`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${currentUser.data[0]?.token}`
        }
    };
    axios(config)
        .then(function (response) {
            if (response.status === 200) {
                setBadges(response.data.data[0].badges_earned_count);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
  };

  const stuQuizCount = () => {
    const quizApi = encryptGlobal(
        JSON.stringify({
          user_id: currentUser?.data[0]?.user_id
        })
    );
    var config = {
        method: 'get',
        url:
            process.env.REACT_APP_API_BASE_URL +
            `/dashboard/stuQuizStats?Data=${quizApi}`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${currentUser.data[0]?.token}`
        }
    };
    axios(config)
        .then(function (response) {
            if (response.status === 200) {
                setQuiz(response.data.data[0].quiz_completed_count);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
  };

  const stuVideosCount = () => {
    const videoApi = encryptGlobal(
        JSON.stringify({
          user_id: currentUser?.data[0]?.user_id
        })
    );
    var config = {
        method: 'get',
        url:
            process.env.REACT_APP_API_BASE_URL +
            `/dashboard/stuVideoStats?Data=${videoApi}`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${currentUser.data[0]?.token}`
        }
    };
    axios(config)
        .then(function (response) {
            if (response.status === 200) {
                setVideos(response.data.data[0].videos_completed_count);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
  };
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
            ></GreetingModal>
      <div className="page-wrapper" id="start">
        <div className="content">
          <div className="welcome d-lg-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center welcome-text">
              <h3 className="d-flex align-items-center">
                <span style={{ fontSize: '30px' }}>👋</span>
                &nbsp;Hi {currentUser?.data[0]?.full_name}&nbsp;
              </h3>
              
              <h6> here&apos;s what&apos;s happening with your Youth for Social Impact 2025 today.</h6>
            </div>
            <div className="d-flex align-items-center">
              
            </div>
          </div>
          <div className="row sales-cards">
            <div className="col-xl-6 col-sm-6 col-12">
              <div className="card color-info bg-success mb-4 ">
                <h3>
                  {" "}
                  <CountUp end={coursepercentage} duration={4}>
                    +
                  </CountUp> / 100
                </h3>
                <p>Course Completion %</p>
                <FeatherIcon icon="monitor"  style={{ pointerEvents: "none", color: "inherit", transform: "none" }}  />
              </div>
            </div>

            <div className="col-xl-6 col-sm-6 col-12">
              <div className="card color-info bg-secondary mb-4">
                <h3>
                  <CountUp end={videos} duration={4}>
                    +
                  </CountUp> / 25
                </h3>
                <p>Course Videos Watched</p>
                <FeatherIcon icon="video"  style={{ pointerEvents: "none", color: "inherit", transform: "none" }}  />
              </div>
            </div>
           
          </div>
          <div className="row">
            <div className="col-xl-6 col-sm-12 col-12 d-flex">
              <div className="card flex-fill w-100 mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0">YFSI Road Map</h4>
                  <div className="dropdown">
                    <Link to="#" className="view-all d-flex align-items-center" style={{ textDecoration: "none", background: "none", pointerEvents: "none"}}>
                      <span className="ps-2 d-flex align-items-center">
                        <FaRoute size={30}  style={{ pointerEvents: "none", color: "inherit", transform: "none" }}  /> 
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
                                to={"/studentpresurvey"}
                                className="product-img"
                              >
                                <FaPoll size={30} style={{marginRight : "10px", color:"#28c76f"}}/>
                              </Link>
                              <div className="info">
                                <Link to={"/studentpresurvey"}>
                                  <h4>Pre Survey</h4>
                                </Link>
                                <p className="dull-text">Quick Short Survey</p>
                              </div>
                            </div>
                          </td>
                         
                          <td>
                            {stuPreSLoading ? ( 
                                <Loader />
                              ) : stuPreSurvey === null ?  (
                              <>
                                <span
                                  className={"badge badge-linedangered"}
                                  onClick={redirectToPreSurvey}
                                >
                                  Yet to Take
                                </span>
                              </>
                            ) : (
                              <>
                                <span
                                  className={"badge badge-linesuccess"}
                                  onClick={redirectToPreSurvey}
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
                                  <Link data-bs-toggle="tooltip" data-bs-placement="top" className="me-2 p-2" to={"/studentpresurvey"} >
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
                                to={"/studentcourseMenu"}
                                className="product-img"
                              >
                                <FaChalkboardTeacher size={30} style={{marginRight : "10px", color:"#0e4b99"}} />
                              </Link>
                              <div className="info">
                                <Link to={"/studentcourseMenu"}>
                                  <h4>Student Course</h4>
                                </Link>
                                <p className="dull-text">On Problem Solving Journey</p>
                              </div>
                            </div>
                          </td>
                         
                          <td>
                            {stuCourseLoading ? ( 
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
                                  <Link data-bs-toggle="tooltip" data-bs-placement="top" className="me-2 p-2" to={"/studentcourseMenu"} >
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
                                // to="/instruction"
                                to="#"
                                className="product-img"
                              >
                                <FaLightbulb size={30} style={{ marginRight: "10px", color: "orange" }} />
                              </Link>
                              <div className="info">
                                <Link 
                                  to="#"
                                >
                                  <h4>Idea Submission</h4>
                                </Link>
                                <p className="dull-text">Select a theme & submit idea</p>
                              </div>
                            </div>
                          </td>
                         
                          <td>
                            {stuIdeaLoading ? (
                              <Loader />
                            ) : stuIdeaSub == "SUBMITTED" ? (
                              <>
                                <span
                                  className={"badge badge-linesuccess"}
                                >
                                  Submitted
                                </span>
                              </>

                            ) : stuIdeaSub == "DRAFT" ? (
                              <>
                                <span
                                  className={"badge badge-bgdanger"}
                                >
                                  In Draft
                                </span>
                              </>
                            ) : (
                              <>
                                <span
                                  className={"badge badge-linedangered"}
                                >
                                  Not Initiated
                                </span>
                              </>

                            )}
                          </td>
                          <td>
                            <div className="action-table-data">
                              <div className="edit-delete-action">
                                <OverlayTrigger placement="top" overlay={renderViewTooltip}>
                                  {stuIdeaSub == "SUBMITTED" ? <Link data-bs-toggle="tooltip" data-bs-placement="top" className="me-2 p-2" to={"/idea"} >
                                    <Eye className="feather-view" />
                                  </Link> :
                                    <Link data-bs-toggle="tooltip" data-bs-placement="top" className="me-2 p-2" to={"/instruction"} >
                                      <Eye className="feather-view" />
                                    </Link>}
                                </OverlayTrigger>
                              </div>
                            </div>
                          </td>
                        </tr>
                       
                         <tr>
                          <td>
                            <div className="product-info">
                              <Link
                                to={"/studentpostsurvey"}
                                className="product-img"
                              >
                                <FaPoll size={30} style={{marginRight : "10px", color:"black"}} />
                              </Link>
                              <div className="info">
                                <Link to={"/studentpostsurvey"}>
                                  <h4>Post Survey</h4>
                                </Link>
                                <p className="dull-text">Take survey & Get Certificate</p>
                              </div>
                            </div>
                          </td>
                        
                          <td>
                            {stuPostSLoading ? ( 
                                <Loader />
                              ) : stuPostSurvey === null ?  (
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
                                  <Link data-bs-toggle="tooltip" data-bs-placement="top" className="me-2 p-2" to={"/studentpostsurvey"} >
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
                                to={"/studentresource"}
                                className="product-img"
                              >
                                <FaBook size={30} style={{marginRight : "10px", color:"#3cb2bf"}} />
                              </Link>
                              <div className="info">
                                <Link to={"/studentresource"}>
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
                                  <Link data-bs-toggle="tooltip" data-bs-placement="top" className="me-2 p-2"  to={"/studentresource"} >
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
             <div className="card table-list-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="card-title mb-0">
                {" "}
               
                <RiTeamFill size="25"  style={{
                    marginRight: "6px",
                    verticalAlign: "middle",
                    color:"#0e4b99"
                  }}/>
                Team Progress
              </h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                {showDefault && (
                  <div className="d-flex justify-content-center align-items-center">
                    <h4 className="text-primary">Loading</h4>
                  </div>
                )}
                {teamsMembersStatus.length > 0 && !showDefault ? (
                  <Table
                    pagination={false}
                    dataSource={teamsMembersStatus}
                    columns={columns}
                  />
                ) : teamsMembersStatusErr ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <h4 className="text-danger">
                      There are no students in your Team
                    </h4>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      {show &&  <VideoModal v={video} setShow={setShow}/>}
    </>
  );
};

export default DBStu;
