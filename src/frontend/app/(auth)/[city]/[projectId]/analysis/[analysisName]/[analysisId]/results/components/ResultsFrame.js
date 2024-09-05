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

import shp from 'shpjs'
import ExportButton from './ExportButton'
import ResultsMap from './ResultsMap'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getProjectShapefile } from '@/components/backend/projects'
import { getResults } from '@/components/backend/results'

export default async function ResultsFrame ({ params }) {
  const session = await getServerSession(authOptions)
  const shpres = await getProjectShapefile(params.projectId, session.user.token)
  if (shpres.status !== 200) {
    return (
      <div className='flex flex-wrap py-4 px-9 mx-auto mt-8 bg-white rounded-2xl border shadow-lg lg:w-3/4 text-xl font-bold text-center text-red-400'>
        Could not load shapefile: {JSON.stringify(shpres.body)}
      </div>
    )
  }
  const shapefile = Buffer.from(shpres.body, 'base64')
  const geojson = await shp(shapefile)
  const centerPt = geojson.features[0].geometry.bbox.slice(0, 2).reverse()

  const res = await getResults(params.projectId, params.analysisId, session.user.token)
  if (res.status !== 200) {
    return (
      <div className='flex flex-wrap py-4 px-9 mx-auto mt-8 bg-white rounded-2xl shadow-lg lg:w-3/4 text-xl font-bold text-center text-red-400'>
        Could not load results: {JSON.stringify(res.body)}
      </div>
    )
  }
  const analysisInputs = res.body
  let results = []
  let hasPowerOutputs = false
  if (analysisInputs.results.analysis_result) {
    results = analysisInputs.results.analysis_result
    results.forEach((val, ind) => {
      val.start_parking_time = analysisInputs.results.ubm_result.start_parking_time[ind]
      if (val.new_css) {
        val.NCSF = val.new_css.fast_cs
        val.NCSFAC = val.new_css.fast_accs
        val.NCSS = val.new_css.slow_cs
        delete val.new_css
      }
    })
    hasPowerOutputs = true
  } else {
    for (let i = 0; i < geojson.features.length; i++) {
      results.push(
        {
          start_parking_time: analysisInputs.results.ubm_result.start_parking_time[i],
          energy_required: analysisInputs.results.ubm_result.energy_required[i],
          spread_energy_required: analysisInputs.results.ubm_result.spread_energy_required[i]
        }
      )
    }
  }

  const projectName = decodeURI(params.city)

  return (
    <div className='grid grid-cols-1 py-4 px-9 mx-auto mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg lg:w-3/4'>
      <div className='grid grid-cols-2 gap-4'>
        <h1 className='mt-6 mb-6 text-3xl font-bold text-gray-500 dark:text-gray-300'>
          {projectName} - {analysisInputs.name}
        </h1>
        <div className='col-start-2'>
          <ExportButton results={analysisInputs} />
        </div>
      </div>
      <ResultsMap centerPt={centerPt} geojson={geojson} results={results} hasPowerOutputs={hasPowerOutputs} />
    </div>
  )
}
