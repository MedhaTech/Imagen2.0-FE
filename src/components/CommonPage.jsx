/* eslint-disable indent */
import { Fragment } from "react";
import { Card, Container } from "reactstrap";
import Congo from "../assets/img/survey-success.jpg";
import IdeaSuccessImg from "../assets/img/idea-success.jpg";
import { Button } from "../stories/Button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CommonPage = ({
  text,
  showButton,
  showChallenges,
  ideaSubmissionComButton,
}) => {
  // here we can see showChallenges button means we can see the submitted idea //
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const history = useHistory();
  const handleClick = () => {
    // here we can go for the next course //
    navigate("/student/post-survey");
  };
  console.log("Congrats Screen");

  return (
    <Container className="presuervey mb-50 mt-5 ">
      <Fragment>
        <Card className="course-sec-basic p-5">
          <div className="text-center">
            <div>
              <img
                className={`${showButton ? "w-50" : "imgWidthSize"} img-fluid `}
                src={showButton ? IdeaSuccessImg : Congo}
              ></img>
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: text ? text : "Coming Soon...",
              }}
            ></div>
          </div>
          {showButton && (
            <div className="d-sm-flex justify-content-between mb-3 text-center">
              <Button
                type="button"
                btnClass="primary mt-4 mx-4"
                onClick={() => showChallenges()}
                size="small"
                label={t("student.view_idea")}
              />
              <Button
                label={t("student.continue")}
                btnClass="primary mt-4 mx-4"
                size="small"
                onClick={() => handleClick()}
              />
            </div>
          )}
          {ideaSubmissionComButton && (
            <div className="d-sm-flex justify-content-between mb-3 text-center">
              <Button
                type="button"
                btnClass="primary mt-4 mx-4"
                onClick={() => navigate(`/playCourse/${1}`)}
                size="small"
                label={t("student_course.go_to_course_button")}
              />
              <Button
                label={t("student_course.go_to_post_survey_button")}
                btnClass="primary mt-4 mx-4"
                size="small"
                onClick={() => handleClick()}
              />
            </div>
          )}
        </Card>
      </Fragment>
    </Container>
  );
};

export default CommonPage;
