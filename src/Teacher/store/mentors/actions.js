/* eslint-disable indent */
import axios from "axios";

import {
  MENTORS_CREATE,
  MENTORS_CREATE_SUCCESS,
  MENTORS_CREATE_ERROR,
  MENTORS_LIST,
  MENTORS_LIST_SUCCESS,
  MENTORS_LIST_ERROR,
  MENTORS_DELETE,
  MENTORS_DELETE_SUCCESS,
  MENTORS_DELETE_ERROR,
  MENTORS_EDIT,
  MENTORS_EDIT_SUCCESS,
  MENTORS_EDIT_ERROR,
  MENTORS_LANGUAGE,
  GET_TEACHERS,
  MENTORS_GET_SUPPORT_TICKETS,
  MENTORS_GET_SUPPORT_TICKETS_BY_ID,
  MENTORS_GET_SUPPORT_TICKETS_RESPONSES_BY_ID,
  MENTORS_SUPPORT_TICKETS_STATUS,
  GET_TEACHERS_PRESURVEY_STATUS,
  DISCUSSION_GET_CHAT,
  DISCUSSION_LIST_ERROR,
  GET_DISCUSSION_CHAT_BY_ID,

  // MENTORS_CREATE_SUPPORT_TICKETS
} from "../../../redux/actions.js";
import { URL, KEY } from "../../../constants/defaultValues.js";
import {
  getNormalHeaders,
  openNotificationWithIcon,
} from "../../../helpers/Utils.js";
import { encryptGlobal } from "../../../constants/encryptDecrypt.js";

export const mentorCreateSuccess = (user) => async (dispatch) => {
  dispatch({
    type: MENTORS_CREATE_SUCCESS,
    payload: user,
  });
};
export const getMentorGlobalLanguage = (language) => async (dispatch) => {
  dispatch({
    type: MENTORS_LANGUAGE,
    payload: language,
  });
};
export const mentorCreateError = (message) => async (dispatch) => {
  dispatch({
    type: MENTORS_CREATE_ERROR,
    payload: { message },
  });
};

export const mentorCreate = (data, history) => async (dispatch) => {
  try {
    dispatch({ type: MENTORS_CREATE });
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    const result = await axios
      .post(`${URL.addMentor}`, data, axiosConfig)
      .then((user) => user)
      .catch((err) => {
        return err.response;
      });
    if (result && result.status === 200) {
      // dispatch(mentorCreateSuccess(item));
      history.push("/teams");
    } else {
      dispatch(mentorCreateError(result.statusText));
    }
  } catch (error) {
    dispatch(mentorCreateError({}));
  }
};

export const getMentorsListSuccess = (user) => async (dispatch) => {
  dispatch({
    type: MENTORS_LIST_SUCCESS,
    payload: user,
  });
};

export const getMentorsListError = (message) => async (dispatch) => {
  dispatch({
    type: MENTORS_LIST_ERROR,
    payload: { message },
  });
};
export const getDiscussionListError = (message) => async (dispatch) => {
  dispatch({
    type: DISCUSSION_LIST_ERROR,
    payload: { message },
  });
};
export const getStudentByIdData = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_TEACHERS });
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    const getId = encryptGlobal(JSON.stringify(id));
    const result = await axios
      .get(`${URL.getStudentById}${getId}`, axiosConfig)
      .then((user) => user)
      .catch((err) => {
        return err.response;
      });
    if (result && result.status === 200) {
      const data = result.data && result.data.data[0] && result.data.data[0];
      dispatch(getMentorsListSuccess(data));
    } else {
      dispatch(getMentorsListError(result.statusText));
    }
  } catch (error) {
    dispatch(getMentorsListError({}));
  }
};

