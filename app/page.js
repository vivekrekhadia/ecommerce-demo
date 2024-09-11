"use client";
import ProductSelectDialog from "@/components/ProductSelectDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { ChevronDown, Edit, Edit2, GripVertical, X } from "lucide-react";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import testData from "../test.json";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default function Home() {
  const [open, setOpen] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(2);

  const [products, setProducts] = useState([
    {
      id: 0,
      product: {
        name: "",
        discount: {
          enabled: false,
        },
        variants: [],
      },
    },
  ]);

  const addProduct = () => {
    setProducts([
      ...products,
      {
        id: products.length + 1,
        product: {
          name: "",
          discount: {
            enabled: false,
          },
          variants: [],
        },
      },
    ]);
  };
  const removeProduct = (index) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
  };

  const getProducts = async (search, page) => {
    try {
      // const result = await testData;
      const result = await axios.get("https://stageapi.monkcommerce.app/task/products/search", {
        params: {
          search: search || "",
          page: 1,
          limit: 10,
        },
        headers: {
          "x-api-key": "72njgfa948d9aS7gs5",
          // "Access-Control-Allow-Origin": "*",
          // "Content-Type": "application/json",
        },
      });
      console.log("result", result.data);
      setResponseData(result.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(products, result.source.index, result.destination.index);
    setProducts(items);
  };
  console.log("products", products);

  const handleSubmit = async (localData, seletedProduct) => {
    setProducts((prev) => {
      const newProducts = [...prev];
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className=" p-8  w-full max-w-3xl">
        <h1 className="text-2xl font-semibold mb-6 text-start">Add Products</h1>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-left font-semibold">Product</div>
          <div className="text-left font-semibold">Discount</div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable" type="group">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {products.map((item, index) => (
                  <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <>
                        <div
                          className="grid grid-cols-2 gap- mb-4"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <div className="flex items-center">
                            <div className="mr-2 text-lg" {...provided.dragHandleProps}>
                              <GripVertical className="cursor-pointer" />
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                className="border border-gray-300 relative rounded-md p-2 w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="Select Product"
                                readOnly
                                value={item.product.name}
                                // onChange={(e) => {
                                //   const newProducts = [...products];
                                //   newProducts[index].product.name = e.target.value;
                                //   setProducts(newProducts);
                                // }}
                              />

                              <Edit2
                                className="w-4 h-4 absolute inset-y-3 right-2 text-gray-500 cursor-pointer"
                                onClick={() => {
                                  setOpen(true);
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-10">
                            {!item.product.discount.enabled ? (
                              <button
                                onClick={() => {
                                  setProducts((prev) => {
                                    const newProducts = [...prev];
                                    console.log("newProducts", newProducts);
                                    newProducts[index].product.discount.enabled = true;
                                    return newProducts;
                                  });
                                }}
                                className="bg-teal-600 text-white w-max px-4 py-2 rounded-md hover:bg-teal-700"
                              >
                                Add Discount
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  className="border border-gray-300 relative rounded-md p-2 w-16 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                                <Select defaultValue="flat" value={item.product.discount.type}>
                                  <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="Theme" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="flat">Flat</SelectItem>
                                    <SelectItem value="percentage">% Off</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {products.length > 1 && (
                              <X className="cursor-pointer" onClick={() => removeProduct(index)} />
                            )}
                          </div>
                        </div>
                        {item.product.variants.length > 0 && (
                          <div className="text-blue-500 underline cursor-pointer text-right">
                            Show Variants <ChevronDown className="inline" />
                          </div>
                        )}
                      </>
                    )}
                  </Draggable>
                ))}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="text-right">
          <button
            onClick={addProduct}
            className="mt-4 border border-teal-600 text-teal-600 px-6 py-2 rounded-md hover:bg-teal-50"
          >
            Add Product
          </button>
        </div>
      </div>
      {open && (
        <ProductSelectDialog
          open={open}
          onOpenChange={setOpen}
          getProducts={getProducts}
          responseData={responseData}
          setResponseData={setResponseData}
          search={search}
          setSearch={setSearch}
          page={page}
          setPage={setPage}
        />
      )}
    </div>
  );
}
