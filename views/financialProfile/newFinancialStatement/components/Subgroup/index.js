//Material UI imports
import { useCallback, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Divider } from "@mui/material";

import { financialStatementActions } from "../../store/slice";
import Input from "../Input";
import Total from "../Total";

export default (props) => {
  const {
    subgroupDoc,
    subgroupKeys,
    total,
    period,
    group,
    verticalVariation,
    horizontalVariation,
    showDivider,
    isLabelColumn,
    formik,
    isEditing,
  } = props;

  const handleFieldChange = (e, indexPeriod, period, group, key) => {
    if (
      e.target.value &&
      /^([-+*/]? ?(\d+|\(\g\))( ?[-+*\/] ?\g)?)*$/.test(e.target.value)
    ) {
      e.target.value = eval(e.target.value);
      formik.setFieldValue(group.key + "." + key, e.target.value);
    } else {
      e.target.value = null;
      formik.setFieldValue(group.key + "." + key, e.target.value);
    }
  };

  const state = useSelector((state) => state.financialStatement);
  const indexPeriod = !isLabelColumn
    ? state.data.findIndex((item) => item.period === period.period)
    : 0;
  useEffect(() => {}, [state]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        width: "100%",
      }}
    >
      {subgroupKeys.map((subgroup, index) => {
        const key = subgroup.key;

        return (
          <Input
            isEditing={isEditing}
            name={group.key + "." + key}
            handleFieldChange={(e) => {
              handleFieldChange(e, indexPeriod, period, group, key);
            }}
            value={formik?.values?.[group.key]?.[key] || ""}
            subgroup={subgroup}
            isLabelColumn={isLabelColumn}
            key={group.key + "-" + key + "-input-" + index}
            changeValue={(e) => {
              formik.setFieldValue(group.key + "." + key, e.target.value);
              formik.setFieldValue("isEdited", true);
            }}
            verticalVariation={
              !isLabelColumn
                ? Number(
                    verticalVariation(
                      formik.values,
                      formik.values[group.key][key]
                    )
                  )
                : undefined
            }
            horizontalVariation={
              !isLabelColumn
                ? Number(
                    horizontalVariation(
                      formik.values,
                      state?.data[indexPeriod - 1]?.formik.values,
                      group.key,
                      key
                    )
                  )
                : undefined
            }
            indexPeriod={indexPeriod}
            groupKey={group.key}
            inputKey={key}
          />
        );
      })}
      <Box>
        {total?.map((totalDoc, index) => {
          return (
            <Total
              isEditing={isEditing}
              value={formik?.values?.[group.key]?.[totalDoc.key] || ""}
              name={group.key + "." + totalDoc.key}
              group={group}
              key={"total-" + indexPeriod + "-" + index}
              total={totalDoc}
              isLabelColumn={isLabelColumn}
              period={formik?.values}
              indexPeriod={indexPeriod}
              formik={formik}
              verticalTotal={
                !isLabelColumn
                  ? Number(
                      verticalVariation(
                        formik.values,
                        totalDoc.operation(formik?.values)
                      )
                    )
                  : undefined
              }
              horizontalTotal={
                !isLabelColumn
                  ? Number(
                      horizontalVariation(
                        formik.values,
                        state?.data[indexPeriod - 1]?.formik.values,
                        group.key,
                        totalDoc.key
                      )
                    )
                  : undefined
              }
            />
          );
        })}
      </Box>

      {showDivider && (
        <Box
          width="100%"
          sx={{
            marginBottom: "36px",
          }}
        >
          <Divider
            sx={{
              borderBottomWidth: "1.4px",
              borderColor: "#575757",
              opacity: "0.5",
              textAlign: "center",
            }}
          />
        </Box>
      )}
    </Box>
  );
};
