"use client";

import classNames from "classnames";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./RightSide.module.scss";
import { Material } from "@/utils/types";
import { useMaterialStore } from "@/stores/useMaterialStore";
import ReactToPrint from "react-to-print";

type RightSideProps = {
  className?: string;
};

type Inputs = {
  naziv: string;
  brojKomada: number;
  objekat: string;
  radniBroj: number;
  materials?: Material[];
};

const RightSide = ({ className }: RightSideProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<Inputs>();
  const { updateMaterialQuantity, chosenMaterials } = useMaterialStore();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setIsSubmitted(true);
    chosenMaterials.forEach((chosenMaterial) => {
      updateMaterialQuantity(
        chosenMaterial.id,
        chosenMaterial["invoice_line/quantity"]
      );
    });
  };
  const refForPrinting = React.useRef<HTMLDivElement>(null);
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);

  useEffect(() => {
    if (isSubmitted && !isValid) {
      setIsSubmitted(false);
    }
  }, [isValid, isSubmitted]);

  return (
    <div className={classNames(styles.container, className)}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.basicInfo} ref={refForPrinting}>
          <div className={styles.inputWrapper}>
            <div className={styles.label}>Naziv:</div>
            <input
              placeholder="Naziv"
              {...register("naziv", { required: true })}
              style={{ marginBottom: "10px", width: "25%" }}
            />
            {errors.naziv && (
              <span className={styles.error}>Ovo polje je obavezno</span>
            )}
          </div>
          <div className={styles.inputWrapper}>
            <div className={styles.label}>Broj Komada:</div>
            <input
              type="number"
              placeholder="Broj Komada"
              {...register("brojKomada", { required: true })}
              style={{ marginBottom: "10px", width: "25%" }}
            />
            {errors.brojKomada && (
              <span className={styles.error}>Ovo polje je obavezno</span>
            )}
          </div>
          <div className={styles.inputWrapper}>
            <div className={styles.label}>Objekat:</div>
            <input
              placeholder="Objekat"
              {...register("objekat", { required: true })}
              style={{ marginBottom: "10px", width: "25%" }}
            />
            {errors.objekat && (
              <span className={styles.error}>Ovo polje je obavezno</span>
            )}
          </div>
          <div>
            <div className={styles.label}>Radni Broj:</div>
            <input
              type="number"
              placeholder="Radni Broj"
              {...register("radniBroj", { required: true })}
              style={{ marginBottom: "10px", width: "25%" }}
            />
            {errors.radniBroj && (
              <span className={styles.error}>Ovo polje je obavezno</span>
            )}
          </div>
          <div className={styles.horizontalLine}></div>
          <div className={styles.tableWrapper}>
            <MatTable isSubmitted={isSubmitted} />
          </div>
          <div className={styles.horizontalLine}></div>
          <div className={styles.tableWrapper}>
            <OtherTable isSubmitted={isSubmitted} />
          </div>
        </div>
        <input
          type="submit"
          className={styles.submit}
          value="Faktura spremna"
          disabled={isSubmitted}
        />

        <button className={styles.submit} onClick={() => reset()}>
          Reset forme
        </button>

        <ReactToPrint
          bodyClass="print-agreement"
          content={() => refForPrinting.current}
          pageStyle={"padding: 40px"}
          trigger={() => (
            <button className={styles.submit} disabled={!isSubmitted}>
              Printanje
            </button>
          )}
        />
      </form>
    </div>
  );
};

