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
    async jwt({ token, user, account }: { token: JWT; user?: User; account?: Account | null }) {
      if (user && account) {
        try {
          const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
          const response = await fetch(`${apiUrl}/users/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              githubId: account.providerAccountId,
              avatar: user.image,
            }),
          });

          if (response.ok) {
            const userData = await response.json();
            token.id = userData._id;
          }
        } catch (error) {
          console.error('Error syncing user:', error);
        }
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
