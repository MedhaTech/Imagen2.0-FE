/* eslint-disable indent */
import React from "react";
import { Route} from "react-router-dom";
// import ProductList from "../feature-module/inventory/productlist";
import Dashboard from "../Admin/Dashboard/index";
import Bulkstu from "../Admin/BulkStu/Bulkstu";
import MentorDashboard from "../Teacher/Dashboard/MentorDashboard";
const routes = all_routes;
import Pos from "../feature-module/sales/pos";
import Profile from "../Admin/AdminProfile";
import Signin from "../feature-module/pages/login/signin";
import SigninTwo from "../feature-module/pages/login/signinTwo";
import SigninThree from "../feature-module/pages/login/signinThree";
import RegisterTwo from "../feature-module/pages/register/registerTwo";
import Register from "../feature-module/pages/register/register";
import RegisterThree from "../feature-module/pages/register/registerThree";
import Forgotpassword from "../feature-module/pages/forgotpassword/forgotpassword";
import ForgotpasswordTwo from "../feature-module/pages/forgotpassword/forgotpasswordTwo";
import ForgotpasswordThree from "../feature-module/pages/forgotpassword/forgotpasswordThree";
import Resetpassword from "../feature-module/pages/resetpassword/resetpassword";
import ResetpasswordTwo from "../feature-module/pages/resetpassword/resetpasswordTwo";
import ResetpasswordThree from "../feature-module/pages/resetpassword/resetpasswordThree";
import EmailVerification from "../feature-module/pages/emailverification/emailverification";
import EmailverificationTwo from "../feature-module/pages/emailverification/emailverificationTwo";
import EmailverificationThree from "../feature-module/pages/emailverification/emailverificationThree";
import Twostepverification from "../feature-module/pages/twostepverification/twostepverification";
import TwostepverificationTwo from "../feature-module/pages/twostepverification/twostepverificationTwo";
import TwostepverificationThree from "../feature-module/pages/twostepverification/twostepverificationThree";
import Lockscreen from "../feature-module/pages/lockscreen";
import Error404 from "../feature-module/pages/errorpages/error404";
import Error500 from "../feature-module/pages/errorpages/error500";
import Comingsoon from "../feature-module/pages/comingsoon";
import Undermaintainence from "../feature-module/pages/undermaintainence";
import { all_routes } from "./all_routes";
import MentorProfile from "../Teacher/TeacherProfile";
import MentorEditProfile from "../Teacher/TeacherEdit";
import AdminPassword from "../Admin/AdminPassword";
import StateDashboard from "../Coordinators/Dashboard/StateDashboard";
// import EadminDashboard from "../Evaluator/Admin/Dashboard/EadminDashboard";
import EadminDashboard from "../Evaluator/Admin/Evaluation/index";
import CreateEmail from "../Admin/BulkEmail/CreatePopUp";
import ResendEmail from "../Admin/BulkEmail/ResendEmail";
import MentorPresurvey from "../Teacher/PreSurvey/PreSurvey";
import MentorPostsurvey from "../Teacher/PostSurvey/PostSurvey";
import MentorTeams from "../Teacher/Teams/index";
import CreatepilotStudent from "../Teacher/Teams/CreatepilotStudent";
import AddCrew1Stu from "../Teacher/Teams/Crew1student";
import AddCrew2Stu from "../Teacher/Teams/Crew2student";
import AddCrew3Stu from "../Teacher/Teams/Crew3student";
import AddStudent from "../Teacher/Teams/AddStudent";
import TecResource from "../Teacher/Resource/TecResource";
import StudentEdit from "../Teacher/Teams/StuEdit";
import TeacherCourse from "../Teacher/Courses/TeacherPlayVideo";
// import TeacherSupport from "../Teacher/Support/TeacherSupport";
import TCertificate from "../Teacher/Certificate/TCertificate";
import ChangePwd from "../Teacher/ChangePwd";
import InstructionsPage from "../Team/IdeaSubmission/InstuctionPage";
// import Idea from "../Team/IdeaSubmission/Idea";

import TeamDashboard from "../Team/TeamDashboard/DboardTeam";

