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
import { useEffect, useRef, useState } from 'react'
import BaseMap from '../../../../../../../../components/Maps/BaseMap'
import { numRound } from '../../../../../../../../utils'
import { GeoJSON, TileLayer, ZoomControl } from 'react-leaflet'
import { FeatureTable } from './FeatureTable'
import HoverButton from './HoverButton'
import { GridImpactGraph, OccupancyGraph } from './ResultsCharts'

/**
 * Returns a color for a given value between 0 and 1. White means close to 0,
 * while dark red indicates a value close to 1. A six-color gradient is
 * built.
 *
 * @param {float} val - The value of interest.
 *
 * @return {string} The HEX color code.
 *
 */
function getAreaColor (val) {
  return val > 0.83
    ? '#a50f15'
    : val > 0.67
      ? '#de2d26'
      : val > 0.5
        ? '#fb6a4a'
        : val > 0.33
          ? '#fc9272'
          : val > 0.17
            ? '#fcbba1'
            : '#fee5d9'
}

/**
 * Returns a dictionary containing all styling inputs for an area in a
 * chloropleth map plot.
 *
 * @param {Object} feature - The feature entry corresponding to the area
 * of interest in the Geojson describing the geographical data.
 *
 * @return {string} The HEX color code.
 *
 */
function styleArea (feature) {
  return {
    fillColor: getAreaColor(feature.properties.normData),
    weight: 1,
    opacity: 1,
    color: 'white',
    dashArray: '2',
    fillOpacity: 0.7
  }
}

function LegendRow ({ color, minRange, maxRange }) {
  const text = `${minRange} - ${maxRange}`
  return (
    <div className='inline-flex items-center'>
      <span className='w-2 h-2 inline-block mr-2' style={{ backgroundColor: color }} />
      <span className='text-gray-600'>{text}</span>
    </div>
  )
}

function Legend ({ maxVal }) {
  return (
    <div className='flex flex-col bg-white border-black border-2 rounded ml-2 mt-2 px-2'>
      <LegendRow color='#fee5d9' minRange={0} maxRange={numRound(0.17 * maxVal, 2)} />
      <LegendRow color='#fcbba1' minRange={numRound(0.17 * maxVal, 2)} maxRange={numRound(0.33 * maxVal, 2)} />
      <LegendRow color='#fc9272' minRange={numRound(0.33 * maxVal, 2)} maxRange={numRound(0.5 * maxVal, 2)} />
      <LegendRow color='#fb6a4a' minRange={numRound(0.5 * maxVal, 2)} maxRange={numRound(0.67 * maxVal, 2)} />
      <LegendRow color='#de2d26' minRange={numRound(0.67 * maxVal, 2)} maxRange={numRound(0.83 * maxVal, 2)} />
      <LegendRow color='#a50f15' minRange={numRound(0.83 * maxVal, 2)} maxRange={numRound(maxVal, 2)} />
    </div>
  )
}

/**
 * Returns a component representing a choropleth map plot of the
 * DSS simulation results, with dynamically updating table and
 * charts upon hovering zones defined in the provided geojson.
 *
 * @param {Array} centerPt - The coordinates of the center point of
 * the map.
 * @param {Object} geojson - The geojson data to plot on the map.
 * @param {Object} results - The results of the DSS simulation.
 *
 */
