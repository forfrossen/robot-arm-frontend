/* SPDX-FileCopyrightText: 2014-present Kriasoft */

/* SPDX-License-Identifier: MIT */
import { Fragment, Suspense } from "react";

import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import NotificationsRounded from "@mui/icons-material/NotificationsRounded";
import { Box, BoxProps, Button, IconButton } from "@mui/joy";

//import { getAuth } from "firebase/auth";

//import { app } from "../core/firebase";
import { ColorSchemeButton } from "./button-color-scheme";

export function Toolbar(props: ToolbarProps): JSX.Element {
  const { sx, ...other } = props;

  return (
    <Box
      sx={{
        alignItems: "center",
        borderBottom: "1px solid",
        borderColor: "divider",
        display: "flex",
        gap: 1,
        px: 2,
        ...sx,
      }}
      component="header"
      {...other}
    >
      <Button
        color="neutral"
        variant="plain"
        endDecorator={<ExpandMoreRounded />}
        children="Project Name"
      />

      <Box sx={{ flexGrow: 1 }} component="span" />

      <Suspense>
        <ActionButtons />
      </Suspense>
    </Box>
  );
}
function ActionButtons(): JSX.Element {
  //const auth = getAuth(app);
  //const [user] = useAuthState(auth);

  return (
    <Fragment>
      <ColorSchemeButton variant="soft" size="sm" />

      <IconButton variant="soft" size="sm">
        <NotificationsRounded />
      </IconButton>

      
    </Fragment>
  );
}

type ToolbarProps = Omit<BoxProps<"header">, "children">;
