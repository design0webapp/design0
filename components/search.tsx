"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Search(props: { query: string | undefined }) {
  const [query, setQuery] = useState(props.query);
  const router = useRouter();

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
      />
      <Button
        onClick={() => {
          router.push(`/?query=${query}`);
        }}
      >
        Search
      </Button>
    </div>
  );
}
