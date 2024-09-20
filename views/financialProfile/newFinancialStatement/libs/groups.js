export const groups = {
  assets: {
    key: "assets",
    title: "Activos",
    subgroups: [
      {
        keys: [
          {
            key: "cash_and_investments",
            title: "Caja e inversiones totales",
            information: "Lorem Ipsum",
          },
          {
            key: "clients_wallet",
            title: "Cartera Clientes",
            information: "Lorem Ipsum",
          },
          {
            key: "cxc_partners",
            title: "CXC Socios",
            information: "Lorem Ipsum",
          },
          {
            key: "other_cxc",
            title: "Otras CXC",
            information: "Lorem Ipsum",
          },
        ],
        total: [
          {
            key: "net_cxc",
            title: "CXC Netos",
            information: "Lorem Ipsum",
            operation: (period) => {
              return (
                (Number(period?.assets?.clients_wallet) ?? 0) +
                (Number(period?.assets?.cxc_partners) ?? 0) +
                (Number(period?.assets?.other_cxc) ?? 0)
              );
            },
          },
        ],
      },
      {
        keys: [
          {
            key: "raw_material_and_others",
            title: "Materia prima y otros",
            information: "Lorem Ipsum",
          },
          {
            key: "products_finished",
            title: "Productos Terminado",
            information: "Lorem Ipsum",
          },
        ],
        total: [
          {
            key: "total_inventory",
            title: "Inventario Total",
            information: "Lorem Ipsum",
            operation: (period) => {
              return (
                (Number(period?.assets?.raw_material_and_others) ?? 0) +
                (Number(period?.assets?.products_finished) ?? 0)
              );
            },
          },
        ],
      },
      {
        keys: [
          {
            key: "advances_and_progress",
            title: "Anticipos y Avances",
            information: "Lorem Ipsum",
          },
        ],
        total: [
          {
            key: "current_assets",
            title: "ACTIVO CORRIENTE",
            information: "Lorem Ipsum",
            operation: (period) => {
              return (
                (Number(period?.assets?.cash_and_investments) ?? 0) +
                (Number(period?.assets?.advances_and_progress) ?? 0) +
                (Number(period?.assets?.clients_wallet) ?? 0) +
                (Number(period?.assets?.cxc_partners) ?? 0) +
                (Number(period?.assets?.other_cxc) ?? 0) +
                (Number(period?.assets?.raw_material_and_others) ?? 0) +
                (Number(period?.assets?.products_finished) ?? 0)
              );
            },
          },
        ],
      },
      {
        keys: [
          {
            key: "lands_and_buildings",
            title: "Terrenos y edificios",
            information: "Lorem Ipsum",
          },
          {
            key: "m_and_e_vehicles",
            title: "M&E, vehiculos",
            information: "Lorem Ipsum",
          },
        ],
        total: [
          {
            key: "gross_fixed_assets",
            title: "Activo Fijo Bruto",
            information: "Lorem Ipsum",
            operation: (period) => {
              return (
                (Number(period?.assets?.lands_and_buildings) ?? 0) +
                (Number(period?.assets?.m_and_e_vehicles) ?? 0)
              );
            },
          },
        ],
      },
      {
        keys: [
          {
            key: "dep_acum",
            title: "Dep. Acum.",
            information: "Lorem Ipsum",
          },
        ],
        total: [
          {
            key: "net_fixed_assets",
            title: "ACTIVO FIJO NETO",
            information: "Lorem Ipsum",
            operation: (period) => {
              return (
                (Number(period?.assets?.lands_and_buildings) ?? 0) +
                (Number(period?.assets?.m_and_e_vehicles) ?? 0) -
                (Number(period?.assets?.dep_acum) ?? 0)
              );
            },
          },
        ],
      },
      {
        keys: [
          {
            key: "difer_intang_leasing",
            title: "Difer., intang., Leasing",
            information: "Lorem Ipsum",
          },
          {
            key: "investments_and_others",
            title: "Inversiones Ptes y otros",
            information: "Lorem Ipsum",
          },
        ],
        total: [
          {
            key: "total_other_assets",
            title: "TOTAL OTROS ACT",
            information: "Lorem Ipsum",
            operation: (period) => {
              return (
                (Number(period?.assets?.difer_intang_leasing) ?? 0) +
                (Number(period?.assets?.investments_and_others) ?? 0)
              );
            },
          },
          {
            key: "total_assets",
            title: "TOTAL ACTIVOS",
            information: "Lorem Ipsum",
            operation: (period) => {
              return (
                (Number(period?.assets?.cash_and_investments) ?? 0) +
                (Number(period?.assets?.advances_and_progress) ?? 0) +
                (Number(period?.assets?.clients_wallet) ?? 0) +
                (Number(period?.assets?.cxc_partners) ?? 0) +
                (Number(period?.assets?.other_cxc) ?? 0) +
                (Number(period?.assets?.raw_material_and_others) ?? 0) +
                (Number(period?.assets?.products_finished) ?? 0) +
                (Number(period?.assets?.lands_and_buildings) ?? 0) +
                (Number(period?.assets?.m_and_e_vehicles) ?? 0) -
                (Number(period?.assets?.dep_acum) ?? 0) +
                (Number(period?.assets?.difer_intang_leasing) ?? 0) +
                (Number(period?.assets?.investments_and_others) ?? 0)
              );
            },
          },
        ],
      },
    ],
    variations: {
      vertical: (period, value) => {
        const total =
          (Number(period?.assets?.cash_and_investments) ?? 0) +
          (Number(period?.assets?.clients_wallet) ?? 0) +
          (Number(period?.assets?.cxc_partners) ?? 0) +
          (Number(period?.assets?.other_cxc) ?? 0) +
          (Number(period?.assets?.raw_material_and_others) ?? 0) +
          (Number(period?.assets?.products_finished) ?? 0) +
          (Number(period?.assets?.advances_and_progress) ?? 0) +
          ((Number(period?.assets?.lands_and_buildings) ?? 0) +
            (Number(period?.assets?.m_and_e_vehicles) ?? 0) -
            (Number(period?.assets?.dep_acum) ?? 0)) +
          (Number(period?.assets?.difer_intang_leasing) ?? 0) +
          (Number(period?.assets?.investments_and_others) ?? 0);

        return value != "" ? Math.round((Number(value) / total) * 100) : "-";
      },
      horizontal: (currentPeriod, previusPeriod, group, key) => {
        if (previusPeriod === undefined) {
          return undefined;
        }
        const total = Math.round(
          ((Number(currentPeriod?.[group]?.[key]) -
            Number(previusPeriod?.[group]?.[key])) /
            Number(previusPeriod?.[group]?.[key])) *
            100
        );
        return total;
      },
    },
  },
  passives: {
    key: "passives",
    title: "Pasivos",
    subgroups: [
      {
        keys: [
          {
            key: "financial_obligation_cp",
            title: "Oblig. Financ. CP",
            information: "Lorem Ipsum",
          },
          {
            key: "providers",
            title: "Proveedores",
            information: "Lorem Ipsum",
          },
          {
            key: "unpaid_expenses",
            title: "Gastos por Pagar",
            information: "Lorem Ipsum",
          },
          {
            key: "unpaid_taxes",
            title: "Impuestos Por Pagar",
            information: "Lorem Ipsum",
          },
          {
            key: "linked_economics",
            title: "Vinculados econom.",
            information: "Lorem Ipsum",
          },
          {
            key: "estimated_passives",
            title: "Pasivos Estim. y Prov.",
            information: "Lorem Ipsum",
          },
        ],
        total: [
          {
            key: "current_liabilities",
            title: "PASIVO CORRIENTE",
            information: "Lorem Ipsum",
            operation: (period) => {
              return (
                (Number(period?.passives?.financial_obligation_cp) ?? 0) +
                (Number(period?.passives?.providers) ?? 0) +
                (Number(period?.passives?.unpaid_expenses) ?? 0) +
                (Number(period?.passives?.unpaid_taxes) ?? 0) +
                (Number(period?.passives?.linked_economics) ?? 0) +
                (Number(period?.passives?.estimated_passives) ?? 0)
              );
            },
          },
        ],
      },
      {
        keys: [
          {
            key: "financial_obligation_lp",
            title: "Oblig. Financ. LP",
            information: "Otros LP, leasing",
          },
          {
            key: "other_lp_leasing",
            title: "Otros LP, leasing",
            information: "Lorem Ipsum",
          },
        ],
        total: [
          {
            key: "lp_passives",
            title: "PASIVOS DE LP",
            information: "Lorem Ipsum",
            operation: (period) => {
              return (
                (Number(period?.passives?.financial_obligation_lp) ?? 0) +
                (Number(period?.passives?.other_lp_leasing) ?? 0)
              );
            },
          },
          {
            key: "total_passives",
            title: "TOTAL PASIVOS",
            information: "Lorem Ipsum",
            operation: (period) => {
              return (
                (Number(period?.passives?.financial_obligation_cp) ?? 0) +
                (Number(period?.passives?.providers) ?? 0) +
                (Number(period?.passives?.unpaid_expenses) ?? 0) +
                (Number(period?.passives?.unpaid_taxes) ?? 0) +
                (Number(period?.passives?.linked_economics) ?? 0) +
                (Number(period?.passives?.estimated_passives) ?? 0) +
                (Number(period?.passives?.financial_obligation_lp) ?? 0) +
                (Number(period?.passives?.other_lp_leasing) ?? 0)
              );
            },
          },
        ],
      },
    ],
    variations: {
      vertical: (period, value) => {
        const total =
          (Number(period?.assets?.cash_and_investments) ?? 0) +
          (Number(period?.assets?.clients_wallet) ?? 0) +
          (Number(period?.assets?.cxc_partners) ?? 0) +
          (Number(period?.assets?.other_cxc) ?? 0) +
          (Number(period?.assets?.raw_material_and_others) ?? 0) +
          (Number(period?.assets?.products_finished) ?? 0) +
          (Number(period?.assets?.advances_and_progress) ?? 0) +
          ((Number(period?.assets?.lands_and_buildings) ?? 0) +
            (Number(period?.assets?.m_and_e_vehicles) ?? 0) -
            (Number(period?.assets?.dep_acum) ?? 0)) +
          (Number(period?.assets?.difer_intang_leasing) ?? 0) +
          (Number(period?.assets?.investments_and_others) ?? 0);

        return Math.round((Number(value === "" ? "0" : value) / total) * 100);
      },
      horizontal: (currentPeriod, previusPeriod, group, key) => {
        if (previusPeriod === undefined) {
          return undefined;
        }
        const total = Math.round(
          ((Number(currentPeriod?.[group]?.[key]) -
            Number(previusPeriod?.[group]?.[key])) /
            Number(previusPeriod?.[group]?.[key])) *
            100
        );
        return total;
      },
    },
  },
  patrimony: {
    key: "patrimony",
    title: "Patrimonio",
    subgroups: [
      {
        keys: [
          {
            key: "payed_capital",
            title: "CAPITAL PAGADO",
            information: "Lorem Ipsum",
          },
          {
            key: "sup_capital_prima",
            title: "Sup. Capital, prima",
            information: "Lorem Ipsum",
          },
          {
            key: "legal_reserve",
            title: "Reserva legal",
            information: "Lorem Ipsum",
          },
          {
            key: "periods_results",
            title: "Resultados Período",
            information: "Lorem Ipsum",
          },
          {
            key: "accumulated_results",
            title: "Resultados Acum.",
            information: "Lorem Ipsum",
          },
          {
            key: "rev_patrimony_niif",
            title: "Rev. patrimonio/ niif",
            information: "Lorem Ipsum",
          },
        ],
        total: [
          {
            key: "total_patrimony",
            title: "TOTAL PATRIMONIO",
            information: "Lorem Ipsum",
            operation: (period) => {
              return (
                Number(period?.patrimony?.payed_capital ?? 0) +
                Number(period?.patrimony?.sup_capital_prima ?? 0) +
                Number(period?.patrimony?.legal_reserve ?? 0) +
                Number(period?.patrimony?.periods_results ?? 0) +
                Number(period?.patrimony?.accumulated_results ?? 0) +
                Number(period?.patrimony?.rev_patrimony_niif ?? 0)
              );
            },
          },
          {
            key: "passive_and_patrimony",
            title: "PASIVO Y PATRIM.",
            information: "Lorem Ipsum",
            operation: (period) => {
              return (
                Number(period?.passives?.financial_obligation_cp ?? 0) +
                Number(period?.passives?.providers ?? 0) +
                Number(period?.passives?.unpaid_expenses ?? 0) +
                Number(period?.passives?.unpaid_taxes ?? 0) +
                Number(period?.passives?.linked_economics ?? 0) +
                Number(period?.passives?.estimated_passives ?? 0) +
                Number(period?.passives?.financial_obligation_lp ?? 0) +
                Number(period?.passives?.other_lp_leasing ?? 0) +
                Number(period?.patrimony?.payed_capital ?? 0) +
                Number(period?.patrimony?.sup_capital_prima ?? 0) +
                Number(period?.patrimony?.legal_reserve ?? 0) +
                Number(period?.patrimony?.periods_results ?? 0) +
                Number(period?.patrimony?.accumulated_results ?? 0) +
                Number(period?.patrimony?.rev_patrimony_niif ?? 0)
              );
            },
          },
          {
            key: "total_assets_passives",
            title: "Pasivos & Pat - Activos",
            information: "Lorem Ipsum",
            operation: (period) => {
              return (
                Number(period?.passives?.financial_obligation_cp ?? 0) +
                Number(period?.passives?.providers ?? 0) +
                Number(period?.passives?.unpaid_expenses ?? 0) +
                Number(period?.passives?.unpaid_taxes ?? 0) +
                Number(period?.passives?.linked_economics ?? 0) +
                Number(period?.passives?.estimated_passives ?? 0) +
                Number(period?.passives?.financial_obligation_lp ?? 0) +
                Number(period?.passives?.other_lp_leasing ?? 0) +
                Number(period?.patrimony?.payed_capital ?? 0) +
                Number(period?.patrimony?.sup_capital_prima ?? 0) +
                Number(period?.patrimony?.legal_reserve ?? 0) +
                Number(period?.patrimony?.periods_results ?? 0) +
                Number(period?.patrimony?.accumulated_results ?? 0) +
                Number(period?.patrimony?.rev_patrimony_niif ?? 0) -
                (Number(period?.assets?.cash_and_investments ?? 0) +
                  Number(period?.assets?.advances_and_progress ?? 0) +
                  Number(period?.assets?.clients_wallet ?? 0) +
                  Number(period?.assets?.cxc_partners ?? 0) +
                  Number(period?.assets?.other_cxc ?? 0) +
                  Number(period?.assets?.raw_material_and_others ?? 0) +
                  Number(period?.assets?.products_finished ?? 0) +
                  Number(period?.assets?.lands_and_buildings ?? 0) +
                  Number(period?.assets?.m_and_e_vehicles ?? 0) -
                  Number(period?.assets?.dep_acum ?? 0) +
                  Number(period?.assets?.difer_intang_leasing ?? 0) +
                  Number(period?.assets?.investments_and_others ?? 0))
              );
            },
          },
        ],
      },
    ],
    variations: {
      vertical: (period, value) => {
        const total =
          (Number(period?.assets?.cash_and_investments) ?? 0) +
          (Number(period?.assets?.clients_wallet) ?? 0) +
          (Number(period?.assets?.cxc_partners) ?? 0) +
          (Number(period?.assets?.other_cxc) ?? 0) +
          (Number(period?.assets?.raw_material_and_others) ?? 0) +
          (Number(period?.assets?.products_finished) ?? 0) +
          (Number(period?.assets?.advances_and_progress) ?? 0) +
          ((Number(period?.assets?.lands_and_buildings) ?? 0) +
            (Number(period?.assets?.m_and_e_vehicles) ?? 0) -
            (Number(period?.assets?.dep_acum) ?? 0)) +
          (Number(period?.assets?.difer_intang_leasing) ?? 0) +
          (Number(period?.assets?.investments_and_others) ?? 0);

        return value != "" ? Math.round((Number(value) / total) * 100) : "-";
      },
      horizontal: (currentPeriod, previusPeriod, group, key) => {
        if (previusPeriod === undefined) {
          return undefined;
        }
        const total = Math.round(
          ((Number(currentPeriod?.[group]?.[key]) -
            Number(previusPeriod?.[group]?.[key])) /
            Number(previusPeriod?.[group]?.[key])) *
            100
        );
        return total;
      },
    },
  },
  stateOfResult: {
    key: "stateOfResult",
    title: "Estado de Resultados",
    subgroups: [
      {
        keys: [
          {
            key: "gross_sale",
            title: "Ventas Brutas",
            information: "Lorem Ipsum",
          },
          {
            key: "dtos_returns",
            title: "Dtos y devoluciones",
            information: "Lorem Ipsum",
          },
        ],
        total: [
          {
            key: "net_sales",
            title: "Ventas Netas",
            information: "Lorem Ipsum",
            operation: (period) => {
              return (
                (Number(period?.stateOfResult?.gross_sale) ?? 0) -
                (Number(period?.stateOfResult?.dtos_returns) ?? 0)
              );
            },
          },
        ],
      },
      {
        keys: [
          {
            key: "cost_of_sales",
            title: "Costo de Ventas",
            information: "Lorem Ipsum",
          },
        ],
        total: [
          {
            key: "gross_profit",
            title: "UTILIDAD BRUTA",
            information: "Lorem Ipsum",
            operation: (period) => {
              return (
                (Number(period?.stateOfResult?.gross_sale) ?? 0) -
                (Number(period?.stateOfResult?.dtos_returns) ?? 0) -
                (Number(period?.stateOfResult?.cost_of_sales) ?? 0)
              );
            },
          },
        ],
      },
      {
        keys: [
          {
            key: "administrative_expenses_sales",
            title: "Gastos Admon y Vtas",
            information: "Lorem Ipsum",
          },
          {
            key: "dep_amortization",
            title: "Dep. y amortizacion",
            information: "Lorem ipsum",
          },
        ],
        total: [
          {
            key: "operating_profit",
            title: "UTILIDAD OPER.",
            information: "Lorem ipsum",
            operation: (period) => {
              return (
                Number(period?.stateOfResult?.gross_sale ?? 0) -
                Number(period?.stateOfResult?.dtos_returns ?? 0) -
                Number(period?.stateOfResult?.cost_of_sales ?? 0) -
                ((Number(
                  period?.stateOfResult?.administrative_expenses_sales
                ) ?? 0) +
                  Number(period?.stateOfResult?.dep_amortization ?? 0))
              );
            },
          },
        ],
      },
      {
        keys: [
          {
            key: "financial_income",
            title: "Ingresos Financieros",
            information: "Lorem Ipsum",
          },
          {
            key: "other_incomes",
            title: "Otros ingresos",
            information: "Lorem Ipsum",
          },
          {
            key: "financial_expenses",
            title: "Gastos financieros",
            information: "Lorem Ipsum",
          },
          {
            key: "other_expenditures",
            title: "Otros egresos",
            information: "Lorem Ipsum",
          },
        ],
        total: [
          {
            key: "income_before_taxes",
            title: "UTIL. NETA ANTES IMP.",
            information: "Lorem Ipsum",
            operation: (period) => {
              return (
                Number(period?.stateOfResult?.gross_sale ?? 0) -
                Number(period?.stateOfResult?.dtos_returns ?? 0) -
                Number(period?.stateOfResult?.cost_of_sales ?? 0) -
                (Number(
                  period?.stateOfResult?.administrative_expenses_sales ?? 0
                ) +
                  Number(period?.stateOfResult?.dep_amortization ?? 0)) +
                Number(period?.stateOfResult?.financial_income ?? 0) +
                Number(period?.stateOfResult?.other_incomes ?? 0) -
                Number(period?.stateOfResult?.financial_expenses ?? 0) -
                Number(period?.stateOfResult?.other_expenditures ?? 0)
              );
            },
          },
        ],
      },
      {
        keys: [
          {
            key: "provision_for_taxes",
            title: "Provisión Impuestos",
            information: "Lorem Ipsum",
          },
        ],
        total: [
          {
            key: "net_income",
            title: "UTILIDAD NETA",
            information: "Lorem Ipsum",
            operation: (period) => {
              return (
                (Number(period?.stateOfResult?.gross_sale) ?? 0) -
                (Number(period?.stateOfResult?.dtos_returns) ?? 0) -
                (Number(period?.stateOfResult?.cost_of_sales) ?? 0) -
                ((Number(
                  period?.stateOfResult?.administrative_expenses_sales
                ) ?? 0) +
                  (Number(period?.stateOfResult?.dep_amortization) ?? 0)) +
                (Number(period?.stateOfResult?.financial_income) ?? 0) +
                (Number(period?.stateOfResult?.other_incomes) ?? 0) -
                (Number(period?.stateOfResult?.financial_expenses) ?? 0) -
                (Number(period?.stateOfResult?.other_expenditures) ?? 0) -
                (Number(period?.stateOfResult?.provision_for_taxes) ?? 0)
              );
            },
          },
        ],
      },
    ],
    variations: {
      vertical: (period, value) => {
        return Math.round(
          (Number(value) / Number(period?.stateOfResult?.gross_sale)) * 100
        );
      },
      horizontal: (currentPeriod, previusPeriod, group, key) => {
        if (previusPeriod === undefined) {
          return undefined;
        }
        const total = Math.round(
          ((Number(currentPeriod?.[group]?.[key]) -
            Number(previusPeriod?.[group]?.[key])) /
            Number(previusPeriod?.[group]?.[key])) *
            100
        );
        return total;
      },
    },
  },
};

