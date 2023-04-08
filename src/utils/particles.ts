import * as THREE from 'three'

export default class Particles {
  position: Float32Array
  toPosition: Float32Array
  count: number
  speed: Float32Array
  constructor() {
    this.count = 10000
    this.position = new Float32Array(this.count * 3)
    this.toPosition = new Float32Array(this.count * 3)
    this.speed = new Float32Array(this.count)
    this.init()
  }

  init() {
    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3
      this.toPosition[i3] = (Math.random() - 0.5) * 100
      this.toPosition[i3 + 1] = (Math.random() - 0.5) * 100
      this.toPosition[i3 + 2] = (Math.random() - 0.5) * 100

      this.speed[i] = 0.2 + Math.random()*0.8
    }
  }


  to(geometry: any) {
    const { array, count } = (<THREE.BufferAttribute>(geometry.getAttribute('position')))
    let targetIndex = 0
    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3
      /* 将结果限制在pointCount的内 */
      targetIndex %= count
      const targetIndex3 = targetIndex * 3
      this.position[i3] = this.toPosition[i3]
      this.position[i3 + 1] = this.toPosition[i3 + 1]
      this.position[i3 + 2] = this.toPosition[i3 + 2]

      this.toPosition[i3] = array[targetIndex3]
      this.toPosition[i3 + 1] = array[targetIndex3 + 1]
      this.toPosition[i3 + 2] = array[targetIndex3 + 2]

      this.speed[i] = 0.4 + Math.random()*0.3

      targetIndex++
    }
    return { position: this.position, toposition: this.toPosition }
  }
}