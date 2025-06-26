import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProductsCon } from '../context/ProductsContext';
import { AuthContext } from '../context/AuthProvider';

const HeroSection = () => {
  const { homeData } = useContext(ProductsCon);
  const { isAuthenticated } = useContext(AuthContext);
  const bestProduct = homeData?.find((item) => item.rate >= 4.5);

  return (
    <div
      className="w-full"
      style={{
        background: 'linear-gradient(90deg, rgba(105, 98, 98, 1) 0%, rgba(182, 209, 222, 0.85) 50%, rgba(105, 98, 98, 1) 100%)',
      }}
    >
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-2 px-4 py-10 md:py-0 items-center min-h-[500px]">
        {/* Left Content */}
        <div className="flex flex-col justify-center gap-5 items-center md:items-start text-center md:text-left">
          <p className="bg-red-200 text-red-600 rounded-full font-bold px-4 py-[4px] text-xs">
            Best Deal in this week
          </p>

          {bestProduct && (
            <>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white" style={{ fontFamily: 'Truculenta' }}>
                {bestProduct.name}
              </h2>
              <p className="text-slate-700 text-xl sm:text-2xl md:text-4xl font-bold">
                ${bestProduct.price}
              </p>
              <Link to={isAuthenticated ? `/products/${bestProduct.id}` : "/login"}>
                <button className="relative h-[45px] w-36 text-sm sm:w-40 sm:h-[50px] overflow-hidden border border-gray-500 bg-gray-200 text-gray-600 font-bold shadow-2xl before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-gray-500 before:transition-all before:duration-500 hover:text-white hover:before:w-full hover:before:left-0">
                  <span className="relative z-[5]">Shop Now</span>
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Right Image */}
        <div className="flex justify-center items-center mt-8 md:mt-0">
          <Link to={isAuthenticated ? `/products/${bestProduct?.id}` : "/login"} className="w-[70%] sm:w-[80%] md:w-[500px]">
            {bestProduct?.images && (
              <img
                className="w-full max-h-[250px] sm:max-h-[300px] md:max-h-[400px] object-contain mix-blend-multiply"
                src={bestProduct.images[0]}
                alt={bestProduct.name}
              />
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
