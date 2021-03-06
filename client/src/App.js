import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Header } from "./Header";
import { Journey } from "./Journey";
import { ExampleFetch } from "./services/components";
import { Map } from './Map';

/*create a special Geolocator class which has a method
  that returns a promise for obtaining the coordinates */
class Geolocator {
  constructor() {
    this.navigator = navigator;
  }

  getCurrentPosition(){    
    return new Promise((resolve, reject) => {
      this.navigator.geolocation.getCurrentPosition((pos) => {
        //arrow function for sucess passing the coordinates into resolve
        let latitude = pos.coords.latitude;
        let longitude = pos.coords.longitude;

        resolve({latitude, longitude})}, () => {
          //arrow function for failure passing the error message to reject
          reject('We could not get your location');
      });
    });
  }
}

class App extends Component {
  constructor(props){
    super(props);
    //initial state with null message & isLoaded flag
    this.state = {
      errorMessage: null,
      isLoaded: false
    };
  }

  componentDidMount(){
    //first check for geolocation availability & isLoaded flag
    if ('geolocation' in navigator && !this.isLoaded){
      let myGeolocator = new Geolocator();
      /*Set state with new coordinates if successful. On failure set state with
        error message and load map with default coordinates. Set isLoaded to
        true in both cases*/
      myGeolocator.getCurrentPosition()
        .then((result) => {
          this.setState({
            isLoaded: true,
            center: {
              lat: result.latitude,
              lng: result.longitude
            }
          });
        })
        .catch((error) => {
          this.setState({
            isLoaded: true,
            errorMessage: error.message
          });
        });
    }
    else{
      //geolocation is unavailable, Map compoment with default props will load
      this.setState({
        isLoaded: true,
        errorMessage: 'Your browser does not support geolocation'
      });
    }    
  }
  
  render() {
    const {errorMessage, isLoaded, center} = this.state;
    if (errorMessage){
      /*Error will happen if geolocation is unavailable or coordinates were unable
        to be obtained via getCurrentPosition. Show error message in an alert box
        and render the map with default props. */
      alert(errorMessage);
      return (
        <div>
        <Map />
        <Header />
        <Journey />
        <ExampleFetch />
        </div>
      );
    }
    else if (!isLoaded){
      //display a "Loading..." before geolocation finishes. This could be fancier
      return <div>Loading...</div>
    }
    else{
      /*If successful, render the map with custom props
        passing in the coordinates obtained via getCurrentLocation.*/
      return (
        <div>
        <Map
          defaultZoom={12}
          defaultCenter={center}
        />
        <Header />
        <Journey />
        <ExampleFetch />
        </div>
      )
    }
  }
}

export default App;
