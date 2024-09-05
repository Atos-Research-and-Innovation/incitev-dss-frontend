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
import Loading from '../components/Home/loading.js'
import ProjectList from '../components/Home/ProjectsList.js'
import CommonNav from '../components/NavBar/CommonNav.js'

export default function HomePage () {
  return (
    <>
      <Suspense fallback=<Loading />>
        <CommonNav title='Projects' refresh addIcon addUrl='/add-project'>
          <ProjectList />
        </CommonNav>
      </Suspense>
    </>
  )
}
