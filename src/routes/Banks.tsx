import React, { useMemo } from "react";
import type { ColDef } from "ag-grid-community";
import DataGrid from "../components/DataGrid";
import { useEntity } from "../hooks/useEntity";
import { useLanguage } from "../state/LanguageContext";
import type { Bank } from "../types";

export default function Banks() {
  const { rows, refresh, api } = useEntity(window.api.banks);
  const { t } = useLanguage();

  const columns = useMemo<ColDef<Bank>[]>(
    () => [
      { field: "id", headerName: "#", editable: false, width: 80 },
      { field: "name", headerName: t("bankName"), flex: 1 },
      { field: "swift_code", headerName: t("swiftCode") },
    ],
    [t]
  );

  return (
    <div className="page">
      <h1>{t("banksTitle")}</h1>
      <DataGrid<Bank>
        columns={columns}
        rows={rows}
        newRowDefaults={{ name: t("newBankDefault") }}
        onCreate={api.create}
        onUpdate={api.update}
        onDelete={api.remove}
        onChanged={refresh}
      />
    </div>
  );
}
