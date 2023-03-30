"use client";

import { FaSearch } from "react-icons/fa";
import Button from "../../../../../components/Button";

const DashboardSearch = () => {
  return (
    <form className="flex">
      <input
        type="search"
        placeholder="Search"
        className="h-11 w-full rounded-l bg-slate-600 px-4"
        autoFocus
      />

      <Button title="Search" className="rounded-l-none">
        <FaSearch />
      </Button>
    </form>
  );
};

export default DashboardSearch;
