'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

export default function WireframeBackground() {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const frameIdRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Scene setup
    const scene = new THREE.Scene()

    // Get container dimensions
    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight

    // Camera - close centered view
    const camera = new THREE.PerspectiveCamera(
      45,
      width / height,
      0.01,
      100
    )
    camera.position.set(0, 0.1, 0.9)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Wireframe material - gray with reduced opacity
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xCCCCCC,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    })

    // Group to hold the model - centered, higher
    const modelGroup = new THREE.Group()
    modelGroup.position.set(0, 0.1, 0)
    scene.add(modelGroup)

    // Load OBJ model
    const loader = new OBJLoader()

    loader.load(
      '/models/commodore64.obj',
      (obj) => {
        // Calculate bounding box to center
        const box = new THREE.Box3().setFromObject(obj)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        console.log('Model size:', size.x.toFixed(3), size.y.toFixed(3), size.z.toFixed(3))
        console.log('Model center:', center.x.toFixed(3), center.y.toFixed(3), center.z.toFixed(3))

        // Apply material to all meshes
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = wireframeMaterial
          }
        })

        // Center the model at origin
        obj.position.set(-center.x, -center.y, -center.z)

        // Add to group
        modelGroup.add(obj)
      },
      (xhr) => {
        if (xhr.total > 0) {
          console.log('Loading:', Math.round((xhr.loaded / xhr.total) * 100) + '%')
        }
      },
      (error) => {
        console.error('Error loading model:', error)
      }
    )

    // Animation
    const clock = new THREE.Clock()

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate)

      const time = clock.getElapsedTime()

      // Rotate the model
      modelGroup.rotation.y = time * 0.12
      modelGroup.rotation.x = Math.sin(time * 0.06) * 0.15

      // Floating motion - maintain higher position
      modelGroup.position.y = 0.1 + Math.sin(time * 0.15) * 0.015

      // Subtle camera movement
      camera.position.x = Math.sin(time * 0.04) * 0.12
      camera.position.y = 0.1 + Math.cos(time * 0.05) * 0.04
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      const newWidth = container.clientWidth || window.innerWidth
      const newHeight = container.clientHeight || window.innerHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
      }
      if (containerRef.current && rendererRef.current?.domElement) {
        try {
          containerRef.current.removeChild(rendererRef.current.domElement)
        } catch (e) {}
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
  )
}
