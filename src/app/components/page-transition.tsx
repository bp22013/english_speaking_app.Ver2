'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                duration: 0.4,
                ease: 'easeInOut',
            }}
        >
            {children}
        </motion.div>
    );
}

export function StaggerContainer({ children }: PageTransitionProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.08,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

export function FadeInUp({ children, delay = 0 }: PageTransitionProps & { delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.6,
                delay,
                ease: 'easeOut',
            }}
        >
            {children}
        </motion.div>
    );
}

export function SlideIn({
    children,
    direction = 'left',
}: PageTransitionProps & { direction?: 'left' | 'right' }) {
    const x = direction === 'left' ? -20 : 20;

    return (
        <motion.div
            initial={{ opacity: 0, x }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
                duration: 0.5,
                ease: 'easeOut',
            }}
        >
            {children}
        </motion.div>
    );
}

export function ScaleIn({ children, delay = 0 }: PageTransitionProps & { delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.5,
                delay,
                ease: 'easeOut',
            }}
        >
            {children}
        </motion.div>
    );
}

export function FadeIn({ children, delay = 0 }: PageTransitionProps & { delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: 0.5,
                delay,
                ease: 'easeInOut',
            }}
        >
            {children}
        </motion.div>
    );
}

export function SoftFadeIn({ children, delay = 0 }: PageTransitionProps & { delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.8,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
        >
            {children}
        </motion.div>
    );
}
