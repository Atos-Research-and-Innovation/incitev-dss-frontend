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

import '../../app/styles/output.css'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { getCsrfToken, signIn } from 'next-auth/react'
import Image from 'next/image'
import logo from '../../public/logo.png'
import Link from 'next/link'

export default function SignIn ({ csrfToken }) {
  const router = useRouter()
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()

    const res = await signIn('credentials', {
      redirect: false,
      username: event.target.username.value,
      password: event.target.password.value,
      callbackUrl: `${window.location.origin}`
    })

    if (res?.error) {
      setError('Invalid credentials')
    }
    console.log(JSON.stringify(res))
    if (res.url) {
      router.push(res.url)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col justify-center items-center min-h-screen bg-incitEV-blue dark:bg-incitEV-dark-blue'>
        <div className='p-10 bg-white dark:bg-gray-900 rounded'>
          <div>
            <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
          </div>
          <div className='flex flex-col justify-center items-center'>
            <Image
              className='w-auto h-32'
              src={logo}
              alt='INCIT-EV Logo'
            />
            <h2 className='mb-4 text-2xl font-bold text-gray-500 dark:text-gray-300'>
              Decision Support System
            </h2>
          </div>
          <div className='mb-4'>
            <label className='mb-4 text-xl text-gray-500 dark:text-gray-300'>
              Username
              <input
                name='username'
                type='text'
                placeholder='jdoe'
                className='py-3 px-3 my-2 w-full bg-white dark:bg-gray-900 dark:text-gray-300 rounded-lg border-2 focus:ring focus:outline-none border-incitEV-blue dark:border-incitEV-dark-blue'
              />
            </label>
          </div>
          <div className='mb-4'>
            <label className='mb-4 text-xl text-gray-500 dark:text-gray-300'>
              Password
              <input
                name='password'
                type='password'
                className='py-3 px-3 my-2 w-full bg-white dark:bg-gray-900 dark:text-gray-300 rounded-lg border-2 focus:ring focus:outline-none border-incitEV-blue dark:border-incitEV-dark-blue'
              />
            </label>
          </div>
          <div className='p-2 mb-4 text-xl font-bold text-center text-red-400'>
            {error}
          </div>
          <div className='flex justify-center'>
            <button
              type='submit'
              className='py-2 px-4 my-2 mx-4 w-56 text-xl text-gray-300 bg-gray-700 rounded border border-gray-700 hover:bg-gray-500'
            >
              Sign in
            </button>
          </div>
          <p
            className='pt-8 text-gray-500 dark:text-gray-300'
          >
            New user? <Link href='/register' className='text-blue-600 dark:text-blue-500 hover:underline'>Register here.</Link>
          </p>
        </div>
      </div>
    </form>
  )
}

export async function getServerSideProps (context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context)
    }
  }
}
