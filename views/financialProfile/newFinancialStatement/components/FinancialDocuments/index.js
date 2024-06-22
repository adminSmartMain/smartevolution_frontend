//React imports
//Material UI imports
import { useState } from "react";
import { useSelector } from "react-redux";

import { Box, Button, Tab, Tabs, Typography } from "@mui/material";

//Queries imports
import FilesTab from "../FilesTab";

export default (props) => {
  const { onClose, indexPeriod, period } = props;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <>
      <FilesTab
        tabValue={period.period}
        period={period}
        indexPeriod={indexPeriod}
      />
    </>
  );
};
