import { motion as m } from 'motion/react'

export default function SortMode({ sortMode }: { sortMode: 'asc' | 'desc' }) {
  return (
    <m.svg
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      animate={{
        transform: sortMode === 'asc' ? 'scale(-1, -1)' : 'scale(-1, 1)',
        transition: {
          duration: 0.2,
          ease: 'easeInOut',
        },
      }}
      className="size-3/4 dark:fill-gray-300"
    >
      <path d="M7.33199 7.68464C6.94146 8.07517 6.3083 8.07517 5.91777 7.68464C5.52725 7.29412 5.52725 6.66095 5.91777 6.27043L10.5834 1.60483C11.3644 0.823781 12.6308 0.82378 13.4118 1.60483L18.0802 6.27327C18.4707 6.66379 18.4707 7.29696 18.0802 7.68748C17.6897 8.078 17.0565 8.078 16.666 7.68748L13 4.02145V21.9999C13 22.5522 12.5523 22.9999 12 22.9999C11.4477 22.9999 11 22.5522 11 21.9999V4.01666L7.33199 7.68464Z" />
    </m.svg>
  )
}
