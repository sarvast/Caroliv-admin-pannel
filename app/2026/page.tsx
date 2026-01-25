"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Stars, Sparkles, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const GoldText = () => {
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Text
                fontSize={3}
                color="#FFD700"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#8B0000"
            >
                2026
                <meshStandardMaterial
                    color="#FFD700"
                    metalness={1}
                    roughness={0.1}
                    emissive="#FFD700"
                    emissiveIntensity={0.2}
                />
            </Text>
        </Float>
    );
};

const DedicationText = () => {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 pointer-events-none z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-500 to-yellow-300 drop-shadow-lg mb-4 animate-pulse">
                Happy New Year
            </h1>
            <div className="bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-yellow-500/20 shadow-2xl">
                <p className="text-xl md:text-2xl text-yellow-100 font-light tracking-wide">
                    For a special person
                </p>
                <p className="text-2xl md:text-4xl font-serif text-amber-400 mt-2 font-bold drop-shadow-md">
                    Anushka Rani Singh
                </p>
            </div>
        </div>
    );
};

const Particles = ({ count = 100 }) => {
    // Generate random positions for particles
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 20;
            const z = (Math.random() - 0.5) * 10 - 5;
            const speed = Math.random() * 0.02 + 0.005;
            temp.push({ x, y, z, speed, ref: React.createRef<THREE.Mesh>() });
        }
        return temp;
    }, [count]);

    useFrame(() => {
        particles.forEach((particle) => {
            if (particle.ref.current) {
                particle.ref.current.position.y += particle.speed;
                particle.ref.current.rotation.x += particle.speed;
                particle.ref.current.rotation.z += particle.speed;
                if (particle.ref.current.position.y > 10) {
                    particle.ref.current.position.y = -10;
                }
            }
        });
    });

    return (
        <>
            {particles.map((particle, i) => (
                <mesh key={i} ref={particle.ref} position={[particle.x, particle.y, particle.z]}>
                    <octahedronGeometry args={[0.1, 0]} />
                    <meshStandardMaterial color={Math.random() > 0.5 ? "#FFD700" : "#C0C0C0"} metalness={1} roughness={0} />
                </mesh>
            ))}
        </>
    );
};

export default function NewYearPage() {
    return (
        <main className="w-full h-screen bg-gradient-to-b from-red-950 via-black to-black overflow-hidden relative">
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                {/* Lights */}
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#FFD700" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#ff0000" />

                {/* Environment */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Sparkles count={500} scale={12} size={2} speed={0.4} opacity={0.5} color="#FFD700" />

                {/* Main Content */}
                <GoldText />
                <Particles count={150} />

                {/* Controls */}
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>

            <DedicationText />

            {/* Audio Hint (Optional) */}
            {/* <div className="absolute top-4 right-4 text-white/50 text-xs">Sound On 🔊</div> */}
        </main>
    );
}
