import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Environment, MeshWobbleMaterial, ContactShadows, PresentationControls } from '@react-three/drei'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { ArrowDown, Zap, Activity, Shield, Target, Plus, Star, Trophy } from 'lucide-react'
import * as THREE from 'three'

// --- Layer 1 Components ---
const BackgroundSystem = React.memo(({ mouseX, mouseY }) => {
    const lightX = useTransform(mouseX, x => x * 0.5);
    const lightY = useTransform(mouseY, y => y * 0.5);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Animated Deep Mesh Gradient - Simplified Animation for performance */}
            <div className="absolute inset-0 opacity-40 blur-[60px] bg-gradient-to-br from-[#6C5CE7]/10 via-transparent to-[#FF7A00]/5" />
            
            {/* Dynamic Focal Point Light Source */}
            <motion.div 
                style={{ 
                    x: lightX, 
                    y: lightY,
                    willChange: "transform"
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-gradient-to-r from-[#6C5CE7]/10 via-[#FF7A00]/5 to-transparent rounded-full blur-[140px] opacity-40"
            />

            {/* Cinematic Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,4,10,0.4)_70%,rgba(2,4,10,0.8)_100%)] z-10" />
            
            {/* Grain / Noise Texture */}
            <div className="absolute inset-0 noise-overlay opacity-[0.03] z-20" />

            {/* Optimized Particle Field */}
            <div className="absolute inset-0 z-30">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-[1px] h-[1px] bg-white rounded-full"
                        initial={{ 
                            x: Math.random() * 100 + "%", 
                            y: Math.random() * 100 + "%",
                            opacity: Math.random() * 0.4 
                        }}
                        animate={{ 
                            y: ["0%", "-15%"],
                            opacity: [0.1, 0.4, 0.1]
                        }}
                        transition={{ 
                            duration: 15 + Math.random() * 15, 
                            repeat: Infinity, 
                            ease: "linear" 
                        }}
                        style={{ 
                            willChange: "transform, opacity"
                        }}
                    />
                ))}
            </div>
        </div>
    )
});

