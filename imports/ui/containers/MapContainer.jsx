import React, { Component } from 'react';
import {GOOGLEAPI} from '../../api/google-keys.js';
import { MapDisplay, DEFAULT_MAX_POSTS, DEFAULT_MAP_ZOOM } from '../components/MapDisplay.jsx';
import { radiusOfCurrentZoom } from '../../api/utils';

// code adapted from sample React demo by creator of map package
// https://github.com/dburles/meteor-google-maps-react-example/blob/master/googlemaps-react.jsx
export const MapContainer = React.createClass({

  mixins: [ReactMeteorData],

  componentDidMount() {
    GoogleMaps.load();
  },

  getInitialState: function() {
      return {
        markers: [],
        radius: 100000,
        zoom: DEFAULT_MAP_ZOOM
      };
    },

  setMarkers: function(newMarkers) {
    // this.setState({markers: newMarkers,});
    let self = this;
    Meteor.call('posts.nearby', this.data.currentLoc.lng, this.data.currentLoc.lat, this.state.radius, DEFAULT_MAX_POSTS,
            function(err, result) {
            if (err) { throw new Error ('Problem finding posts from database')}
            self.setState({markers: result});
          });
  },

  setMapRadius: function(mapInstance) {
    //change state so that radius adjusts for new map instances
    this.setState({radius: radiusOfCurrentZoom(mapInstance), zoom: mapInstance.zoom });
  },

  getMeteorData() {
    var self = this;
    var currentLoc = Geolocation.latLng();
   
    if(GoogleMaps.loaded() && currentLoc) {
      var markersSettings = {
        center: currentLoc,
        maxRecords: DEFAULT_MAX_POSTS,
        radius: this.state.radius
      };

      // Meteor.call('posts.nearby', markersSettings.center.lng, markersSettings.center.lat, markersSettings.radius, markersSettings.maxRecords,
      //         function(err, result) {
      //         if (err) { throw new Error ('Problem finding posts from database')}
      //         //use the onMarkersUpdate method to update the state so map markers can update reactively
      //         self.onMarkersUpdate(result);
      //       });

      // var handle = Meteor.subscribe('posts.nearbyPub', markersSettings);

      // if( handle.ready() ) {
      //   Meteor.call('posts.nearby', markersSettings.center.lng, markersSettings.center.lat, markersSettings.radius, markersSettings.maxRecords,
      //     function(err, result) {
      //     if (err) { throw new Error ('Problem finding posts from database')}
      //     self.onMarkersUpdate(result);
      //   });
      // }

      var options = {
        center: new google.maps.LatLng(currentLoc.lat, currentLoc.lng),
        zoom: this.state.zoom,
        libraries: 'geometry,places',
        key: GOOGLEAPI
      };
    }

    return {
      loaded: GoogleMaps.loaded(),
      mapOptions: GoogleMaps.loaded() && options,
      markers: self.markers,
      currentLoc: currentLoc
    }
  },

  render() {
    if (this.data.loaded && this.data.mapOptions) {   
      return <MapDisplay 
                name="mymap" 
                options={this.data.mapOptions} 
                markers={this.state.markers}
                setMapRadius = {this.setMapRadius}
                setMarkers= {this.setMarkers} />;
    }   
    return <div>Loading map...</div>;
  }

});