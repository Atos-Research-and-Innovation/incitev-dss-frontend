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

export default function ExportButton ({ results }) {
  return (
    <button
      className='float-right mx-4 mt-6 w-12 h-12 text-gray-500 bg-transparent rounded border-2 border-gray-500 hover:text-white hover:bg-gray-500 hover:border-transparent'
      onClick={() => {
        const blob = new Blob([JSON.stringify(results)], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const elt = document.createElement('a')
        elt.style.display = 'none'
        elt.href = url
        elt.setAttribute('download', 'results.json')
        document.body.appendChild(elt)
        elt.click()
        window.URL.revokeObjectURL(url)
      }}
    >
      <svg
        aria-hidden='true'
        fill='currentColor'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          clipRule='evenodd'
          d='M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z'
          fillRule='evenodd'
        />
      </svg>
    </button>
  )
}
