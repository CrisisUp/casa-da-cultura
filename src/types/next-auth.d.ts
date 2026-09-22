import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    role: "ADMIN" | "OPERATOR";
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "ADMIN" | "OPERATOR";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "OPERATOR";
  }
}
