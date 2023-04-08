import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Particles from '../utils/particles'
import { button, useControls } from 'leva'
import { useEffect, useState, useRef } from 'react'
import VertexShader from './shader/vertex.glsl'
import FragmentShader from './shader/fragment.glsl'




const pointCount = 10000



export default function Exprience() {

  const _ref = useRef<THREE.BufferAttribute>(null)
  const _toref = useRef<THREE.BufferAttribute>(null)
  const _speedref =useRef<THREE.BufferAttribute>(null)
  const pointref = useRef<THREE.Points<THREE.BufferGeometry,THREE.ShaderMaterial>>(null)
  const particles =  new Particles()

  useControls({
    size: {
      value: 0.1,
      min: 0,
      max: 10,
      step: 0.01,
      onChange:(v)=>{
        pointref.current!.material.uniforms.uSize.value = v
        
      }
    },
    progress:{
      value:0,
      min:0,
      max:1,
      step:0.01,
      onChange:(v)=>{
        pointref.current!.material.uniforms.progress.value = v
      }
    },
    toggle: button(() => {
      const {position,toposition} = particles.to(new THREE.SphereGeometry(5, 32, 32))
      _ref.current!.array = position
      _toref.current!.array = toposition
      _ref.current!.needsUpdate = true;
      _toref.current!.needsUpdate = true
      pointref.current!.material.uniforms.progress.value = 0
    })
  })




  useEffect(() => {
    const {position,toposition} = particles.to(new THREE.BoxGeometry(10, 10, 10, 20, 20, 20))
    _ref.current!.array = position
    _toref.current!.array = toposition
    _speedref.current!.array = particles.speed
    _ref.current!.needsUpdate = true
    _toref.current!.needsUpdate = true
    // _speedref.current!.needsUpdate =true
  }, [])


  useFrame(() => {
    if(pointref.current){
      pointref.current.material.uniforms.progress.value+=0.01
      if(pointref.current.material.uniforms.progress.value >1 )pointref.current.material.uniforms.progress.value = 1
    }
  })



  return (
    <>
      <OrbitControls />
      <directionalLight position={[1, 2, 3]} />
      <ambientLight intensity={0.5} />
      <points ref={pointref} >
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
          vertexShader={VertexShader}
          fragmentShader={FragmentShader}
          uniforms={{
            uSize: { value: 0.1 },
            progress:{value:0}
          }}
        >
        </shaderMaterial>
      </points>
    </>
  )
}

