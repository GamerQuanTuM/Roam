/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState, useRef } from "react";
import { axiosInstance } from "@/libs/config";


type Props = {
  locationName: string;
  setFlag: any;
  cityName: string;
};

export default function Images({ locationName, setFlag, cityName }: Props) {
  const [imageUrl, setImageUrl] = useState("");
  const locationRef = useRef(locationName);

  const placeBaseUrl = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
  const photoBaseUrl = "https://maps.googleapis.com/maps/api/place/photo";


  useEffect(() => {

    const distanceString = localStorage.getItem("distance");
    const distance = distanceString
    ? JSON.parse(distanceString)
    : [];

    if(distance.indexOf(locationName) === -1) {
      distance.push(locationName);
      localStorage.setItem("distance", JSON.stringify(distance));
    }

    const fetchImage = async () => {
      const itineraryResponseString = localStorage.getItem("ItineraryResponse"); 
      const itineraryResponse = itineraryResponseString ? JSON.parse(itineraryResponseString) : "";
      const size: number = itineraryResponse.split(/\n\d+\.\s/).length-1;
      // console.log(size);
      
      const locationString = localStorage.getItem("location"); // geting the location value from localstorage
      const location = locationString !== null ? JSON.parse(locationString) : null;
      const specificLocationName: string = `${locationName}${cityName}${location}`;
      const placeName: string = specificLocationName.replace(/ /g, "%20");

      const imageUrlObjString = localStorage.getItem("imageUrl"); // geting the imageMapUrl from localstorage
      const imageUrlObj = imageUrlObjString ? JSON.parse(imageUrlObjString) : {};

      if(imageUrlObj.hasOwnProperty(locationName)){
        const url = imageUrlObj[locationName];
        setImageUrl(url);
        return;
      }

      const response = await axiosInstance.post("/api/google-places-placeId-api",{
        placeName,placeBaseUrl
      });
      const results = response.data;

      const storedPlaceIdObjString = localStorage.getItem("imageMapUrl"); // geting the imageMapUrl from localstorage
      const storedPlaceIdObj = storedPlaceIdObjString
      ? JSON.parse(storedPlaceIdObjString)
      : {};

      if (results?.candidates[0]?.hasOwnProperty("place_id")) {
        const place_id = results.candidates[0].place_id;
        locationRef.current = place_id;
        storedPlaceIdObj[locationName] = place_id;                // setting 
        if(Object.keys(storedPlaceIdObj).length === size) setFlag(true);
        localStorage.setItem("imageMapUrl", JSON.stringify(storedPlaceIdObj));

        if (results.candidates[0]?.hasOwnProperty("photos")) {
          const photo_reference = results.candidates[0].photos[0].photo_reference;
          const response = await axiosInstance.post("/api/google-places-photos-api",{
            photoBaseUrl,photo_reference
          });
  
          const url = response?.data;
          if (url) {
            const imageUrlObjString = localStorage.getItem("imageUrl"); // geting the imageMapUrl from localstorage
            const imageUrlObj = imageUrlObjString
            ? JSON.parse(imageUrlObjString)
            : {};
  
            imageUrlObj[locationName] = url;
            localStorage.setItem("imageUrl", JSON.stringify(imageUrlObj));
          }
          setImageUrl(url);
        }
      }

    };
    fetchImage();
  }, [locationName, setFlag]);

  return (
    <>
      {imageUrl === "" ? (
        <h1 className="border-2 border-gray-500/50 border-dashed rounded-xl w-[100%] h-[202px] flex justify-center items-center">
          Image preview is not available
        </h1>
      ) : (
        <img className="rounded-xl w-[100%] h-[202px] object-cover" src={imageUrl || "" } width={'300px'} height={'274px'}></img>
      )}
    </>
  );
}