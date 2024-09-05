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

import { FORECAST_YEAR_MAPPING } from '../components/DCMRatioForm.js'

const ROUND_DEC = 4 // Number of decimals to use for rounding numbers in distributions.

/**
 * Write the given analysis data in a formik form using the given setFieldValue function.
 * IMPORTANT: Any transformation made to the data prior to its writing in the form
 * should be reversed in the getValuesToSubmit function.
 *
 * @param {Object} data - The analysis data to write in the form.
 * @param {Function} setFieldValue - The setFieldValue function from formik.
 *
 */
export function writeFormData (data, setFieldValue, setTouched) {
  if (data.name) {
    setFieldValue('name', data.name)
  }
  if (data.ubmY) {
    if (data.ubmY.input) {
      if (data.ubmY.input.total_urban_trips) {
        setFieldValue(
          'total_urban_trips',
          data.ubmY.input.total_urban_trips[0]
        )
      }
      if (data.ubmY.input.total_incoming_trips) {
        setFieldValue(
          'total_incoming_trips',
          data.ubmY.input.total_incoming_trips[0]
        )
      }
      if (data.ubmY.input.total_outgoing_trips) {
        setFieldValue(
          'total_outgoing_trips',
          data.ubmY.input.total_outgoing_trips[0]
        )
      }
      if (data.ubmY.input.average_number_trips) {
        setFieldValue(
          'average_number_trips',
          data.ubmY.input.average_number_trips[0]
        )
      }
      if (data.ubmY.input.bevs_ratio) {
        setFieldValue(
          'bevs_ratio',
          data.ubmY.input.bevs_ratio * 100
        )
      }
      if (data.ubmY.input.phevs_ratio) {
        setFieldValue(
          'phevs_ratio',
          data.ubmY.input.phevs_ratio * 100
        )
      }
    }
    if (data.ubmY.config) {
      if (data.ubmY.config.night_ratio) {
        if (data.ubmY.config.night_ratio.home_public) {
          setFieldValue(
            'home_public',
            data.ubmY.config.night_ratio.home_public * 100
          )
        }
        if (data.ubmY.config.night_ratio.home_private) {
          setFieldValue(
            'home_private',
            data.ubmY.config.night_ratio.home_private * 100
          )
        }
      }
      if (data.ubmY.config.day_ratio) {
        if (data.ubmY.config.day_ratio.work_public) {
          setFieldValue(
            'work_public',
            data.ubmY.config.day_ratio.work_public * 100
          )
        }
        if (data.ubmY.config.day_ratio.work_private) {
          setFieldValue(
            'work_private',
            data.ubmY.config.day_ratio.work_private * 100
          )
        }
        if (data.ubmY.config.day_ratio.other_public) {
          setFieldValue(
            'other_public',
            data.ubmY.config.day_ratio.other_public * 100
          )
        }
      }
      setTouched({ home_public: true }) // To trigger the update of the cp_total field.
      if (data.ubmY.config.km_travelled_dist) {
        setFieldValue(
          'travel_dist',
          distribToArray(
            data.ubmY.config.km_travelled_dist
          )
        )
        setTouched({ travel_dist: true }) // To trigger the update of the travel dist chart.
      }
    }
  }
  if (data.powerY) {
    if (data.powerY.CIY) {
      setFieldValue('ciy', data.powerY.CIY)
    }
    if (data.powerY.AY) {
      const year = data.powerY.AY
      if (FORECAST_YEAR_MAPPING[JSON.stringify(year)]) {
        setFieldValue('year', data.powerY.AY)
        setFieldValue('forecast_year', JSON.stringify(data.powerY.AY))
      }
      setTouched({ forecast_year: true }) // To trigger the update of the tdp field.
    }
    if (data.powerY.TDP) {
      setFieldValue('tdp', data.powerY.TDP)
    }
  }
}

/**
 * Returns a {keys: values} dictionary representing a distribution, as expected by
 * the DSS backend API. Keys are string representing numbers, sorted in ascending
 * order, while values are percentage, rounded. All non numeric entries are ignored.
 *
 * @param {Array} distribArray - An array of object containing a single observation in
 * the form {key: key, value: value}.
 *
 * @return {Object} The dictionary representation of the given distribution.
 *
 * @example
 * // returns {1: 8,1235, 2: 5,45}
 * getDistributionDict([{key: 2, value: 5.45}, {key: 1, value: 8.12345}])
 *
 */
export function getDistributionDict (distribArray) {
  const unordered = {}
  for (const obj of distribArray) {
    if (!isNaN(obj.key) && !isNaN(obj.value)) {
      unordered[obj.key.toString()] = Math.round(parseFloat(obj.value / 100) * (10 ** ROUND_DEC)) / (10 ** ROUND_DEC)
    }
  }
  const distrib = Object.keys(unordered).sort((x, y) => x - y).reduce(
    (acc, curr) => {
      acc[curr.replace('.', ',')] = unordered[curr]
      return acc
    },
    {}
  )
  return distrib
}

/**
 * Returns whether or not a given dictionary representation is valid for the DSS
 * backend API, i.e. whether or not all its values are numeric, and sums up to 1.
 *
 * @param {Object} distrib - The distribution of interest.
 *
 * @return {boolean} Whether or not the distribution is valid.
 *
 * @example
 * // returns true
 * distribToArray({1: 15, 2: 25, 10: 60})
 *
 * @example
 * // returns false
 * distribToArray({1: 10, 2: 25})
 *
 */
