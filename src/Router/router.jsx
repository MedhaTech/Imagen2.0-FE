/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Header from "../InitialPage/Sidebar/Header";
import MentorHeader from "../InitialPage/Sidebar/TeacherHeader";
import StateHeader from "../InitialPage/Sidebar/stateHeader";
import TeamHeader from "../InitialPage/Sidebar/TeamHeader";


import HorizontalSidebar from "../InitialPage/Sidebar/horizontalSidebar";

import {
  // pagesRoute,
  teamRoutes,
  publicRoutes,
  mentorRoutes,
  stateRoutes,
  eadminRoutes,
  evaluatorRoutes,mentorShipRoutes

} from "./router.link";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import ThemeSettings from "../InitialPage/themeSettings";
import LoginPage from "../RegPage/LoginPage";
import LogInTeacher from "../Teacher/LogInTeacher";
import AdminLogin from "../Admin/AdminLogin";
import StateLogin from "../Coordinators/LogInNew";
import "../i18n";

import NonAtlPage from "../RegPage/NonAtlPage";
import AtlSucess from "../RegPage/AtlSucess";
import NonAtlSuccess from "../RegPage/NonAtlSuccess";
import { ProtectedRoute } from "../helpers/authHelper";
import AdminSidebar from "../InitialPage/Sidebar/Sidebar";
import StateSidebar from "../InitialPage/Sidebar/stateSidebar";
import EadminLogin from "../Evaluator/Admin/EadminLogin";
import EadminHeader from "../InitialPage/Sidebar/eadminHeader";
import EadminSidebar from "../InitialPage/Sidebar/eadminSidebar";
import LogInTeam from "../Team/LogInTeam";
import TeacherPSW from "../Teacher/forgotPass";
import StudentPSW from "../Team/forgotPass";
import RegInstruction from "../RegPage/RegInstruction";
import PilotReg from "../RegPage/PilotReg";
import RegSuccess from "../RegPage/RegSuccess";
import Crew1Reg from "../RegPage/Crew1Reg";
import Crew2Reg from "../RegPage/Crew2Reg";
import Crew3Reg from "../RegPage/Crew3Reg";
import InstitutionReg from "../RegPage/InstReg";
import StudentSidebar from "../InitialPage/Sidebar/StudedentSidebar";
import ApEmailValidation from "../RegPage/ApEmailValidation";
import EvalHeader from "../InitialPage/Sidebar/evalHeader";
import LoginEvaluator from "../Evaluator/LoginEvaluator";

import EvalSidebar from "../InitialPage/Sidebar/evalSidebar";
import MentorRegister from "../RegPage/Mentor/MentorReg";
import MentorSuccess from "../RegPage/Mentor/MentorSuccess";
import MentorLogin from "../MentorShip/MentorLogin";
import MentorshipHead from "../InitialPage/Sidebar/MentorshipHeader";
import MentorshipSide from "../InitialPage/Sidebar/MentorshipSidebar";

