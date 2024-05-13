export type ServoPositionMessage = {
  servoName: Servo;
  pos: number;
};
export type Servo = "baseTurner" | "shoulder" | "elbow" | "wrist" | "wristTurner" | "gripper";
export enum ServoReducerActionType {
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
export const initialState: ServoReducerState = {
  baseTurner: 0,
  shoulder: 0,
  elbow: 0,
  wrist: 0,
  wristTurner: 0,
  gripper: 0,
};
export function servoValueReducer(state: ServoReducerState, action: ServoReducerAction) {
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
