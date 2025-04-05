import React from "react";
import {Link} from "react-router-dom";


const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">

      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl font-bold leading-tight">
                Bridge Your Future with Alumni Connections
              </h1>
              <p className="text-xl text-blue-100">
                Discover opportunities, gain insights, and build your professional network through verified institutional connections.
              </p>
              <div className="flex gap-4">
                <Link className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-lg font-medium transition-all"
                to="/jobs"
                >
                  Explore Opportunities
                </Link>
                <Link className="border-2 border-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg transition-all"
                to="/dashboard"
                >
                  Alumni Portal
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="">
                <img 
                  src="../../networking.jpg" 
                  alt="Networking" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Your Career Growth Ecosystem
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {['Opportunity Hub', 'Event Network', 'Knowledge Exchange'].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">📈</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">{item}</h3>
                <p className="text-gray-600">
                  {item === 'Opportunity Hub' 
                    ? 'Access verified internships and full-time roles from alumni networks'
                    : item === 'Event Network'
                    ? 'Participate in career fairs, workshops, and networking sessions'
                    : 'Get personalized mentorship and industry insights'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-center">Live Community Activity</h3>
            <div className="space-y-6">
              {['job', 'event', 'mentorship'].map((type, idx) => (
                <div key={idx} className={`p-6 rounded-xl border-l-4 ${
                  type === 'job' ? 'border-blue-500' 
                  : type === 'event' ? 'border-green-500' 
                  : 'border-purple-500'
                } bg-white shadow-sm hover:shadow-md transition-shadow`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {type === 'job' ? '💼' : type === 'event' ? '🎪' : '💡'}
                    </div>
                    <div>
                      <p className="font-medium">
                        {type === 'job' ? 'New Software Engineer position at Google' 
                        : type === 'event' ? 'Tech Career Fair 2024 announced' 
                        : 'John D. offered mentorship in Product Management'}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Posted 2 hours ago by {type === 'job' ? 'Alumni' : 'Career Center'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-12 text-center">Success Stories</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={`../../user.png`} 
                    alt="User" 
                    className="w-16 h-16 rounded-full object-cover p-2"
                  />
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">Computer Science '23</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "Through this platform, I connected with an alumni mentor who helped me 
                  secure my dream job at Microsoft!"
                </p>
                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      Software Engineering
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Accelerate Your Career?</h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of students and alumni already building their futures together
            </p>
            <div className="flex gap-4 justify-center">
              <Link className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-lg font-medium transition-all"
              to="/register"
              >
                Get Started
              </Link>
              
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;