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

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../../../public/logo.png'
import Providers from '../../providers.js'
import AuthButton from './AuthButton.js'

export default function HeadingNav ({ includeProfile = true }) {
  const ProfileMenu = () => {
    if (includeProfile) {
      return (
        <div className='float-right mx-9 mt-14 align-middle'>
          <Providers><AuthButton /></Providers>
        </div>
      )
    }
  }
  return (
    <div className='flex flex-col mx-auto'>
      <div className='pl-4 text-white bg-white dark:bg-gray-900 shadow-sm'>
        <div className='float-left'>
          <Link href='/' className='pl-1'>
            <span className='sr-only'>Home</span>
            <Image
              className='object-left w-auto h-32'
              src={logo}
              alt='INCIT-EV Logo'
            />
          </Link>
        </div>
        <div className='float-left mx-9 mt-14 align-middle'>
          <h1 className='h-20 text-5xl text-gray-600 dark:text-gray-300 truncate overflow-clip'>
            Decision Support System
          </h1>
        </div>
        {ProfileMenu()}
      </div>
    </div>
  )
}
