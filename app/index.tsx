/* SPDX-FileCopyrightText: 2014-present Kriasoft */

/* SPDX-License-Identifier: MIT */
import { StrictMode } from "react";

import { CssBaseline, CssVarsProvider } from "@mui/joy";

import { RecoilRoot } from "recoil";

import { useGLTF } from "@react-three/drei";
import { SnackbarProvider } from "notistack";
import { createRoot } from "react-dom/client";

import { theme } from "./core/theme";
import { Router } from "./routes/index";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <StrictMode>
    <RecoilRoot>
      <CssVarsProvider theme={theme}>
        <SnackbarProvider>
          <CssBaseline />
          <Router />
        </SnackbarProvider>
      </CssVarsProvider>
    </RecoilRoot>
  </StrictMode>,
);

if (import.meta.hot) {
  import.meta.hot.dispose(() => root.unmount());
}
useGLTF.preload("../assets/robot_arm.glb");
