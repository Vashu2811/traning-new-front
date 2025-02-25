import { GoDotFill } from "react-icons/go";

import { Button } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { SparklineAreaData, earningData } from "../data/dummy";
import { useSelector } from "react-redux";

const Ecommerce = () => {
  const {  } = useStateContext();
  const { currentColor } = useSelector(state => state.customer);

  return (
    <div className="px-12 py-6 lg:mt-16 md:mt-16 max-sm:mt-20 sm:mt-20 bg-[#242728]">
      <div className="flex flex-wrap justify-center lg:flex-nowrap">
        <div className="w-full h-48 p-8 bg-[#1A1C1E] text-[#BDBEBE] rounded-xl lg:mb-0 md:mb-4 max-sm:mb-4 sm:mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 font-bold text-[#8F9BB3]">Earing</p>
              <p className="text-2xl text">$68,255.25</p>
            </div>
          </div>
          <div className="mt-6">
            <Button
              color="white"
              bgColor="#282B2F"
              text="Download"
              borderRadius="4px"
              size="sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 lg:mb-4 md:mb-4 max-sm:mb-4 sm:mb-4">
          {earningData.map((item) => {
            return (
              <div
                key={item.title}
                className="p-6 bg-[#1A1C1E] text-[#BDBEBE] lg:w-auto md:w-56 rounded-2xl"
              >
                <button
                  type="button"
                  style={{
                    color: item.iconColor,
                    backgroundColor: item.iconBg,
                  }}
                  className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
                >
                  {item.icon}
                </button>
                <p className="mt-3">
                  <span className="text-lg font-semibold">{item.amount}</span>
                  <span className={`text-sm  text-${item.pcColor} ml-2`}>
                    {item.percentage}
                  </span>
                </p>
                <p className="mt-1 text-sm text-gray-400 ">{item.title}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-10">
        <div className="p-6 bg-[#1A1C1E] text-[#BDBEBE] rounded-2xl md:w-780">
          <div className="flex justify-between ">
            <p className="text-xl font-semibold">Revenue Updates</p>
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-2 text-gray-600 hover:drop-shadow-xl">
                <span>
                  <GoDotFill />
                </span>
                <span>Expense</span>
              </p>
              <p className="flex items-center gap-2 text-green-400 hover:drop-shadow-xl">
                <span>
                  <GoDotFill />
                </span>
                <span>Budget</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-10 mt-10">
            <div className="pr-10 m-4 border-r-1 border-color ">
              <div>
                <p>
                  <span className="text-3xl font-semibold">$93,438.00</span>
                  <span className="p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-[#BDBEBE] bg-green-400 ml-3 text-xs">
                    23%
                  </span>
                </p>
                <p>
                  <p className="mt-1 text-gray-600">Budget</p>
                </p>
              </div>
              <div className="mt-8">
                <p>
                  <span className="text-3xl font-semibold">$43,634.00</span>
                </p>
                <p>
                  <p className="mt-1 text-gray-500">Expense</p>
                </p>
              </div>

              <div className="mt-5"></div>
              <div className="mt-10 ">
                <Button
                  color="white"
                  bgColor="#282B2F"
                  text="Download Report"
                  borderRadius="4px"
                />
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ecommerce;