export const labels = [
  {
    title: "Activos",
    subgroups: [
      {
        inputs: [
          {
            title: "CAJA E INVERSIONES TOTALES",
            information: "Lorem ipsum",
          },
          {
            title: "CARTERA CLIENTES",
            information: "Lorem ipsum",
          },
          {
            title: "CXC SOCIOS",
            information: "Lorem ipsum",
          },
          {
            title: "OTRAS CXC",
            information: "Lorem ipsum",
          },
        ],
        total: [
          {
            title: "CXC NETOS",
            information: "Lorem ipsum",
          },
        ],
      },
      {
        inputs: [
          {
            title: "MATERIA PRIMA Y OTROS",
            information: "Lorem ipsum",
          },
          {
            title: "PRODUCTOS TERMINADO",
            information: "Lorem ipsum",
          },
        ],
        total: [
          {
            title: "INVENTARIO TOTAL",
            information: "Lorem ipsum",
          },
        ],
      },
      {
        inputs: [
          {
            title: "ANTICIPOS Y AVANCES",
            information: "Lorem ipsum",
          },
        ],
        total: [
          {
            title: "ACTIVO CORRIENTE",
            information: "Lorem ipsum",
          },
        ],
      },
      {
        inputs: [
          {
            title: "TERRENOS Y EDIFICIOS",
            information: "Lorem ipsum",
          },
          {
            title: "M&E, VEHÍCULOS",
            information: "Lorem ipsum",
          },
        ],
        total: [
          {
            title: "ACTIVO FIJO BRUTO",
            information: "Lorem ipsum",
          },
        ],
      },
      {
        inputs: [
          {
            title: "DEPRECIACIÓN ACUMULADA",
            information: "Lorem ipsum",
          },
        ],
        total: [
          {
            title: "ACTIVO FIJO NETO",
            information: "Lorem ipsum",
          },
        ],
      },
      {
        inputs: [
          {
            title: "DIFERIDOS, INTANGIBLES, LEASING",
            information: "Lorem ipsum",
          },
          {
            title: "INVERSIONES PERMANENTES Y OTROS",
            information: "Lorem ipsum",
          },
        ],
        total: [
          {
            title: "TOTAL OTROS ACTIVOS",
            information: "Lorem ipsum",
          },
          {
            title: "TOTAL ACTIVOS",
            information: "Lorem ipsum",
          },
        ],
      },
    ],
  },
  {
    title: "Pasivos",
    subgroups: [
      {
        inputs: [
          {
            title: "OBLIGACIONES FINANCIERAS CP",
            information: "Lorem ipsum",
          },
          {
            title: "PROVEEDORES",
            information: "Lorem ipsum",
          },
          {
            title: "GASTOS X PAGAR",
            information: "Lorem ipsum",
          },
          {
            title: "IMPUESTOS POR PAGAR",
            information: "Lorem ipsum",
          },
          {
            title: "VINCULADOS ECONÓMICOS",
            information: "Lorem ipsum",
          },
          {
            title: "PASIVOS ESTIMADOS Y PROV.",
            information: "Lorem ipsum",
          },
        ],
        total: [
          {
            title: "PASIVO CORRIENTE",
            information: "Lorem ipsum",
          },
        ],
      },
      {
        inputs: [
          {
            title: "OBLIGACIONES FINANCIERAS LP",
            information: "Lorem ipsum",
          },
          {
            title: "OTROS LP, LEASING",
            information: "Lorem ipsum",
          },
        ],
        total: [
          {
            title: "PASIVOS DE LP",
            information: "Lorem ipsum",
          },
          {
            title: "TOTAL PASIVOS",
            information: "Lorem ipsum",
          },
        ],
      },
    ],
  },
  {
    title: "Patrimonio",
    subgroups: [
      {
        inputs: [
          {
            title: "CAPITAL PAGADO",
            information: "Lorem ipsum",
          },
          {
            title: "SUP. CAPITAL, PRIMA",
            information: "Lorem ipsum",
          },
          {
            title: "RESERVA LEGAL",
            information: "Lorem ipsum",
          },
          {
            title: "RESULTADOS PERÍODO",
            information: "Lorem ipsum",
          },
          {
            title: "RESULTADOS ACUMULADOS",
            information: "Lorem ipsum",
          },
          {
            title: "REV. PATRIMONIO/ NIIF",
            information: "Lorem ipsum",
          },
        ],
        total: [
          {
            title: "TOTAL PATRIMONIO",
            information: "Lorem ipsum",
          },
          {
            title: "TOTAL PASIVOS Y PATRIMONIO",
            information: "Lorem ipsum",
          },
          {
            title: "TOTAL ACTIVOS Y PASIVOS",
            information: "Lorem ipsum",
          },
        ],
      },
    ],
  },
  {
    title: "Estado de Resultados",
    subgroups: [
      {
        inputs: [
          {
            title: "Ventas Brutas",
            information: "Lorem ipsum",
          },
          {
            title: "Dtos y devoluciones",
            information: "Lorem ipsum",
          },
        ],
        total: [
          {
            title: "Ventas Netas",
            information: "Lorem ipsum",
          },
        ],
      },
      {
        inputs: [
          {
            title: "Costo de Ventas",
            information: "Lorem ipsum",
          },
        ],
        total: [
          {
            title: "UTILIDAD BRUTA",
            information: "Lorem ipsum",
          },
        ],
      },
      {
        inputs: [
          {
            title: "Gastos Admon y Vtas",
            information: "Lorem ipsum",
          },
          {
            title: "Dep. y amortizacion",
            information: "Lorem ipsum",
          },
        ],
        total: [
          {
            title: "UTILIDAD OPER.",
            information: "Lorem ipsum",
          },
        ],
      },
      {
        inputs: [
          {
            title: "Ingresos Financieros",
            information: "Lorem ipsum",
          },
          {
            title: "Otros ingresos",
            information: "Lorem ipsum",
          },
          {
            title: "Gastos financieros",
            information: "Lorem ipsum",
          },
          {
            title: "Otros egresos",
            information: "Lorem ipsum",
          },
        ],
        total: [
          {
            title: "UTIL. NETA ANTES IMP.",
            information: "Lorem ipsum",
          },
        ],
      },
      {
        inputs: [
          {
            title: "Provisión Impuestos",
            information: "Lorem ipsum",
          },
        ],
        total: [
          {
            title: "UTILIDAD NETA",
            information: "Lorem ipsum",
          },
        ],
      },
    ],
  },
];

