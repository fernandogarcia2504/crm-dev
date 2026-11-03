import { useNavigate } from "react-router-dom";

import type { Company } from "../types/company.types";
import { StatusBadge } from "../../../components/ui/Badge";

interface CompanyCardProps {
    company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {

    const navigate = useNavigate();

    const initials = company.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();

    return (
        <div
            onClick={() => navigate(`/companies/${company._id}`)}
            className="grid cursor-pointer grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,2fr)_minmax(0,1.3fr)_minmax(0,1.3fr)] items-center px-4 py-3 transition-colors hover:bg-surface-2/50"
        >
            <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-surface-2 text-[0.72rem] font-semibold text-muted">
                    {initials}
                </span>
                <div className="min-w-0">
                    <p className="truncate font-medium">{company.name}</p>
                    {company.lines && company.lines.length > 0 && (
                        <div className="mt-0.5 flex flex-wrap gap-1">
                            {company.lines.map((line) => (
                                <span key={line} className="rounded bg-surface-2 px-1.5 py-0.5 text-[0.66rem] text-muted">{line}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <p className="truncate text-[0.85rem] text-muted">{company.companySize}</p>
            <p className="truncate text-[0.85rem] text-muted">{company.website}</p>
            <div>
                <StatusBadge status={company.status} />
            </div>
            <p className="truncate text-right text-[0.85rem] text-muted">{company.leadSource || "—"}</p>
        </div>
    );
}
