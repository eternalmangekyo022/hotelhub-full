import { useRef } from "react";

interface IProps {
  value: string;
  setValue: (val: string) => void;
  uid: string;
  children: React.ReactNode;
}

export default function LoginFormInput({
  uid,
  value,
  setValue,
  children,
}: IProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function onLabelClick() {
    if (inputRef.current) inputRef.current.focus();
  }

  function shouldCollapse(): boolean {
    return uid === "login-password" ? value === "" : value.trim() === "";
  }

  return (
    <div className={`input-wrapper${shouldCollapse() ? "" : " filled"}`}>
      <label onClick={onLabelClick} htmlFor={uid}>
        {children}
      </label>
      <input
        autoComplete="off"
        onKeyDown={(e) => e.key === "Escape" && inputRef.current?.blur()}
        type={uid === "login-password" ? "password" : "text"}
        name={uid}
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
