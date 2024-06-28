"use client";

import adminstyle from "./general.module.css";
import Search from "./Search";

const AdminBar = ({ search, name }: { search?: string, name: string | null }) => {
  return (
    <div className={adminstyle.admin_name_and_search} >
      <b className="flex items-center text-[#1A1A1A] text-4xl font-bold sm:absolute" style={{ letterSpacing: "0.72px", fontStyle: "normal" }}>
        Hello, {name}
      </b>
      <div className="mt-10 w-[46vw] h-10 border border-solid border-[#e0e0e0] flex p-2 items-center gap-2 bg-white sm:w-[292px] ml-[72%] md:ml-[79%] 2xl:ml-0 right-0 max-sm:ml-0" style={{ borderRadius: "8px", paddingRight: "10px" }}>
        <Search search={search} />
      </div>
    </div>
  );
};

export default AdminBar;