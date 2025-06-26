import React from "react";

const Contact = () => {
  return (
    <div className="bg-gradient-to-b from-white to-slate-100 min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto bg-white p-12 rounded-2xl shadow-xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-center text-blue-600 mb-6">
          Contact <span className="text-gray-900">eTrade</span>
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Have questions, feedback, or need help? We’re here to assist you. Reach out to us using the form below or through our contact information.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 text-lg font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-base"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-lg font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-base"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-lg font-medium mb-1">
                Message
              </label>
              <textarea
                rows="6"
                placeholder="Write your message..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-base"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 text-lg font-semibold transition"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-8 ">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">📍 Our Office</h2>
              <p className="text-gray-600 text-base">
                123 E-Commerce Street,<br />
                Phnom Penh, Cambodia
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">📞 Call Us</h2>
              <p className="text-gray-600 text-base">+855 95 761 288</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">📧 Email</h2>
              <p className="text-gray-600 text-base">etradeoffical@etrade.com</p>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <a href="https://web.facebook.com/ro.ng.923171" target="_blank" className="text-gray-600 hover:text-blue-600 text-2xl">
                <i className="bx bxl-facebook"></i>
              </a>
              <a href="https://web.facebook.com/ro.ng.923171" target="_blank" className="text-gray-600 hover:text-blue-500 text-2xl">
                <i className="bx bxl-twitter"></i>
              </a>
              <a href="https://web.facebook.com/ro.ng.923171" target="_blank" className="text-gray-600 hover:text-red-500 text-2xl">
                <i className="bx bxl-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
