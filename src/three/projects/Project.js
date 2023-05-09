import * as THREE from 'three'
import pictureVertexShader from '../../shaders/picture-particles/vertex.glsl'
import pictureFragmentShader from '../../shaders/picture-particles/fragment.glsl'

export default class Project {

  data
  settings

  mesh
  cameraTargetPosition
  cameraTargetRotation

  // ===================================================
  // Constructor
  // ===================================================
  constructor(data, index, settings) {
    this.data = data
    this.settings = settings

    // Create mesh
    // Create object
    let angle = index * -this.settings.imageRotationOffset
    this.mesh = this.getMesh()      
    this.mesh.rotation.x = angle
    this.mesh.position.y = Math.sin(angle) * this.settings.imageRotationRadius
    this.mesh.position.z = (-Math.cos(angle) + 1) * this.settings.imageRotationRadius

    // Camera target for this project
    let cameraTargetPosition = this.mesh.localToWorld(this.settings.viewpoint.clone())
    this.cameraTargetPosition = cameraTargetPosition
    this.cameraTargetRotation = angle
  }

  // ===================================================
  // Make and return a particles mesh from an image
  // ===================================================
  getMesh() {
    // Geometry
    const particlesGeometry = new THREE.BufferGeometry()
    particlesGeometry.setAttribute('position', this.getGeomAttributes())

    // Material
    const particlesMaterial = new THREE.RawShaderMaterial({
      vertexColors: true,
      transparent: true,
      vertexShader: pictureVertexShader,
      fragmentShader: pictureFragmentShader,
      uniforms: {
          uSize: { value: 0 },
          uColor: { value: new THREE.Color(this.settings.imageParticleColor) },
          uFogColor: { value: new THREE.Color(this.settings.background) },
          uFogMax: { value: this.settings.fogMax },
          uFogMin: { value: this.settings.fogMin },
      }
    })

    // Final Mesh
    return new THREE.Points(particlesGeometry, particlesMaterial)
  }

  // ===================================================
  // Calculate anamorphic particles geometry from an image,
  // and get the positions attributes
  // ===================================================
  getGeomAttributes() {
    const image = this.getImage()
    const imgData = this.getImageData(image)
    const w = image.width
    const h = image.height
    const positions = new Float32Array(Math.ceil(w * h / 2) * 3)
    const minZ = this.settings.imageParticleMinZ
    const maxZ = this.settings.imageParticleMaxZ

    // Move particles along z axis
    // TODO: improve: right now half of positions items are particles that will never be shown
    var posIndex = 0
    for(var y = 0; y < h; y++) {
      for(var x = 0; x < w; x++) {
        if(x%2 !== y%2) {
          continue
        }
        let i = w * y + x
        let colorIndex = i * 4      // r, g, b, a in imgData
        let finalPosition = new THREE.Vector3()

        // Cast ray from particle position on the cylinder
        let projectedX = (x - w / 2) * this.settings.image3dToPxRatio
        let projectedY = -((y - h / 2) * this.settings.image3dToPxRatio)
        let projectedZ = Math.sin(Math.atan2(projectedY, this.settings.imageRotationRadius)) * projectedY
        let projectedPosition = new THREE.Vector3(projectedX, projectedY, projectedZ)

        // Get input image pixel value (luminosity)
        let r = imgData.data[colorIndex] / 255
        let g = imgData.data[colorIndex + 1] / 255
        let b = imgData.data[colorIndex + 2] / 255
        let a = imgData.data[colorIndex + 3]  / 255
        let value = 1 - (r + g + b) / 3 * a

        // Stolen from raycaster.setFromCamera()
        let rayDirection = this.settings.viewpoint.clone().sub(projectedPosition).normalize()
        let ray = new THREE.Ray(projectedPosition, rayDirection)

        // Get point position along the ray
        ray.at(minZ + value * (maxZ - minZ), finalPosition)
        
        // Fill the positions array
        positions[posIndex    ] = finalPosition.x
        positions[posIndex + 1] = finalPosition.y
        positions[posIndex + 2] = finalPosition.z

        // increment posIndex
        posIndex += 3
      }
    }

    return new THREE.BufferAttribute(positions, 3)
  }

  // ===================================================
  // Shortcut to get image
  // ===================================================
  getImage() {
    return this.data.imageObject
  }

  // ===================================================
  // Get image data in array
  // ===================================================
  getImageData() {
      const image = this.getImage()
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d', {willReadFrequently: true})

      // Canvas to get image data
      tempCanvas.width = image.width
      tempCanvas.height = image.height
      tempCtx.drawImage(image, 0, 0)
      
      return tempCtx.getImageData(0, 0, image.width, image.height)
  }

  // ===================================================
  // Used when resizing whole scene
  // ===================================================
  setParticleSize(size) {
    this.mesh.material.uniforms.uSize.value = size
  }

}