const AllRoutes = () => {
  const data = useSelector((state) => state?.admin?.toggle_header);
  const HeaderLayout = () => (
    <div className={`main-wrapper ${data ? "header-collapse" : ""}`}>
      <Header />
      <AdminSidebar />
      <Outlet />
      <ThemeSettings />
    </div>
  );
  const MentorHeaderLayout = () => (
    <div className={`main-wrapper ${data ? "header-collapse" : ""}`}>
      <MentorHeader />
      <HorizontalSidebar />

      <Outlet />
      <ThemeSettings />
    </div>
  );
  const TeamHeaderLayout = () => (
    <div className={`main-wrapper ${data ? "header-collapse" : ""}`}>
      <TeamHeader />
<StudentSidebar/>
      <Outlet />
      <ThemeSettings />
    </div>
  );
  const EadminHeaderLayout = () => (
    <div className={`main-wrapper ${data ? "header-collapse" : ""}`}>
      <EadminHeader />
      <EadminSidebar />

      <Outlet />
      <ThemeSettings />
    </div>
  );
  const EvaluatorHeaderLayout = () => (
    <div className={`main-wrapper ${data ? "header-collapse" : ""}`}>
      <EvalHeader />
      <EvalSidebar />

      <Outlet />
      <ThemeSettings />
    </div>
  );
 
  const StateHeaderLayout = () => (
    <div className={`main-wrapper ${data ? "header-collapse" : ""}`}>
      <StateHeader />
      <StateSidebar />

      <Outlet />
      <ThemeSettings />
    </div>
  );
   const MentorShipHeaderLayout = () => (
    <div className={`main-wrapper ${data ? "header-collapse" : ""}`}>
      <MentorshipHead/>
      <MentorshipSide />

      <Outlet />
      <ThemeSettings />
    </div>
  );

  // const Authpages = () => (
  //   <div className={data ? "header-collapse" : ""}>
  //     <Outlet />
  //     <ThemeSettings />
  //   </div>
  // );

 
  function MyComponent() {
    window.location.href = `${process.env.REACT_APP_LANDING_PAGE_URL}`;
    return null;
}
  return (
    <div>
      <Routes>
        

        <Route path="/" exact={true} element={<MyComponent />} />
        <Route path="/">
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mentor-registration" element={<MentorRegister />} />
          <Route path="/mentor" element={<MentorLogin />} />

          <Route path="/mentor-success" element={<MentorSuccess />} />
          <Route path="/email" element={<ApEmailValidation/>} />
          <Route path="/institution-registration" element={<InstitutionReg />} />
          <Route path="/atl-success" element={<AtlSucess />} />
          <Route path="/non-atl-success" element={<NonAtlSuccess />} />
          <Route path="/non-atl-register" element={<NonAtlPage />} />
          <Route path="/institution-forgot-psw" element={<TeacherPSW />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/state" element={<StateLogin />} />
          <Route path="/eadmin" element={<EadminLogin />} />
          <Route path="/student" element={<LogInTeam />} />
          <Route path="/student-forgot-psw" element={<StudentPSW />} />
          <Route path="/institution" element={<LogInTeacher />} />
          <Route path="/evaluator" element={<LoginEvaluator />} />
          <Route path="/registration" element={<RegInstruction />} />
          <Route path="/pilotReg" element={<PilotReg />} />
          <Route path="/crew1Reg" element={<Crew1Reg />} />
          <Route path="/crew2Reg" element={<Crew2Reg />} />
          <Route path="/crew3Reg" element={<Crew3Reg />} />
          <Route path="/regSuccess" element={<RegSuccess />} />
        </Route>
        <Route path="/" element={<HeaderLayout />}>
          {publicRoutes.map((route, id) => (
            <Route
              key={id}
              path={route.path}
              element={
                route.protected ? (
                  <ProtectedRoute user="ADMIN">{route.element}</ProtectedRoute>
                ) : (
                  route.element
                )
              }
            />
          ))}
        </Route>
        <Route path="/" element={<MentorHeaderLayout />}>
          {mentorRoutes.map((route, id) => (
            <Route
              key={id}
              path={route.path}
              element={
                route.protected ? (
                  <ProtectedRoute user="MENTOR">{route.element}</ProtectedRoute>
                ) : (
                  route.element
                )
              }
            />
          ))}
        </Route>
        <Route path="/" element={<TeamHeaderLayout />}>
          {teamRoutes.map((route, id) => (
            <Route
              key={id}
              path={route.path}
              element={
                route.protected ? (
                  <ProtectedRoute user="TEAM">{route.element}</ProtectedRoute>
                ) : (
                  route.element
                )
              }
            />
          ))}
        </Route>
        <Route path="/" element={<EadminHeaderLayout />}>
          {eadminRoutes.map((route, id) => (
            <Route
              key={id}
              path={route.path}
              element={
                route.protected ? (
                  <ProtectedRoute user="EADMIN">{route.element}</ProtectedRoute>
                ) : (
                  route.element
                )
              }
            />
          ))}
        </Route>
        <Route path="/" element={<StateHeaderLayout />}>
          {stateRoutes.map((route, id) => (
            <Route
              key={id}
              path={route.path}
              element={
                route.protected ? (
                  <ProtectedRoute user="STATE">{route.element}</ProtectedRoute>
                ) : (
                  route.element
                )
              }
            />
          ))}
        </Route>
        <Route path="/" element={<EvaluatorHeaderLayout />}>
          {evaluatorRoutes.map((route, id) => (
            <Route
              key={id}
              path={route.path}
              element={
                route.protected ? (
                  <ProtectedRoute user="EVALUATOR">{route.element}</ProtectedRoute>
                ) : (
                  route.element
                )
              }
            />
          ))}
        </Route>
        <Route path="/" element={<MentorShipHeaderLayout />}>
          {mentorShipRoutes.map((route, id) => (
            <Route
              key={id}
              path={route.path}
              element={
                route.protected ? (
                  <ProtectedRoute user="MENTORSHIP">{route.element}</ProtectedRoute>
                ) : (
                  route.element
                )
              }
            />
          ))}
        </Route>
        {/* <Route path={"/"} element={<Authpages />}>
          {pagesRoute.map((route, id) => (
            <Route path={route.path} element={route.element} key={id} />
          ))}
        </Route> */}
      </Routes>
    </div>
  );
};
export default AllRoutes;
