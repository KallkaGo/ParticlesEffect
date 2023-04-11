import * as THREE from 'three'
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils'
import { OrbitControls, useGLTF } from '@react-three/drei'
import Particles from '../utils/particles'
import { useControls } from 'leva'
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


  const modeldice = useGLTF('/model/dice2.glb')

  const modelMonkeyHead = useGLTF('/model/houzi.glb')

 

  /* 合并模型几何体 */
  const mergeGeometry = (group: THREE.Mesh[]) => {
    let geometryArray: THREE.BufferGeometry[] = []
    group.map((mesh) => {
      /* 相对坐标转换成世界坐标 */
      let matrixWorldGeometry = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld)
      geometryArray.push(matrixWorldGeometry)
    })
    const mergedGeometries = mergeBufferGeometries(geometryArray)

    return mergedGeometries
  }



  const monkey = modelMonkeyHead.scene.getObjectByName('猴头') as THREE.Mesh



  const dice = modeldice.scene.getObjectByName('frame') as THREE.Mesh



  if (!wall || !people! || !honeyComb || !worm_Gear) {
    throw new Error('模型加载出错')
  }

  const list = [
    {
      geometry: wall.geometry,
      color: [new THREE.Color('#55ff00'), new THREE.Color('#55ffff')]
    },
    {
      geometry: dice.geometry.scale(10, 10, 10),
      color: [new THREE.Color('red'), new THREE.Color('blue')]
    },
    {
      geometry: monkey.geometry.scale(10, 10, 10),
      color: [new THREE.Color('pink'), new THREE.Color('purple')]
    },
    {
      geometry: worm_Gear.geometry,
      color: [new THREE.Color('yellow'), new THREE.Color('white')]
    }
  ]

  list[-1] = {
    geometry: new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(particles.initPosition, 3)),
    color: [new THREE.Color('black'), new THREE.Color('black')]
  }

  document.body.style.height = window.innerHeight * (list.length + 1) - 1 + 'px'

  let current = 0

  const onScroll = () => {
    const scrollHeight = window.scrollY
    const precent = scrollHeight / innerHeight
    const index = Math.floor(precent)
    if (current !== index) {
      if (current < index) {
        transformGeometry(list[current], list[index])
        // setGeometry(list[index].geometry, list[index].color)
      } else {
        /*
        因为在顶点着色器中通过 toposition - position 来求顶点的差值 最后乘以progress让粒子渐变
        从下往上滚动时，progress从1逐渐趋近于0  所以需要把要变换的Geometry放到 transformGeometry 的from参数上 
        */
        transformGeometry(list[index - 1], list[current - 1])
      }
      current = index
    }
    setPercent(precent - index)
  }

  document.addEventListener('scroll', onScroll)


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
    // progress: {
    //   value: 0,
    //   min: 0,
    //   max: 1,
    //   step: 0.01,
    //   onChange: (v) => {

    //     materialRef.current!.uniforms.progress.value = v
    //   }
    // },
    // toggle: button(() => {
    //   setGeometry(monkey.geometry, new THREE.Color('#51f'))
    //   materialRef.current!.uniforms.progress.value = 0
    // })
  })


  useEffect(() => {
    setGeometry(list[0].geometry, list[0].color),

      () => {
        document.removeEventListener('scroll', onScroll)
      }
  }, [])

  const setGeometry = (geometry: THREE.BufferGeometry, color: THREE.Color[]) => {
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

  const transformGeometry = (from: any, to: any) => {
    const { position, toposition } = particles.transform(from, to)
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


  const setPercent = (value: number) => {
    materialRef.current!.uniforms.progress.value = value
  }



  return (
    <>
      <OrbitControls enableZoom={false} />
      <directionalLight position={[1, 2, 3]} />
      <ambientLight intensity={0.5} />
      {/* <axesHelper  ></axesHelper> */}
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

