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
import { useState } from 'react'
import { Spinner } from 'flowbite-react'
import { FormSelect } from './FormFields'
import { FormInput } from '../../../../../../components/Forms/Fields'

export const CHARGING_PRICE_MAPPING = {
  'Periodic subscription': 0.5,
  '-50% EU home price': 1,
  'EU home price': 2,
  '3 times EU home price': 6
}

export const WAITING_MAPPING = {
  '<10 minutes': 1,
  '10-30 minutes': 3,
  '>30 minutes': 5
}

export const CHARGING_TIME_MAPPING = {
  '2 hours': 0.5,
  '1 hour': 1,
  '30 minutes': 2,
  '15 minutes': 4
}

async function getDCMChargingValues (values, setFieldValue, setTouched, setIsFetching, setError, cpUtilTabRef) {
  setError(null)
  setIsFetching(true)
  const valuesToSubmit = {
    charging_price: values.charging_price,
    waiting_time: values.waiting_time,
    charging_time: values.charging_time,
    renewable_energy: values.renewable_energy / 100
  }
  fetch('/api/dcm/charging', {
    method: 'POST',
    mode: 'no-cors',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(valuesToSubmit)
  })
    .then(res => res.json())
    .then(data => {
      if (!data.error) {
        setFieldValue('home_public', Math.round(100 * data.output.night_ratio.home_public))
        setFieldValue('home_private', Math.round(100 * data.output.night_ratio.home_private))
        setFieldValue('work_public', Math.round(100 * data.output.day_ratio.work_public))
        setFieldValue('work_private', Math.round(100 * data.output.day_ratio.work_private))
        setFieldValue('other_public', Math.round(100 * data.output.day_ratio.other_public))
        setFieldValue('other_semi_public', Math.round(100 * data.output.day_ratio.other_semi_public))
        setFieldValue('fast', Math.round(100 * data.output.day_ratio.fast))
        // Switch back to first tab
        cpUtilTabRef.current?.setActiveTab(0)
        setTouched({ fast: true }) // Triggers the update of the cp_total field
      } else {
        setError(data.message)
      }
    })
  setIsFetching(false)
}

export function DCMChargingForm ({ values, setFieldValue, cpUtilTabRef, setTouched, isSubmitting }) {
  const [error, setError] = useState(null)
  const [isFetching, setIsFetching] = useState(false)
  return (
    <div className='flex-wrap mx-2'>
      <div className='grid grid-cols-2 gap-4'>
        <FormSelect
          name='charging_price'
          label='What is the price of charging per 100 km ?'
          options={CHARGING_PRICE_MAPPING}
          value={Object.keys(CHARGING_PRICE_MAPPING).find(key => CHARGING_PRICE_MAPPING[key] === values.charging_price)}
          required
          disabled={isSubmitting}
          onChange={event => setFieldValue('charging_price', CHARGING_PRICE_MAPPING[event.currentTarget.value])}
        />
        <FormSelect
          name='waiting_time'
          label='Average waiting time at charging points ?'
          options={WAITING_MAPPING}
          value={Object.keys(WAITING_MAPPING).find(key => WAITING_MAPPING[key] === values.waiting_time)}
          required
          disabled={isSubmitting}
          onChange={event => setFieldValue('waiting_time', WAITING_MAPPING[event.currentTarget.value])}
        />
        <FormSelect
          name='charging_time'
          label='Charging time to reach 50% of the battery ?'
          options={CHARGING_TIME_MAPPING}
          defaultValueChecked={Object.keys(CHARGING_TIME_MAPPING).find(key => CHARGING_TIME_MAPPING[key] === values.charging_time)}
          disabled={isSubmitting}
          onChange={event => setFieldValue('charging_time', CHARGING_TIME_MAPPING[event.currentTarget.value])}
        />
        <FormInput
          name='renewable_energy'
          label='Percentage of renewable energy in the grid ?'
          type='number'
          min='0'
          max='100'
          step='1'
          required
          disabled={isSubmitting}
        />
      </div>
      <button
        type='button'
        className='py-2 px-3 mt-2 w-full text-xl text-white bg-gray-700 rounded-lg border border-gray-700 hover:bg-gray-500'
        disabled={isSubmitting || isFetching}
        onClick={async () => {
          await getDCMChargingValues(values, setFieldValue, setTouched, setIsFetching, setError, cpUtilTabRef)
        }}
      >
        {isFetching ? <Spinner aria-label='fetching-charging-dcm' color='warning' /> : 'Get utilization distribution'}
      </button>
      {error && (
        <div className='pt-2 text-xl font-bold text-center text-red-400'>
          {error}
        </div>
      )}
    </div>
  )
}
