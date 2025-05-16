/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from "react-feather";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const IdeaForm = ({ selectedTheme, themes, onDiscard }) => {
  const [formData, setFormData] = useState({
    theme: selectedTheme,
    focusArea: '',
    problemStatement: '',
    ideaTitle: '',
    ideaDescription: '',
    workbook: '',
    prototypeLink: ''
  });

  const questions = [
    { qid: 1, title: 'Select a theme which relates to your idea' },
    { qid: 2, title: 'Select focus area' },
    { qid: 3, title: 'Describe your problem statement' },
    { qid: 4, title: 'Give a Title to your IDEA' },
    { qid: 5, title: 'Describe your Idea in detail' },
    { qid: 6, title: 'Did u complete workbook?' },
    { qid: 7, title: 'Share video link of your idea prototype' },
  ];

  const [step, setStep] = useState(1);
  const formEndRef = useRef(null);
  const MySwal = withReactContent(Swal);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDiscard = () => {
    setFormData({
      theme: selectedTheme,
      focusArea: '',
      problemStatement: '',
      ideaTitle: '',
      ideaDescription: '',
      workbook: '',
      prototypeLink: ''
    });
    setStep(1);
    onDiscard();
  };

  const handleButtonClick = (position) => {
    displayAlert(position);
    };

    const displayAlert = (position) => {
        MySwal.fire({
            text: `Your work has been saved`,
            position: position,
            showConfirmButton: false, // Hide the "OK" button

        });
    };

  useEffect(() => {
    if (formEndRef.current) {
      formEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [step]);

  const choosedTheme = themes.find(theme => theme.title === formData.theme);

  const renderQuestion = (currentStep) => {
    switch (currentStep) {
      case 1:
        return (
          <li key={currentStep}>
            <div className="timeline-badge success">
              <i className="fa fa-street-view" />
            </div>
            <div className="timeline-panel bg-success-gradient">
              <div className="timeline-heading">
                <h4 className="timeline-title">Question {questions[0].qid}</h4>
              </div><br/>
              <div className="timeline-body">
                <p>{questions[0].title}</p><br />
                <select name="theme" value={formData.theme} onChange={handleInputChange} className='form-select'>
                  {themes.map((theme) => (
                    <option key={theme.id} value={theme.title}>{theme.title}</option>
                  ))}
                </select>
                {currentStep === step && (
                  <><br />
                    <div className='view-btn'>
                      <a
                        href="#"
                        className="btn btn-soft-light rounded-pill"
                        onClick={handleNext}
                      >
                        Next{" "}<ArrowRight className="me-2" />
                      </a>
                    </div>
                  </>)}
              </div>
            </div>
          </li>
        );
      case 2:
        return (
          <li className="timeline-inverted" key={currentStep}>
            <div className="timeline-badge info">
              <i className="fa fa-eye" />
            </div>
            <div className="timeline-panel bg-info-gradient">
              <div className="timeline-heading">
                <h4 className="timeline-title">Question {questions[1].qid}</h4>
              </div><br />
              <div className="timeline-body">
                {choosedTheme && (
                  <select name="focusArea" value={formData.focusArea} onChange={handleInputChange} className='form-select'>
                    <option value="">Select Focus Area</option>
                    {choosedTheme.focusareas.map((focusarea, index) => (
                      <option key={index} value={focusarea}>{focusarea}</option>
                    ))}
                  </select>
                )}
               
                {currentStep === step && (
                  <><br />
                    <div className='view-btn'>
                      <a
                        href="#"
                        className="btn btn-soft-light rounded-pill"
                        onClick={handleNext}
                      >
                        {" "}Next
                      </a>
                    </div>
                  </>)}
              </div>

            </div>
          </li>
        );
      case 3:
        return (
          <li key={currentStep}>
            <div className="timeline-badge bg-secondary">
              <i className="fa fa-exclamation-circle" />
            </div>
            <div className="timeline-panel bg-secondary-gradient">
              <div className="timeline-heading">
                <h4 className="timeline-title">Question {questions[2].qid}</h4>
              </div><br />
              <div className="timeline-body">
                <p>{questions[2].title}</p><br />
                <textarea
                  name="problemStatement"
                  value={formData.problemStatement}
                  onChange={handleInputChange}
                  className="text-form form-control"
                  placeholder="Enter Your Problem Statement"
                  rows={4} >
                </textarea>
                {currentStep === step && (
                  <><br />
                    <div className='view-btn'>
                      <a
                        href="#"
                        className="btn btn-soft-light rounded-pill"
                        onClick={handleNext}
                      >
                        Next{" "}<ArrowRight className="me-2" />
                      </a>
                    </div>
                  </>)}
              </div>
            </div>
          </li>
        );
      case 4:
        return (
          <li className="timeline-inverted" key={currentStep}>
            <div className="timeline-badge primary">
              <i className="fa fa-lightbulb" />
            </div>
            <div className="timeline-panel bg-warning-gradient">
              <div className="timeline-heading">
                <h4 className="timeline-title">Question {questions[3].qid}</h4>
              </div><br />
              <div className="timeline-body">
                <p>{questions[3].title}</p><br />
                <textarea
                  name="ideaTitle"
                  value={formData.ideaTitle}
                  onChange={handleInputChange}
                  className="text-form form-control"
                  placeholder="Enter your Idea Title"
                  rows={2} >
                </textarea>
                {currentStep === step && (
                  <><br />
                    <div className='view-btn'>
                      <a
                        href="#"
                        className="btn btn-soft-light rounded-pill"
                        onClick={handleNext}
                      ><ArrowLeft className="me-2" />
                        {" "}Next
                      </a>
                    </div>
                  </>)}
              </div>
            </div>
          </li>
        );
      case 5:
        return (
          <li key={currentStep}>
            <div className="timeline-badge info">
              <i className="fa fa-edit" />
            </div>
            <div className="timeline-panel bg-info-gradient">
              <div className="timeline-heading">
                <h4 className="timeline-title">Question {questions[4].qid}</h4>
              </div><br />
              <div className="timeline-body">
                <p>{questions[4].title}</p><br />
                <textarea
                  name="ideaDescription"
                  value={formData.ideaDescription}
                  onChange={handleInputChange}
                  className="text-form form-control"
                  placeholder="Enter Idea details"
                  rows={6}>
                </textarea>
                {currentStep === step && (
                  <><br />
                    <div className='view-btn'>
                      <a
                        href="#"
                        className="btn btn-soft-light rounded-pill"
                        onClick={handleNext}
                      >
                        Next{" "}<ArrowRight className="me-2" />
                      </a>
                    </div>
                  </>)}
              </div>
            </div>
          </li>
        );
      case 6 :
        return (
          <li className="timeline-inverted" key={currentStep}>
            <div className="timeline-badge info">
              <i className="fa fa-eye" />
            </div>
            <div className="timeline-panel bg-info-gradient">
              <div className="timeline-heading">
                <h4 className="timeline-title">Question {questions[5].qid}</h4>
              </div><br />
              <div className="timeline-body">
                <p> {questions[5].title} </p><br />
                <div>
                  <div className='form-check'>
                    <label className='form-check-label'>
                      <input type="radio" name="workbook" value="YES" onChange={handleInputChange} className='form-check-input' /> YES
                    </label>
                  </div>
                  <div className='form-check'>
                    <label className='form-check-label'>
                      <input type="radio" name="workbook" value="NO" onChange={handleInputChange} className='form-check-input' /> NO
                    </label>
                  </div>
                </div>
                {currentStep === step && (
                  <><br />
                    <div className='view-btn'>
                      <a
                        href="#"
                        className="btn btn-soft-light rounded-pill"
                        onClick={handleNext}
                      >
                        {" "}Next
                      </a>
                    </div>
                  </>)}
              </div>

            </div>
          </li>
        );
      case 7:
        return (
          <li key={currentStep}>
            <div className="timeline-badge success">
              <i className="fa fa-video" />
            </div>
            <div className="timeline-panel bg-success-gradient">
              <div className="timeline-heading">
                <h4 className="timeline-title">Question {questions[6].qid}</h4>
              </div><br />
              <div className="timeline-body">
                <p>{questions[6].title}</p><br />
                <input type="text"
                  name="prototypeLink"
                  value={formData.prototypeLink}
                  onChange={handleInputChange}
                  className="text-form form-control"
                  placeholder="Provide Prototype Video Link" />
              </div>
            </div>
          </li>
        );
      default:
        return null;
    }
  };

  return (
    <div className="cardhead">
      <div className="content">
        {/*<div className="page-header">
           <div className="row">
            <div className="col-sm-12">
              <h3 className="page-title">Idea Submission</h3>
            </div>
          </div> 
        </div>*/}
        <div className="row">
          {/* Ribbon */}
          <div className="col-md-12">
            <div >
              <div >
                {Array.from({ length: step }, (_, index) => (
                  <ul className="timeline" key={index}>
                    {renderQuestion(index + 1)}
                  </ul>
                ))}
                <div ref={formEndRef}></div>
              </div>
              {step === 7 ? (
                <div >
                  <div className="col-lg-12">
                    <div className="view-btn">
                      <button type="button" className="btn btn-reset me-2" onClick={handleDiscard}>Discard</button>
                      {" "}<button id="discard" type="submit" className="btn btn-save" onClick={() => handleButtonClick('bottom-start')}>Save as Draft</button>
                    </div>
                  </div>
                </div>) : null}
                <br/>

            </div>
          </div>
          {/* /Ribbon */}
        </div>
      </div>
    </div>
  );
};

export default IdeaForm;
