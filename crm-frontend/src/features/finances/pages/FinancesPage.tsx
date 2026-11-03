import { useState } from "react";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, Receipt, PiggyBank, Repeat, Target, CreditCard, Landmark } from "lucide-react";
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line
} from "recharts";

import PageHeader from "../../../components/ui/PageHeader";

const money = (n: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n || 0);

// NOTA: datos de ejemplo. Cada cifra sale de este objeto; cuando conectes
// la fuente real (facturas, gastos, banco) solo reemplazas aquí.
const F = {
    ingresos: 318000, ingresosPrev: 286000,
    egresos: 174000, egresosPrev: 169000,
    disponible: 412000,
    porCobrar: 196500, facturasPorCobrar: 7,
    porPagar: 83200, facturasPorPagar: 4,
    mrr: 145000, mrrPrev: 132000,
    ticket: 54000,
    forecast: 542500,
    metaAnual: 3000000, acumuladoAnual: 1985000
};

const utilidad = F.ingresos - F.egresos;
const margen = F.ingresos ? Math.round((utilidad / F.ingresos) * 100) : 0;
const pct = (now: number, prev: number) => (prev ? Math.round(((now - prev) / prev) * 100) : 0);

const serie = [
    { m: "May", ingresos: 240000, egresos: 158000 },
    { m: "Jun", ingresos: 262000, egresos: 161000 },
    { m: "Jul", ingresos: 255000, egresos: 170000 },
    { m: "Ago", ingresos: 286000, egresos: 169000 },
    { m: "Sep", ingresos: 301000, egresos: 172000 },
    { m: "Oct", ingresos: 318000, egresos: 174000 }
];
const acumulado = (() => {
    let acc = 0;
    return [
        { m: "May", v: 1498000 }, { m: "Jun", v: 1760000 }, { m: "Jul", v: 2015000 },
        { m: "Ago", v: 2301000 }, { m: "Sep", v: 2602000 }, { m: "Oct", v: 2920000 }
    ].map((d) => { acc = d.v; return { m: d.m, acumulado: acc, objetivo: F.metaAnual }; });
})();

const PERIODS = ["Este mes", "Trimestre", "Año"];

export default function FinancesPage() {
    const [period, setPeriod] = useState("Este mes");

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="pb-10">
            <PageHeader
                title="Finanzas"
                subtitle="Salud financiera del negocio"
                actions={
                    <div className="flex rounded-md border border-line bg-surface-2 p-0.5">
                        {PERIODS.map((p) => (
                            <button key={p} onClick={() => setPeriod(p)} className={`rounded px-2.5 py-1 text-[0.8rem] font-semibold ${period === p ? "bg-surface text-ink shadow" : "text-muted"}`}>{p}</button>
                        ))}
                    </div>
                }
            />

            {/* fila principal */}
            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Kpi icon={<TrendingUp size={16} />} label="Ingresos" value={money(F.ingresos)} delta={pct(F.ingresos, F.ingresosPrev)} />
                <Kpi icon={<Receipt size={16} />} label="Egresos" value={money(F.egresos)} delta={pct(F.egresos, F.egresosPrev)} invert />
                <Kpi icon={<PiggyBank size={16} />} label="Utilidad neta" value={money(utilidad)} hint={`Margen ${margen}%`} accent />
                <Kpi icon={<Wallet size={16} />} label="Flujo / disponible" value={money(F.disponible)} hint="En banco" />
            </div>

            {/* segunda fila */}
            <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Kpi icon={<Landmark size={16} />} label="Por cobrar" value={money(F.porCobrar)} hint={`${F.facturasPorCobrar} facturas`} />
                <Kpi icon={<CreditCard size={16} />} label="Por pagar" value={money(F.porPagar)} hint={`${F.facturasPorPagar} facturas`} />
                <Kpi icon={<Repeat size={16} />} label="Ingreso recurrente (MRR)" value={money(F.mrr)} delta={pct(F.mrr, F.mrrPrev)} />
                <Kpi icon={<Target size={16} />} label="Pipeline ponderado" value={money(F.forecast)} hint="Forecast del CRM" />
            </div>

            {/* meta anual */}
            <div className="mt-3 rounded-lg border border-line bg-surface p-5">
                <div className="mb-2 flex items-center justify-between">
                    <p className="text-[0.9rem] font-semibold">Meta anual</p>
                    <p className="tnum text-[0.84rem] text-muted">{money(F.acumuladoAnual)} <span className="text-faint">/ {money(F.metaAnual)}</span></p>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${Math.round((F.acumuladoAnual / F.metaAnual) * 100)}%` }} />
                </div>
                <p className="mt-2 text-[0.76rem] text-faint">Faltan {money(F.metaAnual - F.acumuladoAnual)} para la meta.</p>
            </div>

            {/* gráficas */}
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="rounded-lg border border-line bg-surface p-5">
                    <h2 className="mb-4 text-[0.95rem] font-semibold">Ingresos vs egresos</h2>
                    <div className="h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={serie} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                                <CartesianGrid vertical={false} stroke="#2a2f38" />
                                <XAxis dataKey="m" stroke="#636b78" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#636b78" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} width={38} />
                                <Tooltip contentStyle={tooltipStyle} formatter={(v) => money(Number(v))} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Bar dataKey="ingresos" name="Ingresos" fill="#5b74ff" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="egresos" name="Egresos" fill="#e5484d" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-lg border border-line bg-surface p-5">
                    <h2 className="mb-4 text-[0.95rem] font-semibold">Acumulado vs objetivo anual</h2>
                    <div className="h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={acumulado} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                                <CartesianGrid vertical={false} stroke="#2a2f38" />
                                <XAxis dataKey="m" stroke="#636b78" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#636b78" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000000}M`} width={38} />
                                <Tooltip contentStyle={tooltipStyle} formatter={(v) => money(Number(v))} />
                                <Line type="monotone" dataKey="acumulado" name="Acumulado" stroke="#5b74ff" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="objetivo" name="Objetivo" stroke="#636b78" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <p className="mt-5 text-[0.74rem] text-faint">Cifras de ejemplo. Se conectan a facturas, gastos y banco cuando definas la fuente.</p>
        </motion.div>
    );
}

const tooltipStyle = {
    background: "#15171c", border: "1px solid #2a2f38", borderRadius: 8, fontSize: 12, color: "#e7e9ee"
};

function Kpi({ icon, label, value, delta, hint, invert, accent }: {
    icon: React.ReactNode; label: string; value: string; delta?: number; hint?: string; invert?: boolean; accent?: boolean;
}) {
    const up = (delta ?? 0) >= 0;
    // invert: para egresos, "subir" es malo (rojo)
    const good = invert ? !up : up;
    return (
        <div className={`rounded-lg border bg-surface p-4 ${accent ? "border-accent/40" : "border-line"}`}>
            <div className="flex items-center gap-2 text-faint">{icon}<span className="text-[0.76rem] text-muted">{label}</span></div>
            <p className="tnum mt-2 text-[1.35rem] font-semibold leading-none">{value}</p>
            <div className="mt-1.5 flex items-center gap-1.5">
                {delta !== undefined ? (
                    <span className={`flex items-center gap-0.5 text-[0.74rem] font-semibold ${good ? "text-good" : "text-danger"}`}>
                        {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{Math.abs(delta)}%
                    </span>
                ) : null}
                {hint && <span className="text-[0.72rem] text-faint">{hint}</span>}
            </div>
        </div>
    );
}
