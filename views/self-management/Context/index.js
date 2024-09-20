import { createContext, useCallback, useEffect, useState } from "react";

import indexOutBounds from "@lib/indexOutBounds";

const FormContext = createContext();

const FormProvider = ({ children }) => {
  const [body, setBody] = useState({});
  const [controls, setControls] = useState({ nextStep: null, prevStep: null });
  const [step, setStep] = useState(0);
  const [stepsCount, setStepsCount] = useState(0);

  const changeStep = useCallback(
    (targetStep) => {
      const outBoundType = indexOutBounds(targetStep, stepsCount);

      const upperBound = outBoundType === 1 && stepsCount - 1;
      const lowerBound = outBoundType === -1;

      const safeStep = lowerBound ? 0 : upperBound || targetStep;

      setStep(safeStep);
    },
    [stepsCount]
  );

  useEffect(() => {
    setBody(JSON.parse(localStorage.getItem("sm-form")));
  }, []);

  useEffect(() => {
    localStorage.setItem("sm-form", JSON.stringify(body));
  }, [body]);

  const resetControls = () => {
    setControls({ nextStep: null, prevStep: null });
  };

  const nextStep = () => {
    if (controls.nextStep) return controls.nextStep();
    changeStep(step + 1);
  };

  const prevStep = () => {
    if (controls.prevStep) return controls.prevStep();
    changeStep(step - 1);
  };

  const data = {
    body: {
      value: body,
      set: setBody,
    },
  };

  const pagination = {
    steps: { value: stepsCount, set: setStepsCount },
    step,
    controls: {
      changeStep,
      nextStep,
      prevStep,
      resetControls,
      setControls,
    },
  };

  return (
    <FormContext.Provider value={{ pagination, data }}>
      {children}
    </FormContext.Provider>
  );
};

export { FormContext, FormProvider };