import StudentDashboard from "../Team/StudentDashboard/DBStu";
import StudentTeam from "../Team/Teams/index";
import StudentTeamView from "../Team/Teams/ViewTeam";
import StudentTeamEdit from "../Team/Teams/StuEdit";
import StudentTeamAdd from "../Team/Teams/AddStudent";
import StuPostSurvey from "../Team/StuPostSurvey/StuPostSurvey";
import StuPreSurvey from "../Team/StuPreSurvey/StuPreSurvey";
import StuResource from "../Team/StuResources/StuResource";
import TeamProfile from "../Team/TeamProfile";
import StudentProfile from "../Team/StuProfile";
import StudentCP from "../Team/ChangePwd";
import StudentCertificate from "../Team/Certificate/MyCertificate";
import StudentCourse from "../Team/Courses/PlayVideo";
import StudentCourseMenu from "../Team/Courses/Index";
import Institution from "../Admin/Schools/Ticket";
import AddInstitution from "../Admin/Schools/AddNewSchool";
import Reports from "../Admin/Reports/index";
import ReportsRegistration from "../Admin/Reports/Helpers/ReportsRegistration";
import EditSchool from "../Admin/Schools/EditSchool";
import TeacherNews from "../Admin/LatestNews/TeacherNews";
import CreateLatestNews from "../Admin/LatestNews/createLatestNews";
import EditLatestNews from "../Admin/LatestNews/editLatestNews";
import Ticket from "../Admin/UsersList/Tickets";
import MentorsList from "../Admin/UsersList/MentorsList";
import TeamsList from "../Admin/UsersList/TeamsList";
import AdminsList from "../Admin/UsersList/AdminsList";
import MentorTableView from "../Admin/UsersList/MentorTableView";
import PopUp from "../Admin/PopUp/Popuplist";
import InstOption from "../Admin/InstEdit/index";
import Createpopup from "../Admin/PopUp/CreatePopUp";
import AdminResources from "../Admin/Resources/index";
import EditResource from "../Admin/Resources/editResource";
import TeacherProgressDetailed from "../Admin/Reports/Helpers/TeacherProgressDetailed";
import EmailList from "../Admin/BulkEmail/EmailList";

import CreateResource from "../Admin/Resources/createResource";

import StudentProgressReport from "../Admin/Reports/Helpers/StudentProgressReport";

import MentorView from "../Admin/UsersList/MentorView";
import MentorEdit from "../Admin/UsersList/MentorEdit";
import StudentTableView from "../Admin/UsersList/StudentTableView";
import InstTableView from "../Admin/UsersList/InstView";

import StuEdit from "../Admin/UsersList/StudentEdit";
import InstEdit from "../Admin/UsersList/InstEdit";

import AdminRes from "../Admin/AdminTickets/TicketResponse";

import AdminSupport from "../Admin/AdminTickets/Tickets";
import AddInst from "../Admin/UsersList/AddInstitution";

import TeacherSupport from "../Team/Support/TeacherSupport";
import ViewTeam from "../Teacher/Teams/ViewTeam";
import EditInstStu from "../Teacher/Teams/StuEdit";
import IdeaSubmission from "../Team/IdeaSubmission/IdeaSubmission";
import AdminInstitutionUsersList from "../Admin/UsersList/institutionList";
import AdminInstitutionProgress from "../Admin/Reports/Helpers/InstProgressReport";
import AdminIdea from "../Admin/Reports/Helpers/IdeaReport";
import StudentDiscussion from "../Team/SupportJourney/Ticket";
import StudentNewChat from "../Team/SupportJourney/AddNewTicket";
import StudentNewChatResponse from "../Team/SupportJourney/TicketResponse";

