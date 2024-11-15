import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/stateStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const setLogout = () => {
    return logout();
  };

  useEffect(() => {
    if (!user) {
      return navigate("/login");
    }
  }, [logout, user, navigate]);

  return (
    <div>
      <Button onClick={setLogout}>Logout</Button>
    </div>
  );
}
