import * as React from "react";

import { Box, Slider, Typography } from "@mui/joy";

type ServoControllerProps = {
  name: string;
  handleValueChange: (value: number, name: string) => void;
};

type Angle = "0" | "45" | "90" | "135" | "180";
type Marks = { value: number; label: Angle }[];

export const ServoController = (props: Readonly<ServoControllerProps>) => {
  const { handleValueChange, name } = props;
  const [value, setValue] = React.useState<number>(0);
  const marks: Marks = [
    { value: 0, label: "0" },
    { value: 45, label: "45" },
    { value: 90, label: "90" },
    { value: 135, label: "135" },
    { value: 180, label: "180" },
  ];
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  const valueChange = (event: Event, newValue: number | number[]) => {
    if (!newValue) return;
    handleValueChange(newValue as number, name);
    setValue(newValue as number);
  };
  return (
    <Box mt={2}>
      <Typography level="title-lg">Servo {capitalizedName}</Typography>

      <Box>
        <Slider min={0} max={180} value={Number(value)} marks={marks} onChange={valueChange} />
      </Box>
    </Box>
  );
};
