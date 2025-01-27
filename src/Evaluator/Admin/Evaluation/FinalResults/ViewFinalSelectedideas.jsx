/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect, useRef, useState } from 'react';
import './ViewFinalSelectedideas.scss';
// import Layout from '../../Pages/Layout';
import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import ViewDetail from './ViewFinalDetail';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { KEY, URL } from '../../../../constants/defaultValues';
import { Button } from '../../../../stories/Button';
import Select from '../Pages/Select';
import { Col, Container, Row } from 'reactstrap';
import { useSelector } from 'react-redux';
import Swal from "sweetalert2/dist/sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import logout from "../../../../assets/img/logout.png";
import { useDispatch } from 'react-redux';
import { getCurrentUser, getNormalHeaders } from '../../../../helpers/Utils';
import { Spinner } from 'react-bootstrap';
import jsPDF from 'jspdf';
import { FaDownload, FaHourglassHalf } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import TableDetailPdf from './TableDetailPdf';
import { useReactToPrint } from 'react-to-print';
import DetailToDownload from './DetailToDownload.jsx';
import { encryptGlobal } from '../../../../constants/encryptDecrypt.js';
import { stateList, districtList } from "../../../../RegPage/ORGData.js";
import { themesList } from "../../../../Team/IdeaSubmission/themesData.js";
const ViewSelectedIdea = () => {
    const { search } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = getCurrentUser('current_user');
    const title = new URLSearchParams(search).get('title');
    const level = new URLSearchParams(search).get('level');
    const [isDetail, setIsDetail] = React.useState(false);
    const [ideaDetails, setIdeaDetails] = React.useState({});
    const [tableData, settableData] = React.useState({});
    const [district, setdistrict] = React.useState('');
    const [state, setState] = useState('');
    const [selectstate, setSelectState] = React.useState("");

    const [sdg, setsdg] = React.useState('');
    const [currentRow, setCurrentRow] = React.useState(1);
    const [tablePage, setTablePage] = React.useState(1);
    const [showspin, setshowspin] = React.useState(false);
    const newThemesList = ["All Themes", ...themesList];
    const newstateList = ["All States", ...stateList];
    const fullStatesNames = newstateList;

 const allDistricts = {
      "All Districts": [...Object.values(districtList).flat()],
      ...districtList,
    };
    // const fiterDistData = selectstate === "All States" 
    // ? []  
    // : ["All Districts", ...(allDistricts[selectstate] || [])];
    const fiterDistData = [...districtList["Telangana"]];
        fiterDistData.unshift("All Districts");
    useEffect(() => {
        // if (selectstate === "All States") {
            setdistrict('');
      console.log(state,"state");

        //   }
    }, [selectstate]);
    

    const handlePromotelFinalEvaluated = async (item) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-submit",
              cancelButton: "btn btn-cancel",
            },
            buttonsStyling: false,
            allowOutsideClick: false,
          });
      
          swalWithBootstrapButtons
            .fire({
              title: "<h4>Are you sure?</h4>",
              text: "You are Promoting the Idea",
              imageUrl: `${logout}`,
              confirmButtonText: "Confirm",
              showCancelButton: true,
              cancelButtonText: "Cancel",
              reverseButtons: false,
            })
            .then(async (result) => {
              if (result.isConfirmed) {
                if (result.isConfirmed) {
        await promoteapi(item.challenge_response_id);

      
                }
              }
            });
    };

    async function promoteapi(id) {
        const body = JSON.stringify({ final_result: '1' });
        const promPram = encryptGlobal(JSON.stringify(id));
        var config = {
            method: 'put',
            url: `${
                process.env.REACT_APP_API_BASE_URL_FOR_REPORTS  +
                '/challenge_response/updateEntry/' +
                promPram
            }`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            },
            data: body
        };
        await axios(config)
            .then(async function (response) {
                if (response.status === 200) {
                    await handleclickcall();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const handleclickcall = async () => {
        setshowspin(true);
        await handleideaList();
    };

    async function handleideaList() {
        settableData({});
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const apiParam = encryptGlobal(
            JSON.stringify({
                key: title == '0' ? '0' : '1',
                // state : selectstate !== 'All States' ? selectstate : '',
                district: district !== "All Districts" ? district :"",
                theme : sdg !== 'All Themes' ? sdg : ''
            })
        );
        await axios
            .get(`${URL.getFinalEvaluation}?Data=${apiParam}`, axiosConfig)
            .then(function (response) {
                if (response.status === 200) {
                    const updatedWithKey =
                        response.data &&
                        response.data.data.map((item, i) => {
                            const upd = { ...item };
                            upd['key'] = i + 1;
                            return upd;
                        });
                    settableData(updatedWithKey);
                    setshowspin(false);
                }
            })
            .catch(function (error) {
                console.log(error);
                setshowspin(false);
            });
    }
    // console.log(tableData, 'data');
    const evaluatedIdeafinal = {
        data: tableData && tableData.length > 0 ? tableData : [],
        columns: [
            {
                name: 'No',
                selector: (row) => row.key,
                cellExport: (row) => row.key,
                sortable: true,
                width: '6rem'
            },
            // {
            //     name: 'State',
            //     cellExport: (row) => row.state,
            //     cell: (row) => (
            //         <div
            //             style={{
            //                 whiteSpace: 'pre-wrap',
            //                 wordWrap: 'break-word'
            //             }}
            //         >
            //             {row.state}
            //         </div>
            //     ),
            //     width: '10rem'
            // },
            {
                name: 'District',
                selector: (row) => row.district,
                width: '8rem'
            },
            {
                name: "College Type",
                selector: (row) => row.college_type,
                width: "10rem",
              },
              {
                name: "College Name",
                selector: (row) => row.college_name,
                width: "10rem",
              },
              {
                name: "CID",
                selector: (row) => row.challenge_response_id,
                width: "5rem",
              },
            // {
            //     name: 'Category',
            //     selector: (row) => row.category,
            //     width: '8rem'
            // },
            {
                name: 'Theme',
                cellExport: (row) => row.theme,
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                    >
                        {row.theme}
                    </div>
                ),
                width: '10rem'
            },
            // {
            //     name: 'Problem Statement',
            //     cellExport: (row) => row.sub_category,
            //     cell: (row) => (
            //         <div
            //             style={{
            //                 whiteSpace: 'pre-wrap',
            //                 wordWrap: 'break-word'
            //             }}
            //         >
            //             {row.sub_category}
            //         </div>
            //     ),
            //     width: '25rem'
            // },
            {
                name: 'Idea Name',
                cell: (row) => (
                    <div
                        style={{
                            // whiteSpace: 'pre-wrap',
                            // wordWrap: 'break-word'
                            whiteSpace: 'nowrap',       
                            overflow: 'hidden',         
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {row?.title}
                    </div>
                ),
                width: '11rem'
            },
            // {
            //     name: 'District',
            //     selector: (row) => row.district,
            //     width: '15rem'
            // },
            // {
            //     name: 'Team Name',
            //     selector: (row) => row?.team_name || '',
            //     sortable: true
            // },
            // {
            //     name: 'SDG',
            //     selector: (row) => row?.sdg,
            //     width: '10%'
            // },

            {
                name: 'Novelty',
                cellExport: (row) =>
                    row.evaluator_ratings
                        ? row.evaluator_ratings.length > 0
                            ? row.evaluator_ratings[0].param_1_avg
                            : ' '
                        : ' ',
                selector: (row) => {
                    return [
                        row.evaluator_ratings
                            ? row.evaluator_ratings.length > 0
                                ? row.evaluator_ratings[0].param_1_avg
                                : ' '
                            : ' '
                    ];
                },

                sortable: true,
                width: '10rem'
            },
            {
                name: 'Usefulness',
                cellExport: (row) => row.sub_category,
                selector: (row) => {
                    return [
                        row.evaluator_ratings
                            ? row.evaluator_ratings.length > 0
                                ? row.evaluator_ratings[0].param_2_avg
                                : ' '
                            : ' '
                    ];
                },

                sortable: true,
                width: '10rem'
            },
            {
                name: 'Feasability',
                cellExport: (row) =>
                    row.evaluator_ratings
                        ? row.evaluator_ratings.length > 0
                            ? row.evaluator_ratings[0].param_3_avg
                            : ' '
                        : ' ',
                selector: (row) => {
                    return [
                        row.evaluator_ratings
                            ? row.evaluator_ratings.length > 0
                                ? row.evaluator_ratings[0].param_3_avg
                                : ' '
                            : ' '
                    ];
                },

                sortable: true,
                width: '10rem'
            },
            {
                name: 'Scalability',
                cellExport: (row) =>
                    row.evaluator_ratings
                        ? row.evaluator_ratings.length > 0
                            ? row.evaluator_ratings[0].param_4_avg
                            : ' '
                        : ' ',
                selector: (row) => {
                    return [
                        row.evaluator_ratings
                            ? row.evaluator_ratings.length > 0
                                ? row.evaluator_ratings[0].param_4_avg
                                : ' '
                            : ' '
                    ];
                },

                sortable: true,
                width: '10rem'
            },
            {
                name: 'Sustainability',
                cellExport: (row) =>
                    row.evaluator_ratings
                        ? row.evaluator_ratings.length > 0
                            ? row.evaluator_ratings[0].param_5_avg
                            : ' '
                        : ' ',
                selector: (row) => {
                    return [
                        row.evaluator_ratings
                            ? row.evaluator_ratings.length > 0
                                ? row.evaluator_ratings[0].param_5_avg
                                : ' '
                            : ' '
                    ];
                },

                sortable: true,
                width: '11rem'
            },
            {
                name: 'Overall',
                cellExport: (row) =>
                    row.evaluator_ratings
                        ? row.evaluator_ratings.length > 0
                            ? row.evaluator_ratings[0].overall_avg
                            : ' '
                        : ' ',
                selector: (row) => {
                    return [
                        row.evaluator_ratings
                            ? row.evaluator_ratings.length > 0
                                ? row.evaluator_ratings[0].overall_avg
                                : ' '
                            : ' '
                    ];
                },

                sortable: true,
                width: '9rem'
            },

            {
                name: 'Actions',
                cellExport: (row) => '',
                cell: (params) => {
                    return [
                        <div className="d-flex" key={params}>
                            <div
                                className="btn btn-primary mr-5 mx-2"
                                onClick={() => {
                                    console.warn(params);
                                    setIdeaDetails(params);
                                    setIsDetail(true);
                                    let index = 0;
                                    tableData?.forEach((item, i) => {
                                        if (
                                            item?.challenge_response_id ==
                                            params?.challenge_response_id
                                        ) {
                                            index = i;
                                        }
                                    });
                                    setCurrentRow(index + 1);
                                }}
                            >
                                View
                            </div>
                            <div className="mx-2 pointer d-flex align-items-center">
                               
                                {/* <FaDownload
                                    size={22}
                                    onClick={() => {
                                        handleDownpdf(params);
                                    }}
                                /> */}
                            </div>
                            {params.final_result === '0' && (
                                <div
                                    onClick={() =>
                                        handlePromotelFinalEvaluated(params)
                                    }
                                    style={{ marginRight: '12px' }}
                                >
                                    <div className="btn btn-info">
                                        Promote
                                    </div>
                                </div>
                            )}
                        </div>
                    ];
                },
                width: '15rem',
                left: true
            }
            //       {params.final_result === '0' ?
            //       (
            //     {
            //         name: 'Final Evaluation',
            //         cell: (params) => {
            //             return [
            //                 <div className="d-flex" key={params}>
            //                     {params.final_result === '0' && (
            //                         <div
            //                             onClick={() =>
            //                                 handlePromotelFinalEvaluated(params)
            //                             }
            //                             style={{ marginRight: '12px' }}
            //                         >
            //                             <div className="btn btn-info btn-lg mx-2">
            //                                 Promote
            //                             </div>
            //                         </div>
            //                     )}
            //                 </div>
            //             ];
            //         },
            //         width: '15%',
            //         left: true
            //     } )
            // : ""}
        ]
    };
    const [sortid, setsortid] = useState();
    const handlesortid = (e) => {
        setsortid(e.id);
    };

    const showbutton = district && sdg;

    const handleNext = () => {
        if (tableData && currentRow < tableData?.length) {
            setIdeaDetails(tableData[currentRow]);
            setIsDetail(true);
            setCurrentRow(currentRow + 1);
        }
    };
    const handlePrev = () => {
        if (tableData && currentRow >= 1) {
            setIdeaDetails(tableData[currentRow - 2]);
            setIsDetail(true);
            setCurrentRow(currentRow - 1);
        }
    };

    const [pdfLoader, setPdfLoader] = React.useState(false);
    const [teamResponse, setTeamResponse] = React.useState([]);
    const [details, setDetails] = React.useState();
   

    ////////////////pdf////////////////
    const componentRef = useRef();
    const [pdfIdeaDetails, setPdfIdeaDetails] = useState('');
    const [pdfTeamResponse, setpdfTeamResponse] = useState('');
    const handleDownpdf = (params) => {
        console.log(params,"222");
        setPdfIdeaDetails(params);
        setpdfTeamResponse(params);
       
    };
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `${
            pdfIdeaDetails?.team_name ? pdfIdeaDetails?.team_name : 'temp'
        }_IdeaSubmission`
    });
    useEffect(() => {
        if (pdfIdeaDetails !== '' && pdfTeamResponse !== '') {
            handlePrint();
        }
    }, [pdfIdeaDetails, pdfTeamResponse]);

    /////////////////
    const customStyles = {
        rows: {
          style: {
            fontSize: "13px",
          },
        },
        headCells: {
          style: {
            fontSize: "14px",
          },
        },
        cells: {
          style: {
            fontSize: "13px",
          },
        },
      };
    return (
        <>
          <div className="page-wrapper">
          <div className="content">
            {/* <div style={{ display: 'none' }}>
                <DetailToDownload
                    ref={componentRef}
                    ideaDetails={pdfIdeaDetails}
                    teamResponse={pdfTeamResponse}
                    level={'Draft'}
                />
            </div> */}

            {/* <Layout> */}
                <div className="container evaluated_idea_wrapper pt-2">
                    {/* <div id="pdfIdd" style={{ display: 'none' }}>
                    <TableDetailPdf
                        ideaDetails={details}
                        teamResponse={teamResponse}
                        level={level}
                    />
                </div> */}
                    <div className="row">
                        <div className="col-12 p-0">
                            {!isDetail && (
                                <div>
                                    <h4 className="ps-2 pb-1">
                                        {title == '0'
                                            ? 'L3 Promoted'
                                            : 'Final Winners'}{' '}
                                        Challenges
                                    </h4>

                                    <Container fluid className="px-0">
                                        <Row className="align-items-center">
                                            {/* <Col md={2}>
                                                <div className="my-3 d-md-block d-flex justify-content-center">
                                                <Select
                    list={fullStatesNames}
                    setValue={setSelectState}
                    placeHolder={"Select State"}
                    value={selectstate}
                  />
                                                </div>
                                            </Col> */}
                                            <Col md={2}>
                <div className="my-2 d-md-block d-flex justify-content-center">
                  <Select
                    list={fiterDistData}
                    
                    setValue={setdistrict}
                    placeHolder={"Select District"}
                    value={district}
                  />
                </div>
              </Col>
                                            <Col md={2}>
                                                <div className="my-3 d-md-block d-flex justify-content-center">
                                                <Select
                    list={newThemesList}
                    setValue={setsdg}
                    placeHolder={"Select Theme"}
                    value={sdg}
                  />
                                                </div>
                                            </Col>
                                            <Col md={2}>
                                                <div className="text-center">
                                                    <Button
                                                        btnClass={
                                                            showbutton
                                                                ? 'primary'
                                                                : 'default'
                                                        }
                                                        size="small"
                                                        label="Search"
                                                        disabled={!showbutton}
                                                        onClick={() =>
                                                            handleclickcall()
                                                        }
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={2}>
                                                <div className="text-right">
                                                    <Button
                                                        btnClass="primary"
                                                        size="small"
                                                        label="Back"
                                                        onClick={() => navigate(-1)}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Container>
                                </div>
                            )}
                            {showspin && (
                                <div className="text-center mt-5">
                                    <Spinner
                                        animation="border"
                                        variant="secondary"
                                    />
                                </div>
                            )}
                            {!showspin &&
                                (!isDetail ? (
                                    <div className="bg-white border card pt-3 mt-5">
                                        <DataTableExtensions
                                            print={false}
                                            export={false}
                                            {...evaluatedIdeafinal}
                                        >
                                            <DataTable
                                                data={tableData || []}
                                                defaultSortFieldId={sortid}
                                                defaultSortAsc={false}
                                                pagination
                                                highlightOnHover
                                                fixedHeader
                          customStyles={customStyles}

                                                subHeaderAlign={
                                                    Alignment.Center
                                                }
                                                paginationRowsPerPageOptions={[
                                                    10, 25, 50, 100
                                                ]}
                                                paginationPerPage={10}
                                                onChangePage={(page) =>
                                                    setTablePage(page)
                                                }
                                                paginationDefaultPage={
                                                    tablePage
                                                }
                                                onSort={(e) => handlesortid(e)}
                                            />
                                        </DataTableExtensions>
                                    </div>
                                ) : (
                                    <ViewDetail
                                        ideaDetails={ideaDetails}
                                        setIsDetail={setIsDetail}
                                        handleNext={handleNext}
                                        handlePrev={handlePrev}
                                        currentRow={currentRow}
                                        dataLength={
                                            tableData && tableData?.length
                                        }
                                    />
                                ))}
                        </div>
                    </div>
                </div>
            {/* </Layout> */}
            </div></div>
        </>
    );
};

export default ViewSelectedIdea;
