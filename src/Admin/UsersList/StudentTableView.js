/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { Container, Row, Card, CardBody, CardText, Col } from 'reactstrap';
import { Button } from '../../stories/Button';
import { useDispatch } from 'react-redux';

import 'react-data-table-component-extensions/dist/index.css';
import { getCurrentUser, openNotificationWithIcon } from '../../helpers/Utils';
import IdeaSubmissionCard from "../../components/IdeaSubmissionCard";

import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { encryptGlobal } from '../../constants/encryptDecrypt';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import logout from '../../assets/img/logout.png';
import { studentResetPassword } from '../../Teacher/store/teacher/actions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { Table} from "react-bootstrap";
const CommonUserProfile = (props) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [button, setButton] = useState('');
    const [data, setData] = useState('');
    const currentUser = getCurrentUser('current_user');
    const dispatch = useDispatch();
    const [badges, setBadges] = useState(0);
    const [quiz, setQuiz] = useState(0);
    const [videos, setVideos] = useState(0);
    const StudentsDaTa = JSON.parse(localStorage.getItem('studentData'));
    const [course, setCourse] = useState([]);
   
     const [ideaShow, setIdeaShow] = useState(false);
      const [noData,setNoData]=useState(false);
    const [ideaDetails,setIdeaDetails]=useState([]);
  const TeamId = StudentsDaTa?.type === 0 ? StudentsDaTa?.student_id : StudentsDaTa?.type;
    useEffect(()=>{
        stuVideosCount();
    submittedApi();

    },[]);
   
    const submittedApi = () => {
               // This function fetches Idea Submission Details from the API //

      const Param = encryptGlobal(
        JSON.stringify({
          student_id: TeamId
  
        })
      );
      var configidea = {
        method: "get",
        url:
          process.env.REACT_APP_API_BASE_URL +
          `/challenge_response/submittedDetails?Data=${Param}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${currentUser.data[0]?.token}`,
        },
      };
      axios(configidea)
        .then(function (response) {
          if (response.status === 200) {
            if (response.data.data && response.data.data.length > 0) {
              const data = response.data.data[0];
              setIdeaDetails(response.data.data[0]);
              setNoData(false);
  
  
            }
          }
        })
        .catch(function (error) {
          if (error.response.status === 404) {
            setNoData(true);
          }
  
        });
    };
  
   
      const stuVideosCount = () => {
               // This function fetches students videos count from the API //

        const videoApi = encryptGlobal(
          JSON.stringify({
            user_id: StudentsDaTa?.user_id
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
              setCourse(response.data.data[0]
              );

            }
          })
          .catch(function (error) {
            console.log(error);
          });
      };
  
  
    const handleViewBack = () => {
       
        navigate("/students");
        
    };
   
    const handleReset = () => {
        // here we can reset password as  user_id //
        // here data = student_id //
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-submit',
                cancelButton: 'btn btn-cancel'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons
            .fire({
                title: "<h4>Are you sure?</h4>",
                text: 'You are attempting to reset the password',
                imageUrl: `${logout}`,
                confirmButtonText: 'Reset Password',
                showCancelButton: true,
                cancelButtonText: "Cancel",
                reverseButtons: false
            })
            .then((result) => {
                if (result.isConfirmed) {
                    dispatch(
                        studentResetPassword({
                            student_id:StudentsDaTa.student_id,
                            email:StudentsDaTa.username_email,
                            role:"STUDENT",
                            otp:false
                        })
                    );
                }
            })
            .catch((err) => console.log(err.response));
    };
   
  
    const handleEdit = () => {
        navigate(
            "/student-edit",
            { state: { student_id: StudentsDaTa.student_id } });
    };
  
    return (
        <div className="page-wrapper">
        <div className="content">

                <Row className="d-flex align-items-center justify-content-between mb-2">
  <div className="col-auto">
    <h4 className="mt-2">
      Student Profile - <span style={{ color: "#17A2B8" }}>{StudentsDaTa?.full_name} </span>  <span style={{ color: "#ffa800" }}>
    {StudentsDaTa?.type === 0 ? " (Pilot Member)" : " (Crew Member)"}
  </span>
    </h4>
  </div>

  <div className="col-auto d-flex align-items-center">
  <span className="fw-bold text-info">IDEA STATUS :</span>
    <span className="ms-1">
      {noData  ? (
        <span className="text-warning m-2">NOT STARTED</span>
      ) : ideaDetails?.status === "DRAFT" ? (
        <span className="text-success m-2">DRAFT</span>
      ) : ideaDetails?.status === "SUBMITTED" ? (
        <span className="text-success m-2">SUBMITTED</span>
      ) : (
        <span className="text-danger m-2">NOT STARTED</span>
      )}
    </span>
   { !noData && (ideaDetails?.status === "SUBMITTED" && ( 
    <button className="btn me-2" style={{ backgroundColor: "#ffa800", borderColor: "#ffa800", color: "white" }}  onClick={() => setIdeaShow(true)}>
      View Idea
    </button>
))}
    <button className="btn btn-info me-2" onClick={handleEdit}>
      <i data-feather="edit" className="feather-edit me-1"></i> Edit
    </button>

    <button className="btn btn-success me-2" onClick={handleReset}>
      <FontAwesomeIcon icon={faKey} className="me-1" /> Reset
    </button>

    <button className="btn btn-secondary" onClick={handleViewBack}>
      Back
    </button>
  </div>
</Row>


<Row className="my-2">
  <Card className="py-2">
    <CardBody>
      <h4 className="mb-3">User Details</h4>

      <Table striped bordered >
        <tbody>
          <tr>
            <td className="w-50"><b>Full Name</b></td>
            <td className="w-50">{StudentsDaTa?.full_name}</td>
          </tr>
          <tr>
            <td className="w-50"><b>Gender</b></td>
            <td className="w-50">{StudentsDaTa?.gender ? StudentsDaTa?.gender :"-"}</td>
          </tr>
         
          
          <tr>
            <td><b>Email Address</b></td>
            <td>{StudentsDaTa?.username_email}</td>

          </tr>
          <tr>
            <td><b>Mobile Number</b></td>
            <td>{StudentsDaTa?.mobile}</td>
            
          </tr>
          <tr>
            <td><b>District</b></td>
            <td>{StudentsDaTa?.district}</td>
          </tr>
          <tr>
            <td className="w-50"><b>College Town</b></td>
            <td className="w-50">{StudentsDaTa?.college_town ? StudentsDaTa?.college_town :"-"}</td>
          </tr>
          <tr>
            <td><b>College Type</b></td>
            <td>{StudentsDaTa?.college_type}</td>
          </tr>

          {StudentsDaTa?.college_type !== "Other" ? (
            <tr>
              <td><b>College Name</b></td>
              <td>{StudentsDaTa?.college_name}</td>
            </tr>
          ) : (
            <>
              <tr>
                <td><b>College Name</b></td>
                <td>Other</td>
              </tr>
              <tr>
                <td><b>Other College Name</b></td>
                <td>{StudentsDaTa?.college_name}</td>
              </tr>
            </>
          )}

          <tr>
            <td><b>Roll Number Provided by the College</b></td>
            <td>{StudentsDaTa?.roll_number}</td>
          </tr>
          <tr>
            <td><b> Branch/Group/Stream</b></td>
            <td>{StudentsDaTa?.branch}</td>
          </tr>
          <tr>
            <td><b>APAAR ID</b></td>
            <td>{StudentsDaTa?.id_number ? StudentsDaTa?.id_number : "-"}</td>
          </tr>
        </tbody>
      </Table>
    </CardBody>
  </Card>
</Row>

<Row className="my-2">
  <Card className="py-2">
    <CardBody>
      <h4 className="mb-3">Course Details</h4>

      <Table striped bordered>
        <tbody>
          <tr>
            <td className="w-50"><b>Completed Videos</b></td>
            <td className="w-50">{videos}</td>
          </tr>
          <tr>
            <td><b>Course Completion</b></td>
            <td>
              {course?.videos_completed_count !== undefined
                ? `${Math.round(
                    (course?.videos_completed_count /
                      course?.all_videos_count) *
                      100
                  )}%`
                : "-"}
            </td>
          </tr>
        </tbody>
      </Table>
    </CardBody>
  </Card>
</Row>
{ideaShow && (
            <IdeaSubmissionCard
              show={ideaShow}
              handleClose={() => setIdeaShow(false)}
              response={ideaDetails}
              
            />
          )}


         
          

              
            </div>
            </div>
    );
};

export default CommonUserProfile;
