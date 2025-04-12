import { useAuth } from "@/hooks/use-auth";
import { Redirect, Route } from "wouter";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: React.ComponentType<any>;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-[300px]">
          <LoadingSpinner size="lg" text="Verifying authentication..." />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return (
    <Route path={path}>
      {() => <Component />}
    </Route>
  );
}