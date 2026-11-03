import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import LoginPage from "../../features/auth/LoginPage";

import DashboardPage from "../../features/dashboard/DashboardPage";
import PipelinePage from "../../features/opportunities/PipelinePage";

import CompanyPage from "../../features/companies/pages/CompanyPage";
import CompanyOverviewPage from "../../features/companies/pages/CompanyOverviewPage";
import Finances from "../../features/finances/pages/FinancesPage";
import ContactsPage from "../../features/contacts/pages/ContactsPage";
import TemplatesPage from "../../features/templates/pages/TemplatesPage";
import TemplatePage from "../../features/templates/pages/TemplatePage";

import DocumentsPage from "../../features/documents/pages/DocumentsPage";
import ProjectsPage from "../../features/projects/pages/ProjectsPage";
import ProjectPage from "../../features/projects/pages/ProjectPage"
import CompanyActivitiesPage from "../../features/activities/pages/CompanyActivitiesPage";
import OpportunitiesPage from "../../features/opportunities/pages/OpportunitiesPage";
import CompanyContactsPage from "../../features/contacts/pages/CompanyContactsPage";

import { AuthProvider } from "../context/AuthContext";

// CRM unificado: un solo espacio, sin "negocio". La línea de servicio es
// una etiqueta sobre empresa/oportunidad/proyecto. La operación por línea
// vive en atalaya-platform.
export default function AppRouter() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path="/" element={<LoginPage />} />
                    </Route>
                    <Route element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                            <Route path="/inicio" element={<DashboardPage />} />
                            <Route path="/pipeline" element={<PipelinePage />} />

                            <Route path="/companies" element={<CompanyPage />} />
                            <Route path="/contacts" element={<ContactsPage />} />
                            <Route path="/finances" element={<Finances />} />
                            <Route path="/templates" element={<TemplatesPage />} />
                            <Route path="/templates/:templateId" element={<TemplatePage />} />

                            <Route path="/companies/:companyId" element={<CompanyOverviewPage />} />
                            <Route path="/companies/:companyId/projects" element={<ProjectsPage />} />
                            <Route path="/companies/:companyId/projects/:projectId" element={<ProjectPage />} />
                            <Route path="/companies/:companyId/documents" element={<DocumentsPage />} />
                            <Route path="/companies/:companyId/contacts" element={<CompanyContactsPage />} />
                            <Route path="/companies/:companyId/activities" element={<CompanyActivitiesPage />} />
                            <Route path="/companies/:companyId/opportunities" element={<OpportunitiesPage />} />

                            <Route path="/app" element={<Navigate to="/inicio" replace />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}
