import { useEffect, useRef } from "react";
import {
  BoxGeometry,
  DirectionalLight,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

import "./index.scss";

function HelloThreejs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const resizeHandleRef = useRef<() => void>();

  useEffect(() => {
    if (!canvasRef.current) return;
    // 创建渲染器
    const renderer = new WebGLRenderer({ canvas: canvasRef.current });

    // 创建镜头
    const camera = new PerspectiveCamera(75, 2, 0.1, 5);

    // 创建场景
    const scene = new Scene();

    // 创建几何体
    const geometry = new BoxGeometry(1, 1, 1);

    // 创建材质
    const material = new MeshPhongMaterial({ color: 0x44aa88 });
    const materia2 = new MeshPhongMaterial({ color: 0xc50d0d });
    const materia3 = new MeshPhongMaterial({ color: 0x39b20a });

    // 创建网格
    const cube1 = new Mesh(geometry, material);
    cube1.position.x = -2;
    scene.add(cube1);
    const cube2 = new Mesh(geometry, materia2);
    cube2.position.x = 0;
    scene.add(cube2);
    const cube3 = new Mesh(geometry, materia3);
    cube3.position.x = 2;
    scene.add(cube3);

    const cubes = [cube1, cube2, cube3];

    // 创建光源
    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(-1, 2, 4);
    scene.add(light);

    // 设置透视镜头的z轴距离， 以便我们以某个距离来观察几何体
    // 前面设置初始化镜头时，近平面和远平面分别为01和5
    // 因此z的值需要在0.1 - 5的范围内，超出则画面不会被渲染

    // 设置了z值之后， 刚才设置的近平面到z值的范围就拍摄不到了
    camera.position.z = 2;

    // 渲染器根据场景和透视镜头来渲染画面
    const render = (time: number) => {
      time = time * 0.001;

      cubes.map((cube) => {
        cube.rotation.x = time;
        cube.rotation.y = time;
      });
      renderer.render(scene, camera);
    console.log(scene)

      requestAnimationFrame(render);

      const handleResize = () => {
        const canvas = renderer.domElement;
        // 让镜头宽高比跟随着canvas宽高比, 确保立方体不变形
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        // 通知镜头更新视锥
        camera.updateProjectionMatrix();

        // 将渲染器渲染出的画面尺寸和实际网页canvas尺寸保持一致, 避免模糊
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      };

      handleResize();

      resizeHandleRef.current = handleResize;
      const resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      if (canvasRef.current) {
        resizeObserver.observe(canvasRef.current);
      }
      return () => {
        resizeObserver.disconnect()
      };
    };
    requestAnimationFrame(render);
  }, [canvasRef]);

  return <canvas className="fullScreen" ref={canvasRef} />;
}

export default HelloThreejs;
