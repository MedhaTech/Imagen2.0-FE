/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useRef, useEffect } from 'react';
import './ViewFinalSelectedideas.scss';
import { Button } from '../../../../stories/Button';
import LinkComponent from '../Pages/LinkComponent';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import RatedDetailCard from '../Pages/RatedDetailCard';
import jsPDF from 'jspdf';
import { FaDownload, FaHourglassHalf } from 'react-icons/fa';
import DetailToDownload from '../../Challenges/DetailToDownload';
import html2canvas from 'html2canvas';
import { useReactToPrint } from 'react-to-print';
import { Col, Container, Row } from 'reactstrap';
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ViewDetail = (props) => {
    const { search } = useLocation();
    const level = new URLSearchParams(search).get('level');
    const [teamResponse, setTeamResponse] = React.useState({});
    const { t } = useTranslation();
 const [images,setImages] = React.useState([]);

    // React.useEffect(() => {
    //     if (props?.ideaDetails?.response) {
    //         setTeamResponse(
    //             Object.entries(props?.ideaDetails?.response).map((e) => e[1])
    //         );
    //     }
    // }, [props]);
    console.warn('detail', props);
    useEffect(() => {
        if (props?.ideaDetails) {
            setTeamResponse(props?.ideaDetails);
            setImages(JSON.parse(props?.ideaDetails.prototype_image));

        }
    }, [props]);
    const [pdfLoader, setPdfLoader] = React.useState(false);
    const downloadPDF = async () => {
        setPdfLoader(true);
        const domElement = document.getElementById('pdfId');
        await html2canvas(domElement, {
            onclone: (document) => {
                document.getElementById('pdfId').style.display = 'block';
            },
            scale: 1.13
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'px', [2580, 3508]);
            pdf.addImage(
                imgData,
                'JPEG',
                20,
                20,
                2540,
                pdf.internal.pageSize.height,
                undefined,
                'FAST'
            );
            pdf.save(`${new Date().toISOString()}.pdf`);
        });
        setPdfLoader(false);
    };
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `${
            props?.ideaDetails?.team_name
                ? props?.ideaDetails?.team_name
                : 'temp'
        }_IdeaSubmission`
    });
    const files = teamResponse?.prototype_image
        ? teamResponse?.prototype_image.split(',')
        : [];
    const downloadFile = (item) => {
        // const link = document.createElement('a');
        // link.href = item;
        // link.download = 'upload.pdf';
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
        fetch(item)
            .then((response) => {
                // Convert the response to a blob
                return response.blob();
            })
            .then((blob) => {
                // Create a download link
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                const parts = item.split('/');
                link.setAttribute('download', parts[parts.length - 1]);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    };
    const problemSolvingArray = teamResponse?.problem_solving;
    // console.log(teamResponse?.evaluator_ratings);
    return (
        <div>
            {teamResponse ? (
                <>
                    <div style={{ display: 'none' }}>
                        {/* <DetailToDownload
                            ref={componentRef}
                            ideaDetails={teamResponse}
                            teamResponse={teamResponse}
                            level={'Draft'}
                        /> */}
                    </div>
                    {/* <div id='pdfId' style={{display:'none'}}>
                        <DetailToDownload ideaDetails={props?.ideaDetails} teamResponse={teamResponse} level={level}/>
                    </div> */}
                    <div className="row idea_detail_card">
                        <div className="col-12 p-0">
                            <div className="row">
                                <div className="col-lg-6">
                                    <Row>
                                        <Col>
                                        <h4 className="mb-md-4 mb-3">
                                                Theme :
                                                <span className="text-capitalize">
                                                {props?.ideaDetails?.theme?.toLowerCase() ||
                                                        ''}
                                                </span>
                                            </h4>
                                        </Col>
                                        <Col>
                                        <h4 className="mb-md-4 mb-3">
                                                CID :
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
                                        {/* {
                                            !pdfLoader?
                                            <FaDownload size={22} onClick={async()=>{await downloadPDF();}}/>:
                                            <FaHourglassHalf size={22}/>
                                        } */}
                                         {/* Add */}
                                        {/* <FaDownload
                                            size={22}
                                            onClick={handlePrint}
                                        /> */}
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
                                    {/* <Row className="col-lg-12">
                                        <h2>
                                            <span
                                                style={{
                                                    color: 'blue'
                                                }}
                                            >
                                                Problem Statement :{' '}
                                            </span>
                                            <span className="text-capitalize fs-3">
                                                {props?.ideaDetails?.sub_category?.toLowerCase() ||
                                                    ''}
                                            </span>
                                        </h2>
                                    </Row> */}
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
                                            {/* {item?.question_no || ''}.{' '}
                                                {item?.question || ''} */}
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
                                           {/* {problemSolvingArray} */}
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
                                            // key={index}
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
                                                {/* {files.length > 0 &&
                                                    files.map((item, i) => (
                                                        <div key={i}>
                                                          
                                                            <a
                                                                key={i}
                                                                className="badge mb-2 bg-info p-3 ms-3"
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                onClick={() =>
                                                                    downloadFile(
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                {item
                                                                    .split('/')
                                                                    .pop()}
                                                            </a>
                                                        </div>
                                                    ))} */}
                                                    {teamResponse.support}
                                                     {/* {
                        <LinkComponent item={images} />
                      } */}
                                                {/* <p
                                        style={{
                                            fontSize: '1.4rem'
                                        }}
                                    >
                                        {teamResponse?.Prototype_file}
                                    </p> */}
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
                                            {/* {teamResponse.prototype_link} */}
                                        </p>
                                    </div>
                                </div>
                            </div>
                           
                            {/* {teamResponse?.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="mb-4 my-3 comment-card px-5 py-3 card me-md-3"
                                    >
                                        <div className="question quiz mb-0">
                                            <b
                                                style={{
                                                    fontSize: '1.6rem'
                                                }}
                                            >
                                                {item?.question_no || ''}.{' '}
                                                {item?.question || ''}
                                            </b>
                                        </div>
                                        <div className="bg-light rounded p-5">
                                            <p
                                                style={{
                                                    fontSize: '1.4rem'
                                                }}
                                            >
                                                {item?.question_type ===
                                                'MCQ' ? (
                                                    item?.selected_option?.map(
                                                        (data, i) => {
                                                            return (
                                                                <div key={i}>
                                                                    {data || ''}
                                                                </div>
                                                            );
                                                        }
                                                    )
                                                ) : item?.question_type ===
                                                      'TEXT' ||
                                                  item?.question_type ===
                                                      'MRQ' ? (
                                                    item?.selected_option
                                                ) : item?.question_type ===
                                                  'DRAW' ? (
                                                    <LinkComponent
                                                        item={
                                                            item.selected_option
                                                        }
                                                    />
                                                ) : (
                                                    ''
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })} */}
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
  
  {/* {props?.ideaDetails?.evaluator_ratings[0]?.rated_evaluated_name && (
  <div className="row mb-1 mt-2">
    <div className="col-5">
      <p className="my-0 fw-bold">Evaluated By :</p>
    </div>
    <div className="col-7">
      {props?.ideaDetails?.evaluator_ratings[0]?.rated_evaluated_name.map((item, i) => (
        <p className="my-0 text-muted" key={i}>
          {`${i + 1}: ${item}`}
        </p>
      ))}
    </div>
  </div>
)} */}
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
                        {/* <p
                            style={{ fontSize: '1rem', margin: '1rem' }}
                            className="fw-bold"
                        >
                            Submitted At :{' '}
                            {teamResponse.submitted_at
                                ? moment(teamResponse.submitted_at).format(
                                      'DD-MM-YYYY'
                                  )
                                : '-'}
                        </p> */}
                    </div>
                    <br />
                    <div style={{ display: 'flex' }}>
                        {/* <p
                            style={{ fontSize: '1rem', margin: '1rem' }}
                            className="fw-bold"
                        >
                            Verified By :{' '}
                            {teamResponse.verified_name
                                ? teamResponse.verified_name
                                : '-'}
                        </p> */}
                        {/* <p
                            style={{ fontSize: '1rem', margin: '1rem' }}
                            className="fw-bold"
                        >
                            Verified At :{' '}
                            {teamResponse.verified_at
                                ? moment(teamResponse.verified_at).format(
                                      'DD-MM-YYYY'
                                  )
                                : '-'}
                        </p> */}
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
