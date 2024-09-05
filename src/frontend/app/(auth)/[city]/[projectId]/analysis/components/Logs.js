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
import useSWR from 'swr'
import { baseFetcher } from '../../../../../utils'
import { Spinner } from 'flowbite-react'

export function LogButton ({ analysis, setSelectedAnalysis }) {
  return (
    <button
      className='my-2 mx-4 w-12 h-12 text-gray-500 bg-transparent rounded border-2 border-gray-500 hover:text-white hover:bg-gray-500 hover:border-transparent'
      onClick={() => setSelectedAnalysis(analysis)}
    >
      <svg
        viewBox='-2.5 -1.5 24 24'
        fill='currentColor'
        id='svg4'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          clipRule='evenodd'
          fillRule='evenodd'
          d='M 1.875,0 C 0.8483504,0 0,0.8483504 0,1.875 v 17.25 C 0,20.151643 0.8483343,21 1.875,21 h 12.75 c 1.026659,0 1.875,-0.848341 1.875,-1.875 v -0.998047 a 0.75,0.75 0 0 0 -0.75,-0.75 0.75,0.75 0 0 0 -0.75,0.75 V 19.125 C 15,19.34094 14.84094,19.5 14.625,19.5 H 1.875 C 1.6590269,19.5 1.5,19.340956 1.5,19.125 V 1.875 C 1.5,1.6590108 1.6590108,1.5 1.875,1.5 H 4.5 6.375 C 7.833677,1.5 9,2.6663613 9,4.125 v 1.5 C 9,6.6516657 9.848357,7.5 10.875,7.5 h 1.5 C 13.833677,7.5 15,8.666361 15,10.125 a 0.75,0.75 0 0 0 0.75,0.75 0.75,0.75 0 0 0 0.75,-0.75 c 0,-0.08855 -0.04522,-0.162797 -0.05078,-0.25 A 0.75,0.75 0 0 0 16.5,9.75 C 16.5,4.3741188 12.125922,0 6.75,0 H 6.375 4.5 Z m 8.037109,2.1367188 c 2.01371,0.8347662 3.616412,2.4374657 4.451172,4.4511718 C 13.764232,6.2478144 13.109696,6 12.375,6 h -1.5 C 10.659044,6 10.5,5.8409731 10.5,5.625 v -1.5 C 10.5,3.3903179 10.252181,2.7357681 9.912109,2.1367188 Z'
          id='path2'
        />
        <path
          d='m 2.4765625,10.453125 a 0.35051355,0.35051355 0 0 0 -0.3496094,0.351563 v 6.414062 a 0.35051355,0.35051355 0 0 0 0.3496094,0.351562 H 19.158203 a 0.35051355,0.35051355 0 0 0 0.349609,-0.351562 v -6.414062 a 0.35051355,0.35051355 0 0 0 -0.349609,-0.351563 z m 0.3515625,0.701172 h 15.978516 v 5.714844 H 2.828125 Z'
          id='rect439'
        />
        <g aria-label='LOGS' transform='translate(-3.75,-1.5)' id='text1049'>
          <path
            d='M 9.8762306,17.875572 H 7.4939137 q -0.1249981,0 -0.1249981,-0.124998 v -4.477873 q 0,-0.124998 0.1249981,-0.124998 H 7.957142 q 0.1249981,0 0.1249981,0.124998 v 3.889647 q 0,0.07353 0.088234,0.07353 h 1.7058565 q 0.1249984,0 0.1249984,0.132351 v 0.382347 q 0,0.124998 -0.1249984,0.124998 z'
            id='path416'
          />
          <path
            d='m 11.846781,17.250582 h 0.639696 q 0.536757,0 0.536757,-0.54411 v -2.389669 q 0,-0.54411 -0.536757,-0.54411 h -0.639696 q -0.529404,0 -0.529404,0.54411 v 2.389669 q 0,0.54411 0.529404,0.54411 z m 0.749988,0.62499 h -0.852928 q -0.544109,0 -0.845575,-0.301466 -0.294113,-0.301466 -0.294113,-0.838222 v -2.448493 q 0,-0.544109 0.294113,-0.838222 0.301466,-0.301466 0.845575,-0.301466 h 0.852928 q 0.54411,0 0.845576,0.301466 0.301466,0.294113 0.301466,0.838222 v 2.448493 q 0,0.536756 -0.301466,0.838222 -0.301466,0.301466 -0.845576,0.301466 z'
            id='path418'
          />
          <path
            d='M 16.589342,17.875572 H 15.80259 q -0.54411,0 -0.845576,-0.301466 -0.294113,-0.301466 -0.294113,-0.838222 v -2.448493 q 0,-0.544109 0.294113,-0.838222 0.301466,-0.301466 0.845576,-0.301466 h 0.786752 q 0.54411,0 0.838223,0.301466 0.301466,0.294113 0.301466,0.838222 v 0.264702 q 0,0.132351 -0.124998,0.132351 h -0.463228 q -0.124998,0 -0.124998,-0.132351 v -0.23529 q 0,-0.54411 -0.529404,-0.54411 h -0.580874 q -0.529404,0 -0.529404,0.54411 v 2.389669 q 0,0.54411 0.529404,0.54411 h 0.580874 q 0.529404,0 0.529404,-0.54411 v -0.661754 q 0,-0.07353 -0.08088,-0.07353 h -0.595579 q -0.124998,0 -0.124998,-0.124998 v -0.374994 q 0,-0.124998 0.124998,-0.124998 h 1.235276 q 0.154409,0 0.154409,0.154409 v 1.235276 q 0,0.536756 -0.301466,0.838222 -0.301466,0.301466 -0.838223,0.301466 z'
            id='path420'
          />
          <path
            d='m 18.640777,16.728531 v -0.191174 q 0,-0.124998 0.124998,-0.124998 h 0.470581 q 0.124998,0 0.124998,0.124998 v 0.132351 q 0,0.308819 0.132351,0.448523 0.139704,0.132351 0.455875,0.132351 h 0.507346 q 0.316171,0 0.455875,-0.139704 0.139704,-0.147057 0.139704,-0.470581 v -0.169115 q 0,-0.235291 -0.183821,-0.367642 -0.176468,-0.139704 -0.44117,-0.176468 -0.264702,-0.04412 -0.580873,-0.117645 -0.316172,-0.07353 -0.580874,-0.169115 -0.264702,-0.09559 -0.448522,-0.360289 -0.176468,-0.264702 -0.176468,-0.67646 v -0.308819 q 0,-0.536757 0.301466,-0.838223 0.308819,-0.308818 0.845575,-0.308818 h 0.7794 q 0.54411,0 0.845576,0.308818 0.308818,0.301466 0.308818,0.838223 v 0.161762 q 0,0.124998 -0.124998,0.124998 h -0.470581 q -0.124998,0 -0.124998,-0.124998 v -0.09559 q 0,-0.316171 -0.139704,-0.448522 Q 20.72898,13.77269 20.412809,13.77269 H 19.94958 q -0.316171,0 -0.455875,0.147057 -0.132351,0.139703 -0.132351,0.485286 v 0.227938 q 0,0.330878 0.477934,0.448523 0.213232,0.05147 0.463228,0.08823 0.257349,0.03676 0.514698,0.110292 0.257349,0.07353 0.470581,0.198527 0.213233,0.117645 0.345583,0.367641 0.132351,0.242644 0.132351,0.595579 v 0.286761 q 0,0.536756 -0.308818,0.845575 -0.301466,0.301466 -0.838223,0.301466 h -0.823517 q -0.536757,0 -0.845575,-0.301466 -0.308819,-0.308819 -0.308819,-0.845575 z'
            id='path422'
          />
        </g>
      </svg>
    </button>
  )
}

