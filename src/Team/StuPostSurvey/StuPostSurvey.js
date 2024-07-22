/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./style.scss";
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
import {
  getCurrentUser,
  getNormalHeaders,
  openNotificationWithIcon,
} from "../../helpers/Utils";
import axios from "axios";
import Congo from "../../assets/img/survey-success.jpg";
import { useDispatch, useSelector } from "react-redux";
import { UncontrolledAlert } from "reactstrap";
import { useTranslation } from "react-i18next";
import StuPostSurveyStatic from "./StuPostSurveyStatic";
// import { useHistory } from "react-router-dom";
import { encryptGlobal } from "../../constants/encryptDecrypt";

const StuPostSurvey = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [postSurveyList, setPostSurveyList] = useState([]);
    const currentUser = getCurrentUser("current_user");
    const [quizSurveyId, setQuizSurveyId] = useState(0);
    const [count, setCount] = useState(0);
    const [postSurveyStatus, setPostSurveyStatus] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [answerResponses, setAnswerResponses] = useState([]);
    const userID = currentUser?.data[0]?.user_id;
    const filterAnswer = (questionId) => {
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

    const handleChange = (e) => {
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

      const handleSubmit = async (e) => {
        alert("hii");
        e.preventDefault();
    
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        let enParamDatas = encryptGlobal(
          JSON.stringify({
            locale: "en",
            user_id : userID,
          })
        );
        let submitData = {
          responses: answerResponses,
        };
        const nonEmptySelectedOptions = submitData.responses.filter(
          (item) => item.selected_option.length > 0
        );
        if (postSurveyList.length != nonEmptySelectedOptions.length) {
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
                // console.log(preSurveyRes, "aa");
                openNotificationWithIcon(
                  "success",
                  "Post Survey has been submitted successfully..!!",
                  ""
                );
    
                setCount(count + 1);
                // formik.resetForm();
              }
            })
            .catch((err) => {
              return err.response;
            });
        }
      };

      useEffect(() => {
        let enDataone = encryptGlobal("4");
        let axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const lang = "locale=en";
        const final = lang.split("=");
        let enParamData = encryptGlobal(
          JSON.stringify({
            role: "STUDENT",
            locale: final[1],
            user_id : userID,
          })
        );
        axiosConfig["params"] = {
          Data: enParamData,
        };
    
        axios
          .get(`${URL.getPostSurveyList}/${enDataone}`, axiosConfig)
          .then((postSurveyRes) => {
            if (postSurveyRes?.status == 200) {
              setQuizSurveyId(postSurveyRes.data.data[0].quiz_survey_id);
              setPostSurveyStatus(postSurveyRes.data.data[0].progress);
              let allQuestions = postSurveyRes.data.data[0];
              setPostSurveyList(allQuestions.quiz_survey_questions);
            }
          })
          .catch((err) => {
            return err.response;
          });
      }, [count]);





