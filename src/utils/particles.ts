import * as THREE from 'three'


interface ITransform {
  geometry: THREE.BufferGeometry;
  color: THREE.Color;
}

export default class Particles {
  position: Float32Array
  toPosition: Float32Array
  count: number
  speed: Float32Array
  color: Float32Array
  tocolor: Float32Array
  initPosition: any;
  constructor(pointcount: number) {
    this.count = pointcount
    this.position = new Float32Array(this.count * 3)
    this.toPosition = new Float32Array(this.count * 3)
    this.initPosition = new Float32Array(this.count * 3)
    this.speed = new Float32Array(this.count)
    this.color = new Float32Array(this.count * 3)
    this.tocolor = new Float32Array(this.count * 3)
    this.init()
  }

  init(color: THREE.Color = new THREE.Color('blue')) {
    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3
      this.toPosition[i3] = (Math.random() - 0.5) * 100
      this.toPosition[i3 + 1] = (Math.random() - 0.5) * 100
      this.toPosition[i3 + 2] = (Math.random() - 0.5) * 100


      this.initPosition[i3] = this.toPosition[i3]
      this.initPosition[i3+1] = this.toPosition[i3+1]
      this.initPosition[i3+2] = this.toPosition[i3+2]

      this.tocolor[i3] = color['r']
      this.tocolor[i3 + 1] = color['g']
      this.tocolor[i3 + 2] = color['b']


      this.speed[i] = 0.2 + Math.random() * 0.8
    }
  }

  transform(from: ITransform, to: ITransform) {
    const fromPosition = (<THREE.BufferAttribute>(from.geometry.getAttribute('position')))
    const toPosition = (<THREE.BufferAttribute>(to.geometry.getAttribute('position')))

    let fromIndex = 0
    let toIndex = 0
    for (let index = 0; index < this.count; index++) {
      const i3 = index * 3

      fromIndex %= fromPosition.count
      toIndex %= toPosition.count

      const fromIndex3 = fromIndex * 3
      const toIndex3 = toIndex * 3

      this.position[i3] = fromPosition.array[fromIndex3]
      this.position[i3 + 1] = fromPosition.array[fromIndex3 + 1]
      this.position[i3 + 2] = fromPosition.array[fromIndex3 + 2]

      this.toPosition[i3] = toPosition.array[toIndex3]
      this.toPosition[i3 + 1] = toPosition.array[toIndex3 + 1]
      this.toPosition[i3 + 2] = toPosition.array[toIndex3 + 2]


      this.color[i3] = from.color['r']
      this.color[i3 + 1] = from.color['g']
      this.color[i3 + 2] = from.color['b']

      this.tocolor[i3] = to.color['r']
      this.tocolor[i3 + 1] = to.color['g']
      this.tocolor[i3 + 2] = to.color['b']

      this.speed[index] = 0.4 + Math.random() * 0.3

      fromIndex++
      toIndex++
    }
    return {
      position: this.position,
      toposition: this.toPosition,
    }

  }


  to(geometry: any, color: THREE.Color) {
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

      this.color[i3] = this.tocolor[i3]
      this.color[i3 + 1] = this.tocolor[i3 + 1]
      this.color[i3 + 2] = this.tocolor[i3 + 2]

      this.tocolor[i3] = color['r']
      this.tocolor[i3 + 1] = color['g']
      this.tocolor[i3 + 2] = color['b']

      this.speed[i] = 0.4 + Math.random() * 0.3

      targetIndex++
    }
    return {
      position: this.position,
      toposition: this.toPosition,
    }
  }


}