import EadminChallenges from "../Evaluator/Admin/Challenges/ViewSelectedChallenges";
import EadminProcess from "../Evaluator/Admin/EvalProcess/index";
import EadminEval from "../Evaluator/Admin/Evaluator/EadminEvaluator";
import ViewSelectedideasNew from "../Evaluator/Admin/Evaluation/ViewSelectedIdea/ViewSelectedideasNew";
import EadminFinal from "../Evaluator/Admin/Evaluation/FinalResults/ViewFinalSelectedideas";
import EadminRest from "../Evaluator/Admin/Pages/ChangePSWModal";
import EadminDist from "../Evaluator/Admin/EvalProcess/SelectingDistricts";
import ReportsCard from "../Evaluator/Admin/Reports/index";
import ReportL1 from "../Evaluator/Admin/Reports/ReportL1";
import ReportL2 from "../Evaluator/Admin/Reports/ReportL2";
import ReportL3 from "../Evaluator/Admin/Reports/ReportL3";
import EditEvaluator from "../Evaluator/Admin/Evaluator/EadminEditProfile";
import State from "../Evaluator/Admin/Evaluator/State";
import SearchCID from "../Evaluator/Admin/Dashboard/SearchCID";
import Instruction from "../Evaluator/Instructions/Instructions";
import IdeaList from "../Evaluator/IdeaList/IdeaList";
import NextLevel from "../Evaluator/IdeaList/NextLevelIdeas";
import ChangeEval from "../Evaluator/ChangePSWModal";
import EvaluateL1 from "../Evaluator/EvaluatedIdea/EvaluatedIdea";
import EvaluateL2 from "../Evaluator/EvaluatedIdea/EvaluatedIdeaL2";
import EvaluatorProfile from "../Evaluator/EvaluatorProfile";
import StuProfileEdit from "../Team/StuProfileEdit";
export const evaluatorRoutes = [
  {
    id: 1,
    path: routes.evalinstructions,
    name: "evalinstructions",
    element: <Instruction />,
    protected: true,
    route: Route,
  },
  {
    id: 2,
    path: routes.evalsubmit,
    name: "evalsubmit",
    element: <IdeaList />,
    protected: true,
    route: Route,
  },
  {
    id: 3,
    path: routes.evalsubmitwo,
    name: "evalsubmitwo",
    element: <NextLevel />,
    protected: true,
    route: Route,
  },
  {
    id: 4,
    path: routes.evalchange,
    name: "evalchange",
    element: <ChangeEval/>,
    protected: true,
    route: Route,
  },
  {
    id: 5,
    path: routes.evlL1,
    name: "evlL1",
    element: <EvaluateL1/>,
    protected: true,
    route: Route,
  },
   {
    id: 6,
    path: routes.evlL2,
    name: "evlL2",
    element: <EvaluateL2/>,
    protected: true,
    route: Route,
  },
  {
    id: 7,
    path: routes.evlProfile,
    name: "evlProfile",
    element: <EvaluatorProfile/>,
    protected: true,
    route: Route,
  },
];










