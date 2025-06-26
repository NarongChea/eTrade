import React, { useContext } from 'react';
import { ProductsCon } from '../context/ProductsContext';
import { AuthContext } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const Cartegory = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { category } = useContext(ProductsCon);
  const navigate = useNavigate();

  const handleClick = (cat) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      const formatted = cat.replace(/\s+/g, '_');
      navigate(`/products?category=${formatted}`);
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto my-8 px-2">
      <div className="flex overflow-x-auto space-x-3 remove-scroll py-2">
        {category.map((item, index) => (
          <div
  key={index}
  onClick={() => handleClick(item.cat)}
  className="flex flex-col items-center justify-center cursor-pointer bg-gray-100 rounded-md p-4 min-w-[140px] hover:shadow-lg transition-transform duration-300 group"
>
  <div className="w-[70px] sm:w-[80px] mb-2 flex justify-center items-center group-hover:scale-110 transition-transform duration-300">
    <img
      src={item.photo}
      alt={item.cat}
      className="w-full object-contain mix-blend-multiply"
    />
  </div>
  <span className="text-xs sm:text-sm font-semibold text-gray-900 text-center break-words">
    {item.cat}
  </span>
</div>

        ))}
      </div>
    </div>
  );
};

export default Cartegory;
