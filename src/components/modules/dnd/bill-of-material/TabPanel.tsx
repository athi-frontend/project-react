import React from "react";
import { Box } from "@mui/material";

const TabPanel = (props: Readonly<{ children?: React.ReactNode; index: number; value: number }>) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`bom-tabpanel-${index}`}
      aria-labelledby={`bom-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export default TabPanel;


