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

import Image from 'next/image'
import EuFlag from '../../../public/european-flag.png'

export default function EuAcknowledge () {
  return (
    <>
      <div className='container flex flex-row justify-center p-6 mx-auto'>
        <div>
          <Image src={EuFlag} width={60} height='auto' alt='European Flag' />
        </div>
        <div className='pl-2 dark:text-white'>
          <p>
            This project has received funding from the European Union’s Horizon
            2020 research and innovation programme under grant agreement
            N°875683.
          </p>
        </div>
      </div>
    </>
  )
}
