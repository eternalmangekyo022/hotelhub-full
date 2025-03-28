import { useEffect, useRef } from 'react'

interface IProps {
  value: string
  setValue: (val: string) => void
  uid: string
  children: React.ReactNode
  minLength?: number
  maxLength?: number
  error?: string
}

export default function LoginFormInput({
  uid,
  value,
  setValue,
  children,
  maxLength,
  error,
}: IProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function onLabelClick() {
    if (inputRef.current) inputRef.current.focus()
  }

  function shouldCollapse(): boolean {
    return uid === 'login-password' ? value === '' : value.trim() === ''
  }
  useEffect(() => {
    console.log(error)
  }, [error])

  return (
    <div
      className={`input-wrapper ${shouldCollapse() ? '' : 'filled'}`}
      style={{
        border: error ? '1px solid red' : '1px solid #e5e7eb',
      }}
    >
      <label onClick={onLabelClick} htmlFor={uid}>
        {children}
      </label>
      <input
        {...{ maxLength }}
        autoComplete="off"
        onKeyDown={(e) => e.key === 'Escape' && inputRef.current?.blur()}
        type={uid === 'login-password' ? 'password' : 'text'}
        name={uid}
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="text-black"
      />
    </div>
  )
}
