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

import { Field, FieldArray, useField, useFormikContext } from 'formik'
import { HelpIcon } from '../../../../../../components/Forms/Fields'
import { Label, Radio, Select } from 'flowbite-react'

export function CategoryHeader ({ title, tooltip }) {
  return (
    <div className='flex px-2 mb-4 rounded-t-2xl bg-incitEV-blue dark:bg-incitEV-dark-blue justify-between'>
      <h2 className='text-2xl font-bold text-gray-500 dark:text-gray-300'>
        {title}
      </h2>
      <div className='mt-1'>
        {tooltip && <HelpIcon tooltip={tooltip} />}
      </div>
    </div>
  )
}

/**
 * Returns a component consisting of a simple gray line in the middle of which
 * the given text is displayed.
 *
 * @param {string} label - Text to display.
 *
 */
export function Separator ({ label }) {
  return (
    <div className='flex items-center'>
      <div className='flex-grow bg bg-gray-300 h-0.5' />
      <div className='flex-grow-0 mx-5 text-gray-500 dark:text-gray-300 text-xl pb-2'>{label}</div>
      <div className='flex-grow bg bg-gray-300 h-0.5' />
    </div>
  )
}

/**
 * Returns a component to handle array inputs in a form. Users can add/remove
 * entries in the array. Each entry is an object with a `key` and  a `value`
 * entries.
 *
 */
export function Distribution ({ xUnit, yUnit, ...props }) {
  const { values } = useFormikContext()
  const [field, meta] = useField(props)

  return (
    <div>
      <div className='grid grid-cols-2 text-center text-gray-500 dark:text-gray-300'>
        <p>{xUnit}</p>
        <p>{yUnit}</p>
      </div>
      <FieldArray
        {...props}
        {...field}
        render={() => (
          <div>
            {values[props.name].length > 0 &&
              values[props.name].map((val, index) => (
                <div className='flex flex-row' key={index}>
                  <Field
                    name={`${props.name}[${index}].key`}
                    type='number'
                    className='w-2/5 bg-white dark:bg-gray-900 dark:text-gray-300 rounded-lg border-2 focus:ring focus:outline-none disabled:opacity-25 border-incitEV-blue dark:border-incitEV-dark-blue'
                    disabled
                  />
                  <Field
                    name={`${props.name}[${index}].value`}
                    type='number'
                    min={0}
                    max={100}
                    step={0.01}
                    className='w-2/5 bg-white dark:bg-gray-900 dark:text-gray-300 rounded-lg border-2 focus:ring focus:outline-none disabled:opacity-25 border-incitEV-blue dark:border-incitEV-dark-blue'
                  />
                </div>
              ))}
          </div>
        )}
      />
      {meta.error ? <div className='text-red-400'>{meta.error}</div> : null}
    </div>
  )
}

export function FormRadio ({ name, label, options, defaultValueChecked, ...props }) {
  return (
    <fieldset
      className='flex flex-col gap-2 mb-4'
      id={`${name}-radio`}
      {...props}
    >
      <legend className='mb-2 text-md text-gray-500 dark:text-gray-300'>
        {label}
      </legend>
      {Object.keys(options).map((key, index) => (
        <div key={`${name}-${index}`} className='flex items-center gap-2 pl-2'>
          <Radio
            id={`${key}-radio`}
            name={`${name}-radio-button`}
            value={key}
            defaultChecked={key === defaultValueChecked}
          />
          <Label htmlFor={key}>
            {key}
          </Label>
        </div>
      ))}
    </fieldset>
  )
}

export function FormSelect ({ name, label, options, tooltip = '', ...props }) {
  return (
    <div id={`${name}-dropdown`}>
      <div className='flex justify-between gap-2'>
        <label htmlFor={`${name}`} className='text-md text-gray-500 dark:text-gray-300'>
          {label}
        </label>
        {tooltip && <HelpIcon tooltip={tooltip} />}
      </div>
      <Select
        id={`${name}Select`}
        className='pt-2 mb-2'
        {...props}
      >
        {Object.keys(options).map((key, index) => (
          <option key={`${name}-${index}`}>{key}</option>
        ))}
      </Select>
    </div>
  )
}
