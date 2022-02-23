import React, { useState } from "react";
import { urlFor, client } from "../client";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { fetchuser } from "../utils/fetchUser";

function Pin({ pin: { postedBy, image, _id, destination, save } }) {
  const [postHovered, setPostHovered] = useState(false);

  const navigate = useNavigate();
  const user = fetchuser();

  const alreadySaved = !!save?.filter(
    (item) => item.postedBy._id === user?.googleId
  )?.length;

  const savePin = (id) => {
    if (!alreadySaved) {
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user?.googleId,
            postedBy: {
              _type: "postedBy",
              _ref: user?.googleId,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
  };

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease ease-in-out"
      >
        <img
          className="rounded-lg w-full"
          src={urlFor(image).width(720).url()}
          alt="user post"
        />
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className=" bg-white w-7 h-7 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  type="button"
                  className=" bg-red-500 opacity-70 hover:opacity-100 text-white  text-xs font-semibold px-2 py-1 rounded-3xl hover:shadow-md outline-none "
                >
                  {save?.length} saved
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type=" button"
                  className=" bg-red-500 opacity-70 hover:opacity-100 text-white text-xs font-semibold px-2 py-1  rounded-3xl hover:shadow-md outline-none"
                >
                  Save
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {destination && (
                <a
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  href={destination}
                  target="_blank"
                  rel="norefer"
                  className="bg-white flex items-center gap-2 text-sm text-black font-bold px-2 py-1 rounded-full opacity-70 hover:opacity-100 hover:shadow-md ounline-none"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 15
                    ? `${destination.slice(0, 15)}...`
                    : destination}
                </a>
              )}
              {postedBy?._id === user?.googleId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  type=" button"
                  className=" bg-white p-2 opacity-70 hover:opacity-100 text-dark  font-semibold px-3 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`user-profile/${postedBy?._id}`}
        className=" flex gap-2 mt-2 items-center"
      >
        <img
          className=" w-8 h-8 rounded-full object-cover "
          src={postedBy?.image}
          alt="user-profile"
        />
        {/* {console.log('postedBy', postedBy)} */}
        <p className="font-semibold text-sm capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
}

export default Pin;
