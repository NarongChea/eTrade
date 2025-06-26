import React from "react";

const About = () => {
  return (
    <div className="bg-gradient-to-b from-white to-slate-100 min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Big Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
          Welcome to <span className="text-blue-600">eTrade</span>
        </h1>
        <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
          Your one-stop shop for modern, fast, and reliable online shopping. We bring top products,
          unbeatable deals, and exceptional service right to your fingertips.
        </p>

        {/* Big Sections */}
        <div className="grid md:grid-cols-2 gap-12 text-left">
          {/* Mission */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">🚀 Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              At <strong>eTrade</strong>, we are on a mission to transform how people shop online.
              We’re focused on making shopping smooth, fast, and joyful. We source the best products
              and deliver with speed and care.
            </p>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">🌟 Why Choose Us?</h2>
            <ul className="text-lg text-gray-600 space-y-3 list-disc pl-5">
              <li>Premium Products at the Best Prices</li>
              <li>Lightning-Fast Checkout</li>
              <li>Secure Payments</li>
              <li>24/7 Customer Support</li>
              <li>Easy Returns & Fast Shipping</li>
            </ul>
          </div>
        </div>

        {/* Our Story */}
        <div className="mt-20 bg-white p-10 rounded-2xl shadow-lg max-w-4xl mx-auto hover:shadow-2xl transition">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">📖 Our Story</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Born from a passion for technology and innovation, <strong>eTrade</strong> started as a
            small vision and grew into a trusted brand. We’ve helped thousands of customers discover
            great products online, and we’re just getting started. With a growing team and global
            reach, our story is your story — the journey of modern shopping made simple.
          </p>
        </div>

        {/* Location Section */}
        <div className="mt-20 bg-white p-10 rounded-2xl shadow-lg max-w-4xl mx-auto hover:shadow-2xl transition">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">📍 Our Location</h2>
          <div className="rounded-xl overflow-hidden border">
            <iframe
              title="eTrade Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.836789414964!2d104.89054937592681!3d11.56355538863716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31095191805840fd%3A0x1c8c01468d4bf1df!2sETEC3!5e0!3m2!1skm!2skh!4v1750657590286!5m2!1skm!2skh"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Ready to explore? Let’s get shopping!
          </h3>
          <a
            href="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-full transition shadow-md"
          >
            Browse Products
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
