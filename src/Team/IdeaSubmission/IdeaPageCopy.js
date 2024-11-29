/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import { Button } from "../../stories/Button";
// import { TextArea } from '../../../stories/TextArea/TextArea';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
// import Layout from '../../Layout';
import { useSelector } from "react-redux";
import {
  getStudentChallengeQuestions,
  getStudentChallengeSubmittedResponse,
  updateStudentBadges,
} from "../../redux/studentRegistration/actions";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "../../helpers/Utils";
import {
  getNormalHeaders,
  openNotificationWithIcon,
} from "../../helpers/Utils";
import axios from "axios";
import { KEY, URL } from "../../constants/defaultValues";
import CommonPage from "../../components/CommonPage";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import logout from "../../assets/img/logout.svg";
// import { cardData, subCategoryData } from './SDGData';
import moment from "moment";
// import { getLanguage } from "../../constants/languageOptions";

import { encryptGlobal } from "../../constants/encryptDecrypt";
import { themes, themesList, focusareasList } from "./themesData";
import { use } from "i18next";
import { initiateIdea } from "../../redux/studentRegistration/actions";
import { setIn } from "formik";
import { getLanguage } from "../../constants/languageOptions";

const LinkComponent = ({ original, item, url, removeFileHandler, i }) => {
  let a_link;
  let count;
  if (url) {
    a_link = item.split("/");
    count = a_link.length - 1;
  }
  return (
    <>
      {original ? (
        <div className="badge mb-2 bg-info ms-3">
          <span className="p-2">{item.name}</span>
          {original && (
            <span className="pointer" onClick={() => removeFileHandler(i)}>
              <AiOutlineCloseCircle size={20} />
            </span>
          )}
        </div>
      ) : (
        <a
          className="badge mb-2 bg-info p-3 ms-3"
          href={item}
          target="_blank"
          rel="noreferrer"
        >
          {a_link[count]}
        </a>
      )}
    </>
  );
};
const IdeasPageNew = ({ showChallenges, ...props }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const initialSizeData = {
    data: formData,
  };

  // dispatch(
  //     initiateIdea(
  //         currentUser?.data[0]?.team_id,
  //         language,
  //         initialSizeData,
  //         // setShowChallenges,
  //         t
  //     )
  // );
  const showPage = false;
  //   const language = useSelector(
  //     (state) => state?.studentRegistration?.studentLanguage
  // );
  const [isDisabled, setIsDisabled] = useState(false);
  const initialLoadingStatus = { draft: false, submit: false };
  const [loading, setLoading] = useState(initialLoadingStatus);
  const currentUser = getCurrentUser("current_user");

  const TeamId = currentUser?.data[0]?.student_id;

  const [currentSection, setCurrentSection] = useState(1);
  const goToNext = () => setCurrentSection(currentSection + 1);
  const goToBack = () => setCurrentSection(currentSection - 1);
  // Add on
  const [theme, setTheme] = useState(
    props?.theme !== "" && props?.theme !== undefined
      ? props?.theme
      : formData?.theme
  );
  const [others, setOthers] = useState(formData?.others);
  const [ideaDescribe, setIdeaDescribe] = useState(formData?.ideaDescribe);
  const [solve, setSolve] = useState(formData?.solve);
  const [customer, setCustomer] = useState(formData?.customer);
  const [detail, setDetail] = useState(formData?.detail);
  const [title, setTitle] = useState(formData?.title);

  const [stage, setStage] = useState(formData?.stage || []);
  const [unique, setUnique] = useState(formData?.unique || []);
  const [similar, setSimilar] = useState(formData?.similar);
  const [revenue, setRevenue] = useState(formData?.revenue);
  const [society, setSociety] = useState(formData?.society);
  const [confident, setConfident] = useState(formData?.confident || []);
  const [support, setSupport] = useState(formData?.support);

  const [files, setFiles] = useState([]);

  const [problemStatement, setProblemStatement] = useState(
    formData?.problemStatement
  );
  const [causes, setCauses] = useState(formData?.causes);
  const [community, setCommunity] = useState(formData?.community);
  const [facing, setFacing] = useState(formData?.facing);
  const [solution, setSolution] = useState(formData?.solution);
  const [stakeholders, setStakeholders] = useState(formData?.stakeholders);
  const [problemSolving, setProblemSolving] = useState(
    formData?.problemSolving || []
  );
  const [error4, seterror4] = useState(false);
  const [ideaInitiation, setIdeaInitiation] = useState("");
  const [feedback, setFeedback] = useState(formData?.feedback);
  const [prototypeImage, setPrototypeImage] = useState(
    formData.prototype_image || []
  );
  const [focus, setFocus] = useState([]);
  const [id, setId] = useState("");
  const [prototypeLink, setPrototypeLink] = useState(formData?.prototype_link);
  const [workbook, setWorkbook] = useState(formData?.workbook);

  const submit = [
    { value: "YES", label: t("ideaform_questions.workbookyes") },
    { value: "NO", label: t("ideaform_questions.workbookno") },
  ];
  const people = [
    { value: "Not confident", label: t("ideaform_questions.stakeholdersop1") },
    {
      value: "Somewhat confident",
      label: t("ideaform_questions.stakeholdersop2"),
    },
    { value: "Confident", label: t("ideaform_questions.stakeholdersop3") },
    { value: "Very confident", label: t("ideaform_questions.stakeholdersop4") },
  ];
  const journey = [
    {
      value: "We did the full problem solving journey by ourselves.",
      label: t("ideaform_questions.probsoljourneyop1"),
    },
    {
      value: "We got feedback on our problem and modified it",
      label: t("ideaform_questions.probsoljourneyop2"),
    },
    {
      value: "We got feedback on our idea and modified it",
      label: t("ideaform_questions.probsoljourneyop3"),
    },
    {
      value: "We got feedback on our prototype and modified it",
      label: t("ideaform_questions.probsoljourneyop4"),
    },
  ];
  const place = [
    { value: "Idea stage", label: t("ideaform_questions.communityop1") },
    { value: "Prototype ready", label: t("ideaform_questions.communityop2") },
    {
      value: "Testing with users",
      label: t("ideaform_questions.communityop3"),
    },
    {
      value: "Product/Service ready for the market, etc.)",
      label: t("ideaform_questions.communityop4"),
    },
    {
      value: "Already launched",
      label: t("ideaform_questions.communityop5"),
    },
  ];
  const uniqueData = [
    { value: "Similar to others", label: t("ideaform_questions.uniqueop1") },
    { value: "Moderately different", label: t("ideaform_questions.uniqueop2") },
    {
      value: "Completely unique",
      label: t("ideaform_questions.uniqueop3"),
    },
  ];
  const supportOptions = [
    "Funding/Investment / నిధులు/రూపాయాల పెట్టుబడులు",
    "Mentorship and Guidance / మార్గదర్శకత్వం మరియు సహాయం",
    "Access to Technology/Tools/ టెక్నాలజీ/సాధనలకు ప్రవేశం",
    "Marketing & Branding Support / మార్కెటింగ్ మరియు బ్రాండింగ్ మద్దతు",
    "Product Development Assistance/ ఉత్పత్తి అభివృద్ధి సహాయం",
    "Access to Incubators/Networks or Partners / ఇంక్యుబేటర్లు/నెట్‌వర్క్‌లు లేదా భాగస్వాముల దగ్గర ప్రవేశం",
    "Legal Support (e.g., Intellectual Property, contracts) / చట్టపరమైన మద్దతు (ఉదాహరణకు, మేధా సంపత్తి, ఒప్పందాలు)",
    "Other (Please specify) / ఇతర (దయచేసి వివరించండి)",
  ];
  // console.log(theme,"theme",props?.theme,"props?.theme");
  const initiatedBy = formData?.initiated_by;
  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
  };
  const handleSupportChange = (e) => {
    const selectedSupport = e.target.value;
    setSupport(selectedSupport);
  };

  // useEffect(() => {
  //   const activeTheme =
  //     props?.theme !== "" && props?.theme !== undefined
  //       ? props?.theme
  //       : formData?.theme;

  // }, [formData.theme]);
  useEffect(() => {
    setTheme(
      props?.theme !== "" && props?.theme !== undefined
        ? props?.theme
        : formData?.theme
    );
    setOthers(formData?.others);
    setTitle(formData?.title);
    setSolve(formData?.solve);
    setIdeaDescribe(formData?.idea_describe);
    setCustomer(formData?.customer);
    setDetail(formData?.detail);
    setSimilar(formData?.similar);
    setRevenue(formData?.revenue);
    setSociety(formData?.society);
    setSupport(formData?.support);
    setPrototypeImage(formData?.prototype_image);
    setPrototypeLink(formData?.prototype_link);
  }, [formData]);

  useEffect(() => {
    if (formData?.stage) {
      setStage(JSON.parse(formData.stage));
    } else {
      setStage([]);
    }
    if (formData?.unique) {
      setUnique(JSON.parse(formData.unique));
    } else {
      setUnique([]);
    }
    if (formData?.confident) {
      const parsedConfident = JSON.parse(formData.confident);
      // console.log("Parsed Confident from formData:", parsedConfident);
      setConfident(parsedConfident);
      // setConfident(JSON.parse(formData.confident));
    } else {
      setConfident([]);
    }

    if (formData?.prototype_image) {
      setPrototypeImage(JSON.parse(formData.prototype_image));
    } else {
      setPrototypeImage([]);
    }
  }, [
    formData?.stage,
    formData?.prototype_image,
    formData?.unique,
    formData?.confident,
  ]);
  // console.log(formData?.confident,"con");
  const handleStageCheckboxChange = (item) => {
    if (Array.isArray(stage) && stage.includes(item)) {
      setStage(stage.filter((i) => i !== item));
    } else {
      setStage([...(stage || []), item]);
    }
  };
  const handleUniqueCheckboxChange = (item) => {
    if (Array.isArray(unique) && unique.includes(item)) {
      setUnique(unique.filter((i) => i !== item));
    } else {
      setUnique([...(unique || []), item]);
    }
  };
  const handleConfidentCheckboxChange = (item) => {
    if (Array.isArray(confident) && confident.includes(item)) {
      setConfident(confident.filter((i) => i !== item));
    } else {
      setConfident([...(confident || []), item]);
    }
  };
  const [immediateLink, setImmediateLink] = useState(null);
  const handleUploadFiles = (addedFiles) => {
    const upload = [...files];

    addedFiles.some((item) => {
      if (upload.findIndex((i) => i.name === item.name) === -1)
        upload.push(item);
    });
    setFiles(upload);
    setImmediateLink(null);
  };
  const removeFileHandler = (i) => {
    const fileAdded = [...files];
    fileAdded.splice(i, 1);
    setFiles(fileAdded);
  };
  let maxFileSize = 10000000;
  const fileHandler = (e) => {
    let choosenFiles = Array.prototype.slice.call(e.target.files);
    // e.target.files = null;
    let pattern = /^[a-zA-Z0-9_-\s]{0,}$/;
    const checkPat = choosenFiles.filter((item) => {
      let pat = item.name.split(".");
      pat.pop();
      return pat.join().search(pattern);
    });
    if (checkPat.length > 0) {
      openNotificationWithIcon("error", t("home.condition"));
      return;
    }
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];
    if (
      choosenFiles.filter((item) => allowedTypes.includes(item.type) === false)
        .length > 0
    ) {
      openNotificationWithIcon("error", t("Choose .png/.jpg/.jpeg/.pdf Only"));
      return;
    }
    if (choosenFiles.filter((item) => item.size > maxFileSize).length > 0) {
      openNotificationWithIcon("error", t("student.less_10MB"));
      return;
    }
    handleUploadFiles(choosenFiles);
  };

  useEffect(() => {
    submittedApi();
  }, []);
  const submittedApi = () => {
    const Param = encryptGlobal(
      JSON.stringify({
        student_id: TeamId,
      })
    );
    var configidea = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/challenge_response/submittedDetails?Data=${Param}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(configidea)
      .then(function (response) {
        if (response.status === 200) {
          // console.log(response,"IdeaPageCopy");

          if (response.data.data && response.data.data.length > 0) {
            const data = response.data.data[0];
            data && setIsDisabled(true);
            setFormData(data);
            setOthers(response.data.data[0].focus_area);
            setId(response.data.data[0].challenge_response_id);
          }
        }
      })
      .catch(function (error) {
        if (error.response.status === 404) {
          seterror4(true);
        }
      });
  };
  const apiCall = () => {
    const challengeParamID = encryptGlobal("1");
    const queryObj = JSON.stringify({
      student_id: TeamId,
    });
    const queryObjEn = encryptGlobal(queryObj);

    const body = {
      theme: theme,
      idea_describe: ideaDescribe,
      title: title,
      solve: solve,
      initiated_by: currentUser?.data[0]?.user_id,
      state: "Telangana",
      district: currentUser?.data[0]?.district,
    };
    // if (others !== "") {
    //   body["others"] = others;
    // }
    if (theme === "Others" && others !== null) {
      body["others"] = others;
    }
    if (customer !== "") {
      body["customer"] = customer;
    }
    if (detail !== "") {
      body["detail"] = detail;
    }
    if (stage !== "") {
      body["stage"] = JSON.stringify(stage);
    }
    if (unique !== "") {
      body["unique"] = JSON.stringify(unique);
    }
    if (similar !== "") {
      body["similar"] = similar;
    }
    if (revenue !== "") {
      body["revenue"] = revenue;
    }
    if (society !== "") {
      body["society"] = society;
    }
    if (confident !== "") {
      body["confident"] = JSON.stringify(confident);
    }
    if (support !== "") {
      body["support"] = support;
    }

    if (prototypeLink !== "") {
      body["prototype_link"] = prototypeLink;
    }

    var config = {
      method: "post",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/challenge_response/${challengeParamID}/initiate/?Data=${queryObjEn}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
      data: JSON.stringify(body),
    };

    axios(config)
      .then(async function (response) {
        if (response.status == 200) {
          setIdeaInitiation(response?.data?.data[0]?.initiated_by);
          openNotificationWithIcon("success", t("home.ideaInitPop"));
          submittedApi();
          seterror4(false);
          // console.log("200");
        }
      })
      .catch(function (error) {
        openNotificationWithIcon("error", t("home.firstfour"));
        // console.log("errors");
        console.log(error);
      });
  };
  const handleSubmit = async (item, stats) => {
    setIsDisabled(true);

    if (error4) {
      apiCall();
      return;
    } else {
      if (stats) {
        setLoading({ ...loading, draft: true });
      } else {
        setLoading({ ...loading, submit: true });
      }
      if (files.length > 0) {
        const formsData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formsData.append(`file${i}`, files[i]);
        }

        for (let [key, value] of formsData.entries()) {
          console.log(`${key}:`, value);
        }

        const axiosConfig = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${currentUser?.data[0]?.token}`,
          },
        };

        const subId = encryptGlobal(
          JSON.stringify({ student_id: currentUser?.data[0]?.student_id })
        );

        const result = await axios
          .post(`${URL.uploadFile}?Data=${subId}`, formsData, axiosConfig)
          .then((res) => res)
          .catch((err) => {
            return err.response;
          });
        if (result && result.status === 200) {
          setImmediateLink(result.data?.data[0]?.attachments);
          setPrototypeImage(result.data?.data[0]?.attachments);
          // setLoading(initialLoadingStatus);
          handleSubmitAll(item, stats, result.data?.data[0]?.attachments);
        } else {
          openNotificationWithIcon("error", `${result?.data?.message}`);
          setLoading(initialLoadingStatus);

          return;
        }
      } else {
        handleSubmitAll(item, stats);
      }
    }
  };

  const handleSubmitAll = async (item, stats, file) => {
    // alert("hii");
    setLoading(initialLoadingStatus);

    let attachmentsList = "";
    if (file) {
      attachmentsList = file.join(", ");
    }
    const body = {
      student_id: TeamId,
      theme: theme,
      idea_describe: ideaDescribe,
      title: title,
      solve: solve,
      status: stats,
      initiated_by: currentUser?.data[0]?.user_id,
    };

    if (theme === "Others" && others !== null) {
      body["others"] = others;
    }
    if (customer !== null) {
      body["customer"] = customer;
    }
    if (detail !== null) {
      body["detail"] = detail;
    }
    if (stage !== null) {
      body["stage"] = JSON.stringify(stage);
    }
    if (unique !== null) {
      body["unique"] = JSON.stringify(unique);
    }
    if (similar !== null) {
      body["similar"] = similar;
    }
    if (revenue !== null) {
      body["revenue"] = revenue;
    }
    if (society !== null) {
      body["society"] = society;
    }
    if (confident !== null) {
      body["confident"] = JSON.stringify(confident);
    }
    if (support !== null) {
      body["support"] = support;
    }
    if (prototypeLink !== null) {
      body["prototype_link"] = prototypeLink;
    }

    if (attachmentsList !== "") {
      body["prototype_image"] = JSON.stringify(file);
    }
    var allques = true;
    if (stats === "SUBMITTED") {
      if (
        theme === "" ||
        theme === null ||
        title === "" ||
        title === null ||
        ideaDescribe === "" ||
        ideaDescribe === null ||
        solve === "" ||
        solve === null ||
        customer === "" ||
        customer === null ||
        detail === "" ||
        detail === null ||
        stage === "" ||
        stage === null ||
        unique === "" ||
        unique === null ||
        similar === "" ||
        similar === null ||
        revenue === "" ||
        revenue === null ||
        society === "" ||
        society === null ||
        confident === "" ||
        confident === null ||
        support === "" ||
        support == null ||
        prototypeLink === "" ||
        prototypeLink == null
      ) {
        allques = false;
      }
      if (theme === "Others" && (others === "" || others === null)) {
        allques = false;
      }
      if (
        (attachmentsList?.length === 0 ||
          attachmentsList === null ||
          attachmentsList === undefined) &&
        (prototypeImage?.length === 0 ||
          prototypeImage === null ||
          prototypeImage === undefined)
      ) {
        allques = false;
      }
    }
    if (allques || stats === "DRAFT") {
      const editParam = encryptGlobal(JSON.stringify(id));
      var config = {
        method: "put",
        url: `${
          process.env.REACT_APP_API_BASE_URL +
          "/challenge_response/updateEntry/" +
          editParam
        }`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.data[0]?.token}`,
        },
        data: JSON.stringify(body),
      };
      axios(config)
        .then(function (response) {
          if (response.status === 200) {
            if (stats === "SUBMITTED") {
              openNotificationWithIcon("success", t("home.ideaSubPop"));
              setTimeout(function () {
                window.location.reload();
              }, 500);
              // window.location.reload();

              localStorage.setItem("ideaSubStatus", 1);
              onclick();
            } else {
              openNotificationWithIcon("success", t("home.ideaDraPop"));
              setIsDisabled(true);
              scroll();
            }
          }
        })
        .catch(function (error) {
          // openNotificationWithIcon(
          //     'error',
          //     error?.response?.data?.message
          // );
          console.log(error);
        });
    } else {
      openNotificationWithIcon("error", t("home.ideaFullPop"));
    }
  };
  const onclick = () => {
    if (typeof showChallenges === "function") {
      showChallenges();
    } else {
      console.error("showChallenges is not a function");
    }
  };
  const scroll = () => {
    const section = document.querySelector("#start");
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const handleEdit = () => {
    setIsDisabled(false);
    scroll();
  };
  const comingSoonText = t("dummytext.student_idea_sub");
  // const acceptedParamfileTypes =>
  //     'Accepting only png,jpg,jpeg,pdf,mp4,doc,docx Only, file size should be below 10MB';
  const enableSaveBtn =
    theme?.length > 0 &&
    ideaDescribe?.length > 0 &&
    title?.length > 0 &&
    solve?.length > 0;
  console.log("Idea Form Screen");
  return (
    <>
      {/* <div className='content'> */}
      {showPage ? (
        <CommonPage text={comingSoonText} showButton={true} />
      ) : (
        <div className="presuervey mt-1 container" id="start">
          <Col>
            <div className=" justify-content-center">
              <div className="aside p-4">
                <CardBody>
                  <Form className="form-row row" isSubmitting>
                    {formData?.verified_status !== null && (
                      <>
                        {formData?.verified_status === "REJECTED" ? (
                          <div className="d-md-flex justify-content-end px-4">
                            <Card className="p-3 card-bg-warning">
                              <h5 className="text-white p-1">
                                {t("idea_page.modified")} :{" "}
                                {formData?.initiated_name}{" "}
                              </h5>
                              <h5 className="text-white p-1">
                                {t("idea_page.date")} :{" "}
                                {moment(formData?.verified_at).format(
                                  "DD-MM-YYYY"
                                )}{" "}
                              </h5>
                              <h5 className="text-white p-1">
                                {t("idea_page.reject")} :{" "}
                                {formData?.mentor_rejected_reason}{" "}
                              </h5>
                            </Card>
                          </div>
                        ) : (
                          ""
                        )}
                      </>
                    )}

                    {formData?.status === "SUBMITTED" && (
                      <div className="d-md-flex justify-content-end px-4">
                        <Card className="p-3 card-bg-info">
                          <h5 className="text-white p-1">
                            {t("student_course.idea_submission_msg1")}
                            {formData?.status === "DRAFT"
                              ? t("student_course.idea_status1")
                              : t("student_course.idea_status2")}
                            {formData?.initiated_by !==
                              currentUser?.data[0]?.user_id &&
                              t("student_course.idea_submission_msg2")}
                            {formData?.initiated_name}
                            {formData?.status === "DRAFT"
                              ? moment(formData?.created_at).format(
                                  "DD-MM-YYYY H:I A"
                                )
                              : formData?.submitted_at
                              ? " On " +
                                moment(formData?.submitted_at).format(
                                  "DD-MM-YYYY HH:MM A"
                                )
                              : ""}
                          </h5>
                          {/* <h5 className="text-white p-1">
                            {t("idea_page.review")} :
                            {formData?.verified_status === null ||
                            formData?.verified_status === ""
                              ? " Yet to be Reviewed"
                              : formData?.verified_status === "ACCEPTED"
                              ? ` Accepted on ${moment(
                                  formData?.verified_at
                                ).format("DD-MM-YYYY HH:MM A")}`
                              : formData?.verified_status === "REJECTED"
                              ? ` Rejected on ${moment(
                                  formData?.verified_at
                                ).format("DD-MM-YYYY HH:MM A")} - Reason: ${
                                  formData?.mentor_rejected_reason
                                }`
                              : moment(formData?.verified_at).format(
                                  "DD-MM-YYYY HH:MM A"
                                )}
                          </h5> */}
                        </Card>
                      </div>
                    )}
                    {/* <div className="text-right">
                                                        { (
                                                            <>
                                                                <Button
                                                                    type="button"
                                                                    btnClass="me-3 btn btn-info"
                                                                    onClick={
                                                                        handleEdit
                                                                    }
                                                                    size="small"
                                                                    label={t(
                                                                        'teacher_teams.edit_idea'
                                                                    )}
                                                                    style={{ marginRight: '1rem' }}
                                                                />
                                                                <Button
                                                    type="button"
                                                    btnClass="primary"
                                                    onClick={(e) =>
                                                        handleSubmit(
                                                            e,
                                                            'SUBMITTED'
                                                        )
                                                    }
                                                    size="small"
                                                    label={t(
                                                        'teacher_teams.submit'
                                                    )}
                                                />
                                                            </>)}
                                                      
                                                    </div> */}
                    <div className="text-right mb-3">
                      {!isDisabled && (
                        <Button
                          type="button"
                          btnClass="me-3 btn btn-warning"
                          // backgroundColor="#067DE1"
                          onClick={(e) => handleSubmit(e, "DRAFT")}
                          size="small"
                          label={`${
                            loading.draft
                              ? t("teacher_teams.loading")
                              : t("teacher_teams.draft")
                          }`}
                          disabled={!enableSaveBtn}
                        />
                      )}
                      {
                        //         initiatedBy &&
                        // initiatedBy ===
                        //     currentUser?.data[0]
                        //         ?.user_id &&
                        formData.status !== "SUBMITTED" && isDisabled && (
                          <>
                            <Button
                              type="button"
                              btnClass="me-3 btn btn-info"
                              onClick={handleEdit}
                              size="small"
                              label={t("teacher_teams.edit_idea")}
                              style={{ marginRight: "1rem" }}
                            />
                            <Button
                              type="button"
                              btnClass="primary"
                              onClick={(e) => handleSubmit(e, "SUBMITTED")}
                              size="small"
                              label={t("teacher_teams.submit")}
                            />
                          </>
                        )
                      }
                    </div>
                    {/* {currentSection === 1 && ( */}
                    <div className="d-md-flex justify-content-end px-0">
                      <Row>
                        <div className="card comment-card">
                          <div className="question quiz mb-0">
                            <b
                              style={{
                                fontSize: "1rem",
                              }}
                            >
                              1. {t("ideaform_questions.themeq")}
                            </b>
                          </div>

                          <div className=" answers row flex-column p-4">
                            <select
                              className="form-control"
                              onChange={handleThemeChange}
                              disabled={isDisabled}
                              name="theme"
                              id="theme"
                            >
                              <option value={""}>
                                Please select the Theme
                              </option>
                              {themesList.map((item, i) => (
                                <option
                                  key={i}
                                  value={item}
                                  selected={item === theme}
                                >
                                  {item}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        {theme === "Others" && (
                          <div className="card comment-card">
                            <div className="question quiz mb-0">
                              <b
                                style={{
                                  fontSize: "1rem",
                                }}
                              >
                                {t("ideaform_questions.focusareaq")}
                              </b>
                            </div>

                            <div className=" answers row flex-column p-4">
                              <textarea
                                disabled={isDisabled}
                                placeholder={t("home.ideaFoc")}
                                value={others}
                                maxLength={500}
                                onChange={(e) => setOthers(e.target.value)}
                                className="form-control"
                              />
                              <div className="text-end">
                                {t("student_course.chars")} :
                                {500 - (others ? others.length : 0)}
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="card comment-card">
                          <div className="question quiz mb-0">
                            <b
                              style={{
                                fontSize: "1rem",
                              }}
                            >
                              2. {t("ideaform_questions.ideatitleq")}
                            </b>
                          </div>
                          <div className="answers row flex-column p-4">
                            <textarea
                              className="form-control"
                              disabled={isDisabled}
                              placeholder={t("home.ideatit")}
                              // {t("student_course.chars")}
                              value={ideaDescribe}
                              rows={4}
                              maxLength={500}
                              onChange={(e) => setIdeaDescribe(e.target.value)}
                            />

                            <div className="text-end">
                              {t("student_course.chars")} :
                              {500 - (ideaDescribe ? ideaDescribe.length : 0)}
                            </div>
                          </div>
                        </div>
                        <div className="card comment-card">
                          <div className="question quiz mb-0">
                            <b
                              style={{
                                fontSize: "1rem",
                              }}
                            >
                              3. {t("ideaform_questions.problemstatementq")}
                            </b>
                          </div>
                          <div className="answers row flex-column p-4">
                            <textarea
                              className="form-control"
                              disabled={isDisabled}
                              rows={6}
                              placeholder={t("home.ideaprob")}
                              value={title}
                              maxLength={1000}
                              onChange={(e) => setTitle(e.target.value)}
                            />
                            <div className="text-end">
                              {t("student_course.chars")} :
                              {1000 - (title ? title.length : 0)}
                            </div>
                          </div>
                        </div>
                        <div className="card comment-card">
                          <div className="question quiz mb-0">
                            <b
                              style={{
                                fontSize: "1rem",
                              }}
                            >
                              4. {t("ideaform_questions.causesq")}
                            </b>
                          </div>
                          <div className="answers row flex-column p-4">
                            <textarea
                              className="form-control"
                              disabled={isDisabled}
                              placeholder={t("home.ideaList")}
                              rows={4}
                              value={solve}
                              maxLength={500}
                              onChange={(e) => setSolve(e.target.value)}
                            />
                            <div className="text-end">
                              {t("student_course.chars")} :
                              {500 - (solve ? solve.length : 0)}
                            </div>
                          </div>
                        </div>
                        <div className="card comment-card">
                          <div className="question quiz mb-0">
                            <b
                              style={{
                                fontSize: "1rem",
                              }}
                            >
                              5. {t("ideaform_questions.effectsq")}
                            </b>
                          </div>
                          <div className="answers row flex-column p-4">
                            <textarea
                              className="form-control"
                              disabled={isDisabled}
                              placeholder={t("home.ideaEff")}
                              value={customer}
                              rows={4}
                              maxLength={500}
                              onChange={(e) => setCustomer(e.target.value)}
                            />
                            <div className="text-end">
                              {t("student_course.chars")} :
                              {500 - (customer ? customer.length : 0)}
                            </div>
                          </div>
                        </div>
                        {/* //addon // */}
                        <div className="card comment-card">
                          <div className="question quiz mb-0">
                            <b
                              style={{
                                fontSize: "1rem",
                              }}
                            >
                              6. {t("ideaform_questions.explain")}
                            </b>
                          </div>
                          <div className="answers row flex-column p-4">
                            <textarea
                              className="form-control"
                              disabled={isDisabled}
                              placeholder={t("home.explace")}
                              value={detail}
                              rows={4}
                              maxLength={500}
                              onChange={(e) => setDetail(e.target.value)}
                            />
                            <div className="text-end">
                              {t("student_course.chars")} :
                              {500 - (detail ? detail.length : 0)}
                            </div>
                          </div>
                        </div>
                        <div className="card comment-card">
                          <div className="question quiz mb-0">
                            <b
                              style={{
                                fontSize: "1rem",
                              }}
                            >
                              7. {t("ideaform_questions.communityq")}
                            </b>
                          </div>
                          <div className=" answers row flex-column">
                            <div>
                              {place.map((item, i) => (
                                <div key={i}>
                                  <label
                                    style={{
                                      margin: "1rem",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      value={item.value}
                                      checked={
                                        Array.isArray(stage) &&
                                        stage.includes(item.value)
                                      }
                                      disabled={isDisabled}
                                      onChange={() =>
                                        handleStageCheckboxChange(item.value)
                                      }
                                    />{" "}
                                    {item.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        {/* Add On  */}
                        <div className="card comment-card">
                          <div className="question quiz mb-0">
                            <b
                              style={{
                                fontSize: "1rem",
                              }}
                            >
                              8. {t("ideaform_questions.uniqueq")}
                            </b>
                          </div>
                          <div className=" answers row flex-column">
                            <div>
                              {uniqueData.map((item, i) => (
                                <div key={i}>
                                  <label
                                    style={{
                                      margin: "1rem",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      value={item.value}
                                      checked={
                                        Array.isArray(unique) &&
                                        unique.includes(item.value)
                                      }
                                      disabled={isDisabled}
                                      onChange={() =>
                                        handleUniqueCheckboxChange(item.value)
                                      }
                                    />{" "}
                                    {item.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="card comment-card">
                          <div className="question quiz mb-0">
                            <b
                              style={{
                                fontSize: "1rem",
                              }}
                            >
                              9. {t("ideaform_questions.facingq")}
                            </b>
                          </div>
                          <div className=" answers row flex-column p-4">
                            <textarea
                              className="form-control"
                              disabled={isDisabled}
                              placeholder={t("home.faci")}
                              value={similar}
                              rows={4}
                              maxLength={500}
                              onChange={(e) => setSimilar(e.target.value)}
                            />
                            <div className="text-end">
                              {t("student_course.chars")} :
                              {500 - (similar ? similar.length : 0)}
                            </div>
                          </div>
                        </div>
                        {/* <div>
                            <Col className="d-flex justify-content-end">
                              <button
                                className="btn btn-secondary"
                                onClick={goToNext}
                              >
                               
                                {t("idea_page.next")}
                              </button>
                            </Col>
                          </div> */}
                      </Row>
                    </div>
                    {/* // )} */}

                    {/* {currentSection === 2 && ( */}
                    <div className="d-md-flex justify-content-end px-0">
                      <Row>
                        <div className="card comment-card">
                          <div className="question quiz mb-0">
                            <b
                              style={{
                                fontSize: "1rem",
                              }}
                            >
                              10. {t("ideaform_questions.solutiondetailsq")}
                            </b>
                          </div>
                          <div className="answers row flex-column p-4">
                            <textarea
                              className="form-control"
                              disabled={isDisabled}
                              placeholder={t("home.ideaSol")}
                              value={revenue}
                              rows={6}
                              maxLength={1000}
                              onChange={(e) => setRevenue(e.target.value)}
                            />
                            <div className="text-end">
                              {t("student_course.chars")} :
                              {1000 - (revenue ? revenue.length : 0)}
                            </div>
                          </div>
                        </div>
                        {/* Add On */}
                        <div className="card comment-card">
                          <div className="question quiz mb-0">
                            <b
                              style={{
                                fontSize: "1rem",
                              }}
                            >
                              11. {t("ideaform_questions.impactq")}
                            </b>
                          </div>
                          <div className="answers row flex-column p-4">
                            <textarea
                              className="form-control"
                              disabled={isDisabled}
                              placeholder={t("home.data")}
                              value={society}
                              rows={6}
                              maxLength={1000}
                              onChange={(e) => setSociety(e.target.value)}
                            />
                            <div className="text-end">
                              {t("student_course.chars")} :
                              {1000 - (society ? society.length : 0)}
                            </div>
                          </div>
                        </div>
                        <div className="card comment-card">
                          <div className="question quiz mb-0">
                            <b
                              style={{
                                fontSize: "1rem",
                              }}
                            >
                              12. {t("ideaform_questions.stakeholdersq")}
                            </b>
                          </div>
                          <div className=" answers row flex-column">
                            <div>
                              {people.map((item, i) => (
                                <div key={i}>
                                  <label
                                    style={{
                                      margin: "1rem",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      value={item.value}
                                      checked={
                                        Array.isArray(confident) &&
                                        confident.includes(item.value)
                                      }
                                      disabled={isDisabled}
                                      onChange={() =>
                                        handleConfidentCheckboxChange(
                                          item.value
                                        )
                                      }
                                    />{" "}
                                    {item.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        {/* Add On */}

                        {/* <div className="card comment-card">
                            <div className="question quiz mb-0">
                              <b
                                style={{
                                  fontSize: "1rem",
                                }}
                              >
                                {t("ideaform_questions.feedbackq")}
                              </b>
                            </div>
                            <div className=" answers row flex-column p-4">
                              <textarea
                                className="form-control"
                                disabled={isDisabled}
                                rows={6}
                                placeholder={t("home.ideaFee")}
                                value={feedback}
                                maxLength={500}
                                onChange={(e) => setFeedback(e.target.value)}
                              />
                              <div className="text-end">
                                {t("student_course.chars")} :
                                {500 - (feedback ? feedback.length : 0)}
                              </div>
                            </div>
                          </div> */}
                      </Row>
                    </div>
                    {/* // )} */}
                    {/* {currentSection === 3 && ( */}
                    <div className="d-md-flex justify-content-end px-0">
                      <Row>
                        <div className="card comment-card">
                          <div className="question quiz mb-0">
                            <b
                              style={{
                                fontSize: "1rem",
                              }}
                            >
                              13. {t("ideaform_questions.additionalq")}
                            </b>
                          </div>

                          <div className=" answers row flex-column p-4">
                            <select
                              className="form-control"
                              onChange={handleSupportChange}
                              disabled={isDisabled}
                              name="support"
                              id="support"
                            >
                              <option value={""}>Please select Dropdown</option>
                              {supportOptions.map((item, i) => (
                                <option
                                  key={i}
                                  value={item}
                                  selected={item === support}
                                >
                                  {item}
                                </option>
                              ))}
                            </select>
                          </div>
                          {/* <div className=" answers row flex-column">
                             
                             <div>
                               {journey.map((item, i) => (
                                 <div key={i}>
                                   <label
                                     style={{
                                       margin: "1rem",
                                       fontSize: "1rem",
                                     }}
                                   >
                                     <input
                                       type="checkbox"
                                       value={item.value} 
                                       checked={
                                         Array.isArray(problemSolving) &&
                                         problemSolving.includes(item.value)
                                       }
                                       disabled={isDisabled}
                                       onChange={() =>
                                         handleCheckboxChange(item.value)
                                       } 
                                     />{" "}
                                     {item.label}
                                   </label>
                                   <br />
                                 </div>
                               ))}
                             </div>
                           </div> */}
                        </div>
                        <div className="card comment-card">
                          <div className="question quiz mb-0">
                            <b
                              style={{
                                fontSize: "1rem",
                              }}
                            >
                              14. {t("ideaform_questions.uploadq")}
                            </b>
                          </div>
                          <div className=" answers row flex-column p-4 pb-0">
                            {/* <FormGroup check className="answers"> */}
                            <div className="wrapper my-3 common-flex">
                              {/* {!isDisabled && (
                                                                                                    <Button
                                                                                                        type="button"
                                                                                                        btnClass={`${
                                                                                                            isDisabled
                                                                                                                ? 'secondary'
                                                                                                                : 'primary'
                                                                                                        } me-3 pointer `}
                                                                                                        size="small"
                                                                                                        label={t(
                                                                                                            'student.upload_file'
                                                                                                        )}
                                                                                                    />
                                                                                                )} */}
                              {!isDisabled && (
                                <Button
                                  label={t("home.ideaFi")}
                                  // btnClass="primary"
                                  btnClass={`${
                                    isDisabled ? "secondary" : "primary"
                                  } me-3 pointer `}
                                  size="small"
                                  onClick={() => {
                                    document.getElementById("file").click();
                                  }}
                                />
                              )}
                              <input
                                type="file"
                                name="file"
                                className="form-control"
                                id="file"
                                style={{
                                  display: "none",
                                }}
                                disabled={isDisabled}
                                accept="image/jpeg,image/jpg,image/png,application/pdf"
                                multiple
                                // className="hidden"
                                // style='display: none'
                                onChange={(e) => fileHandler(e)}
                              />
                            </div>
                            {/* </FormGroup> */}
                            <div className="mx-4">
                              {immediateLink &&
                                immediateLink.length > 0 &&
                                immediateLink.map((item, i) => (
                                  <LinkComponent
                                    item={item}
                                    url={true}
                                    key={i}
                                  />
                                ))}
                              {!immediateLink &&
                                files.length > 0 &&
                                files.map((item, i) => (
                                  <LinkComponent
                                    original={true}
                                    item={item}
                                    i={i}
                                    key={i}
                                    removeFileHandler={removeFileHandler}
                                  />
                                ))}

                              {!immediateLink &&
                                files.length === 0 &&
                                Array.isArray(prototypeImage) &&
                                prototypeImage.map((item, i) => (
                                  <LinkComponent
                                    item={item}
                                    url={true}
                                    key={i}
                                  />
                                ))}
                            </div>
                          </div>
                          <div className=" answers row flex-column p-4 pt-0">
                            <textarea
                              className="form-control"
                              disabled={isDisabled}
                              placeholder={t("home.ideaUp")}
                              value={prototypeLink}
                              maxLength={300}
                              onChange={(e) => setPrototypeLink(e.target.value)}
                            />
                            <div className="text-end">
                              {t("student_course.chars")} :
                              {300 - (prototypeLink ? prototypeLink.length : 0)}
                            </div>
                          </div>
                        </div>
                        {/* <div className="card comment-card">
                            <div className="question quiz mb-0">
                              <b
                                style={{
                                  fontSize: "1rem",
                                }}
                              >
                                {t("ideaform_questions.workbookq")}
                              </b>
                            </div>
                            <div className=" answers row flex-column">
                             
                              <div>
                                {submit.map((item,i) => (
                                  <div key={i}>
                                  <label
                                    style={{
                                      margin: "1rem",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      value={item.value}
                                      disabled={isDisabled}
                                      checked={item.value === workbook}
                                      onChange={(e) =>
                                        setWorkbook(e.target.value)
                                      }
                                    />
                                      {item.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div> */}
                      </Row>
                    </div>
                    {/* )} */}
                  </Form>
                  {/* <div className="d-flex justify-content-start">
                    {!isDisabled && (
                      <Button
                        type="button"
                        btnClass="me-3 btn btn-warning"
                        // backgroundColor="#067DE1"
                        onClick={(e) => handleSubmit(e, "DRAFT")}
                        size="small"
                        label={`${loading.draft
                          ? t("teacher_teams.loading")
                          : t("teacher_teams.draft")
                          }`}
                        disabled={!enableSaveBtn}
                      />
                    )}
                  </div> */}
                </CardBody>
              </div>
            </div>
          </Col>
        </div>
      )}
      {/* </div> */}
    </>
  );
};

export default IdeasPageNew;
