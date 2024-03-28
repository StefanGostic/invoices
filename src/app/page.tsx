"use client";

import styles from "./page.module.scss";
import LeftSide from "@/components/LeftSide/LeftSide";
import RightSide from "@/components/RightSide/RightSide";
import { getUsers, getUsers2 } from "@/lib/db";

export default async function Home() {
  // const data2 = await getUsers2();

  // console.log(data, data2);
  return (
    <main className={styles.main}>
      <LeftSide className={styles.leftSide}></LeftSide>
      <RightSide className={styles.rightSide}></RightSide>
    </main>
  );
}
