import { memo, useEffect, useRef, useState } from "react";

import { debounce } from "@mui/material";

import { OrbitControls, OrthographicCamera, PerspectiveCamera, Select } from "@react-three/drei";
import {
  AccumulativeShadows,
  CameraControls,
  Center,
  Environment,
  Grid,
  RandomizedLight,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { button, buttonGroup, folder } from "leva";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

import { getMouseDegrees } from "../utils";

function moveJoint(mouse, joint, degreeLimit = 40) {
  let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
  joint.rotation.xD = THREE.MathUtils.lerp(joint.rotation.xD || 0, degrees.y, 0.1);
  joint.rotation.yD = THREE.MathUtils.lerp(joint.rotation.yD || 0, degrees.x, 0.1);
  joint.rotation.x = THREE.MathUtils.degToRad(joint.rotation.xD);
  joint.rotation.y = THREE.MathUtils.degToRad(joint.rotation.yD);
}

export const ThreeFibre = (): JSX.Element => {
  const w = 1920;
  const h = 1080;
  const fullWidth = w * 3;
  const fullHeight = h * 2;

  return (
    <Canvas flat shadows camera={{ position: [10, 4, 0], fov: 15 }}>
      <Center top>
        <Model position={[0, 0, 0]} rotation={[0, 0, 0]} />
      </Center>
      <OrbitControls />
      <MyGrid />
      <Shadows />
      <Environment preset="studio" />
    </Canvas>
  );
};

function CameraControlsComponent() {
  const cameraControlsRef = useRef();

  const onCameraControlChange = (e: unknown) => {
    debounce(() => console.log("Camera control change:", e?.target?._camera.position), 500)();
  };

  const { camera } = useThree();

  // All same options as the original "basic" example: https://yomotsu.github.io/camera-controls/examples/basic.html
  const { minDistance, enabled, verticalDragToForward, dollyToCursor, infinityDolly } = useControls(
    {
      thetaGrp: buttonGroup({
        label: "rotate theta",
        opts: {
          "+45º": () => cameraControlsRef.current?.rotate(45 * DEG2RAD, 0, true),
          "-90º": () => cameraControlsRef.current?.rotate(-90 * DEG2RAD, 0, true),
          "+360º": () => cameraControlsRef.current?.rotate(360 * DEG2RAD, 0, true),
        },
      }),
      phiGrp: buttonGroup({
        label: "rotate phi",
        opts: {
          "+20º": () => cameraControlsRef.current?.rotate(0, 20 * DEG2RAD, true),
          "-40º": () => cameraControlsRef.current?.rotate(0, -40 * DEG2RAD, true),
        },
      }),
      truckGrp: buttonGroup({
        label: "truck",
        opts: {
          "(1,0)": () => cameraControlsRef.current?.truck(1, 0, true),
          "(0,1)": () => cameraControlsRef.current?.truck(0, 1, true),
          "(-1,-1)": () => cameraControlsRef.current?.truck(-1, -1, true),
        },
      }),
      dollyGrp: buttonGroup({
        label: "dolly",
        opts: {
          "1": () => cameraControlsRef.current?.dolly(1, true),
          "-1": () => cameraControlsRef.current?.dolly(-1, true),
        },
      }),
      zoomGrp: buttonGroup({
        label: "zoom",
        opts: {
          "/2": () => cameraControlsRef.current?.zoom(camera.zoom / 2, true),
          "/-2": () => cameraControlsRef.current?.zoom(-camera.zoom / 2, true),
        },
      }),
      minDistance: { value: 0 },
      moveTo: folder(
        {
          vec1: { value: [-2, 0, 0], label: "vec" },
          "moveTo(…vec)": button((get) =>
            cameraControlsRef.current?.moveTo(...get("moveTo.vec1"), true),
          ),
        },
        { collapsed: true },
      ),
      "fitToBox(mesh)": button(() => cameraControlsRef.current?.fitToBox(meshRef.current, true)),
      setPosition: folder(
        {
          vec2: { value: [0, 0, 0], label: "vec" },
          "setPosition(…vec)": button((get) =>
            cameraControlsRef.current?.setPosition(...get("setPosition.vec2"), true),
          ),
        },
        { collapsed: true },
      ),
      setTarget: folder(
        {
          vec3: { value: [0, 0, 0], label: "vec" },
          "setTarget(…vec)": button((get) =>
            cameraControlsRef.current?.setTarget(...get("setTarget.vec3"), true),
          ),
        },
        { collapsed: true },
      ),
      setLookAt: folder(
        {
          vec4: { value: [1, 2, 3], label: "position" },
          vec5: { value: [1, 1, 0], label: "target" },
          "setLookAt(…position, …target)": button((get) =>
            cameraControlsRef.current?.setLookAt(
              ...get("setLookAt.vec4"),
              ...get("setLookAt.vec5"),
              true,
            ),
          ),
        },
        { collapsed: true },
      ),
      lerpLookAt: folder(
        {
          vec6: { value: [-2, 0, 0], label: "posA" },
          vec7: { value: [1, 1, 0], label: "tgtA" },
          vec8: { value: [0, 2, 5], label: "posB" },
          vec9: { value: [-1, 0, 0], label: "tgtB" },
          t: { value: Math.random(), label: "t", min: 0, max: 1 },
          "f(…posA,…tgtA,…posB,…tgtB,t)": button((get) => {
            return cameraControlsRef.current?.lerpLookAt(
              ...get("lerpLookAt.vec6"),
              ...get("lerpLookAt.vec7"),
              ...get("lerpLookAt.vec8"),
              ...get("lerpLookAt.vec9"),
              get("lerpLookAt.t"),
              true,
            );
          }),
        },
        { collapsed: true },
      ),
      saveState: button(() => cameraControlsRef.current?.saveState()),
      reset: button(() => cameraControlsRef.current?.reset(true)),
      enabled: { value: true, label: "controls on" },
      verticalDragToForward: { value: false, label: "vert. drag to move forward" },
      dollyToCursor: { value: false, label: "dolly to cursor" },
      infinityDolly: { value: false, label: "infinity dolly" },
    },
  );

  return (
    <CameraControls
      onChange={onCameraControlChange}
      ref={cameraControlsRef}
      minDistance={minDistance}
      enabled={enabled}
      verticalDragToForward={verticalDragToForward}
      dollyToCursor={dollyToCursor}
      infinityDolly={infinityDolly}
    />
  );
}

const MyGrid = () => {
  const { gridSize, ...gridConfig } = useControls({
    gridSize: [10.5, 10.5],
    cellSize: { value: 0.5, min: 0, max: 10, step: 0.1 },
    cellThickness: { value: 0.5, min: 0, max: 5, step: 0.1 },
    cellColor: "#6f6f6f",
    sectionSize: { value: 3, min: 0, max: 10, step: 0.1 },
    sectionThickness: { value: 1, min: 0, max: 5, step: 0.1 },
    sectionColor: "#9d4b4b",
    fadeDistance: { value: 30, min: 0, max: 100, step: 1 },
    fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
    followCamera: false,
    infiniteGrid: true,
  });
  return <Grid renderOrder={-1} args={gridSize} {...gridConfig} />;
};

const Shadows = memo(() => (
  <AccumulativeShadows color="#9d9d9d" colorBlend={0.5} alphaTest={0.9} scale={20}>
    <RandomizedLight amount={8} radius={2} position={[5, 5, 10]} />
  </AccumulativeShadows>
));

type GLTFResult = GLTF & {
  nodes: {
    Object_4: THREE.Mesh;
    Object_6: THREE.Mesh;
    Object_8: THREE.Mesh;
    Object_10: THREE.Mesh;
    Object_12: THREE.Mesh;
    Object_14: THREE.Mesh;
    Object_16: THREE.Mesh;
    Object_18: THREE.Mesh;
    Object_20: THREE.Mesh;
    Object_22: THREE.Mesh;
    Object_24: THREE.Mesh;
    Object_26: THREE.Mesh;
    Object_28: THREE.Mesh;
    Object_30: THREE.Mesh;
    Object_32: THREE.Mesh;
    Object_34: THREE.Mesh;
    Object_36: THREE.Mesh;
    Object_38: THREE.Mesh;
    Object_40: THREE.Mesh;
    Object_42: THREE.Mesh;
    Object_44: THREE.Mesh;
    Object_46: THREE.Mesh;
    Object_48: THREE.Mesh;
    Object_50: THREE.Mesh;
    Object_52: THREE.Mesh;
    Object_54: THREE.Mesh;
    Object_56: THREE.Mesh;
    Object_58: THREE.Mesh;
    Object_60: THREE.Mesh;
    Object_62: THREE.Mesh;
    Object_64: THREE.Mesh;
    Object_66: THREE.Mesh;
    Object_68: THREE.Mesh;
    Object_70: THREE.Mesh;
    Object_72: THREE.Mesh;
    Object_74: THREE.Mesh;
    Object_76: THREE.Mesh;
    Object_78: THREE.Mesh;
    Object_80: THREE.Mesh;
    Object_82: THREE.Mesh;
  };
  materials: {
    ["Material.003"]: THREE.MeshStandardMaterial;
    ["Material.004"]: THREE.MeshStandardMaterial;
    ["Material.002"]: THREE.MeshStandardMaterial;
    ["Material.001"]: THREE.MeshStandardMaterial;
  };
};

export function Model(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("../assets/robot_arm.glb") as GLTFResult;
  return (
    <Select box multiple onChange={console.log}>
      <group {...props} dispose={null}>
        <group name="Sketchfab_Scene">
          <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]} scale={0.338}>
            <group name="root">
              <group name="GLTF_SceneRootNode" rotation={[Math.PI / 2, 0, 0]}>
                <group name="Plane_0">
                  <mesh
                    name="Object_4"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_4.geometry}
                    material={materials["Material.003"]}
                  />
                </group>
                <group name="Plane001_1" position={[0, -0.161, 0]}>
                  <mesh
                    name="Object_6"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_6.geometry}
                    material={materials["Material.003"]}
                  />
                </group>
                <group name="Cylinder_2">
                  <mesh
                    name="Object_8"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_8.geometry}
                    material={materials["Material.004"]}
                  />
                </group>
                <group name="Cylinder001_3" position={[0, -0.015, 0]} scale={[1.01, 1, 1.01]}>
                  <mesh
                    name="Object_10"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_10.geometry}
                    material={materials["Material.003"]}
                  />
                </group>
                <group
                  name="Cylinder003_4"
                  position={[0, -0.019, 0]}
                  rotation={[0, -Math.PI / 2, 0]}
                >
                  <mesh
                    name="Object_12"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_12.geometry}
                    material={materials["Material.004"]}
                  />
                </group>
                <group name="Plane002_5" position={[0, -0.5, 0]}>
                  <mesh
                    name="Object_14"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_14.geometry}
                    material={materials["Material.003"]}
                  />
                </group>
                <group name="Cube_6" position={[0, -0.2, 0]}>
                  <mesh
                    name="Object_16"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_16.geometry}
                    material={materials["Material.003"]}
                  />
                </group>
                <group name="Cube001_7">
                  <mesh
                    name="Object_18"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_18.geometry}
                    material={materials["Material.004"]}
                  />
                </group>
                <group name="Cone_8" position={[0, 0.133, 0]}>
                  <mesh
                    name="Object_20"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_20.geometry}
                    material={materials["Material.002"]}
                  />
                </group>
                <group name="Cylinder004_9">
                  <mesh
                    name="Object_22"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_22.geometry}
                    material={materials["Material.004"]}
                  />
                </group>
                <group name="Cylinder005_10">
                  <mesh
                    name="Object_24"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_24.geometry}
                    material={materials["Material.004"]}
                  />
                </group>
                <group name="Cube002_11" position={[0, 0.199, -0.003]} scale={1.583}>
                  <mesh
                    name="Object_26"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_26.geometry}
                    material={materials["Material.001"]}
                  />
                </group>
                <group
                  name="Cube003_12"
                  position={[0, 0.009, -0.003]}
                  scale={[0.348, 0.032, 0.348]}
                >
                  <mesh
                    name="Object_28"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_28.geometry}
                    material={materials["Material.003"]}
                  />
                </group>
                <group
                  name="Cylinder006_13"
                  position={[0, 0.215, -0.192]}
                  rotation={[0, 0, Math.PI / 2]}
                  scale={[0.027, 0.378, 0.027]}
                >
                  <mesh
                    name="Object_30"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_30.geometry}
                    material={materials["Material.004"]}
                  />
                </group>
                <group name="Plane003_14" position={[0, 0.215, -0.192]} scale={1.583}>
                  <mesh
                    name="Object_32"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_32.geometry}
                    material={materials["Material.003"]}
                  />
                </group>
                <group
                  name="Plane004_15"
                  position={[0, 1.165, 1.391]}
                  rotation={[-Math.PI, 0, 0]}
                  scale={[1.266, 1.583, 1.583]}
                >
                  <mesh
                    name="Object_34"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_34.geometry}
                    material={materials["Material.003"]}
                  />
                </group>
                <group
                  name="Cylinder007_16"
                  position={[0, 0.69, 0.599]}
                  rotation={[-2.094, 0, 0]}
                  scale={1.583}
                >
                  <mesh
                    name="Object_36"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_36.geometry}
                    material={materials["Material.001"]}
                  />
                </group>
                <group
                  name="Cube004_17"
                  position={[0, 1.323, 1.201]}
                  rotation={[0.698, 0, 0]}
                  scale={[1.266, 1.583, 1.583]}
                >
                  <mesh
                    name="Object_38"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_38.geometry}
                    material={materials["Material.001"]}
                  />
                </group>
                <group
                  name="Plane005_18"
                  position={[0, 1.56, 0.963]}
                  rotation={[-0.873, 0, 0]}
                  scale={[0.249, 0.38, 0.38]}
                >
                  <mesh
                    name="Object_40"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_40.geometry}
                    material={materials["Material.003"]}
                  />
                </group>
                <group
                  name="Cylinder008_19"
                  position={[0, 1.701, 0.736]}
                  rotation={[-0.874, 0, 0]}
                  scale={1.355}
                >
                  <mesh
                    name="Object_42"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_42.geometry}
                    material={materials["Material.001"]}
                  />
                </group>
                <group
                  name="Cylinder009_20"
                  position={[0, 1.165, 1.391]}
                  rotation={[0, 0, Math.PI / 2]}
                  scale={[0.027, 0.302, 0.027]}
                >
                  <mesh
                    name="Object_44"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_44.geometry}
                    material={materials["Material.004"]}
                  />
                </group>
                <group
                  name="Cylinder010_21"
                  position={[0, 1.608, 1.058]}
                  rotation={[0, 0, Math.PI / 2]}
                  scale={[1.583, 1.266, 1.583]}
                >
                  <mesh
                    name="Object_46"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_46.geometry}
                    material={materials["Material.004"]}
                  />
                </group>
                <group
                  name="Cylinder011_22"
                  position={[0, 1.418, 0.9]}
                  rotation={[0, 0, Math.PI / 2]}
                  scale={[1.583, 1.266, 1.583]}
                >
                  <mesh
                    name="Object_48"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_48.geometry}
                    material={materials["Material.004"]}
                  />
                </group>
                <group
                  name="Cube005_23"
                  position={[0, 2.091, 0.275]}
                  rotation={[-2.443, 0, 0]}
                  scale={[1.266, 1.583, 1.583]}
                >
                  <mesh
                    name="Object_50"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_50.geometry}
                    material={materials["Material.001"]}
                  />
                </group>
                <group
                  name="Plane006_24"
                  position={[0, 1.853, 0.512]}
                  rotation={[2.269, 0, 0]}
                  scale={[0.249, 0.38, 0.38]}
                >
                  <mesh
                    name="Object_52"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_52.geometry}
                    material={materials["Material.003"]}
                  />
                </group>
                <group
                  name="Cylinder012_25"
                  position={[0, 1.806, 0.417]}
                  rotation={[Math.PI, 0, Math.PI / 2]}
                  scale={[1.583, 1.266, 1.583]}
                >
                  <mesh
                    name="Object_54"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_54.geometry}
                    material={materials["Material.004"]}
                  />
                </group>
                <group
                  name="Cylinder013_26"
                  position={[0, 1.996, 0.575]}
                  rotation={[Math.PI, 0, Math.PI / 2]}
                  scale={[1.583, 1.266, 1.583]}
                >
                  <mesh
                    name="Object_56"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_56.geometry}
                    material={materials["Material.004"]}
                  />
                </group>
                <group
                  name="Plane007_27"
                  position={[0, 2.148, -0.35]}
                  rotation={[-0.175, 0, 0]}
                  scale={[1, 0.711, 1]}
                >
                  <mesh
                    name="Object_58"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_58.geometry}
                    material={materials["Material.003"]}
                  />
                </group>
                <group
                  name="Cylinder014_28"
                  position={[0, 2.245, 0.161]}
                  rotation={[0, 0, Math.PI / 2]}
                  scale={[0.027, 0.302, 0.027]}
                >
                  <mesh
                    name="Object_60"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_60.geometry}
                    material={materials["Material.004"]}
                  />
                </group>
                <group name="Cube006_29" position={[0, 1.995, -0.425]} rotation={[-1.745, 0, 0]}>
                  <mesh
                    name="Object_62"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_62.geometry}
                    material={materials["Material.001"]}
                  />
                </group>
                <group name="Cylinder015_30" position={[0, 1.95, -0.78]} rotation={[-1.745, 0, 0]}>
                  <mesh
                    name="Object_64"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_64.geometry}
                    material={materials["Material.001"]}
                  />
                </group>
                <group
                  name="Cylinder016_31"
                  position={[0, 1.96, -0.73]}
                  rotation={[-1.745, 0, 0]}
                  scale={0.045}
                >
                  <mesh
                    name="Object_66"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_66.geometry}
                    material={materials["Material.004"]}
                  />
                </group>
                <group
                  name="Plane008_32"
                  position={[-0.074, 1.815, -1.191]}
                  rotation={[-0.151, -0.087, -1.053]}
                  scale={0.42}
                >
                  <mesh
                    name="Object_68"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_68.geometry}
                    material={materials["Material.001"]}
                  />
                </group>
                <group
                  name="Plane009_33"
                  position={[-0.059, 1.723, -1.687]}
                  rotation={[2.99, 0.087, -2.089]}
                  scale={[-0.42, 0.42, 0.42]}
                >
                  <mesh
                    name="Object_70"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_70.geometry}
                    material={materials["Material.001"]}
                  />
                </group>
                <group
                  name="Plane010_34"
                  position={[-0.074, 1.815, -1.191]}
                  rotation={[-0.151, -0.087, -1.053]}
                  scale={0.42}
                >
                  <mesh
                    name="Object_72"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_72.geometry}
                    material={materials["Material.001"]}
                  />
                </group>
                <group
                  name="Cylinder017_35"
                  position={[-0.074, 1.815, -1.191]}
                  rotation={[-0.151, -0.087, -1.053]}
                  scale={0.42}
                >
                  <mesh
                    name="Object_74"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_74.geometry}
                    material={materials["Material.004"]}
                  />
                </group>
                <group
                  name="Cube007_36"
                  position={[-0.074, 1.815, -1.191]}
                  rotation={[-0.151, -0.087, -1.053]}
                  scale={0.42}
                >
                  <mesh
                    name="Object_76"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_76.geometry}
                    material={materials["Material.002"]}
                  />
                </group>
                <group
                  name="Cylinder018_37"
                  position={[-0.074, 1.815, -1.191]}
                  rotation={[-0.151, -0.087, -1.053]}
                  scale={0.42}
                >
                  <mesh
                    name="Object_78"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_78.geometry}
                    material={materials["Material.001"]}
                  />
                </group>
                <group
                  name="Plane011_38"
                  position={[0.031, 1.902, -1.067]}
                  rotation={[-0.151, -0.087, -1.053]}
                  scale={0.42}
                >
                  <mesh
                    name="Object_80"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_80.geometry}
                    material={materials["Material.001"]}
                  />
                </group>
                <group
                  name="Plane012_39"
                  position={[0.033, 1.962, -0.773]}
                  rotation={[-0.151, -0.087, -1.053]}
                  scale={[0.126, 0.126, 0.05]}
                >
                  <mesh
                    name="Object_82"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_82.geometry}
                    material={materials["Material.001"]}
                  />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </Select>
  );
}
