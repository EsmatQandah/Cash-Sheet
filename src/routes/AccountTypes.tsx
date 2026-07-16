import React, { useMemo } from "react";
import type { ColDef } from "ag-grid-community";
import DataGrid from "../components/DataGrid";
import { useEntity } from "../hooks/useEntity";
import { useLanguage } from "../state/LanguageContext";
import type { AccountType } from "../types";

export default function AccountTypes() {
  const { rows, refresh, api } = useEntity(window.api.accountTypes);
  const { t } = useLanguage();

  const columns = useMemo<ColDef<AccountType>[]>(
    () => [
      { field: "id", headerName: "#", editable: false, width: 80 },
      { field: "name", headerName: t("typeName"), flex: 1 },
    ],
    [t]
  );

  return (
    <div className="page">
      <h1>{t("accountTypesTitle")}</h1>
      <DataGrid<AccountType>
        columns={columns}
        rows={rows}
        newRowDefaults={{ name: t("newTypeDefault") }}
        onCreate={api.create}
        onUpdate={api.update}
        onDelete={api.remove}
        onChanged={refresh}
      />
    </div>
  );
}
