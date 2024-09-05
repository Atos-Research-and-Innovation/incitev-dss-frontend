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

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.js',
    './pages/**/*.js',
    './node_modules/flowbite-react/**/*.js'
  ],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'incitEV-blue': '#ace6ea',
        'incitEV-dark-blue': '#2A555A',
        'incitEV-yellow': '#ead228',
        'incitEV-grey': '#4a535b',
        'incitEV-canary': '#f9e27d'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [
    require('flowbite/plugin')
  ]
}
