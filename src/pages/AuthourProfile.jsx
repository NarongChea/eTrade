import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from '../Components/Dashboard';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaReceipt,
  FaCalendarAlt,
  FaCalendarCheck,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';

const AuthorProfile = () => {
  const { role, currentUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [averageWeek, setAverageWeek] = useState(0);
  const [averageMonth, setAverageMonth] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('********');
  const [verified, setVerified] = useState(false);
  const [openOrderId, setOpenOrderId] = useState(null);

  // For custom dialog modal
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);

  useEffect(() => {
    if (role === 'customer' && currentUser?.id) {
      fetchOrders();
    } else if (role === 'superAdmin') {
      fetchUsers();
    }
  }, [role, currentUser]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`https://json-server-api-y6cs.onrender.com/users/${currentUser.id}`);
      const user = await res.json();

      const userOrders = await Promise.all(
        (user.orders || []).map(async (order) => {
          const itemsWithDetails = await Promise.all(
            order.items.map(async (item) => {
              const productRes = await fetch(`https://json-server-api-y6cs.onrender.com/products/${item.id}`);
              const product = await productRes.json();
              return {
                ...item,
                name: product.name,
                price: product.price,
                total: product.price * item.quantity,
              };
            })
          );
          return { ...order, items: itemsWithDetails };
        })
      );

      setOrders(userOrders);
      calculateAverages(userOrders);
    } catch (err) {
      console.error('Failed to fetch user orders:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('https://json-server-api-y6cs.onrender.com/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const calculateAverages = (orders) => {
    const now = new Date();
    let weekTotal = 0;
    let monthTotal = 0;

    orders.forEach((order) => {
      const orderDate = new Date(order.date);
      const timeDiff = (now - orderDate) / (1000 * 60 * 60 * 24);
      if (timeDiff <= 7) weekTotal += order.totalAmount || 0;
      if (timeDiff <= 30) monthTotal += order.totalAmount || 0;
    });

    setAverageWeek(weekTotal);
    setAverageMonth(monthTotal);
  };

  // Instead of prompt, open modal
  const handlePasswordClick = () => {
    if (!verified) {
      setVerifyInput('');
      setShowVerifyModal(true);
    }
  };

  const handleVerifyPassword = async () => {
    setVerifyLoading(true);
    try {
      const res = await fetch(`https://json-server-api-y6cs.onrender.com/users/${currentUser.id}`);
      const user = await res.json();
      if (user.password === verifyInput) {
        setVerified(true);
        setShowPassword(true);
        setNewPassword(user.password);
        toast.success('Verified! You can now change your password.');
        setShowVerifyModal(false);
      } else {
        toast.error('Incorrect password!');
      }
    } catch (err) {
      toast.error('Something went wrong.');
    }
    setVerifyLoading(false);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!verified || !newPassword) {
      toast.error('You must verify your current password first.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast.warning('Password must be at least 8 characters, with uppercase, lowercase, number, and symbol.');
      return;
    }

    try {
      await fetch(`https://json-server-api-y6cs.onrender.com/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });

      toast.success('Password updated successfully!');
      setVerified(false);
      setShowPassword(false);
      setNewPassword('********');
    } catch (err) {
      toast.error('Failed to update password.');
    }
  };

  const totalAdmins = users.filter((u) => u.role === 'admin').length;
  const totalCustomers = users.filter((u) => u.role === 'customer').length;

  return (
    <div className="bg-gray-100 min-h-screen relative">
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />

      {/* Modal dialog for verifying current password */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 max-w-full shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Verify Current Password</h3>
            <input
              type="password"
              placeholder="Enter current password"
              value={verifyInput}
              onChange={(e) => setVerifyInput(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-blue-500"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowVerifyModal(false)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                disabled={verifyLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyPassword}
                className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 ${
                  verifyLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={verifyLoading}
              >
                {verifyLoading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>
        </div>
      )}

      {role === 'superAdmin' ? (
        <Dashboard
          users={users}
          totalAdmins={totalAdmins}
          totalCustomers={totalCustomers}
          orders={orders}
          averageWeek={averageWeek}
          averageMonth={averageMonth}
        />
      ) : (
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="bg-white rounded-3xl shadow-xl p-10 space-y-12 text-lg">
            {/* Profile Info */}
            <div>
              <h2 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-2">
                <FaUser /> Your Profile
              </h2>
              <div className="grid md:grid-cols-2 gap-8 text-gray-800 text-lg">
                <p>
                  <FaUser className="inline mr-2" />
                  <strong>Name:</strong> {currentUser?.username}
                </p>
                <p>
                  <FaEnvelope className="inline mr-2" />
                  <strong>Email:</strong> {currentUser?.email}
                </p>
                <p>
                  <FaReceipt className="inline mr-2" />
                  <strong>Total Orders:</strong> {orders.length}
                </p>
              </div>
            </div>

            {/* Password */}
            <div>
              <h2 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-2">
                <FaLock /> Change Password
              </h2>
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <div>
                  <label className="block text-lg text-gray-700 mb-2">New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onClick={handlePasswordClick}
                    onChange={(e) => setNewPassword(e.target.value)}
                    readOnly={!verified}
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-blue-500 text-lg"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Click the input to verify your current password
                  </p>
                </div>
                {verified && (
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg hover:bg-blue-700 transition"
                  >
                    Save Password
                  </button>
                )}
              </form>
            </div>

            {/* Order History */}
            <div>
              <h2 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-2">
                <FaReceipt /> Order History
              </h2>
              <div className="text-gray-800 text-lg space-y-2 mb-6">
                <p className="flex items-center gap-2">
                  <FaCalendarAlt /> <strong>Weekly Spend:</strong> ${averageWeek.toFixed(2)}
                </p>
                <p className="flex items-center gap-2">
                  <FaCalendarCheck /> <strong>Monthly Spend:</strong> ${averageMonth.toFixed(2)}
                </p>
              </div>

              {orders.length > 0 ? (
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                  <table className="min-w-full bg-white border border-gray-300 rounded-xl">
                    <thead className="bg-blue-100 text-left">
                      <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Items</th>
                        <th className="py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <React.Fragment key={order.id}>
                          <tr className="border-t">
                            <td className="py-3 px-4">{order.id}</td>
                            <td className="py-3 px-4">{new Date(order.date).toLocaleString()}</td>
                            <td className="py-3 px-4">${order.totalAmount.toFixed(2)}</td>
                            <td className="py-3 px-4">{order.items?.length ?? 0}</td>
                            <td className="py-3 px-4">
                              <button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm flex items-center gap-1"
                                onClick={() =>
                                  setOpenOrderId(openOrderId === order.id ? null : order.id)
                                }
                              >
                                {openOrderId === order.id ? <FaEyeSlash /> : <FaEye />}
                                {openOrderId === order.id ? 'Hide Items' : 'View Items'}
                              </button>
                            </td>
                          </tr>
                          {openOrderId === order.id && (
                            <tr className="bg-gray-50">
                              <td colSpan="5" className="px-4 py-3">
                                <table className="w-full text-sm border">
                                  <thead className="bg-gray-200">
                                    <tr>
                                      <th className="py-2 px-3 text-left">Product ID</th>
                                      <th className="py-2 px-3 text-left">Name</th>
                                      <th className="py-2 px-3 text-left">Qty</th>
                                      <th className="py-2 px-3 text-left">Price</th>
                                      <th className="py-2 px-3 text-left">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.items.map((item, i) => (
                                      <tr key={i} className="border-t">
                                        <td className="py-2 px-3">{item.id}</td>
                                        <td className="py-2 px-3">{item.name}</td>
                                        <td className="py-2 px-3">{item.quantity}</td>
                                        <td className="py-2 px-3">${item.price.toFixed(2)}</td>
                                        <td className="py-2 px-3">${item.total.toFixed(2)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-lg">No orders found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorProfile;
