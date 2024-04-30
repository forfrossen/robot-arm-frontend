/* SPDX-FileCopyrightText: 2014-present Kriasoft */

/* SPDX-License-Identifier: MIT */
import { useEffect, useState } from "react";

import { Box, Button, Container, Typography } from "@mui/joy";

import { io } from "socket.io-client";

import { ServoController } from "../components/servo-controller";
import { usePageEffect } from "../core/page";

export const Component = function Dashboard(): JSX.Element {
  usePageEffect({ title: "Dashboard" });
  const socket = io("ws://localhost:3000", { autoConnect: false });
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const servos = ["BaseTurner", "Shoulder", "Elbow", "Wrist", "WristTurner", "Gripper"];

  const valueChangeHandler = (value: string, name: string): void => {
    console.log(`Value of ${name} changed to ${value}`);
  };

  return (
    <Container sx={{ py: 2 }}>
      <Box>
        <Box>
          <Typography sx={{ mr: 2 }} level="h2">
            Dashboard!
          </Typography>
        </Box>
        <Box>
          Socket: {isConnected ? "Connected" : "Disconnected"}
          <Button size="sm" onClick={() => socket.connect()} disabled={isConnected}>
            Connect Socket
          </Button>
        </Box>
        {servos.map((servo) => {
          return (
            <ServoController key={servo} name={servo} handleValueChange={valueChangeHandler} />
          );
        })}
      </Box>
    </Container>
  );
};
