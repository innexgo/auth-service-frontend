import React from "react";
import { Card, Button } from "react-bootstrap";
import { ApiKey, Email } from "@innexgo/frontend-auth-api";
import LoginForm from '../components/LoginForm';
import { Branding } from '@innexgo/common-react-components';
import DefaultSidebarLayout from '../components/SidebarLayout';
import SendVerificationChallengeForm from "../components/SendVerificationChallengeForm";

export interface AuthenticatedComponentRendererProps {
  branding: Branding,
  apiKey: ApiKey | null,
  setApiKey: (data: ApiKey | null) => void
}

function Login({
  branding,
  component: AuthenticatedComponent,
  apiKey,
  setApiKey,

}: AuthenticatedComponentRendererProps) {
  // the email we sent to
  const [sentEmail, setSentEmail] = React.useState<string | null>(null);
  const [sentParentEmail, setSentParentEmail] = React.useState<string | null>(null);

  const isAuthenticated = apiKey !== null &&
    apiKey.creationTime + apiKey.duration > Date.now() &&
    apiKey.apiKeyKind === "VALID";

  if (isAuthenticated) {
    return <AuthenticatedComponent apiKey={apiKey!} setApiKey={setApiKey} branding={branding} />
  }

  const notLoggedIn = apiKey === null ||
    apiKey.creationTime + apiKey.duration <= Date.now() ||
    apiKey.apiKeyKind === "CANCEL";

  if (notLoggedIn) {
    return <DefaultSidebarLayout branding={branding}>
      <div className="h-100 w-100 d-flex">
        <Card className="mx-auto my-auto col-md-6">
          <Card.Body>
            <Card.Title>Login</Card.Title>
            <LoginForm branding={branding} onSuccess={setApiKey} />
          </Card.Body>
        </Card>
      </div>
    </DefaultSidebarLayout>
  }

  if (sentEmail !== null) {
    return <DefaultSidebarLayout branding={branding}>
      <div className="h-100 w-100 d-flex">
        <Card className="mx-auto my-auto col-md-6">
          <Card.Body>
            <Card.Title>Verfication Email Sent!</Card.Title>
            <Card.Text>
              We successfully sent an email to {sentEmail}.
              You should use the link provided in the email to finish setting up your account.
              If you don't see our email, reload this page and try again.
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </DefaultSidebarLayout>
  }

  if (sentParentEmail !== null) {
    return <DefaultSidebarLayout branding={branding}>
      <div className="h-100 w-100 d-flex">
        <Card className="mx-auto my-auto col-md-6">
          <Card.Body>
            <Card.Title>Parent Verfication Email Sent!</Card.Title>
            <Card.Text>
              We successfully sent an email to {sentParentEmail}.
            </Card.Text>
            <Card.Text>
              If your parents don't see our email, reload this page and try again.
              Once your parent approves your account, you should be able to log in normally.
            </Card.Text>
            <Button onClick={() => setApiKey(null)}>Log In</Button>
          </Card.Body>
        </Card>
      </div>
    </DefaultSidebarLayout>
  }


  if (apiKey.apiKeyKind === "NO_EMAIL") {
    return <DefaultSidebarLayout branding={branding}>
      <div className="h-100 w-100 d-flex">
        <Card className="mx-auto my-auto col-md-6">
          <Card.Body>
            <Card.Title>Verify Your Email</Card.Title>
            <SendVerificationChallengeForm
              toParent={false}
              initialEmailAddress=""
              setVerificationChallenge={x => setSentEmail(x.email)}
              apiKey={apiKey}
            />
          </Card.Body>
        </Card>
      </div>
    </DefaultSidebarLayout>
  } else {
    return <DefaultSidebarLayout branding={branding}>
      <div className="h-100 w-100 d-flex">
        <Card className="mx-auto my-auto col-md-6">
          <Card.Body>
            <Card.Title>Verify Parent Email</Card.Title>
            <Card.Text>
              Because you indicated you are under 13, we need parent permission to finish setting up your account.
            </Card.Text>
            <SendVerificationChallengeForm
              toParent={true}
              initialEmailAddress=""
              setVerificationChallenge={x => setSentParentEmail(x.email)}
              apiKey={apiKey}
            />
          </Card.Body>
        </Card>
      </div>
    </DefaultSidebarLayout >
  }
}

export default Login;
