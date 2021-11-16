import React from 'react';
import env from 'react-dotenv';
import mapStyles from '../mapStyles';
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
    MarkerClusterer
} from '@react-google-maps/api'
import { formatRelative } from 'date-fns'

import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
    getLatlng,
} from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption
} from "@reach/combobox";

import '@reach/combobox/styles.css'


const libraries = ['places']
const mapContainerStyle = {
    width: "800px",
    height: "800px",
};

const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true
}

const center = {
    lat: 34.0522,
    lng: -118.2437
}



const Map = () => {

    const { isLoaded, loadError } = useLoadScript({
        id: process.env.GOOGLE_MAPS_ID || env.GOOGLE_MAPS_ID,
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || env.GOOGLE_MAPS_API_KEY,
        libraries
    });


    const [markers, setMarkers] = React.useState([]);
    const [selected, setSelected] = React.useState(null)

    const onMapClick = React.useCallback((event) => {
        setMarkers((current) => [
            ...current,
            {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
                time: new Date
            }
        ])
    },
        [])

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);

    const panTo = React.useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(12);
    }, [])

    if (loadError) return 'Error Loading maps';
    if (!isLoaded) return "Loading Maps";

    return (
        <div>
            <Search panTo={panTo} />
            <Locate panTo={panTo}/>
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={8} center={center} options={options} onClick={onMapClick} onLoad={onMapLoad}>

                {markers.map((marker) => (
                    <Marker
                        key={marker.time.toISOString()}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        icon={
                            {
                                url: "/toilet.svg",
                                scaledSize: new window.google.maps.Size(30, 30),
                                origin: new window.google.maps.Point(0, 0),
                                anchor: new window.google.maps.Point(15, 15)
                            }
                        }
                        onClick={() => {
                            setSelected(marker)
                        }}
                    />
                ))}

                {selected ? (<InfoWindow position={{ lat: selected.lat, lng: selected.lng }} onCloseClick={() => { setSelected(null) }}>
                    <div>
                        <h2>This is a Toilet</h2>
                    </div>
                </InfoWindow>) : null}
            </GoogleMap>
        </div>
    )

    function Locate({ panTo }) {
        return <button className="locate" onClick={() => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                panTo({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            }, () => null)
        }} 
        >
            <img src="/arrow.svg" alt="compass - locate me"/>
        </button>
        
    }
    function Search({ panTo }) {
        // hook gives back is the script ready to go, current value as user is typing in the search box, suggestions of places and data, a setValue function and a clearSuggestions function
        const { ready, 
                value, 
                suggestions: { status, data }, 
                setValue, 
                clearSuggestions 
            } = usePlacesAutocomplete({
            requestOptions: {
                // uses locations close to user, will subsitute hardcoded lat and long with users lat and long
                location: {
                    lat: () => 34.0522,
                    lng: () => -118.2437
                },
                radius: 200 * 1000,
            },
        });

        return (
        
        <Combobox onSelect={async (address) => {
            // false means that you should not fetch data from google API because we will do that with get Geocode
           
            setValue(address, false)

            // remove suggestion boxes
            clearSuggestions();

            try {
                const results = await getGeocode({address});
                const { lat, lng } = await getLatLng(results[0])
                panTo({lat, lng})

            } catch(error) {
                console.log('error!')
            }
            console.log(address)
            }}>
            <ComboboxInput 
                value={value} 
                onChange={(e) => {
                    setValue(e.target.value)
                    }}
                disabled={!ready}
                placeholder="Enter an address"
            >

            </ComboboxInput>
            <ComboboxPopover>
                <ComboboxList>
                {status === "OK" && data.map(({id, description}) => 
                <ComboboxOption key={id} value={description}/> )}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    
        )
    }

}

export default Map;