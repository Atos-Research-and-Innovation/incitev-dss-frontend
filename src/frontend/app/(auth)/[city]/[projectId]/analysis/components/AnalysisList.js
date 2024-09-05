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

import AnalysisListResults from './AnalysisListResults.js'
import EmptyList from '../../../../../components/Home/EmptyList'
import { getAnalysesStatus } from '../../../../../components/backend/analyses'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export default async function AnalysisList ({ city, projectId }) {
  const session = await getServerSession(authOptions)
  const { status, body } = await getAnalysesStatus(projectId, session.user.token)
  if (body.length === 0 || status !== 200) {
    return (
      <EmptyList
        type='analysis'
        addUrl={`/${city}/${projectId}/analysis/add`}
      />
    )
  }
  return (
    <section>
      <div className='grid grid-cols-1 gap-4'>
        {body.map(analysis => {
          const lastModify = new Date(analysis.last_modify)
          return (
            <div
              key={analysis.name}
              className='grid overflow-auto grid-cols-2 py-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg'
            >
              <div className='float-left text-left'>
                <div className='flex flex-row items-center ml-2'>
                  {analysis.status === 'completed' && (
                    <svg
                      aria-hidden='true'
                      fill='#438450'
                      viewBox='0 0 24 24'
                      className='w-12 h-12'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        clipRule='evenodd'
                        d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z'
                        fillRule='evenodd'
                      />
                    </svg>
                  )}
                  {analysis.status === 'running' && (
                    <svg
                      aria-hidden='true'
                      fill='#F6E18B'
                      viewBox='0 0 24 24'
                      className='w-12 h-12'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        clipRule='evenodd'
                        d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z'
                        fillRule='evenodd'
                      />
                    </svg>
                  )}
                  {analysis.status === 'failed' && (
                    <svg
                      aria-hidden='true'
                      fill='#DF5D58'
                      viewBox='0 0 24 24'
                      className='w-12 h-12'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        clipRule='evenodd'
                        d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z'
                        fillRule='evenodd'
                      />
                    </svg>
                  )}
                  <div className='float-left pr-4 pl-4 text-left'>
                    <h2 className='text-4xl font-bold text-gray-700 dark:text-gray-300'>
                      {analysis.name}
                    </h2>
                    <p className='mb-4 text-xl text-gray-500 dark:text-gray-100'>
                      Last modified: {lastModify.toLocaleString('en-GB')}
                    </p>
                  </div>
                </div>
              </div>
              <div className='float-right px-4 my-auto'>
                <AnalysisListResults
                  city={city}
                  projectId={projectId}
                  analysis={analysis}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
