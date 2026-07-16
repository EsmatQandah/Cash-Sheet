import React, { useMemo } from "react";
import type { ColDef } from "ag-grid-community";
import DataGrid from "../components/DataGrid";
import { useEntity } from "../hooks/useEntity";
import { useLanguage } from "../state/LanguageContext";
import type { Holder } from "../types";

export default function Holders() {
  const { rows, refresh, api } = useEntity(window.api.holders);
  const { t } = useLanguage();

  const columns = useMemo<ColDef<Holder>[]>(
    () => [
      { field: "id", headerName: "#", editable: false, width: 80 },
      { field: "full_name", headerName: t("fullName") },
      { field: "phone", headerName: t("phone") },
      { field: "email", headerName: t("email") },
      { field: "national_id", headerName: t("nationalId") },
      { field: "notes", headerName: t("notes"), flex: 1 },
    ],
    [t]
  );

  return (
    <div className="page">
      <h1>{t("holdersTitle")}</h1>
      <DataGrid<Holder>
        columns={columns}
        rows={rows}
        newRowDefaults={{ full_name: t("newHolderDefault") }}
        onCreate={api.create}
        onUpdate={api.update}
        onDelete={api.remove}
        onChanged={refresh}
      />
    </div>
  );
}
