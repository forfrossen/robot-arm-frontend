import * as React from "react";

import { Box, Input, Typography } from "@mui/joy";
import Button from "@mui/joy/Button";
import ToggleButtonGroup from "@mui/joy/ToggleButtonGroup";

type ServoControllerProps = {
  name: string;
  handleValueChange: (value: string, name: string) => void;
};

export const ServoController = (props: Readonly<ServoControllerProps>) => {
  const { handleValueChange, name } = props;
  const [value, setValue] = React.useState<string>("0");
  const angles = ["0", "45", "90", "135", "180", "225"];
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  const valueChange = (event, newValue) => {
    if (!newValue) return;
    handleValueChange(newValue, name);
    setValue(newValue);
  };
  return (
    <Box mt={2}>
      <Typography level="title-lg">Servo {capitalizedName}</Typography>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <ToggleButtonGroup value={value} variant="soft" onChange={valueChange} sx={{ mr: 2 }}>
          {angles.map((angle) => {
            return (
              <Button key={angle} value={angle}>
                {angle}
              </Button>
            );
          })}
        </ToggleButtonGroup>
        <Button onClick={() => valueChange(undefined, String(Number(value) - 10))}>-10</Button>
        <Input
          placeholder="Type Angle in here…"
          variant="outlined"
          color="primary"
          sx={{ width: 100 }}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onBlur={(event) => valueChange(event, event.target.value)}
        />
        <Button onClick={() => valueChange(undefined, String(Number(value) + 10))}>+10</Button>
      </Box>
    </Box>
  );
};
