/* SPDX-FileCopyrightText: 2014-present Kriasoft */

/* SPDX-License-Identifier: MIT */
import { app } from "./core/app.js";
// Register `/api/login` route handler
import "./routes/api-login.js";
// Register `/api/*` middleware
import "./routes/api-swapi.js";
// Register `*` static assets handler
import "./routes/assets.js";
// Register `/echo` route handler
import "./routes/echo.js";
// Register `/__/*` middleware
import "./routes/firebase.js";

export default app;
