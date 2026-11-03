import { useContext } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import {
    LayoutDashboard,
    KanbanSquare,
    Building2,
    Users,
    Target,
    Activity,
    FolderOpen,
    FileText,
    Wallet,
    LayoutGrid,
    LogOut
} from "lucide-react";

import { AuthContext } from "../../app/context/AuthContext";

type ItemProps = {
    to: string;
    label: string;
    icon: React.ReactNode;
    end?: boolean;
};

function Item({ to, label, icon, end }: ItemProps) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                [
                    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[0.86rem] font-medium transition-colors",
                    isActive
                        ? "bg-surface-2 text-ink"
                        : "text-muted hover:bg-surface-2/60 hover:text-ink"
                ].join(" ")
            }
        >
            {({ isActive }) => (
                <>
                    <span className={["flex-none", isActive ? "text-accent" : "text-faint"].join(" ")}>{icon}</span>
                    <span className="truncate">{label}</span>
                </>
            )}
        </NavLink>
    );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="px-2.5 pt-5 pb-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.08em] text-faint">
            {children}
        </p>
    );
}

export default function Sidebar() {
    const navigate = useNavigate();
    const { companyId } = useParams();

    const auth = useContext(AuthContext);
    const iconSize = 17;

    const handleLogout = () => {
        auth?.logout();
        navigate("/");
    };

    return (
        <aside className="flex h-screen w-[244px] flex-none flex-col border-r border-line bg-surface">
            {/* marca */}
            <div className="flex items-center gap-2.5 px-3.5 pt-4 pb-3">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-accent">
                    <svg width="17" height="17" viewBox="0 0 26 26" fill="none">
                        <path d="M9 23 L10.5 9 H15.5 L17 23 Z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
                        <path d="M8.5 15 H17.5" stroke="#fff" strokeWidth="1.5" />
                        <circle cx="13" cy="6.2" r="2.5" fill="#fff" />
                    </svg>
                </span>
                <div className="min-w-0">
                    <p className="truncate text-[0.95rem] font-semibold leading-tight">Atalaya</p>
                    <p className="truncate text-[0.72rem] text-muted leading-tight">CRM</p>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-2 pb-2 pt-2 hide-scrollbar">
                <Item to="/inicio" label="Inicio" icon={<LayoutDashboard size={iconSize} />} />
                <Item to="/pipeline" label="Pipeline" icon={<KanbanSquare size={iconSize} />} />

                <SectionLabel>Gestión</SectionLabel>
                <Item to="/companies" label="Empresas" icon={<Building2 size={iconSize} />} />
                <Item to="/contacts" label="Contactos" icon={<Users size={iconSize} />} />
                <Item to="/finances" label="Finanzas" icon={<Wallet size={iconSize} />} />
                <Item to="/templates" label="Plantillas" icon={<LayoutGrid size={iconSize} />} />

                {companyId && (
                    <>
                        <SectionLabel>Cliente</SectionLabel>
                        <Item to={`/companies/${companyId}`} label="Resumen" icon={<LayoutDashboard size={iconSize} />} end />
                        <Item to={`/companies/${companyId}/contacts`} label="Contactos" icon={<Users size={iconSize} />} />
                        <Item to={`/companies/${companyId}/opportunities`} label="Oportunidades" icon={<Target size={iconSize} />} />
                        <Item to={`/companies/${companyId}/activities`} label="Actividades" icon={<Activity size={iconSize} />} />
                        <Item to={`/companies/${companyId}/projects`} label="Proyectos" icon={<FolderOpen size={iconSize} />} />
                        <Item to={`/companies/${companyId}/documents`} label="Documentos" icon={<FileText size={iconSize} />} />
                    </>
                )}
            </nav>

            {/* usuario */}
            <div className="border-t border-line p-2.5">
                <div className="flex items-center gap-2.5 rounded-md px-1.5 py-1">
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-surface-2 text-[0.72rem] font-semibold text-ink">
                        {(auth?.role ?? "A").slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[0.8rem] font-medium capitalize">{auth?.role ?? "Administrador"}</p>
                        <p className="truncate text-[0.7rem] text-faint">Sesión activa</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        aria-label="Cerrar sesión"
                        className="flex-none rounded-md p-1.5 text-faint transition-colors hover:bg-surface-2 hover:text-danger"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
