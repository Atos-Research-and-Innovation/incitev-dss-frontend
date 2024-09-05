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
import { useEffect, useState } from 'react'
import { FormInput } from '../../components/Forms/Fields'

export default function UserProfileEditPage () {
  const [error, setError] = useState(null)
  const [profileData, setProfileData] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/api/users/me', {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
      headers: {
        Accept: 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setProfileData(data)
        setLoading(false)
      })
  }, [])

  if (isLoading) {
    return <p className='dark:text-gray-300'>Loading user data...</p>
  }
  return (
    <div className='flex flex-col justify-center items-center'>
      <Formik
        initialValues={{
          email: profileData.email,
          name: profileData.name,
          surname: profileData.surname
        }}
        validationSchema={Yup.object({
          email: Yup.string().email('Invalid email address'),
          name: Yup.string(),
          surname: Yup.string()
        })}
        onSubmit={async (values, { setSubmitting }) => {
          setError(null)
          setSuccess(false)
          if (values.email === profileData.email) {
            // Avoids a 409 Conflicts error if the user email was not modified
            delete values.email
          }
          const res = await fetch('/api/users/me', {
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
              label='Email'
              name='email'
              type='text'
              required
              disabled={isSubmitting}
            />
            <FormInput
              label='First name'
              name='name'
              type='text'
              disabled={isSubmitting}
            />
            <FormInput
              label='Last name'
              name='surname'
              type='text'
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
              Successfully edited profile
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
