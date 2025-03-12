import { Link } from "@tanstack/react-router";

interface Props {
  children: React.ReactNode;
  to: string;
  onClick: () => void;
  src: string;
  onMouseOver: () => void;
}

export default function Navlink({
  children,
  to,
  onClick,
  src,
  onMouseOver,
}: Props) {
  return (
    <li
      onClick={onClick}
      className="w-full h-full flex justify-center items-center transition-[.2s] z-10 "
    >
      <Link
        className="tooltip w-full h-full flex justify-center items-center not-[.active]:hover:-translate-y-0.5"
        data-tip={children}
        to={to}
        onMouseOver={onMouseOver}
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
