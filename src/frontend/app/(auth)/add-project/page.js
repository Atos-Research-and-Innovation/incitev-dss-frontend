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

import { Suspense } from 'react'
import PageLoading from '../../components/Loading/PageLoading'
import Wizard1 from './components/Wizard1.js'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'
import { getProjectList } from '../../components/backend/projects'

export default async function AddProjectPage () {
  const session = await getServerSession(authOptions)
  const projects = await getProjectList(session.user.token)
  const projectNames = Array.from(projects, project => project.name)

  return (
    <Suspense fallback=<PageLoading text='Fetching results ...' />>
      <Wizard1 projectNames={projectNames} />
    </Suspense>
  )
}
