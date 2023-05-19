// Custom imports
import Project from './Project.js'
import { projectAsset } from '../../helpers/projectHelpers.js'

// ThreeJS imports
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import vhsVertexShader from '../../shaders/vhs/vertex.glsl'
import vhsFragmentShader from '../../shaders/vhs/fragment.glsl'

// GSAP imports
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
gsap.registerPlugin(ScrollToPlugin)
import { CustomEase } from "gsap/CustomEase"
gsap.registerPlugin(CustomEase)

export default class ProjectsScene {

  // Scene settings with defaults
  defaults = {
    background: 0xd77c64,
    fogMin: 2,
    fogMax: .2,
    // Camera
    viewpoint: new THREE.Vector3(.7, 0, 2),
    viewpointRotationY: .5,
    // Relative to global camera position (thanks to grouping, cf. camera objects/groups)
    viewpointActive: new THREE.Vector3(-.3, 0, -.9),
    viewPointActiveRotationY: -.9,
    fov: 70,
    // Postprocess
    pp: {
      vhsNoise: .08,
      vignetteInner: .4,
      vignetteOuter: .8,
      vignetteOpacity: .4,
      vignettePulse: 8,
      minRgbShift: .001,
      maxRgbShift: .005,
    },
    // Camera parallax
    parallaxOffset: .05,
    parallaxDuration: .6,
    parallaxEase: "power2.out",
    // Debug
    enableGui: false,
    enableOrbit: false,
    enableAxesHelper: false,
    // Images
    image3dToPxRatio: .012,
    imageParticleColor: 0x6b4688, // 0x7b5698, //0xf85d4c,
    imageParticleSize: 17, // Depends on screen size
    imageParticleMinZ: -2,
    imageParticleMaxZ: 1.5,
    imageRotationOffset: .4,
    imageRotationRadius: 7.2,
    imageOffsetX: 1,
    // Animations
    navTransitionDuration: 2,
    navTransitionEase: "power1.inOut",
    activeTransitionDuration: 4,
    activeTransitionEase: CustomEase.create("custom", "M0,0,C0,0,0,0,0,0,0.13,0,0.15,0.354,0.286,0.674,0.422,0.995,0.558,1,1,1"),
    // Override settings with props
    
  }

  // Other attributes
  isReady = false

  settings = {}
  projects = []
  canvas
  scrollTrigger

  camera
  cameraActiveGroup
  cameraGroup
  renderer

  axesHelper
  orbitControls

  projectsTimeline

  clock = new THREE.Clock()
  rgbShiftPass
  vhsPass

  // ===================================================
  // Construct with settings
  // ===================================================
  constructor(settings) {
    this.settings = { ... this.defaults, ...settings}
  }

  // ===================================================
  // Initialize with projects and canvas
  // ===================================================
  init(projects, canvas, scrollTrigger) {
    this.projects = projects
    this.canvas = canvas
    this.scrollTrigger = scrollTrigger

    const loadingManager = new THREE.LoadingManager()
    loadingManager.onLoad = this.onLoad.bind(this)
    
    const imageLoader = new THREE.ImageLoader(loadingManager)
    this.projects.forEach(project => {
      imageLoader.load(projectAsset(project.thumbnail), img => { project.imageObject = img })
    })
  }

  // ===================================================
  // Initialize everything when loaded
  // ===================================================
  onLoad() {
    this.initScene()
    this.initAnimations()
    this.initOrbit()
    this.initPostProcess()

    // Init resize / parallax positions/sizes
    window.dispatchEvent(new Event('resize'))
    this.handleParallax()

    // Start main loop
    this.loop()

    // Flag as ready
    this.isReady = true
  }

