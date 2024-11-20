/* eslint-disable indent */
/* eslint-disable no-empty */
import axios from "axios";

import {
  ADMIN_LOGIN_USER,
  ADMIN_LOGIN_USER_SUCCESS,
  ADMIN_LOGIN_USER_ERROR,
  toggle_header,
  Layoutstyle_data,
  ADMIN_LANGUAGE,
  GET_ADMINS,
  ADMIN_LIST_SUCCESS,
  ADMIN_LIST_ERROR
} from "../../../redux/actions.js";
import { URL, KEY } from "../../../constants/defaultValues.js";

import { setCurrentUser, getNormalHeaders ,
  openNotificationWithIcon

} from "../../../helpers/Utils.js";
import { encryptGlobal } from '../../../constants/encryptDecrypt.js';

export const getAdminSuccess = (user) => async (dispatch) => {
  dispatch({
    type: ADMIN_LOGIN_USER_SUCCESS,
    payload: user,
  });
};

export const getAdminError = (message) => async (dispatch) => {
  dispatch({
    type: ADMIN_LOGIN_USER_ERROR,
    payload: { message },
  });
};

export const adminLoginUserSuccess = (user) => async (dispatch) => {
  dispatch({
    type: ADMIN_LOGIN_USER_SUCCESS,
    payload: user,
  });
};

export const adminLoginUserError = (message) => async (dispatch) => {
  dispatch({
    type: ADMIN_LOGIN_USER_ERROR,
    payload: { message },
  });
};
export const toogleHeader_data = () => ({ type: toggle_header });
export const setToogleHeader = (payload) => ({
  type: toggle_header,
  payload,
});
export const setLayoutChange = (payload) => ({
  type: Layoutstyle_data,
  payload,
});
export const adminLoginUser = (data, navigate, module) => async (dispatch) => {
  try {
    const loginData = {
      ...data,
      passwordConfirmation: data.password,
    };
    // console.log(loginData, "aaa");
    dispatch({ type: ADMIN_LOGIN_USER });
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    const result = await axios
      .post(`${URL.adminLogin}`, loginData, axiosConfig)
      .then((user) => user)
      .catch((err) => {
        return err.response;
      });
    if (result && result.status === 200) {
      const item = result.data;
      setCurrentUser(item);
      localStorage.setItem("module", module);
      // localStorage.setItem("layoutStyling", "modern");
      localStorage.setItem("layoutStyling", "default");

      localStorage.setItem("time", new Date().toString());
      dispatch(adminLoginUserSuccess(result));

      navigate("/admin-dashboard");
    } else {
      openNotificationWithIcon("error", "Invalid Email Address or Password");
      dispatch(adminLoginUserError(result.statusText));
    }
  } catch (error) {
    dispatch(adminLoginUserError({}));
  }
};

export const adminLoginUserLogOut = (navigate) => async () => {
  try {
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    const result = await axios

      .get(`${URL.adminLogOut}`, axiosConfig)
      .then((user) => user)
      .catch((err) => {
        return err.response;
      });
    if (result && result.status === 200) {
      navigate("/admin");
      setCurrentUser();
      localStorage.removeItem("headerOption");
    }
  } catch (error) {
    console.log(error);
  }
};
export const userLogout = () => async (dispatch) => {
  dispatch({
    type: "USER_LOGOUT",
  });
};
export const getAdminGlobalLanguage = (language) => async (dispatch) => {
  dispatch({
      type: ADMIN_LANGUAGE,
      payload: language
  });
};
export const getAdmin = () => async (dispatch) => {
  try {
      dispatch({ type: GET_ADMINS });
      const axiosConfig = getNormalHeaders(KEY.User_API_Key);
      const adstatus = encryptGlobal(
          JSON.stringify({
              status: 'ALL'
          })
      );
      const result = await axios
          .get(`${URL.getAdmin + `?Data=${adstatus}`}`, axiosConfig)
          .then((user) => user)
          .catch((err) => {
              return err.response;
          });
      if (result && result.status === 200) {
          const data = result.data?.data[0]?.dataValues || [];
          let datamodify =
              data.length > 0
                  ? data.forEach((item, i) => (item.id = i + 1))
                  : [];
          console.log(datamodify);
          dispatch(getAdminSuccess(data));
      } else {
          dispatch(getAdminError(result.statusText));
      }
  } catch (error) {
      dispatch(getAdminError({}));
  }
};
export const getAdminListSuccess = (user) => async (dispatch) => {
  dispatch({
      type: ADMIN_LIST_SUCCESS,
      payload: user
  });
};
export const getAdminListError = (message) => async (dispatch) => {
  dispatch({
      type: ADMIN_LIST_ERROR,
      payload: { message }
  });
};

export const deleteTempMentorById = async (id) => {
  try {
      const axiosConfig = getNormalHeaders(KEY.User_API_Key);
      const delMent = encryptGlobal(JSON.stringify(id));
      const result = await axios
          .delete(
              `${URL.deleteTempMentor}${delMent}/deleteAllData`,
              axiosConfig
          )
          .then((res) => res)
          .catch((err) => {
              return err.response;
          });
      if (result && result.status === 202) {
          openNotificationWithIcon('success', 'Deleted Successfully');
      } else {
          openNotificationWithIcon(
              'error',
              result.data && result.data?.message
          );
      }
  } catch (error) {
      openNotificationWithIcon(
          'error',
          error.response.data && error.response.data?.message
      );
  }
};

export const teacherResetPassword = (body) => async () => {
  try {
      const axiosConfig = getNormalHeaders(KEY.User_API_Key);
      const result = await axios
          .put(`${URL.putResetPassword}`, body, axiosConfig)
          .then((user) => user)
          .catch((err) => {
              return err.response;
          });
      if (result && result.status === 202) {
          openNotificationWithIcon(
              'success',
              'Password Successfully Updated'
          );
      } else {
          openNotificationWithIcon('error', 'Something went wrong');
      }
  } catch (error) {
      openNotificationWithIcon('error', 'Something went wrong');
  }
};