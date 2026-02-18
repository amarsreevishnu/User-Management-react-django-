import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user?.is_admin) {
    return <Navigate to="/home" />;
  }

  return children;
};

export default AdminRoute;
