import * as React from "react";

import { Box, Typography } from "@mui/joy";
import Button from "@mui/joy/Button";
import ToggleButtonGroup from "@mui/joy/ToggleButtonGroup";

type ServoControllerProps = {
  name: string;
  handleValueChange: (value: string, name: string) => void;
};

export const ServoController = (props: Readonly<ServoControllerProps>) => {
  const { handleValueChange, name } = props;
  const [value, setValue] = React.useState<string>("0");
  const angles = ["0", "45", "90", "135", "180"];

  return (
    <Box mt={2}>
      <Typography level="title-lg">Servo {name}</Typography>
      <ToggleButtonGroup
        value={value}
        variant="soft"
        onChange={(event, newValue) => {
          if (!newValue) return;
          handleValueChange(newValue, name);
          setValue(newValue);
        }}
      >
        {angles.map((angle) => {
          return (
            <Button key={angle} value={angle}>
              {angle}
            </Button>
          );
        })}
      </ToggleButtonGroup>
    </Box>
  );
};
