'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

type AnimateOnScrollProps = {
	children: ReactNode
	type?: 'fade' | 'fade-up' | 'fade-down' | 'slide-left' | 'slide-right' | 'zoom'
	duration?: number
	delay?: number
	once?: boolean
	amount?: number // 0..1 of element visibility before triggering
	className?: string
}

const variantsByType: Record<NonNullable<AnimateOnScrollProps['type']>, Variants> = {
	fade: {
		hidden: { opacity: 0 },
		show: { opacity: 1 },
	},
	'fade-up': {
		hidden: { opacity: 0, y: 24 },
		show: { opacity: 1, y: 0 },
	},
	'fade-down': {
		hidden: { opacity: 0, y: -24 },
		show: { opacity: 1, y: 0 },
	},
	'slide-left': {
		hidden: { opacity: 0, x: 40 },
		show: { opacity: 1, x: 0 },
	},
	'slide-right': {
		hidden: { opacity: 0, x: -40 },
		show: { opacity: 1, x: 0 },
	},
	zoom: {
		hidden: { opacity: 0, scale: 0.95 },
		show: { opacity: 1, scale: 1 },
	},
}

const AnimateOnScroll = ({
	children,
	type = 'fade-up',
	duration = 0.8,
	delay = 0,
	once = true,
	amount = 0.2,
	className,
}: AnimateOnScrollProps) => {
	const variants = variantsByType[type]
	return (
		<motion.div
			className={className}
			initial="hidden"
			whileInView="show"
			viewport={{ once, amount }}
			variants={variants}
			transition={{ duration, delay, ease: 'easeOut' }}
		>
			{children}
		</motion.div>
	)
}

export default AnimateOnScroll
