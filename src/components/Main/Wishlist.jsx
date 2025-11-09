import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { svg } from "../../asset/HeartIconSvg";
import WishlistPage from "./WishListPage";
import Header from "../Header/Header"; 
import "../../input.css"; 

const Wishlist = () => {
  const [wishList, setWishList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { favListings, userData, isFavorite, itemId } = useSelector((store) => ({
    favListings: store.app.userFavListing,
    userData: store.app.userData,
    isFavorite: store.app.isFavorite,
    itemId: store.app.itemId,
  }));

  const headerRef = useRef(null);
  const firstRender = useRef(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/properties");
        const data = await res.json();
        setWishList(data);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!firstRender.current) {
      fetchProperties();
      firstRender.current = true;
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center relative bg-white">
      {/* ✅ Add header at the top */}
      <div ref={headerRef} id="header" className="fixed top-0 w-full z-50">
        <Header headerRef={headerRef} />
      </div>

      <div className="mt-[8rem] w-full flex justify-center">
        <WishlistPage
          userData={userData}
          isLoading={isLoading}
          wishList={wishList}
          favListings={favListings}
          svg={svg}
        />
      </div>
    </div>
  );
};

export default Wishlist;
