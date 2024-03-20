import React from "react";
import styles from "./MaterialsTable.module.scss";
import { Material } from "@/utils/types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMaterialStore } from "@/stores/useMaterialStore";

type MaterialsTableProps = {
  add?: () => void;
};

const MaterialsTable = ({
  add = () => console.log("haha"),
}: MaterialsTableProps) => {
  const [data, setData] = React.useState<Material[]>([]);
  const { materials, setMaterials, addChosenMaterial } = useMaterialStore();

  const columnHelper = createColumnHelper<Material>();

  const columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("invoice_line/origin", {
      header: () => "invoice_line/origin",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("invoice_line/name", {
      header: () => "invoice_line/name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("invoice_line/quantity", {
      header: () => "invoice_line/quantity",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("invoice_line/uos_id/name", {
      header: () => "invoice_line/uos_id/name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("invoice_line/price_unit", {
      header: () => "invoice_line/price_unit",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("invoice_line/discount", {
      header: () => "invoice_line/discount",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("invoice_line/price_subtotal", {
      header: () => "invoice_line/price_subtotal",
      cell: (info) => info.getValue(),
    }),
  ];

  const table = useReactTable({
    columns,
    data: materials,
    getCoreRowModel: getCoreRowModel(),
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
              {headerGroup.headers.map((header) => (
                <th key={header.id} className={styles.th}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
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
                    (row
                      ?.getVisibleCells()
                      ?.at(0)
                      ?.getContext()
                      ?.getValue() as number) - 1
                  ).toString() || "",
                  row
                )
              }
            >
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
