import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';

// --- BOTTLE MESH WITH DYNAMIC ENGRAVING DECAL ---
function BottleModel({ category, engravingText, engravingFont, wantsEngraving }) {
  const labelTextureRef = useRef(null);

  // Dynamic texture builder using an offscreen HTML Canvas
  const labelTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Draw luxury background plate
    ctx.fillStyle = '#0F0F16';
    ctx.fillRect(0, 0, 512, 512);

    // Outer gold border lines
    ctx.strokeStyle = '#C9A96E';
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, 472, 472);
    ctx.lineWidth = 2;
    ctx.strokeRect(36, 36, 440, 440);

    // Draw AURA watermark
    ctx.fillStyle = 'rgba(201, 169, 110, 0.08)';
    ctx.font = 'bold 80px Cormorant Garamond, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AURA', 256, 230);

    // Draw main label title
    ctx.fillStyle = '#C9A96E';
    ctx.font = '24px DM Sans, sans-serif';
    ctx.fillText('E A U  D E  P A R F U M', 256, 120);

    // Draw Custom Engraved Initials
    if (wantsEngraving && engravingText) {
      ctx.fillStyle = '#F5F0E8';
      
      // Determine font family based on user preferences
      let fontName = 'Cormorant Garamond, serif';
      if (engravingFont === 'script') fontName = 'Great Vibes, cursive';
      if (engravingFont === 'sans') fontName = 'DM Sans, sans-serif';
      
      ctx.font = engravingFont === 'script' ? '68px Great Vibes, cursive' : 'bold 46px Cormorant Garamond, serif';
      ctx.fillText(engravingText, 256, 270);
      
      ctx.fillStyle = '#C9A96E';
      ctx.font = 'italic 16px Cormorant Garamond, serif';
      ctx.fillText('Custom Engraving', 256, 330);
    } else {
      ctx.fillStyle = '#C9A96E';
      ctx.font = 'bold 44px Cormorant Garamond, serif';
      ctx.fillText('ATELIER', 256, 260);
      ctx.fillText('EDITION', 256, 310);
    }

    // Origin/Volume tags
    ctx.fillStyle = '#C9A96E/80';
    ctx.font = '16px DM Sans, sans-serif';
    ctx.fillText('KARACHI  ·  100ML', 256, 400);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    labelTextureRef.current = texture;
    return texture;
  }, [engravingText, engravingFont, wantsEngraving]);

  // Update texture on canvas redraws
  useEffect(() => {
    if (labelTextureRef.current) {
      labelTextureRef.current.needsUpdate = true;
    }
  }, [labelTexture]);

  // Define liquid coloring based on perfume gender category
  const liquidColor = useMemo(() => {
    if (category === 'man') return '#1A2936'; // Slate Blue
    if (category === 'woman') return '#632A39'; // Rich Amber Rose
    return '#4D3B1D'; // Saffron Gold (Unisex)
  }, [category]);

  const groupRef = useRef();

  // Smoothly rotate the bottle to follow the mouse pointer
  useFrame((state) => {
    if (groupRef.current) {
      const targetY = state.pointer.x * 0.7;  // horizontal mouse controls Y-axis rotation
      const targetX = -state.pointer.y * 0.4; // vertical mouse controls X-axis rotation
      
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* 1. Liquid Inner Volume */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 1.8, 32]} />
        <meshPhysicalMaterial 
          color={liquidColor}
          roughness={0.1}
          metalness={0.1}
          transmission={0.6}
          thickness={0.5}
          ior={1.33}
          transparent
        />
      </mesh>

      {/* 2. Outer Glass Bottle Body */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 2.0, 32]} />
        <meshPhysicalMaterial 
          color="#ffffff"
          roughness={0.05}
          transmission={0.9}
          thickness={1.5}
          ior={1.5}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          transparent
        />
      </mesh>

      {/* 3. Front Label Plate Decal */}
      <mesh position={[0, 1.0, 0.81]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1.0, 1.0]} />
        <meshStandardMaterial 
          map={labelTexture}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* 4. Bottle Neck */}
      <mesh position={[0, 2.15, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.3, 16]} />
        <meshPhysicalMaterial 
          color="#ffffff"
          transmission={0.9}
          thickness={0.5}
          roughness={0.05}
        />
      </mesh>

      {/* 5. Golden Neck Ring */}
      <mesh position={[0, 2.05, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.08, 16]} />
        <meshStandardMaterial 
          color="#C9A96E"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* 6. Premium Golden Cap */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.5, 32]} />
        <meshStandardMaterial 
          color="#C9A96E"
          metalness={1.0}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

// --- GOLDEN SCENT PARTICLES MIST (Visual Wow Factor) ---
function ScentParticles() {
  const count = 70;
  const meshRef = useRef();

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const speed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Position around the bottle
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.0 + Math.random() * 1.5;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.random() * 4 - 1;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
      // Drift speeds
      speed[i] = 0.005 + Math.random() * 0.01;
    }
    return [pos, speed];
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const positionsArray = meshRef.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        // Rise upwards
        positionsArray[i * 3 + 1] += speeds[i];
        
        // Loop back down if risen too high
        if (positionsArray[i * 3 + 1] > 3) {
          positionsArray[i * 3 + 1] = -1;
        }

        // Slight drift wobble
        positionsArray[i * 3] += Math.sin(state.clock.getElapsedTime() + i) * 0.002;
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#C9A96E"
        size={0.07}
        transparent
        opacity={0.65}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// --- MAIN WRAPPER WITH CANVAS & LIGHTS ---
export default function BottleViewer({ category, engravingText, engravingFont, wantsEngraving }) {
  return (
    <div className="w-full h-[350px] md:h-[450px] cursor-grab active:cursor-grabbing bg-luxury-slate/5 border border-luxury-gold/5 rounded-lg overflow-hidden relative">
      
      {/* Light controls help */}
      <div className="absolute bottom-4 left-4 text-[9px] uppercase tracking-widest text-luxury-gray/60 pointer-events-none select-none z-10">
        Drag to Rotate 3D Bottle
      </div>

      <Canvas camera={{ position: [0, 1.2, 4.2], fov: 45 }}>
        {/* Soft fill light */}
        <ambientLight intensity={0.4} />

        {/* Directional shines to create high-end reflections */}
        <directionalLight position={[2, 4, 3]} intensity={2.5} color="#ffffff" castShadow />
        <directionalLight position={[-3, 2, -1]} intensity={0.8} color="#C9A96E" />
        <pointLight position={[0, -2, 2]} intensity={0.5} color="#ffffff" />
        <spotLight position={[0, 5, 0]} intensity={1.5} angle={0.6} penumbra={1} color="#C9A96E" />

        <Center>
          <BottleModel 
            category={category}
            engravingText={engravingText}
            engravingFont={engravingFont}
            wantsEngraving={wantsEngraving}
          />
          <ScentParticles />
        </Center>

        <OrbitControls 
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  );
}
