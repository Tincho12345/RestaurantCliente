import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const actualLocation = useLocation().pathname;
  return (
    <div className="md:w-2/5 xl:w-1/5 bg-gray-800">
      <div className="p-6">
        <p className="uppercase text-yellow-50 text-2xl tracking-wide text-center font-bold">
          Restaurant App
        </p>
        <p className="mt-3 text-gray-400 p-1">Opciones de Administrador</p>
        <nav className="mt-5">
          <NavLink
            className={`${
              actualLocation === "/" ? "text-yellow-500" : "text-gray-400"
            } p-1 block hover:bg-red-600 hover:text-gray-900`}
            to="/"
            end={true}
          >
            Ordenes
          </NavLink>
          <NavLink
            className={`${
              actualLocation === "/menu" ? "text-yellow-500" : "text-gray-400"
            } p-1 block hover:bg-red-600 hover:text-gray-900`}
            to="/menu"
            end={true}
          >
            Menu
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
