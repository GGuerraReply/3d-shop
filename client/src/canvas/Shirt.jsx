import React from 'react'
import { easing } from 'maath'
import { useSnapshot } from 'valtio'
import { useFrame } from '@react-three/fiber'
import { Decal, useGLTF, useTexture  } from '@react-three/drei'
import { TextureLoader, BackSide, DoubleSide } from 'three';


import state from '../store'

const Shirt = () => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF('/shirt_baked.glb');
  const shadowTexture = new TextureLoader().load('/baked-texture.jpg');

  const logoTextre = useTexture(snap.logoDecal);
  const fullTextre = useTexture(snap.fullDecal);

  useFrame((state, delta) => {
    easing.dampC(materials.lambert1.color, snap.color, 0.25, delta);
  });

  const stateString = JSON.stringify(snap);

  return (
    <group
      key={stateString}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {snap.isFullTexture && (
          <meshLambertMaterial
            attach="material"
            polygonOffset={true}
            polygonOffsetFactor={-1}
            map={fullTextre}
            lightMap={shadowTexture}
            lightMapIntensity={2}
            aoMap={shadowTexture}
            aoMapIntensity={1}
            specularMap={shadowTexture}
            alphaMap={shadowTexture}
            bumpMap={shadowTexture}
            emissiveMap={shadowTexture}
            side={DoubleSide}
          />
        )}
        {snap.isLogoTexture && (
          <Decal
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.15}
            map={logoTextre}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  )
}

export default Shirt