/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import styles from "./MaterialsTable.module.scss";
import { Material } from "@/utils/types";
import {
  ColumnDef,
  RowData,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMaterialStore } from "@/stores/useMaterialStore";
import classNames from "classnames";

type MaterialsTableProps = {
  add?: () => void;
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

const defaultColumn: Partial<ColumnDef<Material>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <input
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        className={styles.inputTable}
      />
    );
  },
};

const MaterialsTable = ({
  add = () => console.log("haha"),
}: MaterialsTableProps) => {
  const { materials, filteredMaterials, addChosenMaterial, updateMaterial } =
    useMaterialStore();

  const columns = React.useMemo<ColumnDef<Material>[]>(
    () => [
      {
        header: "",
        id: "table",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorFn: (row) => row.id,
            id: "id",
            header: () => <span>id</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row["invoice_line/origin"],
            id: "invoice_line/origin",
            header: () => <span>invoice_line/origin</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row["invoice_line/name"],
            id: "invoice_line/name",
            header: () => <span>invoice_line/name</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row["invoice_line/quantity"],
            id: "invoice_line/quantity",
            header: () => <span>invoice_line/quantity</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row["invoice_line/uos_id/name"],
            id: "invoice_line/uos_id/name",
            header: () => <span>invoice_line/uos_id/name</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row["invoice_line/price_unit"],
            id: "invoice_line/price_unit",
            header: () => <span>invoice_line/price_unit</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row["invoice_line/discount"],
            id: "invoice_line/discount",
            header: () => <span>invoice_line/discount</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row["invoice_line/price_subtotal"],
            id: "invoice_line/price_subtotal",
            header: () => <span>invoice_line/price_subtotal</span>,
            footer: (props) => props.column.id,
          },
        ],
      },
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: filteredMaterials.length > 0 ? filteredMaterials : materials,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        let key: keyof Material = columnId as keyof Material;
        const oldMaterial = materials[rowIndex];
        if (oldMaterial[key] === value) return;

        const newMaterial = { ...oldMaterial, [key]: value };
        updateMaterial((rowIndex + 1).toString(), newMaterial);
      },
    },
    debugTable: true,
  });

  const rerender = React.useReducer(() => ({}), {})[1];

  const addMaterialToInvoice = (id: string, row: any) => {
    addChosenMaterial(id);

    // rerender();
  };

  return (
    <div className={styles.container}>
      <table className={styles.table1}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className={styles.tbody}>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onDoubleClick={() =>
                addMaterialToInvoice(
                  (
                    row
                      ?.getVisibleCells()
                      ?.at(0)
                      ?.getContext()
                      ?.getValue() as number
                  ).toString() || "",
                  row
                )
              }
              className={classNames(styles.rowT, {
                [styles.selected]: materials.find(
                  (material) =>
                    material.id.toString() ===
                      (
                        row
                          ?.getVisibleCells()
                          ?.at(0)
                          ?.getContext()
                          ?.getValue() as number
                      ).toString() || ""
                )?.selected,
              })}
            >
              {materials.find(
                (material) =>
                  material.id.toString() ===
                    (
                      row
                        ?.getVisibleCells()
                        ?.at(0)
                        ?.getContext()
                        ?.getValue() as number
                    ).toString() || ""
              )?.selected && <div className={styles.selectedAbs}></div>}
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* <button onClick={() => add()} className="border p-2">
        Rerender
      </button> */}
    </div>
  );
};

export default MaterialsTable;
