import React, { Component } from 'react';
import { dummyData } from '../../api/dummyData.js';

// code adapted from sample React demo by creator of map package
// https://github.com/dburles/meteor-google-maps-react-example/blob/master/googlemaps-react.jsx

export const MapDisplay = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    options: React.PropTypes.object.isRequired
  },

  componentDidMount() {
    // GoogleMaps and methods made available through meteor package
    const selfProps= this.props;
    const self = this;
    GoogleMaps.create({
      name: this.props.name,
      element: document.getElementById('map-container'),
      options: this.props.options
    });

    // Once the map is ready, we can start setting the pins
    GoogleMaps.ready(this.props.name, function(map) {
      //set initial radius and markers of map instance
      selfProps.setMapRadius(map.instance);
      selfProps.setPhotos();

      //set map so avaialble to rest of component
      selfProps.setMapInstance(map);

      //add listener for when zoom level changes 
      //https://developers.google.com/maps/documentation/javascript/events#EventProperties
      map.instance.addListener('zoom_changed', function() {
        console.log('go!');
        selfProps.setMapRadius(map.instance);
        selfProps.setPhotos();
      });
      
      self.generateMarkers();
    });

  },

  componentWillReceiveProps() {
    this.generateMarkers();
  },

  generateMarkers() {
    const selfProps= this.props;
    console.log('these are the markers: ', selfProps.markers);

    //go through existing markers and set map to current map so they display
    for(let marker of selfProps.markers) {
      marker.setMap(null);
      marker.setMap(selfProps.map.instance);
      const photoUrl = marker.url;
      google.maps.event.addListener(marker, 'click', function() {
          window.location.href = photoUrl;
      });
    }
  },

  componentWillUnmount() {
    if (GoogleMaps.maps[this.props.name]) {
      google.maps.event.clearInstanceListeners(GoogleMaps.maps[this.props.name].instance);
      delete GoogleMaps.maps[this.props.name];
    } 
  },
  render() {
    return <div className="map-container" id="map-container" style={mapsStyles}></div>;
  }
});

const mapsStyles = {
  width: window.innerWidth,
  height: (window.innerHeight - 130),
  left: 0,
  top: 0,

  backgroundColor: 'white',
  textAlign: 'center',
  color: '#3f51b5',
  fontSize: 16,
  fontWeight: 'bold',
  padding: 4
};

export const DEFAULT_MAP_ZOOM = 15;
export const DEFAULT_MAX_POSTS = 10;
