import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Shield, MapPin, Key, User, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

import api from '../services/api';
import { updateUser } from '../store/authSlice';

export default function Account() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Address fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('Sindh');
  const [postalCode, setPostalCode] = useState('');
  const [label, setLabel] = useState('Home');
  const [showAddressForm, setShowAddressForm] = useState(false);

  // 2FA Admin settings
  const [twoFactorActive, setTwoFactorActive] = useState(user?.twoFactorEnabled || false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [totpVerificationCode, setTotpVerificationCode] = useState('');
  const [show2FAPanel, setShow2FAPanel] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/update-profile', { name, phone });
      dispatch(updateUser(res.data.user));
      setIsEditingProfile(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update profile failed');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!street || !city || !postalCode) {
      toast.error('Please complete all address fields');
      return;
    }

    const newAddress = { label, street, city, province, postalCode };
    const updatedAddresses = [...(user.addresses || []), newAddress];

    try {
      const res = await api.put('/auth/update-profile', { addresses: updatedAddresses });
      dispatch(updateUser(res.data.user));
      setShowAddressForm(false);
      resetAddressForm();
      toast.success('Address added successfully');
    } catch (err) {
      toast.error('Could not add address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const updatedAddresses = user.addresses.filter(addr => addr._id !== addressId);
    try {
      const res = await api.put('/auth/update-profile', { addresses: updatedAddresses });
      dispatch(updateUser(res.data.user));
      toast.success('Address removed');
    } catch (err) {
      toast.error('Could not delete address');
    }
  };

  const resetAddressForm = () => {
    setStreet('');
    setCity('');
    setPostalCode('');
    setLabel('Home');
  };

  // 2FA Admin flow
  const handleInitiate2FA = async () => {
    try {
      const res = await api.post('/auth/2fa/setup');
      setQrCodeUrl(res.data.qrCodeUrl);
      setSecretKey(res.data.secret);
      setShow2FAPanel(true);
      toast.success('Scan the QR code in Google Authenticator');
    } catch (err) {
      toast.error('Could not setup 2FA');
    }
  };

  const handleVerify2FASetup = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/2fa/verify', { code: totpVerificationCode });
      setTwoFactorActive(true);
      setShow2FAPanel(false);
      setTotpVerificationCode('');
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    }
  };

  const handleDisable2FA = async () => {
    const code = prompt('Enter 2FA Code to disable security:');
    if (!code) return;

    try {
      const res = await api.post('/auth/2fa/disable', { code });
      setTwoFactorActive(false);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Disable failed');
    }
  };

  return (
    <div className="pt-28 min-h-screen max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      {/* Left Column: Personal info & 2FA */}
      <div className="space-y-6">
        
        {/* Profile Card */}
        <div className="glass-card p-6 rounded-lg border border-luxury-gold/15 space-y-4">
          <div className="flex items-center gap-3 border-b border-luxury-gold/5 pb-3">
            <User className="w-5 h-5 text-luxury-gold" />
            <h3 className="font-display uppercase tracking-widest text-sm text-luxury-gold">Personal Profile</h3>
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-luxury-gray mb-1">Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-luxury-slate/50 border border-luxury-gold/20 rounded px-3 py-1.5 text-xs text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-luxury-gray mb-1">Phone</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-luxury-slate/50 border border-luxury-gold/20 rounded px-3 py-1.5 text-xs text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-gold px-4 py-2 rounded text-[10px] tracking-widest">Save</button>
                <button 
                  type="button" 
                  onClick={() => setIsEditingProfile(false)}
                  className="btn-outline px-4 py-2 rounded text-[10px] tracking-widest"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="text-xs space-y-3 font-light">
              <div>Name: <span className="text-luxury-ivory font-medium">{user?.name}</span></div>
              <div>Email: <span className="text-luxury-ivory font-mono">{user?.email}</span></div>
              <div>Phone: <span className="text-luxury-ivory font-mono">{user?.phone || 'Not provided'}</span></div>
              <button 
                onClick={() => setIsEditingProfile(true)}
                className="text-[10px] text-luxury-gold hover:underline uppercase tracking-widest font-medium"
              >
                Edit Contact Details
              </button>
            </div>
          )}
        </div>

        {/* 2FA ADMIN SECURITY PANEL (For Admins) */}
        {user?.role === 'admin' && (
          <div className="glass-card p-6 rounded-lg border border-luxury-gold/15 space-y-4">
            <div className="flex items-center gap-3 border-b border-luxury-gold/5 pb-3">
              <Shield className="w-5 h-5 text-luxury-gold" />
              <h3 className="font-display uppercase tracking-widest text-sm text-luxury-gold">Admin Security</h3>
            </div>

            <div className="text-xs space-y-3">
              <div className="flex justify-between items-center">
                <span>Two-Factor Authentication:</span>
                <span className={`font-semibold uppercase tracking-wider ${
                  twoFactorActive ? 'text-green-500' : 'text-amber-500'
                }`}>
                  {twoFactorActive ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              {twoFactorActive ? (
                <button 
                  onClick={handleDisable2FA}
                  className="btn-outline w-full py-2 border-red-500/30 text-red-400 hover:bg-red-950/20 hover:border-red-500 rounded text-[10px] tracking-widest"
                >
                  Disable 2FA Protection
                </button>
              ) : (
                !show2FAPanel && (
                  <button 
                    onClick={handleInitiate2FA}
                    className="btn-gold w-full py-2 rounded text-[10px] tracking-widest flex items-center justify-center gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5" />
                    Setup Google 2FA
                  </button>
                )
              )}

              {/* 2FA Setup flow display */}
              {show2FAPanel && (
                <form onSubmit={handleVerify2FASetup} className="space-y-4 pt-2 border-t border-luxury-gold/5 animate-fade-in">
                  <p className="text-[10px] text-luxury-gray leading-relaxed">
                    1. Scan the QR code using Google Authenticator or enter key manually: <span className="font-mono text-luxury-gold">{secretKey}</span>
                  </p>
                  
                  {qrCodeUrl && (
                    <div className="bg-white p-2 rounded w-36 h-36 mx-auto">
                      <img src={qrCodeUrl} alt="2FA QR Code" className="w-full h-full" />
                    </div>
                  )}

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-luxury-gray mb-1">2. Enter Authenticator Code</label>
                    <input 
                      type="text" 
                      maxLength={6}
                      required
                      value={totpVerificationCode}
                      onChange={(e) => setTotpVerificationCode(e.target.value)}
                      placeholder="000000"
                      className="w-full text-center bg-luxury-slate/50 border border-luxury-gold/20 rounded px-3 py-2 text-sm font-mono tracking-widest focus:outline-none focus:border-luxury-gold text-luxury-gold"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="flex-grow btn-gold py-2 rounded text-[10px] tracking-widest">
                      Verify & Activate
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShow2FAPanel(false)}
                      className="btn-outline px-3 py-2 rounded text-[10px] tracking-widest"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Right 2 Columns: Address lists & past orders */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Addresses Box */}
        <div className="glass-card p-6 rounded-lg border border-luxury-gold/15 space-y-4">
          <div className="flex justify-between items-center border-b border-luxury-gold/5 pb-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-luxury-gold" />
              <h3 className="font-display uppercase tracking-widest text-sm text-luxury-gold">Address Directory</h3>
            </div>
            {!showAddressForm && (
              <button 
                onClick={() => setShowAddressForm(true)}
                className="text-[10px] uppercase tracking-widest text-luxury-gold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add New
              </button>
            )}
          </div>

          {/* New address form */}
          {showAddressForm && (
            <form onSubmit={handleAddAddress} className="space-y-4 p-4 border border-luxury-gold/15 rounded bg-luxury-slate/20 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-luxury-gray mb-1">Label</label>
                  <input 
                    type="text" 
                    value={label} 
                    onChange={(e) => setLabel(e.target.value)} 
                    placeholder="Home / Office" 
                    className="w-full bg-luxury-slate/50 border border-luxury-gold/20 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-luxury-gold text-luxury-ivory"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-luxury-gray mb-1">Postal Code</label>
                  <input 
                    type="text" 
                    value={postalCode} 
                    onChange={(e) => setPostalCode(e.target.value)} 
                    className="w-full bg-luxury-slate/50 border border-luxury-gold/20 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-luxury-gold text-luxury-ivory"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-widest text-luxury-gray mb-1">Street Address</label>
                <input 
                  type="text" 
                  value={street} 
                  onChange={(e) => setStreet(e.target.value)} 
                  className="w-full bg-luxury-slate/50 border border-luxury-gold/20 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-luxury-gold text-luxury-ivory"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-luxury-gray mb-1">City</label>
                  <input 
                    type="text" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    className="w-full bg-luxury-slate/50 border border-luxury-gold/20 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-luxury-gold text-luxury-ivory"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-luxury-gray mb-1">Province</label>
                  <select 
                    value={province} 
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full bg-luxury-slate/50 border border-luxury-gold/20 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-luxury-gold text-luxury-ivory"
                  >
                    <option value="Sindh">Sindh</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="Islamabad Capital Territory">Islamabad</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn-gold px-4 py-2 rounded text-[10px] tracking-widest">Save Address</button>
                <button 
                  type="button" 
                  onClick={() => setShowAddressForm(false)}
                  className="btn-outline px-4 py-2 rounded text-[10px] tracking-widest"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Address listings */}
          <div className="space-y-3">
            {(!user?.addresses || user.addresses.length === 0) ? (
              <p className="text-xs text-luxury-gray font-light">No saved addresses found. Add one to speed up checkout.</p>
            ) : (
              user.addresses.map((addr) => (
                <div key={addr._id} className="flex justify-between items-center border border-luxury-gold/5 p-4 rounded bg-luxury-slate/5 text-xs">
                  <div className="space-y-1">
                    <span className="font-semibold text-luxury-gold uppercase tracking-wider text-[10px] border border-luxury-gold/20 px-1.5 py-0.5 rounded">
                      {addr.label}
                    </span>
                    <p className="text-luxury-ivory mt-1">{addr.street}, {addr.city}</p>
                    <p className="text-luxury-gray/70">{addr.province}, {addr.postalCode}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteAddress(addr._id)}
                    className="text-luxury-gray hover:text-red-400 p-2"
                    title="Remove Address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Mock Orders history */}
        <div className="glass-card p-6 rounded-lg border border-luxury-gold/15 space-y-4">
          <h3 className="font-display uppercase tracking-widest text-sm text-luxury-gold border-b border-luxury-gold/5 pb-3">
            Purchase History
          </h3>
          <p className="text-xs text-luxury-gray font-light">
            You have not placed any orders yet. Visit our <Link to="/shop" className="text-luxury-gold hover:underline">shop</Link> to start your fragrance collection.
          </p>
        </div>

      </div>

    </div>
  );
}
