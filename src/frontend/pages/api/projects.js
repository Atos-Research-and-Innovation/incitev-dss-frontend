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

import { createProject, getProjectList } from '../../app/components/backend/projects'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../pages/api/auth/[...nextauth]'

export default async function handler (req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session || !session.user) {
    res.status(401).json({ message: 'Unauthorized: Invalid or expired session, please sign in' })
    return
  }

  if (req.method === 'POST') {
    const resp = await createProject(req.body, session.user.token)
    res.status(resp.status).json(resp.body)
  } else if (req.method === 'GET') {
    const resp = await getProjectList(session.user.token)
    res.status(200).json(resp)
  } else {
    res.status(200).json({ name: 'api/projects' })
  }
}
