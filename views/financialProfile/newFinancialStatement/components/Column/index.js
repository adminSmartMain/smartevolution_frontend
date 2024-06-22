import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";

import {
  Box,
  Button,
  CircularProgress,
  Tooltip,
  Typography,
} from "@mui/material";

import TitleModal from "@components/modals/titleModal";
import { Toast } from "@components/toast";

import { useFetch } from "@hooks/useFetch";

import { totals } from "../../libs/groups";
import { groups } from "../../libs/groups";
import {
  AddNewPeriod,
  GetFinancialProfileById,
  UpdatePeriod,
} from "../../queries";
import { financialStatementActions } from "../../store/slice";
import EditPeriod from "../EditPeriod";
import FinancialDocuments from "../FinancialDocuments";
import Group from "../Group";

import { useFormik } from "formik";

export default (props) => {
  const dispatch = useDispatch();
  const {
    period,
    isLabelColumn = false,
    title,
    sx = {},
    indexColumn,
    isFullView = false,
    isEditing,
    setIsEditing,
    clientId,
    isNewPeriod,
    setReloadTable,
    closeNewPeriodModal,
  } = props;

  const [loadingSave, setLoadingSave] = useState(false);
  const groupKeys = Object.keys(groups);
  const [open, setOpen] = useState(false);
  const [openPeriodModal, setOpenPeriodModal] = useState(false);
  const [initialValues, setInitialValues] = useState({
    ...period,
    isEdited: false,
  });

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values, { resetForm }) => {
      // do your stuff
      resetForm();
    },
    enableReinitialze: true,
  });

  useEffect(() => {
    dispatch(
      financialStatementActions.addFormik({
        indexPeriod: indexColumn,
        formik: formik,
      })
    );
  }, []);
  const {
    fetch: fetchGetData,
    loading: loadingGetData,
    error: errorGetData,
    data: dataGetData,
  } = useFetch({ service: GetFinancialProfileById, init: false });
  const {
    fetch: fetchAddPeriod,
    loading: loadingPeriod,
    error: errorPeriod,
    data: dataPeriod,
  } = useFetch({ service: AddNewPeriod, init: false });

  const addNewPeriod = () => {
    totals.map((totalDoc) => {
      formik.setFieldValue(
        totalDoc.group + "." + totalDoc.key,
        totalDoc.operation(formik.values)
      );
    });
    fetchAddPeriod(formik.values).then((res) => {
      if (res.status >= 200 && res.status <= 210) {
        setLoadingSave(false);
        formik.setFieldValue("id", res.data.data.financialProfiles[0].id);
        Toast("Periodo agregado correctamente", "success");
        fetchGetData(clientId).then((res) => {
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
            closeNewPeriodModal();
          }
        });
      } else {
        Toast("No se ha podido agregar el periodo", "error");
      }
    });
  };

  const {
    fetch: fetchUpdatePeriod,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: UpdatePeriod, init: false });

  const handleUpdatePeriod = async () => {
    totals.map((totalDoc) => {
      formik.setFieldValue(
        totalDoc.group + "." + totalDoc.key,
        totalDoc.operation(formik.values)
      );
    });
    fetchUpdatePeriod(
      formik.values.id,
      {
        assets: formik.values.assets,
        passives: formik.values.passives,
        patrimony: formik.values.patrimony,
        stateOfResult: formik.values.stateOfResult,
      },
      true
    ).then((res) => {
      if (res.status >= 200 && res.status <= 210) {
        dispatch(
          financialStatementActions.updatePeriod({
            indexPeriod: indexColumn,
            formik: formik,
            data: formik.values,
          })
        );
        formik.setFieldValue("isEdited", false);
        setLoadingSave(false);
        Toast("Periodo actualizado correctamente", "success");
      } else {
        Toast("No se ha podido actualizar el periodo", "error");
      }
    });
  };

  const removePeriod = () => {
    dispatch(
      financialStatementActions.removePeriod({
        indexPeriod: indexColumn,
      })
    );
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <TitleModal
        open={open}
        handleClose={handleClose}
        containerSx={{
          width: "70%",
          height: "max-content",
        }}
        title={period.dateRanges}
      >
        <FinancialDocuments
          period={period}
          onClose={handleClose}
          indexPeriod={indexColumn}
        />
      </TitleModal>
      <TitleModal
        open={openPeriodModal}
        handleClose={() => setOpenPeriodModal(false)}
        containerSx={{
          width: "466px",
        }}
        title={"Editar periodo"}
      >
        <EditPeriod
          clientId={clientId}
          formik={formik}
          indexColumn={indexColumn}
          setReloadTable={setReloadTable}
        />
      </TitleModal>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          width: isLabelColumn ? "100%" : "400px",
          height: "100%",
          ...sx,
        }}
      >
        {!isNewPeriod && (
          <Box
            display="flex"
            flexDirection="column"
            gap="30px"
            justifyContent="space-evenly"
            width="100%"
            borderBottom={!isLabelColumn ? "2px solid #488B8F" : ""}
            marginBottom={!isLabelColumn ? "30px" : "33px"}
          >
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="left"
              alignItems="center"
              gap="10px"
            >
              <Typography
                letterSpacing={0}
                fontSize="1.7vw"
                fontWeight="500"
                color={!isLabelColumn ? "#488B8F" : "#EBEBEB"}
              >
                {!isLabelColumn ? title : "#SmartLove"}
              </Typography>
              {!isLabelColumn && !isNewPeriod && isEditing ? (
                <Button
                  variant="standard"
                  color="primary"
                  size="large"
                  sx={{
                    height: "2rem",
                    borderRadius: "4px",
                    backgroundColor: "#488B8F",
                    color: "#FFFFFF",
                    textTransform: "none",
                    borderRadius: "4px",
                    "&:hover": { backgroundColor: "#5EA3A3" },
                    opacity: "1",
                    minWidth: "0px",
                  }}
                  onClick={(e) => {
                    setOpenPeriodModal(true);
                  }}
                >
                  <i class="fa-regular fa-pen-to-square"></i>
                </Button>
              ) : null}
            </Box>
            {!isLabelColumn ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  gap: "10px",
                  mb: "10px",
                  alignItems: "center",
                  justifyContent: !period.isNewPeriod
                    ? "space-between"
                    : "flex-end",
                }}
              >
                {isEditing ? (
                  <>
                    {!period.isNewPeriod && (
                      <Button
                        disabled={!isEditing}
                        width="196px"
                        variant="standard"
                        color="primary"
                        size="large"
                        sx={{
                          height: "2rem",
                          backgroundColor: "transparent",
                          border: "1.4px solid #63595C",
                          borderRadius: "4px",
                          opacity: isEditing ? 1 : 0.2,
                        }}
                        onClick={handleOpen}
                      >
                        <Typography
                          letterSpacing={0}
                          fontSize="80%"
                          fontWeight="bold"
                          color="#63595C"
                          mr="10px"
                        >
                          Editar Documentos
                        </Typography>
                        <i class="fa-regular fa-boxes-packing"></i>
                      </Button>
                    )}
                    <Button
                      disabled={
                        !formik.values.isEdited || loadingSave || !isEditing
                      }
                      width="104px"
                      variant="standard"
                      color="primary"
                      size="large"
                      sx={{
                        height: "2rem",
                        borderRadius: "4px",
                        backgroundColor: "#488B8F",
                        color: "#FFFFFF",
                        textTransform: "none",
                        borderRadius: "4px",
                        "&:hover": { backgroundColor: "#5EA3A3" },
                        opacity: formik.values.isEdited && isEditing ? 1 : 0.2,
                      }}
                      onClick={(e) => {
                        setLoadingSave(true);

                        if (period?.isNewPeriod && formik.isValid) {
                          addNewPeriod();
                        } else if (
                          !period?.isNewPeriod &&
                          formik.values.isEdited
                        ) {
                          handleUpdatePeriod();
                        }
                      }}
                    >
                      {loadingSave ? (
                        <CircularProgress
                          disableShrink={true}
                          size={15}
                          sx={{
                            color: "#FFFFFF",
                          }}
                        />
                      ) : (
                        <>
                          <Typography
                            letterSpacing={0}
                            fontSize="80%"
                            fontWeight="bold"
                            color="#FFFFFF"
                            textTransform="uppercase"
                            mr="10%"
                          >
                            Guardar
                          </Typography>
                          <i class="fa-solid fa-floppy-disk"></i>
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Box
                    sx={{
                      height: "2rem",
                    }}
                  ></Box>
                )}
              </Box>
            ) : (
              <Box mb="3%">
                {!isNewPeriod ? (
                  <Button
                    width="50%"
                    variant="standard"
                    color="primary"
                    size="large"
                    sx={{
                      width: "70%",
                      height: "2rem",
                      borderRadius: "4px",
                      backgroundColor: "#488B8F",
                      color: "#FFFFFF",
                      textTransform: "none",
                      borderRadius: "4px",
                      "&:hover": { backgroundColor: "#5EA3A3" },
                    }}
                    onClick={(e) => {
                      setIsEditing(!isEditing);
                    }}
                  >
                    <Typography
                      width="80%"
                      letterSpacing={0}
                      fontSize="80%"
                      fontWeight="bold"
                      color="#FFFFFF"
                      textTransform="uppercase"
                      mr="10%"
                    >
                      {isEditing ? "Deshabilitar Edición" : "Habilitar Edición"}
                    </Typography>
                    {isEditing ? (
                      <i class="fa-regular fa-lock"></i>
                    ) : (
                      <i class="fa-regular fa-lock-open"></i>
                    )}
                  </Button>
                ) : null}
              </Box>
            )}
          </Box>
        )}

        {groupKeys.map((group, index) => {
          return (
            <Group
              isEditing={isEditing}
              key={"group-" + group + "-" + index}
              group={groups[group]}
              period={period}
              isLabelColumn={isLabelColumn}
              index={index}
              indexColumn={indexColumn}
              totalGroups={groupKeys.length}
              formik={formik}
              isLastChild={groupKeys.length - 1 === index}
            />
          );
        })}
        {isNewPeriod && !isLabelColumn && (
          <Button
            disabled={loadingSave || !isEditing}
            width="104px"
            variant="standard"
            color="primary"
            size="large"
            sx={{
              height: "2rem",
              borderRadius: "4px",
              backgroundColor: "#488B8F",
              color: "#FFFFFF",
              textTransform: "none",
              borderRadius: "4px",
              "&:hover": { backgroundColor: "#5EA3A3" },
              opacity: isEditing ? 1 : 0.2,
            }}
            onClick={(e) => {
              setLoadingSave(true);

              addNewPeriod();
            }}
          >
            {loadingSave ? (
              <CircularProgress
                disableShrink={true}
                size={15}
                sx={{
                  color: "#FFFFFF",
                }}
              />
            ) : (
              <>
                <Typography
                  letterSpacing={0}
                  fontSize="80%"
                  fontWeight="bold"
                  color="#FFFFFF"
                  textTransform="uppercase"
                  mr="10%"
                >
                  Guardar
                </Typography>
                <i class="fa-solid fa-floppy-disk"></i>
              </>
            )}
          </Button>
        )}
      </Box>
    </>
  );
};
