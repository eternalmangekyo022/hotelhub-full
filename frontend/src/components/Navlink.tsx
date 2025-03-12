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
      className="w-full h-8 flex justify-center items-center"
    >
      <Link
        className="tooltip w-full h-full flex justify-center items-center"
        data-tip={children}
        to={to}
      >
        {to === "/hotels" ? (
          <img src={src} alt={children?.toString()} className="w-9" />
        ) : (
          <img src={src} alt={children?.toString()} className="w-6" />
        )}
      </Link>
    </li>
  );
}
