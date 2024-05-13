/* SPDX-FileCopyrightText: 2014-present Kriasoft */

/* SPDX-License-Identifier: MIT */
import { useEffect, useReducer, useState } from "react";

import { Box, Button, Container } from "@mui/joy";

import { io, Socket } from "socket.io-client";
import { homog, rotate, vector } from "vektor";

import { RobotArmGui } from "../components/robot-arm-gui";
import { ServoController } from "../components/servo-controller";
import { usePageEffect } from "../core/page";

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
      <Box>
        <RobotArmGui />
      </Box>
      <Box>
        <Box>
          Socket: {isConnected ? "Connected" : "Disconnected"}
          <Button size="sm" onClick={() => socket?.connect()} disabled={isConnected}>
            Connect Socket
          </Button>
        </Box>
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

type ServoPositionMessage = {
  servoName: Servo;
  pos: number;
};

type Servo = "baseTurner" | "shoulder" | "elbow" | "wrist" | "wristTurner" | "gripper";

enum ServoReducerActionType {
  SET = "set",
}

type ServoReducerActionPayload = {
  servoName: Servo;
  pos: number;
};

type ServoReducerAction = {
  type: ServoReducerActionType;
  payload: ServoReducerActionPayload;
};

type ServoReducerState = {
  [K in Servo]: number;
};

const initialState: ServoReducerState = {
  baseTurner: 0,
  shoulder: 0,
  elbow: 0,
  wrist: 0,
  wristTurner: 0,
  gripper: 0,
};

function servoValueReducer(state: ServoReducerState, action: ServoReducerAction) {
  const { type, payload } = action;

  switch (type) {
    case ServoReducerActionType.SET: {
      console.log("Reducer Log: ", payload);
      const { servoName, pos } = payload;
      if (state[servoName] === pos) {
        console.log("No need to update state. Position already known");
        return state;
      }
      return {
        ...state,
        [servoName]: pos,
      };
    }
    default:
      return state;
  }
}
