import { Link } from "@tanstack/react-router";

interface Props {
  children: React.ReactNode;
  to: string;
  onClick: () => void;
  src: string;
}

export default function Navlink({ children, to, onClick, src }: Props) {
  return (
    <li
      onClick={onClick}
      className="w-full flex justify-center items-center transition-[.2s] z-10 hover:border-0"
    >
      <Link
        className="tooltip w-full h-full flex justify-center items-center shadow-none not-[.active]:hover:opacity-[.4]"
        data-tip={children}
        to={to}
      >
        {to === "/hotels" ? (
          <img src={src} alt={children?.toString()} className="w-6" />
        ) : (
          <img src={src} alt={children?.toString()} className="w-6" />
        )}
      </Link>
    </li>
  );
}
