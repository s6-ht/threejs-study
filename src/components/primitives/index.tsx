import React, { useCallback, useEffect, useRef } from "react";
import * as Three from "three";
import Box from "./box";
import myCircle from "./circle";
import myWireframe from "./wireframe";

const meshArr: (Three.Mesh | Three.LineSegments)[] = [];

function Primitives() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Three.WebGL1Renderer | null>(null);
  const cameraRef = useRef<Three.PerspectiveCamera | null>(null);

  const createMaterial = () => {
    const material = new Three.MeshPhongMaterial({ side: Three.DoubleSide });

    const hue = Math.floor(Math.random() * 100) / 100; // 色相
    const saturation = 1; // 饱和度
    const luminance = 0.5; // 亮度

    material.color.setHSL(hue, saturation, luminance);
    return material;
  };

  const createInit = useCallback(() => {
    if (canvasRef.current === null) return;

    meshArr.length = 0;

    const scene = new Three.Scene();
    scene.background = new Three.Color(0xaaaaaa);

    const camera = new Three.PerspectiveCamera(40, 2, 0.1, 1000);
    camera.position.z = 120;
    cameraRef.current = camera;

    const renderer = new Three.WebGL1Renderer({
      canvas: canvasRef.current,
    });
    rendererRef.current = renderer;

    const light0 = new Three.DirectionalLight(0xffffff, 1);
    light0.position.set(-1, 2, 4);
    scene.add(light0);

    const light1 = new Three.DirectionalLight(0xffffff, 1);
    light1.position.set(-1, 2, 4);
    scene.add(light1);

    const solidPrimitivesArr: Three.BufferGeometry[] = [];
    solidPrimitivesArr.push(Box, myCircle, myWireframe);

    solidPrimitivesArr.forEach((item) => {
      const material = createMaterial();
      const mesh = new Three.Mesh(item, material);
      meshArr.push(mesh);
    });

    const eachRow = 5;
    const spread = 15;
    meshArr.forEach((mesh, index) => {
      const row = Math.floor(index / eachRow);
      const column = index % eachRow;

      mesh.position.x = (column - 2) * spread;
      mesh.position.y = (2 - row) * spread;
      scene.add(mesh);
    });

    const render = (time: number) => {
      time = time * 0.001;
      meshArr.forEach((item) => {
        item.rotation.x = time;
        item.rotation.y = time;
      });
      renderer.render(scene, camera);
      window.requestAnimationFrame(render);
    };
  }, [canvasRef]);

  const resizeHandle = () => {
    if (rendererRef.current === null || cameraRef.current === null) {
      return;
    }

    const canvas = rendererRef.current.domElement;
    cameraRef.current.aspect = canvas.clientWidth / canvas.clientHeight;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(canvas.clientWidth, canvas.clientHeight, false);
  };

  useEffect(() => {
    createInit();
    resizeHandle();
    window.addEventListener("resize", resizeHandle);
    return () => {
      window.removeEventListener("resize", resizeHandle);
    };
  }, [createInit]);

  return <canvas ref={canvasRef}></canvas>;
}

export default Primitives;