export function LogText ({ selectedAnalysis }) {
  const { data, error, isLoading } = useSWR(
    typeof selectedAnalysis !== 'undefined' && selectedAnalysis !== null
      ? `/api/logs/${selectedAnalysis._id}`
      : null
    , baseFetcher
  )

  if (error || !data) return <p className='px-4 text-sm text-gray-600 dark:text-gray-400'>Could not fetch logs</p>
  if (isLoading) {
    return (
      <div className='flex flex-col items-center'>
        <Spinner aria-label='logs spinner' size='xl' color='warning' />
      </div>
    )
  }
  if (data.n_logs === 0) return <p className='px-4 text-sm text-gray-600 dark:text-gray-400'>No logs available</p>
  return (
    <div className='px-4'>
      {data.logs.map(
        (log, logIndex) => {
          return (
            <div key={`log-${logIndex}`} className='pl-4'>
              {log.logs_data.reverse().map(
                (row, rowIndex) => {
                  return (
                    <p key={`log-${logIndex}-row-${rowIndex}`} className='text-sm text-gray-600 dark:text-gray-400'>
                      {row}
                    </p>
                  )
                }
              )}
            </div>
          )
        }
      )}
    </div>
  )
}

export function LogDrawer ({ selectedAnalysis, setSelectedAnalysis }) {
  return (
    <div
      className={
        'fixed overflow-hidden z-10 bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out ' +
        (typeof selectedAnalysis !== 'undefined' && selectedAnalysis !== null
          ? 'transition-opacity opacity-100 duration-500 translate-y-0'
          : 'transition-all delay-500 opacity-0 translate-y-full')
      }
    >
      <div
        className={
          'bottom-0 left-0 h-2/5 absolute bg-white dark:bg-gray-800 w-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform ' +
          (typeof selectedAnalysis !== 'undefined' && selectedAnalysis !== null
            ? 'translate-y-0'
            : 'translate-y-full')
        }
      >
        <h5
          className='inline-flex items-center p-1.5 text-xl font-semibold text-gray-500 dark:text-gray-400'
        >
          <svg
            className='mr-2 w-5 h-5'
            aria-hidden='true'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
              clipRule='evenodd'
            />
          </svg>
          Logs
        </h5>
        <button
          className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
          onClick={() => setSelectedAnalysis(null)}
        >
          <svg
            aria-hidden='true'
            className='w-5 h-5'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>
        <article className='bottom-0 left-0 relative h-full px-2 flex flex-col space-x-6 overflow-x-scroll w-full'>
          <LogText selectedAnalysis={selectedAnalysis} />
        </article>
      </div>
      <div
        className='h-screen w-full cursor-pointer'
        onClick={() => {
          setSelectedAnalysis(null)
        }}
      />
    </div>
  )
}
