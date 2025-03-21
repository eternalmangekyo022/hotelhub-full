import { motion as m } from "motion/react"

export default function AngleSvg({ active = false, onClick }: { active?: boolean, onClick?: () => void }) {
    return (
        <m.svg
            onClick={onClick}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-7 h-7 cursor-pointer"
            initial={{
                rotate: 180
            }}
            animate={{
                rotate: active ? 180 : 0,
                transition: {
                    type: "tween",
                    duration: 0.3,
                    ease: "easeInOut"
                }
            }}
        >
            <path d="M18 15L12 9L6 15"></path>
        </m.svg>
    )
}