import React, { useState } from "react";
import { useSpring, a } from "@react-spring/web";

import styles from "./styles.module.css";

export default { title: "Spring" };

function App() {
  console.log("APP ", styles);
  const [flipped, set] = useState(false);
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(1000px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 120 },
  });
  return (
    <div className={styles.container} onClick={() => set(state => !state)}>
      <a.div
        className={`${styles.c} ${styles.back}`}
        style={{ opacity: opacity.to(o => 1 - o), transform }}
      />
      {/* 
      <a.div
        className={`${styles.c} ${styles.front}`}
        style={{
          opacity,
          transform,
          rotateY: "180deg",
        }}
      />
      */}
    </div>
  );
}

export const spring = () => (
  <div style={{ height: "100vh", width: "100%" }}>
    <App />
  </div>
);
spring.story = {
  name: "Spring",
};
