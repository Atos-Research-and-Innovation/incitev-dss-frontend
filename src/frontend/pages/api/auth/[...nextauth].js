/*
 * Copyright 2022-2024, Atos Spain S.A.
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * See README file for the full disclaimer information and the LICENSE
 * file for full license information in the repository root.
 *
 * @author Maxime Costalonga <maxime.2.costalonga@eviden.com>
 * @author Nicolas Figueroa <nicolas.2.figueroa@eviden.com>
 */

import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Login',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jdoe' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize (credentials, req) {
        const res = await fetch(
          process.env.DSS_BACKEND_BASE_URL + 'auth/token',
          {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-store',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
              grant_type: '',
              username: credentials.username,
              password: credentials.password,
              scope: '',
              client_id: '',
              client_secret: ''
            })
          }
        ).then(res => res.json())

        if (res.access_token) {
          const accessToken = 'Bearer ' + res.access_token
          const userRes = await fetch(
            process.env.DSS_BACKEND_BASE_URL + 'users/me',
            {
              method: 'GET',
              mode: 'no-cors',
              cache: 'no-store',
              headers: {
                Accept: 'application/json',
                Authorization: accessToken
              }
            }
          )
          const user = await userRes.json()
          user.token = accessToken
          return user
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/auth/signin'
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 6 * 60 * 60
  },
  callbacks: {
    async session ({ session, token }) {
      session.user.id = token.id
      session.user.name = token.username
      session.user.scopes = token.scopes
      session.user.token = token.accessToken
      return session
    },
    async jwt ({ token, user, account }) {
      if (user && account) {
        token.id = user._id
        token.username = user.username
        token.scopes = user.scopes
        token.accessToken = user.token
      }
      return token
    }
  }
}

export default NextAuth(authOptions)
