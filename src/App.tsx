import { Canvas } from '@react-three/fiber'
import Exprience from './Exprience/Exprience'
import './App.css'

function App() {


  return (
    <>
      <Canvas camera={{ fov: 45, near: 0.1, far: 1000, position: [6, 4, 20] }}  >
        <Exprience />
      </Canvas>
    </>
  )
}

export default App
