import React, { useRef } from 'react'
import { easing } from 'maath'
import { useFrame } from '@react-three/fiber'
import { AccumulativeShadows, RandomizedLight } from '@react-three/drei'

const Backdrop = () => {
  const shadows = useRef();

  return (
    <AccumulativeShadows
      ref={shadows}
      resolution={1024}
      colorBlend={1.5}
      temporal
      frames={60}
      alphaTest={0.19}
      scale={2}
      color={"#02D34A"}
      rotation={[Math.PI/2, 0, 0]}
      position={[0, 0, -0.14]}
    >
      <RandomizedLight 
        amount={4}
        radius={9}
        intensity={0.55}
        ambient={0.6}
        position={[5, 5, -10]}
        bias={0.001}
      />
      <RandomizedLight 
        amount={4}
        radius={5}
        intensity={0.25}
        ambient={0.6}
        position={[-5, 5, -9]}
        bias={0.001}
      />
    </AccumulativeShadows>
  )
}

export default Backdrop