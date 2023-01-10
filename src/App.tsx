import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ApiKey } from '@innexgo/frontend-auth-api';

// public pages
import Home from './pages/Home';
import Error404 from './pages/Error404';

// register and auth pages
import RegisterPage from './pages/Register';
import EmailConfirmPage from './pages/EmailConfirm';
import ParentPermissionConfirmPage from './pages/ParentPermissionConfirm';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';

import LightAdaptedIcon from "./img/atlas_icon_light.png";
import DarkAdaptedIcon from "./img/atlas_icon_dark.svg";

// Bootstrap CSS & JS
import './style/style.scss';
import 'bootstrap/dist/js/bootstrap';

function App() {
  const branding = {
    name: "Open Source Prisoner's Dilemma",
    tagline: "Battle your bots!",
    homeUrl: "/",
    registerUrl: "/register",
    tosUrl: "/terms_of_service",
    forgotPasswordUrl: "/forgot_password",
    dashboardUrl: "/dashboard",
    instructionsUrl: "/#instructions",
    darkAdaptedIcon: DarkAdaptedIcon,
    lightAdaptedIcon: LightAdaptedIcon,
  }

  return <BrowserRouter>
    <Routes>
      {/* Our home page */}
      <Route path="/" element={<Home branding={branding} />} />

      {/* Necessary for the backend auth service */}
      <Route path="/forgot_password" element={<ForgotPasswordPage branding={branding} />} />
      <Route path="/reset_password" element={<ResetPasswordPage branding={branding} />} />
      <Route path="/register" element={<RegisterPage {...apiKeyGetSetter} branding={branding} />} />
      <Route path="/email_confirm" element={<EmailConfirmPage {...apiKeyGetSetter} branding={branding} />} />
      <Route path="/parent_permission_confirm" element={<ParentPermissionConfirmPage branding={branding} />} />

      {/* Requires you to be logged in */}
      <Route path="/dashboard" element={<AuthenticatedComponentRenderer branding={branding} {...apiKeyGetSetter} component={Dashboard} />} />
      <Route path="/account" element={<AuthenticatedComponentRenderer branding={branding} {...apiKeyGetSetter} component={Account} />} />
      <Route path="/help" element={<AuthenticatedComponentRenderer branding={branding} {...apiKeyGetSetter} component={Help} />} />
      {/* Competition Pages */}
      <Route path="/compete" element={<AuthenticatedComponentRenderer branding={branding} {...apiKeyGetSetter} component={Compete} />} />
      <Route path="/tournament" element={<AuthenticatedComponentRenderer branding={branding} {...apiKeyGetSetter} component={ViewTournament} />} />
      <Route path="/tournament_submission" element={<AuthenticatedComponentRenderer branding={branding} {...apiKeyGetSetter} component={ViewTournamentSubmission} />} />
      <Route path="/match_resolution" element={<AuthenticatedComponentRenderer branding={branding} {...apiKeyGetSetter} component={ViewMatchResolution} />} />

      {/* Error page */}
      <Route path="*" element={<Error404 />} />
    </Routes >
  </BrowserRouter >
}

export default App;
