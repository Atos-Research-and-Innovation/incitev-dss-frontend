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
import EmptyList from './EmptyList.js'
import { getProjectList } from '../backend/projects.js'
import DeleteButton from './DeleteButton.js'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'

export default async function ProjectList () {
  const session = await getServerSession(authOptions)
  if (session === null || !session.user || !session.user.token) {
    return <EmptyList type='project' addUrl='/add-project' />
  }

  const projects = await getProjectList(session.user.token)
  if (projects.length === 0) {
    return <EmptyList type='project' addUrl='/add-project' />
  }
  return (
    <section>
      <div className='grid grid-cols-1 gap-4'>
        {projects.map(project => {
          const lastModify = new Date(project.last_modify)
          return (
            <div
              key={project.name}
              className='grid overflow-auto grid-cols-2 py-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg'
            >
              <div className='float-left pr-4 pl-7 my-auto text-left'>
                <h2 className='text-4xl font-bold text-gray-700 dark:text-gray-300'>
                  {project.name}
                </h2>
                <p className='mb-4 text-xl text-gray-500 dark:text-gray-100'>
                  Last modified: {lastModify.toLocaleString('en-GB')}
                </p>
              </div>
              <div className='float-right px-4 my-auto'>
                <div className='float-right'>
                  <DeleteButton projectId={project._id} />
                </div>
                <div className='float-right'>
                  <Link href={`/${project.name}/${project._id}/analysis`}>
                    <button className='py-2 px-4 my-2 mx-4 w-56 text-xl text-white bg-gray-700 rounded border border-gray-700 hover:bg-gray-500'>
                      Analysis
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
