/* SPDX-FileCopyrightText: 2014-present Kriasoft */

/* SPDX-License-Identifier: MIT */
import { useEffect, useState } from "react";

import { Box, Button, Container } from "@mui/joy";

import { io, Socket } from "socket.io-client";

import { ServoController } from "../components/servo-controller";
import { usePageEffect } from "../core/page";

export const Component = function Dashboard(): JSX.Element {
  usePageEffect({ title: "Dashboard" });
  const [socket, setSocket] = useState<null | Socket>(null);
  const [isConnected, setIsConnected] = useState(socket?.connected);

  useEffect(() => {
    const newSocket = io("ws://localhost:3001", {
      autoConnect: true,
    });

    setSocket(newSocket);

    function onConnect() {
      console.log("Socket Connected!");
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("Socket Disconnected!");
      setIsConnected(false);
    }

    newSocket.on("connect", onConnect);
    newSocket.on("disconnect", onDisconnect);

    return () => {
      newSocket.off("connect", onConnect);
      newSocket.off("disconnect", onDisconnect);
      newSocket.disconnect();
      newSocket.close();
    };
  }, [setSocket]);

  const servos = ["baseTurner", "shoulder", "elbow", "wrist", "wristTurner", "gripper"];

  const valueChangeHandler = (value: string, name: string): void => {
    console.log(`Value of ${name} changed to ${value}`);
    socket?.emit("servo", { name: name, pos: Number(value) });
  };

  return (
    <Container sx={{ py: 2 }}>
      <Box>
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