// --- Layer 2 Components ---
const FloatingShapes = React.memo(({ mouseX, mouseY }) => {
    const shape1X = useTransform(mouseX, x => x * 3);
    const shape1Y = useTransform(mouseY, y => y * 3);
    const shape2X = useTransform(mouseX, x => -x * 2);
    const shape2Y = useTransform(mouseY, y => -y * 2);

    return (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <motion.div
                style={{ x: shape1X, y: shape1Y, willChange: "transform" }}
                animate={{ 
                    rotate: 360,
                    y: [0, -30, 0]
                }}
                transition={{ 
                    rotate: { duration: 60, repeat: Infinity, ease: "linear" },
                    y: { duration: 15, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute top-[10%] left-[5%] w-[30rem] h-[30rem] border border-white/[0.03] rounded-full blur-sm opacity-20"
            />
            <motion.div
                style={{ x: shape2X, y: shape2Y, willChange: "transform" }}
                animate={{ 
                    rotate: -360,
                    y: [0, 40, 0]
                }}
                transition={{ 
                    rotate: { duration: 80, repeat: Infinity, ease: "linear" },
                    y: { duration: 20, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute bottom-[20%] right-[10%] w-[25rem] h-[25rem] border border-[#6C5CE7]/[0.05] rounded-[4rem] blur-md opacity-20"
            />
        </div>
    )
});

const Balloon = ({ position, color, popped }) => {
    const mesh = useRef()

    useFrame((state) => {
        if (mesh.current && !popped) {
            mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2
            mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
        }
    })

    return (
        <group ref={mesh} position={[position[0], position[1], position[2]]}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* Glossy Pink Balloon Body */}
                <mesh visible={!popped}>
                    <sphereGeometry args={[0.55, 16, 16]} />
                    <meshStandardMaterial
                        color="#FF4B91"
                        metalness={0.2}
                        roughness={0.1}
                        emissive="#FF4B91"
                        emissiveIntensity={0.2}
                    />
                </mesh>
                {/* Balloon Tie */}
                <mesh visible={!popped} position={[0, -0.55, 0]}>
                    <coneGeometry args={[0.1, 0.12, 16]} />
                    <meshStandardMaterial color="#FF4B91" />
                </mesh>
                {/* White Curved String */}
                <mesh visible={!popped} position={[0, -1.05, 0]}>
                    <cylinderGeometry args={[0.011, 0.011, 1]} />
                    <meshBasicMaterial color="white" transparent opacity={0.6} />
                </mesh>
            </Float>
        </group>
    )
}

const Gun = ({ targetPos, shooting }) => {
    const ref = useRef()

    useFrame((state) => {
        if (ref.current) {
            if (targetPos) {
                const target = new THREE.Vector3(...targetPos)
                ref.current.lookAt(target)
            }
            // Add a small recoil when shooting
            if (shooting) {
                ref.current.position.z += 0.2
            } else {
                ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, 4, 0.1)
            }
            // Gentle floating
            ref.current.position.y = -1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1
        }
    })

    return (
        <group position={[0, -1.5, 4]} ref={ref}>
            <group rotation={[0, -Math.PI / 2, 0]} scale={0.7}>
                {/* Barrel - Gold */}
                <mesh position={[1.5, 0.4, 0]} rotation={[0, 0, -Math.PI / 2]}>
                    <cylinderGeometry args={[0.15, 0.2, 1.8, 32]} />
                    <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
                </mesh>

                {/* Main Body - Gold */}
                <mesh position={[0.2, 0.4, 0]}>
                    <boxGeometry args={[1, 0.8, 0.4]} />
                    <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
                </mesh>

                {/* Cylinder (Ammo part) - Silver */}
                <mesh position={[0.2, 0.45, 0]} rotation={[0, 0, -Math.PI / 2]}>
                    <cylinderGeometry args={[0.35, 0.35, 0.7, 6]} />
                    <meshStandardMaterial color="#E5E7EB" metalness={1} roughness={0.05} />
                </mesh>

                {/* Grip/Handle - Leather Wood with Gears */}
                <group position={[-0.4, -0.3, 0]}>
                    <mesh rotation={[0.4, 0, 0]}>
                        <boxGeometry args={[0.5, 1.2, 0.3]} />
                        <meshStandardMaterial color="#8B4513" metalness={0.2} roughness={0.8} />
                    </mesh>
                    {/* Small Gear decoration */}
                    <mesh position={[0, 0, 0.16]} rotation={[0, 0, Math.PI / 4]}>
                        <torusGeometry args={[0.1, 0.05, 16, 6]} />
                        <meshStandardMaterial color="#FFD700" metalness={1} />
                    </mesh>
                </group>

                {/* Hammer - Silver */}
                <mesh position={[-0.4, 0.8, 0]} rotation={[0, 0, 0.5]}>
                    <boxGeometry args={[0.1, 0.3, 0.1]} />
                    <meshStandardMaterial color="#E5E7EB" metalness={1} />
                </mesh>

                {/* Trigger Guard - Gold */}
                <mesh position={[0.4, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <torusGeometry args={[0.2, 0.04, 16, 32, Math.PI]} />
                    <meshStandardMaterial color="#FFD700" metalness={1} />
                </mesh>
            </group>

            {/* Laser/Bullet FX when shooting */}
            {shooting && (
                <group position={[0, 0.3, -0.5]}>
                    <mesh position={[0, 0, -5]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.02, 0.02, 10]} />
                        <meshBasicMaterial color="#FFEB3B" />
                    </mesh>
                    <pointLight intensity={50} color="#FFEB3B" distance={10} />
                </group>
            )}
        </group>
    )
}

const Basketball = ({ isShooting }) => {
    const mesh = useRef();
    const startPos = [7, -1, 3];
    const hoopPos = [-5, -0.45, -4]; // Adjusted Y for lower hoop position

    useFrame((state) => {
        if (!mesh.current) return;

        if (isShooting) {
            const duration = 2.5;
            const t = (state.clock.elapsedTime % duration) / duration;

            if (t < 0.6) {
                // Phase 1: The Arc to the Hoop
                const arcT = t / 0.6;
                const x = THREE.MathUtils.lerp(startPos[0], hoopPos[0], arcT);
                const y = startPos[1] + (hoopPos[1] - startPos[1]) * arcT + Math.sin(arcT * Math.PI) * 6;
                const z = THREE.MathUtils.lerp(startPos[2], hoopPos[2], arcT);
                mesh.current.position.set(x, y, z);
            } else {
                // Phase 2: Falling through and down
                const fallT = (t - 0.6) / 0.4;
                const gravity = 15;
                const x = hoopPos[0];
                const z = hoopPos[2];
                const y = hoopPos[1] - (0.5 * gravity * fallT * fallT);
                mesh.current.position.set(x, y, z);
            }

            mesh.current.rotation.x += 0.15;
            mesh.current.rotation.y += 0.1;
        } else {
            mesh.current.position.set(...startPos);
        }
    });

    return (
        <group ref={mesh}>
            <mesh castShadow>
                <sphereGeometry args={[0.45, 16, 16]} />
                <meshStandardMaterial
                    color="#FF7A18"
                    roughness={0.6}
                    metalness={0.1}
                    emissive="#FF7A18"
                    emissiveIntensity={0.3}
                />
            </mesh>
            {/* Real Basketball Lines */}
            {[0, Math.PI / 2].map((rot, i) => (
                <mesh key={i} rotation={[rot, 0, 0]}>
                    <torusGeometry args={[0.452, 0.012, 16, 64]} />
                    <meshBasicMaterial color="#111" />
                </mesh>
            ))}
        </group>
    );
};

const Hoop = () => {
    return (
        <group position={[-5, -1.2, -4]}>
            {/* The Main Support Pole */}
            <mesh position={[-0.8, -4, -1]}>
                <cylinderGeometry args={[0.15, 0.15, 12]} />
                <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* The Neck/Arm */}
            <mesh position={[-0.4, 1.5, -0.75]} rotation={[-Math.PI / 6, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 1]} />
                <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Backboard Assembly */}
            <group position={[0, 1.5, -0.2]}>
                {/* Glass Backboard */}
                <mesh>
                    <boxGeometry args={[3.4, 2.4, 0.12]} />
                    <meshPhysicalMaterial
                        transparent
                        opacity={0.4}
                        roughness={0}
                        metalness={0}
                        transmission={0.9}
                        thickness={0.5}
                        color="white"
                    />
                </mesh>
                {/* White Outer Frame */}
                <mesh>
                    <boxGeometry args={[3.45, 2.45, 0.05]} />
                    <meshBasicMaterial color="white" wireframe />
                </mesh>
                {/* Orange Inner Shot Box */}
                <mesh position={[0, -0.4, 0.07]}>
                    <boxGeometry args={[1.0, 0.75, 0.01]} />
                    <meshBasicMaterial color="#FF3D3D" wireframe />
                </mesh>
            </group>

            {/* Rim System */}
            <group position={[0, 0.75, 0.5]}>
                {/* Orange Rim */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.62, 0.05, 16, 100]} />
                    <meshStandardMaterial color="#FF3D3D" emissive="#FF3D3D" emissiveIntensity={3} />
                </mesh>
                {/* Net - Tapered mesh */}
                <mesh position={[0, -0.5, 0]} rotation={[0, 0, 0]}>
                    <cylinderGeometry args={[0.62, 0.4, 1.1]} />
                    <meshBasicMaterial color="white" wireframe transparent opacity={0.3} />
                </mesh>
            </group>
        </group>
    );
};

const ShootingGame = () => {
    const [balloons, setBalloons] = useState([])
    const [activeTargetIndex, setActiveTargetIndex] = useState(-1)
    const [isShooting, setIsShooting] = useState(false)
    const [isHooping, setIsHooping] = useState(false)

    const initGame = () => {
        setBalloons([
            { id: Date.now() + 1, pos: [-4, 1.5, -2], color: '#FF7A18', popped: false },
            { id: Date.now() + 2, pos: [4, 0.5, -3], color: '#5B8CFF', popped: false },
            { id: Date.now() + 3, pos: [-2, 2.8, -5], color: '#FF3D3D', popped: false },
        ])
        setActiveTargetIndex(0)
    }

    useEffect(() => {
        const timer = setTimeout(initGame, 1500)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (activeTargetIndex >= 0 && activeTargetIndex < balloons.length) {
            const shootDelay = setTimeout(() => {
                setIsShooting(true)
                const popDelay = setTimeout(() => {
                    setBalloons(prev => prev.map((b, i) => i === activeTargetIndex ? { ...b, popped: true } : b))
                    setIsShooting(false)
                    setActiveTargetIndex(prev => prev + 1)
                }, 100)
                return () => clearTimeout(popDelay)
            }, 600)
            return () => clearTimeout(shootDelay)
        } else if (activeTargetIndex === balloons.length && balloons.length > 0) {
            // After balloons, start the basketball sequence
            setIsHooping(true)
            const hoopTimer = setTimeout(() => {
                setIsHooping(false)
                setActiveTargetIndex(-1)
                setBalloons([])
                const restartTimer = setTimeout(initGame, 1000)
                return () => clearTimeout(restartTimer)
            }, 2500)
            return () => clearTimeout(hoopTimer)
        }
    }, [activeTargetIndex, balloons.length])

    return (
        <group>
            {balloons.map((b, i) => (
                <Balloon key={b.id} position={b.pos} color={b.color} popped={b.popped} />
            ))}
            {activeTargetIndex >= 0 && activeTargetIndex < balloons.length && (
                <Gun targetPos={balloons[activeTargetIndex].pos} shooting={isShooting} />
            )}

            <Hoop />
            <Basketball isShooting={isHooping} />
        </group>
    )
}

const Sculpture = () => {
    const meshRef = useRef()

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15
        }
    })

    return (
        <group position={[0, 0, -5]}>
            <PresentationControls
                global
                config={{ mass: 4, tension: 300 }}
                snap={{ mass: 6, tension: 1200 }}
                rotation={[0, 0.4, 0]}
                polar={[-Math.PI / 6, Math.PI / 6]}
                azimuth={[-Math.PI / 1.2, Math.PI / 1.2]}
            >
                <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
                    {/* --- Layer 1: Cinematic Fluid Blobs (The "Neural Nebula") --- */}
                    <group>
                        {/* Primary Brand Orange Blob */}
                        <mesh position={[-4, 2, -4]} scale={2.5}>
                            <sphereGeometry args={[1, 32, 32]} />
                            <MeshDistortMaterial
                                color="#FF7A18"
                                speed={2}
                                distort={0.4}
                                radius={1}
                                metalness={0.2}
                                roughness={0.4}
                                emissive="#FF3D00"
                                emissiveIntensity={0.2}
                                transparent
                                opacity={0.6}
                            />
                        </mesh>

                        {/* Secondary Electric Purple/Indigo Blob */}
                        <mesh position={[4, -2, -6]} scale={3}>
                            <sphereGeometry args={[1, 32, 32]} />
                            <MeshDistortMaterial
                                color="#6366F1"
                                speed={1.5}
                                distort={0.5}
                                radius={1}
                                emissive="#4338CA"
                                emissiveIntensity={0.3}
                                transparent
                                opacity={0.5}
                            />
                        </mesh>

                        {/* Highlight Cyan/Neon Blue Blob */}
                        <mesh position={[0, 4, -8]} scale={4}>
                            <sphereGeometry args={[1, 32, 32]} />
                            <MeshDistortMaterial
                                color="#0EA5E9"
                                speed={1}
                                distort={0.6}
                                radius={1}
                                emissive="#0284C7"
                                emissiveIntensity={0.1}
                                transparent
                                opacity={0.4}
                            />
                        </mesh>
                    </group>

                    {/* --- Layer 2: Floating Glassmorphism Geometric Elements --- */}
                    <group>
                        <mesh position={[2, 1, 2]} rotation={[Math.PI / 4, Math.PI / 4, 0]} scale={0.8}>
                            <torusGeometry args={[1.5, 0.05, 8, 48]} />
                            <meshPhysicalMaterial
                                transmission={1}
                                thickness={0.5}
                                roughness={0.05}
                                ior={1.5}
                                color="white"
                                transparent
                                opacity={0.3}
                            />
                        </mesh>
                        <mesh position={[-3, -3, 0]} rotation={[-Math.PI / 4, 0, Math.PI / 6]} scale={0.6}>
                            <torusGeometry args={[2, 0.04, 8, 48]} />
                            <meshPhysicalMaterial
                                transmission={1}
                                thickness={0.2}
                                roughness={0}
                                ior={1.2}
                                color="#FFFFFF"
                                transparent
                                opacity={0.2}
                            />
                        </mesh>
                    </group>

                    {/* --- Layer 3: Dynamic Orbital Light Nodes --- */}
                    {[
                        { color: "#FF7A18", pos: [8, 5, 2], intensity: 20 },
                        { color: "#6366F1", pos: [-8, -5, 2], intensity: 15 },
                        { color: "#FFFFFF", pos: [0, 10, -5], intensity: 10 }
                    ].map((light, i) => (
                        <pointLight
                            key={i}
                            position={light.pos}
                            intensity={light.intensity}
                            color={light.color}
                        />
                    ))}

                    {/* Global Volumetric Highlight */}
                    <spotLight
                        position={[0, 20, 10]}
                        angle={0.5}
                        penumbra={1}
                        intensity={40}
                        color="#FBBF24"
                    />

                </Float>
                <ContactShadows resolution={1024} scale={40} blur={3} opacity={0.3} far={15} color="#000000" />
            </PresentationControls>
        </group>
    )
}

