/* SPDX-FileCopyrightText: 2014-present Kriasoft */

/* SPDX-License-Identifier: MIT */
import { memo, ReactNode } from "react";

import AssignmentTurnedInRounded from "@mui/icons-material/AssignmentTurnedInRounded";
import ChatRounded from "@mui/icons-material/ChatRounded";
import Dashboard from "@mui/icons-material/Dashboard";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  ListProps,
} from "@mui/joy";

import { Link, useMatch } from "react-router-dom";

export const Navigation = memo(function Navigation(props: NavigationProps): JSX.Element {
  const { sx, ...other } = props;

  return (
    <List sx={{ "--ListItem-radius": "4px", ...sx }} size="sm" role="nav" {...other}>
      <NavItem path="/dashboard" label="Dashboard" icon={<Dashboard />} />
      <NavItem path="/tasks" label="Tasks" icon={<AssignmentTurnedInRounded />} />
      <NavItem path="/messages" label="Messages" icon={<ChatRounded />} />
    </List>
  );
});

function NavItem(props: NavItemProps): JSX.Element {
  return (
    <ListItem>
      <ListItemButton
        component={Link}
        selected={!!useMatch(props.path)}
        to={props.path}
        aria-current="page"
      >
        <ListItemDecorator children={props.icon} />
        <ListItemContent>{props.label}</ListItemContent>
      </ListItemButton>
    </ListItem>
  );
}

type NavigationProps = Omit<ListProps, "children">;
type NavItemProps = {
  path: string;
  label: string;
  icon: ReactNode;
};
