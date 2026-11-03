import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import { TrendingUp, Target, PercentCircle, CalendarClock, ArrowUpRight } from "lucide-react";

import PageHeader from "../../components/ui/PageHeader";
import { Spinner, ErrorText } from "../../components/ui/States";
import { api } from "../../lib/api";
import type { Opportunity } from "../opportunities/types/opportunity.types";

interface ActivityLite {
    _id: string;
    type: string;
    title?: string;
    scheduledDate?: string;
    company?: { name: string } | string;
}

const money = (n: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n || 0);

const OPEN_STAGES = ["Descubrimiento", "Propuesta", "Negociacion", "Contrato"];
const STAGE_LABELS: Record<string, string> = {
    Descubrimiento: "Descubrimiento", Propuesta: "Propuesta", Negociacion: "Negociación",
    Contrato: "Contrato", Ganado: "Ganado", Perdido: "Perdido"
};
const companyName = (c: Opportunity["company"]) =>
    c && typeof c === "object" ? c.name : "—";

export default function DashboardPage() {
    const navigate = useNavigate();

    const [opps, setOpps] = useState<Opportunity[]>([]);
    const [acts, setActs] = useState<ActivityLite[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const [o, a] = await Promise.all([
                    api.get<{ opportunities: Opportunity[] }>("/opportunities"),
                    api.get<{ activities: ActivityLite[] }>("/activities?upcoming=1")
                ]);
                setOpps(o.opportunities);
                setActs(a.activities);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Error al cargar el panel");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const kpis = useMemo(() => {
        const open = opps.filter((o) => OPEN_STAGES.includes(o.stage));
        const pipelineOpen = open.reduce((s, o) => s + (o.estimatedAmount || 0), 0);
        const forecast = open.reduce((s, o) => s + (o.estimatedAmount || 0) * (o.probability || 0) / 100, 0);
        const won = opps.filter((o) => o.stage === "Ganado").length;
        const lost = opps.filter((o) => o.stage === "Perdido").length;
        const closeRate = won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0;

        const today = new Date().toDateString();
        const todayCount = acts.filter((a) => a.scheduledDate && new Date(a.scheduledDate).toDateString() === today).length;

        return { pipelineOpen, forecast, closeRate, todayCount, openCount: open.length };
    }, [opps, acts]);

    const byStage = useMemo(() => {
        const stages = [...OPEN_STAGES, "Ganado"];
        const max = Math.max(1, ...stages.map((st) => opps.filter((o) => o.stage === st).reduce((s, o) => s + (o.estimatedAmount || 0), 0)));
        return stages.map((st) => {
            const items = opps.filter((o) => o.stage === st);
            const total = items.reduce((s, o) => s + (o.estimatedAmount || 0), 0);
            return { stage: st, count: items.length, total, pct: Math.round((total / max) * 100) };
        });
    }, [opps]);

    const closing = useMemo(() =>
        opps.filter((o) => OPEN_STAGES.includes(o.stage) && o.estimatedCloseDate)
            .sort((a, b) => +new Date(a.estimatedCloseDate) - +new Date(b.estimatedCloseDate))
            .slice(0, 5), [opps]);

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <PageHeader title="Inicio" subtitle="Resumen comercial de Atalaya" />

            {loading && <Spinner label="Cargando panel..." />}
            {error && <ErrorText>{error}</ErrorText>}

            {!loading && !error && (
                <>
                    <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                        <Kpi icon={<TrendingUp size={16} />} label="Pipeline abierto" value={money(kpis.pipelineOpen)} hint={`${kpis.openCount} oportunidades`} />
                        <Kpi icon={<Target size={16} />} label="Forecast ponderado" value={money(kpis.forecast)} hint="valor × probabilidad" />
                        <Kpi icon={<PercentCircle size={16} />} label="Tasa de cierre" value={`${kpis.closeRate}%`} hint="ganadas / cerradas" />
                        <Kpi icon={<CalendarClock size={16} />} label="Actividades hoy" value={String(kpis.todayCount)} hint="agendadas" />
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
                        {/* pipeline por etapa */}
                        <div className="rounded-lg border border-line bg-surface p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-[0.95rem] font-semibold">Pipeline por etapa</h2>
                                <button onClick={() => navigate("/pipeline")} className="flex items-center gap-1 text-[0.8rem] text-accent hover:underline">
                                    Ver pipeline <ArrowUpRight size={14} />
                                </button>
                            </div>
                            <div className="flex flex-col gap-3.5">
                                {byStage.map((s) => (
                                    <div key={s.stage}>
                                        <div className="mb-1 flex items-center justify-between text-[0.82rem]">
                                            <span className="text-muted">{STAGE_LABELS[s.stage]} <span className="text-faint">· {s.count}</span></span>
                                            <span className="tnum font-medium">{money(s.total)}</span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                                            <div className={`h-full rounded-full ${s.stage === "Ganado" ? "bg-good" : "bg-accent"}`} style={{ width: `${s.pct}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* próximas actividades */}
                        <div className="rounded-lg border border-line bg-surface p-5">
                            <h2 className="mb-4 text-[0.95rem] font-semibold">Próximas actividades</h2>
                            {acts.length === 0 ? (
                                <p className="py-6 text-center text-[0.84rem] text-faint">Nada agendado</p>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {acts.slice(0, 6).map((a) => (
                                        <div key={a._id} className="flex items-center gap-3 border-b border-line pb-3 last:border-b-0 last:pb-0">
                                            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-surface-2 text-[0.68rem] font-semibold text-accent">
                                                {a.type.slice(0, 2).toUpperCase()}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-[0.84rem] font-medium">{a.title || a.type}</p>
                                                <p className="truncate text-[0.72rem] text-faint">
                                                    {typeof a.company === "object" ? a.company?.name : ""}
                                                </p>
                                            </div>
                                            <span className="flex-none text-[0.72rem] text-muted">
                                                {a.scheduledDate ? new Date(a.scheduledDate).toLocaleDateString("es-MX", { day: "numeric", month: "short" }) : ""}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* oportunidades por cerrar */}
                    <div className="mt-5 rounded-lg border border-line bg-surface p-5">
                        <h2 className="mb-3 text-[0.95rem] font-semibold">Por cerrar pronto</h2>
                        {closing.length === 0 ? (
                            <p className="py-6 text-center text-[0.84rem] text-faint">Sin fechas de cierre próximas</p>
                        ) : (
                            <div className="divide-y divide-line">
                                {closing.map((o) => (
                                    <div key={o._id} className="flex items-center justify-between py-2.5">
                                        <div className="min-w-0">
                                            <p className="truncate text-[0.86rem] font-medium">{o.title}</p>
                                            <p className="truncate text-[0.74rem] text-faint">{companyName(o.company)} · {STAGE_LABELS[o.stage]}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="tnum text-[0.86rem] font-medium">{money(o.estimatedAmount)}</p>
                                            <p className="text-[0.72rem] text-faint">{new Date(o.estimatedCloseDate).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </motion.div>
    );
}

function Kpi({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint: string }) {
    return (
        <div className="rounded-lg border border-line bg-surface p-4">
            <div className="flex items-center gap-2 text-faint">{icon}<span className="text-[0.76rem] text-muted">{label}</span></div>
            <p className="tnum mt-2 text-[1.5rem] font-semibold leading-none">{value}</p>
            <p className="mt-1.5 text-[0.72rem] text-faint">{hint}</p>
        </div>
    );
}
