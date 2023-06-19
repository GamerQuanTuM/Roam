"use client";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import Modal from "@/assets/Modal-Image.png";

interface Props {
  isOpen: boolean;
  handleModal: () => void;
  line: string[];
  flag: boolean;
}

const SavedTripsModal: FC<Props> = ({ handleModal, isOpen, line, flag }) => {
  const [savedTripsImage, setSavedTripsImage] = useState("");
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    if(isOpen) {
      const imageUrlString = localStorage.getItem("imageUrl");
      const imageUrl = imageUrlString && JSON.parse(imageUrlString);
      console.log('saved trip-> ', imageUrl && Object.values(imageUrl)[0]);
    }
    // if (!imageUrl) return;
    // const imageUrlValues: any = Object?.values(imageUrl);
    // if (imageUrlValues.length === 0) return;
    // const imageUrlKeys: string | null = imageUrlValues[1] as string;
    // setSavedTripsImage(imageUrlKeys);
  }, [flag, isOpen]);

  useEffect(() => {
  }, [])
  
  // console.log("SavedTripsss -->", savedTripsImage);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-400/50">
          <div className="bg-white p-8 rounded shadow-lg h-[540px] w-[540px] flex flex-col items-center gap-7 relative pt-[50px]">
            <h2 className="text-3xl font-bold">Ready to go on a adventure?</h2>
            <input
              type="text"
              className="w-[424px] h-[48px] rounded-3xl px-5 border-[2px] border-solid border-black bg-[#F2F2F2]"
              placeholder="Trip name"
            />
            <Image src={Modal} alt="modal-image" width={410} height={410} />
            <div className="flex gap-2">
              <button
                className="w-[152px] h-[40px] flex justify-around items-center px-4 py-2 rounded-3xl font-bold"
                style={{ border: "2px solid #FFC857" }}
                onClick={handleModal}
              >
                DON&apos;T SAVE
              </button>
              <button className="w-[152px] h-[40px] flex justify-around items-center px-4 py-2 bg-[#FFC857] rounded-3xl font-bold">
                SAVE TRIP
              </button>
            </div>
            <div
              className="absolute right-6 top-4 cursor-pointer"
              onClick={handleModal}
            >
              <RxCross1 size={25} className="font-bold" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SavedTripsModal;
