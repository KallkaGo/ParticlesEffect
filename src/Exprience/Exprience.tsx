import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Particles from '../utils/particles'
import { button, useControls } from 'leva'
import { useEffect, useRef } from 'react'
import VertexShader from './shader/vertex.glsl'
import FragmentShader from './shader/fragment.glsl'




const pointCount = 10000



export default function Exprience() {

  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const _ref = useRef<THREE.BufferAttribute>(null)
  const _toref = useRef<THREE.BufferAttribute>(null)
  const _speedref = useRef<THREE.BufferAttribute>(null)
  const particles = new Particles()

  useControls({
    size: {
      value: 100,
      min: 0,
      max: 500,
      step: 0.1,
      onChange: (v) => {

        materialRef.current!.uniforms.uSize.value = v
      }
    },
    progress: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.01,
      onChange: (v) => {

        materialRef.current!.uniforms.progress.value = v
      }
    },
    toggle: button(() => {
      setGeometry(new THREE.SphereGeometry(5,64,64))
      materialRef.current!.uniforms.progress.value = 0
    })
  })


  useEffect(() => {
    setGeometry(new THREE.BoxGeometry(10, 10, 10, 20, 20, 20))
  }, [])


  useFrame(() => {
    if (materialRef.current) {
      materialRef.current!.uniforms.progress.value += 0.01
      if (materialRef.current!.uniforms.progress.value > 1) materialRef.current!.uniforms.progress.value = 1
    }
  })

  const setGeometry = (geometry: THREE.BufferGeometry) => {
    const { position, toposition } = particles.to(geometry)
    _ref.current!.array = position
    _toref.current!.array = toposition
    _speedref.current!.array = particles.speed
    _ref.current!.needsUpdate = true
    _toref.current!.needsUpdate = true
    _speedref.current!.needsUpdate = true
  
  }



  return (
    <>
      <OrbitControls />
      <directionalLight position={[1, 2, 3]} />
      <ambientLight intensity={0.5} />
      <points>
        <bufferGeometry   >
          <bufferAttribute
            ref={_ref}
            attach="attributes-position"
            count={pointCount}
            itemSize={3}
          />
          <bufferAttribute
            ref={_toref}
            attach='attributes-toposition'
            count={pointCount}
            itemSize={3}
          />
          <bufferAttribute
            ref={_speedref}
            attach='attributes-speed'
            count={pointCount}
            itemSize={1}
          />

        </bufferGeometry>
        <shaderMaterial
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          ref={materialRef}
          vertexShader={VertexShader}
          fragmentShader={FragmentShader}
          transparent={true}
          uniforms={{
            uSize: { value: 0.5 },
            progress: { value: 0 }
          }}
        >
        </shaderMaterial>
      </points>
    </>
  )
}

