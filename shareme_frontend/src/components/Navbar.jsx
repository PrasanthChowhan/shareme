import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();
  if (!user) return null;
  return (
    <>
      <div className="flex gap-2 md:gap-5 w-full my-5 items-center justify-center" >
        <div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm">
          <IoMdSearch fontSize={24} className=" ml-1 " />
          <input
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="search"
            value={searchTerm}
            onFocus={() => navigate("/search")}
            className="p-2 w-full bg-white outline-none border-none"
          />
        </div>
        <div className="flex gap-3 items-center">
          <Link to={`user-profile/${user.user?._id}`} className="hidden md:block">
            <img
              src={user.user?.image}
              alt="user"
              className="w-14 h-12 rounded-full "
            />
          </Link>
          <Link
            to="create-pin"
            className="flex bg-black text-white rounded-lg w-12 h-12 md:w-14 md:h-14 justify-center items-center my"
          >
            <IoMdAdd />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
