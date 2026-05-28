import React from "react";
import Typography from "@mui/material/Typography";
import { ACTIVE, INACTIVE } from "@/constants/modules/dnd/projectStages";
import { NUMBERMAP } from "@/constants/common";

interface StatusTypographyProps {
  value: number;
}

const STATUS_MAP={
  [NUMBERMAP.ONE]: ACTIVE,
  [NUMBERMAP.ZERO]: INACTIVE,
  [NUMBERMAP.TWO]: INACTIVE,
}

const StatusTypography: React.FC<StatusTypographyProps> = ({
  value,
}) => {
  // Status 1 = Active (green), Status 0 or 2 = Inactive (red)
  const isActive = value === NUMBERMAP.ONE;
  
  return (
    <Typography
      variant="body2"
      component={"span"}
      color={isActive ? "success" : "error"}
    >
      {STATUS_MAP[value]?? "-"}
    </Typography>
  );
};

export default StatusTypography;