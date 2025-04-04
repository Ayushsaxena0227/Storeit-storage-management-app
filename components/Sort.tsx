"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import { sortTypes } from "@/constants";
import { Loader } from "lucide-react";

const Sort = () => {
  const path = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleSort = (value: string) => {
    setLoading(true);
    router.push(`${path}?sort=${value}`);
    setTimeout(() => setLoading(false), 1000); // Simulate loading state
  };
  return (
    <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
      <SelectTrigger className="sort-select">
        <SelectValue placeholder={sortTypes[0].value} />
      </SelectTrigger>
      <SelectContent className="sort-select-content">
        {loading ? (
          <div className="flex justify-center items-center h-10">
            <Loader className="animate-spin w-6 h-6 text-gray-500" />
          </div>
        ) : (
          sortTypes.map((sort) => (
            <SelectItem
              key={sort.label}
              className="shad-select-item"
              value={sort.value}
            >
              {sort.label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

export default Sort;
