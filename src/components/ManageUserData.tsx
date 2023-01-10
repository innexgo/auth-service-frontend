import React from 'react';
import { Table } from 'react-bootstrap';
import { Action, DisplayModal} from '@innexgo/common-react-components';
import { Pencil, Lock, EnvelopePlus } from 'react-bootstrap-icons';
import format from 'date-fns/format';
import { UserData, Email, ApiKey } from '@innexgo/frontend-auth-api';

import EditUserDataForm from '../components/EditUserDataForm';
import SendVerificationChallengeForm from '../components/SendVerificationChallengeForm';
import ManagePassword from '../components/ManagePassword';

const ManageUserData = (props: {
  userData: UserData,
  setUserData: (userData: UserData) => void,
  email: Email,
  apiKey: ApiKey,
}) => {

  const [sentEmail, setSendEmail] = React.useState(false);

  const [showEditUserData, setShowEditUserData] = React.useState(false);
  const [showChangeEmail, setShowChangeEmail] = React.useState(false);
  const [showChangePassword, setShowChangePassword] = React.useState(false);

  return <>
    <Table hover bordered>
      <tbody>
        <tr>
          <th>Name</th>
          <td>{props.userData.realname}</td>
        </tr>
        <tr>
          <th>Username</th>
          <td>{props.userData.username}</td>
        </tr>
        <tr>
          <th>Date of Birth</th>
          <td>{format(props.userData.dateofbirth, 'MMM do, yyyy')}</td>
        </tr>
        <tr>
          <th>Email</th>
          <td>
            <table>
              <tr>
                <td>
                  {props.email.verificationChallenge.email}
                  {sentEmail ? <span className="text-danger">*</span> : null}
                </td>
              </tr>
              {
                sentEmail
                  ? <tr>
                    <td>
                      <small className="text-muted">Check your email for instructions to finish the email change process.</small>
                    </td>
                  </tr>
                  : null
              }
            </table>
          </td>
        </tr>

      </tbody>
    </Table>
    <Action
      title="Edit Personal Information"
      icon={Pencil}
      onClick={() => setShowEditUserData(true)}
    />
    <Action
      title="Change Email"
      icon={EnvelopePlus}
      onClick={() => setShowChangeEmail(true)}
    />
    <Action
      title="Change Password"
      icon={Lock}
      onClick={() => setShowChangePassword(true)}
    />

    <DisplayModal
      title="Edit Personal Information"
      show={showEditUserData}
      onClose={() => setShowEditUserData(false)}
    >
      <EditUserDataForm
        userData={props.userData}
        apiKey={props.apiKey}
        setUserData={userData => {
          setShowEditUserData(false);
          props.setUserData(userData);
        }}
      />
    </DisplayModal>
    <DisplayModal
      title="Change Email"
      show={showChangePassword}
      onClose={() => setShowChangePassword(false)}
    >
      <ManagePassword
        apiKey={props.apiKey}
        onSuccess={() => {
          setShowChangePassword(false);
        }}
      />
    </DisplayModal>
    <DisplayModal
      title="Change Email"
      show={showChangeEmail}
      onClose={() => setShowChangeEmail(false)}
    >
      <SendVerificationChallengeForm
        toParent={false}
        initialEmailAddress={props.email.verificationChallenge.email}
        apiKey={props.apiKey}
        setVerificationChallenge={() => { setShowChangeEmail(false); setSendEmail(true) }}
      />
    </DisplayModal>

  </>
}

export default ManageUserData;
