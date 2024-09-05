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
import dynamic from 'next/dynamic'
import { useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import { getTheme } from '../../../../../../utils'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

export function CPUtilizationChart () {
  const [series, setSeries] = useState([])
  const { values, touched, setFieldValue } = useFormikContext()
  const theme = getTheme()

  useEffect(() => {
    if (
      values.home_public ||
      values.home_private ||
      values.work_public ||
      values.work_private ||
      values.other_public ||
      touched.home_public ||
      touched.home_private ||
      touched.work_public ||
      touched.work_private ||
      touched.other_public
    ) {
      const ratios = [
        values.work_public,
        values.work_private,
        values.other_public,
        values.home_public,
        values.home_private
      ]
      if (ratios.every(val => typeof val === 'number')) {
        const total = Array.from(ratios, val => parseFloat(val)).reduce(
          (a, b) => a + b,
          0
        )
        const remain = Math.max(100 - total, 0)
        setSeries(ratios.concat([remain]))
        setFieldValue('cp_total', total)
      }
    }
  }, [
    values.work_public,
    values.work_private,
    values.other_public,
    values.home_public,
    values.home_private,
    touched.work_public,
    touched.work_private,
    touched.other_public,
    touched.home_public,
    touched.home_private,
    setFieldValue
  ])

  // To ensure that the chart is re-rendered when the theme changes
  useEffect(() => {}, [theme])

  const chart = {
    options: {
      colors: [
        '#c5ca30',
        '#52a675',
        '#ff924c',
        '#1982c4',
        '#b5a6c9',
        '#ff595e'
      ],
      labels: [
        'Work public',
        'Work private',
        'Other public',
        'Home public',
        'Home private',
        'Unset'
      ],
      legend: {
        position: 'top'
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            }
          }
        }
      ],
      theme: {
        mode: theme
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: true,
                fontSize: '22px',
                label: `Total ${values.cp_total} %`,
                formatter: function (w) {
                  if (values.cp_total === 100) return ''
                  return '⚠'
                }
              }
            }
          }
        }
      }
    }
  }
  return (
    <div className='flex flex-col items-center mixed-chart'>
      {typeof window !== 'undefined' && (
        <ReactApexChart
          options={chart.options}
          series={series}
          type='donut'
          height={400}
        />
      )}
      {values.cp_total !== 100 && (
        <div className='flex flex-row gap-2 text-center text-orange-500'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='#f97316'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' />
            <line x1='12' y1='9' x2='12' y2='13' />
            <line x1='12' y1='17' x2='12.01' y2='17' />
          </svg>
          <p>The sum of the ratios must be equal to 100%</p>
        </div>
      )}
    </div>
  )
}

export function TravelledDistanceChart () {
  const [series, setSeries] = useState([])
  const [labels, setLabels] = useState([])
  const { values, touched } = useFormikContext()

  useEffect(() => {
    if (values.travel_dist || touched.travel_dist) {
      const orderedData = [...values.travel_dist].sort((a, b) => a.key - b.key)
      setLabels(Array.from(orderedData, val => val.key.toString()))
      const data = Array.from(orderedData, val => parseFloat(val.value))
      setSeries([{
        name: 'Travelled Distance',
        type: 'column',
        data
      }, {
        name: 'Travel dist',
        type: 'line',
        data
      }])
    }
  }, [values.travel_dist, touched.travel_dist, setLabels, setSeries])
  const options = {
    chart: {
      height: 350,
      type: 'line',
      toolbar: {
        show: false
      }
    },
    stroke: {
      width: [0, 4]
    },
    labels,
    legend: {
      show: false
    },
    xaxis: {
      title: {
        text: 'Distance (km)',
        offsetY: 80,
        style: {
          fontSize: '14px'
        }
      }
    },
    yaxis: {
      decimalsInFloat: 0
    },
    theme: {
      mode: getTheme()
    }
  }
  return (
    <div className='flex flex-col items-center mixed-chart'>
      {typeof window !== 'undefined' && (
        <ReactApexChart
          options={options}
          series={series}
          type='line'
          height={400}
        />
      )}
    </div>
  )
}
