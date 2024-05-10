import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { IconSearch } from "../../../awesome";

const showClass = "!bg-black";

export default function NavBar() {
  const navbarDiv = useRef<HTMLDivElement>();

  useEffect(() => {
    let navbarShow = false;
    const scrollChangeHander = () => {
      const isShow = window.scrollY > 100;
      if (navbarShow === isShow) return;
      navbarShow = isShow;
      const { classList } = navbarDiv.current;
      if (isShow) classList.add(showClass);
      else classList.remove(showClass);
    };

    window.addEventListener("scroll", scrollChangeHander);
    return () => window.removeEventListener("scroll", scrollChangeHander);
  }, []);

  return (
    <div
      ref={navbarDiv}
      className="bg-transparent flex items-center fixed top-0 w-full duration-300 px-2 py-1 text-2xl z-50"
    >
      <h2 className="text-danger normal-case font-bold">
        <Link to={"/"}>Movie App</Link>
      </h2>
      <Link to={"/search"} className="ml-auto text-white">
        <IconSearch />
      </Link>
    </div>
  );
}
