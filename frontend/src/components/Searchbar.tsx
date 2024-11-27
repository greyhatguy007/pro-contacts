import { useState } from "react";
import { CreateContact } from "./CreateContact";

type searchBarProps = {
    search: string,
    setSearch : React.Dispatch<React.SetStateAction<string>>
}

const Searchbar = (props: searchBarProps) => {
  const [create, setCreate] = useState(false);
  const { search, setSearch } = props;

  const toggleCreateTrue = () => {
    setCreate(true);
  }

  return (
    <div className="flex flex-col flex-wrap items-center justify-center">
      <label htmlFor="search" className="flex justify-center items-center">
        <input
          type="text"
          placeholder="search contacts"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-sm rounded-md bg-white text-black text-md md:input-md md:text-lg "
        />
        <button className="btn btn-success bg-green-700 text-white btn-sm mx-2 md:btn-md  md:text-lg" onClick={toggleCreateTrue}>Create New Contact</button>
      </label>
      {create && <CreateContact onCancel={()=>setCreate(false)}/>}
    </div>
  );
};

export default Searchbar;
