import React, { useCallback, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { CellValueChangedEvent, ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useLanguage } from "../state/LanguageContext";

interface RowBase {
  id: number;
}

interface DataGridProps<T extends RowBase> {
  columns: ColDef<T>[];
  rows: T[];
  newRowDefaults: Partial<T>;
  onCreate: (data: Partial<T>) => Promise<T>;
  onUpdate: (id: number, data: Partial<T>) => Promise<T>;
  onDelete: (id: number) => Promise<void>;
  onChanged?: () => void;
}

export default function DataGrid<T extends RowBase>({
  columns,
  rows,
  newRowDefaults,
  onCreate,
  onUpdate,
  onDelete,
  onChanged,
}: DataGridProps<T>) {
  const { t, dir } = useLanguage();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const columnDefs = useMemo<ColDef<T>[]>(
    () => columns.map((c) => ({ editable: true, resizable: true, sortable: true, filter: true, ...c })),
    [columns]
  );

  const handleCellValueChanged = useCallback(
    async (event: CellValueChangedEvent<T>) => {
      if (!event.colDef.field || !event.data) return;
      await onUpdate(event.data.id, { [event.colDef.field]: event.newValue } as Partial<T>);
      onChanged?.();
    },
    [onUpdate, onChanged]
  );

  async function handleAddRow() {
    await onCreate(newRowDefaults);
    onChanged?.();
  }

  async function handleDeleteRow() {
    if (selectedId == null) return;
    if (!confirm(t("confirmDeleteRow"))) return;
    await onDelete(selectedId);
    setSelectedId(null);
    onChanged?.();
  }

  return (
    <div className="data-grid-wrapper">
      <div className="data-grid-toolbar">
        <button onClick={handleAddRow}>{t("addRow")}</button>
        <button onClick={handleDeleteRow} disabled={selectedId == null} className="danger">
          {t("deleteSelectedRow")}
        </button>
      </div>
      <div className="ag-theme-alpine data-grid-container" dir={dir}>
        <AgGridReact<T>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={(p) => String(p.data.id)}
          enableRtl={dir === "rtl"}
          rowSelection="single"
          onSelectionChanged={(e) => {
            const selected = e.api.getSelectedRows();
            setSelectedId(selected.length ? selected[0].id : null);
          }}
          onCellValueChanged={handleCellValueChanged}
          singleClickEdit
          stopEditingWhenCellsLoseFocus
        />
      </div>
    </div>
  );
}