export const publicRoutes = [
  {
    id: 1,
    path: routes.dashboard,
    name: "home",
    element: <Dashboard />,
    protected: true,
    route: Route,
  },
  {
    id: 2,
    path: routes.adminpassword,
    name: "adminpassword",
    protected: true,
    element: <AdminPassword />,
    route: Route,
  },
  {
    id: 3,
    path: routes.profile,
    name: "profile",
    element: <Profile />,
    protected: true,
    route: Route,
  },
  {
    id: 4,
    path: routes.institution,
    name: "institution",
    element: <Institution />,
    protected: true,
    route: Route,
  },
  {
    id: 4,
    path: routes.addinstitution,
    name: "addinstitution",
    element: <AddInstitution />,
    protected: true,
    route: Route,
  },
  {
    id: 5,
    path: routes.reports,
    name: "reports",
    element: <Reports />,
    protected: true,
    route: Route,
  },
  {
    id: 6,
    path: routes.reportsregistration,
    name: "reportsregistration",
    element: <ReportsRegistration />,
    protected: true,
    route: Route,
  },
  {
    id: 7,
    path: routes.editinstitution,
    name: "editinstitution",
    element: <EditSchool />,
    protected: true,
    route: Route,
  },
  {
    id: 8,
    path: routes.latestnews,
    name: "latestnews",
    element: < TeacherNews/>,
    protected: true,
    route: Route,
  },
  {
    id: 9,
    path: routes.createlatestnews,
    name: "createlatestnews",
    element: < CreateLatestNews/>,
    protected: true,
    route: Route,
  },
  {
    id: 10,
    path: routes.editnews,
    name: "editnews",
    element: < EditLatestNews/>,
    protected: true,
    route: Route,
  },
  {
    id: 11,
    path: routes.studentslist,
    name: "studentslist",
    element: <Ticket/>,
    protected: true,
    route: Route,
  },
  {
    id: 12,
    path: routes.mentorslist,
    name: "mentorslist",
    element: <MentorsList/>,
    protected: true,
    route: Route,
  },
  {
    id: 13,
    path: routes.teamslist,
    name: "teamslist",
    element: <TeamsList/>,
    protected: true,
    route: Route,
  },
  {
    id: 14,
    path: routes.adminlist,
    name: "adminlist",
    element: <AdminsList/>,
    protected: true,
    route: Route,
  },
  {
    id: 15,
    path: routes.mentortableview,
    name: "mentortableview",
    element: <MentorTableView/>,
    protected: true,
    route: Route,
  },
  {
    id: 16,
    path: routes.popup,
    name: "popup",
    element: <PopUp/>,
    protected: true,
    route: Route,
  },
  {
    id: 16,
    path: routes.InstOption,
    name: "InstOption",
    element: <InstOption/>,
    protected: true,
    route: Route,
  },
  {
    id: 16,
    path: routes.createpopup,
    name: "createpopup",
    element: <Createpopup/>,
    protected: true,
    route: Route,
  },
  {
    id: 17,
    path: routes.mentordetails,
    name: "mentordetails",
    element: <MentorView/>,
    protected: true,
    route: Route,
  },
  {
    id: 18,
    path: routes.mentorEdit,
    name: "mentorEdit",
    element: <MentorEdit/>,
    protected: true,
    route: Route,
  },
  {
    id: 19,
    path: routes.studenttableview,
    name: "studenttableview",
    element: <StudentTableView/>,
    protected: true,
    route: Route,
  },
  {
    id: 20,
    path: routes.stuedit,
    name: "stuedit",
    element: <StuEdit/>,
    protected: true,
    route: Route,
  },
  {
    id: 21,
    path: routes.reportsteacher,
    name: "reportsteacher",
    element: <TeacherProgressDetailed/>,
    protected: true,
    route: Route,
  },
  {
    id: 22,
    path: routes.adminresources,
    name: "adminresources",
    element: <AdminResources/>,
    protected: true,
    route: Route,
  },
  {
    id: 23,
    path: routes.createResource,
    name: "createResource",
    element: <CreateResource/>,
    protected: true,
    route: Route,
  },
  {
    id: 24,
    path: routes.editResource,
    name: "editResource",
    element: <EditResource/>,
    protected: true,
    route: Route,
  },
  {
    id: 25,
    path: routes.studentreport,
    name: "studentreport",
    element: <StudentProgressReport/>,
    protected: true,
    route: Route,
  },
  {
    id: 26,
    path: routes.adminsupport,
    name: "adminsupport",
    element: <AdminSupport/>,
    protected: true,
    route: Route,
  },
  {
    id: 27,
    path: routes.adminresponse,
    name: "adminresponse",
    element: <AdminRes />,
    protected: true,
    route: Route,
  },
  {
    id: 28,
    path: routes.institutionUsersList,
    name: "institutionUsersList",
    element: <AdminInstitutionUsersList/>,
    protected: true,
    route: Route,
  },
  {
    id: 29,
    path: routes.instprogress,
    name: "instprogress",
    element: <AdminInstitutionProgress/>,
    protected: true,
    route: Route,
  },
  {
    id: 29,
    path: routes.adminIdeareport,
    name: "adminIdeareport",
    element: <AdminIdea/>,
    protected: true,
    route: Route,
  },
  {
    id: 30,
    path: routes.adminaddinstitution,
    name: "adminaddinstitution",
    element: <AddInst/>,
    protected: true,
    route: Route,
  },
  {
    id: 31,
    path: routes.EmailList,
    name: "EmailList",
    element: <EmailList />,
    protected: true,
    route: Route,
  },
  {
    id: 32,
    path: routes.createemail,
    name: "createemail",
    element: <CreateEmail />,
    protected: true,
    route: Route,
  },
  {
    id: 33,
    path: routes.resendemail,
    name: "resendemail",
    element: <ResendEmail />,
    protected: true,
    route: Route,
  },
  {
    id: 34,
    path: routes.insttableview,
    name: "insttableview",
    element: <InstTableView/>,
    protected: true,
    route: Route,
  },
  {
    id: 35,
    path: routes.instedit,
    name: "instedit",
    element: <InstEdit />,
    protected: true,
    route: Route,
  },
   {
    id: 36,
    path: routes.Bulkstu,
    name: "Bulkstu",
    element: <Bulkstu />,
    protected: true,
    route: Route,
  },
];
// export const studentRoutes = [
//   {
//     id: 1,
//     path: routes.studentdashboard,
//     name: "studenthome",
//     element: <StudentDashboard />,
//     protected: true,
//     route: Route,
//   },
// ];
export const teamRoutes = [
  {
    id: 1,
    path: routes.teamdashboard,
    name: "teamhome",
    element: <TeamDashboard />,
    protected: true,
    route: Route,
  },
  {
    id: 2,
    path: routes.studentdashboard,
    name: "studenthome",
    element: <StudentDashboard />,
    // protected: true,
    route: Route,
  },
  {
    id: 3,
    path: routes.studentpostsurvey,
    name: "studentpostsurvey",
    element: <StuPostSurvey />,
    // protected: true,
    route: Route,
  },
  {
    id: 4,
    path: routes.studentpresurvey,
    name: "studentpresurvey",
    element: <StuPreSurvey />,
    // protected: true,
    route: Route,
  },
  {
    id: 5,
    path: routes.idea,
    name: "idea",
    element: <IdeaSubmission />,
    //protected: true,
    route: Route,
  },
  {
    id: 6,
    path: routes.teamProfile,
    name: "teamProfile",
    element: <TeamProfile />,
    // protected: true,
    route: Route,
  },
  {
    id: 7,
    path: routes.studentProfile,
    name: "studentProfile",
    element: <StudentProfile />,
    // protected: true,
    route: Route,
  },
  {
    id: 8,
    path: routes.studentCertificate,
    name: "studentCertificate",
    element: <StudentCertificate />,
    // protected: true,
    route: Route,
  },
  {
    id: 9,
    path: routes.studentcourse,
    name: "studentcourse",
    element: <StudentCourse />,
    // protected: true,
    route: Route,
  },
  
  {
    id: 10,
    path: routes.instruction,
    name: "instruction",
    element: <InstructionsPage />,
    //protected: true,
    route: Route,
  },
  {
    id: 11,
    path: routes.studentsupport,
    name: "sutentsupport",
    element: <TeacherSupport />,
    // protected: true,
    route: Route,
  },
  {
    id: 12,
    path: routes.studentresource,
    name: "studentresource",
    element: <StuResource />,
    //protected: true,
    route: Route,
  },
  {
    id: 13,
    path: routes.studentCP,
    name: "studentChangePassword",
    element: <StudentCP />,
    // protected: true,
    route: Route,
  },
  {
    id: 14,
    path: routes.studentcourseMenu,
    name: "studentcourseMenu",
    element: <StudentCourseMenu />,
    // protected: true,
    route: Route,
  },
  {
    id: 15,
    path: routes.studentTeam,
    name: "studentTeam",
    element: <StudentTeam />,
    // protected: true,
    route: Route,
  },
  {
    id: 16,
    path: routes.studentTeamView,
    name: "studentTeamView",
    element: <StudentTeamView />,
    route: Route,
  },
  {
    id: 17,
    path: routes.studentTeamEdit,
    name: "studentTeamEdit",
    element: <StudentTeamEdit />,
    route: Route,
  },
  {
    id: 18,
    path: routes.studentTeamAdd,
    name: "studentTeamAdd",
    element: <StudentTeamAdd />,
    route: Route,
  },
  {
    id: 19,
    path: routes.discussionlist,
    name: "discussionlist",
    element: <StudentDiscussion />,
    route: Route,
  },
  {
    id: 20,
    path: routes.newchat,
    name: "newchat",
    element: <StudentNewChat />,
    route: Route,
  },

 {
    id: 21,
    path: routes.discussionChatResponse,
    name: "discussionChatResponse",
    element: <StudentNewChatResponse />,
    route: Route,
  },
  {
    id: 22,
    path: routes.studentProfileEdit,
    name: "studentProfileEdit",
    element: <StuProfileEdit />,
    // protected: true,
    route: Route,
  },
];
export const mentorRoutes = [
  {
    id: 1,
    path: routes.mentordashboard,
    name: "mentorhome",
    element: <MentorDashboard />,
    protected: true,
    route: Route,
  },
  {
    id: 2,
    path: routes.mentorprofile,
    name: "mentorprofile",
    element: <MentorProfile />,
    protected: true,
    route: Route,
  },
  {
    id: 3,
    path: routes.mentoreditprofile,
    name: "mentoreditprofile",
    element: <MentorEditProfile />,
    protected: true,
    route: Route,
  },
  {
    id: 4,
    path: routes.mentorpresurvey,
    name: "mentorpresurvey",
    element: <MentorPresurvey />,
    protected: true,
    route: Route,
  },

  {
    id: 5,
    path: routes.mentorteams,
    name: "mentorteams",
    element: <MentorTeams />,
    protected: true,
    route: Route,
  },
  {
    id: 6,
    path: routes.mentorpostsurvey,
    name: "mentorpostsurvey",
    element: <MentorPostsurvey />,
    protected: true,
    route: Route,
  },
  {
    id: 7,
    path: routes.CreatepilotStudent,
    name: "CreatepilotStudent",
    element: <CreatepilotStudent />,
    protected: true,
    route: Route,
  },
  {
    id: 8,
    path: routes.addstudent,
    name: "addstudent",
    element: <AddStudent />,
    protected: true,
    route: Route,
  },
  {
    id: 9,
    path: routes.tecresource,
    name: "tecresource",
    element: <TecResource />,
    protected: true,
    route: Route,
  },
  {
    id: 10,
    path: routes.studentedit,
    name: "studentedit",
    element: <StudentEdit />,
    protected: true,
    route: Route,
  },
  {
    id: 11,
    path: routes.mentorcourse,
    name: "mentorcourse",
    element: <TeacherCourse />,
    protected: true,
    route: Route,
  },
  {
    id: 12,
    path: routes.mentorsupport,
    name: "mentorsupport",
    element: <TeacherSupport />,
    protected: true,
    route: Route,
  },
  {
    id: 13,
    path: routes.mentorcertificate,
    name: "mentorcertificate",
    element: <TCertificate />,
    protected: true,
    route: Route,
  },
  {
    id: 13,
    path: routes.mentorchangepwd,
    name: "mentorchangepwd",
    element: <ChangePwd />,
    protected: true,
    route: Route,
  },
  { 
   id: 14,
    path: routes.AddCrew1Stu,
    name: "AddCrew1Stu",
    element: <AddCrew1Stu />,
    protected: true,
    route: Route,
  },
  { 
    id: 15,
     path: routes.AddCrew2Stu,
     name: "AddCrew2Stu",
     element: <AddCrew2Stu />,
     protected: true,
     route: Route,
   },
   { 
    id: 16,
     path: routes.AddCrew3Stu,
     name: "AddCrew3Stu",
     element: <AddCrew3Stu />,
     protected: true,
     route: Route,
   },
   { 
    id: 17,
     path: routes.institutionview,
     name: "institutionview",
     element: <ViewTeam />,
     protected: true,
     route: Route,
   },
   { 
    id: 18,
     path: routes.inststuedit,
     name: "inststuedit",
     element: <EditInstStu />,
     protected: true,
     route: Route,
   },
  
];
export const stateRoutes = [
  {
    id: 1,
    path: routes.statedashboard,
    name: "statehome",
    element: <StateDashboard />,
    protected: true,
    route: Route,
  },
];
export const eadminRoutes = [
  {
    id: 1,
    path: routes.eadminevaluation,
    name: "eadminevaluation",
    element: <EadminDashboard />,
    protected: true,
    route: Route,
  },
  {
    id: 2,
    path: routes.eadmindashboard,
    name: "eadminhome",
    element: <EadminChallenges />,
    protected: true,
    route: Route,
  },
  {
    id: 3,
    path: routes.eadminEvaluationProcess,
    name: "eadminEvaluationProcess",
    element: <EadminProcess />,
    protected: true,
    route: Route,
  },
  {
    id: 4,
    path: routes.eadminevaluator,
    name: "eadminevaluator",
    element: <EadminEval />,
    protected: true,
    route: Route,
  },
  {
    id: 5,
    path: routes.eadminstats,
    name: "eadminstats",
    element: <ViewSelectedideasNew/>,
    protected: true,
    route: Route,
  },
  {
    id: 6,
    path: routes.eadminfinal,
    name: "eadminfinal",
    element: <EadminFinal/>,
    protected: true,
    route: Route,
  },
  {
    id: 7,
    path: routes.eadminRest,
    name: "eadminRest",
    element: <EadminRest/>,
    protected: true,
    route: Route,
  },
  {
    id: 8,
    path: routes.eadminDist,
    name: "eadminDist",
    element: <EadminDist/>,
    protected: true,
    route: Route,
  },
  {
    id: 9,
    path: routes.evalState,
    name: "evalState",
    element: <State/>,
    protected: true,
    route: Route,
  },
  {
    id: 10,
    path: routes.evalReports,
    name: "evalReports",
    element: <ReportsCard/>,
    protected: true,
    route: Route,
  },
  {
    id: 11,
    path: routes.evalL1,
    name: "evalL1",
    element: <ReportL1/>,
    protected: true,
    route: Route,
  },
  {
    id: 12,
    path: routes.evalL2,
    name: "evalL2",
    element: <ReportL2/>,
    protected: true,
    route: Route,
  }, {
    id: 13,
    path: routes.evalL3,
    name: "evalL3",
    element: <ReportL3/>,
    protected: true,
    route: Route,
  }
  , {
    id: 14,
    path: routes.editeval,
    name: "editeval",
    element: <EditEvaluator/>,
    protected: true,
    route: Route,
  }
  , {
    id: 15,
    path: routes.searchCid,
    name: "searchCid",
    element: <SearchCID/>,
    protected: true,
    route: Route,
  },
];
export const posRoutes = [
  {
    id: 1,
    path: routes.pos,
    name: "pos",
    element: <Pos />,
    route: Route,
  },
];

