export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

/**
 * Redirect to the Clerk sign-in page.
 * Replaces the old /api/login redirect.
 */
export function redirectToLogin(
  toast?: (options: { title: string; description: string; variant: string }) => void,
) {
  if (toast) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Redirecting to sign in...",
      variant: "destructive",
    });
  }
  setTimeout(() => {
    (window.top || window).location.href = "/sign-in";
  }, 500);
}
