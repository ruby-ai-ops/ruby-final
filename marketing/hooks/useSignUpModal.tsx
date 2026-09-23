import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import { appendUTMParams } from "@marketing/lib/utils/utm";

interface SignUpModalContextType {
  isOpen: boolean;
  openSignUpModal: () => void;
  closeSignUpModal: () => void;
}

const SignUpModalContext = createContext<SignUpModalContextType | null>(null);

interface SignUpModalProviderProps {
  children: ReactNode;
}

export function SignUpModalProvider({ children }: SignUpModalProviderProps) {
  const isOpen = false;
  const openSignUpModal = useCallback(() => {
    window.location.assign(appendUTMParams("https://app.ruby.ad/api/workos/login?screenHint=sign-up"));
  }, []);
  const closeSignUpModal = useCallback(() => {}, []);

  const value = useMemo(
    () => ({ isOpen, openSignUpModal, closeSignUpModal }),
    [isOpen, openSignUpModal, closeSignUpModal]
  );

  return (
    <SignUpModalContext.Provider value={value}>
      {children}
    </SignUpModalContext.Provider>
  );
}

export function useSignUpModal(): SignUpModalContextType {
  const ctx = useContext(SignUpModalContext);
  if (!ctx) {
    throw new Error("useSignUpModal must be used within SignUpModalProvider");
  }
  return ctx;
}
