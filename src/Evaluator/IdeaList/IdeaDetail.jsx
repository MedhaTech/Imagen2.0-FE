/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable indent */
import React from 'react';
import { Button } from '../../stories/Button';
import LinkComponent from './LinkComponent';
import { getCurrentUser, openNotificationWithIcon } from '../../helpers/Utils';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { getSubmittedIdeaList } from '../store/evaluator/action';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Modal } from 'react-bootstrap';
import Select from '../Helper/Select';
import RateIdea from './RateIdea';
import { Row, Col, Form, Label } from 'reactstrap';
import { encryptGlobal } from '../../constants/encryptDecrypt';

const IdeaDetail = (props) => {
    const dispatch = useDispatch();
    const currentUser = getCurrentUser('current_user');
    const [teamResponse, setTeamResponse] = React.useState([]);
    const [images,setImages] = React.useState([]);
   
    const [isReject, setIsreject]=React.useState(false);
    const [reason, setReason]=React.useState('');
    const selectData = [
        "Not novel - Idea and problem common and already in use.",
        "Not novel - Idea has been 100% plagiarized.",
        "Not useful - Idea does not solve the problem identified / problem & solution not connected.",
        "Not understandable - Idea Submission does not have proper details to make a decision.",
        "Not clear (usefulness)",
        "Not filled - Inaccurate data (form is not filled properly)",
    ];
    const [reasonSec, setReasonSec] = React.useState('');
    const reasondata2 = [
        'Lot of project effort visible.',
        'Some project effort visible.',
        'Zero project effort visible.'
    ];

     const [levelName, setLevelName]=React.useState('');
     const [evalSchema, setEvalSchema]=React.useState('');
     React.useEffect(()=>{
         if(currentUser){
             setLevelName(currentUser?.data[0]?.level_name);
             setEvalSchema(currentUser?.data[0]?.eval_schema);
         }
     },[currentUser]);

    React.useEffect(() => {
        if (props?.ideaDetails) {
            setTeamResponse(
                props?.ideaDetails
            );
            setImages(JSON.parse(props?.ideaDetails.prototype_image));

        }
    }, [props]);
    const files = teamResponse?.prototype_image
    ? teamResponse?.prototype_image.split(',')
    : [];
    const problemSolvingArray = teamResponse?.problem_solving;

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
    const handleAlert = (handledText) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false,
            allowOutsideClick: false
        });

        swalWithBootstrapButtons
            .fire({
                title: 'Are you sure?',

            text:
                    handledText === 'accept'
                        ? 'You are attempting to accept this Idea'
                        : 'You are attempting to reject this Idea',
                // imageUrl: `${logout}`,
                showCloseButton: true,
                confirmButtonText: 'Confirm',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                reverseButtons: false
            })
            .then((result) => {
                if (result.isConfirmed) {
                    if (result.isConfirmed) {
                        handleL1Round(handledText);
                    }
                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire('Cancelled', '', 'error');
                }
            });
    };

    const handleL1Round = (handledText) => {
        const body = JSON.stringify({
            status:
                handledText == 'accept' ? 'SELECTEDROUND1' : 'REJECTEDROUND1',
            rejected_reason:handledText == 'reject' ? reason : '',
              rejected_reasonSecond: handledText == 'reject' ? reasonSec : ''
        });
        const challId = encryptGlobal(
            JSON.stringify(props?.ideaDetails?.challenge_response_id)
        );
        var config = {
            method: 'put',
            url: `${
                process.env.REACT_APP_API_BASE_URL_FOR_REPORTS  +
                '/challenge_response/' +
                challId
            }`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            },
            data: body
        };
        axios(config)
            .then(function (response) {
                openNotificationWithIcon('success', response?.data?.message=='OK'?'Idea processed successfully!':response?.data?.message);
                setTimeout(() => {
                    dispatch(getSubmittedIdeaList("L1"));
                    props?.topRef.current?.scrollIntoView({ behavior: 'smooth' });
                    // props?.setIsNextDiv(true);
                }, 100);
            })
            .catch(function (error) {
                openNotificationWithIcon(
                    'error',
                    error?.response?.data?.message
                );
            });
    };
   const handleReject=()=>{
        if(reason){
            handleAlert('reject'); 
            setIsreject(false);
        }
   };

    return (
        <>
            {teamResponse ? (
                <>
                    <div className="row idea_detail_card ">
                        <div className="col-12 p-0">
                            <div className="row">
                            <div className="col-lg-8">
                                {/* L1 Evaluated Ideas */}
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
                                <div className="col-sm-4 d-flex justify-content-end">
                                    <div className="ms-auto me-sm-3 p-0">
                                        <Button
                                            btnClass="primary"
                                            size="small"
                                            label="Skip"
                                            onClick={() =>
                                                props?.handleSkip()
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`${
                                props?.ideaDetails?.status === 'SUBMITTED'
                                    ? 'col-12'
                                    : 'col-lg-8'
                            } order-lg-0 order-1 p-0 h-100`}
                        >
                             {/* <div className="col-lg-8 order-lg-0 order-1 p-0 h-100"> */}
                             {/* <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                                <div
                                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                                >
                                    <div className="question quiz mb-0">
                                        <b
                                            style={{
                                               fontSize: '1rem',marginBottom:"1rem"
                                            }}
                                        >
                                            Idea Submission Language
                                            
                                        </b>
                                    </div>
                                    <div className="bg-white p-3 mb-3" style={{ border: '1px solid #ccc', borderRadius: '10px',height:"50px" }}>
                                        <p
                                            style={{
                                                fontSize: '1rem',color:"black"
                                            }}
                                        >
                                            {
                                                teamResponse.language
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div> */}

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
                                            1.Which category does your idea belong to?
                                            
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
                                             3. Give a title to your idea.
                                           
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
                                    <div className="bg-white p-3 mb-3" style={{ border: '1px solid #ccc', borderRadius: '10px',height:"auto" }}>
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
                                    <div className="bg-white p-3 mb-3" style={{ border: '1px solid #ccc', borderRadius: '10px',height:"auto" }}>
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
                                    <div className="bg-white p-3 mb-3" style={{ border: '1px solid #ccc', borderRadius: '10px',height:"auto" }}>
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
                                              9. Who are your competitors or similar ideas?
                                        </b>
                                    </div>
                                    <div className="bg-white p-3 mb-3" style={{ border: '1px solid #ccc', borderRadius: '10px',height:"auto" }}>
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
                                             12. How confident are you in your ability to implement your idea with your current skill set?
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
                                            <div className="bg-white p-3 mb-3" style={{ border: '1px solid #ccc', borderRadius: '10px',height:"auto" }}>
                                            {/* {
                        <LinkComponent item={images} />
                      } */}
                    {teamResponse.support}

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
                                            14. Upload images/documents & video links related to your Idea.(total size limit : 50 MB) 
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
                           
                            {/* {teamResponse?.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
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
                        {/* </div> */}
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
                            {/* -----level 1 accept/reject process---- */}
                            <div className="d-md-flex">
                                {props?.ideaDetails?.status === 'SUBMITTED' && (
                                    <div className="d-flex ms-auto">
                                        <button
                                            className="btn btn-success me-3 m-2"
                                            onClick={() => {
                                                handleAlert('accept');
                                                setReason('');
                                                setReasonSec('');

                                            }}
                                        >
                                            <span >Accept</span>
                                        </button>
                                        <button
                                            className="btn btn-danger me-3 m-2"
                                            onClick={() => {
                                                // handleAlert('reject');
                                                setIsreject(true);
                                                setReason('');
                                                setReasonSec('');
                                            }}
                                        >
                                            <span >Reject</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* //-----------Rating section---- */}
                    {/* {evalSchema?.toLowerCase()=='rating_scale'? (
                       <RateIdea
                        challenge_response_id={props?.ideaDetails?.challenge_response_id}
                        evaluator_id={currentUser?.data[0]?.user_id}
                        level={levelName}
                        setIsNextDiv={props?.setIsNextDiv}
                       />
                    ):
                    <>
                    </>
                } */}
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
                            label="Next Idea"
                            onClick={() => {
                                props?.handleSkip();
                            }}
                        />
                    </div>
                </>
            )}
            {/* ----------reject-modal----- */}
            <Modal
                show={isReject}
                onHide={() => setIsreject(false)}
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="assign-evaluator ChangePSWModal teacher-register-modal"
                backdrop="static"
                scrollable={true}
            >
                <Modal.Header closeButton onHide={() => setIsreject(false)}>
                    <Modal.Title
                        id="contained-modal-title-vcenter"
                        className="w-100 d-block text-center"
                    >
                        Reject 
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="my-3 text-center">
                        <h4 className="mb-sm-4 mb-3">
                            Please Select the reason for rejection.
                        </h4>
                        <Col>
                            <Col className="m-5">
                                <p className="text-left">
                                    <b>1. Novelty & Usefulness</b> <span required style={{color:"red"}}>*</span>
                                </p>
                                <Select
                                    list={selectData}
                                    setValue={setReason}
                                    placeHolder={'Please Select Reject Reason'}
                                    value={reason}
                                />
                            </Col>
                            <Col className="m-5">
                                <p className="text-left">
                                    <b>
                                        2. Does the submission show any evidence
                                        of efforts put in to complete the
                                        project?
                                    </b> <span required style={{color:"red"}}>*</span>
                                </p>
                                <Select
                                    list={reasondata2}
                                    setValue={setReasonSec}
                                    placeHolder={'Please Select Reject Reason'}
                                    value={reasonSec}
                                />
                            </Col>
                        </Col>
                    </div>
                    <div className="text-center">
                        <Button
                            label={'Reject'}
                            btnClass={
                                reason && reasonSec ? 'primary' : 'default'
                            }
                            size="small "
                            onClick={() => handleReject()}
                            disabled={!(reason && reasonSec)}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default IdeaDetail;