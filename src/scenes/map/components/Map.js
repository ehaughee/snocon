import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: this.props.focus.lng || -121,
      lat: this.props.focus.lat || 47.5,
      zoom: this.props.focus.zoom || 8,
    };
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [ lng, lat ],
      zoom
    });

    this.addMarkers(map, this.props.locations);

    map.on('move', () => {
      const { lng, lat } = map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });
    this.map = map;
  }

  componentDidUpdate(prevProps) {
    if (this.props.focus.lat != prevProps.focus.lat ||
        this.props.focus.lng != prevProps.focus.lng ||
        this.props.focus.zoom != prevProps.focus.zoom) {
      this.map.jumpTo({
        center: [ this.props.focus.lng, this.props.focus.lat],
        zoom: this.props.focus.zoom,
      });
    }
  }

  addMarkers(map, locations) {
    for (var i = 0; i < locations.length; i++) {
      new mapboxgl.Popup({ closeOnClick: false, closeButton: false })
        .setLngLat([locations[i].point.lon,
                   locations[i].point.lat])
        .setHTML(locations[i].name)
        .addTo(map);
    }
  }

  render() {
    const { lng, lat, zoom } = this.state;

    return (
      <div>
        <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
          <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
        </div>
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
      </div>
    );
  }



};
export default Map;
