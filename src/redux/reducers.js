/* eslint-disable indent */
import { combineReducers } from "redux";
import admin from "../Admin/store/admin/reducer";
import studentRegistration from "./studentRegistration/reducers";
import teacher from "../Teacher/store/teacher/reducers";
import evaluator from "../Evaluator/store/evaluator/reducer";
import mentors from "../Teacher/store/mentors/reducer";
import teams from "../Teacher/store/teams/reducer";
import teacherCourses from "../Teacher/store/courses/reducer";
import adminCourses from "../Admin/Courses/store/adminCourses/reducer";
import teamUser from "../Team/store/reducers";
import students from "./students/reducer";
import mentorShip from "../MentorShip/store/reducer";

import home from './home/reducer';
import schoolRegistration from './schoolRegistration/reducers';
import adminEvalutors from '../Admin/store/adminEvalutors/reducer';
import adminNotifications from '../Admin/store/adminNotifications/reducer';

const reducers = combineReducers({
  admin,
  mentorShip,
  home,
  mentors,
  adminEvalutors,
  studentRegistration,
  adminNotifications,
  teacher,
  evaluator,
  teams,
  teacherCourses,
  adminCourses,
  teamUser,
  students,
  schoolRegistration
});
const rootReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    return reducers({}, action);
  }

  return reducers(state, action);
};
export default rootReducer;
