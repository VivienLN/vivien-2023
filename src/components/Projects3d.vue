<script setup>
  // VueJS imports
  import { onMounted, onBeforeUpdate, ref } from 'vue'
  import { useResize } from '../composables/resize.js'

  // ThreeJS imports
  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
  import * as dat from 'lil-gui'
  import pictureVertexShader from '../shaders/picture-particles/vertex.glsl'
  import pictureFragmentShader from '../shaders/picture-particles/fragment.glsl'

  // Props
  const props = defineProps({
    projects: {
      type: Array,
      required: true
    },
    settings: {
      type: Object,
      required: false
    }
  })

  // Scene settings with defaults
  const settings = {
    viewpoint: new THREE.Vector3(0, 0, 2),
    fov: 50,
    enableGui: true,
    enableOrbit: !false,
    enableAxesHelper: false,
    // Images
    imageSize3d: 1.5,
    imageSizePx: 200,
    imageParticleColor: 0xffeeaa,
    imageParticleSize: 10,
    imageParticleMinZ: -1.5,
    imageParticleMaxZ: 1.5,
  }

  // Ref for canvas
  const threeCanvas = ref(null)

  // Usefull threeJS objects
  const tjs = {
    clock: new THREE.Clock(),
    scene: null,
    renderer: null,
    camera: null,
    orbitControls: null,
    axesHelper: null,
    gui: null,
  }
  const sizes = useResize(threeCanvas, (w, h) => {
    tjs.camera.aspect = w / h
    tjs.camera.updateProjectionMatrix()
    tjs.renderer.setSize(w, h, false)
    tjs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

  // onMounted callback
  onMounted(load)

  
  // ===================================================
  // Load assets (called onMounted())
  // ===================================================
  async function load() {
    
    console.log('load()')
    console.log(settings)// Load images 

    const loadingManager = new THREE.LoadingManager()
    loadingManager.onStart = () => console.log('starting loading')
    loadingManager.onProgress = () => console.log('loading progress')
    loadingManager.onError = () => console.log('loading error')
    loadingManager.onLoad = initScene
    
    const imageLoader = new THREE.ImageLoader(loadingManager)
    props.projects.forEach(project => {
      imageLoader.load(`/src/assets/projects/${project.image}`, img => { project.imageObject = img })
    })
  }

  // ===================================================
  // Initialize scene (when everything is loaded)
  // ===================================================
  function initScene() {

    console.log('initScene()')
    console.log(props.projects)

    // ThreeJS setup
    const canvas = threeCanvas.value
    tjs.scene = new THREE.Scene()
    tjs.renderer = new THREE.WebGLRenderer({
        alpha: true,
        canvas: canvas
    })

    // Camera
    tjs.camera = new THREE.PerspectiveCamera(settings.fov)
    tjs.camera.position.copy(settings.viewpoint)
    tjs.scene.add(tjs.camera)

    // Orbit Controls
    tjs.orbitControls = new OrbitControls(tjs.camera, canvas)
    tjs.orbitControls.enableDamping = true
    tjs.orbitControls.enabled = settings.enableOrbit

    // Axes
    tjs.axesHelper = new THREE.AxesHelper(1)
    tjs.scene.add(tjs.axesHelper)

    // For each image, construct a geometry and a mesh
    // TOTO: remove (for test)
    // props.projects.forEach(project => {
    //   let mesh = imageToMesh(project.imageObject)
    //   tjs.scene.add(mesh)
    // })
    let mesh = imageToMesh(props.projects[0].imageObject)
    tjs.scene.add(mesh)

    // Debug GUI
    if(settings.enableGui) {
      setupGui()
    }

    // Fire resize event
    window.dispatchEvent(new Event('resize'))

    // Start main loop
    refresh()
  }

  // ===================================================
  // Make and return a particles mesh from an image
  // ===================================================
  function imageToMesh(image) {
    // Geometry
    const { positions, visible } = imageToGeomAttributes(image)
    const particlesGeometry = new THREE.BufferGeometry()
    particlesGeometry.setAttribute('position', positions)
    particlesGeometry.setAttribute('aVisible', visible)
    // particlesGeometry.computeBoundingBox();
    // particlesGeometry.computeBoundingSphere();
    // particlesGeometry.attributes.aVisible.needsUpdate = true
    // particlesGeometry.attributes.position.needsUpdate = true

    // Material
    const particlesMaterial = new THREE.RawShaderMaterial({
        depthWrite: false,
        vertexColors: true,
        transparent: true,
        vertexShader: pictureVertexShader,
        fragmentShader: pictureFragmentShader,
        uniforms: {
            uSize: { value: settings.imageParticleSize },
            uColor: { value: new THREE.Color(settings.imageParticleColor) }
        }
    })

    // Final Mesh
    return new THREE.Points(particlesGeometry, particlesMaterial)
  }

  // ===================================================
  // Calcaulte anamorphic particles geometry from an image,
  // and get the following attributes:
  // - positions
  // - visible
  // ===================================================
  function imageToGeomAttributes(image) {
    const imgData = getImageData(image)
    const imgSize = settings.imageSizePx
    const count = imgSize * imgSize
    const positions = new Float32Array(count * 3)
    const visible = new Uint8Array(count) // Sad, no BitArray in JS :'(
    const minZ = settings.imageParticleMinZ
    const maxZ = settings.imageParticleMaxZ
    const ratio = settings.imageSize3d / settings.imageSizePx

    // Move particles along z axis
    // TODO: improve: right now half of positions items are particles that will never be shown
    for(var y = 0; y < imgSize; y++) {
      for(var x = 0; x < imgSize; x++) {
        if(x%2 !== y%2) {
          continue
        }
        let i = imgSize * y + x
        let posIndex = i * 3        // x, y, z in positions
        let colorIndex = i * 4      // r, g, b, a in imgData
        let finalPosition = new THREE.Vector3()

        // Discard 1px / 2 (for "frame print" effect, like a checkboard)
        // And discard "out of bound" pixels (for images with w or h smaller than imgSize)
        let isVisible = colorIndex < imgData.data.length
        visible[i] = isVisible

        // Cast ray from particle position on the plane (z=0) to viewpoint
        let projectedX = x * ratio - settings.imageSize3d / 2
        let projectedY = -y * ratio + settings.imageSize3d / 2
        let projectedPosition = new THREE.Vector3(projectedX, projectedY, 0)

        if(isVisible) {
          // Get input image pixel value (luminosity)
          let r = imgData.data[colorIndex] / 255
          let g = imgData.data[colorIndex + 1] / 255
          let b = imgData.data[colorIndex + 2] / 255
          let a = imgData.data[colorIndex + 3]  / 255
          let value = (r + g + b) / 3 * a

          // Stolen from raycaster.setFromCamera()
          let rayDirection = settings.viewpoint.clone().sub(projectedPosition).normalize()
          let ray = new THREE.Ray(projectedPosition, rayDirection)

          // Get point position along the ray
          ray.at(minZ + value * (maxZ - minZ), finalPosition)

        } else {
          // Just use position on the z=0 plane because they will be hidden anyway
          // And we dont care about original image pixel color because z will be 0
          finalPosition.x = projectedX
          finalPosition.y = projectedY
          finalPosition.z = 0
        }
        
        // Fill the positions array
        positions[posIndex    ] = finalPosition.x
        positions[posIndex + 1] = finalPosition.y
        positions[posIndex + 2] = finalPosition.z
      }
    }

    return {
      positions: new THREE.BufferAttribute(positions, 3),
      visible: new THREE.BufferAttribute(visible, 1)
    }
  }

  // ===================================================
  // Get image data in array
  // ===================================================
  function getImageData(image) {
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d', {willReadFrequently: true})

      // Canvas to get image data
      tempCanvas.width = image.width
      tempCanvas.height = image.height
      tempCtx.drawImage(image, 0, 0)
      
      return tempCtx.getImageData(0, 0, image.width, image.height)
  }

  // ===================================================
  // Refresh scene (ThreeJS loop)
  // ===================================================
  function refresh() {
    let t = tjs.clock.getElapsedTime()

    // Update controls
    if(settings.enableOrbit) {
        tjs.orbitControls.update()
    }

    // Show/hide axes helper
    tjs.axesHelper.visible = settings.enableAxesHelper

    // Render
    tjs.renderer.render(tjs.scene, tjs.camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(refresh)
  }

  function setupGui() {
    tjs.gui = new dat.GUI()
  }
</script>

<template>
  <h1>{{ sizes.width }} x {{ sizes.height }}</h1>
  <canvas ref="threeCanvas"></canvas>
</template>

<style scoped>
  canvas {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    /* z-index: 0; */
    width: 100vw;
    height: 100vh;
    object-fit: contain;
  }
</style>