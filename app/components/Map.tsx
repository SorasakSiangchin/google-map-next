"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  DirectionsService,
  DirectionsRenderer,
  Marker,
  HeatmapLayer,
} from "@react-google-maps/api";
import TextField from "@mui/material/TextField";
import { Button, CircularProgress } from "@mui/material";

const defaultCenter = {
  lat: 13.743819989418041,
  lng: 100.5325740579386,
};

const GoogleMapPage: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    width: "60%",
    height: "500px",
    border: "2px solid ",
  };

  // TODO
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
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
            lng: position.coords.longitude,
          });
        },
        () => {
          console.error("Error fetching the user's location");
        }
      );
    }
  }, []);

  const onPlaceChanged = async () => {
    //startRef.current?.getPlace().geometry
    if (startRef.current && endRef.current) {
      // ดึงสถานที่ 1
      const startPlace = startRef.current.getPlace();
      // ดึงสถานที่ 2
      const endPlace = endRef.current.getPlace();
      // geometry => คุณสมบัติของสถานที่ที่ถูกเลือก ซึ่งมีข้อมูลทางเรขาคณิต เช่น ตำแหน่ง (location), ขอบเขต (viewport), และอื่นๆ
      if (startPlace && startPlace.geometry && endPlace && endPlace.geometry) {
        setStart(startPlace.formatted_address || "");
        setEnd(endPlace.formatted_address || "");
      }
    }
  };

  const calculateRoute = () => {
    if (start && end) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: start,
          destination: end,
          travelMode: google.maps.TravelMode.DRIVING,
          language: "th",
        },
        (result, status) => {
          console.log("result : ", result);
          if (status === google.maps.DirectionsStatus.OK) {
            // console.log("result : ", result);
            setDirections(result);
          } else {
            console.error(`Error fetching directions ${result}`);
          }
        }
      );
    }
  };

  const refreshRoute = () => {
    if (start && end) {
      const directionsService = new google.maps.DirectionsService();

      startRef.current = null; // ล้างข้อมูลใน startRef.current
      endRef.current = null; // ล้างข้อมูลใน endRef.current

      const startTextField = document.getElementById(
        "start"
      ) as HTMLInputElement;

      if (startTextField) startTextField.value = "";

      const endTextField = document.getElementById("end") as HTMLInputElement;

      if (endTextField) endTextField.value = "";

      directionsService.route(null as any);
      setDirections(null);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as any}
      libraries={["places", "visualization"]}
      loadingElement={
        <div className="w-full flex justify-center">
          <CircularProgress />
        </div>
      }
    >
      <div className="flex justify-center mt-6 ">
        <div className="max-w-[90rem] flex gap-2">
          <Autocomplete
            onPlaceChanged={onPlaceChanged}
            onLoad={(autocomplete) => (startRef.current = autocomplete)}
            className="w-full"
          >
            <TextField
              id="start"
              label="start location"
              variant="outlined"
              size="small"
              className="w-[100%]"
            />
          </Autocomplete>
          <Autocomplete
            onLoad={(autocomplete) => (endRef.current = autocomplete)}
            onPlaceChanged={onPlaceChanged}
            className="w-full"
          >
            <TextField
              id="end"
              label="end location"
              variant="outlined"
              size="small"
              className="w-[100%]"
            />
          </Autocomplete>
          <Button onClick={calculateRoute} variant="contained">
            ตกลง
          </Button>
          <Button onClick={refreshRoute} variant="contained" color="inherit">
            ล้าง
          </Button>
        </div>
      </div>
      <div className="flex gap-2 px-10 py-6">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onLoad={(map) => setMap(map)}
        >
          {directions ? (
            <DirectionsRenderer directions={directions} />
          ) : (
            <Marker position={center} />
          )}
        </GoogleMap>
        <div className="w-[40%]">
          <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm">
            <dl className="-my-3 divide-y divide-gray-100 text-sm">
              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">จุดเริ่มต้น</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {directions?.routes[0].legs[0].start_address}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">จุดสิ้นสุด</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {directions?.routes[0].legs[0].end_address}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">ระยะทาง</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {directions?.routes[0].legs[0].distance?.text}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">ระยะเวลา</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {directions?.routes[0].legs[0].duration?.text}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">สรุป</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {directions?.routes[0].summary}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </LoadScript>
  );
};

export default GoogleMapPage;
