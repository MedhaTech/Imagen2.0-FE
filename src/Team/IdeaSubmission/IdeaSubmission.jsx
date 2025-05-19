/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import { useEffect, useLayoutEffect, useCallback } from 'react';
import { useState } from 'react';
import CommonPage from '../../components/CommonPage';
import { getCurrentUser } from '../../helpers/Utils';
import IdeasPageNew from './IdeaPageCopy';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { encryptGlobal } from '../../constants/encryptDecrypt';
import Idea from './Idea';

const IdeaSubmission = () => {
  const { t } = useTranslation();
 
  const currentUser = getCurrentUser('current_user');
  const [showChallenges, setShowChallenges] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [view, setView] = useState(false);
  const [isideadisable, setIsideadisable] = useState(false);
  const TeamId = currentUser?.data[0]?.type_id === 0 ? currentUser?.data[0]?.student_id : currentUser?.data[0]?.type_id;
  const [ideaSubmittedRes, setIdeaSubmittedRes] = useState({});
  const [initiate, setInitiate] = useState("");
 
  const submittedApi = () => {
               // This function fetches idea submission details from the API //

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
       
        : setShowCompleted(true);
    } else {
      setShowChallenges(false);
    }
  }, [ideaSubmittedRes]);
  const commonPageText = t('student.idea_submitted_desc');
  const handleView = () => {
    // here we can see the idea submission //
    setShowCompleted(false);
    setShowChallenges(true);
    setView(true);
  };
  const handleShow = () => {

    // here we can see the idea submission //
    // setShowChallenges(true);
    setShowCompleted(true);
    setView(false);
  };

  const submitted = () => {
               // This function fetches idea submission details from the API //

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
