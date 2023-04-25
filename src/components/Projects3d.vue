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
  
  // GSAP imports
  import gsap from "gsap"
  import { ScrollTrigger } from "gsap/ScrollTrigger"
  gsap.registerPlugin(ScrollTrigger)

  // Props
  const props = defineProps({
    projects: {
      type: Array,
      required: true
    },
    settings: {
      type: Object,
      required: false
    },
    currentIndex: {
      type: Number,
      required: true
    },
    scrollTriggerElement: {
      type:String,
      required: true
    }
  })

  // Scene settings with defaults
  const settings = {
    viewpoint: new THREE.Vector3(0, 0, 2),
    fov: 70,
    enableGui: false,
    enableOrbit: false,
    enableAxesHelper: false,
    // Images
    image3dToPxRatio: 3 / 200,
    imageParticleColor: 0xffeeaa,
    imageParticleSize: 10,
    imageParticleMinZ: 0,
    imageParticleMaxZ: 1.5,
    imageRotationOffset: .6, // Max 10 projects
    imageRotationRadius: 4,
    // Animations
    navTransitionDuration: 2,
    navTransitionEase: "power1.inOut",
    // Override settings with props
    ...props.settings
  }

  // Ref for canvas
  const threeCanvas = ref(null)

  // Navigation
  const scrollPosition = ref(0)

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

  // Vue callbacks
  onMounted(load)
  onBeforeUpdate(update)

  // ===================================================
  // Load assets (called onMounted())
  // ===================================================
  async function load() {
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
    tjs.camera.rotation.z = - Math.PI * 2 / 24
    tjs.scene.add(tjs.camera)

    // Orbit Controls
    tjs.orbitControls = new OrbitControls(tjs.camera, canvas)
    tjs.orbitControls.enableDamping = true
    tjs.orbitControls.enabled = settings.enableOrbit

    // Axes
    tjs.axesHelper = new THREE.AxesHelper(1)
    tjs.scene.add(tjs.axesHelper)

    // For each image, construct a geometry and a mesh
    props.projects.forEach((project, i) => {
      // Create object
      project.mesh = imageToMesh(project.imageObject)
      // project.mesh.position.y = -i * settings.imageMargin
      // project.mesh.rotation.y = i * settings.imageRotationOffset
      
      let angle = i * -settings.imageRotationOffset
      project.mesh.rotation.x = angle
      project.mesh.position.y = Math.sin(angle) * settings.imageRotationRadius
      project.mesh.position.z = (-Math.cos(angle) + 1) * settings.imageRotationRadius

      tjs.scene.add(project.mesh)

      // Camera target for this project
      let cameraTargetPosition = project.mesh.localToWorld(settings.viewpoint.clone())
      project.cameraTargetPosition = cameraTargetPosition
      project.cameraTargetRotation = angle
    })

    // Debug GUI
    if(settings.enableGui) {
      setupGui()
    }

    // Scroll
    initScrollTrigger()

    // Fire resize event
    window.dispatchEvent(new Event('resize'))

    // Start main loop
    refresh()

    // Fire first update of scene (according to index)
    update()
  }
  
  // ===================================================
  // Scroll animation with GSAP and scrolltrigger
  // ===================================================
  async function initScrollTrigger() {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: props.scrollTriggerElement,
        start: "top top",
        end: "bottom bottom",
        scrub: .6,
        // onUpdate: self => scrollPosition.value = self.progress,
      }
    })

    // Set timeline stops at each project viewpoint
    props.projects.forEach((project, i) => {
      // Skip first
      if(i == 0) return
      let {x, y, z} = project.cameraTargetPosition
      // Position
      timeline.to(tjs.camera.position, {
        ease: settings.navTransitionEase,
        x: x,
        y: y,
        z: z
      })
      // Rotation
      timeline.to(tjs.camera.rotation, {
        ease: settings.navTransitionEase,
        x: project.cameraTargetRotation,
        y: 0,
        z: 0,
      }, "<")
    })
  }

  // ===================================================
  // Update the scene according to current index
  // ===================================================
  function update() {
    // TODO: Remove update() if we only use scroll
    return
    let project = props.projects[props.currentIndex]
    let {x, y, z} = project.cameraTargetPosition
    gsap.to(tjs.camera.position, {
        duration: settings.navTransitionDuration,
        ease: settings.navTransitionEase,
        x: x,
        y: y,
        z: z,
    })
    gsap.to(tjs.camera.rotation, {
        duration: settings.navTransitionDuration,
        ease: settings.navTransitionEase,
        x: 0,
        y: project.cameraTargetRotation,
        z: 0,
    })
  }

  // ===================================================
  // Make and return a particles mesh from an image
  // ===================================================
  function imageToMesh(image) {
    // Geometry
    const particlesGeometry = new THREE.BufferGeometry()
    particlesGeometry.setAttribute('position', imageToGeomAttributes(image))

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
  // Calculate anamorphic particles geometry from an image,
  // and get the positions attributes
  // ===================================================
  function imageToGeomAttributes(image) {
    const imgData = getImageData(image)
    const w = image.width
    const h = image.height
    const positions = new Float32Array(Math.ceil(w * h / 2) * 3)
    const minZ = settings.imageParticleMinZ
    const maxZ = settings.imageParticleMaxZ

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

        // Cast ray from particle position on the plane (z=0) to viewpoint
        let projectedX = (x - w / 2) * settings.image3dToPxRatio
        let projectedY = -((y - h / 2) * settings.image3dToPxRatio)
        let projectedPosition = new THREE.Vector3(projectedX, projectedY, 0)

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
  <h1>Position: {{ scrollPosition }}</h1>
  <canvas ref="threeCanvas"></canvas>
</template>

<style scoped>
  canvas {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 0;
    width: 100vw;
    height: 100vh;
    object-fit: contain;
  }
  h1 { position: fixed; }
</style>