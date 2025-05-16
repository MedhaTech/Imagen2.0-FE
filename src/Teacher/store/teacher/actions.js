/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import axios from "axios";

import {
  TEACHER_LOGIN_USER,
  TEACHER_LOGIN_USER_SUCCESS,
  TEACHER_LOGIN_USER_ERROR,
  GET_TEACHERS_BY_ID,
} from "../../../redux/actions.js";
import { URL, KEY } from "../../../constants/defaultValues.js";
import {
  setCurrentUser,
  getCurrentUser,
  getNormalHeaders,
  openNotificationWithIcon,
} from "../../../helpers/Utils.js";
import { encryptGlobal } from "../../../constants/encryptDecrypt.js";

export const teacherLoginUserSuccess = (user) => async (dispatch) => {
  dispatch({
    type: TEACHER_LOGIN_USER_SUCCESS,
    payload: user,
  });
};
export const getTeacherByIdSuccess = (user) => async (dispatch) => {
  dispatch({
    type: GET_TEACHERS_BY_ID,
    payload: user,
  });
};
export const teacherLoginUserError = (message) => async (dispatch) => {
  dispatch({
    type: TEACHER_LOGIN_USER_ERROR,
    payload: { message },
  });
};

export const getTeacherByID = (id) => async (dispatch) => {
  try {
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    const tecId = encryptGlobal(JSON.stringify(id));
    const result = await axios
      .get(`${URL.getTeacherById}${tecId}`, axiosConfig)
      .then((user) => user)
      .catch((err) => {
        return err.response;
      });
    if (result && result.status === 200) {
      const item = result.data.data[0];
      
      dispatch(getTeacherByIdSuccess(item));
    } else {
      openNotificationWithIcon("error", "Something went wrong");
    }
  } catch (error) {
    dispatch(getTeacherByIdSuccess(""));
  }
};

export const teacherLoginUser =
  (data, navigate, module) => async (dispatch) => {
    try {
      const loginData = {
        ...data,
        passwordConfirmation: data.password,
      };
      dispatch({ type: TEACHER_LOGIN_USER });
      const axiosConfig = getNormalHeaders(KEY.User_API_Key);
      const result = await axios
        .post(`${URL.teacherLogin}`, loginData, axiosConfig)
        .then((user) => user)
        .catch((err) => {
          return err.response;
        });
      if (result && result.status === 200) {
        const item = result.data;
        setCurrentUser(item);
        localStorage.setItem("module", module);
        localStorage.setItem("layoutStyling", "modern");

        localStorage.setItem("time", new Date().toString());
        dispatch(teacherLoginUserSuccess(result));
        navigate("/institution-dashboard");
       
      } else {
        if (result.status === 401) {
          openNotificationWithIcon(
            "error",
            "Invalid Email Id or Password"
          );
        } else {
          openNotificationWithIcon("error", "Invalid Email Id or Password");
        }
        dispatch(teacherLoginUserError(result.statusText));
      }
    } catch (error) {
      dispatch(teacherLoginUserError({}));
     
    }
  };

  

export const teacherCreateMultipleStudent =
  (data, navigate, setIsClicked) => async () => {
    try {
      const axiosConfig = getNormalHeaders(KEY.User_API_Key);
      const result = await axios
        .post(`${URL.createMultiStudent}`, data, axiosConfig)
        .then((user) => user)
        .catch((err) => {
          return err.response;
        });
      if (result && result.status === 201) {
        openNotificationWithIcon("success", result.data.data);
        navigate("/mentorteams");
        setIsClicked(false);
      } else {
        openNotificationWithIcon("error", "Something went wrong");
        setIsClicked(false);
      }
    } catch (error) {
      openNotificationWithIcon("error", error?.response?.data?.message);
      setIsClicked(false);
    }
  };
export const teacherLoginUserLogOut = (navigate) => async () => {
  try {
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    const result = await axios

      .get(`${URL.teacherLogOut}`, axiosConfig)
      .then((user) => user)
      .catch((err) => {
        return err.response;
      });
    if (result && result.status === 200) {
      setCurrentUser();
      navigate("/institution");
    }
  } catch (error) {
    console.log("Something went wrong in teachers actions");
  }
};
export const studentResetPassword = (body) => async () => {
  try {
      const axiosConfig = getNormalHeaders(KEY.User_API_Key);
      const result = await axios
          .put(`${URL.studentResetPwd}`, body, axiosConfig)
          .then((user) => user)
          .catch((err) => {
              return err.response;
          });
      if (result && result.status === 202) {
          openNotificationWithIcon(
              'success',
              'Password Updated to Mobile Number Successfully'
          );
      } else {
          openNotificationWithIcon('error', 'Something went wrong');
      }
  } catch (error) {
      openNotificationWithIcon('error', 'Something went wrong');
  }
};