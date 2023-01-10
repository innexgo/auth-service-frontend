import React from 'react';
import {
    ColumnsGap as DashboardIcon,
    CalendarEvent as  CalendarIcon,
    Gear as SettingsIcon,
    Search as SearchIcon,
    Person as AccountIcon,
    QuestionCircle as HelpIcon,
} from 'react-bootstrap-icons';
import { InnerLayout, AuthenticatedComponentProps } from '@innexgo/auth-react-components';

export default function DashboardLayout(props: React.PropsWithChildren<AuthenticatedComponentProps>) {
  return <InnerLayout apiKey={props.apiKey} logoutCallback={() => props.setApiKey(null)} >
    <InnerLayout.SidebarEntry label="Dashboard" icon={DashboardIcon} href="/dashboard" />
    <InnerLayout.SidebarEntry label="Account" icon={AccountIcon} href="/account" />
    <InnerLayout.SidebarEntry label="Help" icon={HelpIcon} href="/help" />
    <InnerLayout.Body>
      {props.children}
    </InnerLayout.Body>
  </InnerLayout>
}
