/* eslint-disable no-unused-vars */
/* eslint-disable indent */

import React, { useEffect, useState } from 'react';
import './EvaluatedIdea.scss';
// import Layout from '../Layout';
import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getL1EvaluatedIdea } from '../store/evaluator/action';
import EvaluatedIdeaDetail from './EvaluatedIdeaDetail';
import { Container, Row, Col } from 'reactstrap';
import Select from '../Helper/Select';
import {
    getDistrictData,
    getStateData
} from '../../redux/studentRegistration/actions';
// import { cardData } from '../../Student/Pages/Ideas/SDGData';
import { Button } from '../../stories/Button';
import Spinner from 'react-bootstrap/Spinner';
import { stateList, districtList } from "../../RegPage/ORGData";
import { themesList } from "../../Team/IdeaSubmission/themesData";
const EvaluatedIdea = () => {
    // here we can see all the EvaluatedIdeas in  status wise , district wise , SDG wise   //
    const dispatch = useDispatch();
    const [showspin, setshowspin] = React.useState(false);
    const [district, setdistrict] = React.useState('');
    const [state, setState] = useState('');
    const [selectstate, setSelectState] = React.useState("");

    const [sdg, setsdg] = React.useState('');
    const evaluatedIdeaList = useSelector(
        (state) => state?.evaluator.evaluatedIdeaL1
    );

    const newThemesList = ["All Themes", ...themesList];
    const newstateList = ["All States", ...stateList];
    const allDistricts = {
        "All Districts": [...Object.values(districtList).flat()],
        ...districtList,
      };
      // const fiterDistData = ["All Districts", ...(allDistricts[selectstate] || [])];
      const fiterDistData = selectstate === "All States" 
    ? []  
    : ["All Districts", ...(allDistricts[selectstate] || [])];
    const fullStatesNames = newstateList;

    // const SDGDate = cardData.map((i) => {
    //     return i.goal_title;
    // });
    // SDGDate.unshift('All Themes');
    // const fullStatesNames = useSelector(
    //     (state) => state?.studentRegistration?.regstate
    // );
    // const fullDistrictsNames = useSelector(
    //     (state) => state?.studentRegistration?.dists
    // );

    const [tabledate, settabledate] = React.useState([]);
 useEffect(() => {
        // if (selectstate === "All States") {
            setdistrict('');  // Reset the district value
        //   }
    }, [selectstate]);
   
    useEffect(() => {
        if (selectstate === '') {
            settabledate([]);
        } else {
            settabledate(evaluatedIdeaList);
        }
    }, [evaluatedIdeaList]);

    const handleclickcall = () => {
        // here we can select status , district , SDG //
        const newQuery = {
            evaluation_status : 'SELECTEDROUND1',
            level:'L2',
            state: selectstate !== 'All States' ? selectstate : '',
            district: district !== 'All Districts' ? district : '',

            theme: sdg !== 'All Themes' ? sdg : '',
        };
        setshowspin(true);
        dispatch(getL1EvaluatedIdea(newQuery, setshowspin));
    };
    // const levelparam = '?evaluation_status=SELECTEDROUND1&level=L2';
    // const districtparam =
    //     state && state !== 'All States' ? '&state=' + state : '';
    // const sdgparam = sdg && sdg !== 'All Themes' ? '&sdg=' + sdg : '';
    // const filterParams = levelparam + districtparam + sdgparam;
    const [isDetail, setIsDetail] = React.useState(false);
    const [ideaDetails, setIdeaDetails] = React.useState([]);
    const [currentRow, setCurrentRow] = React.useState(1);
    const [tablePage, setTablePage] = React.useState(1);

    const evaluatedIdea = {
        data: tabledate || [],
        columns: [
            {
                name: 'No',
                cell: (params, index) => {
                    return [
                        <div className="ms-3" key={params}>
                            {index + 1}
                        </div>
                    ];
                },
                sortable: true,
                width: '6rem'
            },
            // {
            //     name: 'State',
            //     selector: (row) => row.state,
            //     width: '10rem'
            // },
            {
                name: 'District',
                selector: (row) => row.district,
                width: '10rem'
            },
            // {
            //     name: 'Udise Code',
            //     selector: (row) => row.
            //     organization_code
            //     ,
            //     width: '9rem'
            // },
            {
                name: 'Team Name',
                selector: (row) => row.team_name,
                width: '10rem'
            },
            {
                name: 'CID',
                selector: (row) => row.challenge_response_id,
                width: '5rem'
            },
            {
                name: 'Theme',
                cell: (row) => (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                    >
                        {row?.theme}
                    </div>
                ),
                width: '11rem'
            },

            // {
            //     name: 'Problem Statement',
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
                width: '15rem'
            },

            {
                name: 'Submitted By',
                selector: (row) => row.initiated_name,
                width: '8rem'
            },
            {
                name: 'Evaluated At',
                selector: (row) =>
                    row?.evaluator_ratings[0]?.created_at
                        ? moment(row?.evaluator_ratings[0]?.created_at).format(
                              'DD-MM-YY h:mm:ss a'
                          )
                        : row?.evaluator_ratings[0]?.created_at,
                width: '10rem'
            },
            {
                name: 'Overall',

                cell: (row) => {
                    return [
                        <div className="d-flex" key={row}>
                            <span>{row?.evaluator_ratings[0]?.overall}</span>
                        </div>
                    ];
                },
                width: '8rem'
            },
            {
                name: 'Actions',
                cell: (params) => {
                    return [
                        <div className="d-flex" key={params}>
                            <div
                                className="btn btn-primary mr-5 mx-2"
                                onClick={() => {
                                    setIdeaDetails(params);
                                    setIsDetail(true);
                                    let index = 0;
                                    evaluatedIdeaList?.forEach((item, i) => {
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
                                View Idea Details
                            </div>
                        </div>
                    ];
                },
                width: '13rem',
                left: true
            }
        ]
    };

    const handleNext = () => {
        // here we go for next page //
        if (evaluatedIdeaList && currentRow < evaluatedIdeaList?.length) {
            setIdeaDetails(evaluatedIdeaList[currentRow]);
            setIsDetail(true);
            setCurrentRow(currentRow + 1);
        }
    };
    const handlePrev = () => {
        // here we can go for previous page //
        if (evaluatedIdeaList && currentRow >= 1) {
            setIdeaDetails(evaluatedIdeaList[currentRow - 2]);
            setIsDetail(true);
            setCurrentRow(currentRow - 1);
        }
    };
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
        <div className="page-wrapper">
         <div className="content">
            <div className="container evaluated_idea_wrapper pt-2">
                <div className="row">
                    <div className="col-12 p-0">
                        {!isDetail && (
                            <div>
                                <h4 >L2 Evaluated Idea</h4>
                                <Container fluid className="px-0">
                                    <Row className="align-items-center">
                                        <Col md={2}>
                                            <div className="my-3 d-md-block d-flex justify-content-center">
                                                <Select
                                                    list={fullStatesNames}
                                                    setValue={setSelectState}
                                                    placeHolder={'Select State'}
                                                    value={selectstate}
                                                />
                                            </div>
                                        </Col>
                                        <Col md={2}>
                                            <div className="my-3 d-md-block d-flex justify-content-center">
                                            <Select
                    list={fiterDistData}
                    
                    setValue={setdistrict}
                    placeHolder={"Select District"}
                    value={district}
                  />
                                            </div>
                                        </Col>
                                        <Col md={3}>
                                            <div className="my-3 d-md-block d-flex justify-content-center">
                                            <Select
                    list={newThemesList}
                    setValue={setsdg}
                    placeHolder={"Select Theme"}
                    value={sdg}
                  />
                                            </div>
                                        </Col>

                                        <Col md={1}>
                                            <div className="text-center">
                                                <Button
                                                    btnClass={
                                                        selectstate && sdg
                                                            ? 'primary'
                                                            : 'default'
                                                    }
                                                    size="small"
                                                    label="Search"
                                                    disabled={!(selectstate && sdg)}
                                                    onClick={() =>
                                                        handleclickcall()
                                                    }
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
                                        {...evaluatedIdea}
                                    >
                                        <DataTable
                                            data={evaluatedIdeaList || []}
                                            defaultSortField="id"
                                            defaultSortAsc={false}
                          customStyles={customStyles}

                                            pagination
                                            highlightOnHover
                                            fixedHeader
                                            subHeaderAlign={Alignment.Center}
                                            paginationRowsPerPageOptions={[
                                                10, 25, 50, 100
                                            ]}
                                            paginationPerPage={10}
                                            onChangePage={(page) =>
                                                setTablePage(page)
                                            }
                                            paginationDefaultPage={tablePage}
                                        />
                                    </DataTableExtensions>
                                </div>
                            ) : (
                                <EvaluatedIdeaDetail
                                    ideaDetails={ideaDetails}
                                    setIsDetail={setIsDetail}
                                    handleNext={handleNext}
                                    handlePrev={handlePrev}
                                    currentRow={currentRow}
                                    dataLength={
                                        evaluatedIdeaList &&
                                        evaluatedIdeaList?.length
                                    }
                                    levelName="L2"
                                />
                            ))}
                    </div>
                </div>
            </div>
        </div>
        </div>

    );
};
export default EvaluatedIdea;
