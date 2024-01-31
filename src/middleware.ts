import { withAuth } from "next-auth/middleware";
import { UserRole } from "./lib/utils";

export default withAuth({
  callbacks: {
    authorized: async ({ req, token }) => {
      if (req.nextUrl.pathname.startsWith("/dashboard"))
        return token?.type === UserRole.AGENT;
      if (req.nextUrl.pathname.startsWith("/admin"))
        return token?.type === UserRole.ADMIN;

      return !!token;
    },
  },
});

export const config = { matcher: ["/dashboard/:path*", "/admin/:path*"] };
