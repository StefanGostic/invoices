"use client";

import React, { useEffect } from "react";
import styles from "./LeftSide.module.scss";
import MaterialsTable from "../MaterialsTable/MaterialsTable";
import classNames from "classnames";
import Papa from "papaparse";
import { useMaterialStore } from "@/stores/useMaterialStore";
import { Material } from "@/utils/types";
import { postMaterials } from "@/app/axios/materialsApi";

type LeftSideProps = {
  materials: Material[];
  className?: string;
};

const LeftSide = ({ materials, className }: LeftSideProps) => {
  const [rowSelection, setRowSelection] = React.useState({});

  const {
    materials: oldMaterials,
    setMaterials,
    filterMaterialsByName,
    deleteMaterials,
  } = useMaterialStore();

  useEffect(() => {
    setMaterials(materials);
  }, [materials]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files && e.target.files.length > 0) {
      Papa.parse(e.target.files[0], {
        header: true,
        complete: function (results: any) {
          const newMaterials: Material[] = results.data.map(
            (d: any, index: number) => {
              return {
                id: index + 1,
                "invoice_line/origin": d["invoice_line/origin"] || "",
                "invoice_line/name": d["invoice_line/name"] || "",
                "invoice_line/price_unit": d["invoice_line/price_unit"] || "",
                "invoice_line/quantity": d["invoice_line/quantity"] || "",
                "invoice_line/discount": d["invoice_line/discount"] || "",
                "invoice_line/price_subtotal":
                  d["invoice_line/price_subtotal"] || "",
                "invoice_line/uos_id/name": d["invoice_line/uos_id/name"] || "",
              };
            }
          );
          postMaterials(newMaterials);
          setMaterials([...oldMaterials, ...newMaterials]);
        },
      });
    }
  };

  const handleDelete = () => {
    const materialsToDelete = Object.keys(rowSelection).map((id) => {
      return oldMaterials.at(parseInt(id));
    });
    const ids = materialsToDelete.map((m) => parseInt(m?.id || ""));
    deleteMaterials(ids);
    setRowSelection({});
  };

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.header}>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
        />

        <button onClick={handleDelete}>Izbrisi materijale</button>

        <input
          className={styles.input}
          type="text"
          placeholder="Search"
          onChange={(e) => filterMaterialsByName(e.target.value)}
        />
      </div>
      <MaterialsTable
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      ></MaterialsTable>
    </div>
  );
};

export default LeftSide;
