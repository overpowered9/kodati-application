"use client";

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import magnifier from "@/public/table/search.svg";
import Image from "next/image";

const Search = ({ search }: { search?: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const initialRender = useRef(true);

  const [text, setText] = useState(search || "");
  const [query] = useDebounce(text, 750);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (!query) {
      router.push(`${pathname}`);
    } else {
      const encodedQuery = encodeURIComponent(query);
      router.push(`${pathname}?search=${encodedQuery}`);
    }
  }, [query]);

  return (
    <>
      <Image src={magnifier} alt="magnifier" />
      <input value={text} className="text-[5f5f5f] text-base font-normal outline-none focus:outline-none focus:border-none w-full p-1" type="text" onChange={(e) => setText(e.target.value)} placeholder="Search" />
    </>
  )
}

export default Search;