import { Box, Grid } from "@mui/material";
import { letterSpacing } from "@mui/system";

import { groups } from "../../libs/groups";
import Subgroup from "../Subgroup";

export default (props) => {
  const {
    period,
    group,
    isLabelColumn,
    formik,
    indexColumn,
    isEditing,
    isLastChild,
  } = props;
  return (
    <Box
      sx={{
        width: "100%",
        marginBottom: isLastChild ? "25px" : "120px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          font: "bold 0.7vw/0.8vw Montserrat",
          letterSpacing: "0px",
          color: "#63595C",
          textTransform: !isLabelColumn ? "uppercase" : "capitalize",
          opacity: "1",
          textAlign: "center",
          marginBottom: "10px",
          width: "100%",
          height: "47px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!isLabelColumn ? (
          <Box
            width="100%"
            display="flex"
            justifyContent={
              indexColumn !== 0 ? "space-around" : "space-between"
            }
            alignItems="center"
          >
            <Box
              sx={{
                width: "45%",
                font: "bold 1vw/2vw Montserrat",
                textAlign: "left",
              }}
            ></Box>
            <Box sx={{ width: "25.9%", height: "100%", textAlign: "center" }}>
              {isLabelColumn ? null : <span>PARTC</span>}
            </Box>

            {isLabelColumn ? null : indexColumn !== 0 ? (
              <Box sx={{ width: "25.9%", height: "100%" }}>
                {" "}
                <span>VAR</span>{" "}
              </Box>
            ) : (
              ""
            )}
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              font: "1.6vw/2.6vw Montserrat",
              fontWeight: 500,
              textAlign: "left",
            }}
          >
            {group.title}
          </Box>
        )}
      </Box>

      {group.subgroups.map((subgroup, index) => {
        return (
          <Subgroup
            subgroupDoc={subgroup}
            key={"subgroup" + index}
            subgroupKeys={subgroup.keys}
            total={subgroup.total}
            period={period}
            group={group}
            verticalVariation={group.variations.vertical}
            horizontalVariation={group.variations.horizontal}
            showDivider={index !== group.subgroups.length - 1}
            isLabelColumn={isLabelColumn}
            formik={formik}
            isEditing={isEditing}
          />
        );
      })}
    </Box>
  );
};
