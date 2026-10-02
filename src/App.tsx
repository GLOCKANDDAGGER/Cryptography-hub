import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { ServicesSection } from './components/public/ServicesSection';
import { AboutView } from './components/public/AboutView';
import { InvestmentSolutionsView } from './components/public/InvestmentSolutionsView';
import { MarketInsightsView } from './components/public/MarketInsightsView';
import { EducationView } from './components/public/EducationView';
import { SecurityView } from './components/public/SecurityView';
import { ComplianceView } from './components/public/ComplianceView';
import { FaqView } from './components/public/FaqView';
import { ContactView } from './components/public/ContactView';
import { AuthModal } from './components/public/AuthModal';
import { DepositModal } from './components/common/DepositModal';
import { ScheduleAppointmentModal } from './components/common/ScheduleAppointmentModal';
import { ClientAuthGate } from './components/public/ClientAuthGate';
import { Footer } from './components/public/Footer';

// Client Portal Components
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { OverviewView } from './components/dashboard/OverviewView';
import { PortfolioView } from './components/dashboard/PortfolioView';
import { TransactionsView } from './components/dashboard/TransactionsView';
import { DocumentsView } from './components/dashboard/DocumentsView';
import { AccountManagerView } from './components/dashboard/AccountManagerView';
import { SupportView } from './components/dashboard/SupportView';
import { SecurityView as DashboardSecurityView } from './components/dashboard/SecurityView';
import { ProfileView } from './components/dashboard/ProfileView';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminClients } from './components/admin/AdminClients';
import { AdminTransactions } from './components/admin/AdminTransactions';
import { AdminSupport } from './components/admin/AdminSupport';
import { AdminCompliance } from './components/admin/AdminCompliance';
import { AdminAuditLogs } from './components/admin/AdminAuditLogs';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activePage, isAuthenticated, notification, theme } = useApp();

  // Notification Toast
  const renderNotification = () => {
    if (!notification) return null;
    return (
      <div className="fixed bottom-5 right-5 z-50 bg-[#0F172A] border border-[#FFA000] text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 text-xs font-mono animate-fade-in">
        <CheckCircle2 className="w-4 h-4 text-[#FFA000] shrink-0" />
        <span>{notification}</span>
      </div>
    );
  };

  // 1. Admin Routes (Secured by AdminLayout login gate: username "admin", password "admin")
  if (activePage.startsWith('admin')) {
    let adminContent = <AdminDashboard />;
    if (activePage === 'admin-clients') adminContent = <AdminClients />;
    if (activePage === 'admin-transactions') adminContent = <AdminTransactions />;
    if (activePage === 'admin-support') adminContent = <AdminSupport />;
    if (activePage === 'admin-compliance') adminContent = <AdminCompliance />;
    if (activePage === 'admin-audit-logs') adminContent = <AdminAuditLogs />;

    return (
      <div className={`min-h-screen flex flex-col ${theme === 'light' ? 'light bg-[#F8FAFC] text-slate-900' : 'dark bg-[#000000] text-slate-100'}`}>
        <AdminLayout>{adminContent}</AdminLayout>
        <ScheduleAppointmentModal />
        {renderNotification()}
      </div>
    );
  }

  // 2. Client Portal Routes (Requires Authentication - No auto-opened account)
  const isDashboardRoute = [
    'dashboard',
    'portfolio',
    'transactions',
    'documents',
    'account-manager',
    'support',
    'security-center',
    'profile',
  ].includes(activePage);

  if (isDashboardRoute) {
    if (!isAuthenticated) {
      return (
        <div className={`min-h-screen flex flex-col ${theme === 'light' ? 'light bg-[#F8FAFC] text-slate-900' : 'dark bg-[#000000] text-slate-100'}`}>
          <Navbar />
          <main className="flex-1 flex items-center justify-center p-4">
            <ClientAuthGate />
          </main>
          <Footer />
          <DepositModal />
          <AuthModal />
          <ScheduleAppointmentModal />
          {renderNotification()}
        </div>
      );
    }

    let dashboardContent = <OverviewView />;
    if (activePage === 'portfolio') dashboardContent = <PortfolioView />;
    if (activePage === 'transactions') dashboardContent = <TransactionsView />;
    if (activePage === 'documents') dashboardContent = <DocumentsView />;
    if (activePage === 'account-manager') dashboardContent = <AccountManagerView />;
    if (activePage === 'support') dashboardContent = <SupportView />;
    if (activePage === 'security-center') dashboardContent = <DashboardSecurityView />;
    if (activePage === 'profile') dashboardContent = <ProfileView />;

    return (
      <div className={`min-h-screen flex flex-col ${theme === 'light' ? 'light bg-[#F8FAFC] text-slate-900' : 'dark bg-[#000000] text-slate-100'}`}>
        <DashboardLayout>{dashboardContent}</DashboardLayout>
        <DepositModal />
        <AuthModal />
        <ScheduleAppointmentModal />
        {renderNotification()}
      </div>
    );
  }

  // 3. Public Website Routes (Clean, no prototype bar)
  return (
    <div className={`min-h-screen flex flex-col ${theme === 'light' ? 'light bg-[#F8FAFC] text-slate-900' : 'dark bg-[#000000] text-slate-100'}`}>
      <Navbar />

      <main className="flex-1">
        {activePage === 'home' && (
          <>
            <Hero />
            <ServicesSection />
            <MarketInsightsView />
            <InvestmentSolutionsView />
            <AboutView />
            <FaqView />
          </>
        )}
        {activePage === 'about' && <AboutView />}
        {activePage === 'services' && <ServicesSection />}
        {activePage === 'investment-solutions' && <InvestmentSolutionsView />}
        {activePage === 'market-insights' && <MarketInsightsView />}
        {activePage === 'education' && <EducationView />}
        {activePage === 'security' && <SecurityView />}
        {activePage === 'compliance' && <ComplianceView />}
        {activePage === 'faq' && <FaqView />}
        {activePage === 'contact' && <ContactView />}
      </main>

      <Footer />
      <AuthModal />
      <DepositModal />
      <ScheduleAppointmentModal />
      {renderNotification()}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
