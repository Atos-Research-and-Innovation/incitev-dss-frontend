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
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useEffect, useRef, useState } from 'react'
import { FormInput, FormFile, HelpIcon } from '../../../../../../components/Forms/Fields'
import { useRouter } from 'next/navigation'
import { CategoryHeader, Distribution, FormSelect, Separator } from './FormFields'
import {
  distribToArray,
  getDistributionDict,
  getValuesToSubmit,
  validateDistribution,
  writeFormData
} from '../utils/utils'
import {
  CHARGING_TIME_MAPPING,
  CHARGING_PRICE_MAPPING,
  WAITING_MAPPING,
  DCMChargingForm
} from './DCMChargingForm'
import {
  FORECAST_YEAR_MAPPING,
  DIFFUSION_MAPPING,
  ENERGY_COST_MAPPING,
  EV_PRICE_MAPPING,
  PURCHASE_INCENTIVE_MAPPING,
  EV_RANGE_MAPPING,
  UTILIZATION_INCENTIVES_MAPPING,
  DCMRatioForm
} from './DCMRatioForm'
import { CPUtilizationChart, TravelledDistanceChart } from './AnalysisCharts'
import { Accordion, Alert, Dropdown, Select, Spinner, Tabs, ToggleSwitch } from 'flowbite-react'

/**
 * Returns a React component to render the form to fill to create a new
 * analysis. The form cannot be submitted if any field is not valid.
 *
 * @param {string} city - Name of the city of interest.
 * @param {string} projectId - ID of the parent project.
 * @param {string} analyses - List of names of existing analyses.
 * @param {object} defaults - Dictionary of defaults values for the form.
 * @param {object} geojson - GeoJSON object derived from the project shapefile.
 * @param {boolean} canDoPowerAnalysis - Boolean indicating if power & charging
 * infrastructure analysis can be performed.
 *
 */
