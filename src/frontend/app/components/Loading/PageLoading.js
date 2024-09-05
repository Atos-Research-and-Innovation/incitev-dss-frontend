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

'use client'
import { Spinner } from 'flowbite-react'

export default function Loading ({ text = '' }) {
  return (
    <div className='flex flex-col items-center py-4 px-9 mx-auto mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg lg:w-3/4'>
      <Spinner
        aria-label='Loading projects spinner'
        size='xl'
        color='warning'
      />
      {text && <h1 className='mt-6 mb-6 text-3xl font-bold text-gray-500 dark:text-gray-300'>{text}</h1>}
    </div>
  )
}