export const getEmptyPeriod = () => {
  return JSON.parse(
    JSON.stringify({
      id: "",
      period: 0,
      typePeriod: "",
      client: "",
      balance: "",
      stateOfCashflow: "",
      financialStatementAudit: "",
      managementReport: "",
      certificateOfStockOwnership: "",
      rentDeclaration: "",
      assets: {
        cash_and_investments: 0,
        clients_wallet: 0,
        cxc_partners: 0,
        other_cxc: 0,
        net_cxc: 0,
        raw_material_and_others: 0,
        products_finished: 0,
        total_inventory: 0,
        advances_and_progress: 0,
        current_assets: 0,
        lands_and_buildings: 0,
        m_and_e_vehicles: 0,
        gross_fixed_assets: 0,
        dep_acum: 0,
        net_fixed_assets: 0,
        difer_intang_leasing: 0,
        investments_and_others: 0,
        total_other_assets: 0,
        total_assets: 0,
      },
      passives: {
        financial_obligation_cp: 0,
        providers: 0,
        unpaid_expenses: 0,
        unpaid_taxes: 0,
        linked_economics: 0,
        estimated_passives: 0,
        current_liabilities: 0,
        financial_obligation_lp: 0,
        other_lp_leasing: 0,
        lp_passives: 0,
        total_passives: 0,
      },
      patrimony: {
        payed_capital: 0,
        sup_capital_prima: 0,
        legal_reserve: 0,
        periods_results: 0,
        accumulated_results: 0,
        rev_patrimony_niif: 0,
        total_patrimony: 0,
        passive_and_patrimony: 0,
        total_assets_passives: 0,
      },
      stateOfResult: {
        gross_sale: 0,
        dtos_returns: 0,
        net_sales: 0,
        cost_of_sales: 0,
        gross_profit: 0,
        administrative_expenses_sales: 0,
        dep_amortization: 0,
        operating_profit: 0,
        financial_income: 0,
        other_incomes: 0,
        financial_expenses: 0,
        other_expenditures: 0,
        income_before_taxes: 0,
        provision_for_taxes: 0,
        net_income: 0,
      },
    })
  );
};

