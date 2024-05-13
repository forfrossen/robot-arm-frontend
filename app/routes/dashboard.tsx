/* SPDX-FileCopyrightText: 2014-present Kriasoft */

/* SPDX-License-Identifier: MIT */
import { useEffect, useReducer, useState } from "react";

import { Box, Button, Container } from "@mui/joy";

import { io, Socket } from "socket.io-client";

import { ServoController } from "../components/servo-controller";
import { ThreeFibre } from "../components/three-fibre";
import { usePageEffect } from "../core/page";
import {
  initialState,
  Servo,
  ServoPositionMessage,
  ServoReducerActionType,
  servoValueReducer,
} from "./servoValueReducer";

export const Component = function Dashboard(): JSX.Element {
  usePageEffect({ title: "Dashboard" });
  const [socket, setSocket] = useState<null | Socket>(null);
  const [isConnected, setIsConnected] = useState(socket?.connected);

  const [state, dispatch] = useReducer(servoValueReducer, { ...initialState });

  useEffect(() => {
    const newSocket = io("ws://localhost:3001", {
      autoConnect: false,
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

    newSocket.on("servoPosition", (data: ServoPositionMessage) => {
      console.log(`Incoming socket data for ${data.servoName} - ${data.pos}`);
      dispatch({ type: ServoReducerActionType.SET, payload: { ...data } });
    });

    return () => {
      newSocket.off("connect", onConnect);
      newSocket.off("disconnect", onDisconnect);
      newSocket.disconnect();
      newSocket.close();
    };
  }, [setSocket]);

  const servos: Servo[] = ["baseTurner", "shoulder", "elbow", "wrist", "wristTurner", "gripper"];

  const valueChangeHandler = (value: string, servoName: Servo): void => {
    console.log(`Value of ${servoName} changed to ${value}`);
    const msg: ServoPositionMessage = { servoName: servoName, pos: Number(value) };
    dispatch({
      type: ServoReducerActionType.SET,
      payload: { servoName: servoName, pos: Number(value) },
    });
    socket?.emit("servo", msg);
  };

  return (
    <Container sx={{ py: 2 }}>
      <Box sx={{ py: 2, background: "#303035", height: 800 }}>
        <ThreeFibre />
      </Box>
      <Box>
        Socket: {isConnected ? "Connected" : "Disconnected"}
        <Button size="sm" onClick={() => socket?.connect()} disabled={isConnected}>
          Connect Socket
        </Button>
      </Box>
      <Box sx={{ py: 2 }}>
        {servos.map((servoName) => {
          return (
            <ServoController
              key={servoName}
              name={servoName}
              value={state[servoName]}
              handleValueChange={valueChangeHandler}
            />
          );
        })}
      </Box>
    </Container>
  );
};
