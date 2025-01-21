/* eslint-disable no-unused-vars */
/* eslint-disable indent */

import React, { useEffect } from 'react';
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
// import { getDistrictData } from '../../redux/studentRegistration/actions';
import { ReasonsOptions,reasondata2 } from '../Admin/Pages/ReasonForRejectionData';
// import { cardData } from '../../Student/Pages/Ideas/SDGData';
import { Button } from '../../stories/Button';
import { getCurrentUser } from '../../helpers/Utils';
import Spinner from 'react-bootstrap/Spinner';
import { stateList, districtList } from "../../RegPage/ORGData";
import { themesList } from "../../Team/IdeaSubmission/themesData";
import { theme } from 'antd';
const EvaluatedIdea = () => {
    // here we can see all the EvaluatedIdeas in  status wise , district wise , SDG wise   //
    const dispatch = useDispatch();
    const [showspin, setshowspin] = React.useState(false);
    const currentUser = getCurrentUser('current_user');
    const [reason, setReason] = React.useState('');
    const [selectstate, setSelectState] = React.useState("");
    const [reason2, setReason2] = React.useState('');
    const [district, setdistrict] = React.useState('');
    const [sdg, setsdg] = React.useState('');
    const [status, setstatus] = React.useState('');
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
    //   const fiterDistData = selectstate === "All States" 
    // ? []  
    // : ["All Districts", ...(allDistricts[selectstate] || [])];
     const fiterDistData = [...districtList["Telangana"]];
        fiterDistData.unshift("All Districts");
    // const fullStatesNames = fiterDistData;

    const statusdata = ['Accepted', 'Rejected', 'Both'];

    React.useEffect(() => {
        if (status && status === 'Accepted') {
            setReason('');
        }
    }, [status]);
    const [levelName, setLevelName] = React.useState('');
    const [evalSchema, setEvalSchema] = React.useState('');
    // console.log(evalSchema,"111");

    const [tabledate, settabledate] = React.useState([]);
    useEffect(() => {
        // if (selectstate === "All States") {
            setdistrict('');  // Reset the district value
        //   }
    }, [selectstate]);
    React.useEffect(() => {
        if (currentUser) {
            setLevelName(currentUser?.data[0]?.level_name);
            setEvalSchema(currentUser?.data[0]?.eval_schema);
        }
    }, [currentUser]);

    // useEffect(() => {
    //     dispatch(getDistrictData());
    // }, []);
    useEffect(() => {
        if (levelName !== '' && evalSchema !== '') {
            settabledate(evaluatedIdeaList);
        }
    }, [evaluatedIdeaList]);

    const handleclickcall = () => {
        // here we can select status , district , SDG //
        const newQuery = {
            level:'L1',
            evaluation_status: status !== 'Both'? (status === 'Accepted' ? 'SELECTEDROUND1' : 'REJECTEDROUND1'): '',
            // state: selectstate !== 'All States' ? selectstate : '',
            district: district !== 'All Districts' ? district : '',
            theme: sdg !== 'All Themes' ? sdg : '',
            rejected_reason : reason,
            rejected_reasonSecond : reason2
        };
        setshowspin(true);
        dispatch(getL1EvaluatedIdea(newQuery, setshowspin));
    };
    // const levelparam =
    //     levelName === 'L1'
    //         ? '?level=L1'
    //         : '?evaluation_status=SELECTEDROUND1&level=L2';
    // const statusparam =
    //     status && status !== 'Both'
    //         ? '&evaluation_status=' +
    //           (status === 'Accepted' ? 'SELECTEDROUND1' : 'REJECTEDROUND1')
    //         : '';
    //         const stateparam =
    //         selectstate && selectstate !== 'All States' ? '&selectstate' + selectstate : '';
    // const districtparam =
    //     district && district !== 'All Districts' ? '&district=' + district : '';
    // const sdgparam = sdg && sdg !== 'All Themes' ? '&theme=' + sdg : '';
    // const filterParams =
    //     levelparam +
    //     statusparam +
    //     stateparam+
    //     // districtparam +
    //     sdgparam +
    //     (reason && '&rejected_reason=' + reason);
    const [isDetail, setIsDetail] = React.useState(false);
    const [ideaDetails, setIdeaDetails] = React.useState([]);
    const [currentRow, setCurrentRow] = React.useState(1);
    const [tablePage, setTablePage] = React.useState(1);
// console.log(tabledate,"11");

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
                width: '8rem'
            },
            // {
            //     name: "College Type",
            //     selector: (row) => row.college_type,
            //     width: "10rem",
            //   },
            //   {
            //     name: "College Name",
            //     selector: (row) => row.college_name,
            //     width: "10rem",
            //   },
            // {
            //     name: 'Udise Code',
            //     selector: (row) => row.
            //     organization_code
            //     ,
            //     width: '9rem'
            // },
            // {
            //     name: 'Team Name',
            //     selector: (row) => row.team_name,
            //     width: '10rem'
            // },
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
                    row.evaluated_at
                        ? moment(row.evaluated_at).format('DD-MM-YY h:mm:ss a')
                        : row.evaluated_at,
                width: '8rem'
            },
            {
                name: 'Status',
                cell: (row) => {
                    return [
                        <div className="d-flex" key={row}>
                            {row.evaluation_status &&
                                row.evaluation_status == 'SELECTEDROUND1' && (
                                    <span className="text-success">
                                        Accepted
                                    </span>
                                )}
                            {row.evaluation_status == 'REJECTEDROUND1' && (
                                <span className="text-danger">Rejected</span>
                            )}
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
                width: '17rem',
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
            <div className="container evaluated_idea_wrapper pt-2 ">
                <div className="row">
                    <div className="col-12 p-0">
                        {!isDetail && (
                            <div>
                                <h4>L1 Evaluated Idea</h4>
                                <Container fluid className="px-0">
                                    <Row className="align-items-center">
                                       
                                              

                                        {/* <Col md={2}>
                                            <div className="my-3 d-md-block d-flex justify-content-center">
                                            <Select
                    list={fullStatesNames}
                    setValue={setSelectState}
                    placeHolder={"Select District"}
                    value={selectstate}
                  />
                                            </div>
                                        </Col> */}
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
                                        <Col md={status ? 1 : 2}>
                                                    <div className="my-3 d-md-block d-flex justify-content-center">
                                                        <Select
                                                            list={statusdata}
                                                            setValue={setstatus}
                                                            placeHolder={
                                                                'Select Status'
                                                            }
                                                            value={status}
                                                        />
                                                    </div>
                                                </Col>
                                        {status && status !== 'Accepted' && (
                                            <Col md={2}>
                                                <div className="my-3 d-md-block d-flex justify-content-center">
                                                    <Select
                                                        list={ReasonsOptions}
                                                        setValue={setReason}
                                                        placeHolder={
                                                            'Select Reason for rejection'
                                                        }
                                                        value={reason}
                                                    />
                                                </div>
                                            </Col>
                                        )}
                                         {status && status !== 'Accepted' && (
                                            <Col md={2}>
                                                <div className="my-3 d-md-block d-flex justify-content-center">
                                                    <Select
                                                        list={reasondata2}
                                                        setValue={setReason2}
                                                        placeHolder={
                                                            'Select Reason for rejection 2'
                                                        }
                                                        value={reason2}
                                                    />
                                                </div>
                                            </Col>
                                        )}
                                        <Col md={1}>
                                            <div className="text-center">
                                                <Button
                                                    // btnClass={
                                                    //     evalSchema &&
                                                    //     evalSchema?.toLowerCase() ==
                                                    //         'accept_reject'
                                                    //         ? status &&
                                                    //         //   district &&
                                                    //           sdg
                                                    //             ? 'primary'
                                                    //             : 'default'
                                                    //         : sdg
                                                    //         ? 'primary'
                                                    //         : 'default'
                                                    // }
                                                    btnClass={
                                                        status && district && sdg
                                                            ? 'primary'
                                                            : 'default'
                                                    }
                                                    size="small"
                                                    label="Search"
                                                    // disabled={
                                                    //     !(evalSchema &&
                                                    //     evalSchema?.toLowerCase() ==
                                                    //         'accept_reject'
                                                    //         ? status &&
                                                    //         //   district &&
                                                    //           sdg
                                                    //         : sdg)
                                                    // }
                                                    disabled={
                                                        !(
                                                            status &&
                                                            district &&
                                                            sdg
                                                        )
                                                    }
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
                                     levelName="L1"
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
