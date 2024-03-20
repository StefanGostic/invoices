"use client";

import styles from "./page.module.scss";
import LeftSide from "@/components/LeftSide/LeftSide";
import RightSide from "@/components/RightSide/RightSide";

export default function Home() {
  return (
    <main className={styles.main}>
      <LeftSide className={styles.leftSide}></LeftSide>
      <RightSide className={styles.rightSide}></RightSide>
    </main>
  );
}
