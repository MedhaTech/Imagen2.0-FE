/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import Confetti from "react-confetti";
import { Button } from "../../stories/Button";
import succesImg from "../../assets/img/success1.jpeg";
import { useTranslation } from "react-i18next";
import { getStudentDashboardStatus } from "../../redux/studentRegistration/actions";
import { getCurrentUser } from "../../helpers/Utils";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CourseSuccessMessage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = getCurrentUser("current_user");
  const language = useSelector(
    (state) => state?.studentRegistration?.studentLanguage
  );

  const handleClick = (type) => {
    dispatch(
      getStudentDashboardStatus(currentUser?.data[0]?.user_id, language)
    );
    setTimeout(() => {
      type ? navigate("/instruction") : navigate("/idea");
    }, 300);
  };
  return (
    <div className="container new-result">
      <Confetti className="w-100" />
      <div className="row justify-content-md-center ">
        <div className="col col-lg-9">
         
          <div className="congratulations text-center">
            <div className="success_img text-center w-100">
            <Confetti className="w-100" />

              <img src={succesImg} alt=".." />

              <br />
            </div>
            <p style={{ fontSize: "16px" }}>
              {t("student_course.course_completed_succ")}
            </p>
            <p style={{ fontSize: "16px" }}>
              {t("student_course.continue_to_idea")}
            </p>
          </div>
          <div className="d-sm-flex justify-content-center mb-3 text-center">
            <Button
              label={t("student_course.go_idea_submission")}
              btnClass="primary mt-4 mx-4"
              className="btn btn-warning"
              size="small"
              onClick={() => handleClick(true)}
            />
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSuccessMessage;
