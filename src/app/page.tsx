import styles from "./page.module.scss";
import LeftSide from "@/components/LeftSide/LeftSide";
import RightSide from "@/components/RightSide/RightSide";
import { Material } from "@/utils/types";

// const getMaterials = async () => {
//   const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/materials");
//   const data = await res.json();
//   return data;
// };

export default async function Home() {
  const materials: Material[] = [];

  return (
    <main className={styles.main}>
      <LeftSide materials={materials} className={styles.leftSide}></LeftSide>
      <RightSide className={styles.rightSide}></RightSide>
    </main>
  );
}
