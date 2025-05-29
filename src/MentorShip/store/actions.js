/* eslint-disable indent */
import axios from "axios";

import {
  MENTORSHIP_LOGIN_USER,
  MENTORSHIP_LOGIN_USER_SUCCESS,
  MENTORSHIP_LOGIN_USER_ERROR,
} from "../../redux/actions.js";
import { URL, KEY } from "../../constants/defaultValues.js";
import {
  setCurrentUser,
  getNormalHeaders,
  openNotificationWithIcon,
} from "../../helpers/Utils.js";
export const mentorShipLoginUserSuccess = (user) => async (dispatch) => {
  dispatch({
    type: MENTORSHIP_LOGIN_USER_SUCCESS,
    payload: user,
  });
};
export const mentorShipLoginUserError = (message) => async (dispatch) => {
  dispatch({
    type: MENTORSHIP_LOGIN_USER_ERROR,
    payload: { message },
  });
};

export const mentorShipLoginUser =
  (data, navigate, module) => async (dispatch) => {
    try {
      const loginData = {
        ...data,
      };
      dispatch({ type: MENTORSHIP_LOGIN_USER });
      const axiosConfig = getNormalHeaders(KEY.User_API_Key);

      const result = await axios
        .post(`${URL.mentorshipLogin}`, loginData, axiosConfig)
        .then((user) => user)
        .catch((err) => {
          return err.response;
        });
      if (result && result.status === 200) {
        const item = result.data;
        setCurrentUser(item);
        localStorage.setItem("module", module);
        localStorage.setItem("time", new Date().toString());
        localStorage.setItem("layoutStyling", "default");
        dispatch(mentorShipLoginUserSuccess(result));
        navigate("/mentorship-dashboard");
      } else {
        openNotificationWithIcon("error", "Invalid Username or Password");
        dispatch(mentorShipLoginUserError(result.statusText));
      }
    } catch (error) {
      dispatch(mentorShipLoginUserError({}));
    }
  };

export const mentorShipLoginUserLogOut = (navigate) => async () => {
  try {
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    const result = await axios
      .get(`${URL.coordinatorLogOut}`, axiosConfig)
      .then((user) => user)
      .catch((err) => {
        return err.response;
      });
    if (result && result.status === 200) {
      setCurrentUser();
      localStorage.removeItem("headerOption");
      navigate("/mentor");
    }
  } catch (error) {
    console.log("error");
  }
};
