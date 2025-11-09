import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import { setShowLogin } from "../../redux/AppSlice";

const UserDmodal = ({ isOpen }) => {
  const dispatch = useDispatch();
  const [position, setPosition] = useState(null);
  const [isGuest, setIsGuest] = useState(
    localStorage.getItem("guest") === "true"
  );

  // Update modal position near the dashboard icon
  useEffect(() => {
    function updatePosition() {
      const userDashBoardEl = document.getElementById("user-dashboard");
      if (userDashBoardEl) {
        let rect = userDashBoardEl.getBoundingClientRect();
        setPosition({
          right: `${
            ((window.innerWidth - rect.right) / window.innerWidth) * 100
          }%`,
          top: `${(rect.bottom / window.innerHeight) * 100}%`,
        });
      }
    }
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  if (!isOpen) return null;

  const handleGuestLogin = () => {
    localStorage.setItem("guest", "true");
    setIsGuest(true);
    dispatch(setShowLogin(false));
    window.location.reload(); // refresh to apply guest mode globally
  };

  const handleLogout = () => {
    localStorage.removeItem("guest");
    setIsGuest(false);
    window.location.reload();
  };

  return ReactDOM.createPortal(
    <div
      style={position}
      className="fixed mt-2 hidden 1xz:flex flex-col shadow-2xl justify-between rounded-xl w-60 z-50 bg-white"
    >
      {isGuest ? (
        <div className="flex flex-col mt-2">
          <span className="text-sm font-medium flex items-center hover:bg-gray-100 px-5 h-10 cursor-pointer">
            Guest User
          </span>
          <span
            onClick={handleLogout}
            className="text-sm font-medium flex items-center hover:bg-gray-100 px-5 h-10 cursor-pointer"
          >
            Log out
          </span>
        </div>
      ) : (
        <div className="flex flex-col mt-2">
          <span
            onClick={handleGuestLogin}
            className="text-sm font-medium flex items-center hover:bg-gray-100 px-5 h-10 cursor-pointer"
          >
            Sign in as Guest
          </span>
        </div>
      )}
    </div>,
    document.body
  );
};

export default UserDmodal;
