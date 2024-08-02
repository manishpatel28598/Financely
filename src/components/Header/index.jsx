import React, { useEffect } from "react";
import "./style.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import userImg from "../../assets/users.svg"
function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  function logoutFn() {
    try {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          navigate("/");
          toast.success("Logged out!");
        })
        .catch((error) => {
          // An error happened.
          toast.error(error.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }
  return (
    <div className="navbar">
      <p className="logo">Financely</p>
      {user && (
        <div style={{display:"flex", alignItems:"center", gap:"0.7rem"}}>
          <img src={user.photoURL? user.photoURL:userImg} style={{borderRadius: "50%", height:"2rem", width:"2rem"}} />
        <p className="logo link" onClick={logoutFn}>
          Logout
        </p>
        </div>
      )}
    </div>
  );
}

export default Header;
