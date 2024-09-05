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

import { Table } from 'flowbite-react'
import { HelpIcon } from '../../../../../../../../components/Forms/Fields'

export function FeatureRow ({ label, resKey, value, dataForMap, setDataForMap, tooltip }) {
  return (
    <Table.Row
      className={`${dataForMap === resKey ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} dark:border-gray-700 flex items-center justify-between cursor-pointer`}
      onClick={e => {
        setDataForMap(resKey)
      }}
    >
      <div className='flex items-center ml-2'>
        {tooltip && HelpIcon({ tooltip, placement: 'top' })}
        <Table.Cell>{label}</Table.Cell>
      </div>
      <Table.Cell>{value}</Table.Cell>
    </Table.Row>
  )
}

export function FeatureTable ({ selected, results, dataForMap, setDataForMap, hasPowerOutputs }) {
  let zoneRes = null
  if (typeof selected.areaIndex !== 'undefined') {
    zoneRes = results[selected.areaIndex]
  }
  return (
    <div className='flex flex-col max-h-[600px]'>
      <h2 className='my-2 text-center font-bold text-gray-500 whitespace-normal'>
        {selected.Name ? selected.Name : 'No area selected'}
      </h2>
      <Table hoverable>
        <Table.Body className='divide-y'>
          <FeatureRow
            label={`Vehicles arrived at ${typeof selected.hour !== 'undefined' ? selected.hour : '-'}h`}
            resKey='start_parking_time'
            value={zoneRes ? Math.round(zoneRes.start_parking_time[selected.hour] * 10) / 10 : ''}
            dataForMap={dataForMap}
            setDataForMap={setDataForMap}
            tooltip={`Number of vehicles that arrive at ${typeof selected.hour !== 'undefined' ? selected.hour : '-'}h averaged over working days, and that need to charge.`}
          />
          {!hasPowerOutputs && (
            // Show energy required and spread energy required only if there are no power outputs
            <>
              <FeatureRow
                label={`Energy required at ${typeof selected.hour !== 'undefined' ? selected.hour : '-'}h (kWh)`}
                resKey='energy_required'
                value={zoneRes ? Math.round(zoneRes.energy_required[selected.hour] * 10) / 10 : ''}
                dataForMap={dataForMap}
                setDataForMap={setDataForMap}
                tooltip={`Total energy required by vehicles at ${typeof selected.hour !== 'undefined' ? selected.hour : '-'}h (when they start parking). It depends on the hour of the parking because we assume that all the charge needed by each vehicle is completed in first hour of parking (so during the hour in which each vehicle starts parking).`}
              />
              <FeatureRow
                label={`Spread energy required at ${typeof selected.hour !== 'undefined' ? selected.hour : '-'}h (kWh)`}
                resKey='spread_energy_required'
                value={zoneRes ? Math.round(zoneRes.spread_energy_required[selected.hour] * 10) / 10 : ''}
                dataForMap={dataForMap}
                setDataForMap={setDataForMap}
                tooltip={`Energy required by vehicles at ${typeof selected.hour !== 'undefined' ? selected.hour : '-'}h, assuming that the total energy required by each vehicle is distributed over the entire duration of the parking.`}
              />
            </>
          )}
          {hasPowerOutputs && (
            <>
              <FeatureRow
                label='Required Grid Reinforcement'
                resKey='gr_KPI'
                value={zoneRes ? zoneRes.gr_KPI : ''}
                dataForMap={dataForMap}
                setDataForMap={setDataForMap}
                tooltip='Traffic light indicator which signals user if grid reinforcement will be required to accommodate all new charging points.'
              />
              <FeatureRow
                label='Charging Points / Vehicles'
                resKey='CPPV'
                value={zoneRes ? zoneRes.CPPV : ''}
                dataForMap={dataForMap}
                setDataForMap={setDataForMap}
                tooltip='Number of charging points per vehicle in the zone.'
              />
              <FeatureRow
                label='Existing slow charging points'
                resKey='ECSS'
                value={zoneRes ? zoneRes.ECSS : ''}
                dataForMap={dataForMap}
                setDataForMap={setDataForMap}
                tooltip='Number of existing slow charging points (nominal power < 7 kW) in the zone.'
              />
              <FeatureRow
                label='New slow charging points'
                resKey='NCSS'
                value={zoneRes ? zoneRes.NCSS : ''}
                dataForMap={dataForMap}
                setDataForMap={setDataForMap}
                tooltip='Number of new slow charging points (nominal power < 7 kW) in the zone.'
              />
              <FeatureRow
                label='Existing fast charging points'
                resKey='ECSF'
                value={zoneRes ? zoneRes.ECSF : ''}
                dataForMap={dataForMap}
                setDataForMap={setDataForMap}
                tooltip='Number of existing fast charging points (nominal power > 22 kW). in the zone.'
              />
              <FeatureRow
                label='New fast charging points'
                resKey='NCSF'
                value={zoneRes ? zoneRes.NCSF : ''}
                dataForMap={dataForMap}
                setDataForMap={setDataForMap}
                tooltip='Number of new fast charging points (nominal power > 22 kW) in the zone.'
              />
              <FeatureRow
                label='Existing fast AC charging points'
                resKey='ECSFAC'
                value={zoneRes ? zoneRes.ECSFAC : ''}
                dataForMap={dataForMap}
                setDataForMap={setDataForMap}
                tooltip='Number of existing fast AC charging points (nominal power between 7 and 22 kW) in the zone.'
              />
              <FeatureRow
                label='New fast AC charging points'
                resKey='NCSFAC'
                value={zoneRes ? zoneRes.NCSFAC : ''}
                dataForMap={dataForMap}
                setDataForMap={setDataForMap}
                tooltip='Number of new fast AC charging points (nominal power between 7 and 22 kW) in the zone.'
              />
            </>
          )}
        </Table.Body>
      </Table>
    </div>
  )
}
