import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from "../client.js";
import { feedQuery, searchQuery } from "../utils/data.js";
import MasonryLayout from "./MasonryLayout.jsx";
import Spinner from "./Spinner";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams();
  const [pins, setPins] = useState(null);

  useEffect(() => {
    setLoading(true);

    if (categoryId) {
      const query = searchQuery(categoryId);

      client.fetch(query).then((data) => {
        setPins(data);

        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  if (loading)
    return <Spinner message="we are adding new ideas to your feed" />;

  return <>{pins && <MasonryLayout pins={pins} />}</>;
};

export default Feed;
