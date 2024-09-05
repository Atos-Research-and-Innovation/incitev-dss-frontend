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

import * as Yup from 'yup'

export function getAreaBounds (geojson) {
  const bounds = geojson.features.reduce(
    (acc, val) => {
      const upper = val.geometry.bbox.slice(0, 2).reverse()
      const lower = val.geometry.bbox.slice(2, 4).reverse()
      return [
        [Math.max(acc[0][0], upper[0]), Math.max(acc[0][1], upper[1])],
        [Math.min(acc[1][0], lower[0]), Math.min(acc[1][1], lower[1])]
      ]
    },
    [
      geojson.features[0].geometry.bbox.slice(0, 2).reverse(),
      geojson.features[0].geometry.bbox.slice(2, 4).reverse()
    ]
  )
  return bounds
}

/* Schema for validating zone level inputs of the power and charging infrastructure
  * module.
  */
export const zoneLevelInputsSchema = {
  /* CIY */
  SCS: { // ECSF in analyses
    validationFunc: Yup.number().integer().min(0),
    description: 'Number of slow charging points (<7 kW) in the zone.'
  },
  FACCS: { // ECSFAC in analyses
    validationFunc: Yup.number().integer().min(0),
    description: 'Number of fast AC charging points (7-22 kW) in the zone.'
  },
  FCS: { // ECSS in analyses
    validationFunc: Yup.number().integer().min(0),
    description: 'Number of fast charging points (> 22kW) in the zone.'
  },
  /* PowerY */
  /* ROIG: */
  /* AY: */
  ML: {
    validationFunc: Yup.number().min(0),
    description: 'Maximum loading that occurs at the transformer in %.'
  },
  /* PP: */
  /* PPP: */
  /* SPP: */
  /* SPPP: */
  TNP: { // TNRP in analyses
    validationFunc: Yup.number().min(0),
    description: 'Transformer nominal power in kVA.'
  },
  Zone_type: {
    validationFunc: Yup.string().oneOf(['Residential', 'Commercial']),
    description: 'Type of zone. Can be only "Residential" or "Commercial".'
  }
}

/* Returns an object with the count of valid inputs for each zone.
  * WARNING: This function mutates the geojson data by adding an "invalid" property
  * in the geojson.features[i].properties object to indicate if the inputs are not valid.
  *
  * @param {Object} geojson - the geojson data of interest.
  *
  * @returns {Object} - an object with the count of valid inputs for each zone and a boolean
  * indicating if all inputs are valid.
  */
export function getInputsFromGeoJS (geojson) {
  const inputsCount = {}
  for (const key of Object.keys(zoneLevelInputsSchema)) {
    inputsCount[key] = 0
  }

  let allInputsValid = true
  geojson.features.forEach(feature => {
    for (const key of Object.keys(inputsCount)) {
      if (key in feature.properties) {
        try {
          zoneLevelInputsSchema[key].validationFunc.validateSync(feature.properties[key])
          inputsCount[key] += 1
        } catch (error) {
          allInputsValid = false
          feature.properties.invalid = true
        }
      } else {
        allInputsValid = false
      }
    }
  })
  return { inputsCount, allInputsValid }
}
