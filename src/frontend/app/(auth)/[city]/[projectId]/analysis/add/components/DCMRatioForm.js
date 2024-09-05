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
import { FormSelect, Separator } from './FormFields'
import { FormInput } from '../../../../../../components/Forms/Fields'

export const FORECAST_YEAR_MAPPING = {
  2023: '2023',
  2024: '2024',
  2025: '2025',
  2026: '2026',
  2027: '2027',
  2028: '2028',
  2029: '2029',
  2030: '2030',
  2031: '2031',
  2032: '2032',
  2033: '2033',
  2034: '2034',
  2035: '2035'
}

export const DIFFUSION_MAPPING = {
  'None (only home/private charging)': 0,
  '1 out of 4 (25%)': 2.5,
  '1 out of 2 (50%)': 5,
  '3 out of 4 (75%)': 7.5,
  'All (100%)': 10
}

export const EV_PRICE_MAPPING = {
  'Costs half of ICE (-50%)': 0.5,
  'Costs 20% less than ice (-20%)': 0.8,
  'Costs same as ICE (100%)': 1,
  'Costs 20% more than ICE (120%)': 1.2,
  'Costs 50% more than an ICE (150%)': 1.5,
  'Costs double of ICE (200%)': 2,
  'Costs three times ICE (300%)': 3
}

export const EV_RANGE_MAPPING = {
  'Range is half of ICE (-50%)': 0.5,
  'Range is 20% less than ice (-20%)': 0.8,
  'Range is same as ICE (100%)': 1,
  'Range is 20% more than ICE (120%)': 1.2,
  'Range is 50% more than an ICE (150%)': 1.5,
  'Range is double of ICE (200%)': 2,
  'Range is three times ICE (300%)': 3
}

export const ENERGY_COST_MAPPING = {
  '25 % cheaper': -2.5,
  'Same price': 0,
  '25 % more expensive': 2.5
}

export const PURCHASE_INCENTIVE_MAPPING = {
  'Disincentive (taxes based on CO2 emissions and engine power)': -1,
  'No incentives': 0,
  'Limited (3k€ with scrapping)': 1,
  'Medium (6k€ with scrapping)': 2,
  'High (10k€ with scrapping)': 3
}

export const UTILIZATION_INCENTIVES_MAPPING = {
  'No incentives': 0,
  'Limited (access and free parking in LTZ)': 1,
  'High (access to bus lane, LTZ, free parking)': 2
}

async function getDCMRatioValues (values, setFieldValue, setIsFetching, setError, evSpreadTabRef) {
  setError(null)
  setIsFetching(true)
  const valuesToSubmit = {
    total_urban_trips: [values.total_urban_trips],
    total_outgoing_trips: [values.total_outgoing_trips],
    average_number_trips: [values.average_number_trips],
    forecast_year: values.forecast_year,
    vehicle_imm_t0: values.vehicle_imm_t0,
    bev_vehicle_t0: values.bev_vehicle_t0,
    phev_vehicle_t0: values.phev_vehicle_t0,
    price_ice: values.price_ice / 10000,
    range_ice: values.range_ice / 100,
    diffusion: values.diffusion,
    coef_price_bev: values.coef_price_bev,
    coef_price_phev: values.coef_price_phev,
    coef_range_bev: values.coef_range_bev,
    coef_range_phev: values.coef_range_phev,
    cost_bev: values.cost_bev,
    cost_phev: values.cost_phev,
    purchase_incentives_bev: values.purchase_incentives_bev,
    purchase_incentives_phev: values.purchase_incentives_phev,
    utilization_incentives_bev: values.utilization_incentives_bev,
    utilization_incentives_phev: values.utilization_incentives_phev
  }
  fetch('/api/dcm/ratio', {
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
        console.dir(data)
        setFieldValue('bevs_ratio', Math.round(1000 * data.output.bev) / 10)
        setFieldValue('phevs_ratio', Math.round(1000 * data.output.phevs) / 10)
        // Switch back to first tab
        evSpreadTabRef.current?.setActiveTab(0)
      } else {
        setError(data.message)
      }
    })
  setIsFetching(false)
}

