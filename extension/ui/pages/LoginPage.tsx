import { Button, cn, RubyLogo, LogIn01, Page, Spinner } from "@ruby-ai/ui";
import { useExtensionAuth } from "@extension/ui/components/auth/AuthProvider";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    authError,
    isUserSetup,
    handleLogin,
    isLoading,
    handleLogout,
  } = useExtensionAuth();

  useEffect(() => {
    if (isAuthenticated && isUserSetup) {
      navigate("/");
    }
  }, [navigate, user, isAuthenticated, isUserSetup]);

  const PRIVACY_POLICY_URL =
    "https://ruby-ai.notion.site/Website-Privacy-Policy-a118bb3472f945a1be8e11fbfb733084";
  const TERMS_OF_USE_URL =
    "https://ruby-ai.notion.site/Website-Terms-of-Use-ff8665f52c454e0daf02195ec0d6bafb";

  if (isLoading || (isAuthenticated && isUserSetup)) {
    return (
      <div
        className={cn(
          "flex h-screen items-center justify-center",
          "bg-background text-foreground"
        )}
      >
        <Spinner size="sm" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className={cn(
          "flex h-screen flex-col p-4",
          "bg-background text-foreground"
        )}
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="flex max-w-[400px] flex-col items-center space-y-9 text-center">
            <Link to="https://ruby.ad" target="_blank">
              <RubyLogo className="h-8 w-36" />
            </Link>
          </div>
          <div className="max-w-[400px] text-center">
            <Page.H variant="h4">
              Get more done, faster, with the power of your agents at your
              fingertips.
            </Page.H>
          </div>
          {authError && authError.code === "user_not_found" && (
            <div className="text-md text-center">
              Please sign up on the web to start using Ruby extension.
            </div>
          )}
          {authError && authError.code !== "user_not_found" && (
            <div className="text-md text-center">{authError.message}</div>
          )}

          <div className="m-1 flex gap-2 text-center">
            {authError && authError.code === "user_not_found" && (
              <Link to="https://ruby.ad/home">
                <Button
                  icon={LogIn01}
                  variant="primary"
                  label="Sign up"
                  onClick={() => {
                    window.open(
                      "https://app.ruby.ad/api/workos/login?returnTo=/api/login",
                      "_blank"
                    );
                  }}
                  size="sm"
                />
              </Link>
            )}

            <Button
              icon={LogIn01}
              variant="primary"
              label="Sign in"
              onClick={() => handleLogin()}
              disabled={isLoading}
              size="sm"
            />
          </div>
        </div>
        <p className="text-muted-foreground mx-auto max-w-[300px] text-center">
          By signing in, you agree to Ruby's{" "}
          <Link to={TERMS_OF_USE_URL} target="_blank" className="underline">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link to={PRIVACY_POLICY_URL} target="_blank" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    );
  }

  if (isAuthenticated && user?.workspaces.length === 0) {
    return (
      <div
        className={cn(
          "flex h-screen flex-col p-4",
          "bg-background text-foreground"
        )}
      >
        <div className="flex h-screen flex-col items-center justify-center gap-2 text-center">
          <Page.SectionHeader title="You are not a member of any workspace." />
          <Button
            label="Sign up on Ruby"
            onClick={() => {
              window.open("https://ruby.ad", "_blank");
            }}
          />
          <div className="text-center">Then</div>
          <Button
            icon={LogIn01}
            variant="primary"
            label="Sign in"
            onClick={() => handleLogin()}
            disabled={isLoading}
          />
          <div className="text-center">Or</div>
          <Button label="Logout" onClick={() => handleLogout()} />
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div
        className={cn(
          "flex h-screen flex-col p-4",
          "bg-background text-foreground"
        )}
      >
        <div className="flex h-screen flex-col items-center justify-center gap-2 text-center">
          <Page.SectionHeader title={authError.message} />
          {authError.code === "user_not_found" ? (
            <>
              <Button
                label="Sign up on Ruby"
                onClick={() => {
                  window.open("https://ruby.ad", "_blank");
                }}
              />
              <div className="text-center">Then</div>
              <Button
                icon={LogIn01}
                variant="primary"
                label="Sign in"
                onClick={() => handleLogin()}
                disabled={isLoading}
              />
            </>
          ) : (
            <Button label="Logout" onClick={() => handleLogout()} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-screen flex-col p-4",
        "bg-background text-foreground"
      )}
    >
      <div className="flex h-screen flex-col items-center justify-center text-center">
        <Page.SectionHeader title="Something unexpected occurred. Please try logging in again. If the problem persists, contact us at support@ruby.ad." />
        <Button label="Logout" onClick={() => handleLogout()} />
      </div>
    </div>
  );
};
