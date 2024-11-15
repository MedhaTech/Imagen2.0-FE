/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import { useEffect, useLayoutEffect, useCallback } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CommonPage from '../../components/CommonPage';
import { getCurrentUser } from '../../helpers/Utils';
import { getStudentChallengeSubmittedResponse } from '../../redux/studentRegistration/actions';
// import Layout from '../../Layout';
import IdeasPageNew from './IdeaPageCopy';
// import SDG from './SDG';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { encryptGlobal } from '../../constants/encryptDecrypt';
import Idea from './Idea';
// import { getLanguage } from "../../constants/languageOptions";

const IdeaSubmission = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // const language = useSelector(
  //   (state) => state?.studentRegistration?.studentLanguage
  // );
  const challengesSubmittedResponse = useSelector(
    (state) => state?.studentRegistration.challengesSubmittedResponse
  );
  const currentUser = getCurrentUser('current_user');
  const [showChallenges, setShowChallenges] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [view, setView] = useState(false);
  const [isideadisable, setIsideadisable] = useState(false);
  const TeamId = currentUser?.data[0]?.student_id;
  const [ideaSubmittedRes, setIdeaSubmittedRes] = useState({});
  const [initiate, setInitiate] = useState("");
  useEffect(() => {
    // const popParam = encryptGlobal(
    //   JSON.stringify({
    //     state: currentUser.data[0]?.state,
    //     role: currentUser.data[0]?.role
    //   })
    // );
    // var config = {
    //   method: 'get',
    //   url: process.env.REACT_APP_API_BASE_URL + `/popup?Data=${popParam}`,
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Accept: 'application/json',
    //     Authorization: `Bearer ${currentUser.data[0]?.token}`
    //   }
    // };
    // axios(config)
    //   .then(function (response) {
    //     if (response.status === 200) {
    //       if (response.data.data[0]?.on_off === '1') {
    //         setIsideadisable(true);
    //       } else {
    //         setIsideadisable(false);
    //       }
    //     }
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  }, []);
  const submittedApi = () => {
    const Param = encryptGlobal(
      JSON.stringify({
        student_id: TeamId

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
          if (response.data.data && response.data.data.length > 0) {
            const data = response.data.data[0];
            // console.log(data, "data");
            setInitiate(response.data.data[0].initiate_by);

            setIdeaSubmittedRes(data);

          }
        }
      })
      .catch(function (error) {
        if (error.response.status === 404) {
          //   seterror4( true);
        }

      });
  };
  useEffect(() => {
    submittedApi();
  }, []);
  useLayoutEffect(() => {
    if (ideaSubmittedRes && ideaSubmittedRes.length > 0) {
      ideaSubmittedRes.status === 'DRAFT'
        ? setShowChallenges(true)
        // : view
        // ? setShowChallenges(true)
        : setShowCompleted(true);
    } else {
      setShowChallenges(false);
    }
  }, [ideaSubmittedRes]);
  const commonPageText = t('student.idea_submitted_desc');
  const handleView = () => {
    // console.log("1");
    // here we can see the idea submission //
    setShowCompleted(false);
    setShowChallenges(true);
    setView(true);
  };
  const handleShow = () => {
    // console.log("2");

    // here we can see the idea submission //
    // setShowChallenges(true);
    setShowCompleted(true);
    setView(false);
  };

  const submitted = () => {
    // console.log("3", ideaSubmittedRes);
    const Param = encryptGlobal(
      JSON.stringify({
        student_id: TeamId

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
    // console.log("3", response);

          if (response.data.data && response.data.data.length > 0) {
            const data = response.data.data[0];
            data.status === 'DRAFT' ? setShowChallenges(true) : setShowCompleted(true);

          }
        }
      })
      .catch(function (error) {
        if (error.response.status === 404) {
          //   seterror4( true);
        }

      });

  };

 

  // console.log(showChallenges,"showChallenges",showCompleted,"showCompleted",);
  return showCompleted ? (
    <div className='page-wrapper'>
      <CommonPage
        text={commonPageText}
        showButton={true}
        showChallenges={handleView}
      />
    </div>
  ) : showChallenges ? (
    <div className='page-wrapper'>
      <div className="content">
        <IdeasPageNew
          showChallenges={handleShow} />
      </div>
    </div>
  ) :
    !isideadisable ?
      (
        <Idea showChallenge={handleShow} idea={submitted} />

      ) 
      : (
        <div className='page-wrapper'>
          <CommonPage
            text={t('student_course.idea_submission_date_com_desc')}
            ideaSubmissionComButton={true}
          />
        </div>
      );
};
export default IdeaSubmission;
