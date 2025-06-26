import React from 'react';

const Footer = () => {
  return (
    <div className="w-full bg-gray-900">
      <div className="max-w-[1500px] mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 py-10 text-center md:text-left">
          {/* Brand Info */}
          <div className="flex flex-col gap-2 items-center md:items-start">
            <h1 className="text-white text-lg font-bold">eTrade</h1>
            <p className="text-gray-400 text-[13px] max-w-[250px]">
              Your trusted partner for all electronic needs. Quality products, competitive prices.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2 items-center md:items-start">
            <h1 className="text-white text-lg font-bold">Quick Links</h1>
            <ul className="flex flex-col gap-2">
              <li className="text-gray-400 text-[13px]">About Us</li>
              <li className="text-gray-400 text-[13px]">Contact</li>
              <li className="text-gray-400 text-[13px]">Shipping Info</li>
              <li className="text-gray-400 text-[13px]">Returns</li>
            </ul>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-2 items-center md:items-start">
            <h1 className="text-white text-lg font-bold">Categories</h1>
            <ul className="flex flex-col gap-2">
              <li className="text-gray-400 text-[13px]">Phones</li>
              <li className="text-gray-400 text-[13px]">Computers</li>
              <li className="text-gray-400 text-[13px]">Accessories</li>
              <li className="text-gray-400 text-[13px]">Gaming</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-2 items-center md:items-start">
            <h1 className="text-white text-lg font-bold">Newsletter</h1>
            <p className="text-gray-400 text-[13px]">Subscribe for updates and special offers.</p>
            <form className="flex flex-col sm:flex-row gap-2 w-full justify-center md:justify-start">
              <input
                type="text"
                placeholder="Email"
                className="text-gray-400 border border-gray-400 rounded-sm px-2 py-[7px] text-[13px] w-full sm:w-auto flex-1"
              />
              <button className="bg-blue-500 text-white text-[13px] px-4 py-[7px] rounded-sm whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center text-gray-400 text-[13px] py-6 border-t border-gray-700">
          © 2024 eTrade. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Footer;
