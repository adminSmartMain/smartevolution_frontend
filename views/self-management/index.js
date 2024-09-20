import { useContext, useMemo } from "react";

import Head from "next/head";

import { ClientType } from "@components/selects/queries";

import { useFetch } from "@hooks/useFetch";

import { FormContext, FormProvider } from "./Context";
import InitialStep from "./Steps/IntialStep";
import BasicInformationStep from "./Steps/LegalSteps/BasicInformationStep";
import BoardAndPartnersStep from "./Steps/LegalSteps/BoardAndPartnersStep";
import ContactInformationStep from "./Steps/LegalSteps/ContactInformationStep";
import DocumentationStep from "./Steps/LegalSteps/DocumentationStep";
import GeneralInformationStep from "./Steps/LegalSteps/GeneralInformationStep";
import InternationalAccountsStep from "./Steps/LegalSteps/InternationalAccountsStep";
import InternationalOperationsStep from "./Steps/LegalSteps/InternationalOperationsStep";
import LegalRepresentativeStep from "./Steps/LegalSteps/LegalRepresentativeStep";
import PolitictsInvolvementStep from "./Steps/LegalSteps/PolitictsInvolvementStep";
import SARLAFTRiskStep from "./Steps/LegalSteps/SARLAFTRiskStep";
import TaxInformationStep from "./Steps/LegalSteps/TaxInformationStep";
import TermsAndConditionsStep from "./Steps/LegalSteps/TermsAndConditionsStep";
import NaturalBasicInformationStep from "./Steps/NaturalSteps/BasicInformationStep";
import ContactIInformationStep from "./Steps/NaturalSteps/ContactIInformationStep";
import NaturalDocumentationStep from "./Steps/NaturalSteps/DocumentationStep";
import EconomicInformationStep from "./Steps/NaturalSteps/EconomicInformationStep";
import PublicOperationsStep from "./Steps/NaturalSteps/PublicOperationsStep";
import NaturalTermsAndConditionsStep from "./Steps/NaturalSteps/TermsAndConditionsStep";
import StartStep from "./Steps/StartStep";
import { SelfManagement as SelfManagementComponents } from "./component";

const naturalSteps = [
  { component: NaturalBasicInformationStep },
  { component: EconomicInformationStep },
  { component: PublicOperationsStep },
  { component: ContactIInformationStep },
  { component: NaturalTermsAndConditionsStep },
  { component: NaturalDocumentationStep },
];
const legalSteps = [
  { component: BasicInformationStep },
  { component: TaxInformationStep },
  { component: BoardAndPartnersStep },
  { component: LegalRepresentativeStep },
  { component: InternationalOperationsStep },
  { component: InternationalAccountsStep },
  { component: GeneralInformationStep },
  { component: PolitictsInvolvementStep },
  { component: SARLAFTRiskStep },
  { component: TermsAndConditionsStep },
  { component: ContactInformationStep },
  { component: DocumentationStep },
];

const Wrapper = (props) => {
  const { ...rest } = props;

  const { data } = useContext(FormContext);

  const { loading: loading, data: requestData } = useFetch({
    service: ClientType,
    init: true,
  });

  const clientTypes = requestData?.data || [];

  const naturalTypeId = clientTypes.find(
    (type) => type.description === "Persona Natural"
  )?.id;
  const legalTypeId = clientTypes.find(
    (type) => type.description === "Persona Jurídica"
  )?.id;

  const clientType = data.body.value?.typeClient;

  const isNatural = clientType === naturalTypeId;
  const isLegal = clientType === legalTypeId;

  const stepsComponents = useMemo(
    () => [
      { component: StartStep },
      { component: InitialStep },
      ...(isNatural ? naturalSteps : []),
      ...(isLegal ? legalSteps : []),
    ],
    [isLegal, isNatural]
  );

  if (loading) return <>Cargando...</>;

  return <SelfManagementComponents stepsComponents={stepsComponents} />;
};

const SelfManagement = () => {
  return (
    <>
      <Head>
        <title>Autogestión</title>
        <meta
          name="description"
          content="Formulario de autogestión del cliente"
        />
      </Head>
      <FormProvider>
        <Wrapper />
      </FormProvider>
    </>
  );
};

export default SelfManagement;
