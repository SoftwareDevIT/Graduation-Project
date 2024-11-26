import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PageTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    let title = "FlickHive"; // Title mặc định

    // Cập nhật title theo URL
    const path = location.pathname;
    if (path === "/buy-ticket") {
      title = "Buy Ticket";
    } else if (path === "/orders") {
      title = "Orders";
    } else if (path === "/seat") {
      title = "Seat Selection";
    } else if (path.includes("/movie-detail/")) {
      title = "Movie Details";
    } else if (path.includes("/reviews/")) {
      title = "Reviews";
    } else if (path === "/filmnews") {
      title = "Film News";
    } else if (path === "/video") {
      title = "Video News";
    } else if (path === "/sp") {
      title = "Support Center";
    } else if (path === "/profile") {
      title = "User Profile";
    }else if (path === "/pay") {
        title = "Pay";
    }else if (path === "/news") {
        title = "News";
    }else if (path === "/community") {
        title = "Community";
    }
    else if (path === "/personal") {
        title = "Personal";
    }
    else if (path ==="/movieticket") {
        title = "MovieTicket";
    }
    document.title = title; // Cập nhật title
  }, [location]);

  return null;
};
export default PageTitleUpdater