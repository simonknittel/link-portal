"use client";

import { FaSearch } from "react-icons/fa";
import Button from "./Button";

const DashboardSearch = () => {
  return (
    <form className="mx-auto flex w-full max-w-2xl">
      <input
        type="search"
        placeholder="Search"
        className="h-11 w-full rounded-l bg-slate-700 px-4"
        autoFocus
      />

      <Button title="Search" className="rounded-l-none">
        <FaSearch />
      </Button>
    </form>
  );
};

export default DashboardSearch;
