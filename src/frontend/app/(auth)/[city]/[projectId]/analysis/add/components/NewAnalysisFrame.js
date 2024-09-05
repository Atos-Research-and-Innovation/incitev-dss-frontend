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

import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getAnalysesStatus } from '@/components/backend/analyses'
import { getDefaults } from '@/components/backend/defaults'
import { getProjectShapefile } from '@/components/backend/projects'
import { getInputsFromGeoJS } from '@/components/Maps/utils'
import NewAnalysisForm from './NewAnalysisForm'
import shp from 'shpjs'

export default async function NewAnalysisFrame ({ params }) {
  const session = await getServerSession(authOptions)
  const shpres = await getProjectShapefile(params.projectId, session.user.token)
  if (shpres.status !== 200) {
    return (
      <div className='flex flex-wrap py-4 px-9 mx-auto mt-8 text-xl font-bold text-center text-red-400 bg-white rounded-2xl border shadow-lg lg:w-3/4'>
        Could not load shapefile: {JSON.stringify(shpres.body)}
      </div>
    )
  }
  const shapefile = Buffer.from(shpres.body, 'base64')
  const geojson = await shp(shapefile)
  const { allInputsValid } = getInputsFromGeoJS(geojson)

  let analyses = []
  const res = await getAnalysesStatus(params.projectId, session.user.token)
  if (res.status === 200) {
    analyses = res.body
  }

  let defaults = {}
  const resDefaults = await getDefaults(session.user.token)
  if (resDefaults.status === 200) {
    defaults = resDefaults.body
  }

  return (
    <>
      <div className='flex flex-col py-4 px-9 mx-auto mt-8 bg-white rounded-2xl shadow-lg lg:w-3/4 dark:bg-gray-900'>
        <NewAnalysisForm
          city={params.city}
          projectId={params.projectId}
          analyses={analyses}
          defaults={defaults}
          geojson={geojson}
          canDoPowerAnalysis={allInputsValid}
        />
      </div>
    </>
  )
}
