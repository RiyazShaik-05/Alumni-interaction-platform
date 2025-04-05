import React from "react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">

      <section className="relative py-20 bg-gradient-to-br from-blue-900 to-blue-700 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">Connecting Generations, Building Futures</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Empowering students and alumni to collaborate, mentor, and grow together.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[ 
              { title: "Mentorship", desc: "Guidance from experienced alumni to shape your career path." },
              { title: "Career Support", desc: "Internships, job postings, and career advice from alumni." },
              { title: "Networking", desc: "Build strong professional relationships within the institution." },
              { title: "Knowledge Sharing", desc: "Webinars, Q&A sessions, and expert discussions." },
            ].map((feature, idx) => (
              <div key={idx} className="p-8 bg-white rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Success Stories from Our Community</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            See how students and alumni are making an impact through mentorship, career growth, and achievements.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {[ 
              { name: "Student 1", story: "Landed a dream internship at Google thanks to alumni mentorship!" },
              { name: "Student 2", story: "Started a tech startup with guidance from our alumni network." },
              { name: "Student 3", story: "Received a scholarship recommendation through alumni connections." },
            ].map((post, idx) => (
              <div key={idx} className="p-6 bg-white rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-2">{post.name}</h3>
                <p className="text-gray-600">{post.story}</p>
              </div>
            ))}
          </div>
          <button className="mt-10">
          <Link className=" bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
          to="/dashboard"
          >
            Share Your Story
          </Link>
          </button>
        </div>
      </section>


      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Why Join Us?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            We bridge the gap between students and alumni, creating opportunities for learning, 
            career advancement, and lifelong professional relationships.
          </p>
        </div>
      </section>

      <section className="py-20 bg-blue-900 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8">Be a Part of Our Community</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Whether you're a student looking for guidance or an alumni wanting to give back, 
            join us to create a thriving network.
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-lg font-medium transition-all">
            <Link to="/register">Get Started</Link>
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;