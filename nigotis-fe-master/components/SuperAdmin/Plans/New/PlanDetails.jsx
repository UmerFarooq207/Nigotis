import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import InputComp from "@/components/Utils/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateForInput } from "@/lib/utils";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function PlanDetails({ details, setDetails }) {
  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (value) => {
    setDetails((prev) => ({ ...prev, type: value }));
  };
  const [currentItem, setCurrentItem] = useState({
    title: "",
    tagline: "",
    points: [],
  });
  const [point, setPoint] = useState("");

  const handleAddItem = () => {
    if (
      !currentItem.title ||
      !currentItem.tagline ||
      currentItem.points.length <= 0
    ) {
      toast({
        variant: "destructive",
        description: "Title, Tagline, and points cannot be left empty.",
      });
      return;
    }
    setDetails((prev) => ({
      ...prev,
      includes: [...prev.includes, currentItem],
    }));
    setCurrentItem({
      title: "",
      tagline: "",
      points: [],
    });
  };

  const handleDeleteItem = (index) => {
    setDetails((prev) => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index),
    }));
  };

  const handleAddPoint = () => {
    setCurrentItem((prev) => ({
      ...prev,
      points: [...(prev.points || []), point],
    }));
    setPoint("");
  };

  const handleDeletePoint = (index) => {
    setCurrentItem((prev) => ({
      ...prev,
      points: currentItem.points.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-custom-gradient">
        Plan Details
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <InputComp
            id="name"
            name="name"
            value={details.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="tagline">Tagline</Label>
          <InputComp
            id="tagline"
            name="tagline"
            value={details.tagline}
            onChange={handleChange}
          />
        </div>
        {/* type  */}
        <div>
          <Label htmlFor="type">Type</Label>
          <Select onValueChange={handleTypeChange} value={details.type}>
            <SelectTrigger className="w-full bg-gray-200">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="screens">Screens</Label>
          <InputComp
            id="screens"
            name="screens"
            type="number"
            value={details.screens}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="oldPricePerMonth">Old Price Per Month</Label>
          <InputComp
            id="oldPricePerMonth"
            name="oldPricePerMonth"
            type="number"
            value={details.oldPricePerMonth}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="pricePerMonth">Price Per Month</Label>
          <InputComp
            id="pricePerMonth"
            name="pricePerMonth"
            type="number"
            value={details.pricePerMonth}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="pricePerScreen">Price Per Screen</Label>
          <InputComp
            id="pricePerScreen"
            name="pricePerScreen"
            type="number"
            value={details.pricePerScreen}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <InputComp
            id="title"
            name="title"
            value={currentItem.title}
            onChange={(e) => {
              setCurrentItem((prev) => {
                return { ...prev, title: e.target.value };
              });
            }}
          />
        </div>
        <div>
          <Label htmlFor="tagline">Tagline</Label>
          <InputComp
            id="tagline"
            name="tagline"
            value={currentItem.tagline}
            onChange={(e) => {
              setCurrentItem((prev) => {
                return { ...prev, tagline: e.target.value };
              });
            }}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-start gap-4 w-full">
        <div className="flex items-center gap-2 w-full  md:w-1/2">
          <div className=" w-full">
            <Label htmlFor="point">Point</Label>
            <InputComp
              id="point"
              name="point"
              value={point}
              onChange={(e) => {
                setPoint(e.target.value);
              }}
            />
          </div>
          <p
            className=" cursor-pointer mt-4 ml-2 flex items-center"
            onClick={handleAddPoint}
          >
            Add <Plus />
          </p>
        </div>
        <div className="w-full md:w-1/2 ">
          <p className=" text-lg font-semibold">Points:</p>
          <div className=" pl-6">
            {currentItem?.points.map((point, index) => {
              return (
                <p
                  key={index}
                  className={`${
                    index % 2 == 0 ? "bg-gray-200" : "bg-white"
                  } pr-6 rounded-lg relative`}
                >
                  {index + 1}. {point}{" "}
                  <Trash2
                    size={18}
                    className=" absolute top-1 right-1 cursor-pointer text-red-500"
                    onClick={() => {
                      handleDeletePoint(index);
                    }}
                  />
                </p>
              );
            })}
          </div>
        </div>
      </div>
      <Button variant="secondary" className=" w-full" onClick={handleAddItem}>
        Add Include
      </Button>

      <div>
        <h1 className="font-semibold text-xl">Includes:</h1>
        <div className="space-y-2">
          {details?.includes.map((_item, i) => {
            return (
              <div
                key={_item?.title}
                className={`${
                  i % 2 == 0 ? "bg-gray-200" : "bg-white"
                } pl-4 flex items-start gap-2 rounded-lg relative`}
              >
                <h1 className=" font-semibold text-lg">{i + 1}. </h1>
                <div>
                  <h1 className=" font-semibold text-lg">
                    Title: {_item?.title}
                  </h1>
                  <p className=" font-semibold">Tagline: {_item?.tagline}</p>
                  <p className=" font-semibold">Points:</p>
                  <div className=" pl-4">
                    {_item?.points.map((point, index) => {
                      return (
                        <p key={index}>
                          {index + 1}. {point}
                        </p>
                      );
                    })}
                  </div>
                </div>
                <Trash2
                  size={18}
                  className=" absolute top-4 right-4 cursor-pointer text-red-500"
                  onClick={() => {
                    handleDeleteItem(i);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