export const totals = [
  {
    key: "net_cxc",
    group: "assets",
    title: "CXC Netos",
    information: "Lorem Ipsum",
    operation: (period) => {
      return (
        (Number(period?.assets?.clients_wallet) ?? 0) +
        (Number(period?.assets?.cxc_partners) ?? 0) +
        (Number(period?.assets?.other_cxc) ?? 0)
      );
    },
  },
  {
    key: "total_inventory",
    group: "assets",
    title: "Inventario Total",
    information: "Lorem Ipsum",
    operation: (period) => {
      return (
        (Number(period?.assets?.raw_material_and_others) ?? 0) +
        (Number(period?.assets?.products_finished) ?? 0)
      );
    },
  },
  {
    key: "current_assets",
    group: "assets",
    title: "ACTIVO CORRIENTE",
    information: "Lorem Ipsum",
    operation: (period) => {
      return (
        (Number(period?.assets?.cash_and_investments) ?? 0) +
        (Number(period?.assets?.advances_and_progress) ?? 0) +
        (Number(period?.assets?.clients_wallet) ?? 0) +
        (Number(period?.assets?.cxc_partners) ?? 0) +
        (Number(period?.assets?.other_cxc) ?? 0) +
        (Number(period?.assets?.raw_material_and_others) ?? 0) +
        (Number(period?.assets?.products_finished) ?? 0)
      );
    },
  },
  {
    key: "gross_fixed_assets",
    group: "assets",
    title: "Activo Fijo Bruto",
    information: "Lorem Ipsum",
    operation: (period) => {
      return (
        (Number(period?.assets?.lands_and_buildings) ?? 0) +
        (Number(period?.assets?.m_and_e_vehicles) ?? 0)
      );
    },
  },
  {
    key: "net_fixed_assets",
    group: "assets",
    title: "ACTIVO FIJO NETO",
    information: "Lorem Ipsum",
    operation: (period) => {
      return (
        (Number(period?.assets?.lands_and_buildings) ?? 0) +
        (Number(period?.assets?.m_and_e_vehicles) ?? 0) -
        (Number(period?.assets?.dep_acum) ?? 0)
      );
    },
  },
  {
    key: "total_other_assets",
    group: "assets",
    title: "TOTAL OTROS ACT",
    information: "Lorem Ipsum",
    operation: (period) => {
      return (
        (Number(period?.assets?.difer_intang_leasing) ?? 0) +
        (Number(period?.assets?.investments_and_others) ?? 0)
      );
    },
  },
  {
    key: "total_assets",
    group: "assets",
    title: "TOTAL ACTIVOS",
    information: "Lorem Ipsum",
    operation: (period) => {
      return (
        (Number(period?.assets?.cash_and_investments) ?? 0) +
        (Number(period?.assets?.advances_and_progress) ?? 0) +
        (Number(period?.assets?.clients_wallet) ?? 0) +
        (Number(period?.assets?.cxc_partners) ?? 0) +
        (Number(period?.assets?.other_cxc) ?? 0) +
        (Number(period?.assets?.raw_material_and_others) ?? 0) +
        (Number(period?.assets?.products_finished) ?? 0) +
        (Number(period?.assets?.lands_and_buildings) ?? 0) +
        (Number(period?.assets?.m_and_e_vehicles) ?? 0) -
        (Number(period?.assets?.dep_acum) ?? 0) +
        (Number(period?.assets?.difer_intang_leasing) ?? 0) +
        (Number(period?.assets?.investments_and_others) ?? 0)
      );
    },
  },
  {
    key: "current_liabilities",
    group: "passives",
    title: "PASIVO CORRIENTE",
    information: "Lorem Ipsum",
    operation: (period) => {
      return (
        (Number(period?.passives?.financial_obligation_cp) ?? 0) +
        (Number(period?.passives?.providers) ?? 0) +
        (Number(period?.passives?.unpaid_expenses) ?? 0) +
        (Number(period?.passives?.unpaid_taxes) ?? 0) +
        (Number(period?.passives?.linked_economics) ?? 0) +
        (Number(period?.passives?.estimated_passives) ?? 0)
      );
    },
  },
  {
    key: "lp_passives",
    group: "passives",
    title: "PASIVOS DE LP",
    information: "Lorem Ipsum",
    operation: (period) => {
      return (
        (Number(period?.passives?.financial_obligation_lp) ?? 0) +
        (Number(period?.passives?.other_lp_leasing) ?? 0)
      );
    },
  },
  {
    key: "total_passives",
    group: "passives",
    title: "TOTAL PASIVOS",
    information: "Lorem Ipsum",
    operation: (period) => {
      return (
        (Number(period?.passives?.financial_obligation_cp) ?? 0) +
        (Number(period?.passives?.providers) ?? 0) +
        (Number(period?.passives?.unpaid_expenses) ?? 0) +
        (Number(period?.passives?.unpaid_taxes) ?? 0) +
        (Number(period?.passives?.linked_economics) ?? 0) +
        (Number(period?.passives?.estimated_passives) ?? 0) +
        (Number(period?.passives?.financial_obligation_lp) ?? 0) +
        (Number(period?.passives?.other_lp_leasing) ?? 0)
      );
    },
  },
  {
    key: "total_patrimony",
    group: "patrimony",
    title: "TOTAL PATRIMONIO",
    information: "Lorem Ipsum",
    operation: (period) => {
      return (
        Number(period?.patrimony?.payed_capital ?? 0) +
        Number(period?.patrimony?.sup_capital_prima ?? 0) +
        Number(period?.patrimony?.legal_reserve ?? 0) +
        Number(period?.patrimony?.periods_results ?? 0) +
        Number(period?.patrimony?.accumulated_results ?? 0) +
        Number(period?.patrimony?.rev_patrimony_niif ?? 0)
      );
    },
  },
  {
    key: "passive_and_patrimony",
    group: "patrimony",
    title: "PASIVO Y PATRIM.",
    information: "Lorem Ipsum",
    operation: (period) => {
      return (
        Number(period?.passives?.financial_obligation_cp ?? 0) +
        Number(period?.passives?.providers ?? 0) +
        Number(period?.passives?.unpaid_expenses ?? 0) +
        Number(period?.passives?.unpaid_taxes ?? 0) +
        Number(period?.passives?.linked_economics ?? 0) +
        Number(period?.passives?.estimated_passives ?? 0) +
        Number(period?.passives?.financial_obligation_lp ?? 0) +
        Number(period?.passives?.other_lp_leasing ?? 0) +
        Number(period?.patrimony?.payed_capital ?? 0) +
        Number(period?.patrimony?.sup_capital_prima ?? 0) +
        Number(period?.patrimony?.legal_reserve ?? 0) +
        Number(period?.patrimony?.periods_results ?? 0) +
        Number(period?.patrimony?.accumulated_results ?? 0) +
        Number(period?.patrimony?.rev_patrimony_niif ?? 0)
      );
    },
  },
  {
    key: "total_assets_passives",
    group: "patrimony",
    title: "Pasivos & Pat - Activos",
    information: "Lorem Ipsum",
    operation: (period) => {
      return (
        Number(period?.passives?.financial_obligation_cp ?? 0) +
        Number(period?.passives?.providers ?? 0) +
        Number(period?.passives?.unpaid_expenses ?? 0) +
        Number(period?.passives?.unpaid_taxes ?? 0) +
        Number(period?.passives?.linked_economics ?? 0) +
        Number(period?.passives?.estimated_passives ?? 0) +
        Number(period?.passives?.financial_obligation_lp ?? 0) +
        Number(period?.passives?.other_lp_leasing ?? 0) +
        Number(period?.patrimony?.payed_capital ?? 0) +
        Number(period?.patrimony?.sup_capital_prima ?? 0) +
        Number(period?.patrimony?.legal_reserve ?? 0) +
        Number(period?.patrimony?.periods_results ?? 0) +
        Number(period?.patrimony?.accumulated_results ?? 0) +
        Number(period?.patrimony?.rev_patrimony_niif ?? 0) -
        (Number(period?.assets?.cash_and_investments ?? 0) +
          Number(period?.assets?.advances_and_progress ?? 0) +
          Number(period?.assets?.clients_wallet ?? 0) +
          Number(period?.assets?.cxc_partners ?? 0) +
          Number(period?.assets?.other_cxc ?? 0) +
          Number(period?.assets?.raw_material_and_others ?? 0) +
          Number(period?.assets?.products_finished ?? 0) +
          Number(period?.assets?.lands_and_buildings ?? 0) +
          Number(period?.assets?.m_and_e_vehicles ?? 0) -
          Number(period?.assets?.dep_acum ?? 0) +
          Number(period?.assets?.difer_intang_leasing ?? 0) +
          Number(period?.assets?.investments_and_others ?? 0))
      );
    },
  },
  {
    key: "net_sales",
    group: "stateOfResult",
    title: "Ventas Netas",
    information: "Lorem Ipsum",
    operation: (period) => {
      return (
        (Number(period?.stateOfResult?.gross_sale) ?? 0) -
        (Number(period?.stateOfResult?.dtos_returns) ?? 0)
      );
    },
  },
  {
    key: "gross_profit",
    group: "stateOfResult",
    title: "UTILIDAD BRUTA",
    information: "Lorem Ipsum",
    operation: (period) => {
      return (
        (Number(period?.stateOfResult?.gross_sale) ?? 0) -
        (Number(period?.stateOfResult?.dtos_returns) ?? 0) -
        (Number(period?.stateOfResult?.cost_of_sales) ?? 0)
      );
    },
  },
  {
    key: "operating_profit",
    group: "stateOfResult",
    title: "UTILIDAD OPER.",
    information: "Lorem ipsum",
    operation: (period) => {
      return (
        Number(period?.stateOfResult?.gross_sale ?? 0) -
        Number(period?.stateOfResult?.dtos_returns ?? 0) -
        Number(period?.stateOfResult?.cost_of_sales ?? 0) -
        ((Number(period?.stateOfResult?.administrative_expenses_sales) ?? 0) +
          Number(period?.stateOfResult?.dep_amortization ?? 0))
      );
    },
  },
  {
    key: "income_before_taxes",
    group: "stateOfResult",
    title: "UTIL. NETA ANTES IMP.",
    information: "Lorem Ipsum",
    operation: (period) => {
      return (
        Number(period?.stateOfResult?.gross_sale ?? 0) -
        Number(period?.stateOfResult?.dtos_returns ?? 0) -
        Number(period?.stateOfResult?.cost_of_sales ?? 0) -
        (Number(period?.stateOfResult?.administrative_expenses_sales ?? 0) +
          Number(period?.stateOfResult?.dep_amortization ?? 0)) +
        Number(period?.stateOfResult?.financial_income ?? 0) +
        Number(period?.stateOfResult?.other_incomes ?? 0) -
        Number(period?.stateOfResult?.financial_expenses ?? 0) -
        Number(period?.stateOfResult?.other_expenditures ?? 0)
      );
    },
  },
  {
    key: "net_income",
    group: "stateOfResult",
    title: "UTILIDAD NETA",
    information: "Lorem Ipsum",
    operation: (period) => {
      return (
        (Number(period?.stateOfResult?.gross_sale) ?? 0) -
        (Number(period?.stateOfResult?.dtos_returns) ?? 0) -
        (Number(period?.stateOfResult?.cost_of_sales) ?? 0) -
        ((Number(period?.stateOfResult?.administrative_expenses_sales) ?? 0) +
          (Number(period?.stateOfResult?.dep_amortization) ?? 0)) +
        (Number(period?.stateOfResult?.financial_income) ?? 0) +
        (Number(period?.stateOfResult?.other_incomes) ?? 0) -
        (Number(period?.stateOfResult?.financial_expenses) ?? 0) -
        (Number(period?.stateOfResult?.other_expenditures) ?? 0) -
        (Number(period?.stateOfResult?.provision_for_taxes) ?? 0)
      );
    },
  },
];
