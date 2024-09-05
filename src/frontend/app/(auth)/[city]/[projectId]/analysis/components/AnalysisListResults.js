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
import Link from 'next/link'
import DeleteButton from '../../../../../components/Home/DeleteButton'
import { useState } from 'react'
import { LogButton, LogDrawer } from './Logs'

export default function AnalysisListResults ({ city, projectId, analysis }) {
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)
  return (
    <section>
      <div className='float-right'>
        <DeleteButton projectId={projectId} analysisId={analysis._id} />
      </div>
      <div className='float-right'>
        <LogButton analysis={analysis} setSelectedAnalysis={setSelectedAnalysis} />
      </div>
      <LogDrawer selectedAnalysis={selectedAnalysis} setSelectedAnalysis={setSelectedAnalysis} />
      {analysis.status === 'completed' && (
        <div className='float-right'>
          <Link
            href={`/${city}/${projectId}/analysis/${analysis.name}/${analysis._id}/results`}
          >
            <button className='my-2 mx-4 w-12 h-12 bg-transparent rounded border-2 border-green-600 hover:text-white hover:bg-green-600 hover:border-transparent text-green-600'>
              <svg
                aria-hidden='true'
                fill='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z' />
              </svg>
            </button>
          </Link>
        </div>
      )}
    </section>
  )
}
