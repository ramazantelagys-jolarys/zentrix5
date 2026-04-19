import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AppLayout } from "@/components/layout";
import { AuthProvider, useAuth } from "@/contexts/auth-context";

import Dashboard from "@/pages/dashboard";
import PatientList from "@/pages/patient-list";
import PatientDetail from "@/pages/patient-detail";
import FormEditor from "@/pages/form-editor";
import Schedule from "@/pages/schedule";
import NewPatient from "@/pages/new-patient";
import Login from "@/pages/login";

const queryClient = new QueryClient();

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Redirect to="/login" />;
  return <AppLayout>{children}</AppLayout>;
}

function Router() {
  const { user } = useAuth();

  return (
    <Switch>
      <Route path="/login">
        {user ? <Redirect to="/" /> : <Login />}
      </Route>
      <Route path="/">
        <ProtectedLayout><Dashboard /></ProtectedLayout>
      </Route>
      <Route path="/patients">
        <ProtectedLayout><PatientList /></ProtectedLayout>
      </Route>
      <Route path="/patients/:id/forms/:formId">
        {(params) => (
          <ProtectedLayout><FormEditor /></ProtectedLayout>
        )}
      </Route>
      <Route path="/patients/:id">
        {(params) => (
          <ProtectedLayout><PatientDetail /></ProtectedLayout>
        )}
      </Route>
      <Route path="/schedule">
        <ProtectedLayout><Schedule /></ProtectedLayout>
      </Route>
      <Route path="/new-patient">
        <ProtectedLayout><NewPatient /></ProtectedLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
