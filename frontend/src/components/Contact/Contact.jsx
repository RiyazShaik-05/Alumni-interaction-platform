import React, { useState } from "react";
import axios from "axios";
import {SmallSpinner} from "../index"

const ContactPage = ({showAlert = ()=>{}}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading,setLoading] = useState(false);


  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!email || !name || !message){
      showAlert("Please fill all fields!","error");
      return
    }
    try {
      setLoading(prev => !prev);
      const response = await axios.post("/api/auth/handle-contact",{email,name,message});

      if(!response.data.success){
        showAlert("Something went Wrong!","error");
      } else {
        showAlert("Thanks For Contacting us!","success");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(prev => !prev);
      setEmail("");
      setName("");
      setMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Contact Us</h2>
        <p className="text-gray-600 text-center mb-8">
          Have questions or need support? Feel free to reach out to us.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="5"
              placeholder="Your Message"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all"
          >
           {loading ? <SmallSpinner/> : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
