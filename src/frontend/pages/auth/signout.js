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
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import logo from '../../public/logo.png'

export default function SignOut () {
  return (
    <div className='flex flex-col justify-center items-center min-h-screen bg-incitEV-blue dark:bg-incitEV-dark-blue'>
      <div className='p-10 bg-white dark:bg-gray-900 rounded'>
        <div className='flex flex-col justify-center items-center'>
          <a href='https://www.incit-ev.eu/'>
            <Image
              className='w-auto h-32'
              src={logo}
              alt='INCIT-EV Logo'
            />
          </a>
          <h2 className='mb-4 text-2xl font-bold text-gray-500 dark:text-gray-300'>
            Decision Support System
          </h2>
        </div>
        <div className='my-8 text-center'>
          <label className='text-xl text-gray-500 dark:text-gray-300'>
            You are signed out.
          </label>
        </div>
        <div className='flex justify-center'>
          <button
            onClick={() => signIn()}
            className='py-2 px-4 my-2 mx-4 w-56 text-xl text-white bg-gray-700 rounded border border-gray-700 hover:bg-gray-500'
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  )
}
