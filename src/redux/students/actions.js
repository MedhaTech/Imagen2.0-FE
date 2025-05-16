/* eslint-disable indent */
import axios from "axios";

import { LOGIN_USER, LOGIN_USER_SUCCESS, LOGIN_USER_ERROR } from "../actions";
import { URL, KEY } from "../../constants/defaultValues";
import {
  setCurrentUser,
  getNormalHeaders,
  getCurrentUser,
  openNotificationWithIcon,
} from "../../helpers/Utils";
import { encryptGlobal } from "../../constants/encryptDecrypt.js";

export const loginUserSuccess = (user) => async (dispatch) => {
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: user,
  });
};

export const loginUserError = (message) => async (dispatch) => {
  dispatch({
    type: LOGIN_USER_ERROR,
    payload: { message },
  });
};

export const loginUser = (data, navigate, module) => async (dispatch) => {
  try {
    const loginData = {
      ...data,
      passwordConfirmation: data.password,
    };
    dispatch({ type: LOGIN_USER });
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);

    const result = await axios
      .post(`${URL.login}`, loginData, axiosConfig)
      .then((user) => user)
      .catch((err) => {
        return err.response;
      });
    if (result && result.status === 200) {
      const item = result.data;
      setCurrentUser(item);
      localStorage.setItem("module", module);
      localStorage.setItem("layoutStyling", "default");
      localStorage.setItem("time", new Date().toString());
      dispatch(loginUserSuccess(result)); 
      const currentUser = getCurrentUser('current_user');

       const surveyApi = encryptGlobal(
        JSON.stringify({
          user_id: currentUser?.data[0]?.user_id
        })
      );
      var config = {
        method: 'get',
        url:
          process.env.REACT_APP_API_BASE_URL +
          `/dashboard/stuPrePostStats?Data=${surveyApi}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${currentUser.data[0]?.token}`
        }
      };
      axios(config)
        .then(function (response) {
          if (response.status === 200) {
            const pre = (response.data.data[0].pre_survey_completed_date);
            if (pre === null) {
              localStorage.setItem("stupresurveystatus", "INCOMPLETED");
              navigate("/studentpresurvey");
            } else{
              localStorage.setItem("stupresurveystatus", "COMPLETED");
              navigate("/student-dashboard");
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      navigate("/student-dashboard");
    } else {
      dispatch(loginUserError(result.statusText));
      openNotificationWithIcon("error", "Invalid Email Address or Password");
    }
  } catch (error) {
    dispatch(loginUserError({}));
    
  }
};

export const loginUserLogOut = (navigate) => async () => {
  try {
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    const result = await axios
      .get(`${URL.logOut}`, axiosConfig)
      .then((user) => user)
      .catch((err) => {
        return err.response;
      });
    if (result && result.status === 200) {
      setCurrentUser();
      localStorage.removeItem("headerOption");
      navigate("/team-dashboard");
    }
  } catch (error) {
    console.log("error");
  }
};