export const getMentorsList = (history) => async (dispatch) => {
  try {
    dispatch({ type: MENTORS_LIST });
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    const result = await axios
      .get(`${URL.getMentors}`, axiosConfig)
      .then((user) => user)
      .catch((err) => {
        return err.response;
      });
    if (result && result.status === 200) {
      const data = result.data;
      dispatch(getMentorsListSuccess(data));
      history.push("/teams");
    } else {
      dispatch(getMentorsListError(result.statusText));
    }
  } catch (error) {
    dispatch(getMentorsListError({}));
  }
};

export const deleteMentorSuccess = (user) => async (dispatch) => {
  dispatch({
    type: MENTORS_DELETE_SUCCESS,
    payload: user,
  });
};

export const deleteMentorError = (message) => async (dispatch) => {
  dispatch({
    type: MENTORS_DELETE_ERROR,
    payload: { message },
  });
};

export const deleteMentor = (courseId) => async (dispatch) => {
  try {
    dispatch({ type: MENTORS_DELETE });
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    const Del = encryptGlobal(JSON.stringify(courseId));
    const result = await axios
      .delete(`${URL.deleteMentor + "/" + Del}`, axiosConfig)
      .then((user) => user)
      .catch((err) => {
        return err.response;
      });
    if (result && result.status === 200) {
      const data = result.data.text;
      dispatch(deleteMentorSuccess(data));
    } else {
      dispatch(deleteMentorError(result.statusText));
    }
  } catch (error) {
    dispatch(deleteMentorError({}));
  }
};

export const mentorsEditSuccess = (user) => async (dispatch) => {
  dispatch({
    type: MENTORS_EDIT_SUCCESS,
    payload: user,
  });
};

export const mentorsEditError = (message) => async (dispatch) => {
  dispatch({
    type: MENTORS_EDIT_ERROR,
    payload: { message },
  });
};

export const mentorsEdit = (courseId, data, history) => async (dispatch) => {
  try {
    dispatch({ type: MENTORS_EDIT });
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    const edi = encryptGlobal(JSON.stringify(courseId));

    const result = await axios
      .put(`${URL.updateMentor + "/" + edi}`, data, axiosConfig)
      .then((user) => user)
      .catch((err) => {
        return err.response;
      });
    if (result && result.status === 200) {
      // const data = result.data.text;
      // dispatch(mentorsEditSuccess(data));
      history.push("/teams");
    } else {
      dispatch(mentorsEditError(result.statusText));
    }
  } catch (error) {
    dispatch(mentorsEditError({}));
  }
};
export const getSupportTicketsSuccess = (tickets) => async (dispatch) => {
  dispatch({
    type: MENTORS_GET_SUPPORT_TICKETS,
    payload: tickets,
  });
};
export const getDiscussionChatSuccess = (tickets) => async (dispatch) => {
  dispatch({
    type: DISCUSSION_GET_CHAT,
    payload: tickets,
  });
};
export const getDiscussionList = (user) => async (dispatch) => {
  try {
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    const lang = "locale=en";
    const final = lang.split("=");

    const param = encryptGlobal(
      JSON.stringify({
        user_id: user.user_id,
        locale: final[1],
      })
    );
    const result = await axios
      .get(`${URL.getstudentChat}?Data=${param}`, axiosConfig)
      .then((user) => user)
      .catch((err) => {
        return err.response;
      });
    if (result && result.status === 200) {
      console.log(result,"Discussion List");
      const data =
        result.data.data[0].dataValues.length > 0
          ? result.data.data[0].dataValues.map((item, i) => {
              item.id = i + 1;
              return item;
            })
          : [];

      dispatch(getDiscussionChatSuccess(data));
    } else {
      dispatch(getDiscussionListError(result.statusText));
    }
  } catch (error) {
    dispatch(getDiscussionListError({}));
  }
};
export const getSupportTickets = (user) => async (dispatch) => {
  try {
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    const lang = "locale=en";
    const final = lang.split("=");

    const param = encryptGlobal(
      JSON.stringify({
        user_id: user.user_id,
        locale: final[1],
      })
    );
    const result = await axios
      .get(`${URL.getMentorSupportTickets}?Data=${param}`, axiosConfig)
      .then((user) => user)
      .catch((err) => {
        return err.response;
      });
    if (result && result.status === 200) {
      const data =
        result.data.data[0].dataValues.length > 0
          ? result.data.data[0].dataValues.map((item, i) => {
              item.id = i + 1;
              return item;
            })
          : [];

      dispatch(getSupportTicketsSuccess(data));
    } else {
      dispatch(getMentorsListError(result.statusText));
    }
  } catch (error) {
    dispatch(getMentorsListError({}));
  }
};


