import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const Captainsignup = () => {
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstname] = useState("");
    const [lastName, setLastname] = useState("");
    const [userData, setUserData] = useState({});
  
    const submitHandler = (e) => {
      e.preventDefault();
  
      setUserData({
        fullName: {
          firstName: firstName,
          lastName: lastName,
        },
        email: email,
        password: password,
      });
      console.log(userData);
      setEmail("");
      setFirstname("");
      setLastname("");
      setPassword("");
    };
  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-12 mb-5"
          src="https://www.pngall.com/wp-content/uploads/4/Uber-PNG-Image.png"
        />
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="text-lg font-medium mb-2">What's our Captain's Name</h3>
          <div className="flex gap-2 mb-6">
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border   text-lg placeholder:text-base"
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => {
                setFirstname(e.target.value);
              }}
            />
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border   text-lg placeholder:text-base"
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => {
                setLastname(e.target.value);
              }}
            />
          </div>
          <h3 className="text-lg font-medium mb-2">What's our Captain's Email</h3>
          <input
            required
            className="bg-[#eeeeee] rounded mb-5 px-4 py-2 border w-full   text-lg placeholder:text-base"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            required
            className="bg-[#eeeeee] rounded mb-5 px-4 py-2 border w-full    text-lg placeholder:text-base"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button className="bg-[#111] text-white font-semibold rounded mb-3 px-4 py-2 w-full text-lg placeholder:text-base">
            Signup
          </button>
        </form>
        <p className="text-center">
          Already have a account?{" "}
          <Link to="/captain-login" className="text-blue-600">
            Login here
          </Link>
        </p>
      </div>
      <div>
        <p className="text-[10px] leading-tight">
          This site is protected by reCAPTCHA and the <span className="underline">Google Policy</span> and <span className="underline">Terms of Service</span> apply
        </p>
      </div>
    </div>
  )
}

export default Captainsignup
