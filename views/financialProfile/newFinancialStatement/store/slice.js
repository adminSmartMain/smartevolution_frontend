import { GetFinancialProfileIndicatorsById } from "@views/financialProfile/indicators/queries";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  isInputChanged: false,
};

const financialStatementSlice = createSlice({
  name: "financialStatement",
  initialState: initialState, //{ isInputChanged: GetFinancialProfileIndicatorsById, data: [] },
  reducers: {
    updateInput(state, action) {
      const { indexPeriod, inputKey, newValue, group } = action.payload;
      state.data[indexPeriod][group][inputKey] = newValue;
      state.isInputChanged = true;
    },
    updatePeriod(state, action) {
      const { indexPeriod, data, formik } = action.payload;
      const newData = {
        ...JSON.parse(JSON.stringify(data)),
        formik: formik,
      };
      state.data[indexPeriod] = newData;
    },
    loadData(state, action) {
      return { ...state, data: action.payload };
    },
    addFormik(state, action) {
      const { indexPeriod, formik } = action.payload;
      if (
        state?.data !== undefined &&
        state?.data.length > 0 &&
        state.data[indexPeriod] !== undefined
      ) {
        state.data[indexPeriod].formik = formik;
      }
    },
    addPeriod(state, action) {
      state.data.push(action.payload);
    },

    removePeriod(state, action) {
      const { indexPeriod } = action.payload;
      state.data = state.data.filter((item, index) => {
        return index !== indexPeriod;
      });
    },
  },
});

export const financialStatementActions = financialStatementSlice.actions;
export default financialStatementSlice;