export function validateDistribution (distrib) {
  const vals = Array.from(Object.values(distrib))
  if (vals.every(val => typeof (val) === 'number')) {
    let total = Array.from(
      vals,
      val => parseFloat(val)
    ).reduce((a, b) => a + b, 0)
    total = Math.round(parseFloat(total) * (10 ** ROUND_DEC)) / (10 ** ROUND_DEC)
    if (total === 1) {
      return true
    }
  }
  return false
}

/**
 * Returns an array of single entry objects, given a dictionary. Intended to convert
 * a distribution from an analysis provided by the DSS backend API into an array that
 * can be easily edited in the frontend.
 *
 * @param {Object} distrib - The distribution of interest.
 *
 * @return {Array} The array representation of the distribution.
 *
 * @example
 * // returns [{key: 1, value: 8.12345}, {key: 2, value: 5.45}]
 * distribToArray({1: 8,1235, 2: 5,45})
 *
 */
export function distribToArray (distrib) {
  const array = []
  for (const entryKey in distrib) {
    const val = 100 * distrib[entryKey]
    const value = val.toFixed(2)
    const key = entryKey.replace(',', '.')
    array.push({ key, value })
  }
  return array
}

/**
 * Returns an object representing the expected payload to create an analysis using the
 * POST /analysis/{projectId} endpoint of the DSS backend API.
 *
 * @param {Object} values - The values, as parsed by the NewAnalysisForm component.
 * @param {boolean} canDoPowerAnalysis - Whether or not adding power and charging
 * infrastructure inputs to the analysis.
 *
 * @return {Object} The analysis inputs object.
 *
 */
export function getValuesToSubmit (values, canDoPowerAnalysis) {
  const valuesToSubmit = {
    name: values.name,
    status: 'running',
    ubmY: {
      input: {
        total_urban_trips: [values.total_urban_trips],
        total_incoming_trips: [values.total_incoming_trips],
        total_outgoing_trips: [values.total_outgoing_trips],
        average_number_trips: [values.average_number_trips],
        bevs_ratio: values.bevs_ratio / 100,
        phevs_ratio: values.phevs_ratio / 100
      },
      config: {
        night_ratio: {
          home_public: values.home_public / 100,
          home_private: values.home_private / 100
        },
        day_ratio: {
          work_public: values.work_public / 100,
          work_private: values.work_private / 100,
          other_public: values.other_public / 100,
          other_semi_public: 0,
          fast: 0
        },
        km_travelled_dist: getDistributionDict(values.travel_dist)
      }
    },
    max_epoch: 3,
    simulation_days: 3,
    outputsY: {
      LW: 50000,
      TNP: 5000
    },
    default: true
  }

  if (canDoPowerAnalysis) {
    valuesToSubmit.powerY = {
      CIY: values.ciy,
      AY: values.forecast_year,
      TDP: values.tdp
    }
    valuesToSubmit.ciY = {
      CIY: values.ciy,
      CI_database: [
        {
          manufacturer: 'Etrel 1',
          max_output_power: 22,
          installation_cost: 1000,
          maintenance_cost: 3000,
          authorization: 'PIN code',
          EV_communication: 'IEC 61851 & IEC15118'
        },
        {
          manufacturer: 'Etrel 2',
          max_output_power: 11,
          installation_cost: 500,
          maintenance_cost: 2000,
          authorization: 'PIN code, RFID',
          EV_communication: 'IEC 61851 & IEC15118'
        },
        {
          manufacturer: 'Efacec 1',
          max_output_power: 3.7,
          installation_cost: 300,
          maintenance_cost: 1500,
          authorization: 'RFID',
          EV_communication: 'IEC 61851'
        },
        {
          manufacturer: 'Efacec 2',
          max_output_power: 12,
          installation_cost: 500,
          maintenance_cost: 1500,
          authorization: 'RFID',
          EV_communication: 'IEC 61851'
        },
        {
          manufacturer: 'Mitja 1',
          max_output_power: 25,
          installation_cost: 3000,
          maintenance_cost: 5000,
          authorization: 'PIN code',
          EV_communication: 'IEC 61851 & IEC15118'
        },
        {
          manufacturer: 'Mitja 2',
          max_output_power: 30,
          installation_cost: 2000,
          maintenance_cost: 6000,
          authorization: 'PIN code, RFID',
          EV_communication: 'IEC 61851 & IEC15118'
        },
        {
          manufacturer: 'Klemen 1',
          max_output_power: 4,
          installation_cost: 150,
          maintenance_cost: 800,
          authorization: 'RFID',
          EV_communication: 'IEC 61851'
        },
        {
          manufacturer: 'Klemen 2',
          max_output_power: 5,
          installation_cost: 200,
          maintenance_cost: 900,
          authorization: 'RFID',
          EV_communication: 'IEC 61851'
        },
        {
          manufacturer: 'Janja 1',
          max_output_power: 12,
          installation_cost: 400,
          maintenance_cost: 800,
          authorization: 'RFID',
          EV_communication: 'IEC 61851'
        },
        {
          manufacturer: 'Janja 2',
          max_output_power: 5,
          installation_cost: 200,
          maintenance_cost: 900,
          authorization: 'RFID',
          EV_communication: 'IEC 61851'
        }
      ]
    }
  }

  return valuesToSubmit
}
