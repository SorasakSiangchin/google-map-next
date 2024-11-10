"use client"

import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Autocomplete, DirectionsService, DirectionsRenderer, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '500px'
};

const defaultCenter = {
    lat: -3.745,
    lng: -38.523
};

const MapComponent: React.FC = () => {

    // TODO
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const startRef = useRef<google.maps.places.Autocomplete | null>(null);
    const endRef = useRef<google.maps.places.Autocomplete | null>(null);
    const [center, setCenter] = useState(defaultCenter);

    // ที่อยู่ปัจจุบันของเรา
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCenter({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                () => {
                    console.error("Error fetching the user's location");
                }
            );
        }
    }, []);

    const onPlaceChanged = () => {
        if (startRef.current && endRef.current) {
            const startPlace = startRef.current.getPlace();
            const endPlace = endRef.current.getPlace();

            if (startPlace && startPlace.geometry && endPlace && endPlace.geometry) {
                setStart(startPlace.formatted_address || '');
                setEnd(endPlace.formatted_address || '');
            }
        }
    }

    const calculateRoute = () => {
        if (start && end) {
            const directionsService = new google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: start,
                    destination: end,
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        console.log("result : ", result);
                        setDirections(result);
                    } else {
                        console.error(`Error fetching directions ${result}`);
                    }
                }
            );
        }
    };

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as any}
            libraries={['places']}>
            <div>
                <Autocomplete

                    onPlaceChanged={onPlaceChanged}
                    onLoad={(autocomplete) => (startRef.current = autocomplete)}
                >
                    <input id="start" type="text" placeholder="Start location" />
                </Autocomplete>
                <Autocomplete onLoad={(autocomplete) => (endRef.current = autocomplete)} onPlaceChanged={onPlaceChanged}>
                    <input id="end" type="text" placeholder="End location" />
                </Autocomplete>
                <button onClick={calculateRoute}>Calculate Route</button>
            </div>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}

                zoom={10}
                onLoad={(map) => setMap(map)}
            >

                {directions ? <DirectionsRenderer directions={directions} /> : <Marker position={center} />}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;
