import React from "react";
import { MdOutlineCancel } from "react-icons/md";

import { Button } from ".";
import { chatData } from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";

const Notification = () => {
  const { currentColor, handleClick } = useStateContext();

  return (
    <div className="nav-item absolute right-5 md:right-40 top-16 bg-[#1A1C1E] border-2 border-gray-600 p-8 rounded-lg w-96">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <p className="text-lg font-semibold text-gray-200">Notifications</p>
          <button
            type="button"
            className="p-1 px-2 text-xs text-white rounded bg-orange-theme "
          >
            4 New
          </button>
        </div>
        <button
          type="button"
          onClick={() => handleClick(false)}
          style={{ color: "rgb(153, 171, 180)", borderRadius: "50%" }}
          className="text-2xl hover:drop-shadow-xl hover:bg-light-gray"
        >
          <MdOutlineCancel />
        </button>
      </div>
      <div className="mt-5 ">
        {chatData?.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-5 p-3 leading-8 border-b-1 border-color"
          >
            <img
              className="w-10 h-10 rounded-full"
              src={item.image}
              alt={item.message}
            />
            <div>
              <p className="font-semibold text-gray-200">{item.message}</p>
              <p className="text-sm text-gray-400"> {item.desc} </p>
            </div>
          </div>
        ))}
        <div className="mt-5">
          <Button
            color="white"
            bgColor={currentColor}
            text="See all notifications"
            borderRadius="10px"
            width="full"
          />
        </div>
      </div>
    </div>
  );
};

export default Notification;
