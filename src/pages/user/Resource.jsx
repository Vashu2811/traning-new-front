import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Resource = ({ resources }) => {
  const filteredResources = resources?.filter(
    (resource) => !resource.is_deleted
  );

  const fetchFileUrl = async (fileName, folderName) => {
    try {
      const response = await axios.get(
        `https://coreutilities.hcomb.ai/v1/aws/getFile?fileName=${fileName}&folderName=${folderName}`
      );
      return response.data.data;
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });

      return null;
    }
  };

  const openFile = async (fileName, folderName) => {
    const url = await fetchFileUrl(fileName, folderName);
    if (url) {
      window.open(url, "_blank");
    }
  };

  const getFileName = (url) => {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return pathname.substring(pathname.lastIndexOf("/") + 1);
  };

  return (
    <>
      <ToastContainer />
      {filteredResources ? (
        <>
          <div className="m-5 bg-[#1A1C1E] rounded-lg border border-[#37383A]">
            <div className="flex items-center justify-between header-title">
              <h4>Resources</h4>
            </div>

            <div className="grid gap-6 p-5 2xl:grid-cols-3 xl:grid-cols-2 lg:grid-cols-1">
              {filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex-1 min-w-[200px] shadow-md shadow-[#303234] rounded-[4px] overflow-hidden"
                >
                  <div className="flex flex-col gap-3">
                    {/* <img
                      className="object-cover w-full h-36"
                      src={resource.imageUrl}
                      alt={resource.title}
                    /> */}
                    <div className="px-2 text-[#BDBEBE]">
                      <div className="mb-3 text-lg font-bold">
                        {resource.title}
                      </div>
                      <p className="text-base font-normal">
                        {resource.resource_text}
                      </p>
                    </div>
                    <div className="flex justify-center px-2 pb-5">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          openFile(getFileName(resource.file), "resources");
                        }}
                    className="bg-[#282B2F] w-full hover:bg-[#5b52e7] hover:text-[#fff] hover:border-[#282B2F] border border-[#37383A] text-[#BDBEBE] text-sm  font-bold px-6 py-3 mr-2.5 rounded-[4px]"
                     
                     >
                        Open PDF
                        {/* {resource.resource_text} */}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="m-5 p-5 text-white bg-[#1A1C1E] rounded-lg border border-[#37383A]">
          Resource Not Found
        </div>
      )}
    </>
  );
};
export default Resource;
