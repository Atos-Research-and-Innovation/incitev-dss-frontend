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
import { Form, Formik, useFormikContext } from 'formik'
import * as Yup from 'yup'
import { useEffect, useState } from 'react'
import { FormInput, FormFile } from '../../../components/Forms/Fields'
import { useRouter } from 'next/navigation'
import { Accordion, Spinner } from 'flowbite-react'
import { InputInventoryTable, InputTable } from './Tables'
import { getInputsFromGeoJS } from '../../../components/Maps/utils'
import shp from 'shpjs'
import dynamic from 'next/dynamic'

const ProjectMap = dynamic(async () => await import('./ProjectMap'), { ssr: false })

function ValidateShapefile ({ setMapData, setInputsCount, setAllInputsValid, setNZones, setEncodedShapefile, setShapefileError, shapefileError }) {
  const { values, validateField } = useFormikContext()
  const [isShapefileValidating, setShapefileValidating] = useState(false)

  useEffect(() => {
    (async () => {
      if (values.shapefile?.name.endsWith('.zip')) {
        setShapefileValidating(true)
        const shpFile = await values.shapefile.arrayBuffer()
        setMapData(null)
        try {
          const geojson = await shp(shpFile)
          /* WARNING: getInputsFromGeoJS modifies the geojson object, it should
           * therefore be called BEFORE setting mapData */
          const { inputsCount, allInputsValid } = getInputsFromGeoJS(geojson)
          setInputsCount(inputsCount)
          setAllInputsValid(allInputsValid)
          setNZones(geojson.features.length)
          setEncodedShapefile(Buffer.from(shpFile).toString('base64'))
          setShapefileError('')
          setMapData(geojson)
        } catch (err) {
          setInputsCount({})
          setNZones(0)
          setShapefileError('Invalid shapefile: ' + err.message)
        }
      }
      setShapefileValidating(false)
    })()
  }, [values.shapefile, setMapData, setInputsCount, setNZones, setShapefileError, setEncodedShapefile, setAllInputsValid])

  /* Forces validation of shapefile form field once its asynchronous
    * validation is indeed done */
  useEffect(() => {
    if (shapefileError !== '') {
      validateField('shapefile')
    }
  }, [shapefileError, validateField])

  if (isShapefileValidating) {
    return (
      <div className='flex flex-row justify-center'>
        <Spinner aria-label='Validating shapefile spinner' size='md' color='warning' />
        <p className='ml-2 text-gray-500 dark:text-gray-300'>Validating shapefile...</p>
      </div>
    )
  }
  return null
}