import { useMotionValue, useSpring } from 'framer-motion';
import useStore from '../store/useStore';

const CompactRewards = () => {
    const { user } = useStore();
    const points = user?.points || 0;
    const morePoints = Math.max(0, 500 - points);

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-6 md:right-12 top-24 md:top-36 z-50 flex flex-col items-end pointer-events-auto"
        >
            <div className="flex flex-col items-end w-52 md:w-64 space-y-8">
                <div className="flex flex-col items-end">
                    <p className="text-[10px] font-black text-[#FF7A00] tracking-[0.4em] uppercase opacity-70 mb-2">YOUR POINTS</p>
                    <div className="flex items-baseline gap-3">
                        <span className="text-7xl font-black text-[#FF7A00] leading-none drop-shadow-[0_0_20px_rgba(255,122,0,0.4)]">{points}</span>
                        <span className="text-xl font-black text-slate-700 uppercase tracking-widest transform opacity-30">POINTS</span>
                    </div>
                </div>

                <div className="flex items-center gap-5 pr-2">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#FF7A00] shrink-0 drop-shadow-[0_0_15px_rgba(255,122,0,0.3)]">
                        <Zap size={28} fill="currentColor" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-white uppercase leading-tight">
                            GET <span className="text-[#FF7A00]">500 POINTS</span> FOR A <br />
                            <span className="text-[#6C5CE7]">FREE PASS</span>
                        </p>
                        <p className="text-[8px] font-black text-slate-700 tracking-widest uppercase opacity-40 ">
                            {morePoints} MORE POINTS TO GO
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Hero = () => {
    const containerRef = useRef(null)
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    
    // Smooth the mouse motion
    const springConfig = { damping: 25, stiffness: 150 };
    const smoothedMouseX = useSpring(mouseX, springConfig);
    const smoothedMouseY = useSpring(mouseY, springConfig);

    const isInView = useInView(containerRef, { margin: "200px" })
    const { scrollY } = useScroll()
    
    const y1 = useTransform(scrollY, [0, 800], [0, 300])
    const y2 = useTransform(scrollY, [0, 800], [0, -150])
    const opacity = useTransform(scrollY, [0, 600], [1, 0])
    const scale = useTransform(scrollY, [0, 600], [1, 0.95])
    const blur = useTransform(scrollY, [0, 400], ["blur(0px)", "blur(10px)"])

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e
        const { innerWidth, innerHeight } = window
        const x = (clientX / innerWidth - 0.5) * 15
        const y = (clientY / innerHeight - 0.5) * 15
        mouseX.set(x)
        mouseY.set(y)
    }

    return (
        <section 
            ref={containerRef} 
            onMouseMove={handleMouseMove}
            className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-[#02040a] pt-[120px] md:pt-[180px]"
        >
            {/* Layer 1: Advanced Background System */}
            <BackgroundSystem mouseX={smoothedMouseX} mouseY={smoothedMouseY} />

            {/* Layer 2: Floating Midground Elements */}
            <FloatingShapes mouseX={smoothedMouseX} mouseY={smoothedMouseY} />

            {/* Layer 2.5: 3D Scene Assembly */}
            <motion.div 
                style={{ y: y2, filter: blur }}
                className="absolute inset-0 z-10 mask-bottom opacity-50 md:opacity-80 top-20 md:top-36 pointer-events-none"
            >
                {isInView && (
                    <Canvas
                        dpr={[1, 1.5]}
                        performance={{ min: 0.5 }}
                        camera={{
                            position: [0, 0, typeof window !== 'undefined' && window.innerWidth < 768 ? 16 : 10],
                            fov: typeof window !== 'undefined' && window.innerWidth < 768 ? 50 : 35
                        }}
                        gl={{ 
                            powerPreference: "high-performance", 
                            antialias: false,
                            depth: true,
                            stencil: false,
                            alpha: true
                        }}
                    >
                        <ambientLight intensity={0.5} />
                        <spotLight position={[15, 20, 10]} angle={0.2} penumbra={1} intensity={30} color="#6C5CE7" castShadow />
                        <pointLight position={[-15, -10, -10]} intensity={20} color="#FF7A00" />
                        
                        <group 
                            scale={typeof window !== 'undefined' && window.innerWidth < 768 ? 0.75 : 1.35}
                        >
                            <Sculpture />
                            <ShootingGame />
                        </group>

                        <Environment preset="night" />
                    </Canvas>
                )}
            </motion.div>

            {/* Layer 3: Sharp High-Fidelity Foreground Content */}
            <div className="container relative z-30 text-center px-6">
                <motion.div
                    style={{ y: y1, opacity, scale }}
                    className="flex flex-col items-center relative"
                >
                    {/* Inner Text Glow Focal Point */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-[#6C5CE7]/5 rounded-full blur-[120px] pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-center relative z-10"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, delay: 0.4 }}
                            className="flex items-center gap-4 mb-10 px-6 py-2 bg-white/[0.03] backdrop-blur-3xl rounded-full border border-white/5 shadow-2xl"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7] animate-pulse shadow-[0_0_10px_#6C5CE7]" />
                            <span className="text-[9px] md:text-[11px] font-black uppercase text-slate-400 antialiased tracking-[0.5em] ">
                                ELURU'S PREMIER ENTERTAINMENT HUB
                            </span>
                        </motion.div>

                        <h1 className="text-4xl xs:text-5xl md:text-[5.5rem] lg:text-[6.8rem] font-black mb-12 leading-none tracking-[-0.04em] text-white text-center antialiased relative group">
                            {/* Layered Text Shadows for Depth */}
                            <span className="relative z-10 block filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                                EAT. ENJOY.<br />
                                <span className="premium-text-gradient block mt-2 opacity-95 group-hover:opacity-100 transition-opacity duration-1000">
                                    ENTERTAIN. ELURU.
                                </span>
                            </span>
                            
                            {/* Ambient Heading Glow */}
                            <div className="absolute inset-0 blur-[60px] bg-[#6C5CE7]/10 -z-10 rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                        </h1>

                        <div className="relative group/cta mt-6">
                            {/* Advanced Button Glow System */}
                            <div className="absolute -inset-2 bg-gradient-to-r from-[#6C5CE7] via-[#4834D4] to-[#0EA5E9] rounded-[2rem] blur-2xl opacity-0 group-hover/cta:opacity-40 transition-all duration-1000 group-hover/cta:duration-500 animate-pulse" />
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#6C5CE7] to-[#4834D4] rounded-[2rem] blur-xl opacity-20 group-hover/cta:opacity-50 transition-all duration-700" />
                            
                            <motion.button
                                onClick={() => document.getElementById('rides')?.scrollIntoView({ behavior: 'smooth' })}
                                className="relative bg-[#02040a]/80 backdrop-blur-3xl px-16 py-8 rounded-[1.8rem] border border-white/10 group-hover/cta:border-[#6C5CE7]/40 transition-all duration-700 overflow-hidden shadow-4xl group/btn"
                                whileHover={{ scale: 1.02, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Inner Glass Reflection */}
                                <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover/btn:left-[150%] transition-all duration-[1.5s] ease-in-out" />
                                
                                <span className="relative z-10 flex items-center gap-6 text-sm font-black uppercase tracking-[0.4em] text-white ">
                                    BOOK YOUR RIDE 
                                    <motion.div
                                        animate={{ y: [0, 5, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <ArrowDown size={22} className="text-[#6C5CE7] group-hover/btn:text-white transition-colors" />
                                    </motion.div>
                                </span>
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Premium Scroll Indicator */}
            <motion.div
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-40 cursor-pointer hidden md:flex group/scroll"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
            >
                <span className="text-[10px] font-black text-slate-600 tracking-[0.6em] uppercase opacity-40 group-hover/scroll:opacity-100 group-hover/scroll:text-[#6C5CE7] transition-all ">SCROLL</span>
                <div className="w-[2px] h-16 bg-white/[0.03] relative rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#6C5CE7] to-transparent opacity-20" />
                    <motion.div 
                        className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white to-[#6C5CE7] rounded-full shadow-[0_0_15px_rgba(108,92,231,0.5)]"
                        animate={{ y: ["0%", "200%", "0%"] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </motion.div>

            {/* Rewards Layer - External to other containers for perfect visibility */}
            <CompactRewards />

            <style dangerouslySetInnerHTML={{
                __html: `
                .premium-text-gradient {
                    background: linear-gradient(180deg, 
                        rgba(255,255,255,1) 0%, 
                        rgba(255,180,100,1) 30%, 
                        rgba(255,122,0,1) 60%, 
                        rgba(108,92,231,1) 100%
                    );
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    filter: drop-shadow(0 0 30px rgba(108,92,231,0.2));
                }
                .mask-bottom {
                    mask-image: linear-gradient(to bottom, black 50%, transparent 95%);
                    -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 95%);
                }
                .shadow-4xl {
                    box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8), 0 20px 50px -10px rgba(108, 92, 231, 0.2);
                }
            `}} />
        </section >
    )
}

export default Hero

