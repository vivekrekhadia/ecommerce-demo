"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import useDebounce from "@/lib/utils";

const ProductSelectDialog = ({
  open,
  onOpenChange,
  getProducts,
  responseData,
  setResponseData,
  search,
  setSearch,
  page,
  setPage,
}) => {
  const [hasMore, setHasMore] = useState(true);
  const debouncedSearch = useDebounce(search, 500);
  const [seletedProduct, setSeletedProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [localData, setLocalData] = useState(
    responseData?.map((item) => ({
      ...item,
      checked: false,
      variants: item.variants.map((variant) => ({
        ...variant,
        checked: false,
      })),
    })) || []
  );

  const fetchMoreData = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get("https://stageapi.monkcommerce.app/task/products/search", {
        params: {
          search: search || "",
          page: page || 2,
          limit: 10,
        },
        headers: {
          "x-api-key": "72njgfa948d9aS7gs5",
          // "Access-Control-Allow-Origin": "*",
          // "Content-Type": "application/json",
        },
      });
      result.data.length > 0 ? setHasMore(true) : setHasMore(false);

      // setResponseData((prevItems) => [...prevItems, ...result.data]);
      setLocalData((prevItems) => [
        ...prevItems,
        ...result.data.map((item) => ({
          ...item,
          checked: false,
          variants: item.variants.map((variant) => ({
            ...variant,
            checked: false,
          })),
        })),
      ]);
      setPage((p) => p + 1);
    } catch (error) {
      console.log(error, "errorerrorerrorerror");
    } finally {
      setIsLoading(false);
    }
  };
  console.log("localData", responseData, localData);

  useEffect(() => {
    if (open) {
      getProducts(search);
    }

    return () => {};
  }, [open, debouncedSearch]);

  useEffect(() => {
    if (responseData?.length > 0) {
      setLocalData(
        responseData.map((item) => ({
          ...item,
          checked: false,
          variants: item.variants.map((variant) => ({
            ...variant,
            checked: false,
          })),
        }))
      );
    } else {
      setLocalData([]);
    }
  }, [responseData]);

  useEffect(() => {
    if (localData?.length > 0) {
      setSeletedProduct(localData?.filter((item) => item.checked === true).map());
    }
  }, [localData]);
  console.log("seletedProduct", seletedProduct, localData);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Products</DialogTitle>
        </DialogHeader>
        <hr />
        <div className="relative">
          <input
            className="border border-gray-300 relative rounded-md p-2 pl-8 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Select Product"
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <Search className="w-4 h-4 absolute inset-y-3 left-2 text-gray-500 cursor-pointer" />
        </div>
        <hr />
        {/*  */}
        {/* <div className="flex flex-col h-[600px]"> */}
        {localData.length > 0 ? (
          <InfiniteScroll
            dataLength={localData.length}
            next={fetchMoreData}
            hasMore={hasMore}
            height={600}
            loader={<div>Loading...</div>}
            endMessage={<div>You are all done</div>}
          >
            {localData.map((item, idx) => (
              <>
                <div
                  key={item.id}
                  className="flex items-center gap-4 text-lg  justify-start p-4 border-b cursor-pointer"
                  onClick={() => {
                    setLocalData((prev) => {
                      const newLocalData = [...prev];
                      newLocalData[idx].checked = !newLocalData[idx].checked;
                      newLocalData[idx].variants.forEach((variant) => {
                        variant.checked = newLocalData[idx].checked;
                      });
                      return newLocalData;
                    });
                  }}
                >
                  <Checkbox
                    checked={item.checked}
                    //   onCheckedChange={(checked) => {
                    //     setLocalData((prev) => {
                    //       const newLocalData = [...prev];
                    //       newLocalData[idx].checked = checked;
                    //       newLocalData[idx].variants.forEach((variant) => {
                    //         variant.checked = checked;
                    //       });
                    //       return newLocalData;
                    //     });
                    //   }}
                  />
                  {/* {item?.image?.src && (
                    <Image src={item?.image?.src} unoptimized alt={item.title} width={50} height={50} />
                  )} */}
                  <div>{item.title}</div>
                </div>
                {item.variants.map((variant, index) => (
                  <div
                    key={variant.id}
                    className="flex items-center gap-4 text-lg pl-14 justify-start p-4 border-b cursor-pointer"
                    onClick={() => {
                      setLocalData((prev) => {
                        const newLocalData = [...prev];

                        newLocalData[idx].variants[index].checked = !newLocalData[idx].variants[index].checked;
                        if (newLocalData[idx].variants.every((item) => item.checked === false)) {
                          newLocalData[idx].checked = false;
                        } else {
                          newLocalData[idx].checked = true;
                        }
                        return newLocalData;
                      });
                    }}
                  >
                    <Checkbox
                      checked={variant.checked}
                      // onCheckedChange={(checked) => {
                      //   setLocalData((prev) => {
                      //     const newLocalData = [...prev];
                      //     newLocalData[idx].checked = true;

                      //     newLocalData[idx].variants[index].checked = checked;
                      //     return newLocalData;
                      //   });
                      // }}
                    />

                    <div className="flex items-center justify-between w-full">
                      <div>{variant.title}</div>
                      <div className="flex items-center gap-10">
                        <div>{variant.inventory_quantity > 0 ? variant.inventory_quantity : "Not"} available</div>
                        <div>${variant.price}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ))}
          </InfiniteScroll>
        ) : (
          <div className="text-center p-2 border ">No Products Found</div>
        )}
        <hr />
        <DialogFooter className="justify-end">
          {/* <DialogClose asChild> */}
          <button type="button" className="bg-gray-100 text-black w-max px-4 py-2 rounded-md hover:bg-gray-200">
            Cancel
          </button>
          <button type="button" className="bg-teal-600 text-white w-max px-4 py-2 rounded-md hover:bg-teal-700">
            Add
          </button>
          {/* </DialogClose> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductSelectDialog;
