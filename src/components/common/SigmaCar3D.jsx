import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';

const SigmaCar3D = React.forwardRef(({ ...props }, ref) => {
    const wheels = useRef([]);

    // Style constants
    const bodyColor = "#2D3436";
    const accentColor = "#FF7A18";
    const doorColor = "#464646";

    useFrame((state) => {
        // Wheels rotation
        wheels.current.forEach(wheel => {
            if (wheel) wheel.rotation.x += 0.2;
        });
    });

    return (
        <group ref={ref} {...props} dispose={null}>
            {/* Main Body */}
            <mesh position={[0, 0.4, 0]}>
                <boxGeometry args={[1.2, 0.6, 2.5]} />
                <meshStandardMaterial color={bodyColor} metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Cockpit / Roof */}
            <mesh position={[0, 0.85, 0]}>
                <boxGeometry args={[1, 0.4, 1.2]} />
                <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} transparent opacity={0.6} />
            </mesh>

            {/* Hood / Nose */}
            <mesh position={[0, 0.35, 1.3]} rotation={[-0.2, 0, 0]}>
                <boxGeometry args={[1.2, 0.1, 0.4]} />
                <meshStandardMaterial color={bodyColor} metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Gull-wing Doors (Stylized) */}
            <group position={[0, 0.8, 0]}>
                {/* Left Door */}
                <mesh position={[-0.65, 0.1, 0]} rotation={[0, 0, 0.4]}>
                    <boxGeometry args={[0.1, 0.4, 1.2]} />
                    <meshStandardMaterial color={doorColor} metalness={1} roughness={0.1} />
                </mesh>
                {/* Right Door */}
                <mesh position={[0.65, 0.1, 0]} rotation={[0, 0, -0.4]}>
                    <boxGeometry args={[0.1, 0.4, 1.2]} />
                    <meshStandardMaterial color={doorColor} metalness={1} roughness={0.1} />
                </mesh>
            </group>

            {/* Rear Bumper Section */}
            <mesh position={[0, 0.4, -1.3]}>
                <boxGeometry args={[1.2, 0.6, 0.2]} />
                <meshStandardMaterial color="#111" />
            </mesh>

            {/* Wheels */}
            {[
                [-0.6, 0.2, 0.8],  // Front Left
                [0.6, 0.2, 0.8],   // Front Right
                [-0.6, 0.2, -0.8], // Back Left
                [0.6, 0.2, -0.8]   // Back Right
            ].map((pos, i) => (
                <mesh key={i} position={pos} rotation={[0, 0, Math.PI / 2]} ref={el => wheels.current[i] = el}>
                    <cylinderGeometry args={[0.3, 0.3, 0.2, 24]} />
                    <meshStandardMaterial color="#000" roughness={0.5} />
                    {/* Glowing Rim */}
                    <mesh scale={[1.05, 1, 1.05]}>
                        <cylinderGeometry args={[0.2, 0.2, 0.22, 16]} />
                        <meshBasicMaterial color={accentColor} wireframe />
                    </mesh>
                </mesh>
            ))}

            {/* Front Headlights */}
            <group position={[0, 0.4, 1.5]}>
                <mesh position={[-0.4, 0, 0]}>
                    <boxGeometry args={[0.3, 0.1, 0.05]} />
                    <meshStandardMaterial emissive="#fff" emissiveIntensity={5} color="#fff" />
                </mesh>
                <mesh position={[0.4, 0, 0]}>
                    <boxGeometry args={[0.3, 0.1, 0.05]} />
                    <meshStandardMaterial emissive="#fff" emissiveIntensity={5} color="#fff" />
                </mesh>
            </group>

            {/* Rear Taillights */}
            <mesh position={[0, 0.5, -1.41]} rotation={[0, 0, 0]}>
                <boxGeometry args={[1.1, 0.05, 0.05]} />
                <meshStandardMaterial emissive="#ff0000" emissiveIntensity={10} color="#ff0000" />
            </mesh>

            {/* Branding: SIGMA 87 */}
            <group position={[0, 1.1, 0]} rotation={[Math.PI / 2, 0, Math.PI]}>
                <Text
                    fontSize={0.2}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    SIGMA 87
                </Text>
            </group>

            <group position={[0, 0.45, 1.35]} rotation={[Math.PI / 2, 0, Math.PI]}>
                <Text
                    fontSize={0.15}
                    color={accentColor}
                    anchorX="center"
                    anchorY="middle"
                >
                    87
                </Text>
            </group>

            {/* Underglow */}
            <pointLight position={[0, -0.2, 0]} intensity={5} color={accentColor} distance={4} />
            <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[1.5, 3]} />
                <meshBasicMaterial color={accentColor} transparent opacity={0.1} />
            </mesh>
        </group>
    );
});

export default SigmaCar3D;