export function DCMRatioForm ({ values, setFieldValue, evSpreadTabRef, isSubmitting }) {
  const [error, setError] = useState(null)
  const [isFetching, setIsFetching] = useState(false)
  return (
    <div className='flex-wrap mx-2'>
      <div className='grid grid-cols-2 gap-4 mt-4'>
        <FormInput
          label='Total new cars'
          tooltip={`Total new cars registered in the city in ${values.forecast_year}`}
          name='vehicle_imm_t0'
          type='number'
          min={0}
          required
          disabled={isSubmitting}
        />
        <FormInput
          label='Average ICE price (€)'
          tooltip='Average price of Internal Combustion Engine (ICE) vehicles in the city (minimum 10 000 €, maximum 100 000 €)'
          name='price_ice'
          type='number'
          min={10000}
          max={100000}
          required
          disabled={isSubmitting}
        />
        <FormInput
          label='Total BEVs'
          tooltip={`Total number of Battery Electric Vehicles (BEV) registered in the city in ${values.forecast_year}`}
          name='bev_vehicle_t0'
          type='number'
          min={0}
          required
          disabled={isSubmitting}
        />
        <FormInput
          label='Average ICE range (km)'
          tooltip='Average range of Internal Combustion Engine vehicles in the city (minimum 100 km, maximum 1000 km)'
          name='range_ice'
          type='number'
          min={100}
          max={1000}
          required
          disabled={isSubmitting}
        />
        <FormInput
          label='Total PHEVs'
          tooltip={`Total number of Plug-In Electric Vehicles (PHEV) registered in the city in ${values.forecast_year}`}
          name='phev_vehicle_t0'
          type='number'
          min={0}
          required
          disabled={isSubmitting}
        />
        <FormSelect
          name='diffusion'
          label='Number of charging points'
          options={DIFFUSION_MAPPING}
          tooltip='Diffusion of public charging points'
          value={Object.keys(DIFFUSION_MAPPING).find(key => DIFFUSION_MAPPING[key] === values.diffusion)}
          required
          disabled={isSubmitting}
          onChange={event => setFieldValue('diffusion', DIFFUSION_MAPPING[event.currentTarget.value])}
        />
        <div className='flex flex-col gap-4'>
          <Separator label='BEVs' />
          <FormSelect
            name='coef_price_bev'
            label='Car cost'
            options={EV_PRICE_MAPPING}
            value={Object.keys(EV_PRICE_MAPPING).find(key => EV_PRICE_MAPPING[key] === values.coef_price_bev)}
            required
            disabled={isSubmitting}
            onChange={event => setFieldValue('coef_price_bev', EV_PRICE_MAPPING[event.currentTarget.value])}
          />
          <FormSelect
            name='coef_range_bev'
            label='Car range'
            options={EV_RANGE_MAPPING}
            value={Object.keys(EV_RANGE_MAPPING).find(key => EV_RANGE_MAPPING[key] === values.coef_range_bev)}
            required
            disabled={isSubmitting}
            onChange={event => setFieldValue('coef_range_bev', EV_RANGE_MAPPING[event.currentTarget.value])}
          />
          <FormSelect
            name='cost_bev'
            label='Cost of energy for 100 km, compared to national price of energy'
            options={ENERGY_COST_MAPPING}
            value={Object.keys(ENERGY_COST_MAPPING).find(key => ENERGY_COST_MAPPING[key] === values.cost_bev)}
            required
            disabled={isSubmitting}
            onChange={event => setFieldValue('cost_bev', ENERGY_COST_MAPPING[event.currentTarget.value])}
          />
          <FormSelect
            name='purchase_incentives_bev'
            label='Incentives for purchasing a BEV'
            options={PURCHASE_INCENTIVE_MAPPING}
            value={Object.keys(PURCHASE_INCENTIVE_MAPPING).find(key => PURCHASE_INCENTIVE_MAPPING[key] === values.purchase_incentives_bev)}
            required
            disabled={isSubmitting}
            onChange={event => setFieldValue('purchase_incentives_bev', PURCHASE_INCENTIVE_MAPPING[event.currentTarget.value])}
          />
          <FormSelect
            name='utilization_incentives_bev'
            label='Incentives for using a BEV'
            options={UTILIZATION_INCENTIVES_MAPPING}
            value={Object.keys(UTILIZATION_INCENTIVES_MAPPING).find(key => UTILIZATION_INCENTIVES_MAPPING[key] === values.utilization_incentives_bev)}
            required
            disabled={isSubmitting}
            onChange={event => setFieldValue('utilization_incentives_bev', UTILIZATION_INCENTIVES_MAPPING[event.currentTarget.value])}
          />
        </div>
        <div className='flex flex-col gap-4'>
          <Separator label='PHEVs' />
          <FormSelect
            name='coef_price_phev'
            label='Car cost'
            options={EV_PRICE_MAPPING}
            value={Object.keys(EV_PRICE_MAPPING).find(key => EV_PRICE_MAPPING[key] === values.coef_price_phev)}
            required
            disabled={isSubmitting}
            onChange={event => setFieldValue('coef_price_phev', EV_PRICE_MAPPING[event.currentTarget.value])}
          />
          <FormSelect
            name='coef_range_phev'
            label='Car range'
            options={EV_RANGE_MAPPING}
            value={Object.keys(EV_RANGE_MAPPING).find(key => EV_RANGE_MAPPING[key] === values.coef_range_phev)}
            required
            disabled={isSubmitting}
            onChange={event => setFieldValue('coef_range_phev', EV_RANGE_MAPPING[event.currentTarget.value])}
          />
          <FormSelect
            name='cost_phev'
            label='Cost of energy for 100 km, compared to national price of energy'
            options={ENERGY_COST_MAPPING}
            value={Object.keys(ENERGY_COST_MAPPING).find(key => ENERGY_COST_MAPPING[key] === values.cost_phev)}
            required
            disabled={isSubmitting}
            onChange={event => setFieldValue('cost_phev', ENERGY_COST_MAPPING[event.currentTarget.value])}
          />
          <FormSelect
            name='purchase_incentives_phev'
            label='Incentives for purchasing a PHEV'
            options={PURCHASE_INCENTIVE_MAPPING}
            value={Object.keys(PURCHASE_INCENTIVE_MAPPING).find(key => PURCHASE_INCENTIVE_MAPPING[key] === values.purchase_incentives_phev)}
            required
            disabled={isSubmitting}
            onChange={event => setFieldValue('purchase_incentives_phev', PURCHASE_INCENTIVE_MAPPING[event.currentTarget.value])}
          />
          <FormSelect
            name='utilization_incentives_phev'
            label='Incentives for using a PHEV'
            options={UTILIZATION_INCENTIVES_MAPPING}
            value={Object.keys(UTILIZATION_INCENTIVES_MAPPING).find(key => UTILIZATION_INCENTIVES_MAPPING[key] === values.utilization_incentives_phev)}
            required
            disabled={isSubmitting}
            onChange={event => setFieldValue('utilization_incentives_phev', UTILIZATION_INCENTIVES_MAPPING[event.currentTarget.value])}
          />
        </div>
      </div>
      <button
        type='button'
        className='py-2 px-3 mt-2 w-full text-xl text-white bg-gray-700 rounded-lg border border-gray-700 hover:bg-gray-500'
        disabled={isSubmitting || isFetching}
        onClick={async () => {
          await getDCMRatioValues(values, setFieldValue, setIsFetching, setError, evSpreadTabRef)
        }}
      >
        {isFetching ? <Spinner aria-label='fetching-ratio-dcm' color='warning' /> : 'Get electric vehicles ratios'}
      </button>
      {error && (
        <div className='pt-2 text-xl font-bold text-center text-red-400'>
          {error}
        </div>
      )}
    </div>
  )
}
