import { StateResultsComponent } from "./components";

export const StateResultsIndex = ({ financialProfileData, loading }) => {
  return (
    <StateResultsComponent
      financialProfileData={financialProfileData}
      loading={loading}
    />
  );
};
