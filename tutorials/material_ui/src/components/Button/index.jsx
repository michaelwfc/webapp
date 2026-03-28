import React from "react";

import Button from "@mui/material/Button";

export default function ButtonUsage() {
  return (
    <Button
      variant="contained"
      onClick={() => {
        console.log("Button clicked!");
      }}
    >
      Hello world
    </Button>
  );
}
