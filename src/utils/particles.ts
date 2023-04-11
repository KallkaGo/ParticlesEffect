import * as THREE from 'three'


interface ITransform {
  geometry: THREE.BufferGeometry;
  color: THREE.Color[];
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
      this.initPosition[i3 + 1] = this.toPosition[i3 + 1]
      this.initPosition[i3 + 2] = this.toPosition[i3 + 2]

      this.tocolor[i3] = color['r']
      this.tocolor[i3 + 1] = color['g']
      this.tocolor[i3 + 2] = color['b']


      this.speed[i] = 0.2 + Math.random() * 0.8
    }
  }

  transform(from: ITransform, to: ITransform) {
    const fromPosition = (<THREE.BufferAttribute>(from.geometry.getAttribute('position')))
    const toPosition = (<THREE.BufferAttribute>(to.geometry.getAttribute('position')))

    from.geometry.computeBoundingBox()
    to.geometry.computeBoundingBox()

    const { min: minfrom, max: maxfrom } = from.geometry.boundingBox!;
    const { min: minto, max: maxto } = to.geometry.boundingBox!;


    const formdisColor = new THREE.Color()
    const todisColor = new THREE.Color()

    formdisColor.r = from.color[1].r - from.color[0].r
    formdisColor.g = from.color[1].g - from.color[0].g
    formdisColor.b = from.color[1].b - from.color[0].b

    todisColor.r = to.color[1].r - to.color[0].r
    todisColor.g = to.color[1].g - to.color[0].g
    todisColor.b = to.color[1].b - to.color[0].b



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

      const fromPercent = (this.position[i3] - minfrom.x) / (maxfrom.x - minfrom.x)

      const toPercent = (this.toPosition[i3] - minto.x) / (maxto.x - minto.x)


      this.color[i3] = from.color[0].r + formdisColor.r * fromPercent
      this.color[i3 + 1] = from.color[0].g + formdisColor.g * fromPercent
      this.color[i3 + 2] = from.color[0].b + formdisColor.b * fromPercent

      this.tocolor[i3] = to.color[0]['r'] + todisColor.r * toPercent
      this.tocolor[i3 + 1] = to.color[0]['g'] + todisColor.g * toPercent
      this.tocolor[i3 + 2] = to.color[0]['b'] + todisColor.b * toPercent

      this.speed[index] = 0.4 + Math.random() * 0.3

      fromIndex++
      toIndex++
    }
    return {
      position: this.position,
      toposition: this.toPosition,
    }

  }


  to(geometry: THREE.BufferGeometry, color: THREE.Color[]) {
    const { array, count } = (<THREE.BufferAttribute>(geometry.getAttribute('position')))

    geometry.computeBoundingBox()

    const { min, max } = geometry.boundingBox!;

    const disColor = new THREE.Color()
    disColor.r = color[1].r - color[0].r
    disColor.g = color[1].g - color[0].g
    disColor.b = color[1].b - color[0].b

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


      // 根据下一个模型的位置的x计算百分比
      const percent = (this.toPosition[i3] - min.x) / (max.x - min.x)


      this.tocolor[i3] = color[0].r + disColor.r * percent
      this.tocolor[i3 + 1] = color[0].g + disColor.g * percent
      this.tocolor[i3 + 2] = color[0].b + disColor.b * percent

      this.speed[i] = 0.4 + Math.random() * 0.3

      targetIndex++
    }
    return {
      position: this.position,
      toposition: this.toPosition,
    }
  }


}