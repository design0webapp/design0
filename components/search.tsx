"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Search(props: { query: string | undefined }) {
  const [query, setQuery] = useState(props.query);
  const router = useRouter();

  const handleSearch = () => {
    if (query != undefined && query.trim().length > 0) {
      router.push(`/?query=${query.trim()}`);
    }
  };

  return (
    <div className="w-[48rem] max-w-full flex space-x-2">
      <Input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(event) => {
          event.preventDefault();
          setQuery(event.currentTarget.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}
