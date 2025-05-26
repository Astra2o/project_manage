"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CirclePlus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";

const MultiSelectPopover = ({
  placeholder,
  value,
  options,
  title = "value",
  returnKey = "value",
  onChange,
  visibleSelectedCount = 2,
}) => {
  const [selectedValues, setSelectedValues] = useState(value || []);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleValue = (val) => {
    const updatedValues = selectedValues.includes(val)
      ? selectedValues.filter((item) => item !== val)
      : [...selectedValues, val];
    setSelectedValues(updatedValues);

    const selectedReturnValues = options
      .filter((opt) => updatedValues.includes(opt.value))
      .map((opt) => opt[returnKey]);

    if (onChange) {
      onChange(selectedReturnValues);
    }
  };

  const selectedOptions = options.filter((opt) =>
    selectedValues.includes(opt.value)
  );
  const showAsNames = selectedOptions.length <= visibleSelectedCount;

  // filter options by search query
  const filteredOptions = options.filter((item) =>
    item[title].toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 rounded-full border-[2px] p-[4px] border-dotted"
        >
          <CirclePlus className="w-3 h-3" />
          <span className="leading-none">{placeholder}</span>
          {selectedOptions.length > 0 && (
            <Separator orientation="vertical" className="h-1 w-3 py-2" />
          )}

          <div className="hidden lg:flex items-center gap-1">
            {showAsNames
              ? selectedOptions.map((item) => (
                  <Badge
                    variant="secondary"
                    key={item.value}
                    className="text-xs font-medium"
                  >
                    {item[title]}
                  </Badge>
                ))
              : selectedOptions.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedOptions.length} selected
                  </Badge>
                )}
          </div>

          {selectedOptions.length > 0 && (
            <Badge variant="secondary" className="text-xs lg:hidden">
              {selectedOptions.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-52 space-y-2 p-3">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="max-h-60 overflow-y-auto space-y-2 mt-2">
            {filteredOptions.length === 0 && (
              <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
            )}
            {filteredOptions.map((item) => (
              <div key={item.value} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedValues.includes(item.value)}
                  onCheckedChange={() => toggleValue(item.value)}
                />
                {item.icon && <span>{item.icon}</span>}
                <span className="text-sm">{item[title]}</span>
                {item.totalCount !== undefined && (
                  <Badge variant="outline" className="ml-auto text-xs">
                    {item.totalCount}
                  </Badge>
                )}
              </div>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectPopover;
