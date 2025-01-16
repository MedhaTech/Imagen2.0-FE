/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect, useRef, useState } from "react";
import "./ViewSelectedideas.scss";
// import Layout from '../../Pages/Layout';
import DataTable, { Alignment } from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import moment from "moment";
import ViewDetail from "./ViewDetail.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { KEY, URL } from "../../../../constants/defaultValues.js";
import { Button } from "../../../../stories/Button.jsx";
import Select from "../Pages/Select.jsx";
import { Col, Container, Row } from "reactstrap";
// import { cardData } from '../../../../Student/Pages/Ideas/SDGData.js';
import { useSelector } from "react-redux";
// import {
//     getDistrictData,
//     getStateData
// } from '../../../../redux/studentRegistration/actions';
import { useDispatch } from "react-redux";
import {
  ReasonsOptions,
  reasondata2,
} from "../../Pages/ReasonForRejectionData.js";
import { getCurrentUser, getNormalHeaders } from "../../../../helpers/Utils.js";
import { getAdminEvalutorsList } from "../../../../Admin/store/adminEvalutors/actions.js";
import { getAdminList } from "../../../../Admin/store/admin/actions.js";
import { Spinner } from "react-bootstrap";
import jsPDF from "jspdf";
import Swal from "sweetalert2/dist/sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import logout from "../../../../assets/img/logout.png";
import { FaDownload, FaHourglassHalf } from "react-icons/fa";
import html2canvas from "html2canvas";
import TableDetailPdf from "./TableDetailPdf.jsx";
import { useReactToPrint } from "react-to-print";
import DetailToDownload from "./DetailToDownload.jsx";
import { encryptGlobal } from "../../../../constants/encryptDecrypt.js";
import { stateList, districtList } from "../../../../RegPage/ORGData.js";
import { themesList } from "../../../../Team/IdeaSubmission/themesData.js";
const ViewSelectedideasNew = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = getCurrentUser("current_user");
  const title = new URLSearchParams(search).get("title");
  const level = new URLSearchParams(search).get("level");
  const evaluation_status = new URLSearchParams(search).get(
    "evaluation_status"
  );
  const [isDetail, setIsDetail] = React.useState(false);
  const [ideaDetails, setIdeaDetails] = React.useState({});
  const [tableData, settableData] = React.useState({});
  const [reason, setReason] = React.useState("");
  const [reasonSec, setReasonSec] = React.useState("");

  const [district, setdistrict] = React.useState("");
  const [selectstate, setSelectState] = React.useState("");
  const [sdg, setsdg] = React.useState("");

  const [evalname, setevalname] = React.useState("");
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
  // const fiterDistData =
  //   selectstate === "All States"
  //     ? []
  //     : ["All Districts", ...(allDistricts[selectstate] || [])];
      const fiterDistData = [...districtList["Telangana"]];
          fiterDistData.unshift("All Districts");
  // useEffect(() => {
  //     setdistrict(""); 
  //     console.log(selectstate,"state");
  // }, [selectstate]);
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

  const evallist = useSelector((state) => state?.adminEvalutors?.evalutorsList);
  const adminlist = useSelector((state) => state?.admin?.adminList);
  const Allevalobj = {};

  const Allevalnamelist = evallist.map((i) => {
    Allevalobj[i.user.full_name] = i.user.user_id;
    return i.user.full_name;
  });
  adminlist?.map((i) => {
    Allevalobj[i.user.full_name] = i.user.user_id;
    Allevalnamelist.push(i.user.full_name);
  });
  const newQuery = {
    level: level,
    // state: selectstate !== "All States" ? selectstate : "",
    district: district !== "All Districts" ? district : "",

    theme: sdg !== "All Themes" ? sdg : "",
    rejected_reason: reason,
    rejected_reasonSecond: reasonSec,
    evaluator_id: Allevalobj[evalname],
  };
  useEffect(() => {
    // dispatch(getDistrictData());
    // dispatch(getStateData());
    dispatch(getAdminEvalutorsList());
    dispatch(getAdminList());
  }, []);

  // const handlePromotel2processed = async (item) => {
  //   await promoteapi(item.challenge_response_id);
  // };
  const handlePromotel2processed = async (item) => {
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
    const promoteId = encryptGlobal(JSON.stringify(id));
    const body = JSON.stringify({ final_result: "0" });
    var config = {
      method: "put",
      url: `${
        process.env.REACT_APP_API_BASE_URL +
        "/challenge_response/updateEntry/" +
        promoteId
      }`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
      data: body,
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
    level === "L1" && title !== "L1 - Yet to Processed"
      ? (newQuery["evaluation_status"] = evaluation_status)
      : level === "L1" && title === "L1 - Yet to Processed"
      ? (newQuery["yetToProcessList"] = "L1")
      : title === "L2 - Yet to Processed"
      ? (newQuery["yetToProcessList"] = "L2")
      : "";
    const data = encryptGlobal(
      JSON.stringify({
        district: selectstate !== "All Districts" ? district : "",
        theme: sdg !== "All Themes" ? sdg : "",
      })
    );
    const datas = encryptGlobal(JSON.stringify(newQuery));
    settableData({});
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    await axios
      .get(
        title === "Final"
          ? `${URL.getidealistfinal}${data}`
          : `${URL.getidealist}Data=${datas}`,
        axiosConfig
      )
      .then(function (response) {
        if (response.status === 200) {
          console.log(response, "res");
          // const val1 =
          //     response?.data?.data[0]?.dataValues[0]
          //         ?.evaluator_ratings[0]?.param_1;
          // const sum = val1.reduce((acc, value) => acc + value, 0);
          // const average = sum / val1.length;

          // console.log('Average:', average);

          const updatedWithKey =
            // response.data &&
            // response.data.data[0] &&
            response?.data?.data[0]?.dataValues.map((item, i) => {
              const upd = { ...item };
              upd["key"] = i + 1;
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

  const evaluatedIdea = {
    data: tableData && tableData.length > 0 ? tableData : [],
    columns: [
      {
        name: "No",
        selector: (row) => row.key,
        cellExport: (row) => row.key,
        sortable: true,
        width: "6rem",
      },

      // {
      //   name: "State",
      //   cellExport: (row) => row.state,
      //   cell: (row) => (
      //     <div
      //       style={{
      //         whiteSpace: "pre-wrap",
      //         wordWrap: "break-word",
      //       }}
      //     >
      //       {row.state}
      //     </div>
      //   ),
      //   width: "9rem",
      // },
      {
        name: "District",
        selector: (row) => row.district,
        width: "8rem",
      },
      {
        name: "Udise Code",
        selector: (row) => row.organization_code,
        cellExport: (row) => row.organization_code,
        width: "9rem",
      },
      {
        name: "Team Name",
        selector: (row) => row.team_name,
        cellExport: (row) => row.team_name,
        width: "10rem",
      },
      {
        name: "CID",
        selector: (row) => row.challenge_response_id,
        cellExport: (row) => row.challenge_response_id,
        width: "5rem",
      },
      {
        name: "Category",
        selector: (row) => row.category,
        width: "8rem",
      },
      {
        name: "Theme",
        cellExport: (row) => row.theme,
        cell: (row) => (
          <div
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {row.theme}
          </div>
        ),
        width: "10rem",
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
        width: '15rem'
    },

      // {
      //     name: 'District',
      //     selector: (row) => row.district,
      //     width: '15rem'
      // },
      // {
      //     name: 'SDG',
      //     selector: (row) => row.sdg,
      //     width: '15%'
      // },
      // {
      //     name: 'Submitted By',
      //     selector: (row) => row.initiated_name,
      //     width: '15%'
      // },
      // {
      //     name: 'Evaluated By',
      //     cell: (row) => {
      //         return [row.evaluated_name ? row.evaluated_name : ''];
      //     },
      //     width: '15%'
      // },
      // {
      //     name: 'Evaluated At',
      //     selector: (row) =>
      //         row.evaluated_at
      //             ? moment(row.evaluated_at).format('DD-MM-YY h:mm:ss a')
      //             : row.evaluated_at,
      //     width: '15%'
      // },

      {
        name: "Status",
        cellExport: (row) => row.status,
        cell: (row) => {
          return [
            <div className="d-flex" key={row}>
              {row.evaluation_status &&
                row.evaluation_status == "SELECTEDROUND1" && (
                  <span className="text-success">Accepted</span>
                )}
              {row.evaluation_status == "REJECTEDROUND1" && (
                <span className="text-danger">Rejected</span>
              )}
            </div>,
          ];
        },
        width: "10rem",
      },

      {
        name: "Actions",
        cellExport: (row) => "",
        cell: (params) => {
          return [
            <>
              <div className="d-flex" key={params}>
                <div
                  className="btn btn-primary mr-5 mx-2"
                  onClick={() => {
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
              </div>
              {/* <FaDownload
                                size={22}
                                onClick={() => {
                                    handleDownpdf(params);
                                }}
                            /> */}
            </>,
          ];
        },
        width: "10rem",
        left: true,
      },
    ],
  };
  const l1yettoprocessed = {
    data: tableData && tableData.length > 0 ? tableData : [],
    columns: [
      {
        name: "No",
        selector: (row) => row.key,
        cellExport: (row) => row.key,
        sortable: true,
        width: "6rem",
      },
      // {
      //   name: "State",
      //   cellExport: (row) => row.state,
      //   cell: (row) => (
      //     <div
      //       style={{
      //         whiteSpace: "pre-wrap",
      //         wordWrap: "break-word",
      //       }}
      //     >
      //       {row.state}
      //     </div>
      //   ),
      //   width: "10rem",
      // },
      {
        name: "District",
        selector: (row) => row.district,
        width: "10rem",
      },
      {
        name: "Udise Code",
        selector: (row) => row.organization_code,
        cellExport: (row) => row.organization_code,
        width: "9rem",
      },
      {
        name: "Team Name",
        selector: (row) => row.team_name,
        cellExport: (row) => row.team_name,
        width: "10rem",
      },

      {
        name: "CID",
        selector: (row) => row.challenge_response_id,
        cellExport: (row) => row.challenge_response_id,
        width: "5rem",
      },
      {
        name: "Category",
        selector: (row) => row.category,
        width: "8rem",
      },
      {
        name: "Theme",
        cellExport: (row) => row.theme,
        cell: (row) => (
          <div
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {row.theme}
          </div>
        ),
        width: "10rem",
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
        width: '15rem'
    },

      // {
      //     name: 'District',
      //     selector: (row) => row.district,
      //     width: '15rem'
      // },
      // {
      //     name: 'CID',
      //     selector: (row) => row.challenge_response_id,
      //     width: '10%'
      // },
      // {
      //     name: 'SDG',
      //     selector: (row) => row.sdg,
      //     width: '30%'
      // },
      // {
      //     name: 'Submitted By',
      //     selector: (row) => row.initiated_name,
      //     width: '20%'
      // },
      {
        name: "Actions",
        cellExport: (row) => "",
        cell: (params) => {
          return [
            <div className="d-flex" key={params}>
              <div
                className="btn btn-primary mr-5 mx-2"
                onClick={() => {
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
              {/* <FaDownload
                                size={22}
                                onClick={() => {
                                    handleDownpdf(params);
                                }}
                            /> */}
            </div>,
          ];
        },
        width: "10rem",
        left: true,
      },
    ],
  };

  const [pdfLoader, setPdfLoader] = React.useState(false);
  const [teamResponse, setTeamResponse] = React.useState([]);
  const [details, setDetails] = React.useState();
  const downloadPDF = async (params) => {
  };
  // console.log(tableData, 'Data');
  const evaluatedIdeaL2 = {
    data: tableData && tableData.length > 0 ? tableData : [],
    columns: [
      {
        name: "No",
        selector: (row) => row.key,
        cellExport: (row) => row.key,
        sortable: true,
        width: "6rem",
      },
      // {
      //   name: "State",
      //   cellExport: (row) => row.state,
      //   cell: (row) => (
      //     <div
      //       style={{
      //         whiteSpace: "pre-wrap",
      //         wordWrap: "break-word",
      //       }}
      //     >
      //       {row.state}
      //     </div>
      //   ),
      //   width: "10rem",
      // },
      {
        name: "District",
        selector: (row) => row.district,
        width: "10rem",
      },
      {
        name: "Udise Code",
        selector: (row) => row.organization_code,
        cellExport: (row) => row.organization_code,

        width: "9rem",
      },
      {
        name: "Team Name",
        selector: (row) => row.team_name,
        cellExport: (row) => row.team_name,

        width: "10rem",
      },
      {
        name: "CID",
        selector: (row) => row.challenge_response_id,
        cellExport: (row) => row.challenge_response_id,
        width: "5rem",
      },
      {
        name: "Category",
        selector: (row) => row.category,
        width: "8rem",
      },

      {
        name: "Theme",
        cellExport: (row) => row.theme,
        cell: (row) => (
          <div
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {row.theme}
          </div>
        ),
        width: "10rem",
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
        width: '15rem'
    },
      // {
      //     name: 'District',
      //     selector: (row) => row.district,
      //     width: '15rem'
      // },
      {
        name: "Quality Score",
        // cellExport: (row) => row?.response[1]?.selected_option || '',
        selector: (row) => {
        //   return [
        //     (
        //       ((row.evaluator_ratings[0]?.param_1[0] +
        //         row.evaluator_ratings[0]?.param_1[1] +
        //         row.evaluator_ratings[0]?.param_1[2]) /
        //         3 +
        //         (row.evaluator_ratings[0]?.param_2[0] +
        //           row.evaluator_ratings[0]?.param_2[1] +
        //           row.evaluator_ratings[0]?.param_2[2]) /
        //           3) /
        //       2
        //     ).toFixed(2),

        //   ];
        return [
            (
                ((row.evaluator_ratings[0]?.param_1[0] +
                    row.evaluator_ratings[0]?.param_1[1] 
                    // row.evaluator_ratings[0]?.param_1[2]
                ) /
                    3 +
                    (row.evaluator_ratings[0]?.param_2[0] +
                        row.evaluator_ratings[0]?.param_2[1]
                        // row.evaluator_ratings[0]?.param_2[2]
                    ) /
                        3) /
                2
            ).toFixed(2)
        ];
        },
        sortable: true,

        // row.evaluator_ratings[0]?.param_2[Number[0 + 1 + 2]],
        width: "12rem",
      },
      {
        name: "Feasibility Score",
        selector: (row) => {
          return [
            (
              ((row.evaluator_ratings[0]?.param_3[0] +
                row.evaluator_ratings[0]?.param_3[1]
                // row.evaluator_ratings[0]?.param_3[2]
            ) /
                3 +
                (row.evaluator_ratings[0]?.param_4[0] +
                  row.evaluator_ratings[0]?.param_4[1]
                //   row.evaluator_ratings[0]?.param_4[2]
                ) /
                  3 +
                (row.evaluator_ratings[0]?.param_5[0] +
                  row.evaluator_ratings[0]?.param_5[1]
                //   row.evaluator_ratings[0]?.param_5[2]
                ) /
                  3) /
              3
            ).toFixed(2),
          ];
        },
        sortable: true,

        // id: 'feasibility',
        // row.evaluator_ratings[0]?.param_2[Number[0 + 1 + 2]],
        width: "12rem",
      },
      // {
      //     name: 'CID',
      //     selector: (row) => row.challenge_response_id,
      //     width: '10%'
      // },
      // {
      //     name: 'Team Name',
      //     selector: (row) => row.team_name || '',
      //     sortable: true,
      //     width: '17%'
      // },
      // {
      //     name: 'SDG',
      //     selector: (row) => row.sdg,
      //     wi '13%'
      // },
      // {
      //     name: 'Submitted By',
      //     selector: (row) => row.initiated_name,
      //     width: '22%'
      // },
      {
        name: "Overall",

        selector: (row) =>
          row.evaluator_ratings[0]?.overall_avg
            ? row.evaluator_ratings[0]?.overall_avg
            : "-",
        width: "8rem",
        sortable: true,
        id: "overall",
      },

      {
        name: "Actions",
        cell: (params) => {
          return [
            <>
              <div className="d-flex" key={params}>
                <div
                  className="btn btn-primary"
                  onClick={() => {
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
              </div>
              <div className="mx-2 pointer d-flex align-items-center">
               
                {/* <FaDownload
                                    size={22}
                                    onClick={() => {
                                        handleDownpdf(params);
                                    }}
                                /> */}
              </div>
              {/* {!params.final_result && (
                                <div
                                    //exact="true"
                                    // key={record}
                                    onClick={() =>
                                        handlePromotel2processed(params)
                                    }
                                    style={{ marginRight: '12px' }}
                                >
                                    <div className="btn btn-info btn-lg mx-2">
                                        Promote
                                    </div>
                                </div>
                            )} */}
            </>,
          ];
        },
        width: "11rem",
        left: true,
      },
      {
        name: "L2 Evaluation",
        cell: (params) => {
          return [
            <>
              {!params.final_result && (
                <div
                  //exact="true"
                  // key={record}
                  onClick={() => handlePromotel2processed(params)}
                  style={{ marginRight: "12px" }}
                >
                  <div className="btn btn-info">Promote</div>
                </div>
              )}
            </>,
          ];
        },
        width: "11rem",
      },
    ],
  };

  const L2yettoprocessed = {
    data: tableData && tableData.length > 0 ? tableData : [],
    columns: [
      {
        name: "No",
        selector: (row) => row.key,
        cellExport: (row) => row.key,
        sortable: true,
        width: "6rem",
      },
      // {
      //   name: "State",
      //   cellExport: (row) => row.state,
      //   cell: (row) => (
      //     <div
      //       style={{
      //         whiteSpace: "pre-wrap",
      //         wordWrap: "break-word",
      //       }}
      //     >
      //       {row.state}
      //     </div>
      //   ),
      //   width: "10rem",
      // },
      {
        name: "District",
        selector: (row) => row.district,
        width: "10rem",
      },
      {
        name: "Udise Code",
        selector: (row) => row.organization_code,
        cellExport: (row) => row.organization_code,
        width: "15rem",
      },
      {
        name: "Team Name",
        selector: (row) => row.team_name,
        cellExport: (row) => row.team_name,

        width: "10rem",
      },

      {
        name: "CID",
        selector: (row) => row.challenge_response_id,
        cellExport: (row) => row.challenge_response_id,

        width: "5rem",
      },
      {
        name: "Category",
        selector: (row) => row.category,
        width: "8rem",
      },
      {
        name: "Theme",
        cellExport: (row) => row.theme,

        cell: (row) => (
          <div
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {row.theme}
          </div>
        ),
        width: "10rem",
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
        width: '15rem'
    },
      // {
      //     name: 'District',
      //     selector: (row) => row.district,
      //     width: '15%'
      // },

      // {
      //     name: 'Submitted By',
      //     selector: (row) => row.initiated_name,
      //     width: '20%'
      // },
      {
        name: "Actions",
        cellExport: (row) => "",
        cell: (params) => {
          return [
            <>
              <div className="d-flex" key={params}>
                <div
                  className="btn btn-primary"
                  onClick={() => {
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
              </div>
              <div className="mx-2 pointer d-flex align-items-center">
              
                {/* <FaDownload
                                    size={22}
                                    onClick={() => {
                                        handleDownpdf(params);
                                    }}
                                /> */}
              </div>
            </>,
          ];
        },
        width: "11rem",
        left: true,
      },
    ],
  };
  // console.log(tableData, '1');
  const [sortid, setsortid] = useState();
  const handlesortid = (e) => {
    setsortid(e.id);
  };
  const sel =
    level === "L1" && title !== "L1 - Yet to Processed"
      ? evaluatedIdea
      : level === "L1" && title === "L1 - Yet to Processed"
      ? l1yettoprocessed
      : level === "L2" && title !== "L2 - Yet to Processed"
      ? evaluatedIdeaL2
      : level === "L2" && title === "L2 - Yet to Processed"
      ? L2yettoprocessed
      : " ";
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

  ////////////////pdf////////////////
  const componentRef = useRef();
  const [pdfIdeaDetails, setPdfIdeaDetails] = useState("");
  const [pdfTeamResponse, setpdfTeamResponse] = useState("");
  const handleDownpdf = (params) => {
    console.log(params,"222");
    setPdfIdeaDetails(params);
    setpdfTeamResponse(params);
   
};
console.log("titile",title);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${
      pdfIdeaDetails?.team_name ? pdfIdeaDetails?.team_name : "temp"
    }_IdeaSubmission`,
  });
  useEffect(() => {
    if (pdfIdeaDetails !== "" && pdfTeamResponse !== "") {
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
    <div className="page-wrapper">
      <div className="content">
        {/* <div style={{ display: "none" }}>
          <DetailToDownload
                    ref={componentRef}
                    ideaDetails={pdfIdeaDetails}
                    teamResponse={pdfTeamResponse}
                    level={'Draft'}
                />
        </div> */}
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
                  <h4 className="ps-2">{title} Challenges</h4>

                  <Container fluid className="px-0">
                    <Row className="align-items-center">
                      {/* <Col md={2}>
                        <div className="d-flex justify-content-center">
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
                        <div className="d-flex justify-content-center">
                          <Select
                            list={newThemesList}
                            setValue={setsdg}
                            placeHolder={"Select Theme"}
                            value={sdg}
                          />
                        </div>
                      </Col>
                      {level === "L1" && title !== "L1 - Yet to Processed" && (
                        <Col md={2}>
                          <div className="my-3 d-md-block d-flex justify-content-center">
                            <Select
                              list={Allevalnamelist}
                              setValue={setevalname}
                              placeHolder={"Select evaluator name"}
                              value={evalname}
                            />
                          </div>
                        </Col>
                      )}

                      {title === "Rejected" ? (
                        <Col md={1}>
                          <div className="my-3 d-md-block d-flex justify-content-center">
                            <Select
                              list={ReasonsOptions}
                              setValue={setReason}
                              placeHolder={"Select Reason 1 for rejection"}
                              value={reason}
                            />
                          </div>
                        </Col>
                      ) : (
                        ""
                      )}
                      {title === "Rejected" ? (
                        <Col md={1}>
                          <div className="my-3 d-md-block d-flex justify-content-center">
                            <Select
                              list={reasondata2}
                              setValue={setReasonSec}
                              placeHolder={"Select Reason 2 for rejection"}
                              value={reasonSec}
                            />
                          </div>
                        </Col>
                      ) : (
                        ""
                      )}
                      <Col md={1}>
                        <div className="text-center">
                          <Button
                            btnClass={showbutton ? "primary" : "default"}
                            size="small"
                            label="Search"
                            disabled={!showbutton}
                            onClick={() => handleclickcall()}
                          />
                        </div>
                      </Col>
                      <Col
                        md={
                          title === "Rejected"
                            ? 1
                            : level === "L1" &&
                              title !== "L1 - Yet to Processed"
                            ? 3
                            : 4
                        }
                      >
                        <div className="text-right">
                          <Button
                            btnClass="primary"
                            size="small"
                            label="Back"
                            // onClick={() =>
                            //     navigate.goBack()
                            // }
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
                  <Spinner animation="border" variant="secondary" />
                </div>
              )}
              {!showspin &&
                (!isDetail ? (
                  <div className="bg-white border card pt-3 mt-5">
                    <DataTableExtensions print={false} export={false} {...sel}>
                      <DataTable
                        data={tableData || []}
                        defaultSortFieldId={sortid}
                        customStyles={customStyles}
                        //defaultSortField='ID'
                        defaultSortAsc={false}
                        pagination
                        highlightOnHover
                        fixedHeader
                        subHeaderAlign={Alignment.Center}
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                        paginationPerPage={10}
                        onChangePage={(page) => setTablePage(page)}
                        paginationDefaultPage={tablePage}
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
                    dataLength={tableData && tableData?.length}
                    handleclickcall={handleclickcall}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSelectedideasNew;