export default function ResultsMap ({ centerPt, geojson, results, hasPowerOutputs }) {
  const [mapData, setMapData] = useState(geojson)
  const [geokey, setGeokey] = useState('start_parking_time00')
  const [dataForMap, setDataForMap] = useState('start_parking_time')
  const [hour, setHour] = useState(8)
  const [selected, setSelected] = useState({ hour: 8 })
  const [maxVal, setMaxVal] = useState(1)
  const layerSelected = useRef(null)

  useEffect(() => {
    if (typeof hour !== 'undefined') {
      const data = []
      results.forEach(val => {
        if (val[dataForMap].length) {
          data.push(val[dataForMap][hour])
        } else {
          data.push(val[dataForMap])
        }
      })
      const maxData = Math.max(...data)
      setMaxVal(maxData)
      mapData.features.forEach((val, ind) => {
        val.properties.areaIndex = ind
        val.properties.hour = hour
        val.properties.normData = data[ind] / maxData
      })
      setMapData(mapData)
      setGeokey(`${dataForMap}${hour}`)
      setSelected({ hour })
    }
  }, [geojson, results, hour, dataForMap, mapData])

  const setPropertiesInSelected = p => {
    const { areaIndex, Name, hour } = p
    setSelected({ areaIndex, Name, hour })
  }

  const highlightFeature = e => {
    if (layerSelected.current === null) {
      setPropertiesInSelected(e.target.feature.properties)
    }
    if (e.target !== layerSelected.current) {
      e.target.setStyle({
        weight: 4,
        color: 'gray',
        fillOpacity: 0.8
      })
    }
  }

  const resetHighlight = e => {
    if (layerSelected.current === null) {
      setSelected({ hour })
    }
    if (e.target !== layerSelected.current) {
      e.target.setStyle(styleArea(e.target.feature))
    }
  }

  const onAreaClick = e => {
    if (e.target !== layerSelected.current) {
      if (layerSelected.current !== null) {
        layerSelected.current.setStyle(styleArea(layerSelected.current.feature))
      }
      setPropertiesInSelected(e.target.feature.properties)
      e.target.setStyle({
        weight: 4,
        color: 'red',
        fillOpacity: 0.5
      })
      layerSelected.current = e.target
    } else {
      setSelected({ hour })
      layerSelected.current.setStyle(styleArea(layerSelected.current.feature))
      layerSelected.current = null
    }
  }

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: onAreaClick
    })
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='grid grid-cols-10 items-center gap-2 w-full'>
        <div className='col-span-6'>
          <div className='flex flex-row justify-between items-center mb-2'>
            <p className='text-gray-500 dark:text-gray-100'>Hour</p>
            <input
              className='w-4/5 h-2 bg-gray-200 dark:bg-gray-500 rounded-lg appearance-none cursor-pointer'
              name='hour'
              type='range'
              min={0}
              max={23}
              value={hour}
              onChange={event => {
                const selectedHour = parseInt(event.currentTarget.value)
                setHour(selectedHour)
                layerSelected.current = null
                setSelected({ hour: selectedHour })
              }}
            />
            <p className='text-gray-500 dark:text-gray-100'>{hour}</p>
          </div>
          <BaseMap
            className='z-0' // z-0 is necessary to avoid the map cutting the hoverable tooltips
            center={centerPt}
            zoom={12}
            scrollWheelZoom={false}
            zoomControl={false}
            style={{ height: 600, width: '100%' }}
          >
            <>
              <TileLayer
                url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
                attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
              />
              {mapData &&
                <GeoJSON
                  key={geokey}
                  data={mapData}
                  style={styleArea}
                  onEachFeature={onEachFeature}
                />}
              <div className='leaflet-top leaflet-right'>
                <HoverButton
                  className='leaflet-control leaflet-bar'
                  checked={layerSelected.current === null}
                  onChange={e => {
                    layerSelected.current.setStyle(styleArea(layerSelected.current.feature))
                    layerSelected.current = null
                    setSelected({ hour })
                  }}
                  disabled={layerSelected.current === null}
                />
              </div>
              <div className='leaflet-top leaflet-left'>
                <Legend maxVal={maxVal} />
              </div>
              <ZoomControl position='bottomright' />
            </>
          </BaseMap>
        </div>
        <div className='col-span-4 border-incitEV-blue'>
          <FeatureTable selected={selected} results={results} dataForMap={dataForMap} setDataForMap={setDataForMap} hasPowerOutputs={hasPowerOutputs} />
        </div>
      </div>
      {hasPowerOutputs && (
        <div className='grid grid-cols-10 items-center gap-2 w-full mt-2'>
          <div className='col-span-5'>
            <GridImpactGraph
              results={results}
              selected={selected}
            />
          </div>
          <div className='col-span-5'>
            <OccupancyGraph
              results={results}
              selected={selected}
            />
          </div>
        </div>
      )}
    </div>
  )
}