export const createSupportTickets = (data) => async () => {
  try {
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    const result = await axios
      .post(`${URL.createMentorSupportTickets}`, data, axiosConfig)
      .then((user) => user)
      .catch((err) => {
        return err.response;
      });

    if (result && result.status === 201) {
      openNotificationWithIcon("success", "Ticket Created Sucessfully!", "");
    } else {
      openNotificationWithIcon("error", "Something went wrong!", "");
    }
  } catch (error) {
    openNotificationWithIcon("error", "Something went wrong!", "");
  }
};
export const createDiscussionChats = (data) => async () => {
  try {
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    const result = await axios
      .post(`${URL.createDiscussionChat}`, data, axiosConfig)
      .then((user) => user)
      .catch((err) => {
        return err.response;
      });

    if (result && result.status === 201) {
      openNotificationWithIcon("success", "Forum Created Successfully", "");
    } else {
      openNotificationWithIcon("error", "Something went wrong!", "");
    }
  } catch (error) {
    openNotificationWithIcon("error", "Something went wrong!", "");
  }
};

export const getSupportTicketByIdSuccess = (tickets) => async (dispatch) => {
  dispatch({
    type: MENTORS_GET_SUPPORT_TICKETS_BY_ID,
    payload: tickets,
  });
};
export const getDiscussionChatByIdSuccess = (tickets) => async (dispatch) => {
  dispatch({
    type: GET_DISCUSSION_CHAT_BY_ID,
    payload: tickets,
  });
};

export const getSupportTicketById = (id) => async (dispatch) => {
  try {
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    // const supId = encryptGlobal(
    //   JSON.stringify(id)
    // );
    let supId;
    if(typeof(id) !== "string"){
  supId = encryptGlobal(
      JSON.stringify(id)
    );
    }else{
     supId = encryptGlobal(id);

    }
    // console.log(typeof(id),"id");
    const lang = "locale=en";
    const final = lang.split("=");
    let enParamData = encryptGlobal(
      JSON.stringify({
        locale: final[1],
      })
    );
    const result = await axios
      .get(
        `${URL.getMentorSupportTicketsById}${supId}?Data=${enParamData}`,
        axiosConfig
      )
      .then((user) => user)
      .catch((err) => {
        return err.response;
      });

    if (result && result.status === 200) {
      const data = result.data.data[0];
      dispatch(getSupportTicketByIdSuccess(data));
    } else {
      openNotificationWithIcon("error", "Something went wrong!", "");
    }
  } catch (error) {
    openNotificationWithIcon("error", "Something went wrong!456", "");
  }
};
export const getDiscussionChatById = (id) => async (dispatch) => {
  try {
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    // const supId = encryptGlobal(
    //   JSON.stringify(id)
    // );
    let supId;
    if(typeof(id) !== "string"){
  supId = encryptGlobal(
      JSON.stringify(id)
    );
    }else{
     supId = encryptGlobal(id);

    }
    // console.log(typeof(id),"id");
    const lang = "locale=en";
    const final = lang.split("=");
    let enParamData = encryptGlobal(
      JSON.stringify({
        locale: final[1],
      })
    );
    const result = await axios
      .get(
        `${URL.getDiscussionChatById}${supId}?Data=${enParamData}`,
        axiosConfig
      )
      .then((user) => user)
      .catch((err) => {
        return err.response;
      });

    if (result && result.status === 200) {
      console.log(result,"id");
      const data = result.data.data[0];
      dispatch(getDiscussionChatByIdSuccess(data));
    } else {
      openNotificationWithIcon("error", "Something went wrong!", "");
    }
  } catch (error) {
    openNotificationWithIcon("error", "Something went wrong!456", "");
  }
};

