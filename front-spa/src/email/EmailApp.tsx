import { ErrorBoundary } from "@ruby-ai/front/components/error_boundary/ErrorBoundary";
import { ValidationPage } from "@ruby-ai/front/components/pages/email/ValidationPage";
import { CellProvider } from "@ruby-ai/front/lib/auth/CellContext";
import { GlobalErrorFallback } from "@spa/app/components/GlobalErrorFallback";

export default function EmailApp() {
  return (
    <CellProvider>
      <ErrorBoundary fallback={<GlobalErrorFallback />}>
        <ValidationPage />
      </ErrorBoundary>
    </CellProvider>
  );
}
