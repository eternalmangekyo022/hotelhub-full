interface IWrapperProps {
  children: React.ReactNode
  reverse?: boolean
}

function Wrapper({ children, reverse }: IWrapperProps) {
  return reverse ? (
    <svg
      width="64px"
      height="64px"
      viewBox="0 0 24.00 24.00"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-7 -scale-100"
    >
      {children}
    </svg>
  ) : (
    <svg
      width="64px"
      height="64px"
      viewBox="0 0 24.00 24.00"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
    >
      {children}
    </svg>
  )
}

export default function LogoutSvg(
  { reverse, isDark }: { reverse?: boolean; isDark?: boolean } = {
    reverse: false,
    isDark: false,
  },
) {
  return (
    <Wrapper reverse={reverse}>
      <g
        id="SVGRepo_iconCarrier"
        className="dark:stroke-white"
        stroke={isDark ? '#fff' : '#000'}
      >
        <path
          d="M21 12L13 12"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 15L20.913 12.087V12.087C20.961 12.039 20.961 11.961 20.913 11.913V11.913L18 9"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 5V4.5V4.5C16 3.67157 15.3284 3 14.5 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H14.5C15.3284 21 16 20.3284 16 19.5V19.5V19"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </Wrapper>
  )
}
