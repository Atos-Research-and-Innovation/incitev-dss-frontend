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

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Avatar, Dropdown } from 'flowbite-react'

export default function AccountMenu () {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <>
      <Dropdown label={<Avatar size='lg' rounded />} arrowIcon={false} inline>
        <Dropdown.Item onClick={() => router.push('/profile')}>
          <svg
            aria-hidden='true'
            fill='currentColor'
            className='mr-2 w-8 h-8'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              clipRule='evenodd'
              d='M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z'
              fillRule='evenodd'
            />
          </svg>
          My account
        </Dropdown.Item>
        <Dropdown.Item onClick={() => router.push('/password')}>
          <svg
            aria-hidden='true'
            fill='currentColor'
            className='mr-2 w-8 h-8'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              clipRule='evenodd'
              d='M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z'
              fillRule='evenodd'
            />
          </svg>
          Change password
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => signOut({ callbackUrl: '/auth/signout' })}
        >
          <svg
            aria-hidden='true'
            fill='currentColor'
            className='mr-2 w-8 h-8'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              clipRule='evenodd'
              d='M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z'
              fillRule='evenodd'
            />
            <path
              clipRule='evenodd'
              d='M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z'
              fillRule='evenodd'
            />
          </svg>
          Sign out
        </Dropdown.Item>
      </Dropdown>
      <div className='text-center text-gray-700 dark:text-gray-300'>
        {session?.user ? session.user.name : ''}
      </div>
    </>
  )
}
