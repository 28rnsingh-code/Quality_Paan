import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  AlertCircle, 
  Package, 
  Crown, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  Calendar, 
  CheckCircle2, 
  X, 
  Edit3, 
  Sparkles, 
  ArrowUpDown, 
  Check, 
  Clock, 
  Navigation,
  DollarSign,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserProfile, Order } from '../../types';

export const AdminCustomerCRM: React.FC = () => {
  const { customers, updateCustomer, clearDummyCustomers, orders, showToast } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'old' | 'new' | 'pan_verified' | 'pan_pending'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<UserProfile | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Manual PAN Verification Edit inside modal
  const [manualPanInput, setManualPanInput] = useState('');
  const [manualHolderInput, setManualHolderInput] = useState('');
  const [manualDobInput, setManualDobInput] = useState('1995-01-01');
  const [manualProofUrl, setManualProofUrl] = useState('');
  const [isEditingPan, setIsEditingPan] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter calculations
  const totalCustomers = customers.length;
  const oldCustomers = customers.filter(c => c.customerType === 'old');
  const newCustomers = customers.filter(c => c.customerType === 'new');
  const panVerifiedCustomers = customers.filter(c => !!c.panVerified);
  const panPendingCustomers = customers.filter(c => !c.panVerified);

  // Filtered List
  const filteredCustomers = customers.filter(c => {
    // Tab Filter
    if (filterType === 'old' && c.customerType !== 'old') return false;
    if (filterType === 'new' && c.customerType !== 'new') return false;
    if (filterType === 'pan_verified' && !c.panVerified) return false;
    if (filterType === 'pan_pending' && c.panVerified) return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.fullName?.toLowerCase().includes(q);
      const matchEmail = c.email?.toLowerCase().includes(q);
      const matchPhone = c.phone?.toLowerCase().includes(q);
      const matchPan = c.panNumber?.toLowerCase().includes(q);
      const matchCity = c.addresses?.some(a => a.city?.toLowerCase().includes(q));
      return matchName || matchEmail || matchPhone || matchPan || matchCity;
    }
    return true;
  });

  // Open Inspector Modal
  const handleOpenCustomerDetail = (cust: UserProfile) => {
    setSelectedCustomer(cust);
    setManualPanInput(cust.panNumber || '');
    setManualHolderInput(cust.panHolderName || cust.fullName);
    setManualDobInput(cust.panDob || '1995-01-01');
    setManualProofUrl(cust.panProofUrl || '');
    setIsEditingPan(false);
    setIsDetailModalOpen(true);
  };

  // Toggle Old vs New status
  const handleToggleCustomerType = (customerId: string, currentType?: 'new' | 'old') => {
    const nextType = currentType === 'new' ? 'old' : 'new';
    updateCustomer(customerId, { customerType: nextType });
    showToast(`Updated customer status to ${nextType === 'new' ? 'NEW REGISTERED' : 'OLD CUSTOMER'}`, 'success');
    if (selectedCustomer && selectedCustomer.id === customerId) {
      setSelectedCustomer({ ...selectedCustomer, customerType: nextType });
    }
  };

  // Manual PAN approval
  const handleManualPanApprove = (customerId: string) => {
    updateCustomer(customerId, {
      panNumber: manualPanInput.trim().toUpperCase(),
      panHolderName: manualHolderInput.trim().toUpperCase(),
      panDob: manualDobInput,
      panProofUrl: manualProofUrl,
      panVerified: true,
      panVerifiedAt: new Date().toISOString(),
      profileCompleted: true,
      isAgeVerified: true
    });
    setIsEditingPan(false);
    showToast('18+ PAN Card Verification approved manually for this customer!', 'success');
    if (selectedCustomer && selectedCustomer.id === customerId) {
      setSelectedCustomer({
        ...selectedCustomer,
        panNumber: manualPanInput.trim().toUpperCase(),
        panHolderName: manualHolderInput.trim().toUpperCase(),
        panDob: manualDobInput,
        panProofUrl: manualProofUrl,
        panVerified: true,
        panVerifiedAt: new Date().toISOString(),
        profileCompleted: true,
        isAgeVerified: true
      });
    }
  };

  // Get orders of selected customer
  const customerOrders: Order[] = selectedCustomer 
    ? orders.filter(o => o.userId === selectedCustomer.id || o.shippingAddress?.fullName?.toLowerCase() === selectedCustomer.fullName?.toLowerCase())
    : [];

  return (
    <div className="space-y-6">
      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-royal text-xl sm:text-2xl font-bold text-[#E5C158] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#D4AF37]" />
            Customer Directory &amp; CRM Intelligence
          </h2>
          <p className="text-xs text-gray-400 font-serif-luxury italic mt-0.5">
            Monitor old loyal patrons, new registered accounts, 18+ PAN Card legal age verification, and individual order histories
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[#181818] border border-[#333] text-xs text-gray-300 font-medium">
            Active Records: <strong className="text-[#E5C158] font-bold">{customers.length} Customers</strong>
          </span>
          <button
            type="button"
            onClick={() => clearDummyCustomers()}
            className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-200 hover:text-white text-xs font-royal font-bold transition-all cursor-pointer flex items-center gap-1.5"
            title="Purge default dummy customer records"
          >
            <span>Clear Dummy Data</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Customers */}
        <div className="p-4 rounded-2xl bg-[#121212] border border-[#C59B27]/30 space-y-1">
          <span className="text-xs text-gray-400">Total Patrons</span>
          <h3 className="font-royal text-2xl font-extrabold text-white">{totalCustomers}</h3>
          <span className="text-[11px] text-gray-400">All registered profiles</span>
        </div>

        {/* Old Customers */}
        <div 
          onClick={() => setFilterType('old')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1 ${
            filterType === 'old' 
              ? 'bg-[#221B08] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)]' 
              : 'bg-[#121212] border-[#333] hover:border-[#D4AF37]/50'
          }`}
        >
          <span className="text-xs text-[#E5C158] font-semibold">Old Loyal Customers</span>
          <h3 className="font-royal text-2xl font-extrabold text-[#E5C158]">{oldCustomers.length}</h3>
          <span className="text-[11px] text-gray-400">Repeat buyers & long-term</span>
        </div>

        {/* New Registered */}
        <div 
          onClick={() => setFilterType('new')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1 ${
            filterType === 'new' 
              ? 'bg-[#0E2015] border-[#2ECC71] shadow-[0_0_15px_rgba(46,204,113,0.25)]' 
              : 'bg-[#121212] border-[#333] hover:border-[#2ECC71]/50'
          }`}
        >
          <span className="text-xs text-[#2ECC71] font-semibold">New Registered Customers</span>
          <h3 className="font-royal text-2xl font-extrabold text-[#2ECC71]">{newCustomers.length}</h3>
          <span className="text-[11px] text-gray-400">Recent signups (New users)</span>
        </div>

        {/* 18+ PAN Verified */}
        <div 
          onClick={() => setFilterType('pan_verified')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1 ${
            filterType === 'pan_verified' 
              ? 'bg-[#181D26] border-[#3498DB] shadow-[0_0_15px_rgba(52,152,219,0.25)]' 
              : 'bg-[#121212] border-[#333] hover:border-[#3498DB]/50'
          }`}
        >
          <span className="text-xs text-[#3498DB] font-semibold">18+ PAN Verified</span>
          <h3 className="font-royal text-2xl font-extrabold text-white">
            {panVerifiedCustomers.length} <span className="text-sm font-normal text-gray-400">({Math.round((panVerifiedCustomers.length / (totalCustomers || 1)) * 100)}%)</span>
          </h3>
          <span className="text-[11px] text-gray-400">{panPendingCustomers.length} pending verification</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-royal font-bold transition-all whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-[#D4AF37] text-black shadow'
                : 'bg-[#161616] text-gray-300 border border-[#2B2B2B] hover:border-[#444]'
            }`}
          >
            All Patrons ({customers.length})
          </button>

          <button
            onClick={() => setFilterType('old')}
            className={`px-3 py-1.5 rounded-xl text-xs font-royal font-bold transition-all whitespace-nowrap ${
              filterType === 'old'
                ? 'bg-[#E5C158] text-black shadow'
                : 'bg-[#161616] text-gray-300 border border-[#2B2B2B] hover:border-[#444]'
            }`}
          >
            Old Customers ({oldCustomers.length})
          </button>

          <button
            onClick={() => setFilterType('new')}
            className={`px-3 py-1.5 rounded-xl text-xs font-royal font-bold transition-all whitespace-nowrap ${
              filterType === 'new'
                ? 'bg-[#2ECC71] text-black shadow'
                : 'bg-[#161616] text-gray-300 border border-[#2B2B2B] hover:border-[#444]'
            }`}
          >
            New Registered ({newCustomers.length})
          </button>

          <button
            onClick={() => setFilterType('pan_verified')}
            className={`px-3 py-1.5 rounded-xl text-xs font-royal font-bold transition-all whitespace-nowrap ${
              filterType === 'pan_verified'
                ? 'bg-[#3498DB] text-white shadow'
                : 'bg-[#161616] text-gray-300 border border-[#2B2B2B] hover:border-[#444]'
            }`}
          >
            18+ PAN Verified ({panVerifiedCustomers.length})
          </button>

          <button
            onClick={() => setFilterType('pan_pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-royal font-bold transition-all whitespace-nowrap ${
              filterType === 'pan_pending'
                ? 'bg-amber-500 text-black shadow'
                : 'bg-[#161616] text-gray-300 border border-[#2B2B2B] hover:border-[#444]'
            }`}
          >
            PAN Pending ({panPendingCustomers.length})
          </button>
        </div>

        {/* Search Field */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, phone, email, PAN Card..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161616] pl-9 pr-3 py-2 rounded-xl border border-[#333] text-xs text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none"
          />
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="bg-[#121212] rounded-2xl border border-[#252525] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181818] border-b border-[#252525] text-gray-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5 pl-4">Patron Identity</th>
                <th className="p-3.5">Customer Type</th>
                <th className="p-3.5">18+ PAN Verification</th>
                <th className="p-3.5">Orders &amp; Spend</th>
                <th className="p-3.5">Delivery City &amp; GPS</th>
                <th className="p-3.5 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No customers found matching the search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const defaultAddr = cust.addresses?.find(a => a.isDefault) || cust.addresses?.[0];
                  const isNew = cust.customerType === 'new';
                  const isPanVerified = !!cust.panVerified;
                  const displayPan = cust.panNumber 
                    ? cust.panNumber
                    : 'Not submitted';

                  return (
                    <tr key={cust.id} className="hover:bg-[#171717] transition-colors">
                      {/* Identity */}
                      <td className="p-3.5 pl-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-royal font-bold text-xs flex-shrink-0 ${
                            isNew 
                              ? 'bg-[#112415] text-[#2ECC71] border border-[#2ECC71]/40' 
                              : 'bg-[#261E08] text-[#E5C158] border border-[#D4AF37]/40'
                          }`}>
                            {cust.fullName ? cust.fullName.charAt(0).toUpperCase() : 'P'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-royal font-bold text-white truncate max-w-[180px] flex items-center gap-1.5">
                              <span>{cust.fullName}</span>
                              {cust.role === 'admin' && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#D4AF37] text-black font-bold uppercase">
                                  Admin
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate max-w-[180px]">{cust.email}</p>
                            <p className="text-[10px] text-[#D4AF37] font-mono">{cust.phone}</p>
                          </div>
                        </div>
                      </td>

                      {/* Customer Type Badge */}
                      <td className="p-3.5">
                        <div className="space-y-1">
                          {isNew ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#112615] text-[#2ECC71] border border-[#2ECC71]/50 uppercase tracking-wide">
                              <Sparkles className="w-3 h-3 text-[#2ECC71]" /> NEW REGISTERED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#2A1E06] text-[#E5C158] border border-[#D4AF37]/50 uppercase tracking-wide">
                              <Crown className="w-3 h-3 text-[#D4AF37]" /> OLD CUSTOMER
                            </span>
                          )}
                          <p className="text-[10px] text-gray-400">
                            Joined {new Date(cust.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </td>

                      {/* 18+ PAN Verification */}
                      <td className="p-3.5">
                        {isPanVerified ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#162A17] text-[#2ECC71] border border-[#2ECC71]/40">
                              <ShieldCheck className="w-3 h-3" /> 18+ PAN VERIFIED
                            </span>
                            <p className="text-[10px] font-mono text-gray-300 font-bold">
                              {displayPan}
                            </p>
                            {cust.panDob && (
                              <p className="text-[9px] text-gray-400">
                                DOB: {new Date(cust.panDob).toLocaleDateString('en-IN')}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2A1E07] text-amber-400 border border-amber-500/40">
                              <AlertCircle className="w-3 h-3" /> PAN PENDING
                            </span>
                            <button
                              onClick={() => handleOpenCustomerDetail(cust)}
                              className="text-[10px] text-[#E5C158] hover:underline block font-semibold cursor-pointer"
                            >
                              Verify Now &rarr;
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Orders & Spent */}
                      <td className="p-3.5">
                        <div>
                          <p className="font-royal font-bold text-white">
                            {cust.totalOrdersCount || 0} Orders
                          </p>
                          <p className="text-[11px] text-[#2ECC71] font-bold">
                            ₹{(cust.totalSpent || 0).toLocaleString()} Spent
                          </p>
                        </div>
                      </td>

                      {/* Primary Delivery & GPS */}
                      <td className="p-3.5">
                        {defaultAddr ? (
                          <div className="space-y-0.5">
                            <p className="text-white font-medium truncate max-w-[150px]">
                              {defaultAddr.city}, {defaultAddr.state}
                            </p>
                            <p className="text-[10px] text-gray-400 truncate max-w-[150px]">
                              PIN: {defaultAddr.postalCode}
                            </p>
                            {(defaultAddr.liveLocation || defaultAddr.gpsLocation) && (
                              <a
                                href={defaultAddr.liveLocation || defaultAddr.gpsLocation?.mapUrl || `https://maps.google.com/?q=${defaultAddr.gpsLocation?.latitude},${defaultAddr.gpsLocation?.longitude}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-[#2ECC71] hover:underline font-semibold"
                              >
                                <Navigation className="w-2.5 h-2.5" /> GPS Pinned <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-[10px]">No address saved</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="p-3.5 text-right pr-4">
                        <button
                          onClick={() => handleOpenCustomerDetail(cust)}
                          className="px-3 py-1.5 rounded-lg bg-[#1F190B] border border-[#D4AF37]/50 text-[#E5C158] font-royal font-bold hover:bg-[#D4AF37] hover:text-black transition-colors"
                        >
                          Inspect Profile
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER DETAIL MODAL */}
      {isDetailModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121212] border border-[#C59B27]/50 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl space-y-6 p-6 my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#252525]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#2A1E06] to-[#121212] border-2 border-[#D4AF37] flex items-center justify-center font-royal font-bold text-lg text-[#E5C158]">
                  {selectedCustomer.fullName ? selectedCustomer.fullName.charAt(0).toUpperCase() : 'P'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-royal text-xl font-bold text-white">
                      {selectedCustomer.fullName}
                    </h3>
                    {selectedCustomer.customerType === 'new' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#112615] text-[#2ECC71] border border-[#2ECC71]/40 uppercase">
                        New Customer
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2A1E06] text-[#E5C158] border border-[#D4AF37]/40 uppercase">
                        Old Customer
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    Customer ID: <span className="font-mono text-gray-300">{selectedCustomer.id}</span> &bull; Joined {new Date(selectedCustomer.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleCustomerType(selectedCustomer.id, selectedCustomer.customerType)}
                  className="px-3 py-1.5 rounded-xl bg-[#1A1A1A] border border-[#333] hover:border-[#D4AF37] text-xs font-semibold text-gray-200"
                >
                  Mark as {selectedCustomer.customerType === 'new' ? 'Old Customer' : 'New Customer'}
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-1.5 rounded-lg bg-[#1F1F1F] text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Primary Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#181818] border border-[#2A2A2A] space-y-1">
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#D4AF37]" /> Email Address
                </span>
                <p className="text-xs font-semibold text-white truncate">{selectedCustomer.email}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#181818] border border-[#2A2A2A] space-y-1">
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#D4AF37]" /> Phone Number
                </span>
                <p className="text-xs font-semibold text-[#E5C158] font-mono">{selectedCustomer.phone}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#181818] border border-[#2A2A2A] space-y-1">
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-[#D4AF37]" /> Total Spend & Orders
                </span>
                <p className="text-xs font-semibold text-[#2ECC71]">
                  ₹{(selectedCustomer.totalSpent || 0).toLocaleString()} ({selectedCustomer.totalOrdersCount || 0} orders)
                </p>
              </div>
            </div>

            {/* SECTION: 18+ PAN CARD VERIFICATION */}
            <div className="p-4 rounded-xl bg-[#161616] border border-[#2B2B2B] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-royal text-sm font-bold text-[#E5C158] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2ECC71]" />
                  18+ Legal Age Verification &amp; PAN Card Status
                </h4>
                {selectedCustomer.panVerified ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#142A16] text-[#2ECC71] border border-[#2ECC71]/40 flex items-center gap-1">
                    <Check className="w-3 h-3" /> VERIFIED 18+ PATRON
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    PENDING VERIFICATION
                  </span>
                )}
              </div>

              {!isEditingPan ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#111] border border-[#222]">
                      <span className="text-gray-400 block text-[10px]">PAN Card Number</span>
                      <span className="font-mono text-white font-bold text-sm">
                        {selectedCustomer.panNumber || 'Not submitted'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#111] border border-[#222]">
                      <span className="text-gray-400 block text-[10px]">Name on PAN Card</span>
                      <span className="text-white font-semibold">
                        {selectedCustomer.panHolderName || selectedCustomer.fullName}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#111] border border-[#222] flex items-center justify-between">
                      <div>
                        <span className="text-gray-400 block text-[10px]">Date of Birth</span>
                        <span className="text-gray-200 font-semibold">
                          {selectedCustomer.panDob ? new Date(selectedCustomer.panDob).toLocaleDateString('en-IN') : 'Not entered'}
                        </span>
                      </div>
                      <button
                        onClick={() => setIsEditingPan(true)}
                        className="px-2.5 py-1 rounded-lg bg-[#222] hover:bg-[#D4AF37] text-gray-300 hover:text-black font-semibold text-[10px] transition-colors cursor-pointer"
                      >
                        Edit / Verify
                      </button>
                    </div>
                  </div>

                  {/* Photo Document Preview */}
                  {selectedCustomer.panProofUrl && (
                    <div className="p-3 rounded-lg bg-[#111] border border-[#222] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={selectedCustomer.panProofUrl} 
                          alt="PAN proof document" 
                          className="w-14 h-10 object-cover rounded-lg border border-[#333]" 
                        />
                        <div>
                          <span className="text-[11px] font-bold text-white block">PAN Card Photo Document</span>
                          <span className="text-[10px] text-gray-400">Uploaded for 18+ age proof</span>
                        </div>
                      </div>
                      <a 
                        href={selectedCustomer.panProofUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black text-xs font-semibold flex items-center gap-1 border border-[#333] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Photo
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                /* Manual PAN Verification Form for Admin */
                <div className="p-3.5 rounded-lg bg-[#1A1A1A] border border-[#333] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-300 block mb-1">PAN Number (10 Characters)</label>
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="ABCDE1234F"
                        value={manualPanInput}
                        onChange={(e) => setManualPanInput(e.target.value.toUpperCase())}
                        className="w-full bg-[#111] px-2.5 py-1.5 rounded border border-[#444] text-xs font-mono text-white uppercase focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-300 block mb-1">Name on PAN Card</label>
                      <input
                        type="text"
                        value={manualHolderInput}
                        onChange={(e) => setManualHolderInput(e.target.value.toUpperCase())}
                        className="w-full bg-[#111] px-2.5 py-1.5 rounded border border-[#444] text-xs text-white uppercase focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-300 block mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={manualDobInput}
                        onChange={(e) => setManualDobInput(e.target.value)}
                        className="w-full bg-[#111] px-2.5 py-1.5 rounded border border-[#444] text-xs text-white focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-300 block mb-1">PAN Card Photo Document URL / Link</label>
                    <input
                      type="text"
                      placeholder="https://... photo link"
                      value={manualProofUrl}
                      onChange={(e) => setManualProofUrl(e.target.value)}
                      className="w-full bg-[#111] px-2.5 py-1.5 rounded border border-[#444] text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setIsEditingPan(false)}
                      className="px-3 py-1 rounded bg-[#222] text-xs text-gray-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleManualPanApprove(selectedCustomer.id)}
                      className="px-4 py-1 rounded bg-[#2ECC71] text-black font-royal font-bold text-xs hover:brightness-110 cursor-pointer"
                    >
                      Approve &amp; Verify 18+ PAN
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION: SAVED ADDRESSES & LIVE GPS */}
            <div className="space-y-3">
              <h4 className="font-royal text-sm font-bold text-[#E5C158] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                Saved Delivery Addresses & Precise GPS Coordinates ({selectedCustomer.addresses?.length || 0})
              </h4>

              {!selectedCustomer.addresses || selectedCustomer.addresses.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#181818] border border-[#222] text-xs text-gray-400 text-center">
                  No addresses saved yet by this patron.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {selectedCustomer.addresses.map((addr) => (
                    <div key={addr.id} className="p-3.5 rounded-xl bg-[#161616] border border-[#252525] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-royal font-bold text-white">{addr.fullName}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[9px] uppercase bg-[#222] text-gray-300">
                            {addr.type}
                          </span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 rounded text-[9px] uppercase bg-[#D4AF37] text-black font-bold">
                              Default
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-300">
                        {addr.addressLine1} {addr.addressLine2 && `, ${addr.addressLine2}`}
                      </p>
                      {addr.landmark && (
                        <p className="text-[#D4AF37] text-[11px]">Landmark: {addr.landmark}</p>
                      )}
                      <p className="text-gray-400 font-medium">
                        {addr.city}, {addr.state} - {addr.postalCode}
                      </p>

                      {/* GPS coordinates & Map Link */}
                      {(addr.liveLocation || addr.gpsLocation) && (
                        <div className="p-2 rounded bg-[#132215] border border-[#2ECC71]/30 text-[#2ECC71] text-[11px] flex items-center justify-between">
                          <span className="flex items-center gap-1 font-semibold">
                            <Navigation className="w-3 h-3" /> Live GPS Attached
                          </span>
                          <a
                            href={addr.liveLocation || addr.gpsLocation?.mapUrl || `https://maps.google.com/?q=${addr.gpsLocation?.latitude},${addr.gpsLocation?.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#E5C158] hover:underline flex items-center gap-1 font-bold"
                          >
                            <span>Open Map</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION: CUSTOMER ORDERS HISTORY */}
            <div className="space-y-3">
              <h4 className="font-royal text-sm font-bold text-[#E5C158] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#D4AF37]" />
                Recent Orders by this Patron ({customerOrders.length})
              </h4>

              {customerOrders.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#181818] border border-[#222] text-xs text-gray-400 text-center">
                  No orders recorded yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {customerOrders.map((ord) => (
                    <div key={ord.id} className="p-3 rounded-xl bg-[#161616] border border-[#252525] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-royal font-bold text-[#E5C158]">{ord.id}</span>
                          <span className="text-gray-400">&bull; {new Date(ord.createdAt).toLocaleDateString('en-IN')}</span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-[#202020] text-gray-200">
                            {ord.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-300 text-[11px] mt-0.5 truncate max-w-sm">
                          {ord.items.map(i => `${i.productName || 'Artisanal Paan'} (x${i.quantity})`).join(', ')}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-royal font-bold text-white text-sm">
                          ₹{ord.total.toLocaleString()}
                        </span>
                        <p className="text-[10px] text-gray-400 uppercase">{ord.paymentMethod}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-3 border-t border-[#252525]">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#D4AF37] text-black font-royal font-bold text-xs hover:brightness-110"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