export const pagesRoute = [
  {
    id: 1,
    path: routes.signin,
    name: "signin",
    element: <Signin />,
    route: Route,
  },
  {
    id: 2,
    path: routes.signintwo,
    name: "signintwo",
    element: <SigninTwo />,
    route: Route,
  },
  {
    id: 3,
    path: routes.signinthree,
    name: "signinthree",
    element: <SigninThree />,
    route: Route,
  },
  {
    id: 4,
    path: routes.register,
    name: "register",
    element: <Register />,
    route: Route,
  },
  {
    id: 5,
    path: routes.registerTwo,
    name: "registerTwo",
    element: <RegisterTwo />,
    route: Route,
  },
  {
    id: 6,
    path: routes.registerThree,
    name: "registerThree",
    element: <RegisterThree />,
    route: Route,
  },
  {
    id: 7,
    path: routes.forgotPassword,
    name: "forgotPassword",
    element: <Forgotpassword />,
    route: Route,
  },
  {
    id: 7,
    path: routes.forgotPasswordTwo,
    name: "forgotPasswordTwo",
    element: <ForgotpasswordTwo />,
    route: Route,
  },
  {
    id: 8,
    path: routes.forgotPasswordThree,
    name: "forgotPasswordThree",
    element: <ForgotpasswordThree />,
    route: Route,
  },
  {
    id: 9,
    path: routes.resetpassword,
    name: "resetpassword",
    element: <Resetpassword />,
    route: Route,
  },
  {
    id: 10,
    path: routes.resetpasswordTwo,
    name: "resetpasswordTwo",
    element: <ResetpasswordTwo />,
    route: Route,
  },
  {
    id: 11,
    path: routes.resetpasswordThree,
    name: "resetpasswordThree",
    element: <ResetpasswordThree />,
    route: Route,
  },
  {
    id: 12,
    path: routes.emailverification,
    name: "emailverification",
    element: <EmailVerification />,
    route: Route,
  },
  {
    id: 12,
    path: routes.emailverificationTwo,
    name: "emailverificationTwo",
    element: <EmailverificationTwo />,
    route: Route,
  },
  {
    id: 13,
    path: routes.emailverificationThree,
    name: "emailverificationThree",
    element: <EmailverificationThree />,
    route: Route,
  },
  {
    id: 14,
    path: routes.twostepverification,
    name: "twostepverification",
    element: <Twostepverification />,
    route: Route,
  },
  {
    id: 15,
    path: routes.twostepverificationTwo,
    name: "twostepverificationTwo",
    element: <TwostepverificationTwo />,
    route: Route,
  },
  {
    id: 16,
    path: routes.twostepverificationThree,
    name: "twostepverificationThree",
    element: <TwostepverificationThree />,
    route: Route,
  },
  {
    id: 17,
    path: routes.lockscreen,
    name: "lockscreen",
    element: <Lockscreen />,
    route: Route,
  },
  {
    id: 18,
    path: routes.error404,
    name: "error404",
    element: <Error404 />,
    route: Route,
  },
  {
    id: 19,
    path: routes.error500,
    name: "error500",
    element: <Error500 />,
    route: Route,
  },
  {
    id: 20,
    path: routes.comingsoon,
    name: "comingsoon",
    element: <Comingsoon />,
    route: Route,
  },
  {
    id: 21,
    path: routes.undermaintenance,
    name: "undermaintenance",
    element: <Undermaintainence />,
    route: Route,
  },
];
