"use client";
import React, { useEffect } from "react";
import styles from "./LeftSide.module.scss";
import MaterialsTable from "../MaterialsTable/MaterialsTable";
import classNames from "classnames";
import Papa from "papaparse";
import { useMaterialStore } from "@/stores/useMaterialStore";
import { Material } from "@/utils/types";
import { postMaterials } from "@/app/axios/materialsApi";
import { SubmitHandler, useForm } from "react-hook-form";

type LeftSideProps = {
  materials: Material[];
  className?: string;
};

const LeftSide = ({ materials, className }: LeftSideProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<Material>();
  const [rowSelection, setRowSelection] = React.useState({});
  const [nextIdToInsert, setNextIdToInsert] = React.useState<string>(
    materials?.[materials.length - 1]?.id + 1 || "1"
  );

  const onSubmit: SubmitHandler<Material> = async (data) => {
    const addedIdData = { ...data };
    addedIdData.id = nextIdToInsert;
    await postMaterials(addedIdData);
    setMaterials([...oldMaterials, addedIdData]);
    setNextIdToInsert((parseInt(nextIdToInsert) + 1).toString());
    dialogRef?.current?.close();
  };

  const {
    materials: oldMaterials,
    setMaterials,
    filterMaterialsByName,
    deleteMaterials,
  } = useMaterialStore();

  useEffect(() => {
    setMaterials(materials);
  }, [materials]);

  const dialogRef = React.useRef<HTMLDialogElement>(null);

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
                isModified: false,
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
    if (Object.keys(rowSelection).length === 0) {
      alert("Niste izabrali materijale za brisanje");
      return;
    }
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
        <label>
          Upload File:
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
          />
        </label>

        <button onClick={handleDelete} style={{ height: "40px" }}>
          Izbrisi materijale
        </button>

        <button
          onClick={() => dialogRef?.current?.showModal()}
          style={{ height: "40px" }}
        >
          Dodaj novi materijal
        </button>

        <label>
          Search:
          <input
            className={styles.input}
            type="text"
            placeholder="Search"
            onChange={(e) => filterMaterialsByName(e.target.value)}
            style={{ height: "40px", marginLeft: "8px" }}
          />
        </label>
      </div>
      <MaterialsTable
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      ></MaterialsTable>
      <dialog ref={dialogRef} className={styles.dialog}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.content}>
            <div className={styles.inputWrapper}>
              <label>
                Origin:
                <input
                  type="text"
                  {...register("invoice_line/origin", { required: true })}
                />
                {errors?.["invoice_line/origin"] && (
                  <span className={styles.error}>Obavezno polje</span>
                )}
              </label>
            </div>
            <div className={styles.inputWrapper}>
              <label>
                Name:
                <input
                  type="text"
                  {...register("invoice_line/name", { required: true })}
                />
                {errors?.["invoice_line/name"] && (
                  <span className={styles.error}>Obavezno polje</span>
                )}
              </label>
            </div>
            <div className={styles.inputWrapper}>
              <label>
                Quantity:
                <input
                  type="number"
                  step="any"
                  {...register("invoice_line/quantity", { required: true })}
                />
                {errors?.["invoice_line/quantity"] && (
                  <span className={styles.error}>Obavezno polje</span>
                )}
              </label>
            </div>
            <div className={styles.inputWrapper}>
              <label>
                UOS Name:
                <input
                  type="text"
                  {...register("invoice_line/uos_id/name", { required: true })}
                />
                {errors?.["invoice_line/uos_id/name"] && (
                  <span className={styles.error}>Obavezno polje</span>
                )}
              </label>
            </div>
            <div className={styles.inputWrapper}>
              <label>
                Price Unit:
                <input
                  type="number"
                  step="any"
                  {...register("invoice_line/price_unit", { required: true })}
                />
                {errors?.["invoice_line/price_unit"] && (
                  <span className={styles.error}>Obavezno polje</span>
                )}
              </label>
            </div>
            <div className={styles.inputWrapper}>
              <label>
                Discount:
                <input
                  type="number"
                  step="any"
                  {...register("invoice_line/discount", { required: true })}
                />
                {errors?.["invoice_line/discount"] && (
                  <span className={styles.error}>Obavezno polje</span>
                )}
              </label>
            </div>
            <div className={styles.inputWrapper}>
              <label>
                Price Subtotal:
                <input
                  type="number"
                  step="any"
                  {...register("invoice_line/price_subtotal", {
                    required: true,
                  })}
                />
                {errors?.["invoice_line/price_subtotal"] && (
                  <span className={styles.error}>Obavezno polje</span>
                )}
              </label>
            </div>
            <span>
              <button type="submit">Dodaj</button>
              <button
                onClick={() => {
                  reset();
                  dialogRef?.current?.close();
                }}
                style={{ marginLeft: "16px" }}
              >
                Zatvori
              </button>
            </span>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default LeftSide;
