import React, { useState } from "react";
import Input from "../Input/index";
import Button from "../Button/index";
import "./style.css";
import { provider } from "../../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {auth, db} from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import {toast} from "react-toastify";
import { useNavigate } from "react-router-dom";

function SignupSignin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginform, setLoginform] = useState(false);
  const navigate = useNavigate();

  function SignupWithEmail(){
    setLoading(true);
    console.log("name :", name);
    console.log("email :", email)
    console.log("password :", password)
    console.log("confirmpassword :", confirmpassword)
    // Authenticate the user , or basically create a new account using email and pass
    if(name!="" && email!="" && password!="" && confirmpassword!=""){
      if(password==confirmpassword){
        createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log("user:=>",user);
        toast.success("User crated!");
        setLoading(false);
        setName("");
        setPassword("");
        setEmail("");
        setConfirmpassword("");
        createDoc(user);
        navigate("/dashboard")
        //Create a  doc with user id as the following id
  
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        setLoading(false);
  
        // ..
      });

      }
      else{
        toast.error("password and confirm password is not match");
        setLoading(false);

      }
    }
    else{
      toast.error("All fields are mandatory!");
    setLoading(false);

    }


  }


function loginUsingEmail(){
  console.log("Email", email);
  console.log("password", password);
  setLoading(true);
  if(email!="" && password!=""){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      toast.success("User Logged In!");
      console.log("user>>>> :  ", user);
      setLoading(false);
      navigate("/dashboard");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      setLoading(false);
      toast.error(errorMessage);
    });

  }
  else{
    toast.error("All fields are mandatory!");
    setLoading(false);
  }

}

async function createDoc(user){
  setLoading(true);
  //make sure that the doc with the uid doesn't exist
  if(!user) return;

  const userRef = doc(db, "users", user.uid);
  const userData = await getDoc(userRef);

  if(!userData.exists()){

    
    try{
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName ? user.displayName : name,
        email: user.email,
        photoUrl: user.photoURL ? user.photoURL : "",
        createdAt: new Date(),
    });
    toast.success("Docs Created!");
    setLoading(false);
  }
  catch (e){
    toast.error(e.message);
    setLoading(false);
  }
  }
  else{
    // toast.error("Doc already  exist");
    setLoading(false);
  }
}

function googleAuth(){
  setLoading(true);

  try{
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log("user", user);
      createDoc(user);
      navigate("/dashboard");
      toast.success("User Authenticated!");
      setLoading(false)
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      toast.error(errorMessage);
      setLoading(false)
    });

  }
  catch (e) {
      toast.error(e.message);
      setLoading(false);
  }
  
}


  return (
    <>
    {loginform ? (
      <div className="signup-wrapper">
      <h2 className="title">
        Login on <span style={{ color: "var(--theme)" }}>Financely</span>
      </h2>
      <Input
        type="email"
        label={"Email"}
        state={email}
        setState={setEmail}
        placeholder={"manishpatel@gmail.com"}
      />
      <Input
        type="password"
        label={"password"}
        state={password}
        setState={setPassword}
        placeholder={"Example123"}
      />
      <Button 
      diabled={loading}
      text={loading ? "Loading..." : "Login using Email and Password"}
      onClick={loginUsingEmail}
      />
      <p className="or">Or</p>
      <Button onClick={googleAuth} text={loading ? "Loading..." : "Login using Google"} blue={true}/>
      <p className="p-login" onClick={()=>setLoginform(!loginform)}>or Don't have an account? Click Here</p>
    </div>
    ):(
      <div className="signup-wrapper">
      <h2 className="title">
        Sign Up on <span style={{ color: "var(--theme)" }}>Financely</span>
      </h2>
      <Input
        label={"Full Name"}
        type={"text"}
        state={name}
        setState={setName}
        placeholder={"manish patel"}
      />
      <Input
        type="email"
        label={"Email"}
        state={email}
        setState={setEmail}
        placeholder={"manishpatel@gmail.com"}
      />
      <Input
        type="password"
        label={"password"}
        state={password}
        setState={setPassword}
        placeholder={"Example123"}
      />
      <Input
        type="password"
        label={"confirm password"}
        state={confirmpassword}
        setState={setConfirmpassword}
        placeholder={"Example123"}
      />
      <Button 
      diabled={loading}
      text={loading ? "Loading..." : "Sign Up with Email and Password"}
      onClick={SignupWithEmail}
      />
      <p className="or">Or</p>
      <Button onClick={googleAuth} text={loading ? "Loading..." : "Sign Up with Google"} blue={true}/>
      <p className="p-login" onClick={()=>setLoginform(!loginform)}>or have an account Already? Click Here</p>
    </div>
    )} 
    </>
  );
}



export default SignupSignin;
