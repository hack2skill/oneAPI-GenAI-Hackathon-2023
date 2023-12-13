import { Fragment, useEffect, useState } from "react";
import WRIST_WATCH_IMAGE from "@/assets/products/wrist-watches.jpg";

import HEALTH_PRODUCT from "@/assets/products/health-product.jpg";
import SMARTWATCH_PRODUCT from "@/assets/products/smartwatch-product.jpg";
import HEADPHONE_PRODUCT from "@/assets/products/headphone-product.jpg";
import CAMERA_PRODUCT from "@/assets/products/camera-product.jpg";
import LIPSTICK_PRODUCT from "@/assets/products/lipstick-product.jpg";

import Api from "./Api/Api.jsx";

export default function Search() {
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState("");

  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleInputChange = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    if (fieldName === "search") {
      setSearchText(fieldValue);
      return;
    }
  };

  const handleFileChange = async (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(event.target.files[0]);

    const imageFile = event.target.files[0];

    if (imageFile) {
      let base64ImageData = await convertToBase64(imageFile);
      base64ImageData = base64ImageData
        .replace("data:", "")
        .replace(/^.+,/, "");
      searchProduct(base64ImageData);
    }
  };

  const searchProduct = (imageData = null) => {
    let queryString = "";
    let queryRoute = "";

    if (!imageData) {
      queryRoute = "/advance_search";
      queryString = searchText;
      setSearchType("text");
    } else {
      queryRoute = "/advance_search?is_image=true";
      queryString = imageData;
      setSearchType("image");
    }

    setShowProducts(true);
    setIsLoading(true);

    const config = {
      headers: {
        query: queryString,
      },
    };

    Api.get(queryRoute, config)
      .then((response) => {
        setProducts(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <Fragment>
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <h4 className="mt-4 mb-4 font-bold text-4xl">Search ...</h4>
        <div className="w-full flex border-2 rounded">
          <input
            type="text"
            name="search"
            className="w-11/12 text-lg pl-4 py-4 rounded outline-none"
            placeholder="Search for products..."
            onChange={(e) => handleInputChange(e)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                searchProduct();
              }
            }}
          />
          <div className="w-1/12 flex">
            <button className="w-1/2" onClick={() => searchProduct()}>
              <i className="fa-solid fa-search fa-fw fa-lg text-gray-400"></i>
            </button>
            <input
              type="file"
              id="upload-image"
              className="hidden"
              onChange={(e) => handleFileChange(e)}
            />
            <label
              htmlFor="upload-image"
              className="w-1/2 mx-3 my-auto cursor-pointer"
            >
              <i className="fa-solid fa-camera fa-fw fa-lg text-gray-400"></i>
            </label>
          </div>
        </div>

        {showProducts && (
          <Fragment>
            <div>
              {searchType === "text" && (
                <h2 className="mt-8 font-bold text-2xl text-gray-800">
                  Showing results for "
                  <span className="text-indigo-500">{searchText}</span>"
                </h2>
              )}
              {searchType === "image" && (
                <div className="mt-4 flex items-center gap-4">
                  <h2 className="font-bold text-2xl text-gray-800">
                    Showing results for searched image
                  </h2>
                  <img src={preview} className="w-16" alt="product-image" />
                </div>
              )}
            </div>
            <div className="mt-6 mb-20 grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-6 w-full">
              <Fragment>
                {isLoading && (
                  <Fragment>
                    <div className="p-4 bg-white border shadow hover:shadow-md rounded-lg">
                      <div className="w-1/3 h-20 bg-gray-200 shimmer rounded"></div>
                      <div className="mt-4 flex gap-2">
                        <div className="w-3/12 h-2 bg-gray-200 shimmer"></div>
                        <div className="w-2/12 h-2 bg-gray-200 shimmer"></div>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <div className="w-3/5 flex flex-col space-y-2">
                          <div className="w-full h-4 bg-gray-300 shimmer"></div>
                          <div className="w-2/5 h-4 bg-gray-300 shimmer"></div>
                        </div>
                        <div className="w-1/5 h-4 bg-gray-200 shimmer"></div>
                      </div>
                    </div>
                    <div className="p-4 bg-white border shadow hover:shadow-md rounded-lg">
                      <div className="w-1/3 h-20 bg-gray-200 shimmer rounded"></div>
                      <div className="mt-4 flex gap-2">
                        <div className="w-3/12 h-2 bg-gray-200 shimmer"></div>
                        <div className="w-2/12 h-2 bg-gray-200 shimmer"></div>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <div className="w-3/5 flex flex-col space-y-2">
                          <div className="w-full h-4 bg-gray-300 shimmer"></div>
                          <div className="w-2/5 h-4 bg-gray-300 shimmer"></div>
                        </div>
                        <div className="w-1/5 h-4 bg-gray-200 shimmer"></div>
                      </div>
                    </div>
                    <div className="p-4 bg-white border shadow hover:shadow-md rounded-lg">
                      <div className="w-1/3 h-20 bg-gray-200 shimmer rounded"></div>
                      <div className="mt-4 flex gap-2">
                        <div className="w-3/12 h-2 bg-gray-200 shimmer"></div>
                        <div className="w-2/12 h-2 bg-gray-200 shimmer"></div>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <div className="w-3/5 flex flex-col space-y-2">
                          <div className="w-full h-4 bg-gray-300 shimmer"></div>
                          <div className="w-2/5 h-4 bg-gray-300 shimmer"></div>
                        </div>
                        <div className="w-1/5 h-4 bg-gray-200 shimmer"></div>
                      </div>
                    </div>
                    <div className="p-4 bg-white border shadow hover:shadow-md rounded-lg">
                      <div className="w-1/3 h-20 bg-gray-200 shimmer rounded"></div>
                      <div className="mt-4 flex gap-2">
                        <div className="w-3/12 h-2 bg-gray-200 shimmer"></div>
                        <div className="w-2/12 h-2 bg-gray-200 shimmer"></div>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <div className="w-3/5 flex flex-col space-y-2">
                          <div className="w-full h-4 bg-gray-300 shimmer"></div>
                          <div className="w-2/5 h-4 bg-gray-300 shimmer"></div>
                        </div>
                        <div className="w-1/5 h-4 bg-gray-200 shimmer"></div>
                      </div>
                    </div>
                    <div className="p-4 bg-white border shadow hover:shadow-md rounded-lg">
                      <div className="w-1/3 h-20 bg-gray-200 shimmer rounded"></div>
                      <div className="mt-4 flex gap-2">
                        <div className="w-3/12 h-2 bg-gray-200 shimmer"></div>
                        <div className="w-2/12 h-2 bg-gray-200 shimmer"></div>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <div className="w-3/5 flex flex-col space-y-2">
                          <div className="w-full h-4 bg-gray-300 shimmer"></div>
                          <div className="w-2/5 h-4 bg-gray-300 shimmer"></div>
                        </div>
                        <div className="w-1/5 h-4 bg-gray-200 shimmer"></div>
                      </div>
                    </div>
                    <div className="p-4 bg-white border shadow hover:shadow-md rounded-lg">
                      <div className="w-1/3 h-20 bg-gray-200 shimmer rounded"></div>
                      <div className="mt-4 flex gap-2">
                        <div className="w-3/12 h-2 bg-gray-200 shimmer"></div>
                        <div className="w-2/12 h-2 bg-gray-200 shimmer"></div>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <div className="w-3/5 flex flex-col space-y-2">
                          <div className="w-full h-4 bg-gray-300 shimmer"></div>
                          <div className="w-2/5 h-4 bg-gray-300 shimmer"></div>
                        </div>
                        <div className="w-1/5 h-4 bg-gray-200 shimmer"></div>
                      </div>
                    </div>
                  </Fragment>
                )}

                {!isLoading && (
                  <Fragment>
                    {products.map((value, index = 0) => (
                      <div
                        className="p-4 bg-white border shadow hover:shadow-md rounded-lg cursor-pointer"
                        key={index}
                      >
                        <img
                          src={"data:image/png;base64, " + value.image}
                          alt="product-image"
                        />
                        <h6 className="mt-4 text-gray-500 text-xs">
                          {value.masterCategory}{" "}
                          <i className="fa-solid fa-chevron-right fa-2xs fa-fw"></i>{" "}
                          {value.subCategory}
                        </h6>
                        <div className="flex justify-between items-start mt-2">
                          <h1 className="w-3/5 font-semibold">
                            {value.meta_data.caption}
                          </h1>
                          <p className="font-bold bg-gray-100 text-gray-600 text-sm px-2 rounded">
                            <i className="fa-solid fa-indian-rupee-sign fa-fw"></i>
                            {Math.floor(Math.random() * (2999 - 799 + 1)) + 799}
                          </p>
                        </div>
                      </div>
                    ))}
                  </Fragment>
                )}
              </Fragment>
            </div>

            {isLoading && (
              <div className="mx-auto w-2/5 flex justify-center mt-6 space-x-1">
                <div className="w-2/12 h-6 bg-gray-100 shimmer"></div>
                <div className="w-1/12 h-6 bg-gray-200 shimmer"></div>
                <div className="w-1/12 h-6 bg-gray-100 shimmer"></div>
                <div className="w-1/12 h-6 bg-gray-100 shimmer"></div>
                <div className="w-1/12 h-6 bg-gray-100 shimmer"></div>
                <div className="w-2/12 h-6 bg-gray-100 shimmer"></div>
              </div>
            )}

            {!isLoading && (
              <div className="flex justify-center mt-6 space-x-1">
                <button className="flex items-center justify-center h-8 w-8 rounded text-gray-400">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  className="flex items-center justify-center h-8 px-2 rounded text-sm font-medium text-gray-400"
                  disabled
                >
                  Prev
                </button>
                <button
                  className="flex items-center justify-center h-8 w-8 rounded bg-gray-100 text-sm font-medium text-gray-600"
                  disabled
                >
                  1
                </button>
                <button className="flex items-center justify-center h-8 w-8 rounded hover:bg-gray-100 text-sm font-medium text-gray-600 hover:text-gray-600">
                  2
                </button>
                <button className="flex items-center justify-center h-8 w-8 rounded hover:bg-gray-100 text-sm font-medium text-gray-600 hover:text-gray-600">
                  3
                </button>
                <button className="flex items-center justify-center h-8 px-2 rounded hover:bg-gray-100 text-sm font-medium text-gray-600 hover:text-gray-600">
                  Next
                </button>
                <button className="flex items-center justify-center h-8 w-8 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-600">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
          </Fragment>
        )}

        <h1 className="mt-10 mb-4 text-2xl font-bold">Products</h1>
        <div className="mb-20 grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-x-4 gap-y-12 w-full">
            <div className="p-4 bg-white border shadow hover:shadow-md rounded-lg cursor-pointer">
            <img src={HEALTH_PRODUCT} className="rounded" alt="product-image" />
            <h6 className="mt-4 text-gray-500 text-xs space-x-1">
              <span>Lifestyle</span>
              <i className="fa-solid fa-chevron-right fa-2xs fa-fw"></i>
              <span>Health</span>
            </h6>
            <div className="flex justify-between items-start mt-2">
              <h1 className="w-3/5 font-semibold">
                Cocoa drink with 4 flavours and special ingredients
              </h1>
              <p className="py-2 font-bold bg-gray-100 text-gray-600 text-sm px-2 rounded">
                <i className="fa-solid fa-indian-rupee-sign fa-fw"></i>
                799
              </p>
            </div>
          </div>
          <div className="p-4 bg-white border shadow hover:shadow-md rounded-lg cursor-pointer">
            <img src={CAMERA_PRODUCT} className="rounded" alt="product-image" />
            <h6 className="mt-4 text-gray-500 text-xs space-x-1">
              <span>Gadgets</span>
              <i className="fa-solid fa-chevron-right fa-2xs fa-fw"></i>
              <span>Camera</span>
            </h6>
            <div className="flex justify-between items-start mt-2">
              <h1 className="w-3/5 font-semibold">Automatic Polaroid Camera</h1>
              <p className="py-2 font-bold bg-gray-100 text-gray-600 text-sm px-2 rounded">
                <i className="fa-solid fa-indian-rupee-sign fa-fw"></i>
                2499
              </p>
            </div>
          </div>
          <div className="p-4 bg-white border shadow hover:shadow-md rounded-lg cursor-pointer">
            <img
              src={LIPSTICK_PRODUCT}
              className="rounded"
              alt="product-image"
            />
            <h6 className="mt-4 text-gray-500 text-xs space-x-1">
              <span>Beauty</span>
              <i className="fa-solid fa-chevron-right fa-2xs fa-fw"></i>
              <span>Lipstick</span>
            </h6>
            <div className="flex justify-between items-start mt-2">
              <h1 className="w-3/5 font-semibold">Shiny maroon lipstick</h1>
              <p className="py-2 font-bold bg-gray-100 text-gray-600 text-sm px-2 rounded">
                <i className="fa-solid fa-indian-rupee-sign fa-fw"></i>
                4999
              </p>
            </div>
          </div>
          <div className="p-4 bg-white border shadow hover:shadow-md rounded-lg cursor-pointer">
            <img
              src={HEADPHONE_PRODUCT}
              className="rounded"
              alt="product-image"
            />
            <h6 className="mt-4 text-gray-500 text-xs space-x-1">
              <span>Gadgets</span>
              <i className="fa-solid fa-chevron-right fa-2xs fa-fw"></i>
              <span>Audio</span>
            </h6>
            <div className="flex justify-between items-start mt-2">
              <h1 className="w-3/5 font-semibold">8x Bass Boosted Headphone</h1>
              <p className="py-2 font-bold bg-gray-100 text-gray-600 text-sm px-2 rounded">
                <i className="fa-solid fa-indian-rupee-sign fa-fw"></i>
                599
              </p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
