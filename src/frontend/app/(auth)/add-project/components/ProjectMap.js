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
import BaseMap from '../../../components/Maps/BaseMap'
import { CenterMapView } from '../../../components/Maps/CenterMapView'
import dynamic from 'next/dynamic'

const TileLayer = dynamic(
  async () => (await import('react-leaflet')).TileLayer,
  { ssr: false }
)
const GeoJSON = dynamic(async () => (await import('react-leaflet')).GeoJSON, {
  ssr: false
})

function styleArea (feature) {
  return {
    fillColor: feature.properties.invalid ? '#a50f15' : '#478AF7',
    weight: 1,
    opacity: 1,
    color: 'white',
    dashArray: '2',
    fillOpacity: 0.3
  }
}

export default function ProjectMap ({ mapData, setSelectedZone }) {
  const highlightFeature = e => {
    e.target.setStyle({
      weight: 1,
      color: '#478AF7',
      fillOpacity: 0.7
    })
  }

  const resetHighlight = e => {
    e.target.setStyle(styleArea(e.target.feature))
  }

  const onAreaClick = e => {
    setSelectedZone(e.target.feature.properties)
  }

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: onAreaClick
    })
  }

  return (
    <BaseMap
      center={[51.505, -0.09]}
      zoom={12}
      maxZoom={18}
      style={{ height: '100%', width: '100%' }}
    >
      <>
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {mapData && <GeoJSON data={mapData} style={styleArea} onEachFeature={onEachFeature} />}
        <CenterMapView mapData={mapData} />
      </>
    </BaseMap>
  )
}
