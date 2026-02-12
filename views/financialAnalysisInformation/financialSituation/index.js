

import { FinancialSituationComponent } from "./components"
import { useEffect, useState } from "react";
import { useFetch } from "@hooks/useFetch";
import { GetCustomerById,GetFinancialProfileById , UpdateFinancialCentral} from "./queries";
import { useRouter } from "next/router";
export const FinancialSituationIndex = () =>{
    const [clientId, setID] = useState("");
     const router = useRouter();
      
        useEffect(() => {
          if (router && router.query) {
            setID(router.query.id);
          }
        }, [router.query]);
      
   {/* const [id, setID] = useState("");
      const {
        fetch: fetch,
        loading: loading,
        error: error,
        data: data,
      } = useFetch({ service: GetCustomerById, init: false });


  
       const router = useRouter();
      
        useEffect(() => {
          if (router && router.query) {
            setID(router.query.id);
          }
        }, [router.query]);
      
        useEffect(() => {
          if (id) {
            fetch(id);
          }
        }, [id]);

*/}
    
    console.log(clientId)
      const [tableData, setTableData] = useState([]);
      const [financialAnalisis, setFinancialAnalisis] = useState("");
      const [cualitativeAnalisis, setCualitativeAnalisis] = useState("");
      const {
        fetch: fetch,
        loading: loading,
        error: error,
        data: data,
      } = useFetch({ service: GetFinancialProfileById, init: false });
    
      const {
        fetch: fetchFinancialCentral,
        loading: loadFinancialCentrals,
        error: errorFinancialCentrals,
        data: dataFinancialCentrals,
      } = useFetch({ service: UpdateFinancialCentral, init: false });
    
      useEffect(() => {
        if (clientId) {
          fetch(clientId).then((res) => {
            if (res?.data && res?.data !== []) {
              const newTableData = res.data.financialCentrals.map((item) => {
                return {
                  id: item.id,
                  centralBalances: item.centralBalances,
                  rating: item.rating,
                  bank: {
                    value: item.bank.id,
                    label: item.bank.description,
                  },
                  isChecked: false,
                };
              });
              setTableData(newTableData);
              setFinancialAnalisis(res?.data?.overview?.financialAnalisis ?? "");
              setCualitativeAnalisis(
                res?.data?.overview?.qualitativeOverview ?? ""
              );
            }
          });
        }
      }, [clientId]);

      console.log(data)
    return (

        <>
            <FinancialSituationComponent data1={data}/>
        </>
    )
}