export const getSupportResponseTicketById = (tickets) => async (dispatch) => {
  dispatch({
    type: MENTORS_GET_SUPPORT_TICKETS_RESPONSES_BY_ID,
    payload: tickets,
  });
};

export const getSupportResponsesTicketById = () => async (dispatch) => {
  try {
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    const result = await axios
      .get(`${URL.getMentorSupportTicketResponsesById}`, axiosConfig)
      .then((user) => user)
      .catch((err) => {
        return err.response;
      });

    if (result && result.status === 200) {
      const data = result.data.data[0];
      dispatch(getSupportResponseTicketById(data));
    } else {
      openNotificationWithIcon("error", "Something went wrong!", "");
    }
  } catch (error) {
    openNotificationWithIcon("error", "Something went wrong!", "");
  }
};
export const getTeacherPresurveyStatusSuccess = (data) => async (dispatch) => {
  dispatch({
    type: GET_TEACHERS_PRESURVEY_STATUS,
    payload: data,
  });
  console.log(data, "pree");
};

export const getTeacherPresurveyStatus = () => async (dispatch) => {
  try {
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    const result = await axios
      .get(`${URL.getPreSurveyList}?role=TEACHER`, axiosConfig)
      .then((res) => res)
      .catch((err) => {
        return err.response;
      });
    if (result && result.status === 200) {
      console.log(result, "1111");
      dispatch(getTeacherPresurveyStatusSuccess(result));
    } else {
      dispatch(getTeacherPresurveyStatusSuccess(null));
    }
  } catch (error) {
    dispatch(getTeacherPresurveyStatusSuccess(null));
  }
};

export const createSupportTicketResponse = (data) => async () => {
  try {
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    const result = await axios
      .post(`${URL.createMentorSupportTicketResponse}`, data, axiosConfig)
      .then((user) => user)
      .catch((err) => {
        return err.response;
      });

    if (result && result.status === 201) {
      // history.push('/institution/support-journey');
      openNotificationWithIcon("success", "Reply submitted successfully!", "");
    } else {
      openNotificationWithIcon("error", "Something went wrong!else", "");
    }
  } catch (error) {
    openNotificationWithIcon("error", "Something went wrong!catch", "");
  }
};
export const createDiscussionChatResponse = (data) => async () => {
  try {
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    const result = await axios
      .post(`${URL.createDiscussionChatResponse}`, data, axiosConfig)
      .then((user) => user)
      .catch((err) => {
        return err.response;
      });

    if (result && result.status === 201) {
      console.log(result,"Chat Reply");
      // history.push('/institution/support-journey');
      openNotificationWithIcon("success", "Comments Added Successfully", "");
    } else {
      openNotificationWithIcon("error", "Something went wrong!else", "");
    }
  } catch (error) {
    openNotificationWithIcon("error", "Something went wrong!catch", "");
  }
};
export const SupportTicketStatus = (message) => async (dispatch) => {
  dispatch({
    type: MENTORS_SUPPORT_TICKETS_STATUS,
    payload: { message },
  });
};

export const SupportTicketStatusChange = (id, data) => async (dispatch) => {
  try {
    dispatch({ type: MENTORS_SUPPORT_TICKETS_STATUS });
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    const chang = encryptGlobal(JSON.stringify(id));
    await axios
      .put(
        `${URL.updateSupportTicketResponse + "/" + chang}`,
        data,
        axiosConfig
      )
      .then((user) => user)
      .catch((err) => {
        return err.response;
      });
    // if (result && result.status === 200) {
    //     // const data = result.data.text;
    //     // dispatch(mentorsEditSuccess(data));

    // } else {
    //     dispatch(SupportTicketStatus(result.statusText));
    // }
  } catch (error) {
    dispatch(mentorsEditError({}));
  }
};