export default function Wizard1 ({ projectNames }) {
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [mapData, setMapData] = useState(null)
  const [inputsCount, setInputsCount] = useState({})
  const [nZones, setNZones] = useState(0)
  const [encodedShapefile, setEncodedShapefile] = useState(null)
  const [shapefileError, setShapefileError] = useState('')
  const [selectedZone, setSelectedZone] = useState({})
  const [allInputsValid, setAllInputsValid] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (selectedZone) {
      const accordion = document.getElementById('map-input-accordion')
      if (accordion) {
        // Opens the accordion if it is closed
        if (accordion.childNodes[1].hidden) {
          accordion.childNodes[0].click()
        }
      }
      const row = document.getElementById('input-row-' + selectedZone.Name)
      if (row) {
        row.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    }
  }, [selectedZone])

  return (
    <>
      <div className='flex flex-col py-4 px-9 mx-auto mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg lg:w-3/4'>
        <h1 className='mt-6 mb-6 text-3xl font-bold text-gray-500 dark:text-gray-300'>
          Create a new Project
        </h1>
        <Formik
          initialValues={{
            name: '',
            city: '',
            shapefile: undefined
          }}
          validationSchema={Yup.object({
            name: Yup.string()
              .matches(/^[a-zA-Z0-9_-\s]+$/, 'Only alphanumeric characters and underscores, spaces and dashes are allowed')
              .max(20, 'Must be 20 characters or less')
              .required('Required')
              .notOneOf(
                projectNames,
                'A project with this name already exists'
              ),
            city: Yup.string().required('Required'),
            shapefile: Yup.mixed().test(
              'Filetype',
              'Please provide a .zip file',
              file => {
                return file?.name.endsWith('.zip')
              }
            ).test(
              'File validity',
              shapefileError,
              file => {
                return shapefileError === ''
              }
            ).required('Required')
          })}
          onSubmit={async (values, { setSubmitting }) => {
            setError(null)
            setSuccess(false)
            const res = await fetch('/api/projects', {
              method: 'POST',
              mode: 'no-cors',
              cache: 'no-store',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: new URLSearchParams({
                name: values.name,
                city: values.city,
                shapefile: encodedShapefile
              })
            })
            if (res.status !== 200) {
              const errMsg = await res
                .json()
                .then(errMsg => JSON.stringify(errMsg))
              setError(`${res.status}: ${errMsg}`)
            } else {
              setSuccess(true)
              router.push('/')
              router.refresh()
            }
            setSubmitting(false)
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className='flex-wrap mx-10'>
              <div className='grid grid-cols-2 gap-4'>
                <FormInput
                  label='Name'
                  name='name'
                  type='text'
                  required
                  disabled={isSubmitting}
                />
                <FormInput
                  label='City'
                  name='city'
                  type='text'
                  required
                  disabled={isSubmitting}
                />
                <div className='col-span-2'>
                  <FormFile
                    id='file'
                    name='shapefile'
                    required
                    disabled={isSubmitting}
                    helperText='Upload a shapefile for the city of interest'
                    onChange={event => {
                      setFieldValue('shapefile', event.currentTarget.files[0])
                    }}
                  />
                </div>
                <div className='col-span-2'>
                  <ValidateShapefile
                    setMapData={setMapData}
                    setInputsCount={setInputsCount}
                    setAllInputsValid={setAllInputsValid}
                    setNZones={setNZones}
                    setEncodedShapefile={setEncodedShapefile}
                    setShapefileError={setShapefileError}
                    shapefileError={shapefileError}
                  />
                </div>
              </div>
              {mapData && (
                <>
                  <div className='grid grid-cols-3 gap-4 my-4'>
                    <div className='col-span-2 col-start-1 z-0'>
                      <ProjectMap mapData={mapData} setSelectedZone={setSelectedZone} />
                    </div>
                    <div className='col-start-3'>
                      <h2 className='mb-4 text-2xl font-bold text-gray-500 dark:text-gray-300 text-center'>
                        Map Data Summary
                      </h2>
                      <InputInventoryTable inputsCount={inputsCount} nZones={nZones} />
                    </div>
                  </div>
                  <div className='mb-4'>
                    <Accordion id='map-input-accordion'>
                      <Accordion.Panel>
                        <Accordion.Title>
                          Detected Map Data
                        </Accordion.Title>
                        <Accordion.Content>
                          <InputTable geojson={mapData} selectedZone={selectedZone} />
                        </Accordion.Content>
                      </Accordion.Panel>
                    </Accordion>
                  </div>
                </>
              )}
              {!allInputsValid && (
                <div className='flex flex-row p-2 mb-4 text-xl font-bold text-center text-incitEV-blue'>
                  <div>
                    &#x26A0;<br />Not all zone inputs are valid: only user behaviour and mobility analyses will be available, not power and charging infrastructure.
                  </div>
                </div>
              )}
              <button
                type='submit'
                className='py-2 px-3 w-full text-xl text-white bg-gray-700 rounded-lg border border-gray-700 hover:bg-gray-500'
                disabled={isSubmitting}
              >
                {isSubmitting ? <Spinner aria-label='submit project' color='warning' /> : 'Create project'}
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
      </div>
    </>
  )
}
