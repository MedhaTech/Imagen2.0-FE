/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
//import "./style.scss";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
// import { Button } from "../../stories/Button";
import { useFormik } from "formik";
import { URL, KEY } from "../../constants/defaultValues";
import { logout } from "../../helpers/Utils";
import logoutIcon from "../../assets/img/icons/log-out.svg";
import {
  getCurrentUser,
  getNormalHeaders,
  openNotificationWithIcon,
} from "../../helpers/Utils";
import axios from "axios";
import getStart from "../../assets/img/survey1.png";
import { useNavigate } from "react-router-dom";
import Congo from "../../assets/img/survey-success.jpg";
import { useDispatch, useSelector } from "react-redux";
import { UncontrolledAlert } from "reactstrap";
import { useTranslation } from "react-i18next";
//import PostSurveyStatic from "./PostSurveyStatic";
// import { useHistory } from "react-router-dom";
import { encryptGlobal } from "../../constants/encryptDecrypt";

const PreSurvey = () => {
  // here we can attempt all the questions then we are able to download the certificate //
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  //   const history = useHistory();

  const [preSurveyList, setPreSurveyList] = useState([]);
  const currentUser = getCurrentUser("current_user");
  const [quizSurveyId, setQuizSurveyId] = useState(0);
  const [count, setCount] = useState(0);
  const [preSurveyStatus, setPreSurveyStatus] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [answerResponses, setAnswerResponses] = useState([]);
  const userID = currentUser?.data[0]?.user_id;
  const filterAnswers = (questionId) => {
    const data =
      answerResponses &&
      answerResponses.length > 0 &&
      answerResponses.filter(
        (item) => item.quiz_survey_question_id == questionId
      );
    return data && data.length > 0 && data[0].selected_option
      ? data[0].selected_option
      : "";
  };

  const handleStart = () => {
    // here we can start the teacher journey //
    // here we can see  22 questions  we can attempt all the Questions then  your pre survey is completed //
    setShow(true);
    scroll();
  };

  const handleLogout = (e) => {
    logout(navigate, t, "MENTOR");
    e.preventDefault();
  };
  //   useEffect(() => {
  //     if (currentUser?.data[0]?.user_id) {
  //       mentorTeamsCount();
  //       mentorIdeaCount();
  //     }
  //   }, [currentUser?.data[0]?.user_id]);
  const handleOnChange = (e) => {
    let newItems = [...answerResponses];
    let obj = {
      quiz_survey_question_id: e.target.name,
      selected_option:
        e.target.type === "checkbox" ? [e.target.value] : e.target.value,
    };
    const findExistanceIndex = newItems.findIndex(
      (item) =>
        parseInt(item?.quiz_survey_question_id) === parseInt(e.target.name)
    );
    if (findExistanceIndex === -1) {
      newItems.push(obj);
    } else {
      let temp = newItems[findExistanceIndex];
      if (e.target.type === "checkbox") {
        let options = [...temp.selected_option];
        let indexOfCheckedAnswers = options.indexOf(e.target.value);
        if (e.target.checked && indexOfCheckedAnswers === -1) {
          options.push(e.target.value);
        } else {
          options.splice(indexOfCheckedAnswers, 1);
        }
        newItems[findExistanceIndex] = {
          ...temp,
          selected_option: options,
        };
      } else {
        if (e.target.value === "") {
          newItems.splice(findExistanceIndex, 1);
        } else {
          newItems[findExistanceIndex] = {
            ...temp,
            selected_option: e.target.value,
          };
        }
      }
    }
    setAnswerResponses(newItems);
  };

  const handleOnSubmit = async (e) => {
    //alert("hii");
    e.preventDefault();

    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    let enParamDatas = encryptGlobal(
      JSON.stringify({
        locale: "en",
        user_id: userID,
      })
    );
    let submitData = {
      responses: answerResponses,
    };
    const nonEmptySelectedOptions = submitData.responses.filter(
      (item) => item.selected_option.length > 0
    );
    if (preSurveyList.length != nonEmptySelectedOptions.length) {
      openNotificationWithIcon(
        "warning",
        "Please Attempt All Questions..!!",
        ""
      );
    } else {
      const quizSurveyIdParam = encryptGlobal(JSON.stringify(quizSurveyId));
      return await axios
        .post(
          `${URL.getPostSurveyList}/${quizSurveyIdParam}/responses?Data=${enParamDatas}`,
          JSON.stringify(submitData, null, 2),
          axiosConfig
        )
        .then((preSurveyRes) => {
          if (preSurveyRes?.status == 200) {
            console.log(preSurveyRes, "aa");
            openNotificationWithIcon(
              "success",
              "Pre Survey has been submitted successfully..!!",
              ""
            );

            setCount(count + 1);
            localStorage.setItem("presurveystatus", "COMPLETED");
            navigate("/institution-dashboard");
            window.location.reload();
            // formik.resetForm();
          }
        })
        .catch((err) => {
          return err.response;
        });
    }
  };
  // const formik = useFormik({
  //     initialValues: {},
  //     onSubmit: async (values) => {
  //         const axiosConfig = getNormalHeaders(KEY.User_API_Key);
  //         let responsesData = Object.keys(values).map((eachValues) => {
  //             let selected = values[eachValues].split(' -- ');
  //             return {
  //                 quiz_survey_question_id: selected[0],
  //                 selected_option: selected[1]
  //             };
  //         });

  //         let submitData = {
  //             responses: responsesData
  //         };
  //         if (postSurveyList.length != submitData.responses.length) {
  //             openNotificationWithIcon(
  //                 'warning',
  //                 'Please Attempt All Questions..!!',
  //                 ''
  //             );
  //         } else {
  //             return await axios
  //                 .post(
  //                     `${URL.getPostSurveyList}/${quizSurveyId}/responses?locale=en`,
  //                     JSON.stringify(submitData, null, 2),
  //                     axiosConfig
  //                 )
  //                 .then((preSurveyRes) => {
  //                     if (preSurveyRes?.status == 200) {
  //                         openNotificationWithIcon(
  //                             'success',
  //                             'PostSurvey is been submitted successfully..!!',
  //                             ''
  //                         );
  //                         setCount(count + 1);

  //                         formik.resetForm();
  //                     }
  //                 })
  //                 .catch((err) => {
  //                     return err.response;
  //                 });
  //         }
  //     }
  // });

  useEffect(() => {
    const handlePopState = (event) => {
      window.history.pushState(null, document.title, window.location.href);
    };

    // Add an entry to the browser history
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", handlePopState);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    let enDataone = encryptGlobal("1");
    let axiosConfig = getNormalHeaders(KEY.User_API_Key);
    const lang = "locale=en";
    const final = lang.split("=");
    let enParamData = encryptGlobal(
      JSON.stringify({
        role: "MENTOR",
        locale: final[1],
        user_id: userID,
      })
    );
    axiosConfig["params"] = {
      Data: enParamData,
    };

    axios
      .get(`${URL.getPreSurveyList}/${enDataone}`, axiosConfig)
      .then((preSurveyRes) => {
        if (preSurveyRes?.status == 200) {
          setQuizSurveyId(preSurveyRes.data.data[0].quiz_survey_id);
          setPreSurveyStatus(preSurveyRes.data.data[0].progress);
          let allQuestions = preSurveyRes.data.data[0];
          setPreSurveyList(allQuestions.quiz_survey_questions);
        }
      })
      .catch((err) => {
        return err.response;
      });
  }, [count]);

  return (
    <div>
      <div style={{ margin: "0px" }}>
        <div>
          <Container className="presuervey" id="start">
            <Col>
              <Row className=" justify-content-center">
                <div className="aside  p-4 bg-white">
                  {preSurveyStatus &&
                  preSurveyStatus !== "COMPLETED" &&
                  !show ? (
                    <CardBody>
                      <Row>
                        <Col md={4} style={{alignContent:"center"}}>
                          <figure>
                            <img
                              src={getStart}
                              className="img-fluid"
                              alt="get started"
                            />
                          </figure>
                        </Col>
                        <Col md={8}>
                          <h2 className="text-danger">
                          Welcome teachers and mentors!

                          </h2>
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                " </br><p>We are delighted that you have signed up for this program and have joined us on this journey of nurturing problem solving and innovation in youth. As you are already aware, you will be playing the role of a guide teacher to the students for the duration of the course.The portal includes various information modules and resources that will help you and your students on their learning journeys.</p><b class='text-success'>Your journey as a guide teacher will include the following key milestones We would like you all to go through the following in order.</b><ol><li>Step 1 : Register and take the pre-survey.</li><li>Step 2 : Watch the instructional videos to understand the program</li><li>Step 3 : Conduct awareness & Orientation sessions for the students.</li><li>Step 4 : Form teams and register them on the portal.</li><li>Step 5 : Mentor students throughout the program.</li><li>Step 6 : Ensure teams complete the course & submit their final ideas.</li><li>Step 7 : Complete the post survey</li><li>Step 8 : Download your teacher’s certificate </li><li>Step 9 : Guide students to download their certificates once they finish the course and submit idea. </li></ol></br>We hope you and the students will have a great time doing this program.<br>We wish you all the best!",
                            }}
                          ></div>
                          <button
                            className="btn btn-primary m-3"
                            onClick={handleStart}
                          >
                            Start Now
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={handleLogout}
                          >
                            <img src={logoutIcon} alt="LogoutIcon" /> Do Later
                          </button>
                        </Col>
                      </Row>
                    </CardBody>
                  ) : (
                    <CardBody>
                      <h4>Pre Survey</h4>

                      {preSurveyStatus != "COMPLETED" && (
                        <Form
                          className="form-row"
                          // onSubmit={formik.handleSubmit}
                          // isSubmitting
                        >
                          {preSurveyList.map((eachQuestion, i) => {
                            return (
                              <Row key={i}>
                                <Card className="card my-3 mt-2 comment-card px-0 px-5 py-1">
                                  <div className="question quiz mb-0 mt-2">
                                    <h6 style={{ marginBottom: "10px" }}>
                                      {i + 1}. {eachQuestion.question}
                                    </h6>
                                  </div>
                                  {/* <div className="answers">
                                                        <FormGroup
                                                            tag="fieldset"
                                                            className="w-100"
                                                            id="radioGroup1"
                                                            label="One of these please"
                                                            value={
                                                                formik
                                                                    .values
                                                                    .radioGroup1
                                                            }
                                                            error={
                                                                formik
                                                                    .errors
                                                                    .radioGroup1
                                                            }
                                                            touched={
                                                                formik
                                                                    .touched
                                                                    .radioGroup1
                                                            }
                                                            onChange={
                                                                formik.handleChange
                                                            }
                                                            onBlur={
                                                                formik.handleBlur
                                                            }
                                                        >
                                                            <FormGroup
                                                                check
                                                            >
                                                                <Label
                                                                    check
                                                                >
                                                                    <Input
                                                                        type="radio"
                                                                        name={`radioGroup${i}`}
                                                                        id="radioOption1"
                                                                        value={`${eachQuestion.quiz_survey_question_id} -- ${eachQuestion.option_a}`}
                                                                    />{' '}
                                                                    {
                                                                        eachQuestion.option_a
                                                                    }
                                                                </Label>
                                                            </FormGroup>
                                                            <FormGroup
                                                                check
                                                            >
                                                                <Label
                                                                    check
                                                                >
                                                                    <Input
                                                                        type="radio"
                                                                        name={`radioGroup${i}`}
                                                                        id="radioOption2"
                                                                        value={`${eachQuestion.quiz_survey_question_id} -- ${eachQuestion.option_b}`}
                                                                    />{' '}
                                                                    {
                                                                        eachQuestion.option_b
                                                                    }
                                                                </Label>
                                                            </FormGroup>
                                                            <FormGroup
                                                                check
                                                            >
                                                                <Label
                                                                    check
                                                                >
                                                                    <Input
                                                                        type="radio"
                                                                        name={`radioGroup${i}`}
                                                                        id="radioOption3"
                                                                        value={`${eachQuestion.quiz_survey_question_id} -- ${eachQuestion.option_c}`}
                                                                    />{' '}
                                                                    {
                                                                        eachQuestion.option_c
                                                                    }
                                                                </Label>
                                                            </FormGroup>

                                                            <FormGroup
                                                                check
                                                            >
                                                                <Label
                                                                    check
                                                                >
                                                                    <Input
                                                                        type="radio"
                                                                        name={`radioGroup${i}`}
                                                                        id="radioOption4"
                                                                        value={`${eachQuestion.quiz_survey_question_id} -- ${eachQuestion.option_d}`}
                                                                    />{' '}
                                                                    {
                                                                        eachQuestion.option_d
                                                                    }
                                                                </Label>
                                                            </FormGroup>
                                                        </FormGroup>
                                                    </div> */}
                                  <div className="answers">
                                    <FormGroup
                                      tag="fieldset"
                                      className="w-100 challenges-fs"
                                      id="radioGroup1"
                                      label="One of these please"
                                    >
                                      <>
                                        {eachQuestion.type === "MRQ" && (
                                          <>
                                            {eachQuestion.option_a &&
                                              eachQuestion.option_a !== "" && (
                                                <FormGroup
                                                  check
                                                  //className="mx-1"
                                                >
                                                  <Label
                                                    check
                                                    style={{
                                                      fontSize: "1rem",
                                                      display: "flex",
                                                      alignItems: "center",
                                                    }}
                                                  >
                                                    <Input
                                                      type="radio"
                                                      name={`${eachQuestion.quiz_survey_question_id}`}
                                                      id="radioOption1"
                                                      disabled={isDisabled}
                                                      checked={
                                                        filterAnswers(
                                                          eachQuestion.quiz_survey_question_id
                                                        ) &&
                                                        filterAnswers(
                                                          eachQuestion.quiz_survey_question_id
                                                        ).includes(
                                                          eachQuestion.option_a
                                                        )
                                                      }
                                                      onChange={(e) =>
                                                        handleOnChange(e)
                                                      }
                                                      value={`${eachQuestion.option_a}`}
                                                    />
                                                    {eachQuestion.option_a}
                                                  </Label>
                                                </FormGroup>
                                              )}
                                            {eachQuestion.option_b &&
                                              eachQuestion.option_b !== "" && (
                                                <FormGroup
                                                  check
                                                  //className="mx-1"
                                                >
                                                  <Label
                                                    check
                                                    style={{
                                                      fontSize: "1rem",
                                                      display: "flex",
                                                      alignItems: "center",
                                                    }}
                                                  >
                                                    <Input
                                                      type="radio"
                                                      name={`${eachQuestion.quiz_survey_question_id}`}
                                                      id="radioOption2"
                                                      disabled={isDisabled}
                                                      checked={
                                                        filterAnswers(
                                                          eachQuestion.quiz_survey_question_id
                                                        ) &&
                                                        filterAnswers(
                                                          eachQuestion.quiz_survey_question_id
                                                        ).includes(
                                                          eachQuestion.option_b
                                                        )
                                                      }
                                                      onChange={(e) =>
                                                        handleOnChange(e)
                                                      }
                                                      value={`${eachQuestion.option_b}`}
                                                    />{" "}
                                                    {eachQuestion.option_b}
                                                  </Label>
                                                </FormGroup>
                                              )}
                                            {eachQuestion.option_c &&
                                              eachQuestion.option_c !== "" && (
                                                <FormGroup
                                                  check
                                                  //className="mx-1"
                                                >
                                                  <Label
                                                    check
                                                    style={{
                                                      fontSize: "1rem",
                                                      display: "flex",
                                                      alignItems: "center",
                                                    }}
                                                  >
                                                    <Input
                                                      type="radio"
                                                      onChange={(e) =>
                                                        handleOnChange(e)
                                                      }
                                                      name={`${eachQuestion.quiz_survey_question_id}`}
                                                      id="radioOption3"
                                                      disabled={isDisabled}
                                                      value={`${eachQuestion.option_c}`}
                                                    />{" "}
                                                    {eachQuestion.option_c}
                                                  </Label>
                                                </FormGroup>
                                              )}

                                            {eachQuestion.option_d &&
                                              eachQuestion.option_d !== "" && (
                                                <FormGroup
                                                  check
                                                  //className="mx-1"
                                                >
                                                  <Label
                                                    check
                                                    style={{
                                                      fontSize: "1rem",
                                                      display: "flex",
                                                      alignItems: "center",
                                                    }}
                                                  >
                                                    <Input
                                                      type="radio"
                                                      onChange={(e) =>
                                                        handleOnChange(e)
                                                      }
                                                      name={`${eachQuestion.quiz_survey_question_id}`}
                                                      disabled={isDisabled}
                                                      id="radioOption4"
                                                      value={`${eachQuestion.option_d}`}
                                                    />{" "}
                                                    {eachQuestion.option_d}
                                                  </Label>
                                                </FormGroup>
                                              )}
                                          </>
                                        )}
                                        {eachQuestion.type === "MCQ" && (
                                          <>
                                            <FormGroup
                                              check
                                              //className="mx-1"
                                            >
                                              <Label
                                                check
                                                style={{
                                                  fontSize: "1rem",
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <Input
                                                  type="checkbox"
                                                  name={`${eachQuestion.quiz_survey_question_id}`}
                                                  disabled={isDisabled}
                                                  checked={
                                                    filterAnswers(
                                                      eachQuestion.quiz_survey_question_id
                                                    ) &&
                                                    filterAnswers(
                                                      eachQuestion.quiz_survey_question_id
                                                    ).includes(
                                                      eachQuestion.option_a
                                                    )
                                                  }
                                                  id={eachQuestion.option_a}
                                                  onChange={(e) =>
                                                    handleOnChange(e)
                                                  }
                                                  value={`${eachQuestion.option_a}`}
                                                />
                                                {eachQuestion.option_a}
                                              </Label>
                                            </FormGroup>
                                            <FormGroup
                                              check
                                              //className="mx-1"
                                            >
                                              <Label
                                                check
                                                style={{
                                                  fontSize: "1rem",
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <Input
                                                  type="checkbox"
                                                  name={`${eachQuestion.quiz_survey_question_id}`}
                                                  disabled={isDisabled}
                                                  checked={
                                                    filterAnswers(
                                                      eachQuestion.quiz_survey_question_id
                                                    ) &&
                                                    filterAnswers(
                                                      eachQuestion.quiz_survey_question_id
                                                    ).includes(
                                                      eachQuestion.option_b
                                                    )
                                                  }
                                                  id={eachQuestion.option_b}
                                                  onChange={(e) =>
                                                    handleOnChange(e)
                                                  }
                                                  value={`${eachQuestion.option_b}`}
                                                />
                                                {eachQuestion.option_b}
                                              </Label>
                                            </FormGroup>
                                            <FormGroup
                                              check
                                              //className="mx-1"
                                            >
                                              <Label
                                                check
                                                style={{
                                                  fontSize: "1rem",
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <Input
                                                  type="checkbox"
                                                  disabled={isDisabled}
                                                  name={`${eachQuestion.quiz_survey_question_id}`}
                                                  checked={
                                                    filterAnswers(
                                                      eachQuestion.quiz_survey_question_id
                                                    ) &&
                                                    filterAnswers(
                                                      eachQuestion.quiz_survey_question_id
                                                    ).includes(
                                                      eachQuestion.option_c
                                                    )
                                                  }
                                                  id={eachQuestion.option_c}
                                                  onChange={(e) =>
                                                    handleOnChange(e)
                                                  }
                                                  value={`${eachQuestion.option_c}`}
                                                />
                                                {eachQuestion.option_c}
                                              </Label>
                                            </FormGroup>

                                            {eachQuestion.option_d !== null && (
                                              <FormGroup
                                                check
                                                //className="mx-1"
                                              >
                                                <Label
                                                  check
                                                  style={{
                                                    fontSize: "1rem",
                                                    display: "flex",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  <Input
                                                    type="checkbox"
                                                    name={`${eachQuestion.quiz_survey_question_id}`}
                                                    disabled={isDisabled}
                                                    checked={
                                                      filterAnswers(
                                                        eachQuestion.quiz_survey_question_id
                                                      ) &&
                                                      filterAnswers(
                                                        eachQuestion.quiz_survey_question_id
                                                      ).includes(
                                                        eachQuestion.option_d
                                                      )
                                                    }
                                                    id={eachQuestion.option_d}
                                                    onChange={(e) =>
                                                      handleOnChange(e)
                                                    }
                                                    value={`${eachQuestion.option_d}`}
                                                  />
                                                  {eachQuestion.option_d}
                                                </Label>
                                              </FormGroup>
                                            )}
                                          </>
                                        )}
                                      </>
                                    </FormGroup>
                                  </div>
                                </Card>
                              </Row>
                            );
                          })}
                          <div>
                            <button
                              type="submit"
                              // btnClass={
                              //     !(
                              //         formik.dirty &&
                              //         formik.isValid
                              //     )
                              //         ? 'default'
                              //         : 'primary'
                              // }
                              // disabled={
                              //     !(
                              //         formik.dirty &&
                              //         formik.isValid
                              //     )
                              // }
                              //   size="small"
                              //   label="Submit"
                              className="btn btn-warning m-2"
                              onClick={(e) => handleOnSubmit(e)}
                            >
                              SUBMIT
                            </button>
                          </div>
                        </Form>
                      )}

                      {preSurveyStatus == "COMPLETED" && (
                        <div style={{ textAlign: "center" }}>
                          <figure>
                            <img
                              className="img-fluid imgWidthSize"
                              src={Congo}
                            ></img>
                          </figure>
                          <div>
                            <h4>
                              Congratulations... Pre-Survey Submitted
                              Successfully..!
                            </h4>
                          </div>
                        </div>
                      )}
                    </CardBody>
                  )}
                </div>
              </Row>
            </Col>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default PreSurvey;
