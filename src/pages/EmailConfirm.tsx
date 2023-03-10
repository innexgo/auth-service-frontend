import React from 'react';
import { Card, Button, Form } from "react-bootstrap";
import { Formik, FormikHelpers, FormikErrors } from 'formik'
import { ApiKey, Email, emailNew } from '@innexgo/frontend-auth-api';
import { isErr } from '@innexgo/frontend-common';
import { Branding } from '@innexgo/common-react-components';
import SidebarLayout from '../components/SidebarLayout';

type CreateEmailProps = {
  verificationChallengeKey: string;
  postSubmit: (email: Email) => void;
}

function CreateEmail(props: CreateEmailProps) {
  type CreateEmailValue = {}

  const onSubmit = async (_: CreateEmailValue,
    fprops: FormikHelpers<CreateEmailValue>) => {

    let errors: FormikErrors<CreateEmailValue> = {};

    // Validate input

    let hasError = false;
    fprops.setErrors(errors);
    if (hasError) {
      return;
    }

    const maybeEmail = await emailNew({
      verificationChallengeKey: props.verificationChallengeKey,
      toParent: false
    });

    if (isErr(maybeEmail)) {
      switch (maybeEmail.Err) {
        case "VERIFICATION_CHALLENGE_NONEXISTENT": {
          fprops.setStatus({
            failureResult: "This link is invalid.",
            successResult: ""
          });
          break;
        }
        case "VERIFICATION_CHALLENGE_USED": {
          fprops.setStatus({
            failureResult: "This link has already been used.",
            successResult: ""
          });
          break;
        }
        case "VERIFICATION_CHALLENGE_WRONG_KIND": {
          fprops.setStatus({
            failureResult: "This link is the wrong kind.",
            successResult: ""
          });
          break;
        }
        case "VERIFICATION_CHALLENGE_TIMED_OUT": {
          fprops.setStatus({
            failureResult: "This link has timed out.",
            successResult: ""
          });
          break;
        }
        case "EMAIL_EXISTENT": {
          fprops.setStatus({
            failureResult: "This user already exists.",
            successResult: ""
          });
          break;
        }
        default: {
          fprops.setStatus({
            failureResult: "An unknown or network error has occured while trying to register.",
            successResult: ""
          });
          break;
        }
      }
      return;
    }

    fprops.setStatus({
      failureResult: "",
      successResult: "Email Created"
    });
    // execute callback
    props.postSubmit(maybeEmail.Ok);
  }

  return <>
    <Formik<CreateEmailValue>
      onSubmit={onSubmit}
      initialValues={{
        name: "",
      }}
      initialStatus={{
        failureResult: "",
        successResult: ""
      }}
    >
      {(fprops) => <>
        <Form
          noValidate
          onSubmit={fprops.handleSubmit} >
          <div hidden={fprops.status.successResult !== ""}>
            <Button type="submit">Complete Registration</Button>
            <br />
            <Form.Text className="text-danger">{fprops.status.failureResult}</Form.Text>
          </div>
          <Form.Text className="text-success">{fprops.status.successResult}</Form.Text>
        </Form>
      </>}
    </Formik>
  </>
}

type EmailConfirmProps = {
  branding: Branding,
  apiKey: ApiKey | null,
  setApiKey: (a: ApiKey | null) => void
}


function EmailConfirm(props: EmailConfirmProps) {

  const [email, setEmail] = React.useState<Email | null>(null);

  return (
    <SidebarLayout branding={props.branding}>
      <div className="h-100 w-100 d-flex">
        <Card className="mx-auto my-auto col-md-6">
          <Card.Body>
            <Card.Title>Confirm Email</Card.Title>
            {
              email !== null
                ? <Card.Text>
                  Your email ({email.verificationChallenge.email}), has been confirmed.
                  Click <a href={props.branding.dashboardUrl}>here</a> to login.
                </Card.Text>
                : <CreateEmail
                  verificationChallengeKey={
                    (new URLSearchParams(window.location.search).get("verificationChallengeKey") ?? "")
                      .replace(' ', '+')
                  }
                  postSubmit={e => {
                    // if email is upgraded, then you need to re-log-in
                    if (props.apiKey?.apiKeyKind === "NO_EMAIL") {
                      props.setApiKey(null);
                    }
                    setEmail(e);
                  }}
                />
            }
          </Card.Body>
        </Card>
      </div>
    </SidebarLayout>
  )
}

export default EmailConfirm;
