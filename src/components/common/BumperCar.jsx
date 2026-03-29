import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Stars, Trail } from '@react-three/drei';
import * as THREE from 'three';
import SigmaCar3D from './SigmaCar3D';
import { useLocation } from 'react-router-dom';

const RoamingScene = () => {
    const carRef = useRef();
    const { viewport } = useThree();

    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3([
            new THREE.Vector3(-viewport.width * 0.6, -viewport.height * 0.4, 0),
            new THREE.Vector3(-viewport.width * 0.3, viewport.height * 0.2, 2),
            new THREE.Vector3(viewport.width * 0.2, -viewport.height * 0.3, -2),
            new THREE.Vector3(viewport.width * 0.6, viewport.height * 0.4, 0),
            new THREE.Vector3(viewport.width * 0.3, viewport.height * 0.6, 2),
            new THREE.Vector3(-viewport.width * 0.4, viewport.height * 0.2, -3),
            new THREE.Vector3(-viewport.width * 0.6, -viewport.height * 0.4, 0),
        ], true);
    }, [viewport]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime() * 0.05;
        const loopTime = time % 1;

        if (carRef.current) {
            const pos = curve.getPointAt(loopTime);
            carRef.current.position.copy(pos);
            const nextPos = curve.getPointAt((loopTime + 0.01) % 1);
            carRef.current.lookAt(nextPos);
            carRef.current.rotation.z = Math.sin(time * 10) * 0.1;
        }
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#FF7A18" />
            <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

            <Trail
                width={typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 2}
                length={typeof window !== 'undefined' && window.innerWidth < 768 ? 3 : 5}
                color={new THREE.Color("#FF7A18")}
                attenuation={(t) => t * t}
            >
                <SigmaCar3D ref={carRef} scale={typeof window !== 'undefined' && window.innerWidth < 768 ? 0.25 : 0.4} />
            </Trail>

            <Environment resolution={128}>
                <group rotation={[0, 0, 1]}>
                    <mesh position={[0, 0, -10]} scale={[10, 10, 1]}>
                        <planeGeometry />
                        <meshBasicMaterial color="#FF7A18" />
                    </mesh>
                    <mesh position={[0, 0, 10]} scale={[10, 10, 1]}>
                        <planeGeometry />
                        <meshBasicMaterial color="#5B8CFF" />
                    </mesh>
                </group>
            </Environment>
        </>
    );
};

const BumperCar = () => {
    const location = useLocation();
    
    // Only render on the home page to save massive resources globally
    if (location.pathname !== '/') return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-0 opacity-40 md:opacity-100 overflow-hidden">
            <Canvas
                shadows={false}
                camera={{ position: [0, 0, 15], fov: 45 }}
                gl={{ 
                    antialias: false, 
                    alpha: true,
                    powerPreference: "high-performance",
                    stencil: false,
                    depth: true
                }}
                performance={{ min: 0.5 }}
                dpr={[1, 1.5]}
                style={{ background: 'transparent', pointerEvents: 'none' }}
            >
                <Suspense fallback={null}>
                    <RoamingScene />
                </Suspense>
            </Canvas>

            {/* Cinematic HUD Overlay - Minimal */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
                <div className="absolute top-1/2 left-10 -translate-y-1/2 flex flex-col gap-4 opacity-20">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-1 h-20 bg-gradient-to-b from-transparent via-[#FF7A18] to-transparent" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BumperCar;

