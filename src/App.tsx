import * as THREE from "three";
import { A11yAnnouncer } from "@react-three/a11y";
import { a, config, useSpring } from "@react-spring/three";
import {
  Canvas,
  useFrame,
  useThree,
  extend,
  MeshProps,
} from "@react-three/fiber";
import { Mesh } from "three";
import { MutableRefObject, useRef, useState, FC, useEffect } from "react";
import {
  OrbitControls,
  Preload,
  shaderMaterial,
  Stats,
} from "@react-three/drei";

import "./App.css";

import vertex from "./shaders/shader.vert";
import fragment from "./shaders/shader.frag";

const ColorShiftMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0.05, 0.2, 0.025),
  },
  vertex,
  fragment
);

ColorShiftMaterial.key = THREE.MathUtils.generateUUID();

extend({ ColorShiftMaterial });

const Controls = () => {
  const control = useRef(null);
  return <OrbitControls ref={control} />;
};

declare interface R3FMeshObj {}

const R3F: FC<R3FMeshObj> = (props) => {
  const meshRef: MutableRefObject<Mesh | null> = useRef(null);
  const [hovered, setHover] = useState(false);
  const { scale } = useSpring({ scale: hovered ? 1.1 : 0.75, config: config.wobbly });
  const { camera } = useThree();

  useEffect(()=>{
    camera.position.z = 2.0;
  });

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = meshRef.current.rotation.y += 0.01;
    }
    if (meshRef?.current?.material) {
      meshRef.current.material.uniforms.time.value +=
        Math.sin(delta / 2) * Math.cos(delta / 2);
    }
  });

  return (
    <a.mesh
      ref={meshRef}
      scale={scale}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
      {...props}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      {/* @ts-ignore */}
      <colorShiftMaterial key={ColorShiftMaterial.key} time={3} />
    </a.mesh>
  );
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div style={{ width: "100%", height: "50vh" }}>
        <Canvas>
          <Controls />
          <R3F />
        </Canvas>
      </div>
      <h1>three + vite</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  );
}

export default App;
