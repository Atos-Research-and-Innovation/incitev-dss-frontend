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

'use client' // TODO: only the table cell is client side, we should isolate it
import { Table, Tooltip } from 'flowbite-react'
import * as Yup from 'yup'
import { zoneLevelInputsSchema } from '../../../components/Maps/utils'

function getInputInventoryRow (inputsCount, key, nZones) {
  const percentage = Math.round((100 * Number(inputsCount[key])) / nZones)
  let color = 'bg-yellow-500'
  if (percentage === 0) {
    color = 'bg-red-700'
  } else if (percentage === 100) {
    color = 'bg-green-700'
  }
  return (
    <Table.Row
      className='bg-gray-100 dark:bg-gray-800 dark:border-gray-700'
      key={key}
    >
      <Table.Cell>
        <Tooltip content={zoneLevelInputsSchema[key].description}>
          <div className={`inline-block w-3 h-3 mr-2 ${color} rounded-full`} />
          {key}
        </Tooltip>
      </Table.Cell>
      <Table.Cell>{`${percentage} %`}</Table.Cell>
    </Table.Row>
  )
}

export function InputInventoryTable ({ inputsCount, nZones }) {
  if (inputsCount && nZones !== 0) {
    return (
      <div className='flex flex-col max-h-[600px]'>
        <Table>
          <Table.Body className='divide-y'>
            {Object.keys(inputsCount).map(key => {
              return getInputInventoryRow(inputsCount, key, nZones)
            })}
          </Table.Body>
        </Table>
      </div>
    )
  }
  return null
}

export function InputTable ({ geojson, selectedZone }) {
  const tableHeaders = {
    ID: {
      validationFunc: Yup.string(),
      description: 'Unique ID for the zone.'
    },
    Name: {
      validationFunc: Yup.string(),
      description: 'Name of the zone.'
    },
    ...zoneLevelInputsSchema
  }

  if (geojson && geojson.features) {
    return (
      <div className='flex overflow-auto flex-col mb-4 max-h-[600px]'>
        <Table>
          <Table.Head>
            {Object.keys(tableHeaders).map(key => {
              return (
                <Table.HeadCell key={`${key}-tooltip`}>
                  <Tooltip content={tableHeaders[key].description}>
                    {key}
                  </Tooltip>
                </Table.HeadCell>
              )
            })}
          </Table.Head>
          <Table.Body className='divide-y'>
            {geojson.features.map(feature => {
              return (
                <Table.Row
                  className={`dark:border-gray-700 ${
                    selectedZone.Name === feature.properties.Name
                      ? 'bg-gray-300 dark:bg-gray-600'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                  key={`input-row-${feature.properties.Name}`}
                  id={`input-row-${feature.properties.Name}`}
                >
                  {Object.keys(tableHeaders).map(key => {
                    try {
                      tableHeaders[key].validationFunc.validateSync(feature.properties[key])
                    } catch ({ name, message }) {
                      return (
                        <Tooltip
                          content={`${name}: ${message}`}
                          key={`${feature.properties.Name}-${key}`}
                        >
                          <Table.Cell key={`${feature.properties.Name}-${key}`}>
                            <span className='text-red-500'>Invalid</span>
                          </Table.Cell>
                        </Tooltip>
                      )
                    }
                    return (
                      <Table.Cell key={`${feature.properties.Name}-${key}`}>
                        {feature.properties[key]}
                      </Table.Cell>
                    )
                  })}
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </div>
    )
  }
  return null
}
