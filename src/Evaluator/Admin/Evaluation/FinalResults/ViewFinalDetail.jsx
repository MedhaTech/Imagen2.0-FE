/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useRef, useEffect } from 'react';
import './ViewFinalSelectedideas.scss';
import { Button } from '../../../../stories/Button';
import LinkComponent from '../Pages/LinkComponent';
import { useLocation } from 'react-router-dom';
import RatedDetailCard from '../Pages/RatedDetailCard';

import { Col, Container, Row } from 'reactstrap';
import { Card } from 'react-bootstrap';

const ViewDetail = (props) => {
    const { search } = useLocation();
    const level = new URLSearchParams(search).get('level');
    const [teamResponse, setTeamResponse] = React.useState({});
 const [images,setImages] = React.useState([]);

   
    useEffect(() => {
        if (props?.ideaDetails) {
            setTeamResponse(props?.ideaDetails);
            setImages(JSON.parse(props?.ideaDetails.prototype_image));

        }
    }, [props]);
   
    return (
        <div>
            {teamResponse ? (
                <>
                    <div style={{ display: 'none' }}>
                       
                    </div>
                  
                    <div className="row idea_detail_card">
                        <div className="col-12 p-0">
                            <div className="row">
                                <div className="col-lg-6">
                                    <Row>
                                        <Col className="col-lg-8">
                                        <h4 className="mb-md-4 mb-3">
                                                Theme :&nbsp;
                                                <span className="text-capitalize">
                                                {props?.ideaDetails?.theme?.toLowerCase() ||
                                                        ''}
                                                </span>
                                            </h4>
                                        </Col>
                                        <Col className="col-lg-4">
                                        <h4 className="mb-md-4 mb-3">
                                                CID :&nbsp;
                                                <span className="text-capitalize">
                                                {props?.ideaDetails.challenge_response_id ||
                                                        ''}
                                                </span>
                                            </h4>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="col-lg-6 d-flex justify-content-end">
                                    <div className="ms-auto me-sm-3 p-0">
                                        <Button
                                            btnClass="primary"
                                            size="small"
                                            label="Back to List"
                                            onClick={() =>
                                                props?.setIsDetail(false)
                                            }
                                        />
                                    </div>
                                    <div className="ms-auto me-sm-3 p-0">
                                        <Button
                                            btnClass={
                                                props?.currentRow > 1
                                                    ? 'primary'
                                                    : 'default'
                                            }
                                            size="small"
                                            label={'Previous'}
                                            onClick={() => props?.handlePrev()}
                                            disabled={props?.currentRow == 1}
                                        />
                                    </div>
                                    <div className="ms-auto me-sm-3 p-0">
                                        <Button
                                            btnClass={
                                                props?.dataLength !=
                                                props?.currentRow
                                                    ? 'primary'
                                                    : 'default'
                                            }
                                            size="small"
                                            label={'Next'}
                                            onClick={() => props?.handleNext()}
                                            disabled={
                                                props?.dataLength ==
                                                props?.currentRow
                                            }
                                        />
                                    </div>
                                    <div className="mx-2 pointer d-flex align-items-center">
                                       
                                    </div>
                                </div>
                                <div className="col-lg-12 mt-1">
                                    <Row className="col-lg-12">
                                                       <Col className="md-6">
                                                         <Card
                                                           bg="white"
                                                           text="dark"
                                                           className="mb-2"
                                                           style={{ height: "120px" }}
                                                         >
                                                           <Card.Body>
                                                             <label
                                                               htmlFor="teams"
                                                               className=""
                                                               style={{ fontSize: "16px" }}
                                                             >
                                                               <b>College Details</b>
                                                             </label>
                                                             <Card.Text
                                                               style={{
                                                                 marginTop: "10px",
                                                                 marginBottom: "20px",
                                                               }}
                                                             >
                                                               <span style={{fontWeight:'bold'}}>College Type :</span>
                                                               <span>
                                                                 &nbsp;
                                                                 {teamResponse.college_type}
                                                               </span>
                                                               <br />
                                                               <span style={{fontWeight:'bold'}}>College Name :</span>
                                                               <span>
                                                                 &nbsp;
                                                                 {teamResponse.college_name}
                                                               </span>
                                                               <br />
                                   
                                                              
                                                             </Card.Text>
                                                           </Card.Body>
                                                         </Card>
                                                       </Col>
                                                       <Col className="md-6">
                                                         <Card
                                                           bg="white"
                                                           text="dark"
                                                           className="mb-2"
                                                           style={{ height: "120px" }}
                                                         >
                                                           <Card.Body>
                                                             <label
                                                               htmlFor="teams"
                                                               className=""
                                                               style={{ fontSize: "16px" }}
                                                             >
                                                               <b>Team Details</b>
                                                             </label>
                                                             <Card.Text
                                                               style={{
                                                                 marginTop: "10px",
                                                                 marginBottom: "20px",
                                                               }}
                                                             >
                                                             
                                                               <span style={{fontWeight:'bold'}}>Team Members :</span>
                                                               <span>
                                                                 &nbsp;
                                                                 {teamResponse &&
                                                                   teamResponse.team_members &&
                                                                   teamResponse.team_members.join(", ")}
                                                               </span>
                                                               <br />
                                   
                                                               <span style={{fontWeight:'bold'}}>District :</span>
                                                               <span>
                                                                 &nbsp;
                                                                 {teamResponse.district}
                                                               </span>
                                                             </Card.Text>
                                                           </Card.Body>
                                                         </Card>
                                                       </Col>
                                                     </Row>
                                   
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8 order-lg-0 order-1 p-2 h-100">
                       

                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                    <b
                                            style={{
                                                fontSize: '1rem',marginBottom:"1rem"
                                            }}
                                        >
                                            1. Which category does your idea belong to?
                                            
                                        </b>
                                    </div>
                                    <div className="bg-white p-3 mb-3" style={{ border: '1px solid #ccc', borderRadius: '10px',height:"auto" }}>
                                    <p
                                            style={{
                                                fontSize: '1rem',color:"black"
                                            }}
                                        >
                                            {
                                                teamResponse.theme
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                    <b
                                            style={{
                                                fontSize: '1rem',marginBottom:"1rem"
                                            }}
                                        >
                                           2.Describe your idea (in one sentence).
                                           
                                        </b>
                                    </div>
                                    <div className="bg-white p-3 mb-3" style={{ border: '1px solid #ccc', borderRadius: '10px',height:"auto" }}>
                                    <p
                                            style={{
                                                fontSize: '1rem',color:"black"
                                            }}
                                        >
                                            {
                                                teamResponse.idea_describe
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>{' '}
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                    <b
                                            style={{
                                                fontSize: '1rem',marginBottom:"1rem"
                                            }}
                                        >
                                             3.Give a title to your idea.
                                           
                                        </b>
                                    </div>
                                    <div className="bg-white p-3 mb-3" style={{ border: '1px solid #ccc', borderRadius: '10px',height:"auto" }}>
                                    <p
                                            style={{
                                                fontSize: '1rem',color:"black"
                                            }}
                                        >
                                            {
                                                teamResponse.title
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>{' '}
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                    <b
                                            style={{
                                                fontSize: '1rem',marginBottom:"1rem"
                                            }}
                                        >
                                            4. What problem does your idea solve?
                                        </b>
                                    </div>
                                    <div className="bg-white p-3 mb-3" style={{ border: '1px solid #ccc', borderRadius: '10px', height: "auto", }}>
                                    <p
                                            style={{
                                                fontSize: '1rem',color:"black"
                                            }}
                                        >
                                            {teamResponse.solve}
                                        </p>
                                    </div>
                                </div>
                            </div>{' '}
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                    <b
                                            style={{
                                                fontSize: '1rem',marginBottom:"1rem"
                                            }}
                                        >
                                              5. Who are your target customers/users?
                                        </b>
                                    </div>
                                    <div className="bg-white p-3 mb-3" style={{ border: '1px solid #ccc', borderRadius: '10px', height: "auto", }}>
                                    <p
                                            style={{
                                                fontSize: '1rem',color:"black"
                                            }}
                                        >
                                            {teamResponse.customer}
                                        </p>
                                    </div>
                                </div>
                            </div>{' '}
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                    <b
                                            style={{
                                                fontSize: '1rem',marginBottom:"1rem"
                                            }}
                                        >
                                            6. Explain your idea in detail
                                        </b>
                                    </div>
                                    <div className="bg-white p-3 mb-3" style={{ border: '1px solid #ccc', borderRadius: '10px', height: "auto", }}>
                                    <p
                                            style={{
                                                fontSize: '1rem',color:"black"
                                            }}
                                        >
                                            {teamResponse.detail}
                                        </p>
                                    </div>
                                </div>
                            </div>{' '}
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                    <b
                                            style={{
                                                fontSize: '1rem',marginBottom:"1rem"
                                            }}
                                        >
                                             7. What stage is your idea currently at?
                                        </b>
                                    </div>
                                    <div className="bg-white p-3 mb-3" style={{ border: '1px solid #ccc', borderRadius: '10px',height:"auto" }}>
                                    <p
                                            style={{
                                                fontSize: '1rem',color:"black"
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
                            </div>{' '}
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                        <b
                                            style={{
                                                fontSize: '1rem',marginBottom:"1rem"
                                            }}
                                        >
                                             8. How unique is your idea compared to existing solutions?
                                        </b>
                                    </div>
                                    <div className="bg-white p-3 mb-3" style={{ border: '1px solid #ccc', borderRadius: '10px',height:"auto" }}>
                                        <p
                                            style={{
                                                fontSize: '1rem',color:"black"
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
                            </div>{' '}

                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                    <b
                                            style={{
                                                fontSize: '1rem',marginBottom:"1rem"
                                            }}
                                        >
                                              9.Who are your competitors or similar ideas?
                                        </b>
                                    </div>
                                    <div className="bg-white p-3 mb-3" style={{ border: '1px solid #ccc', borderRadius: '10px', height: "auto",}}>
                                    <p
                                            style={{
                                                fontSize: '1rem',color:"black"
                                            }}
                                        >
                                            {teamResponse.similar}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                        <b
                                            style={{
                                                fontSize: '1rem',marginBottom:"1rem"
                                            }}
                                        >
                                             10. How will your idea make revenue or sustain itself?
                                        </b>
                                    </div>
                                    <div className="bg-white p-3 mb-3" style={{ border: '1px solid #ccc', borderRadius: '10px',height:"auto" }}>
                                        <p
                                            style={{
                                                fontSize: '1rem',color:"black"
                                            }}
                                        >
                                            {teamResponse.revenue}
                                        </p>
                                    </div>
                                </div>
                            </div>{' '}
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                        <b
                                            style={{
                                                fontSize: '1rem',marginBottom:"1rem"
                                            }}
                                        >
                                             11. What impact will your idea have on society or the environment?
                                        </b>
                                    </div>
                                    <div className="bg-white p-3 mb-3" style={{ border: '1px solid #ccc', borderRadius: '10px',height:"auto" }}>
                                        <p
                                            style={{
                                                fontSize: '1rem',color:"black"
                                            }}
                                        >
                                              {teamResponse.society}
                                        </p>
                                    </div>
                                </div>
                            </div>{' '}
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                        <b
                                            style={{
                                                fontSize: '1rem',marginBottom:"1rem"
                                            }}
                                        >
                                             12.  How confident are you in your ability to implement your idea with your current skill set?
                                        </b>
                                    </div>
                                    <div className="bg-white p-3 mb-3" style={{ border: '1px solid #ccc', borderRadius: '10px',height:"auto" }}>
                                        <p
                                            style={{
                                                fontSize: '1rem',color:"black"
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
                            </div>{' '}

                          
                                    <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                        <div
                                            className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                                        >
                                            <div className="question quiz mb-0">
                                                <b
                                                    style={{
                                                        fontSize: '1rem',marginBottom:"1rem"
                                                    }}
                                                >
                                                    13. What additional support and resources would you need to implement or get started with your idea ?
                                                </b>
                                            </div>
                                            <div className="bg-white p-3 mb-3" style={{ border: '1px solid #ccc', borderRadius: '10px', height: "auto",}}>

                                                    {teamResponse.support}
                                                
                                            </div>
                                        </div>
                                    </div>
                            <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    // key={index}
                                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                        <b
                                            style={{
                                                fontSize: '1rem',marginBottom:"1rem"
                                            }}
                                        >
                                            14. Upload images/documents & video links related to your Idea.(total size limit : 10 MB) 
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
                                    <div className="bg-white p-3 mb-3" style={{ border: '1px solid #ccc', borderRadius: '10px',height:"auto" }}>
                                        <p
                                            style={{
                                                fontSize: '1rem',color:"black"
                                            }}
                                        >
                                             <a 
            href={teamResponse.prototype_link} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ textDecoration: 'none', color: 'skyblue'}}
        >
            {teamResponse.prototype_link}
        </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                           

                        </div>
                       
                        <div className="col-lg-4 order-lg-1 order-0 p-2 h-100 mt-3 status_info_col">
                            <div className="level-status-card card border p-md-5 p-3 mb-3 me-lg-0 me-md-3">
                                {teamResponse?.evaluation_status ? (
                                    <p
                                    style={{fontSize:"1.2rem"}}
                                        className={`${
                                            teamResponse
                                                ?.evaluation_status ==
                                            'SELECTEDROUND1'
                                                ? 'text-success'
                                                : 'text-danger'
                                        }fs-4 fw-bold text-center`}
                                    >
                                        <span className="text-info"  style={{fontSize:"1.2rem"}}>
                                            L1 :{' '}
                                        </span>
                                        {teamResponse
                                            ?.evaluation_status ==
                                        'SELECTEDROUND1'
                                            ? 'Accepted'
                                            : 'Rejected'}
                                    </p>
                                ) : (
                                    ''
                                )}

                                {teamResponse?.evaluated_name ? (
                                    <p className="text-center">
                                        <span className="text-bold">
                                            Evaluated By :{' '}
                                        </span>{' '}
                                        {teamResponse?.evaluated_name ||
                                            ''}
                                    </p>
                                ) : (
                                    ''
                                )}
  
  
                            </div>
                            {level !== 'L1' &&
                                props?.ideaDetails?.evaluator_ratings.length >
                                    0 && (
                                    <RatedDetailCard
                                    details={props?.ideaDetails}
                                    />
                                )}
                                 {(teamResponse?.final_result === "0" || teamResponse?.final_result === "1") &&(
                   <div className="level-status-card card border p-md-5 p-2 me-lg-0 me-md-3">
                      {teamResponse?.final_result ? (
                        <p
                          style={{ fontSize: "1.2rem" }}
                          className={`${
                            teamResponse?.final_result == "0"
                              ? "text-success"
                              : "text-danger"
                          }fs-4 fw-bold text-center`}
                        >
                          <span
                            className="text-info"
                            style={{ fontSize: "1.2rem" }}
                          >
                            L3 :{" "}
                          </span>
                          {teamResponse?.final_result == "0"
                            ? "Runner - Not Promoted"
                            : "Winner - Promoted"}
                        </p>
                      ) : (
                        ""
                      )}
                      </div>
                       )}
                        </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <p
                            style={{ fontSize: '1rem', margin: '1rem' }}
                            className="fw-bold"
                        >
                            Submitted By :{' '}
                            {teamResponse.initiated_name
                                ? teamResponse.initiated_name
                                : '-'}
                        </p>
                       
                    </div>
                    <br />
                    <div style={{ display: 'flex' }}>
                       
                       
                    </div>
                    <div>
                        <Button
                            btnClass="primary"
                            size="small"
                            label="Back"
                            onClick={() => {
                                props?.setIsDetail(false);
                            }}
                        />
                    </div>
                </>
            ) : (
                <>
                    <h2 className="my-auto text-center mt-5">
                        Details Not Available.
                    </h2>
                    <div className="text-center mt-5">
                        <Button
                            btnClass="primary"
                            size="small"
                            label="Back"
                            onClick={() => {
                                props?.setIsDetail(false);
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default ViewDetail;
