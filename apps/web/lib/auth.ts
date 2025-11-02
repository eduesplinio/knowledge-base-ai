import { AuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { JWT } from 'next-auth/jwt';
import { Session, User } from 'next-auth';
import { Account } from 'next-auth';

interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User; account?: Account | null }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      const extendedSession = session as ExtendedSession;
      if (extendedSession.user) {
        extendedSession.user.id = token.id as string;
      }
      return extendedSession;
    },
  },
};
