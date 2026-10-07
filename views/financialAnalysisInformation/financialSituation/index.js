import { FinancialSituationComponent } from "./components";

export const FinancialSituationIndex = ({ financialProfileData, loading }) => {
  return (
    <FinancialSituationComponent
      data1={financialProfileData}
      loading={loading}
    />
  );
};