return (
    <div className="page-wrapper">
      <div className="content">
      <div className="page-header">
        <div className="add-item d-flex">
          <div className="page-title">
              <h4>Post Survey</h4>
              <h6>We value your response the most.</h6>
          </div>
        </div>
       </div>
        <Container className="presuervey mb-50 mt-5 ">
          <Col>
            <Row className=" justify-content-center">
              <div className="aside  p-4 bg-white">
                <CardBody>
                  {
                    // teamsCount !== 0 &&
                    postSurveyStatus != "COMPLETED" ? (
                      <>
                        <UncontrolledAlert color="danger" className="mb-2">
                          Please complete the following post survey to get your
                          certificate.
                        </UncontrolledAlert>
                        <Form
                          className="form-row"
                          // onSubmit={formik.handleSubmit}
                          // isSubmitting
                        >
                          {postSurveyList.map((eachQuestion, i) => (
                            <Row key={i}>
                              <Card className="card my-3 mt-2 comment-card px-0 px-5 py-1">
                                <div className="question quiz mb-0 mt-2">
                                  <h6 style={{ marginBottom: "10px" }}>
                                    {i + 1}. {eachQuestion.question}
                                  </h6>
                                </div>
                                {/* <div className="answers">
                                                                {/* <FormGroup
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

                                                                    {/* <hr /> */}
                                {/* </FormGroup> */} {/* */}
                                {/* </div> */}
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
                                                //   className="mx-1"
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
                                                      filterAnswer(
                                                        eachQuestion.quiz_survey_question_id
                                                      ) &&
                                                      filterAnswer(
                                                        eachQuestion.quiz_survey_question_id
                                                      ).includes(
                                                        eachQuestion.option_a
                                                      )
                                                    }
                                                    onChange={(e) =>
                                                      handleChange(e)
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
                                                //   className="mx-1"
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
                                                      filterAnswer(
                                                        eachQuestion.quiz_survey_question_id
                                                      ) &&
                                                      filterAnswer(
                                                        eachQuestion.quiz_survey_question_id
                                                      ).includes(
                                                        eachQuestion.option_b
                                                      )
                                                    }
                                                    onChange={(e) =>
                                                      handleChange(e)
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
                                                //   className="mx-1"
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
                                                      handleChange(e)
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
                                                //   className="mx-1"
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
                                                      handleChange(e)
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
                                            // className="mx-1"
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
                                                  filterAnswer(
                                                    eachQuestion.quiz_survey_question_id
                                                  ) &&
                                                  filterAnswer(
                                                    eachQuestion.quiz_survey_question_id
                                                  ).includes(
                                                    eachQuestion.option_a
                                                  )
                                                }
                                                id={eachQuestion.option_a}
                                                onChange={(e) =>
                                                  handleChange(e)
                                                }
                                                value={`${eachQuestion.option_a}`}
                                              />
                                              {eachQuestion.option_a}
                                            </Label>
                                          </FormGroup>
                                          <FormGroup
                                            check
                                            // className="mx-1"
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
                                                  filterAnswer(
                                                    eachQuestion.quiz_survey_question_id
                                                  ) &&
                                                  filterAnswer(
                                                    eachQuestion.quiz_survey_question_id
                                                  ).includes(
                                                    eachQuestion.option_b
                                                  )
                                                }
                                                id={eachQuestion.option_b}
                                                onChange={(e) =>
                                                  handleChange(e)
                                                }
                                                value={`${eachQuestion.option_b}`}
                                              />
                                              {eachQuestion.option_b}
                                            </Label>
                                          </FormGroup>
                                          <FormGroup
                                            check
                                            // className="mx-1"
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
                                                  filterAnswer(
                                                    eachQuestion.quiz_survey_question_id
                                                  ) &&
                                                  filterAnswer(
                                                    eachQuestion.quiz_survey_question_id
                                                  ).includes(
                                                    eachQuestion.option_c
                                                  )
                                                }
                                                id={eachQuestion.option_c}
                                                onChange={(e) =>
                                                  handleChange(e)
                                                }
                                                value={`${eachQuestion.option_c}`}
                                              />
                                              {eachQuestion.option_c}
                                            </Label>
                                          </FormGroup>

                                          {eachQuestion.option_d !== null && (
                                            <FormGroup
                                              check
                                              //   className="mx-1"
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
                                                    filterAnswer(
                                                      eachQuestion.quiz_survey_question_id
                                                    ) &&
                                                    filterAnswer(
                                                      eachQuestion.quiz_survey_question_id
                                                    ).includes(
                                                      eachQuestion.option_d
                                                    )
                                                  }
                                                  id={eachQuestion.option_d}
                                                  onChange={(e) =>
                                                    handleChange(e)
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
                          ))}

                          <div className="text-right">
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
                              onClick={(e) => handleSubmit(e)}
                            >
                              SUBMIT
                            </button>
                          </div>
                        </Form>
                      </>
                    ) : postSurveyStatus == "COMPLETED" ? (
                      <div style={{ textAlign: "center" }}>
                        <div>
                          <img
                            className="img-fluid imgWidthSize"
                            src={Congo}
                          ></img>
                        </div>
                        <div>
                          <h4>
                            Thank you for completing the survey. Your responses
                            are important for us.
                          </h4>
                        </div>
                      </div>
                    ) : (
                      <StuPostSurveyStatic />
                    )
                  }
                </CardBody>
              </div>
            </Row>
          </Col>
        </Container>
      </div>
    </div>
  );
};

export default StuPostSurvey;