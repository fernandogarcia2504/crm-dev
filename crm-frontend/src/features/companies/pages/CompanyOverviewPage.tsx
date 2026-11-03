import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { motion } from "framer-motion";
import { Users, Target, Activity as ActivityIcon, FileText, ArrowUpRight, Globe } from "lucide-react";

import PageHeader from "../../../components/ui/PageHeader";
import Badge, { StatusBadge } from "../../../components/ui/Badge";
import { Spinner, ErrorText } from "../../../components/ui/States";
import { api } from "../../../lib/api";
import type { Company } from "../types/company.types";
import type { Contact } from "../../contacts/types/contact.types";
import type { Opportunity } from "../../opportunities/types/opportunity.types";

interface DocLite { _id: string; originalName?: string; name?: string; createdAt?: string }
interface ActLite { _id: string; type: string; title?: string; date?: string; company?: { _id: string } | string }

const money = (n: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n || 0);
const OPEN = ["Descubrimiento", "Propuesta", "Negociacion", "Contrato"];

export default function CompanyOverviewPage() {
    const { companyId } = useParams();
    const navigate = useNavigate();

    const [company, setCompany] = useState<Company | null>(null);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [opps, setOpps] = useState<Opportunity[]>([]);
    const [docs, setDocs] = useState<DocLite[]>([]);
    const [acts, setActs] = useState<ActLite[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        if (!companyId) return;
        try {
            setLoading(true);
            setError(null);
            const [c, ct, op, dc, ac] = await Promise.all([
                api.get<{ company: Company }>(`/companies/${companyId}`),
                api.get<{ contacts: Contact[] }>(`/contacts/${companyId}`).catch(() => ({ contacts: [] })),
                api.get<{ opportunities: Opportunity[] }>(`/opportunities/${companyId}`).catch(() => ({ opportunities: [] })),
                api.get<{ documents: DocLite[] }>(`/documents/${companyId}`).catch(() => ({ documents: [] })),
                api.get<{ activities: ActLite[] }>(`/activities`).catch(() => ({ activities: [] }))
            ]);
            setCompany(c.company);
            setContacts(ct.contacts);
            setOpps(op.opportunities);
            setDocs(dc.documents);
            setActs(ac.activities.filter((a) => (typeof a.company === "object" ? a.company?._id : a.company) === companyId).slice(0, 6));
        } catch (e) {
            setError(e instanceof Error ? e.message : "Error al cargar la empresa");
        } finally {
            setLoading(false);
        }
    }, [companyId]);

    useEffect(() => { load(); }, [load]);

    const openPipeline = opps.filter((o) => OPEN.includes(o.stage)).reduce((s, o) => s + (o.estimatedAmount || 0), 0);

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {loading && <><PageHeader title="Empresa" /><Spinner label="Cargando..." /></>}
            {error && <ErrorText>{error}</ErrorText>}

            {!loading && !error && company && (
                <>
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6 pt-9">
                        <div className="flex items-center gap-3">
                            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-surface-2 text-[0.9rem] font-semibold text-muted">
                                {company.name.slice(0, 2).toUpperCase()}
                            </span>
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <h1 className="text-[1.4rem] font-semibold tracking-tight">{company.name}</h1>
                                    <StatusBadge status={company.status} />
                                </div>
                                <div className="mt-1 flex flex-wrap items-center gap-3 text-[0.82rem] text-muted">
                                    {company.website && <span className="flex items-center gap-1"><Globe size={13} />{company.website}</span>}
                                    {company.lines?.map((l) => <Badge key={l} tone="accent" dot={false}>{l}</Badge>)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                        <Mini label="Pipeline abierto" value={money(openPipeline)} />
                        <Mini label="Oportunidades" value={String(opps.length)} />
                        <Mini label="Contactos" value={String(contacts.length)} />
                        <Mini label="Documentos" value={String(docs.length)} />
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
                        <Section title="Oportunidades" icon={<Target size={16} />} onOpen={() => navigate(`/companies/${companyId}/opportunities`)}>
                            {opps.length === 0 ? <Empty /> : opps.slice(0, 5).map((o) => (
                                <Row key={o._id} main={o.title} sub={o.stage} right={money(o.estimatedAmount)} />
                            ))}
                        </Section>

                        <Section title="Contactos" icon={<Users size={16} />} onOpen={() => navigate(`/companies/${companyId}/contacts`)}>
                            {contacts.length === 0 ? <Empty /> : contacts.slice(0, 5).map((c) => (
                                <Row key={c._id} main={c.fullName} sub={c.position || c.email} right={c.isPrimary ? "Principal" : ""} />
                            ))}
                        </Section>

                        <Section title="Actividades recientes" icon={<ActivityIcon size={16} />} onOpen={() => navigate(`/companies/${companyId}/activities`)}>
                            {acts.length === 0 ? <Empty /> : acts.map((a) => (
                                <Row key={a._id} main={a.title || a.type} sub={a.type} right={a.date ? new Date(a.date).toLocaleDateString("es-MX", { day: "numeric", month: "short" }) : ""} />
                            ))}
                        </Section>

                        <Section title="Documentos" icon={<FileText size={16} />} onOpen={() => navigate(`/companies/${companyId}/documents`)}>
                            {docs.length === 0 ? <Empty /> : docs.slice(0, 5).map((d) => (
                                <Row key={d._id} main={d.originalName || d.name || "Documento"} sub="" right={d.createdAt ? new Date(d.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "short" }) : ""} />
                            ))}
                        </Section>
                    </div>
                </>
            )}
        </motion.div>
    );
}

function Mini({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border border-line bg-surface p-4">
            <p className="text-[0.74rem] text-muted">{label}</p>
            <p className="tnum mt-1.5 text-[1.3rem] font-semibold leading-none">{value}</p>
        </div>
    );
}
function Section({ title, icon, onOpen, children }: { title: string; icon: React.ReactNode; onOpen: () => void; children: React.ReactNode }) {
    return (
        <div className="rounded-lg border border-line bg-surface p-5">
            <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2"><span className="text-accent">{icon}</span><h2 className="text-[0.95rem] font-semibold">{title}</h2></div>
                <button onClick={onOpen} className="flex items-center gap-1 text-[0.78rem] text-muted hover:text-accent">Ver <ArrowUpRight size={13} /></button>
            </div>
            <div className="divide-y divide-line">{children}</div>
        </div>
    );
}
function Row({ main, sub, right }: { main: string; sub: string; right: string }) {
    return (
        <div className="flex items-center justify-between py-2.5">
            <div className="min-w-0">
                <p className="truncate text-[0.86rem] font-medium">{main}</p>
                {sub && <p className="truncate text-[0.74rem] text-faint">{sub}</p>}
            </div>
            {right && <span className="tnum flex-none text-[0.8rem] text-muted">{right}</span>}
        </div>
    );
}
function Empty() {
    return <p className="py-5 text-center text-[0.82rem] text-faint">Sin registros</p>;
}
