/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import moment from 'moment/moment';
import React, { useEffect, useState, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from '../stories/Button';
import { useReactToPrint } from 'react-to-print';
import Ideapdf from "../Teacher/Dashboard/DetailToDownload";

const LinkComponent = ({ item }) => {
    return (
        <>
            {item &&
                item.length > 0 &&
                item.map((ans, i) => {
                    let a_link = ans.split('/');
                    let count = a_link.length - 1;
                    return (
                        <a
                            key={i}
                            className="badge mb-2 bg-info p-3 ms-3"
                            href={ans}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {a_link[count]}
                        </a>
                    );
                })}
        </>
    );
};
const IdeaSubmissionCard = ({ handleClose, show, response, props }) => {
  const teamResponse = response;
  const [images, setImages] = useState([]);
   useEffect(() => {
      if (teamResponse) {
        setImages(JSON.parse(teamResponse.prototype_image));
      }
    }, [teamResponse]);
  
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });
  
    return (
        <div>
           <div style={{ display: 'none' }}>
        <Ideapdf
          ref={componentRef}
          ideaDetails={response}
        />
      </div>
            <Modal
                show={show}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="assign-evaluator ChangePSWModal teacher-register-modal"
                backdrop="static"
            >
                <Modal.Header closeButton onHide={handleClose}>
                    <Modal.Title
                        id="contained-modal-title-vcenter"
                        className="w-100 d-block text-center"
                    >
                        {response?.theme}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                <div
                  className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  style={{ 
                    borderTop: "1px solid #ccc", 
                    borderRight: "1px solid #ccc", 
                    borderBottom: "1px solid #ccc",
                    borderLeft: "none" 
                  }}
                >
                  <div className="question quiz mb-0">
                    <b
                      style={{
                        fontSize: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      1. Which category does your idea belong to?
                    </b>
                  </div>
                  <div
                    className="bg-white p-3 mb-3"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      height: "auto",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "black",
                      }}
                    >
                      {teamResponse?.theme}
                    </p>
                  </div>
                </div>
              </div>
             {teamResponse?.theme === "Others" &&( <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                <div
                  className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  style={{ 
                    borderTop: "1px solid #ccc", 
                    borderRight: "1px solid #ccc", 
                    borderBottom: "1px solid #ccc",
                    borderLeft: "none" 
                  }}
                >
                  <div className="question quiz mb-0">
                    <b
                      style={{
                        fontSize: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {teamResponse?.theme !== "Others" ? "" :"2"}. Describe the category your idea belongs to
                    </b>
                  </div>
                  <div
                    className="bg-white p-3 mb-3"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      height: "auto",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "black",
                      }}
                    >
                      {teamResponse.others}
                    </p>
                  </div>
                </div>
              </div>)}
              <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                <div
                  // key={index}
                  className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  style={{ 
                    borderTop: "1px solid #ccc", 
                    borderRight: "1px solid #ccc", 
                    borderBottom: "1px solid #ccc",
                    borderLeft: "none" 
                  }}
                >
                  <div className="question quiz mb-0">
                    <b
                      style={{
                        fontSize: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {teamResponse?.theme !== "Others" ? "2" :"3"}. Describe your idea (in one sentence).
                    </b>
                  </div>
                  <div
                    className="bg-white p-3 mb-3"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      height: "auto",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "black",
                      }}
                    >
                      {teamResponse.idea_describe}
                    </p>
                  </div>
                </div>
              </div>{" "}
              <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                <div
                  // key={index}
                  className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  style={{ 
                    borderTop: "1px solid #ccc", 
                    borderRight: "1px solid #ccc", 
                    borderBottom: "1px solid #ccc",
                    borderLeft: "none" 
                  }}
                >
                  <div className="question quiz mb-0">
                    <b
                      style={{
                        fontSize: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {teamResponse?.theme !== "Others" ? "3" :"4"}. Give a title to your idea.
                    </b>
                  </div>
                  <div
                    className="bg-white p-3 mb-3"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      height: "auto",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "black",
                      }}
                    >
                      {teamResponse.title}
                    </p>
                  </div>
                </div>
              </div>{" "}
              <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                <div
                  // key={index}
                  className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  style={{ 
                    borderTop: "1px solid #ccc", 
                    borderRight: "1px solid #ccc", 
                    borderBottom: "1px solid #ccc",
                    borderLeft: "none" 
                  }}
                >
                  <div className="question quiz mb-0">
                    <b
                      style={{
                        fontSize: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {teamResponse?.theme !== "Others" ? "4" :"5"}. What problem does your idea solve?
                    </b>
                  </div>
                  <div
                    className="bg-white p-3 mb-3"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      height: "auto",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "black",
                      }}
                    >
                      {teamResponse.solve}
                    </p>
                  </div>
                </div>
              </div>{" "}
              <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                <div
                  // key={index}
                  className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  style={{ 
                    borderTop: "1px solid #ccc", 
                    borderRight: "1px solid #ccc", 
                    borderBottom: "1px solid #ccc",
                    borderLeft: "none" 
                  }}
                >
                  <div className="question quiz mb-0">
                    <b
                      style={{
                        fontSize: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {teamResponse?.theme !== "Others" ? "5" :"6"}. Who are your target customers/users?
                    </b>
                  </div>
                  <div
                    className="bg-white p-3 mb-3"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      height: "auto",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "black",
                      }}
                    >
                      {teamResponse.customer}
                    </p>
                  </div>
                </div>
              </div>{" "}
              <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                <div
                  // key={index}
                  className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  style={{ 
                    borderTop: "1px solid #ccc", 
                    borderRight: "1px solid #ccc", 
                    borderBottom: "1px solid #ccc",
                    borderLeft: "none" 
                  }}
                >
                  <div className="question quiz mb-0">
                    <b
                      style={{
                        fontSize: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                                                    {teamResponse?.theme !== "Others" ? "6" :"7"}. Explain your idea in detail
                    </b>
                  </div>
                  <div
                    className="bg-white p-3 mb-3"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      height: "auto",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "black",
                      }}
                    >
                      {teamResponse.detail}
                    </p>
                  </div>
                </div>
              </div>{" "}
              <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                <div
                  // key={index}
                  className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  style={{ 
                    borderTop: "1px solid #ccc", 
                    borderRight: "1px solid #ccc", 
                    borderBottom: "1px solid #ccc",
                    borderLeft: "none" 
                  }}
                >
                  <div className="question quiz mb-0">
                    <b
                      style={{
                        fontSize: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                     {teamResponse?.theme !== "Others" ? "7" :"8"}. What stage is your idea currently at?
                    </b>
                  </div>
                  <div
                    className="bg-white p-3 mb-3"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      height: "auto",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "black",
                      }}
                    >
                      {teamResponse.stage &&
                        JSON.parse(teamResponse.stage).map((item, index) => (
                          <span key={index}>
                            {item}
                            {index !==
                              JSON.parse(teamResponse.stage).length - 1 && ", "}
                          </span>
                        ))}
                    </p>
                  </div>
                </div>
              </div>{" "}
              <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                <div
                  // key={index}
                  className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  style={{ 
                    borderTop: "1px solid #ccc", 
                    borderRight: "1px solid #ccc", 
                    borderBottom: "1px solid #ccc",
                    borderLeft: "none" 
                  }}
                >
                  <div className="question quiz mb-0">
                    <b
                      style={{
                        fontSize: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {teamResponse?.theme !== "Others" ? "8" :"9"}. How unique is your idea compared to existing solutions?
                    </b>
                  </div>
                  <div
                    className="bg-white p-3 mb-3"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      height: "auto",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "black",
                      }}
                    >
                      {teamResponse.unique &&
                        JSON.parse(teamResponse.unique).map((item, index) => (
                          <span key={index}>
                            {item}
                            {index !==
                              JSON.parse(teamResponse.unique).length - 1 &&
                              ", "}
                          </span>
                        ))}
                    </p>
                  </div>
                </div>
              </div>{" "}
              <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                <div
                  // key={index}
                  className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  style={{ 
                    borderTop: "1px solid #ccc", 
                    borderRight: "1px solid #ccc", 
                    borderBottom: "1px solid #ccc",
                    borderLeft: "none" 
                  }}
                >
                  <div className="question quiz mb-0">
                    <b
                      style={{
                        fontSize: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {teamResponse?.theme !== "Others" ? "9" :"10"}. Who are your competitors or similar ideas?
                    </b>
                  </div>
                  <div
                    className="bg-white p-3 mb-3"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      height: "auto",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "black",
                      }}
                    >
                      {teamResponse.similar}
                    </p>
                  </div>
                </div>
              </div>{" "}
              <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                <div
                  // key={index}
                  className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  style={{ 
                    borderTop: "1px solid #ccc", 
                    borderRight: "1px solid #ccc", 
                    borderBottom: "1px solid #ccc",
                    borderLeft: "none" 
                  }}
                >
                  <div className="question quiz mb-0">
                    <b
                      style={{
                        fontSize: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {teamResponse?.theme !== "Others" ? "10" :"11"}. How will your idea make revenue or sustain itself?
                    </b>
                  </div>
                  <div
                    className="bg-white p-3 mb-3"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      height: "auto",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {teamResponse.revenue}
                    </p>
                  </div>
                </div>
              </div>{" "}
              <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                <div
                  // key={index}
                  className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  style={{ 
                    borderTop: "1px solid #ccc", 
                    borderRight: "1px solid #ccc", 
                    borderBottom: "1px solid #ccc",
                    borderLeft: "none" 
                  }}
                >
                  <div className="question quiz mb-0">
                    <b
                      style={{
                        fontSize: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {teamResponse?.theme !== "Others" ? "11" :"12"}. What impact will your idea have on society or the
                      environment?
                    </b>
                  </div>
                  <div
                    className="bg-white p-3 mb-3"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      height: "auto",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "black",
                      }}
                    >
                      {teamResponse.society}
                    </p>
                  </div>
                </div>
              </div>{" "}
              <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                <div
                  // key={index}
                  className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  style={{ 
                    borderTop: "1px solid #ccc", 
                    borderRight: "1px solid #ccc", 
                    borderBottom: "1px solid #ccc",
                    borderLeft: "none" 
                  }}
                >
                  <div className="question quiz mb-0">
                    <b
                      style={{
                        fontSize: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {teamResponse?.theme !== "Others" ? "12" :"13"}. How confident are you in your ability to implement
                      your idea with your current skill set?
                    </b>
                  </div>
                  <div
                    className="bg-white p-3 mb-3"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      height: "auto",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "black",
                      }}
                    >
                      {teamResponse.confident &&
                        JSON.parse(teamResponse.confident).map(
                          (item, index) => (
                            <span key={index}>
                              {item}
                              {index !==
                                JSON.parse(teamResponse.confident).length - 1 &&
                                ", "}
                            </span>
                          )
                        )}
                    </p>
                  </div>
                </div>
              </div>{" "}
              <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                <div
                  // key={index}
                  className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  style={{ 
                    borderTop: "1px solid #ccc", 
                    borderRight: "1px solid #ccc", 
                    borderBottom: "1px solid #ccc",
                    borderLeft: "none" 
                  }}
                >
                  <div className="question quiz mb-0">
                    <b
                      style={{
                        fontSize: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {teamResponse?.theme !== "Others" ? "13" :"14"}. What additional support and resources would you need
                      to implement or get started with your idea ?
                    </b>
                  </div>
                  <div
                    className="bg-white p-3 mb-3"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      height: "auto",
                    }}
                  >
                    {teamResponse.support}

                   
                  </div>
                </div>
              </div>
              <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                <div
                  // key={index}
                  className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  style={{ 
                    borderTop: "1px solid #ccc", 
                    borderRight: "1px solid #ccc", 
                    borderBottom: "1px solid #ccc",
                    borderLeft: "none" 
                  }}
                >
                  <div className="question quiz mb-0">
                    <b
                      style={{
                        fontSize: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {teamResponse?.theme !== "Others" ? "14" :"15"}. Upload images/documents & video links related to your
                      Idea.(total size limit : 10 MB)
                    </b>
                  </div>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "black",
                    }}
                  >
                    {<LinkComponent item={images} />}
                  </p>
                  <div
                    className="bg-white p-3 mb-3"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      height: "auto",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "black",
                      }}
                    >
                      <a
                        href={teamResponse.prototype_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none", color: "skyblue" }}
                      >
                        {teamResponse.prototype_link}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
                    <div className="common-flex">
                       

                        {response?.status != 'DRAFT' ? (
                            <p className="fw-bold">
                                Submitted By:{' '}
                                {response?.initiated_name
                                   }
                            </p>
                        ) : (
                            ''
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                   
                    <Button
            size="small"
            label={"Download"}
            btnClass="primary text-left"
            onClick={handlePrint}
          />
                    <Button
                        size="small"
                        label={'Close'}
                        btnClass="primary ms-auto"
                        onClick={handleClose}
                    />
                    
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default IdeaSubmissionCard;
