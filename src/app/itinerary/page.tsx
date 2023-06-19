"use client";
import { FC, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";
import { HiOutlineRefresh } from "react-icons/hi";
import { toast } from "react-hot-toast";
import Card from "./card";
import formatDate from "./utils/format";
import { nextItinenaryPrompt } from "@/constants/prompts";
import { axiosInstance } from "@/libs/config";
import Loader from "@/components/Loading";
import ClientOnly from "@/components/ClientOnly";
import useAuthStore from "@/hooks/Auth";
import SavedTripsModal from "@/components/SavedTripsModal";

type dateType = {
  day: string;
  month: string;
  date: string;
};

type dayObj = {
  day: string;
  date: string;
  month: string;
  isActive?: boolean;
};

const Itinerary: FC = () => {
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const [flag, setFlag] = useState(false);
  const [firstDay, setFirstDay] = useState(true);
  const [saveIcon, setSaveIcon] = useState(false);
  const [itinerary, setItinerary] = useState<string[]>([]);
  const [date, setDate] = useState<Array<dateType>>([
    { day: " ", month: " ", date: " " },
  ]);
  const [daysArray, setDaysArray] = useState<Array<dayObj>>([
    { day: "0", date: "0", month: "", isActive: false },
    { day: "0", date: "0", month: "", isActive: false },
    { day: "0", date: "0", month: "", isActive: false },
    { day: "0", date: "0", month: "", isActive: false },
    { day: "0", date: "0", month: "", isActive: false },
  ]);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(5);
  let shortName: { [key: string]: string } = {
    January: "Jan",
    February: "Feb",
    March: "Mar",
    April: "Apr",
    May: "May",
    June: "Jun",
    July: "Jul",
    August: "Aug",
    September: "Sep",
    October: "Oct",
    November: "Nov",
    December: "Dec",
  };
  const [nextResponseInput, setNextResponseInput] = useState("");
  const [nextResponse, setNextResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationPlace, setLocationPlace] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  const prompt = nextItinenaryPrompt(nextResponseInput, locationPlace);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const nextResponseSubmit = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/api/create-itinerary-api", {
        prompt,
      });
      setNextResponse(response.data);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleRightArrowClick = () => {
    if (right > date.length - 1) return;
    setLeft(left + 1);
    setRight(right + 1);
  };

  const handleLeftArrowClick = () => {
    if (left < 1) return;
    setLeft(left - 1);
    setRight(right - 1);
  };

  const parseDate = (): void => {
    const dateString = localStorage.getItem("date");
    const dateObj = dateString && JSON.parse(dateString);

    const options: {} = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const newStartDate = new Date(dateObj.startDate);
    const newEndDate = new Date(dateObj.endDate);

    const objArray = [];
    while (newStartDate.getTime() != newEndDate.getTime()) {
      const dateString = newStartDate.toLocaleDateString(undefined, options);
      const dateArray = dateString.split(/[,\s]+/);
      const formatedDate = formatDate(parseInt(dateArray[2]));
      const obj = {
        day: dateArray[0],
        month: dateArray[1],
        date: formatedDate,
      };
      objArray.push(obj);
      newStartDate.setDate(newStartDate.getDate() + 1);
    }
    setDate(objArray);
  };

  useEffect(() => {
    if (date.length > 5) {
      setDaysArray(date.slice(left, right));
    } else {
      setDaysArray(date);
    }
  }, [date, left, right]);

  useEffect(() => {
    const data = localStorage.getItem("ItineraryResponse");
    const locationString = localStorage.getItem("location");
    const location =
      locationString !== null ? JSON.parse(locationString) : null;
    setLocationPlace(location);
    localStorage.removeItem("imageMapUrl");
    localStorage.removeItem("imageUrl");
    localStorage.removeItem("distance");
    parseDate();

    if (!data) return;
    else if (nextResponse) {
      localStorage.setItem("ItineraryResponse", JSON.stringify(nextResponse));
      const itineraryArray = nextResponse.split(/Day \d+:/);
      itineraryArray.shift();
      setItinerary(itineraryArray);
    } else {
      const parsedData = JSON.parse(data);
      console.log(parsedData)
      setNextResponseInput(parsedData);
      const itineraryArray = parsedData.split(/Day \d+:/);
      itineraryArray.shift();
      setItinerary(itineraryArray);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentPathname", JSON.stringify(pathname));
  }, [pathname]);

  const handleDayClick = (index: number) => {
    const updateDay = daysArray.map((day) => ({ ...day, isActive: false }));
    updateDay[index - left] = { ...daysArray[index - left], isActive: true };
    setDaysArray(updateDay);
  };

  const handleSaveTrips = async () => {
    if (!currentUser) {
      toast.error("Please login to save the itinerary");
    } else {
      setIsOpen(true);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <ClientOnly>
        <div>
          <div
            className={`flex w-[100%] h-[98px] justify-between items-center sticky top-0 left-0 bg-white px-[44px] py-[24px] shadow-[0px_8px_16px_rgba(0,0,0,.15)]`}
            style={{ zIndex: 1 }}
          >
            <div className="w-[789px] h-[76px] flex justify-start items-center p-0 m-4 ">
              <div className="w-[40px] h-[40px] flex justify-center items-center cursor-pointer">
                <FiChevronLeft
                  className="w-[40px] h-[25px]"
                  onClick={() => handleLeftArrowClick()}
                />
              </div>
              {daysArray.map((dayObj, index) => {
                return (
                  <a
                    key={index}
                    href={`#day${left + (index + 1)}`}
                    className={`w-[83px] h-[46px] flex flex-column items-center justify-center p-4 border-[2px] border-solid border-[#FFC857] rounded-3xl m-2 visited:bg-[#FFC857] ${
                      daysArray[index].isActive ? "bg-[#FFC857]" : ""
                    }`}
                    onClick={() => handleDayClick(left + index)}
                  >
                    <div style={{ pointerEvents: "none" }}>
                      <h1>DAY {left + (index + 1)}</h1>
                      <h1 className="font-bold">
                        {/* {shortName[dayObj.month]} */}
                        {/* <span>{parseInt(dayObj.date).toString()}</span> */}
                      </h1>
                    </div>
                  </a>
                );
              })}
              <div className="w-[40px] h-[40px] flex justify-center items-center cursor-pointer">
                <FiChevronRight
                  className="w-[40px] h-[25px]"
                  onClick={() => handleRightArrowClick()}
                />
              </div>
            </div>
            <div>
              <div className="flex gap-2">
                <button
                  className="w-[170px] h-[40px] flex justify-around items-center px-4 py-2 rounded-3xl"
                  style={{ border: "2px solid #FFC857" }}
                  onClick={nextResponseSubmit}
                >
                  <HiOutlineRefresh size={20} className="cursor-pointer" />
                  <p className="font-bold">REGENERATE</p>
                </button>

                <button
                  className="w-[102px] h-[40px] flex justify-around items-center px-4 py-2 bg-[#FFC857] rounded-3xl"
                  onClick={handleSaveTrips}
                >
                  <FaBookmark />
                  <p className="font-bold">SAVE</p>
                </button>
              </div>
            </div>
          </div>

          <div className=" mx-[88px] pb-10 scrollbar">
            {itinerary.map((line, index) => {
              return (
                <Card
                  line={line}
                  ParentIndex={index}
                  dateObj={date[index % date.length]}
                  key={index}
                  setFlag={setFlag}
                  flag={flag}
                />
              );
            })}
          </div>
          <SavedTripsModal isOpen={isOpen} handleModal={toggleModal} line={itinerary} flag={flag} />
        </div>
      </ClientOnly>
    </>
  );
};

export default Itinerary;
