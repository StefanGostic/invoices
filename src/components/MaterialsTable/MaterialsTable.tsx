/* eslint-disable react-hooks/rules-of-hooks */
import React, { HTMLProps, useEffect, useState } from "react";
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
  rowSelection?: Record<string, boolean>;
  setRowSelection?: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}

const MaterialsTable = ({
  rowSelection,
  setRowSelection,
}: MaterialsTableProps) => {
  const { materials, filteredMaterials, addChosenMaterial } =
    useMaterialStore();

  const columns = React.useMemo<ColumnDef<Material>[]>(
    () => [
      {
        id: "select",
        size: 15,
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className={styles.center}>
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        header: "",
        id: "table",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorFn: (row) => row.id,
            id: "id",
            header: () => <span># Nm</span>,
            footer: (props) => props.column.id,
            size: 15,
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
            size: 700,
            minSize: 500,
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
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  const addMaterialToInvoice = (id: string, row: any) => {
    addChosenMaterial(id);
  };

  function getRowIdSelected(row: any, materials: any[]) {
    const materialId = row
      ?.getVisibleCells()
      ?.at(1)
      ?.getContext()
      ?.getValue() as number;

    const material = materials.find(
      (material) => material.id.toString() === materialId?.toString() || ""
    );

    return material?.selected;
  }

  function getRowIdModified(row: any, materials: any[]) {
    const materialId = row
      ?.getVisibleCells()
      ?.at(1)
      ?.getContext()
      ?.getValue() as number;

    const material = materials.find(
      (material) => material.id.toString() === materialId?.toString() || ""
    );

    return material?.isModified;
  }

  function getRowQuantity(row: any) {
    const materialId = row
      ?.getVisibleCells()
      ?.at(1)
      ?.getContext()
      ?.getValue() as number;

    const material = materials.find(
      (material) => material.id.toString() === materialId?.toString() || ""
    );

    return material?.["invoice_line/quantity"].toString();
  }

  return (
    <div className={styles.container}>
      <table
        className={styles.table1}
        style={{
          width: table.getCenterTotalSize(),
        }}
      >
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
                      ?.at(1)
                      ?.getContext()
                      ?.getValue() as number
                  ).toString() || "",
                  row
                )
              }
              className={classNames(styles.rowT, {
                [styles.noQuantity]: getRowQuantity(row) === "0",
                [styles.isModified]:
                  getRowQuantity(row) !== "0" &&
                  !getRowIdSelected(row, materials) &&
                  getRowIdModified(row, materials),
                [styles.selected]:
                  getRowQuantity(row) !== "0" &&
                  getRowIdSelected(row, materials),
              })}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    width: cell.column.getSize(),
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialsTable;
