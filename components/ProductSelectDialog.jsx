"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";

const ProductSelectDialog = ({ open, onOpenChange, getProducts, responseData, setResponseData }) => {
  const [localData, setLocalData] = useState(
    responseData.map((item) => ({
      ...item,
      checked: false,
      variants: item.variants.map((variant) => ({
        ...variant,
        checked: false,
      })),
    }))
  );
  console.log("localData", localData);
  useEffect(() => {
    if (open) {
      getProducts();
    }

    return () => {};
  }, [open]);
  useEffect(() => {
    if (responseData.length > 0) {
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
    }
  }, [responseData]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Products</DialogTitle>
        </DialogHeader>
        <hr />
        <div className="relative">
          <input
            className="border border-gray-300 relative rounded-md p-2 pl-8 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Select Product"
          />
          <Search className="w-4 h-4 absolute inset-y-3 left-2 text-gray-500 cursor-pointer" />
        </div>
        <hr />
        <div className="flex flex-col">
          {localData.map((item, idx) => (
            <>
              <div
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
                <div>{item.title}</div>
              </div>
              {item.variants.map((variant, index) => (
                <div
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
                      <div>99 available</div>
                      <div>${variant.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductSelectDialog;
