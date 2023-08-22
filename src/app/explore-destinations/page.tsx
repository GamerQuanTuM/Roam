"use client";
import { FC, useState, FormEvent, useEffect, ChangeEvent } from "react";
import { toast } from "react-hot-toast";
import ClientOnly from "@/components/ClientOnly";
import { usePathname, useRouter } from "next/navigation";
import Loader from "@/components/Loading";
import { exploreDestinationPrompt } from "@/constants/prompts";
import { axiosInstance } from "@/libs/config";
import axios from "axios";

const TripType = ({
  type,
  isActive,
  onClick,
  isFirst,
  isLast,
}: {
  type:
    | "Beach"
    | "Mountain"
    | "Desert"
    | "Glacier"
    | "Wildlife"
    | "Cities"
    | "Domestic"
    | "International";
  isActive: boolean;
  onClick: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`${isActive && "bg-[#FFC857]"} 
    ${isFirst && "rounded-l-full"} ${isLast && "rounded-r-full border-none"}
    w-[50%] text-center h-full flex items-center justify-center cursor-pointer border-r-2 border-solid border-gray-500/50`}
  >
    <h1 className="text-xl font-medium">{type}</h1>
  </button>
);

const ExploreDestinations: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [origin, setOrigin] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState("");
  const [months, setMonths] = useState("");
  const [response, setResponse] = useState("");

  const [tripDetails, setTripDetails] = useState<{
    beach: boolean;
    mountain: boolean;
    desert: boolean;
    glacier: boolean;
    wildlife: boolean;
    cities: boolean;
  }>({
    beach: true,
    mountain: false,
    desert: false,
    glacier: false,
    wildlife: false,
    cities: false,
  });

  const [tripDetailsInput, setTripDetailsInput] = useState<
    "Beach" | "Mountain" | "Desert" | "Glacier" | "Wildlife" | "Cities"
  >("Beach");

  const [tripType, setTripType] = useState<{
    domestic: boolean;
    international: boolean;
  }>({
    domestic: true,
    international: false,
  });

  const [tripTypeInput, setTripTypeInput] = useState<
    "Domestic" | "International"
  >("Domestic");

  const handleTripDetails = (
    type: "beach" | "mountain" | "desert" | "glacier" | "wildlife" | "cities",
    text: "Beach" | "Mountain" | "Desert" | "Glacier" | "Wildlife" | "Cities"
  ) => {
    setTripDetails((prevState) => ({
      ...prevState,
      beach: type === "beach",
      mountain: type === "mountain",
      desert: type === "desert",
      glacier: type === "glacier",
      wildlife: type === "wildlife",
      cities: type === "cities",
    }));

    setTripDetailsInput(text);
  };

  const handleTripType = (
    type: "domestic" | "international",
    text: "Domestic" | "International"
  ) => {
    setTripType((prevState) => ({
      ...prevState,
      domestic: type === "domestic",
      international: type === "international",
    }));

    setTripTypeInput(text);
  };

  const monthsArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const prompt = exploreDestinationPrompt(
    origin,
    parseInt(days),
    // tripDetailsInput,
    // tripTypeInput,
    months
  );


  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(
        "/api/explore-destinations-api",
        {
          prompt,
        }
      );
      setLoading(false);
      setResponse(response.data);
      console.log(response.data)
      //router.push("destination")
    } catch (error: any) {
      setLoading(false);
      console.error(error.message);
    }
  };

  useEffect(() => {
    localStorage.setItem(
      "ExploreDestinationResponse",
      JSON.stringify(response)
    );
  }, [response]);

  useEffect(() => {
    localStorage.setItem("ItineraryResponse", JSON.stringify(pathname));
  }, [pathname]);

  if (loading) {
    return <Loader />;
  }

  return (
    <ClientOnly>
      <form
        onSubmit={onFormSubmit}
        className="flex flex-col items-center justify-center h-full w-full gap-[88px]"
      >
        <div className="h-[40px] ">
          <h1 className="text-[#3F3D56] text-5xl">
            Explore destinations for your next trips
          </h1>
        </div>
        <div className="flex flex-col gap-[40px]">
          <input
            type="text"
            className="w-[624px] h-[48px] rounded-3xl px-5 border-[2px] border-solid border-black bg-[#F2F2F2]"
            placeholder="Origin"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setOrigin(e.target.value)
            }
            value={origin}
          />
          <div className="flex gap-2 w-[624px]">
            <input
              className="flex items-center w-[50%] h-[48px] rounded-3xl px-5 border-[2px] border-solid border-black bg-[#F2F2F2] placeholder:text-center"
              type="text"
              placeholder="Vacation duartion (in days)"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDays(e.target.value)
              }
              value={days}
            />

            <select
              className="flex items-center w-[50%] h-[48px] rounded-3xl px-8 border-[2px] border-solid border-black bg-[#F2F2F2]"
              placeholder="Month of Travel"
              value={months}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setMonths(e.target.value)
              }
            >
              {monthsArray.map((month, i) => (
                <option value={month} key={i}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="flex h-[48px] bg-[#F2F2F2] rounded-full justify-center items-center">
            <TripType
              type="Beach"
              isActive={tripDetails.beach}
              onClick={() => handleTripDetails("beach", "Beach")}
              isFirst
            />
            <TripType
              type="Mountain"
              isActive={tripDetails.mountain}
              onClick={() => handleTripDetails("mountain", "Mountain")}
            />
            <TripType
              type="Desert"
              isActive={tripDetails.desert}
              onClick={() => handleTripDetails("desert", "Desert")}
            />
            <TripType
              type="Glacier"
              isActive={tripDetails.glacier}
              onClick={() => handleTripDetails("glacier", "Glacier")}
            />
            <TripType
              type="Wildlife"
              isActive={tripDetails.wildlife}
              onClick={() => handleTripDetails("wildlife", "Wildlife")}
            />
            <TripType
              type="Cities"
              isActive={tripDetails.cities}
              onClick={() => handleTripDetails("cities", "Cities")}
              isLast
            />
          </div>
          <div className="w-full flex justify-center items-center">
            <div className="flex h-[48px] bg-[#F2F2F2] w-[422px] rounded-full justify-center items-center">
              <TripType
                type="Domestic"
                isActive={tripType.domestic}
                onClick={() => handleTripType("domestic", "Domestic")}
                isFirst
              />
              <TripType
                type="International"
                isActive={tripType.international}
                onClick={() => handleTripType("international", "International")}
                isLast
              />
            </div>
          </div>
        </div>

        <button className="bg-[#ffc857] rounded-3xl h-12 w-80 font-bold text-xl cursor-pointer">
          SUGGEST DESTINATIONS
        </button>
      </form>
    </ClientOnly>
  );
};

export default ExploreDestinations;