export default function NewAnalysisForm ({ city, projectId, analyses, defaults, geojson, canDoPowerAnalysis }) {
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [fieldWriter, setFieldWriter] = useState(() => {})
  const [touchForm, setTouchForm] = useState(() => {})
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [dupAnalysis, setDupAnalysis] = useState({})
  const [powerAnalysisWarningVisible, setPowerAnalysisWarningVisible] = useState(!canDoPowerAnalysis)

  // Gets ref and state for DCM tabs, to switch tabs automatically
  // once the user has filled the DCM form.
  const evSpreadTabRef = useRef(null)
  const [, setEvSpreadTabActive] = useState(0)
  const cpUtilTabRef = useRef(null)
  const [, setCPUtilTabActive] = useState(0)

  const router = useRouter()

  const analysisNames = Array.from(analyses, analysis => analysis.name)
  const powerAnalysisUnavailableWarning = `
    Power & charging infrastructure analysis is not available because
    the shapefile associated with this project does not have the
    necessary inputs (or some are not valid). Please create a project
    with a valid shapefile to perform this analysis.
  `

  useEffect(() => {
    if (Object.keys(dupAnalysis).length > 0) {
      setAnalysisLoading(true)
      fetch(`/api/analyses/${projectId}/${dupAnalysis._id}`, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-store',
        headers: {
          Accept: 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          setAnalysisLoading(false)
          writeFormData(data, fieldWriter, touchForm)
        })
    }
  }, [dupAnalysis, fieldWriter, touchForm, projectId])

  return (
    <Formik
      validateOnChange={false}
      initialValues={{
        name: '',
        inputFile: undefined,
        total_urban_trips: 0,
        total_incoming_trips: 0,
        total_outgoing_trips: 0,
        average_number_trips: 1,
        bevs_ratio: defaults.analysis.ubm.input.bevs_ratio * 100,
        phevs_ratio: defaults.analysis.ubm.input.phevs_ratio * 100,
        forecast_year: 2023,
        vehicle_imm_t0: 0,
        bev_vehicle_t0: 0,
        phev_vehicle_t0: 0,
        price_ice: defaults.dcm.weights.ratio.default_price_ice * 10000,
        range_ice: defaults.dcm.weights.ratio.default_range_ice * 100,
        diffusion: 0,
        coef_price_bev: 1,
        coef_price_phev: 1,
        coef_range_bev: 1,
        coef_range_phev: 1,
        cost_bev: 0,
        cost_phev: 0,
        purchase_incentives_bev: 0,
        purchase_incentives_phev: 0,
        utilization_incentives_bev: 0,
        utilization_incentives_phev: 0,
        home_public: defaults.analysis.ubm.config.night_ratio.home_public * 100,
        home_private: defaults.analysis.ubm.config.night_ratio.home_private * 100,
        work_public: defaults.analysis.ubm.config.day_ratio.work_public * 100,
        work_private: defaults.analysis.ubm.config.day_ratio.work_private * 100,
        other_public: defaults.analysis.ubm.config.day_ratio.other_public * 100,
        charging_time: 1,
        waiting_time: 1,
        charging_price: 0.5,
        renewable_energy: 0 * 100,
        cp_total: 0, // Used only to validate form
        travel_dist: distribToArray(defaults.analysis.ubm.config.km_travelled_dist),
        ciy: true,
        tdp: 'Weekdays'
      }}
      validationSchema={Yup.object({
        name: Yup.string()
          .matches(/^[a-zA-Z0-9_-\s]+$/, 'Only alphanumeric characters and underscores, spaces and dashes are allowed')
          .max(30, 'Must be 30 characters or less')
          .required('Required')
          .notOneOf(analysisNames, 'An analysis with this name already exists'),
        total_urban_trips: Yup.number()
          .min(0)
          .required('Required'),
        total_incoming_trips: Yup.number()
          .min(0)
          .required('Required'),
        total_outgoing_trips: Yup.number()
          .min(0)
          .required('Required'),
        average_number_trips: Yup.number()
          .min(1)
          .required('Required'),
        bevs_ratio: Yup.number()
          .min(0)
          .max(100)
          .test(
            'Sum of ratios',
            'Sum of BEV and PHEV ratios must be less than 100',
            function (value) {
              return this.parent.phevs_ratio + value <= 100
            }
          )
          .required('Required'),
        phevs_ratio: Yup.number()
          .min(0)
          .max(100)
          .test(
            'Sum of ratios',
            'Sum of BEV and PHEV ratios must be less than 100',
            function (value) {
              return this.parent.bevs_ratio + value <= 100
            }
          )
          .required('Required'),
        forecast_year: Yup.string()
          .oneOf(Object.values(FORECAST_YEAR_MAPPING))
          .required('Required'),
        vehicle_imm_t0: Yup.number()
          .min(0),
        bev_vehicle_t0: Yup.number()
          .min(0),
        phev_vehicle_t0: Yup.number()
          .min(0),
        price_ice: Yup.number()
          .min(10000)
          .max(100000),
        range_ice: Yup.number()
          .min(100)
          .max(1000),
        diffusion: Yup.number()
          .oneOf(Object.values(DIFFUSION_MAPPING)),
        cost_bev: Yup.number()
          .oneOf(Object.values(ENERGY_COST_MAPPING)),
        cost_phev: Yup.number()
          .oneOf(Object.values(ENERGY_COST_MAPPING)),
        coef_price_bev: Yup.number()
          .oneOf(Object.values(EV_PRICE_MAPPING)),
        coef_price_phev: Yup.number()
          .oneOf(Object.values(EV_PRICE_MAPPING)),
        coef_range_bev: Yup.number()
          .oneOf(Object.values(EV_RANGE_MAPPING)),
        coef_range_phev: Yup.number()
          .oneOf(Object.values(EV_RANGE_MAPPING)),
        purchase_incentives_bev: Yup.number()
          .oneOf(Object.values(PURCHASE_INCENTIVE_MAPPING)),
        purchase_incentives_phev: Yup.number()
          .oneOf(Object.values(PURCHASE_INCENTIVE_MAPPING)),
        utilization_incentives_bev: Yup.number()
          .oneOf(Object.values(UTILIZATION_INCENTIVES_MAPPING)),
        utilization_incentives_phev: Yup.number()
          .oneOf(Object.values(UTILIZATION_INCENTIVES_MAPPING)),
        home_public: Yup.number()
          .min(0)
          .max(100)
          .required('Required'),
        home_private: Yup.number()
          .min(0)
          .max(100)
          .required('Required'),
        work_public: Yup.number()
          .min(0)
          .max(100)
          .required('Required'),
        work_private: Yup.number()
          .min(0)
          .max(100)
          .required('Required'),
        other_public: Yup.number()
          .min(0)
          .max(100)
          .required('Required'),
        charging_time: Yup.number()
          .oneOf(Object.values(CHARGING_TIME_MAPPING)),
        waiting_time: Yup.number()
          .oneOf(Object.values(WAITING_MAPPING)),
        charging_price: Yup.number()
          .oneOf(Object.values(CHARGING_PRICE_MAPPING)),
        renewable_energy: Yup.number()
          .min(0)
          .max(100),
        cp_total: Yup.number()
          .oneOf([100])
          .required('Required'),
        travel_dist: Yup.array().test(
          'Daily travelled distance',
          'Total should equal 100',
          op => validateDistribution(getDistributionDict(op))
        ),
        ciy: Yup.boolean().required('Required'),
        tdp: Yup.string()
          .oneOf(['Weekdays', 'Weekends'])
          .required('Required')
      })}
      onSubmit={async (values, { setSubmitting }) => {
        setError(null)
        setSuccess(false)
        const valuesToSubmit = getValuesToSubmit(values, canDoPowerAnalysis)
        const res = await fetch('/api/analyses/' + projectId, {
          method: 'POST',
          mode: 'no-cors',
          cache: 'no-store',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(valuesToSubmit)
        })
        if (res.status !== 200) {
          const errMsg = await res.json().then(errMsg => JSON.stringify(errMsg))
          setError(`${res.status}: ${errMsg}`)
        } else {
          setSuccess(true)
          router.push(`/${city}/${projectId}/analysis`)
          router.refresh()
        }
        setSubmitting(false)
      }}
    >
      {({ isSubmitting, setFieldValue, setFieldError, setTouched, values }) => (
        <Form className='flex-wrap mx-10'>
          {powerAnalysisWarningVisible && (
            <Alert
              className='mb-4'
              color='warning'
              onDismiss={() => setPowerAnalysisWarningVisible(false)}
            >
              <p>{powerAnalysisUnavailableWarning}</p>
            </Alert>
          )}
          <h1 className='col-span-2 mt-6 mb-6 text-3xl font-bold text-gray-500 dark:text-gray-300'>
            New analysis
          </h1>
          <div className='grid grid-cols-3 gap-4 items-start mb-2'>
            <div className='flex flex-row col-span-2'>
              <Dropdown
                label='Duplicate from'
                placement='right'
                disabled={analyses.length === 0 || isSubmitting}
                pill
              >
                {analyses.map(analysis => {
                  return (
                    <Dropdown.Item
                      key={analysis._id}
                      onClick={() => {
                        setFieldWriter(() => setFieldValue)
                        setTouchForm(() => setTouched)
                        setDupAnalysis(analysis)
                      }}
                    >
                      {analysis.name}
                    </Dropdown.Item>
                  )
                })}
              </Dropdown>
              {analysisLoading &&
                <Spinner
                  className='ml-2 mt-2'
                  aria-label='loading analysis'
                  color='warning'
                  size='md'
                />}
            </div>
            <div className='col-start-3'>
              <FormFile
                id='file'
                name='inputFile'
                disabled={isSubmitting}
                helperText='Import analysis config from json file'
                onChange={event => {
                  const file = event.currentTarget.files[0]
                  if (file) {
                    new Response(file).json().then(
                      data => {
                        setFieldValue('inputFile', data)
                        writeFormData(data, setFieldValue, setTouched)
                      },
                      err => {
                        setFieldError('inputFile', 'Could not read file')
                        console.log('Uploaded input file is not a json')
                        console.log(err)
                      }
                    )
                  }
                }}
              />
            </div>
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <FormInput
              label='Name'
              name='name'
              type='text'
              required
              disabled={isSubmitting}
            />
            <FormSelect
              name='forecast_year'
              label='Reference year'
              options={FORECAST_YEAR_MAPPING}
              tooltip='It is the year which the analyses refer to. It will be used to calculate the % of electric vehicles in the total car stock and to scale the base power demand profile in the grid.'
              value={Object.keys(FORECAST_YEAR_MAPPING).find(key => FORECAST_YEAR_MAPPING[key] === values.forecast_year)}
              required
              disabled={isSubmitting}
              onChange={event => setFieldValue('forecast_year', FORECAST_YEAR_MAPPING[event.currentTarget.value])}
            />
          </div>
          <Accordion alwaysOpen>
            <Accordion.Panel>
              <Accordion.Title>
                &#128663; User Behaviour & Mobility
              </Accordion.Title>
              <Accordion.Content>
                <div className='flex flex-col my-2 rounded-2xl border border-gray-700'>
                  <CategoryHeader title='Trips' />
                  <div className='grid grid-cols-2 gap-4 px-2'>
                    <FormInput
                      label='Total urban trips'
                      tooltip='Total number of daily trips within the city'
                      name='total_urban_trips'
                      type='number'
                      min={0}
                      required
                      disabled={isSubmitting}
                    />
                    <FormInput
                      label='Total incoming trips'
                      tooltip='Total number of daily trips coming into the city'
                      name='total_incoming_trips'
                      type='number'
                      min={0}
                      required
                      disabled={isSubmitting}
                    />
                    <FormInput
                      label='Total outgoing trips'
                      tooltip='Total number of daily trips going out of the city'
                      name='total_outgoing_trips'
                      type='number'
                      min={0}
                      required
                      disabled={isSubmitting}
                    />
                    <FormInput
                      label='Average number of trips'
                      tooltip='Average number of daily trips per vehicle'
                      name='average_number_trips'
                      type='number'
                      min={1}
                      step='any'
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className='grid grid-cols-2 px-2 py-2'>
                    <div className='flex flex-col'>
                      <div className='flex flex-row justify-center gap-2'>
                        <h2 className='text-md text-gray-500 dark:text-gray-300'>
                          Daily travelled distance
                        </h2>
                        <HelpIcon
                          tooltip={
                            'Distribution of the distance travelled daily by EV drivers. ' +
                            'The first column represents distance (in km), while the second its ' +
                            'corresponding weight (between 0 and 100 %) in the distribution.'
                          }
                        />
                      </div>
                      <Distribution name='travel_dist' xUnit='km' yUnit='%' />
                    </div>
                    <TravelledDistanceChart />
                  </div>
                </div>
                <div className='flex flex-col my-2 rounded-2xl border border-gray-700'>
                  <CategoryHeader title='Electric Vehicle Spread' />
                  <Tabs.Group aria-label='ev_ratio_tabs' style='fullWidth' ref={evSpreadTabRef} onActiveTabChange={(tab) => setEvSpreadTabActive(tab)}>
                    <Tabs.Item title='Manual entry'>
                      <div className='grid grid-cols-2 gap-4 px-2'>
                        <FormInput
                          label='Battery Electric Vehicle (BEV) Ratio (%)'
                          tooltip='Percentage of Battery Electric Vehicles in the total number of vehicles (0 - 100)'
                          name='bevs_ratio'
                          type='number'
                          min={0}
                          max={100}
                          step='any'
                          required
                          disabled={isSubmitting}
                        />
                        <FormInput
                          label='Plug-In Electric Vehicle (PHEV) Ratio (%)'
                          tooltip='Percentage of Plug-In Electric Vehicles in the total number of vehicles (0 - 100)'
                          showError={false}
                          name='phevs_ratio'
                          type='number'
                          min={0}
                          max={100}
                          step='any'
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </Tabs.Item>
                    <Tabs.Item title='Autofill'>
                      <DCMRatioForm values={values} setFieldValue={setFieldValue} evSpreadTabRef={evSpreadTabRef} isSubmitting={isSubmitting} />
                    </Tabs.Item>
                  </Tabs.Group>
                </div>
                <div className='flex flex-col my-2 rounded-2xl border border-gray-700'>
                  <CategoryHeader
                    title='Charging Points Utilization'
                    tooltip={
                      'Distribution of utilization of the different types of charging points, in % (0 -100). ' +
                      'The total sum of the utilization of all types of charging points must be 100.'
                    }
                  />
                  <div className='grid grid-cols-2 gap-4 px-2 items-center'>
                    <Tabs.Group aria-label='cp_util_tabs' style='fullWidth' ref={cpUtilTabRef} onActiveTabChange={(tab) => setCPUtilTabActive(tab)}>
                      <Tabs.Item title='Manual entry'>
                        <Separator label='&#127780; Day &#127780;' />
                        <div className='grid grid-cols-3 gap-1 px-2'>
                          <FormInput
                            label='Work public'
                            name='work_public'
                            type='number'
                            min={0}
                            max={100}
                            step='any'
                            required
                            disabled={isSubmitting}
                          />
                          <FormInput
                            label='Work Private'
                            name='work_private'
                            type='number'
                            min={0}
                            max={100}
                            step='any'
                            required
                            disabled={isSubmitting}
                          />
                          <FormInput
                            label='Other Public'
                            name='other_public'
                            type='number'
                            min={0}
                            max={100}
                            step='any'
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <Separator label='&#127769; Night &#127769;' />
                        <div className='grid grid-cols-2 gap-4 px-2'>
                          <FormInput
                            label='Home Public'
                            name='home_public'
                            type='number'
                            min={0}
                            max={100}
                            step='any'
                            required
                            disabled={isSubmitting}
                          />
                          <FormInput
                            label='Home Private'
                            name='home_private'
                            type='number'
                            min={0}
                            max={100}
                            step='any'
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </Tabs.Item>
                      <Tabs.Item title='Autofill'>
                        <DCMChargingForm values={values} setFieldValue={setFieldValue} cpUtilTabRef={cpUtilTabRef} setTouched={setTouched} isSubmitting={isSubmitting} />
                      </Tabs.Item>
                    </Tabs.Group>
                    <CPUtilizationChart />
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Panel>
            <Accordion.Panel>
              <Accordion.Title>
                {
                  canDoPowerAnalysis
                    ? (
                      <p>&#9889; Power & Charging Infrastructure</p>
                      )
                    : (
                      <p>&#9889; Power & Charging Infrastructure (not available)</p>
                      )
                }
              </Accordion.Title>
              <Accordion.Content>
                {
                  canDoPowerAnalysis
                    ? (
                      <div className='flex flex-row items-center justify-between'>
                        <div className='flex flex-col my-2'>
                          <ToggleSwitch
                            className='mb-4 ml-2'
                            checked={values.ciy}
                            disabled={isSubmitting}
                            label='Analyze effect of new charging infrastructure'
                            onChange={val => setFieldValue('ciy', val)}
                          />
                        </div>
                        <div className='flex flex-col w-2/5'>
                          <label htmlFor='tdp' className='text-md text-gray-500 dark:text-gray-300'>
                            Time
                          </label>
                          <Select
                            id='tdp'
                            className='pt-2'
                            required
                            disabled={isSubmitting}
                            onChange={event => setFieldValue('tdp', event.currentTarget.value)}
                          >
                            <option>Weekdays</option>
                            <option>Weekends</option>
                          </Select>
                        </div>
                      </div>
                      )
                    : (
                      <div>
                        <p className='text-gray-900 dark:text-gray-50'>
                          {powerAnalysisUnavailableWarning}
                        </p>
                      </div>
                      )
                }
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion>
          <button
            type='submit'
            className='py-2 px-3 mt-2 w-full text-xl text-white bg-gray-700 rounded-lg border border-gray-700 hover:bg-gray-500'
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner aria-label='submit analysis' color='warning' /> : 'Create analysis'}
          </button>
          <div className='p-2 mb-4 text-xl font-bold text-center text-red-400'>
            {error}
          </div>
          <div
            className='p-2 mb-4 text-xl font-bold text-center text-incitEV-blue'
            hidden={!success}
          >
            Successfully created project
          </div>
        </Form>
      )}
    </Formik>
  )
}
