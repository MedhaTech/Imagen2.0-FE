/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import { Fragment, useLayoutEffect, useRef } from "react";
import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";
// import { Button } from '../../../stories/Button';
// import Layout from "../../Layout";
import jsPDF from "jspdf";
import { getCurrentUser } from "../../helpers/Utils";
import courseCompletionCertificate from "../../assets/img/Certificates/student_participation.jpg";
import ideaSubmissionCertificate from "../../assets/img/Certificates/student_idea.jpg";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  getStudentChallengeSubmittedResponse,
  getStudentDashboardStatus,
  studentPostSurveyCertificate,
  updateStudentBadges,
  updateStudentCertificate,
} from "../../redux/studentRegistration/actions";
import moment from "moment";
import Congo from "../../assets/img/survey-success.jpg";

const Certificate = ({
  type,
  currentUser,
  postSurveyStatus,
  certDate,
  language,
}) => {
  const { t } = useTranslation();
  const pdfRef = useRef(null);
  const partRef = useRef(null);
  const dispatch = useDispatch();
  const handleCertificateDownload = () => {
    // here we can download the certificates //

    const content = type ? partRef.current : pdfRef.current;
    const badge = "the_finisher";
    const size = [298, 220];
    const orientation = "l";
    const doc = new jsPDF(orientation, "px", size);
    const certName = `${currentUser?.data[0]?.full_name}_${
      type ? "idea_certificate" : "course_certificate"
    }`;
    doc.html(content, {
      callback: function (doc) {
        doc.save(certName);
      },
    });
    // if (!type)
    //   dispatch(
    //     updateStudentBadges(
    //       { badge_slugs: [badge] },
    //       currentUser?.data[0]?.user_id,
    //       language,
    //       t
    //     )
    //   );
    // if (!type)
    //   dispatch(updateStudentCertificate(currentUser?.data[0]?.student_id));
  };
  const certDateCheck = () => {
    const check =
      type !== "participate"
        ? certDate?.course_completed_date &&
          moment(certDate?.course_completed_date).format("DD-MM-YYYY")
        : "";
    return check ? " on " + check : "";
  };
  return (
    <Card
      className="course-sec-basic p-5 m-4 w-100"
      style={{
        backgroundColor: `${postSurveyStatus ? "" : "lightgrey"}`,
      }}
    >
      <CardBody>
        <CardTitle className=" text-left pt-4 pb-4" tag="h2">
          {type
            ? t("teacher_certificate.participate_certificate")
            : t("teacher_certificate.certificate")}
        </CardTitle>
        <div className="common-flex">
          <div
            ref={type ? partRef : pdfRef}
            className="position-relative"
            style={{ width: "fit-content" }}
          >
            <span
              className="text-capitalize"
              style={{
                position: "absolute",
                top: `${type ? "8.5rem" : "8.9rem"}`,
                color: `${type ? "black" : "white"}`,
                left: `${type ? "11rem" : "11.5rem"}`,
                fontSize: "0.8rem",
                fontFamily: "Times New Roman",
              }}
            >
              {currentUser?.data[0]?.full_name}
            </span>
            <span
              className="text-capitalize"
              style={{
                position: "absolute",
                color: `${type ? "black" : "white"}`,
                top: `${type ? "9.8rem" : "10rem"}`,
                left: `${type ? "5rem" : "6rem"}`,
                fontSize: "0.8rem",
                fontFamily: "Times New Roman",
              }}
            >
              {currentUser?.data[0]?.organization_name + certDateCheck()}
            </span>
            <img
              src={
                type ? ideaSubmissionCertificate : courseCompletionCertificate
              }
              alt="certificate"
              className="img-fluid mx-auto"
              style={{
                width: "297px",
                height: "210px",
                border: "1px solid #cccccc",
              }}
            />
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            disabled={!postSurveyStatus}
            // label={
            //   type
            //     ? t("teacher_certificate.download_participate")
            //     : t("teacher_certificate.download")
            // }
            // btnClass={`${postSurveyStatus ? "primary" : "default"} mt-4`}
            className="btn btn-success"
            style={{ marginRight: "2rem" }}
            onClick={handleCertificateDownload}
          >
            {type
              ? t("teacher_certificate.download_participate")
              : t("teacher_certificate.download")}
          </button>
        </div>
      </CardBody>
    </Card>
  );
};

const MyCertificate = () => {
  const showDummypage = true;
  const { t } = useTranslation();
  const language = useSelector(
    (state) => state?.studentRegistration?.studentLanguage
  );
  const postSurveyStatusGl = useSelector(
    (state) => state?.studentRegistration?.postSurveyStatusGl
  );
  const dashboardStatus = useSelector(
    (state) => state?.studentRegistration?.dashboardStatus
  );
  const ideaSubmissionStatus = useSelector(
    (state) => state?.studentRegistration.ideaSubmissionStatus
  );
  const ideaSubmissionsSubmittedAt = useSelector(
    (state) => state?.studentRegistration?.challengesSubmittedResponse[0]
  );
  let { all_topics_count, topics_completed_count } = dashboardStatus
    ? dashboardStatus
    : { all_topics_count: null, topics_completed_count: null };
  const currentUser = getCurrentUser("current_user");
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    if (!dashboardStatus)
      dispatch(
        getStudentDashboardStatus(currentUser?.data[0]?.user_id, language)
      );
    if (!ideaSubmissionStatus)
      dispatch(
        getStudentChallengeSubmittedResponse(
          currentUser?.data[0]?.team_id,
          language
        )
      );
    if (!ideaSubmissionsSubmittedAt)
      dispatch(
        getStudentChallengeSubmittedResponse(
          currentUser?.data[0]?.team_id,
          language
        )
      );
    if (!postSurveyStatusGl) dispatch(studentPostSurveyCertificate(language));
  }, [language]);
  const enablePostSurvey =
    ideaSubmissionStatus === "SUBMITTED" && postSurveyStatusGl === "COMPLETED";
  return (
    <div className="page-wrapper">
      <div className="content">
      <Container className="presuervey mb-50 mt-5 ">
        <Fragment>
          <h3 className="text-center m-5 p-5">
          Certificates Coming Soon ....
          </h3>
          {/* {showDummypage ? (
            <Row>
              <Row>
              
              </Row>
              <Col className="d-lg-flex justify-content-center">
               
                <Certificate
                  language={language}
                  currentUser={currentUser}
                  certDate={dashboardStatus}
                  postSurveyStatus={all_topics_count === topics_completed_count}
                />
              </Col>
            </Row>
          ) : (
            <Card className="course-sec-basic p-5">
              <div className="text-left">
                <div className="text-center">
                  <img className={`img-fluid imgWidthSize`} src={Congo}></img>
                </div>
                <h6
                  dangerouslySetInnerHTML={{
                    __html: t("dummytext.dear"),
                  }}
                ></h6>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("dummytext.student_my_cer"),
                  }}
                ></div>
                <h6
                  dangerouslySetInnerHTML={{
                    __html:
                      t("dummytext.name") + currentUser?.data[0].full_name,
                  }}
                ></h6>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("dummytext.certificate_msg"),
                  }}
                ></div>
              </div>
            </Card>
          )} */}
        </Fragment>
      </Container>
   </div>
   </div>
  );
};

export default MyCertificate;
