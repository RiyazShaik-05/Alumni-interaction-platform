import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";
import { Link } from "react-router-dom";
import {SmallSpinner} from "../index";
import axios from "axios"
import React, {useState} from "react";

const Footer = ({
  showAlert = () => {}
}) => {

  const [email,setEmail] = useState("");
  const [loading,setLoading] = useState(false);

  const handleSubscribeClick = async (e) => {
    e.preventDefault();
    try {
      setLoading(prev => !prev);
      const response = await axios.post("/api/auth/send-subscribe-mail",{email});
      console.log(response.data)

      if(!response?.data?.success){
        showAlert("Something went Wrong!","error")
      } else {
        showAlert("Thanks for Subscribing!","success");
      }
      
    } catch (error) {
      console.log(error.message);
      showAlert("Something went wrong!","Error");
    } finally {
      setEmail("")
      setLoading(prev => !prev)
    }
  }
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">


          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">ConnectEd</h3>
            <p className="text-sm leading-6">
              Bridging the gap between students and alumni for mentorship,
              networking, and career growth.
            </p>
            <div className="flex space-x-4">
              <Link
                to="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiFacebook className="h-6 w-6" />
              </Link>
              <Link
                to="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiTwitter className="h-6 w-6" />
              </Link>
              <Link
                to="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiInstagram className="h-6 w-6" />
              </Link>
              <Link
                to="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiLinkedin className="h-6 w-6" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <nav className="space-y-2">
              {[
                { name: "Home", to: "/" },
                { name: "About", to: "/about" },
                { name: "Services", to: "/services" },
                { name: "Contact", to: "/contact" },
              ].map((link, index) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className="block text-sm hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <div className="space-y-2">
              <Link to="contact">Contact</Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Stay Connected</h4>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              <button
                type="submit"
                onClick={handleSubscribeClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105 duration-300"
              >
                {loading ? <SmallSpinner color="#fff"/> : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 py-6">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} ConnectEd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
