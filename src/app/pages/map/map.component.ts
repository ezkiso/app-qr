import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var mapboxgl:any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {

  lat :number;
  lng: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    let geo:any = this.route.snapshot.paramMap.get('geo');
    geo = geo.substring(4);
    geo = geo.split(',');
    this.lat = Number (geo[0]);
    this.lng = Number (geo[1]);
    console.log(this.lat);
    console.log(this.lng);
  }

  ngAfterViewInit() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZXpraXNvIiwiYSI6ImNsOWE2eDl5NzAyZjUzd3FwNHN4NW1mbmEifQ._Lfx921cihfoFnlDq-ghpQ';
    const map = new mapboxgl.Map({
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/light-v10',
    center: [this.lng, this.lat],
    zoom: 15.5,
    pitch: 45,
    bearing: -17.6,
    container: 'map',
    antialias: true
    });

    map.on('load', () => {
      map.resize();
      new mapboxgl.Marker()
       .setLngLat([this.lng,this.lat])
       .addTo(map);
      const layers = map.getStyle().layers;
      const labelLayerId = layers.find(
      (layer) => layer.type === 'symbol' && layer.layout['text-field']
      ).id;
  
      map.addLayer({
        'id': 'add-3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height':[
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.6
        }
      },labelLayerId);
    });
  }

}
