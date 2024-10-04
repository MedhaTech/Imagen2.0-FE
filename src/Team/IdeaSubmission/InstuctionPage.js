/* eslint-disable no-undef */
/* eslint-disable no-unexpected-multiline */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
// import './style.scss';
import { Button } from '../../stories/Button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2/dist/sweetalert2';
import logout from '../../assets/img/logout.png';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { useDispatch, useSelector } from "react-redux";
import { current } from '@reduxjs/toolkit';
import { getCurrentUser, setCurrentUser } from "../../helpers/Utils";
import { getTeamMemberStatus } from "../../Teacher/store/teams/actions";
import axios from "axios";
import { encryptGlobal } from "../../constants/encryptDecrypt";
// import { getLanguage } from "../../constants/languageOptions";

// import Layout from '../../Layout';

const InstructionsPage = (props) => {
    // const language = useSelector(
    //     (state) => state?.studentRegistration?.studentLanguage
    // );
    const [resList,setResList]=useState("");
    const { t } = useTranslation();
  const currentUser = getCurrentUser("current_user");
  const [showDefault, setshowDefault] = useState(true);

  const dispatch = useDispatch();

    const navigate = useNavigate();
  const [ideaEnableStatus, setIdeaEnableStatus] = useState(0);
const teamId= currentUser.data[0]?.team_id;
    const { teamsMembersStatus} = useSelector(
        (state) => state.teams
      );
    useEffect(() => {
        if (teamId) {
          dispatch(getTeamMemberStatus(teamId,setshowDefault));
        }
      }, [teamId, dispatch]);
      const percentageBWNumbers = (a, b) => {
        return (((a - b) / a) * 100).toFixed(2);
      };
      useEffect(() => {
        // handleResList();
    }, []);
    async function handleResList() {
        const fectchTecParam = encryptGlobal(
            JSON.stringify({
              state: currentUser?.data[0]?.state,
            })
          );
      
        //  handleResList Api where we can see list of all resource //
        let config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + `/state_coordinators?Data=${fectchTecParam}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };
        await axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    // console.log(response,"ress");
                    setResList(response.data.data[0].
                        ideaSubmission
                        );
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    useEffect(() => {
        // Assuming you have a variable `currentState` that holds the current state value
        const isTamilNadu = currentUser?.data[0]?.state === 'Tamil Nadu';
      
        // Adjust the length condition based on the state
        const minLength = 2; // Minimum length based on state
        const maxLength = isTamilNadu ? 5 : 3; // Maximum length based on state
      
        if (teamsMembersStatus.length >= minLength && teamsMembersStatus.length <= maxLength) {
          localStorage.setItem("ideaSubStatus", teamsMembersStatus[0].idea_submission);
      
          if (Array.isArray(teamsMembersStatus)) {
            let anyCompleted = false;
      
            teamsMembersStatus.forEach(record => {
              let percent = 100 - percentageBWNumbers(record.all_topics_count, record.topics_completed_count);
      
              if (percent === 100) {
                anyCompleted = true;
              }
            });
            
            const ideaStatus = anyCompleted ? 1 : 0;
            setIdeaEnableStatus(ideaStatus); 
          }
        }
      }, [teamsMembersStatus, currentUser?.data[0]?.state]); // Include currentState in the dependency array
      
    // useEffect(() => {
    //     if (teamsMembersStatus.length >= 2 && teamsMembersStatus.length <= 3) {
    //       localStorage.setItem("ideaSubStatus", teamsMembersStatus[0].idea_submission);
    //       if (Array.isArray(teamsMembersStatus)) {
    //         let anyCompleted = false;
            
    //         teamsMembersStatus.forEach(record => {
    //           let percent = 100 - percentageBWNumbers(record.all_topics_count, record.topics_completed_count);
              
    //           if (percent === 100) {
    //             anyCompleted = true;
    //           }
    //         });
    //         const ideaStatus = anyCompleted ? 1 : 0;
    //         setIdeaEnableStatus(ideaStatus); 
           
    //       }
    //     }
    //   }, [teamsMembersStatus]);
    
    const handleNext = () => {
        navigate('/idea');
    };
  
    const handleideaenable = () => {
        // alert("course Not completed");
        console.log("course Not completed");
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-submit',
            },
            buttonsStyling: false
        });
      
        swalWithBootstrapButtons
            .fire({
                title: t('login.popinst'),
                // text: "You can access idea submission only after all your teammates complete course.",
                text:t('login.popcheck'),

                imageUrl: `${logout}`,
                confirmButtonText: t('login.ok'),
            });
        };
        const handlePopup = () => {
        // alert("Idea is Disabled");
        console.log("Idea is Disabled");

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-submit',
                },
                buttonsStyling: false
            });
          
            swalWithBootstrapButtons
                .fire({
                    title: t('login.popdi'),
                    // text: "You can access idea submission only after all your teammates complete course.",
                    text:t('login.popcheckD'),
    
                    imageUrl: `${logout}`,
                    confirmButtonText: t('login.ok'),
                });
            };

    // const pdfFileURL =
    //     'https://s3.ap-south-1.amazonaws.com/aim1.0-bkt-cba6e2a/resources/stage/Final_Themes_AIM.pdf';
    return (
        <div className='page-wrapper'>
      <div className='content'>
            <div className="courses-page">
                <div
                    className="container-fluid"
                >
                    <Row>
                        <Col
                            xl={12}
                        >
                            <Fragment>
                                <Card className="course-sec-basic p-4">
                                    <CardTitle className="text-center">
                                        <h3
                                            style={{
                                                color: 'orange',
                                            }}
                                        >
                                            {' '}
                                            {t('idea_page.main')}{' '}
                                        </h3>
                                    </CardTitle>
                                    <CardBody>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: t(
                                                    'student_course.idea_ins_note'
                                                )
                                            }}
                                        ></div>

                                        <div className="text-right">
                                            {/* <a
                                                href={pdfFileURL}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="primary"
                                            >
                                                <Button
                                                    label={t(
                                                        'student.download_theme'
                                                    )}
                                                    btnClass="primary mt-4 mx-4 "
                                                    size="small"
                                                />
                                            </a> */}
                                              {/* {ideaEnableStatus !==1 ? 
                                           
                                                (<button onClick={handleideaenable} className='btn btn-secondary'>{t('idea_page.next')}</button>
                                            ):resList !==1 ?(
                                                <button onClick={handlePopup} className='btn btn-secondary'>{t('idea_page.next')}</button>

                                            ): <Button
                                            label={t('idea_page.next')}
                                            btnClass="primary mt-4 mx-4"
                                            size="small"
                                            onClick={handleNext}
                                        />} */}
 <Button
                                                    label={t('idea_page.next')}
                                                    btnClass="primary mt-4 mx-4"
                                                    size="small"
                                                    onClick={handleNext}
                                                />
                                            {/* {ideaEnableStatus ==1 ? 
                                            (
                                                <Button
                                                    label={t('idea_page.next')}
                                                    btnClass="primary mt-4 mx-4"
                                                    size="small"
                                                    onClick={handleNext}
                                                />
                                            ) : (
                                                <button onClick={handleButtonClick} className='btn btn-secondary'>{t('idea_page.next')}</button>
                                            )} */}
                                          
                                            
                                        </div>
                                    </CardBody>
                                </Card>
                            </Fragment>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
        </div>
    );
};

export default InstructionsPage;
