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

import Link from 'next/link'
import RefreshButton from './RefreshButton'

export default function CommonNav ({ children, title, refresh, addIcon, addUrl }) {
  const titleDecoded = decodeURI(title)
  return (
    <>
      <div className='flex flex-col mx-auto w-4/5'>
        <div className='flow-root my-6'>
          <div className='float-left'>
            {addIcon && (
              <div className='float-left'>
                <Link href={`${addUrl}`}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-12 h-12 text-incitEV-canary bg-white dark:bg-gray-900 rounded hover:bg-gray-300 dark:hover:bg-gray-600'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                </Link>
              </div>
            )}
            {refresh && (
              <div className='float-left ml-3'>
                <RefreshButton />
              </div>
            )}
            <div className='float-left ml-3'>
              <span className='text-5xl font-bold text-white dark:text-gray-300 sm:truncate sm:overflow-clip'>
                {titleDecoded}
              </span>
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
  )
}
