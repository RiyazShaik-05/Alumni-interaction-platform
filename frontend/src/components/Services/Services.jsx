import React from "react";
import {Link} from "react-router-dom"

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-white">


      <section className="relative py-20 bg-gradient-to-br from-blue-900 to-blue-700 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">Empowering Connections, Elevating Careers</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Discover the services that help students and alumni collaborate, learn, and grow.
          </p>
        </div>
      </section>


      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[ 
              { title: "Mentorship", desc: "Connect with experienced alumni for career guidance and insights." },
              { title: "Job & Internship Listings", desc: "Access exclusive job opportunities shared by alumni." },
              { title: "Workshops & Webinars", desc: "Learn from industry experts through interactive sessions." },
              { title: "Project Collaboration", desc: "Team up with students and alumni to work on exciting projects." },
            ].map((service, idx) => (
              <div key={idx} className="p-8 bg-white rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-700 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8">Ready to Get Started?</h2>
          <p className="text-xl text-green-100 max-w-2xl mx-auto mb-8">
            Whether you're looking for guidance or want to contribute, explore our services and take the next step.
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-lg font-medium transition-all">
            <Link to="/dashboard">Get Started</Link>
          </button>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
