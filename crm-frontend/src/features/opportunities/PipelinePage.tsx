import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import { KanbanSquare, Table2 } from "lucide-react";

import PageHeader from "../../components/ui/PageHeader";
import Badge, { StatusBadge } from "../../components/ui/Badge";
import DataTable, { type Column } from "../../components/ui/DataTable";
import { Spinner, ErrorText } from "../../components/ui/States";
import { api } from "../../lib/api";
import type { Opportunity } from "./types/opportunity.types";

const STAGES = ["Descubrimiento", "Propuesta", "Negociacion", "Contrato", "Ganado", "Perdido"];
const STAGE_LABELS: Record<string, string> = {
    Descubrimiento: "Descubrimiento", Propuesta: "Propuesta", Negociacion: "Negociación",
    Contrato: "Contrato", Ganado: "Ganado", Perdido: "Perdido"
};
const money = (n: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n || 0);
const companyName = (c: Opportunity["company"]) => (c && typeof c === "object" ? c.name : "—");
const companyId = (c: Opportunity["company"]) => (c && typeof c === "object" ? c._id : (c as string));

const priorityTone = (p: string): "danger" | "warn" | "neutral" =>
    p === "Alta" ? "danger" : p === "Media" ? "warn" : "neutral";

export default function PipelinePage() {
    const navigate = useNavigate();

    const [opps, setOpps] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<"kanban" | "table">("kanban");
    const [dragId, setDragId] = useState<string | null>(null);
    const [overStage, setOverStage] = useState<string | null>(null);
    const [stageFilter, setStageFilter] = useState("");

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const { opportunities } = await api.get<{ opportunities: Opportunity[] }>("/opportunities");
            setOpps(opportunities);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Error al cargar oportunidades");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const moveTo = async (id: string, stage: string) => {
        const prev = opps;
        setOpps((cur) => cur.map((o) => (o._id === id ? { ...o, stage: stage as Opportunity["stage"] } : o)));
        try {
            await api.patch(`/opportunities/${id}/stage`, { stage });
        } catch {
            setOpps(prev);
        }
    };

    const onDrop = (stage: string) => {
        setOverStage(null);
        if (dragId) moveTo(dragId, stage);
        setDragId(null);
    };

    const byStage = useMemo(() => {
        const map: Record<string, Opportunity[]> = {};
        STAGES.forEach((s) => (map[s] = []));
        opps.forEach((o) => { (map[o.stage] ?? (map[o.stage] = [])).push(o); });
        return map;
    }, [opps]);

    const columns: Column<Opportunity>[] = [
        {
            key: "title", header: "Oportunidad", value: (o) => o.title,
            render: (o) => (
                <div className="min-w-0">
                    <p className="truncate font-medium">{o.title}</p>
                    <p className="truncate text-[0.74rem] text-faint">{companyName(o.company)}</p>
                </div>
            )
        },
        { key: "stage", header: "Etapa", value: (o) => o.stage, render: (o) => <StatusBadge status={o.stage} /> },
        { key: "amount", header: "Valor", align: "right", value: (o) => o.estimatedAmount || 0, render: (o) => <span className="tnum">{money(o.estimatedAmount)}</span> },
        { key: "prob", header: "Prob.", align: "right", value: (o) => o.probability || 0, render: (o) => <span className="tnum">{o.probability ?? 0}%</span> },
        { key: "priority", header: "Prioridad", value: (o) => o.priority, render: (o) => <Badge tone={priorityTone(o.priority)}>{o.priority}</Badge> },
        {
            key: "close", header: "Cierre", align: "right",
            value: (o) => (o.estimatedCloseDate ? +new Date(o.estimatedCloseDate) : 0),
            render: (o) => <span className="text-faint">{o.estimatedCloseDate ? new Date(o.estimatedCloseDate).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>
        }
    ];

    const toggle = (
        <div className="flex rounded-md border border-line bg-surface-2 p-0.5">
            <button onClick={() => setView("kanban")} className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-[0.8rem] font-semibold ${view === "kanban" ? "bg-surface text-ink shadow" : "text-muted"}`}>
                <KanbanSquare size={14} /> Tablero
            </button>
            <button onClick={() => setView("table")} className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-[0.8rem] font-semibold ${view === "table" ? "bg-surface text-ink shadow" : "text-muted"}`}>
                <Table2 size={14} /> Tabla
            </button>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <PageHeader title="Pipeline" subtitle="Oportunidades de todas las empresas" count={opps.length} actions={toggle} />

            {loading && <Spinner label="Cargando oportunidades..." />}
            {error && <ErrorText>{error}</ErrorText>}

            {!loading && !error && view === "kanban" && (
                <div className="mt-6 flex gap-3 overflow-x-auto pb-4">
                    {STAGES.map((stage) => {
                        const items = byStage[stage] || [];
                        const total = items.reduce((s, o) => s + (o.estimatedAmount || 0), 0);
                        return (
                            <div
                                key={stage}
                                onDragOver={(e) => { e.preventDefault(); setOverStage(stage); }}
                                onDragLeave={() => setOverStage((s) => (s === stage ? null : s))}
                                onDrop={() => onDrop(stage)}
                                className={`flex w-[260px] flex-none flex-col rounded-lg border bg-surface/40 ${overStage === stage ? "border-accent/60 bg-accent/5" : "border-line"}`}
                            >
                                <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
                                    <span className="text-[0.82rem] font-semibold">{STAGE_LABELS[stage]}</span>
                                    <span className="tnum text-[0.72rem] text-faint">{items.length} · {money(total)}</span>
                                </div>
                                <div className="flex flex-col gap-2 p-2">
                                    {items.map((o) => (
                                        <div
                                            key={o._id}
                                            draggable
                                            onDragStart={() => setDragId(o._id)}
                                            onDragEnd={() => { setDragId(null); setOverStage(null); }}
                                            onClick={() => navigate(`/companies/${companyId(o.company)}/opportunities`)}
                                            className="cursor-grab rounded-md border border-line bg-surface p-3 transition-colors hover:border-accent/50 active:cursor-grabbing"
                                        >
                                            <p className="text-[0.84rem] font-medium leading-snug">{o.title}</p>
                                            <p className="mt-0.5 truncate text-[0.74rem] text-faint">{companyName(o.company)}</p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="tnum text-[0.8rem] font-semibold">{money(o.estimatedAmount)}</span>
                                                <Badge tone={priorityTone(o.priority)}>{o.priority}</Badge>
                                            </div>
                                            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-2">
                                                <div className="h-full rounded-full bg-accent" style={{ width: `${o.probability ?? 0}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                    {items.length === 0 && <p className="py-4 text-center text-[0.74rem] text-faint">—</p>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && !error && view === "table" && (
                <DataTable
                    columns={columns}
                    rows={stageFilter ? opps.filter((o) => o.stage === stageFilter) : opps}
                    getRowId={(o) => o._id}
                    searchText={(o) => `${o.title} ${companyName(o.company)}`}
                    onRowClick={(o) => navigate(`/companies/${companyId(o.company)}/opportunities`)}
                    csvFilename="oportunidades"
                    searchPlaceholder="Buscar oportunidad…"
                    filters={[
                        { label: "Etapa", value: stageFilter, options: STAGES.map((s) => ({ label: STAGE_LABELS[s], value: s })), onChange: setStageFilter }
                    ]}
                />
            )}
        </motion.div>
    );
}
