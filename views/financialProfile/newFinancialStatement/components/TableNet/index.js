import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Grid } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import { GetFinancialProfileById } from "../../queries";
import { financialStatementActions } from "../../store/slice";
import Column from "../Column";
import NewPeriod from "../NewPeriod";

export default ({ clientId, isFullView, isEditing, setIsEditing }) => {
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: GetFinancialProfileById, init: false });
  const [reloadTable, setReloadTable] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setReloadTable(false);
    if (clientId) {
      fetch(clientId).then((res) => {
        if (res?.data && res?.data !== []) {
          dispatch(
            financialStatementActions.loadData(
              res.data.financialProfiles
                .map((period) => {
                  return { ...period, isNewPeriod: false, formik: "null" };
                })
                .reverse()
            )
          );
          setReloadTable(true);
        }
      });
    }
  }, [clientId]);

  const state = useSelector((state) => state.financialStatement);

  return (
    <>
      {
        <Grid
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "fit-content",
            position: "relative",
            height: "100%",
          }}
        >
          <Box
            sx={{
              position: "sticky",
              left: 0,
              height: "100%",
              zIndex: 1,
            }}
          >
            {
              <Column
                sx={{
                  width: "300px",
                  height: "fit-content",
                  backgroundColor: "#EBEBEB",
                  overflowX: "hidden",
                }}
                period={{}}
                isLabelColumn={true}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                clientId={clientId}
                isFullView={isFullView}
              />
            }
          </Box>
          {reloadTable && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                height: "100%",
                gap: "50px",
              }}
            >
              {state.data.map((period, index) => {
                return (
                  <Column
                    isFullView={isFullView}
                    key={"column-" + index}
                    period={period}
                    title={period.dateRanges}
                    indexColumn={index}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    clientId={clientId}
                    setReloadTable={setReloadTable}
                  />
                );
              })}
              {isEditing && (
                <NewPeriod
                  clientId={clientId}
                  setReloadTable={setReloadTable}
                />
              )}
            </Box>
          )}
        </Grid>
      }
    </>
  );
};
