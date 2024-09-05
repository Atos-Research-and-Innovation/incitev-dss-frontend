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

import '../styles/output.css'
import { Montserrat } from '@next/font/google'
import HeadingNav from '../components/NavBar/HeadingNav.js'
import Footer from '../components/Footer/Footer.js'

const montserrat = Montserrat({ subsets: ['latin'] })

export default function BaseLayout (props) {
  return (
    <html className={montserrat.className}>
      <head />
      <body className='flex flex-col'>
        <div className='overflow-auto min-h-screen bg-incitEV-blue dark:bg-incitEV-dark-blue'>
          <HeadingNav includeProfile={props.includeProfile} />
          <main>
            <div className='overflow-auto flex-grow'>
              <div className='mt-6 mb-6'>{props.children}</div>
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
