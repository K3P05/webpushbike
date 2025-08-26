import { NavLink } from "react-router-dom";
import { BookUser } from "lucide-react";

const dataMaster = [
  { label: "Batch 1", icon: BookUser, path: "/result" },
];

function renderMenu(menu: typeof dataMaster) {
  return menu.map(({ label, icon: Icon, path }) => (
    <NavLink
      to={path}
      key={label}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded transition-all ${
          isActive
            ? "bg-red-400 text-black font-semibold shadow-md"
            : "hover:bg-blue-100 text-blue-700"
        }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  ));
}

export default function Sidebar() {
  return (
    <aside className="w-35 bg-white text-gray-700 h-screen flex flex-col justify-between p-4">
      <div>
        <h1 className="text-xl font-bold mb-6">PUSHBIKECKG</h1>

        <div>
          <p className="text-sm uppercase text-blue-400 mb-2">Data Live</p>
          <nav className="space-y-2">{renderMenu(dataMaster)}</nav>
        </div>
      </div>

      <button className="bg-red-600 w-full py-2 mt-8 rounded text-white">
        Keluar
      </button>
    </aside>
  );
}
