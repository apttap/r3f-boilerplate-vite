import React, { useState, useEffect, FC } from 'react';

const FriendStatus: FC<any> = (props) => {
    const { meshRef } = props;

    const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    let plane = meshRef.current;

    let onWindowResize = function () {
      camera.updateProjectionMatrix();
      //renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;

      let imageAspect = 1;
      let a1;
      let a2;

      if (window.innerHeight / window.innerWidth > imageAspect) {
        a1 = (window.innerWidth / window.innerHeight) * imageAspect;
        a2 = 1;
      } else {
        a1 = 1;
        a2 = window.innerHeight / window.innerWidth / imageAspect;
      }

      if (plane?.material) {
        plane.material.uniforms.resolution.value.x = window.innerWidth;
        plane.material.uniforms.resolution.value.y = window.innerHeight;
        plane.material.uniforms.resolution.value.z = a1;
        plane.material.uniforms.resolution.value.w = a2;
      }
    };
    window.addEventListener("resize", onWindowResize);


    onWindowResize();

    return () => window.removeEventListener("resize", onWindowResize);
  }, []);

  if (isOnline === null) {
    return 'Loading...';
  }
  return {};
}