  // ===================================================
  // Initialize 3D scene
  // ===================================================
  initScene() {
    // Settings alias for convenience
    const s = this.settings

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        canvas: this.canvas,
        antialias: true,
    })
    
    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(s.background)

    // Camera
    // Camera > cameraGroup > camera
    // - cameraGroup handles the position in the world, linked to scroll animation
    // - cameraActiveGroup handles the position "inside" or "outside". Used to be animated separately from cameraGroup
    // - camera itself moves inside to handle parallax effect
    this.camera = new THREE.PerspectiveCamera(s.fov)
    this.cameraActiveGroup = new THREE.Group()
    this.cameraActiveGroup.add(this.camera)
    this.cameraGroup = new THREE.Group()
    this.cameraGroup.position.copy(s.viewpoint)
    this.cameraGroup.add(this.cameraActiveGroup)
    scene.add(this.cameraGroup)

    // Axes
    this.axesHelper = new THREE.AxesHelper(1)
    scene.add(this.axesHelper)

    // For each image, construct a 3d object (Project class)
    // Add it to project data, add it to scene
    this.projects.forEach((data, index) => {
      let projectObject = new Project(data, index, s)
      scene.add(projectObject.mesh)
      data.object3d = projectObject
    })

    // TODO: postprocessing
    this.effectComposer = new EffectComposer(this.renderer)
    this.effectComposer.addPass(new RenderPass(scene, this.camera))
  }

  // ===================================================
  // Scroll animation with GSAP + scrolltrigger
  // ===================================================
  initAnimations() {
    const s = this.settings

    if(s.enableOrbit) {
      return
    }

    this.projectsTimeline = gsap.timeline({
      scrollTrigger: this.scrollTrigger
    })
    this.projects.forEach((project, i) => {
      let {x, y, z} = project.object3d.cameraTargetPosition
      if(i == 0) {
        // Set starting position on first project
        this.cameraGroup.position.x = x
        this.cameraGroup.position.y = y
        this.cameraGroup.position.z = z
        this.cameraGroup.rotation.x = project.object3d.cameraTargetRotation
        this.cameraGroup.rotation.y = s.viewpointRotationY
      } else {
        // Set timeline stops
        // Position
        this.projectsTimeline.to(this.cameraGroup.position, {
          duration: 1,
          ease: s.navTransitionEase,
          x: x,
          y: y,
          z: z
        })
        // Rotation
        this.projectsTimeline.to(this.cameraGroup.rotation, {
          duration: .6,
          ease: s.navTransitionEase,
          x: project.object3d.cameraTargetRotation,
          y: s.viewpointRotationY,
        }, "<")
      }
      this.projectsTimeline.addLabel(`project-${project.slug}`)
    })
  }

  // ===================================================
  // Post process
  // ===================================================
  initPostProcess() {
    const s = this.settings.pp

    // RGB shift
    this.rgbShiftPass = new ShaderPass(RGBShiftShader)
    this.rgbShiftPass.material.uniforms.angle.value = -.4
    this.rgbShiftPass.material.uniforms.amount.value = s.maxRgbShift

    // VHS (custom)
    this.vhsPass = new ShaderPass({
      vertexShader: vhsVertexShader,
      fragmentShader: vhsFragmentShader,
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uNoise: { value: s.vhsNoise },
        uVignetteInner: { value: s.vignetteInner },
        uVignetteOuter: { value: s.vignetteOuter },
        uVignetteOpacity: { value: s.vignetteOpacity },
        uVignettePulse: { value: s.vignettePulse },
      }
    })

    // Add to composer
    this.effectComposer.addPass(this.rgbShiftPass)
    this.effectComposer.addPass(this.vhsPass)
  }

  // ===================================================
  // Orbit controls for debug
  // ===================================================
  initOrbit() {
    this.orbitControls = new OrbitControls(this.camera, this.canvas)
    this.orbitControls.enableDamping = true
    this.orbitControls.enabled = this.settings.enableOrbit
  }

  // ===================================================
  // Main loop
  // ===================================================
  loop() {
    let t = this.clock.getElapsedTime()

    // Update some shaders
    this.vhsPass.uniforms.uTime.value = t

    // Update controls
    if(this.settings.enableOrbit) {
        this.orbitControls.update()
    }

    // Show/hide axes helper
    this.axesHelper.visible = this.settings.enableAxesHelper

    // Render
    this.effectComposer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(this.loop.bind(this))
  }

  // ===================================================
  // Resize the scene
  // ===================================================
  resize(w, h) {
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h, false)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.effectComposer.setSize(w, h)
    this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // Update particle size
    this.projects.forEach(project => {
      // Since THREEJS resize when height changes, let's use height as reference
      let size = h / 1440 * this.settings.imageParticleSize
      project.object3d.setParticleSize(size)
    })
  }

  // ===================================================
  // Move camera when active project changes
  // ===================================================
  setActiveProject(newValue, oldValue) {
    const s = this.settings

    // Note: values are slugs
    if(newValue !== null && newValue !== undefined) {
      var target = s.viewpointActive
      var rotationY = s.viewPointActiveRotationY

    } else {
      var target = new THREE.Vector3(0, 0, 0)
      var rotationY = 0
    }

    let {x, y, z} = target
    gsap.to(this.cameraActiveGroup.position, {
      duration: s.activeTransitionDuration,
      ease: s.activeTransitionEase,
      x: x,
      y: y,
      z: z,
    })
    gsap.to(this.cameraActiveGroup.rotation, {
      duration: s.activeTransitionDuration,
      ease: s.activeTransitionEase,
      y: rotationY,
    })
  }

  // ===================================================
  // Animate camera inside cameraGroup 
  // according to mouse position
  // ===================================================
  handleParallax(x, y, event) {
    const s = this.settings

    if(!this.isReady || s.enableOrbit) {
      return
    }

    let offsetX = x !== undefined ? (x / window.innerWidth - .5) : 0
    let offsetY = y !== undefined ? -(y / window.innerHeight - .5) : 0

    // Move camera
    gsap.killTweensOf(this.camera.position)
    gsap.killTweensOf(this.camera.rotation)

    gsap.to(this.camera.position, {
        duration: s.parallaxDuration,
        ease: s.parallaxEase,
        x: offsetX * s.parallaxOffset / 2,
        y: offsetY * s.parallaxOffset / 2,
    })
    gsap.to(this.camera.rotation, {
        duration: s.parallaxDuration,
        ease: s.parallaxEase,
        x: -offsetY * s.parallaxOffset,
        y: offsetX * s.parallaxOffset,
    })

    // Update RGB shift
    let distanceToCenter = Math.sqrt(offsetX * offsetX + offsetY * offsetY)
    let m = Math.random() * .4 + .6
    gsap.to(this.rgbShiftPass.material.uniforms.amount, {
        value: s.pp.minRgbShift + (distanceToCenter * m * (s.pp.maxRgbShift - s.pp.minRgbShift)),
        ease: s.pp.parallaxEase,
    })
  }

}