import * as THREE from "three";
import { A11yAnnouncer } from "@react-three/a11y";
import {
  Canvas,
  useFrame,
  useThree,
  extend,
} from "@react-three/fiber";
import { Mesh } from "three";
import { MutableRefObject, useRef, useState, FC, useEffect, MouseEventHandler } from "react";
import {
  OrbitControls,
  shaderMaterial,
} from "@react-three/drei";

import "./App.css";

import vertex from "./shaders/shader.vert";
import fragment from "./shaders/alien.frag";

import styles from '../styles/shaderframe.module.scss';

const Controls = () => {
  const control = useRef(null);
  return <OrbitControls ref={control} />;
};

declare interface R3FMeshObj {}

const R3F: FC<R3FMeshObj> = (props) => {
  const meshRef: MutableRefObject<Mesh | null> = useRef(null);
  
  const { camera, viewport } = useThree();

  const ColorShiftMaterial = shaderMaterial(
    {
      time: 0,
      color: new THREE.Color(0.05, 0.2, 0.025),
      resolution: { x: null, y: null, z: null, w: null}
    },
    vertex,
    fragment
  );
  
  ColorShiftMaterial.key = THREE.MathUtils.generateUUID();
  
  extend({ ColorShiftMaterial });

  useEffect(()=>{
    camera.position.z = 3.0;

    let plane = meshRef.current;

    let onWindowResize = function () {
      camera.updateProjectionMatrix();
      let aspect = viewport.width / viewport.height;

      //renderer.setSize(viewport.width, viewport.height);

      let imageAspect = 1;
      let a1;
      let a2;

      if (viewport.height / viewport.width > imageAspect) {
        a1 = (viewport.width / viewport.height) * imageAspect;
        a2 = 1;
      } else {
        a1 = 1;
        a2 = viewport.height / viewport.width / imageAspect;
      }

      if (plane?.material) {
        plane.material.uniforms.resolution.value.x = viewport.width;
        plane.material.uniforms.resolution.value.y = viewport.height;
        plane.material.uniforms.resolution.value.z = a1;
        plane.material.uniforms.resolution.value.z = a1;
        plane.material.uniforms.resolution.value.w = a2;
      }

      plane.scale.x = 3;
      plane.scale.y = 3/1;

    };
    window.addEventListener("resize", onWindowResize);

    onWindowResize();

    return () => window.removeEventListener("resize", onWindowResize);
  });

  useFrame((state, delta) => {
    if (meshRef?.current?.material) {
      meshRef.current.material.uniforms.time.value +=
        Math.sin(delta / 2) * Math.cos(delta / 2);
    }

  });

  return (
    <mesh
      ref={meshRef}
      {...props}
    >
      <planeBufferGeometry args={[1, 1]} />
      {/* @ts-ignore */}
      <colorShiftMaterial key={ColorShiftMaterial.key} time={3} />
    </mesh>
  );
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div className={styles.ShaderFrame}>
        <Canvas>
          <Controls />
          <R3F/>
        </Canvas>
      </div>
    </div>
  );
}

export default App;
