import { useMemo, useState } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Download, X } from "lucide-react";

export interface Column<T> {
    key: string;
    header: string;
    render?: (row: T) => React.ReactNode;
    /** valor para ordenar y para el CSV; si falta, la columna no ordena */
    value?: (row: T) => string | number;
    align?: "left" | "right";
    className?: string;
}

export interface Filter {
    label: string;
    value: string;
    options: { label: string; value: string }[];
    onChange: (v: string) => void;
}

export interface BulkAction {
    label: string;
    onClick: (ids: string[]) => void;
    tone?: "default" | "danger";
}

interface DataTableProps<T> {
    columns: Column<T>[];
    rows: T[];
    getRowId: (row: T) => string;
    /** texto donde busca el buscador */
    searchText: (row: T) => string;
    onRowClick?: (row: T) => void;
    filters?: Filter[];
    bulkActions?: BulkAction[];
    rightActions?: React.ReactNode;
    csvFilename?: string;
    searchPlaceholder?: string;
}

export default function DataTable<T>({
    columns, rows, getRowId, searchText, onRowClick,
    filters, bulkActions, rightActions, csvFilename, searchPlaceholder
}: DataTableProps<T>) {

    const [query, setQuery] = useState("");
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((r) => searchText(r).toLowerCase().includes(q));
    }, [rows, query, searchText]);

    const sorted = useMemo(() => {
        if (!sortKey) return filtered;
        const col = columns.find((c) => c.key === sortKey);
        if (!col?.value) return filtered;
        const dir = sortDir === "asc" ? 1 : -1;
        return [...filtered].sort((a, b) => {
            const va = col.value!(a); const vb = col.value!(b);
            if (va < vb) return -1 * dir;
            if (va > vb) return 1 * dir;
            return 0;
        });
    }, [filtered, sortKey, sortDir, columns]);

    const toggleSort = (col: Column<T>) => {
        if (!col.value) return;
        if (sortKey === col.key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(col.key);
            setSortDir("asc");
        }
    };

    const allVisibleSelected = sorted.length > 0 && sorted.every((r) => selected.has(getRowId(r)));
    const toggleAll = () => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (allVisibleSelected) {
                sorted.forEach((r) => next.delete(getRowId(r)));
            } else {
                sorted.forEach((r) => next.add(getRowId(r)));
            }
            return next;
        });
    };
    const toggleOne = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const exportCsv = () => {
        const cols = columns.filter((c) => c.value);
        const head = cols.map((c) => `"${c.header}"`).join(",");
        const lines = sorted.map((r) =>
            cols.map((c) => `"${String(c.value!(r)).replace(/"/g, '""')}"`).join(",")
        );
        const csv = [head, ...lines].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `${csvFilename ?? "export"}.csv`; a.click();
        URL.revokeObjectURL(url);
    };

    const gridCols = `${bulkActions ? "36px " : ""}${columns.map(() => "minmax(0,1fr)").join(" ")}`;

    return (
        <div className="mt-6">
            {/* toolbar */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
                <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-md border border-line-2 bg-surface-2 px-3 py-2">
                    <Search size={15} className="text-faint" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={searchPlaceholder ?? "Buscar…"}
                        className="w-full bg-transparent text-[0.86rem] outline-none"
                    />
                </label>

                {filters?.map((f) => (
                    <select
                        key={f.label}
                        value={f.value}
                        onChange={(e) => f.onChange(e.target.value)}
                        className="rounded-md border border-line-2 bg-surface-2 px-2.5 py-2 text-[0.84rem] text-ink outline-none"
                    >
                        <option value="">{f.label}: todos</option>
                        {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                ))}

                {csvFilename && (
                    <button onClick={exportCsv} className="flex items-center gap-1.5 rounded-md border border-line-2 bg-surface px-2.5 py-2 text-[0.82rem] font-medium text-muted transition-colors hover:border-faint">
                        <Download size={14} className="text-faint" /> CSV
                    </button>
                )}

                {rightActions}
            </div>

            {/* barra de selección */}
            {bulkActions && selected.size > 0 && (
                <div className="mb-2 flex items-center gap-3 rounded-md border border-accent/30 bg-accent/10 px-3 py-2">
                    <span className="text-[0.82rem] font-semibold">{selected.size} seleccionado(s)</span>
                    <div className="flex gap-2">
                        {bulkActions.map((a) => (
                            <button
                                key={a.label}
                                onClick={() => { a.onClick([...selected]); setSelected(new Set()); }}
                                className={`rounded-md px-2.5 py-1 text-[0.8rem] font-semibold ${a.tone === "danger" ? "text-danger hover:bg-danger/10" : "text-ink hover:bg-surface-2"}`}
                            >
                                {a.label}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setSelected(new Set())} className="ml-auto text-faint hover:text-ink"><X size={15} /></button>
                </div>
            )}

            {/* tabla */}
            <div className="overflow-x-auto rounded-lg border border-line">
                <div className="min-w-[640px]">
                    <div className="grid items-center gap-0 border-b border-line bg-surface px-4 py-2.5" style={{ gridTemplateColumns: gridCols }}>
                        {bulkActions && (
                            <span>
                                <input type="checkbox" checked={allVisibleSelected} onChange={toggleAll} className="accent-[var(--color-accent)]" aria-label="Seleccionar todo" />
                            </span>
                        )}
                        {columns.map((c) => (
                            <button
                                key={c.key}
                                onClick={() => toggleSort(c)}
                                className={`flex items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-[0.04em] text-faint ${c.align === "right" ? "justify-end" : ""} ${c.value ? "hover:text-muted cursor-pointer" : "cursor-default"}`}
                            >
                                {c.header}
                                {c.value && (sortKey === c.key
                                    ? (sortDir === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />)
                                    : <ArrowUpDown size={12} className="opacity-40" />)}
                            </button>
                        ))}
                    </div>

                    <div className="divide-y divide-line">
                        {sorted.length === 0 && (
                            <p className="px-4 py-10 text-center text-[0.85rem] text-faint">Sin resultados</p>
                        )}
                        {sorted.map((r) => {
                            const id = getRowId(r);
                            return (
                                <div
                                    key={id}
                                    onClick={() => onRowClick?.(r)}
                                    className={`grid items-center gap-0 px-4 py-3 transition-colors ${onRowClick ? "cursor-pointer hover:bg-surface-2/50" : ""}`}
                                    style={{ gridTemplateColumns: gridCols }}
                                >
                                    {bulkActions && (
                                        <span onClick={(e) => e.stopPropagation()}>
                                            <input type="checkbox" checked={selected.has(id)} onChange={() => toggleOne(id)} className="accent-[var(--color-accent)]" aria-label="Seleccionar fila" />
                                        </span>
                                    )}
                                    {columns.map((c) => (
                                        <div key={c.key} className={`min-w-0 text-[0.86rem] ${c.align === "right" ? "text-right" : ""} ${c.className ?? ""}`}>
                                            {c.render ? c.render(r) : <span className="truncate">{c.value ? c.value(r) : ""}</span>}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <p className="mt-2 text-[0.74rem] text-faint">{sorted.length} de {rows.length}</p>
        </div>
    );
}
