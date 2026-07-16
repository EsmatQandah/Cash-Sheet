import React, { useMemo } from "react";
import type { ColDef } from "ag-grid-community";
import DataGrid from "../components/DataGrid";
import { useEntity } from "../hooks/useEntity";
import { useLanguage } from "../state/LanguageContext";
import type { Currency } from "../types";

export default function Currencies() {
  const { rows, refresh, api } = useEntity(window.api.currencies);
  const { t } = useLanguage();

  const columns = useMemo<ColDef<Currency>[]>(
    () => [
      { field: "id", headerName: "#", editable: false, width: 80 },
      { field: "code", headerName: t("currencyCode"), width: 120 },
      { field: "name", headerName: t("currencyName"), flex: 1 },
    ],
    [t]
  );

  return (
    <div className="page">
      <h1>{t("currenciesTitle")}</h1>
      <DataGrid<Currency>
        columns={columns}
        rows={rows}
        newRowDefaults={{ code: "XXX", name: t("newCurrencyDefault") }}
        onCreate={api.create}
        onUpdate={api.update}
        onDelete={api.remove}
        onChanged={refresh}
      />
    </div>
  );
}
