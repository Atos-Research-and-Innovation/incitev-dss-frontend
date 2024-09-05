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
import { useState } from 'react'
import { FormInput } from '../../components/Forms/Fields'
import { PwdRegex, PwdValidationMsg } from '../../components/Forms/Constants'

export default function UserPasswordChangePage () {
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  return (
    <div className='flex flex-col justify-center items-center'>
      <Formik
        initialValues={{
          old_password: '',
          password: '',
          password_again: ''
        }}
        validationSchema={Yup.object({
          old_password: Yup.string(),
          password: Yup.string()
            .matches(PwdRegex, PwdValidationMsg)
            .required('Required'),
          password_again: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Passwords must match'
          )
        })}
        onSubmit={async (values, { setSubmitting }) => {
          setError(null)
          setSuccess(false)
          const res = await fetch('/api/users/password', {
            method: 'PUT',
            cache: 'no-store',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
          })
          if (res.status !== 200) {
            const errMsg = await res
              .json()
              .then(errMsg => JSON.stringify(errMsg))
            setError(`${res.status}: ${errMsg}`)
          } else {
            setSuccess(true)
          }
          setSubmitting(false)
        }}
      >
        {({ isSubmitting }) => (
          <Form className='flex flex-col justify-center items-center p-10 bg-white dark:bg-gray-900 rounded shadow-lg'>
            <h2 className='mb-6 text-2xl font-bold text-gray-500 dark:text-gray-300'>
              My profile
            </h2>
            <FormInput
              label='Current password'
              name='old_password'
              type='password'
              required
              disabled={isSubmitting}
            />
            <FormInput
              label='New password'
              name='password'
              type='password'
              disabled={isSubmitting}
            />
            <FormInput
              label='Confirm new password'
              name='password_again'
              type='password'
              disabled={isSubmitting}
            />
            <button
              type='submit'
              className='py-2 px-4 mx-4 mt-4 w-56 text-xl text-white bg-gray-700 rounded border border-gray-700 hover:bg-gray-500 disabled:opacity-25'
              disabled={isSubmitting}
            >
              Save
            </button>
            <div className='p-2 mb-4 text-xl font-bold text-center text-red-400'>
              {error}
            </div>
            <div
              className='p-2 mb-4 text-xl font-bold text-center text-incitEV-blue'
              hidden={!success}
            >
              Successfully changed password
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
