import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/db';
import GitHub from 'next-auth/providers/github';
import Nodemailer from 'next-auth/providers/nodemailer';
import jwt from 'jsonwebtoken';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Nodemailer({
      // server: {
      //   host: process.env.EMAIL_SERVER_HOST,
      //   port: process.env.EMAIL_SERVER_PORT,
      //   secure: false,
      //   tls: {
      //     ciphers: 'SSLv3',
      //   },
      //   requireTLS: true,
      //   auth: {
      //     user: process.env.EMAIL_SERVER_USER,
      //     pass: process.env.EMAIL_SERVER_PASSWORD,
      //   },
      // },
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    GitHub,
  ],
  callbacks: {
    jwt({ token, user }) {
      // console.log('user: ', user);
      if (user) {
        // User is available during sign-in
        token.sub = user.id;
      }
      return token;
    },
    session({ session, token }) {
      // console.log('token: ', token);
      // console.log('session: ', session);
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
    // updateAge: 0,
  },
  jwt: {
    encode: async (params) => {
      // console.log('params from encode: ', params);
      const { exp, iat, ...mainToken } = params.token || {};
      const encoded = jwt.sign(mainToken, process.env.AUTH_SECRET, {
        expiresIn: (params.maxAge || 60) * 1000,
      });
      // const decoded = jwt.verify(encoded, process.env.AUTH_SECRET);
      // console.log('verify: ', decoded);
      return encoded;
    },
    decode: async (params) => {
      const decoded = jwt.verify(
        params.token || '',
        process.env.AUTH_SECRET,
      ) as jwt.JwtPayload;
      // console.log('decoded: ', decoded);
      return decoded;
    },
  },
  // <Warning> https://authjs.dev/reference/core/errors#untrustedhost
  trustHost: true,
});
