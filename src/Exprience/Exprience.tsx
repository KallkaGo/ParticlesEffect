import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import Particles from '../utils/particles'
import { button, useControls } from 'leva'
import { useEffect, useRef } from 'react'
import VertexShader from './shader/vertex.glsl'
import FragmentShader from './shader/fragment.glsl'




const pointCount = 100000



export default function Exprience() {

  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const _ref = useRef<THREE.BufferAttribute>(null)
  const _toref = useRef<THREE.BufferAttribute>(null)
  const _speedref = useRef<THREE.BufferAttribute>(null)
  const _colorref = useRef<THREE.BufferAttribute>(null)
  const _tocolorref = useRef<THREE.BufferAttribute>(null)
  const particles = new Particles(pointCount)

  const model = useGLTF('/model/particle.glb')
  const wall = model.scene.getObjectByName('Wall') as THREE.Mesh
  const people = model.scene.getObjectByName('people') as THREE.Mesh
  const honeyComb = model.scene.getObjectByName('HoneyComb') as THREE.Mesh
  const worm_Gear = model.scene.getObjectByName('Worm_Gear') as THREE.Mesh

  if (!wall || !people! || !honeyComb || !worm_Gear) {
    throw new Error('模型加载出错')
  }

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
      setGeometry(people.geometry, new THREE.Color('#51f'))
      materialRef.current!.uniforms.progress.value = 0
    })
  })


  useEffect(() => {
    setGeometry(wall.geometry.translate(0,-5,0), new THREE.Color('#55ff00'))
  }, [])


  useFrame(() => {
    if (materialRef.current) {
      materialRef.current!.uniforms.progress.value += 0.01
      if (materialRef.current!.uniforms.progress.value > 1) materialRef.current!.uniforms.progress.value = 1
    }
  })

  const setGeometry = (geometry: THREE.BufferGeometry, color: THREE.Color) => {
    const { position, toposition } = particles.to(geometry, color)
    _ref.current!.array = position
    _toref.current!.array = toposition
    _speedref.current!.array = particles.speed
    _colorref.current!.array = particles.color
    _tocolorref.current!.array = particles.tocolor
    _ref.current!.needsUpdate = true
    _toref.current!.needsUpdate = true
    _speedref.current!.needsUpdate = true
    _colorref.current!.needsUpdate = true
    _tocolorref.current!.needsUpdate = true
  }



  return (
    <>
      <OrbitControls />
      <directionalLight position={[1, 2, 3]} />
      <ambientLight intensity={0.5} />
      <axesHelper scale={10} ></axesHelper>
      <points>
        <bufferGeometry >
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
          <bufferAttribute
            ref={_colorref}
            attach='attributes-color'
            count={pointCount}
            itemSize={3}
          />
          <bufferAttribute
            ref={_tocolorref}
            attach='attributes-tocolor'
            count={pointCount}
            itemSize={3}
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

