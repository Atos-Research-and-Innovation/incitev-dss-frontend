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

export async function getAnalysesStatus (projectId, token) {
  const res = await fetch(
    process.env.DSS_BACKEND_BASE_URL + 'analyses/status/' + projectId,
    {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        Authorization: token
      },
      next: { revalidate: 60 }
    }
  ).then(res => res)
  const data = await res
    .json()
    .then(data => ({ status: res.status, body: data }))
  return data
}

export async function getAnalysis (projectId, analysisId, token) {
  const res = await fetch(
    process.env.DSS_BACKEND_BASE_URL + `analyses/${projectId}/${analysisId}`,
    {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        Authorization: token
      }
    }
  ).then(res => res)
  const data = await res
    .json()
    .then(data => ({ status: res.status, body: data }))
  return data
}

export async function createAnalysis (projectId, values, token) {
  const res = await fetch(
    process.env.DSS_BACKEND_BASE_URL + 'analyses/' + projectId,
    {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        Authorization: token,
        'Content-Type': 'application/json'
      },
      body: values
    }
  )
  const data = await res
    .json()
    .then(data => ({ status: res.status, body: data }))
  return data
}

export async function deleteAnalysis (projectId, analysisId, token) {
  const res = await fetch(
    process.env.DSS_BACKEND_BASE_URL + `analyses/${projectId}/${analysisId}`,
    {
      method: 'DELETE',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        Authorization: token
      }
    }
  ).then(res => res)
  if (res.status === 200) {
    return null
  }
}
