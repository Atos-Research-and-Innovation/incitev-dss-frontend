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
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { getTheme } from '../../../../../../../../utils'
import ApexCharts from 'apexcharts'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

/**
 * Returns a component plotting the power demand as a function
 * of the time of the day, extracted from the simulation
 * results for a given area.
 *
 * @param {Object} results - The simulation results, as returned by the backend.
 * @param {Object} selected - Object containing data about the selected area.
 *
 */
export function GridImpactGraph ({ results, selected }) {
  const series = []
  let topThreshold = 0
  if (typeof selected.areaIndex !== 'undefined') {
    const borders = results[selected.areaIndex].borders
    const stays = results[selected.areaIndex].stays
    topThreshold = 1.1 * Math.max(...borders.border_red, ...stays)
    const dataSafe = []
    const dataLow = []
    const dataHigh = []
    for (let step = 0; step < 24; step++) {
      dataSafe.push(borders.border_yellow[step])
      dataLow.push(borders.border_red[step] - borders.border_yellow[step])
      dataHigh.push(topThreshold - borders.border_red[step])
    }
    series.push(
      { type: 'area', name: 'Safe', data: dataSafe },
      { type: 'area', name: 'Low risk', data: dataLow },
      { type: 'area', name: 'High risk', data: dataHigh },
      { type: 'line', name: 'Area load', data: stays }
    )
  }

  const theme = getTheme()
  // To ensure that the chart is re-rendered when the theme changes
  useEffect(() => {}, [theme])

  const options = {
    chart: {
      height: 350,
      type: 'area',
      stacked: true,
      zoom: {
        enabled: false
      }
    },
    colors: ['#377D22', '#FFFD54', '#EB3223', '#000'],
    theme: {
      mode: getTheme()
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: 'solid'
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Charging impact on power grid',
      align: 'center'
    },
    xaxis: {
      categories: [...Array(24).keys()],
      tickAmount: 12,
      title: {
        text: 'Time of the day (h)',
        offsetY: 80
      }
    },
    yaxis: {
      decimalsInFloat: 0,
      min: 0,
      max: topThreshold,
      title: {
        text: 'Power demand (kW)'
      }
    }
  }

  return (
    <div className='flex flex-col'>
      <ReactApexChart
        options={options}
        series={series}
        type='area'
        height={350}
      />
    </div>
  )
}

function LegendButton ({ name, color, selectedSeries, setSelectedSeries }) {
  return (
    <button
      className={`${selectedSeries.includes(name) ? 'opacity-100' : 'opacity-25'}`}
      onClick={() => {
        ApexCharts.exec('occupancy_chart', 'toggleSeries', name)
        if (selectedSeries.includes(name)) {
          setSelectedSeries(selectedSeries.filter(x => x !== name))
        } else {
          setSelectedSeries([...selectedSeries, name])
        }
      }}
    >
      <div className='inline-flex items-center'>
        <span className='w-2 h-2 inline-block mr-2 rounded' style={{ backgroundColor: color }} />
        <span className='text-gray-600'>{name}</span>
      </div>
    </button>
  )
}

/**
 * Returns a component plotting the charging points occupancy as a function
 * of the time of the day, extracted from the simulation
 * results for a given area.
 *
 * @param {Object} results - The simulation results, as returned by the backend.
 * @param {Object} selected - Object containing data about the selected area.
 *
 */
export function OccupancyGraph ({ results, selected }) {
  const [selectedSeries, setSelectedSeries] = useState(['Slow'])
  const series = []
  if (typeof selected.areaIndex !== 'undefined') {
    const occ = results[selected.areaIndex].occupancy
    series.push(
      { name: 'Slow', data: Array.from(occ.slow_cs, x => 100 * x) },
      { name: 'Fast', data: Array.from(occ.fast_cs, x => 100 * x) },
      { name: 'Fast AC', data: Array.from(occ.fast_accs, x => 100 * x) }
    )
  } else {
    series.push(
      { name: 'Slow', data: [] },
      { name: 'Fast', data: [] },
      { name: 'Fast AC', data: [] }
    )
  }

  const theme = getTheme()
  // To ensure that the chart is re-rendered when the theme changes
  useEffect(() => {}, [theme])

  useEffect(() => {
    const allSeries = ['Slow', 'Fast', 'Fast AC']
    if (typeof selected.areaIndex !== 'undefined') {
      allSeries.forEach(name => {
        if (selectedSeries.includes(name)) {
          ApexCharts.exec('occupancy_chart', 'showSeries', name)
        } else {
          ApexCharts.exec('occupancy_chart', 'hideSeries', name)
        }
      })
    }
  }, [selected, selectedSeries])

  const options = {
    chart: {
      id: 'occupancy_chart',
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      }
    },
    theme: {
      mode: getTheme()
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Proportion of occupied stations',
      align: 'center'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      }
    },
    colors: ['#3990F3', '#67DE9C', '#F3B244'],
    legend: {
      show: false
    },
    xaxis: {
      categories: [...Array(24).keys()],
      tickAmount: 12,
      title: {
        text: 'Time of the day (h)',
        offsetY: 80
      }
    },
    yaxis: {
      decimalsInFloat: 0,
      min: 0,
      max: 100,
      title: {
        text: 'Proportion of occupied charging points (%)'
      }
    }
  }

  return (
    <div className='flex flex-col'>
      <ReactApexChart
        options={options}
        series={series}
        type='line'
        height={350}
      />
      <div className='flex flex-row justify-center gap-2'>
        <LegendButton
          name='Slow'
          color='#3990F3'
          selectedSeries={selectedSeries}
          setSelectedSeries={setSelectedSeries}
        />
        <LegendButton
          name='Fast'
          color='#67DE9C'
          selectedSeries={selectedSeries}
          setSelectedSeries={setSelectedSeries}
        />
        <LegendButton
          name='Fast AC'
          color='#F3B244'
          selectedSeries={selectedSeries}
          setSelectedSeries={setSelectedSeries}
        />
      </div>
    </div>
  )
}
