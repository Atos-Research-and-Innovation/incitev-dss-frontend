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
import { useRouter } from 'next/navigation'
import { FormCheckbox, FormInput } from '../../components/Forms/Fields'
import { PwdRegex, PwdValidationMsg } from '../../components/Forms/Constants'

export default function UserRegistrationPage () {
  const [error, setError] = useState(null)
  const [usernames, setUsernames] = useState([])
  const router = useRouter()

  useEffect(() => {
    fetch('/api/users/', {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
      headers: {
        Accept: 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setUsernames(data)
      })
  }, [])

  return (
    <div className='flex flex-col justify-center items-center'>
      <Formik
        initialValues={{
          username: '',
          email: '',
          name: '',
          surname: '',
          password: '',
          password_again: '',
          gdpr_accepted: false
        }}
        validationSchema={Yup.object({
          username: Yup.string()
            .max(20, 'Must be 20 characters or less')
            .required('Required')
            .notOneOf(usernames, 'Username already exists'),
          email: Yup.string()
            .email('Invalid email addresss`')
            .required('Required'),
          name: Yup.string(),
          surname: Yup.string(),
          password: Yup.string()
            .matches(PwdRegex, PwdValidationMsg)
            .required('Required'),
          password_again: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Passwords must match'
          ),
          gdpr_accepted: Yup.boolean()
            .required('Required')
            .oneOf([true], 'You must accept the terms and conditions.')
        })}
        onSubmit={async (values, { setSubmitting }) => {
          const res = await fetch('/api/users/', {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-store',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: new URLSearchParams({
              username: values.username,
              email: values.email,
              name: values.name,
              surname: values.surname,
              password: values.password,
              password_again: values.password_again,
              gdpr_accepted: values.gdpr_accepted
            })
          })
          if (res.status === 200) {
            router.push('/auth/signin')
          } else {
            const errMsg = await res
              .json()
              .then(errMsg => JSON.stringify(errMsg))
            setError(`${res.status}: ${errMsg}`)
          }
          setSubmitting(false)
        }}
      >
        {({ isSubmitting }) => (
          <Form className='flex flex-col justify-center items-center p-10 bg-white dark:bg-gray-900 rounded shadow-lg'>
            <h2 className='mb-6 text-2xl font-bold text-gray-500 dark:text-gray-300'>
              Registration form
            </h2>
            <div className='grid grid-cols-2 gap-y-2 gap-x-6'>
              <FormInput
                label='Username'
                name='username'
                type='text'
                placeholder='jdoe'
                required
              />
              <FormInput
                label='Email'
                name='email'
                type='text'
                placeholder='jdoe@email.com'
                required
              />
              <FormInput
                label='First name'
                name='name'
                type='text'
                placeholder='John'
              />
              <FormInput
                label='Last name'
                name='surname'
                type='text'
                placeholder='Doe'
              />
              <FormInput
                label='Password'
                name='password'
                type='password'
                required
              />
              <FormInput
                label='Confirm password'
                name='password_again'
                type='password'
                required
              />
            </div>
            <FormCheckbox name='gdpr_accepted'>
              I accept the GDPR terms and conditions.
            </FormCheckbox>
            <button
              type='submit'
              className='py-2 px-4 mx-4 mt-4 w-56 text-xl text-white bg-gray-700 rounded border border-gray-700 hover:bg-gray-500'
              disabled={isSubmitting}
            >
              Create account
            </button>
            <div className='p-2 mb-4 text-xl font-bold text-center text-red-400'>
              {error}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
