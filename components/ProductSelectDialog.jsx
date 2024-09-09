"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Search } from "lucide-react";
import { useEffect } from "react";

const ProductSelectDialog = ({ open, onOpenChange, getProducts }) => {
  useEffect(() => {
    if (open) {
      getProducts();
    }

    return () => {};
  }, [open]);

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
      </DialogContent>
    </Dialog>
  );
};

export default ProductSelectDialog;