const MatTable = ({ isSubmitted }: { isSubmitted: boolean }) => {
  const { materials, setMaterials, chosenMaterials, setChosenMaterials } =
    useMaterialStore();

  const onChangeQuantity = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const originMaterial = materials.find((material) => material.id === id);
    if (!originMaterial) {
      return;
    }
    if (originMaterial["invoice_line/quantity"] < Number(e.target.value)) {
      alert("Nemate dovoljno materijala na stanju");
      return;
    }

    const newMaterials = [...chosenMaterials];
    const material = newMaterials.find((material) => material.id === id);
    if (material) {
      material["invoice_line/quantity"] = Number(e.target.value);
      setChosenMaterials(newMaterials);
    }
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>id</th>
          <th>Origin</th>
          <th>Name</th>
          <th>Quantity</th>
          <th>Uos Id Name</th>
          <th>Price Unit</th>
          <th>Discount</th>
          <th>Price Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {chosenMaterials.map((material, index) => (
          <tr key={index}>
            <td>{material?.id ?? ""}</td>
            <td>{material?.["invoice_line/origin"]}</td>
            <td>{material?.["invoice_line/name"]}</td>
            <td>
              {isSubmitted ? (
                material?.["invoice_line/quantity"]
              ) : (
                <input
                  type="number"
                  value={material?.["invoice_line/quantity"]}
                  onChange={(e) => onChangeQuantity(e, material.id)}
                  style={{ width: "100%" }}
                />
              )}
            </td>
            <td>{material?.["invoice_line/uos_id/name"]}</td>
            <td>{material?.["invoice_line/price_unit"]}</td>
            <td>{material?.["invoice_line/discount"]}</td>
            <td>
              {(
                material?.["invoice_line/quantity"] *
                material?.["invoice_line/price_unit"] *
                (material?.["invoice_line/discount"] / 100)
              ).toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const OtherTable = ({ isSubmitted }: { isSubmitted: boolean }) => {
  const { chosenMaterials } = useMaterialStore();
  const [workerCost, setWorkerCost] = React.useState<number>(0);
  const [repromaterialCost, setRepromaterialCost] = React.useState<number>(0);
  const [margin, setMargin] = React.useState<number>(0);

  const vpc = chosenMaterials.reduce((acc, material) => {
    return (
      acc +
      Number(
        (
          material?.["invoice_line/quantity"] *
          material?.["invoice_line/price_unit"] *
          (material?.["invoice_line/discount"] / 100)
        ).toFixed(2)
      )
    );
  }, 0);

  return (
    <table className={styles.table} style={{ marginTop: "16px" }}>
      <thead>
        <tr>
          <th>Obračun cijene</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>naziv</td>
          <td>vpc</td>
        </tr>
        <tr>
          <td>Troškovi materijala i obrade</td>
          <td>{vpc.toFixed(2)}</td>
        </tr>
        <tr>
          <td>Troškovi radnika</td>
          <td>
            {isSubmitted ? (
              workerCost
            ) : (
              <input
                type="number"
                step={0.1}
                value={workerCost || ""}
                placeholder="0"
                onChange={(e) => setWorkerCost(Number(e.target.value))}
                style={{ width: "100px" }}
              />
            )}
          </td>
        </tr>
        <tr>
          <td>Repromaterijal i ostali troškovi</td>
          <td>
            {isSubmitted ? (
              repromaterialCost
            ) : (
              <input
                type="number"
                step={0.1}
                value={repromaterialCost || ""}
                placeholder="0"
                onChange={(e) => setRepromaterialCost(Number(e.target.value))}
                style={{ width: "100px" }}
              />
            )}
          </td>
        </tr>
        <tr>
          <td>Marža</td>
          <td>
            {isSubmitted ? (
              margin
            ) : (
              <input
                type="number"
                step={0.1}
                value={margin || ""}
                placeholder="0"
                onChange={(e) => setMargin(Number(e.target.value))}
                style={{ width: "100px" }}
              />
            )}
          </td>
        </tr>
        <tr>
          <td>
            <strong>Saldo</strong>
          </td>
          <td>
            <strong>
              {(
                (Number(vpc) || 0) +
                (Number(workerCost) || 0) +
                (Number(repromaterialCost) || 0) +
                (Number(margin) || 0)
              ).toFixed(2)}
            </strong>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default RightSide;
