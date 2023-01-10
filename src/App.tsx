import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ApiKey } from '@innexgo/frontend-auth-api';
import { AuthenticatedComponentRenderer } from '@innexgo/auth-react-components';

// public pages
import Home from './pages/Home';
import Error404 from './pages/Error404';

// register and auth pages
import { DefaultRegisterPage } from '@innexgo/auth-react-components';
import { DefaultEmailConfirmPage } from '@innexgo/auth-react-components';
import { DefaultParentPermissionConfirmPage } from '@innexgo/auth-react-components';
import { DefaultForgotPasswordPage } from '@innexgo/auth-react-components';
import { DefaultResetPasswordPage } from '@innexgo/auth-react-components';

import LightAdaptedIcon from "./img/atlas_icon_light.png";
import DarkAdaptedIcon from "./img/atlas_icon_dark.svg";

// Bootstrap CSS & JS
import './style/style.scss';
import 'bootstrap/dist/js/bootstrap';

function getPreexistingApiKey() {
  const preexistingApiKeyString = localStorage.getItem("apiKey");
  if (preexistingApiKeyString == null) {
    return null;
  } else {
    try {
      // TODO validate here
      return JSON.parse(preexistingApiKeyString) as ApiKey;
    } catch (e) {
      // try to clean up a bad config
      localStorage.setItem("apiKey", JSON.stringify(null));
      return null;
    }
  }
}

function App() {
  const [apiKey, setApiKeyState] = React.useState(getPreexistingApiKey());
  const apiKeyGetSetter = {
    apiKey: apiKey,
    setApiKey: (data: ApiKey | null) => {
      localStorage.setItem("apiKey", JSON.stringify(data));
      setApiKeyState(data);
    }
  };

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
      <Route path="/forgot_password" element={<DefaultForgotPasswordPage branding={branding} />} />
      <Route path="/reset_password" element={<DefaultResetPasswordPage branding={branding} />} />
      <Route path="/register" element={<DefaultRegisterPage {...apiKeyGetSetter} branding={branding} />} />
      <Route path="/email_confirm" element={<DefaultEmailConfirmPage {...apiKeyGetSetter} branding={branding} />} />
      <Route path="/parent_permission_confirm" element={<DefaultParentPermissionConfirmPage branding={branding} />} />

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
