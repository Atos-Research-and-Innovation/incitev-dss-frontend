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

import { Field, useField } from 'formik'
import { FileInput, Tooltip } from 'flowbite-react'

export function HelpIcon ({ tooltip, placement = 'top' }) {
  return (
    <Tooltip content={tooltip} placement={placement}>
      <svg
        aria-hidden='true'
        className='w-6 h-6 text-gray-500 dark:text-gray-300'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.5}
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z' strokeLinecap='round' strokeLinejoin='round' />
      </svg>
    </Tooltip>
  )
}

export function FormInput ({ label, tooltip, showError = true, ...props }) {
  const [field, meta] = useField(props)
  return (
    <div className='flex flex-col'>
      <div className='flex justify-between'>
        {label && (
          <label htmlFor={props.name} className='text-md text-gray-500 dark:text-gray-300'>
            {label}
          </label>
        )}
        {tooltip && <HelpIcon tooltip={tooltip} />}
      </div>
      <Field
        className='py-2 px-2 my-2 bg-white dark:bg-gray-900 dark:text-gray-300 rounded-lg border-2 focus:ring focus:outline-none disabled:opacity-25 border-incitEV-blue dark:border-incitEV-dark-blue'
        {...field}
        {...props}
      />
      {meta.touched && meta.error && showError ? (<div className='text-red-400 max-w-[300px]'>{meta.error}</div>) : null}
    </div>
  )
}

export function FormCheckbox ({ children, ...props }) {
  const [field, meta] = useField(props)
  return (
    <div className='flex flex-col'>
      <label className='text-gray-500 dark:text-gray-300'>
        <Field
          {...field}
          {...props}
          type='checkbox'
          className='disabled:opacity-25'
        />
        {children}
      </label>
      {meta.touched && meta.error ? (<div className='text-red-400'>{meta.error}</div>) : null}
    </div>
  )
}

export function FormFile ({ ...props }) {
  const [, meta] = useField(props)
  return (
    <div className='flex flex-col'>
      <FileInput {...props} className='disabled:opacity-25' />
      {meta.value && meta.error ? (<div className='text-red-400'>{meta.error}</div>) : null}
    </div>
  )
}
