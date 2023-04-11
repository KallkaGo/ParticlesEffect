import { Canvas } from '@react-three/fiber'
import Exprience from './Exprience/Exprience'
import { Suspense } from 'react'
import './App.css'

function App() {


  return (
    <>
      <Canvas camera={{ fov: 45, near: 0.1, far: 1000, position: [6, 10, 50] }}  >
        <Suspense fallback={
          <mesh position-y={0.5} scale={[10, 15, 10]}><boxGeometry args={[1, 1, 1, 2, 2, 2]} /><meshBasicMaterial wireframe color="red" /></mesh>
        } >
          <Exprience />
        </Suspense>
      </Canvas>
    </>
  )
}

export default App
