/* eslint-disable react/no-unknown-property */
/* eslint-disable indent */
import { Fragment, React, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import ModuleAssesmentImg from "../../assets/img/moduleAssesmentPopup.svg";
import Quiz from "../../Admin/Quiz/Quiz";
import { useTranslation } from "react-i18next";

function TakeAssesmentPopup(props) {
  const { t } = useTranslation();
  const reflectedQst = props.refQst;
  const videoId = props.videoId;
  const [showQuiz, setHideQuiz] = useState(false);
  useEffect(() => {
    setHideQuiz(false);
  }, [props.show]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal-popup text-center quiz-modal"
      backdrop="static"
    >
      {!showQuiz ? (
        <Fragment>
          <Modal.Header closeButton>
            <Modal.Title
              id="contained-modal-title-vcenter"
              className="w-100 heading d-block mb-2"
            >
              {t("student.ref_quiz_heading")}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <figure>
              <img
                src={ModuleAssesmentImg}
                alt="test"
                className="img-fluid w-50"
              />
            </figure>
            <button
             
              className="btn btn-warning"
              onClick={() => setHideQuiz(true)}
            >
              {t("student.lets_start")}
            </button>
          </Modal.Body>
        </Fragment>
      ) : (
        ""
      )}

      {showQuiz ? (
        <Quiz
          qsts={reflectedQst}
          refQstId={videoId}
          handleClose={props.handleClose}
        />
      ) : (
        ""
      )}
    </Modal>
  );
}

export default TakeAssesmentPopup;
