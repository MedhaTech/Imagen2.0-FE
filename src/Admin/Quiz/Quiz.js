/* eslint-disable indent */
import { React, useEffect, useState } from "react";
import { Card, Row, Col } from "reactstrap";
import { Fragment } from "react";
import Question from "./Question";
// import { Button } from "../../stories/Button";
import "./quiz.scss";
import Confetti from "react-confetti";
import ResultStar from "../../assets/img/quiz-result-star.png";

import { connect, useSelector } from "react-redux";
import quizCheck from "../../assets/img/thumbs-up.png";
import quizClose from "../../assets/img/quiz-close.png";
import {
  getAdminRfQuizResponce,
  getAdminRefQuizQst,
} from "../../redux/actions";
import { useTranslation } from "react-i18next";
import succesImg from "../../assets/img/success1.jpeg";

const Quiz = (props) => {
  const { t } = useTranslation();
  const [selectOption, SetSelectOption] = useState("");
  const [type, SetType] = useState("");
  const [video] = useState(true);
  const language = useSelector(
    (state) => state?.studentRegistration?.studentLanguage
  );

  useEffect(() => {
    props.getAdminRefQuizQstActions(props.refQstId, language);
  }, [props.refQstId, language]);

  const handleNxtQst = () => {
    props.getAdminRefQuizQstActions(props.refQstId, language);
  };
  const handleSelect = (answer) => {
    SetSelectOption(answer);
  };
  const handleSelectType = (answer) => {
    SetType(answer);
  };
  const handleSubmit = () => {
    const quiz_id = props.refQstId;
    if (type == "DRAW") {
      const data = new FormData();
      data.append(
        "reflective_quiz_question_id",
        props.adminRefQuizQst.data[0].reflective_quiz_question_id
      );
      data.append("selected_option", "ok");
      data.append("attachment", selectOption);
      props.getAdminRfQuizResponceAction(quiz_id, data, language);
      SetSelectOption();
      SetType();
    } else {
      const data = JSON.stringify({
        reflective_quiz_question_id:
          props.adminRefQuizQst.data[0].reflective_quiz_question_id,
        selected_option: selectOption,
      });
      props.getAdminRfQuizResponceAction(quiz_id, data, language);
      SetSelectOption();
      SetType();
    }
  };

  return (
    <Fragment>
      {video == true &&
        props.adminRefQuizQst &&
        props.adminRefQuizQst.count === null && <Confetti className="w-100" />}

      <Card className="quiz p-4">
        {video == true &&
        props.adminRefQstResponce &&
        props.adminRefQstResponce.status === 200 ? (
          <Fragment>
            <div className="question-section">
              <div className="score">
                {props.adminRefQstResponce &&
                  props.adminRefQstResponce.data[0] &&
                  props.adminRefQstResponce.data[0].is_correct === true && (
                    <div className="w-100">
                      {" "}
                      <figure className="w-5 text-center">
                        <img
                          className="img-fluid mb-2"
                          src={quizCheck}
                          style={{ width: "8rem" }}
                          alt="quiz"
                        />
                      </figure>
                      <p style={{ textAlign: "center" }}>
                        {props.adminRefQstResponce &&
                          props.adminRefQstResponce.data[0] &&
                          props.adminRefQstResponce.data[0].msg}
                      </p>
                    </div>
                  )}
                {props.adminRefQstResponce &&
                  props.adminRefQstResponce.data[0] &&
                  props.adminRefQstResponce.data[0].is_correct === false && (
                    <div className="w-100">
                      {" "}
                      <figure className="w-100 text-center">
                        <img className="img-fluid" src={quizClose} alt="quiz" />
                      </figure>
                      <p style={{ textAlign: "center" }}>
                        {props.adminRefQstResponce &&
                          props.adminRefQstResponce.data[0] &&
                          props.adminRefQstResponce.data[0].msg}
                      </p>
                    </div>
                  )}
              </div>

              <Row className="justify-content-between ">
                {props.adminRefQstResponce &&
                  props.adminRefQstResponce.data[0] &&
                  props.adminRefQstResponce.data[0].is_correct === true && (
                    <Col md={12} className="text-right">
                      <button
                        // btnClass="primary px-5"
                        // size="small"
                        // label={t('student.continue')}
                        className="btn btn-warning"
                        onClick={() => handleNxtQst()}
                      >
                        {t("student.continue")}
                      </button>
                    </Col>
                  )}
                {props.adminRefQstResponce &&
                  props.adminRefQstResponce.data[0] &&
                  props.adminRefQstResponce.data[0].is_correct === false && (
                    <Col md={12} className="text-right">
                      <button
                        // btnClass="primary px-5 mx-sm-3 mx-1 mb-3"
                        // size="small"
                        // label="Refer Video"
                        className="btn btn-warning"
                        onClick={() => props.handleClose(false)}
                      >
                        Refer Video
                      </button>
                      <button
                        // btnClass="primary px-5"
                        // size="small"
                        // label={t("student.continue")}
                        onClick={() => handleNxtQst()}
                        className="btn btn-warning"
                      >
                        {t("student.continue")}
                      </button>
                    </Col>
                  )}
              </Row>
            </div>
          </Fragment>
        ) : video == true &&
          props.adminRefQuizQst &&
          props.adminRefQuizQst.count === null ? (
          <div className="container new-result">
            <div className="row justify-content-md-center ">
              <div className="col col-lg-9">
                <div className="results-heading">
                  <img src={ResultStar} alt="star" />
                </div>
                <div className="congratulations">
                  <div className="success_img text-center w-100">
                    <img src={succesImg} alt=".." />
                    <br />
                  </div>
                  {t("student_course.quiz_completed")}
                </div>

                <button
                  onClick={() => props.handleClose(false)}
                  className="btn btn-warning"
                  type="submit"
                  //   label={t("student_course.continue course")}
                  //   btnClass="primary mt-5 quiz-end"
                  //   size="small"
                >
                  {t("student_course.continue course")}
                </button>
              </div>
            </div>
          </div>
        ) : (
          video == true &&
          props.adminRefQuizQst.status === 200 && (
            <Fragment>
              <div className="question-section">
                <Question
                  qsts={props.adminRefQuizQst.data}
                  onSelectAnswer={handleSelect}
                  onSelectType={handleSelectType}
                />

                <Row className="justify-content-between mt-3">
                  <Col md={12} className="text-right">
                    <button
                      //   size="small"
                      //   label={t("teacher_teams.submit")}
                      onClick={() => (!selectOption ? null : handleSubmit())}
                      className="btn btn-warning"
                      //   btnClass={!selectOption ? "default" : "primary"}
                      disabled={!selectOption}
                    >
                      {t("teacher_teams.submit")}
                    </button>
                  </Col>
                </Row>
              </div>
            </Fragment>
          )
        )}
      </Card>
    </Fragment>
  );
};

const mapStateToProps = ({ adminCourses }) => {
  const { adminRefQstResponce, adminRefQuizQst } = adminCourses;
  return { adminRefQstResponce, adminRefQuizQst };
};

export default connect(mapStateToProps, {
  getAdminRfQuizResponceAction: getAdminRfQuizResponce,
  getAdminRefQuizQstActions: getAdminRefQuizQst,
})(Quiz);
// export default Quiz;
