/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";

export default function Logo({
  logo,
  className,
  text,
}: {
  logo?: any;
  className?: string;
  text: string;
}) {

  return (
    // <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
    <Link to="/" className="flex items-center gap-2">
      {logo && <img src={logo} alt="svg" className={`h-8 w-8 ${className}`} />}
      {text && <p className="font-bold">{text}</p>}
    </Link>
  );
}
