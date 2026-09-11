/**
 * KisanMitra - Buyer Portal Interactive Logic
 * Handles View Routing, Crop Lots Filtering, Make-an-Offer Workflow,
 * Dynamic Notifications, Profile Management, and Payments Settlement.
 */

(function () {
  'use strict';

  // --- Initial Seed Data ---
  const INITIAL_LOTS = [
    {
      id: 'lot-1',
      crop: 'Sharbati Wheat',
      variety: 'Grade A Premium Grain',
      quantity: 450,
      unit: 'Quintals',
      price: 28.50,
      location: 'Sehore Mandi, MP'
    },
    {
      id: 'lot-2',
      crop: 'Basmati 1121 Rice',
      variety: 'Export Grade Long Grain',
      quantity: 800,
      unit: 'Quintals',
      price: 42.00,
      location: 'Karnal Mandi, HR'
    },
    {
      id: 'lot-3',
      crop: 'Yellow Soybean',
      variety: 'High Oil Content (JS-335)',
      quantity: 320,
      unit: 'Quintals',
      price: 46.20,
      location: 'Indore Mandi, MP'
    },
    {
      id: 'lot-4',
      crop: 'Shankar-6 Cotton',
      variety: '28mm Staple Length',
      quantity: 600,
      unit: 'Quintals',
      price: 68.00,
      location: 'Rajkot APMC, GJ'
    },
    {
      id: 'lot-5',
      crop: 'Teja Red Chilli',
      variety: 'Stemless Sun-dried',
      quantity: 140,
      unit: 'Quintals',
      price: 185.00,
      location: 'Guntur Mandi, AP'
    },
    {
      id: 'lot-6',
      crop: 'Desi Chana (Chickpea)',
      variety: 'Clean Machine Sorted',
      quantity: 500,
      unit: 'Quintals',
      price: 54.00,
      location: 'Bikaner Mandi, RJ'
    }
  ];

  const INITIAL_OFFERS = [
    {
      id: 'off-101',
      crop: 'Basmati 1121 Rice',
      priceOffered: 41.50,
      quantity: 500,
      status: 'Accepted – awaiting delivery',
      deliveryDate: '2026-09-20'
    },
    {
      id: 'off-102',
      crop: 'Yellow Soybean',
      priceOffered: 45.00,
      quantity: 200,
      status: 'Pending',
      deliveryDate: '2026-09-25'
    },
    {
      id: 'off-103',
      crop: 'Shankar-6 Cotton',
      priceOffered: 64.00,
      quantity: 300,
      status: 'Rejected',
      deliveryDate: '2026-09-18'
    }
  ];

  const INITIAL_NOTIFICATIONS = [
    {
      id: 'notif-1',
      title: 'Offer accepted for Tomato lot (120 Quintals)',
      time: '14 mins ago',
      read: false,
      type: 'accepted'
    },
    {
      id: 'notif-2',
      title: 'New lot matching your demand: Shankar-6 Cotton in Rajkot Mandi',
      time: '1 hour ago',
      read: false,
      type: 'match'
    },
    {
      id: 'notif-3',
      title: 'Offer rejected for Yellow Soybean by seller',
      time: '3 hours ago',
      read: true,
      type: 'rejected'
    }
  ];

  const INITIAL_PROFILE = {
    companyName: 'AgroGrain India Enterprises Ltd.',
    contactName: 'Vikram Sharma',
    phone: '+91 98260 12345',
    email: 'vikram.sharma@agrograin.in',
    location: 'Indore, Madhya Pradesh',
    role: 'Bulk Commodity Buyer'
  };

  const INITIAL_PAYMENTS = [
    {
      id: 'pay-1',
      offerId: 'off-101',
      lotRef: 'Offer #OFF-101 • 500 Quintals (Karnal Mandi)',
      crop: 'Basmati 1121 Rice',
      amount: 2075000,
      status: 'Pending',
      date: '—'
    },
    {
      id: 'pay-2',
      offerId: 'off-098',
      lotRef: 'Offer #OFF-098 • 180 Quintals (Kolar APMC)',
      crop: 'Hybrid Red Tomato',
      amount: 396000,
      status: 'Pending',
      date: '—'
    },
    {
      id: 'pay-3',
      offerId: 'off-095',
      lotRef: 'Offer #OFF-095 • 140 Quintals (Guntur Mandi)',
      crop: 'Teja Red Chilli',
      amount: 2590000,
      status: 'Paid',
      date: '08 Sep 2026'
    },
    {
      id: 'pay-4',
      offerId: 'off-092',
      lotRef: 'Offer #OFF-092 • 350 Quintals (Lasalgaon Mandi)',
      crop: 'Nashik Red Onion',
      amount: 840000,
      status: 'Paid',
      date: '05 Sep 2026'
    },
    {
      id: 'pay-5',
      offerId: 'off-090',
      lotRef: 'Offer #OFF-090 • 200 Quintals (Sehore Mandi)',
      crop: 'Sharbati Wheat',
      amount: 570000,
      status: 'Paid',
      date: '01 Sep 2026'
    },
    {
      id: 'pay-6',
      offerId: 'off-088',
      lotRef: 'Offer #OFF-088 • 250 Quintals (Alwar Mandi)',
      crop: 'Yellow Mustard Seed',
      amount: 1375000,
      status: 'Failed',
      date: '29 Aug 2026'
    },
    {
      id: 'pay-7',
      offerId: 'off-085',
      lotRef: 'Offer #OFF-085 • 400 Quintals (Indore APMC)',
      crop: 'Yellow Soybean',
      amount: 1848000,
      status: 'Paid',
      date: '24 Aug 2026'
    },
    {
      id: 'pay-8',
      offerId: 'off-081',
      lotRef: 'Offer #OFF-081 • 300 Quintals (Bikaner Mandi)',
      crop: 'Desi Chana (Chickpea)',
      amount: 1620000,
      status: 'Paid',
      date: '19 Aug 2026'
    }
  ];

  // --- State Storage Keys ---
  const STORAGE_KEY_OFFERS = 'kisanmitra_buyer_offers';
  const STORAGE_KEY_ACTIVE_PAGE = 'kisanmitra_buyer_active_page';
  const STORAGE_KEY_NOTIFICATIONS = 'kisanmitra_buyer_notifications';
  const STORAGE_KEY_PROFILE = 'kisanmitra_buyer_profile';
  const STORAGE_KEY_PAYMENTS = 'kisanmitra_buyer_payments_v2';

  // --- App State ---
  let currentLots = [...INITIAL_LOTS];
  let currentOffers = loadOffers();
  let currentNotifications = loadNotifications();
  let currentProfile = loadProfile();
  let currentPayments = loadPayments();
  let selectedLotForOffer = currentLots[0];
  let selectedPaymentForPay = null;

  function loadOffers() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_OFFERS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not read offers from storage', e);
    }
    return [...INITIAL_OFFERS];
  }

  function saveOffers() {
    try {
      localStorage.setItem(STORAGE_KEY_OFFERS, JSON.stringify(currentOffers));
    } catch (e) {
      console.warn('Could not save offers to storage', e);
    }
  }

  function loadNotifications() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not read notifications from storage', e);
    }
    return [...INITIAL_NOTIFICATIONS];
  }

  function saveNotifications() {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(currentNotifications));
    } catch (e) {
      console.warn('Could not save notifications to storage', e);
    }
  }

  function loadProfile() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not read profile from storage', e);
    }
    return { ...INITIAL_PROFILE };
  }

  function saveProfile() {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(currentProfile));
    } catch (e) {
      console.warn('Could not save profile to storage', e);
    }
  }

  function loadPayments() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PAYMENTS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not read payments from storage', e);
    }
    return [...INITIAL_PAYMENTS];
  }

  function savePayments() {
    try {
      localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(currentPayments));
    } catch (e) {
      console.warn('Could not save payments to storage', e);
    }
  }

  // Synchronize Payments with Accepted Offers
  function syncPaymentsWithOffers() {
    currentOffers.forEach(offer => {
      if (offer.status === 'Accepted – awaiting delivery') {
        const existingPayment = currentPayments.find(p => p.offerId === offer.id);
        if (!existingPayment) {
          const qty = offer.quantity || 100;
          const rate = offer.priceOffered || 25;
          const calcAmount = Math.round(qty * 100 * rate);
          currentPayments.unshift({
            id: 'pay-' + offer.id,
            offerId: offer.id,
            lotRef: `Offer #${offer.id.toUpperCase()} • ${qty} Quintals`,
            crop: offer.crop,
            amount: calcAmount,
            status: 'Pending',
            date: '—'
          });
          savePayments();
        }
      }
    });
  }

  // --- DOM Element References ---
  const navButtons = document.querySelectorAll('.nav-item');
  const pageViews = document.querySelectorAll('.page-view');

  // Header Dropdowns
  const notificationBtn = document.getElementById('notificationBtn');
  const notifBadge = document.getElementById('notifBadge');
  const notificationsDropdown = document.getElementById('notificationsDropdown');
  const notificationsList = document.getElementById('notificationsList');
  const emptyNotifications = document.getElementById('emptyNotifications');
  const unreadCountPill = document.getElementById('unreadCountPill');
  const markAllReadBtn = document.getElementById('markAllReadBtn');

  const profileTriggerBtn = document.getElementById('profileTriggerBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  const headerAvatar = document.getElementById('headerAvatar');
  const headerUserName = document.getElementById('headerUserName');
  const headerUserRole = document.getElementById('headerUserRole');

  const profileCardAvatar = document.getElementById('profileCardAvatar');
  const profileDropdownName = document.getElementById('profileDropdownName');
  const profileDropdownRole = document.getElementById('profileDropdownRole');
  const profileDropdownCompany = document.getElementById('profileDropdownCompany');
  const profileDropdownContact = document.getElementById('profileDropdownContact');
  const profileDropdownPhone = document.getElementById('profileDropdownPhone');
  const profileDropdownEmail = document.getElementById('profileDropdownEmail');
  const profileDropdownLocation = document.getElementById('profileDropdownLocation');
  const openEditProfileBtn = document.getElementById('openEditProfileBtn');
  const profileLogoutLink = document.getElementById('profileLogoutLink');

  // Edit Profile Modal
  const editProfileModal = document.getElementById('editProfileModal');
  const closeEditProfileBtn = document.getElementById('closeEditProfileBtn');
  const cancelEditProfileBtn = document.getElementById('cancelEditProfileBtn');
  const editProfileForm = document.getElementById('editProfileForm');
  const profileCompanyInput = document.getElementById('profileCompanyInput');
  const profileContactInput = document.getElementById('profileContactInput');
  const profilePhoneInput = document.getElementById('profilePhoneInput');
  const profileEmailInput = document.getElementById('profileEmailInput');
  const profileLocationInput = document.getElementById('profileLocationInput');

  // Dashboard Stats & Hero
  const matchingLotsCountEl = document.getElementById('matchingLotsCount');
  const pendingOffersCountEl = document.getElementById('pendingOffersCount');
  const btnBrowseDirect = document.getElementById('btnBrowseDirect');
  const heroCompanyNameEl = document.querySelector('.hero-company-name');
  const heroHubLocationEl = document.querySelector('.hero-footer-bar .hero-meta-item:first-child .meta-val');

  // Browse Lots
  const cropSearchInput = document.getElementById('cropSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const lotsTableBody = document.getElementById('lotsTableBody');
  const emptyLotsState = document.getElementById('emptyLotsState');
  const resultsCountLabel = document.getElementById('resultsCountLabel');
  const resetSearchBtn = document.getElementById('resetSearchBtn');

  // Offers
  const offersTableBody = document.getElementById('offersTableBody');
  const emptyOffersState = document.getElementById('emptyOffersState');
  const btnNewOfferNav = document.getElementById('btnNewOfferNav');
  const browseLotsEmptyBtn = document.getElementById('browseLotsEmptyBtn');

  // Payments
  const paymentsTable = document.getElementById('paymentsTable');
  const paymentsTableBody = document.getElementById('paymentsTableBody');
  const emptyPaymentsState = document.getElementById('emptyPaymentsState');

  // Payment Confirmation Modal
  const payModal = document.getElementById('payModal');
  const closePayModalBtn = document.getElementById('closePayModalBtn');
  const cancelPayBtn = document.getElementById('cancelPayBtn');
  const confirmPayBtn = document.getElementById('confirmPayBtn');
  const payModalCrop = document.getElementById('payModalCrop');
  const payModalAmount = document.getElementById('payModalAmount');

  // Make Offer Modal
  const offerModal = document.getElementById('offerModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelOfferBtn = document.getElementById('cancelOfferBtn');
  const makeOfferForm = document.getElementById('makeOfferForm');
  const modalCropName = document.getElementById('modalCropName');
  const modalAskingPrice = document.getElementById('modalAskingPrice');
  const modalLocation = document.getElementById('modalLocation');
  const offerPriceInput = document.getElementById('offerPrice');
  const offerQuantityInput = document.getElementById('offerQuantity');
  const offerDeliveryDateInput = document.getElementById('offerDeliveryDate');

  // Toast
  const appToast = document.getElementById('appToast');
  const toastMessage = document.getElementById('toastMessage');

  // Footer Logout
  const logoutLink = document.getElementById('logoutLink');

  // --- Helpers: Formatting ---
  function formatPrice(val) {
    return '₹' + Number(val).toFixed(2);
  }

  function formatIndianCurrency(num) {
    return '₹' + Number(num).toLocaleString('en-IN');
  }

  function getInitials(name) {
    if (!name) return 'KM';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  // --- Toast Notification Helper ---
  let toastTimer = null;
  function showToast(message) {
    if (!appToast) return;
    toastMessage.textContent = message;
    appToast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      appToast.classList.remove('show');
    }, 3500);
  }

  // --- Dropdown Panels Toggle & Management ---
  function toggleDropdown(panel, btn) {
    const isShowing = panel.classList.contains('show');
    closeAllDropdowns();

    if (!isShowing) {
      panel.classList.add('show');
      panel.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
    }
  }

  function closeAllDropdowns() {
    if (notificationsDropdown) {
      notificationsDropdown.classList.remove('show');
      notificationsDropdown.setAttribute('aria-hidden', 'true');
      notificationBtn.setAttribute('aria-expanded', 'false');
    }
    if (profileDropdown) {
      profileDropdown.classList.remove('show');
      profileDropdown.setAttribute('aria-hidden', 'true');
      profileTriggerBtn.setAttribute('aria-expanded', 'false');
    }
  }

  // --- Notifications Rendering & Logic ---
  function renderNotifications() {
    if (!notificationsList) return;

    const unreadCount = currentNotifications.filter(n => !n.read).length;

    // Update Bell Badge
    if (unreadCount > 0) {
      notifBadge.textContent = unreadCount.toString();
      notifBadge.classList.remove('hidden');
    } else {
      notifBadge.classList.add('hidden');
    }

    if (unreadCountPill) {
      unreadCountPill.textContent = unreadCount === 0 ? 'All read' : `${unreadCount} new`;
    }

    notificationsList.innerHTML = '';

    if (currentNotifications.length === 0) {
      emptyNotifications.style.display = 'flex';
      return;
    }

    emptyNotifications.style.display = 'none';

    currentNotifications.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = `notification-item ${item.read ? 'read' : 'unread'}`;
      itemEl.setAttribute('data-id', item.id);

      let iconType = 'match';
      let iconSvg = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-svg" style="width:16px;height:16px;">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>`;

      if (item.type === 'accepted') {
        iconType = 'accepted';
        iconSvg = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="icon-svg" style="width:16px;height:16px;">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>`;
      } else if (item.type === 'rejected') {
        iconType = 'rejected';
        iconSvg = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="icon-svg" style="width:16px;height:16px;">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>`;
      }

      itemEl.innerHTML = `
        <div class="notif-dot"></div>
        <div class="notif-icon-box ${iconType}">
          ${iconSvg}
        </div>
        <div class="notif-content">
          <span class="notif-title">${escapeHtml(item.title)}</span>
          <span class="notif-time">${escapeHtml(item.time)}</span>
        </div>
      `;

      itemEl.addEventListener('click', () => {
        markNotificationAsRead(item.id);
      });

      notificationsList.appendChild(itemEl);
    });
  }

  function markNotificationAsRead(id) {
    const notif = currentNotifications.find(n => n.id === id);
    if (notif && !notif.read) {
      notif.read = true;
      saveNotifications();
      renderNotifications();
      showToast('Notification marked as read.');
    }
  }

  function markAllNotificationsAsRead() {
    let hadUnread = false;
    currentNotifications.forEach(n => {
      if (!n.read) hadUnread = true;
      n.read = true;
    });
    if (hadUnread) {
      saveNotifications();
      renderNotifications();
      showToast('All notifications marked as read.');
    } else {
      showToast('All notifications are already read.');
    }
  }

  // --- Profile Rendering & Logic ---
  function renderProfile() {
    const initials = getInitials(currentProfile.contactName);

    // Update Header Profile Trigger
    if (headerAvatar) headerAvatar.textContent = initials;
    if (headerUserName) headerUserName.textContent = currentProfile.contactName;
    if (headerUserRole) headerUserRole.textContent = currentProfile.role;

    // Update Profile Dropdown Card
    if (profileCardAvatar) profileCardAvatar.textContent = initials;
    if (profileDropdownName) profileDropdownName.textContent = currentProfile.contactName;
    if (profileDropdownRole) profileDropdownRole.textContent = currentProfile.role;
    if (profileDropdownCompany) profileDropdownCompany.textContent = currentProfile.companyName;
    if (profileDropdownContact) profileDropdownContact.textContent = currentProfile.contactName;
    if (profileDropdownPhone) profileDropdownPhone.textContent = currentProfile.phone;
    if (profileDropdownEmail) profileDropdownEmail.textContent = currentProfile.email;
    if (profileDropdownLocation) profileDropdownLocation.textContent = currentProfile.location;

    // Update Dashboard Hero Card
    if (heroCompanyNameEl) heroCompanyNameEl.textContent = currentProfile.companyName;
    if (heroHubLocationEl) heroHubLocationEl.textContent = `${currentProfile.location} Hub`;
  }

  function openEditProfileModal() {
    closeAllDropdowns();

    profileCompanyInput.value = currentProfile.companyName || '';
    profileContactInput.value = currentProfile.contactName || '';
    profilePhoneInput.value = currentProfile.phone || '';
    profileEmailInput.value = currentProfile.email || '';
    profileLocationInput.value = currentProfile.location || '';

    editProfileModal.classList.add('open');
    editProfileModal.setAttribute('aria-hidden', 'false');
    profileCompanyInput.focus();
  }

  function closeEditProfileModal() {
    editProfileModal.classList.remove('open');
    editProfileModal.setAttribute('aria-hidden', 'true');
  }

  function handleProfileSubmit(e) {
    e.preventDefault();

    const companyName = profileCompanyInput.value.trim();
    const contactName = profileContactInput.value.trim();
    const phone = profilePhoneInput.value.trim();
    const email = profileEmailInput.value.trim();
    const location = profileLocationInput.value.trim();

    if (!companyName || !contactName || !phone || !email || !location) {
      alert('Please fill in all profile fields.');
      return;
    }

    currentProfile = {
      ...currentProfile,
      companyName,
      contactName,
      phone,
      email,
      location
    };

    saveProfile();
    renderProfile();
    closeEditProfileModal();
    showToast('Profile updated successfully!');
  }

  // --- Payments Rendering & Logic ---
  function renderPaymentsTable() {
    if (!paymentsTableBody) return;

    syncPaymentsWithOffers();
    paymentsTableBody.innerHTML = '';

    if (currentPayments.length === 0) {
      if (paymentsTable) paymentsTable.style.display = 'none';
      if (emptyPaymentsState) emptyPaymentsState.style.display = 'flex';
      return;
    }

    if (paymentsTable) paymentsTable.style.display = 'table';
    if (emptyPaymentsState) emptyPaymentsState.style.display = 'none';

    currentPayments.forEach(pay => {
      const tr = document.createElement('tr');

      let statusBadgeClass = 'status-pending';
      if (pay.status === 'Paid') {
        statusBadgeClass = 'status-paid';
      } else if (pay.status === 'Failed') {
        statusBadgeClass = 'status-failed';
      }

      tr.innerHTML = `
        <td>
          <div class="crop-name-cell">${escapeHtml(pay.crop)}</div>
          <span class="lot-ref-pill">${escapeHtml(pay.lotRef)}</span>
        </td>
        <td>
          <span class="payment-amount">${formatIndianCurrency(pay.amount)}</span>
        </td>
        <td>
          <span class="status-badge ${statusBadgeClass}">
            <span class="status-dot"></span>
            <span>${escapeHtml(pay.status)}</span>
          </span>
        </td>
        <td>
          <span style="font-weight: 500; font-size: 14px;">${escapeHtml(pay.date)}</span>
        </td>
        <td class="text-right">
          ${pay.status === 'Pending' 
            ? `<button class="btn btn-gold btn-sm pay-now-btn" data-pay-id="${pay.id}">Pay Now</button>`
            : pay.status === 'Failed'
            ? `<button class="btn btn-secondary btn-sm pay-now-btn" data-pay-id="${pay.id}">Retry Pay</button>`
            : `<span style="color:#12753a; font-size:13.5px; font-weight:600; display:inline-flex; align-items:center; gap:5px;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:15px;height:15px;">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Paid
               </span>`
          }
        </td>
      `;

      paymentsTableBody.appendChild(tr);
    });

    // Attach click listeners to "Pay Now" buttons
    const payBtns = paymentsTableBody.querySelectorAll('.pay-now-btn');
    payBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const payId = btn.getAttribute('data-pay-id');
        const foundPay = currentPayments.find(p => p.id === payId);
        if (foundPay) {
          openPayModal(foundPay);
        }
      });
    });
  }

  function openPayModal(payment) {
    selectedPaymentForPay = payment;
    if (payModalCrop) payModalCrop.textContent = payment.crop;
    if (payModalAmount) payModalAmount.textContent = formatIndianCurrency(payment.amount);

    payModal.classList.add('open');
    payModal.setAttribute('aria-hidden', 'false');
  }

  function closePayModal() {
    payModal.classList.remove('open');
    payModal.setAttribute('aria-hidden', 'true');
    selectedPaymentForPay = null;
  }

  function handleConfirmPayment() {
    if (!selectedPaymentForPay) return;

    // Stamp as Paid with today's formatted date
    selectedPaymentForPay.status = 'Paid';
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    selectedPaymentForPay.date = dateFormatted;

    savePayments();

    // Create payment confirmation notification
    const newNotif = {
      id: 'notif-' + Date.now(),
      title: `Escrow payment of ${formatIndianCurrency(selectedPaymentForPay.amount)} completed for ${selectedPaymentForPay.crop}`,
      time: 'Just now',
      read: false,
      type: 'accepted'
    };
    currentNotifications.unshift(newNotif);
    saveNotifications();
    renderNotifications();

    const paidCrop = selectedPaymentForPay.crop;
    const paidAmount = formatIndianCurrency(selectedPaymentForPay.amount);

    closePayModal();
    renderPaymentsTable();
    showToast(`Payment of ${paidAmount} completed via Escrow for ${paidCrop}!`);
  }

  // --- Navigation & Routing ---
  function navigateToPage(pageId) {
    closeAllDropdowns();

    // Update active nav button
    navButtons.forEach(btn => {
      if (btn.getAttribute('data-page') === pageId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update active page view
    pageViews.forEach(page => {
      if (page.id === `page-${pageId}`) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_PAGE, pageId);
    } catch (e) {}

    if (pageId === 'dashboard') {
      updateDashboardCounts();
    } else if (pageId === 'my-offers') {
      renderOffersTable();
    } else if (pageId === 'browse-lots') {
      renderLotsTable(cropSearchInput.value.trim());
    } else if (pageId === 'payments') {
      renderPaymentsTable();
    }
  }

  // --- Dashboard Logic ---
  function updateDashboardCounts() {
    if (matchingLotsCountEl) {
      matchingLotsCountEl.textContent = currentLots.length.toString();
    }
    if (pendingOffersCountEl) {
      const pendingCount = currentOffers.filter(o => o.status === 'Pending').length;
      pendingOffersCountEl.textContent = pendingCount.toString();
    }
  }

  // --- Browse Lots Logic ---
  function renderLotsTable(filterQuery = '') {
    if (!lotsTableBody) return;

    const query = filterQuery.toLowerCase().trim();
    const filtered = currentLots.filter(lot => lot.crop.toLowerCase().includes(query));

    lotsTableBody.innerHTML = '';

    if (filtered.length === 0) {
      document.getElementById('lotsTable').style.display = 'none';
      emptyLotsState.style.display = 'flex';
      resultsCountLabel.textContent = 'No matching lots';
      return;
    }

    document.getElementById('lotsTable').style.display = 'table';
    emptyLotsState.style.display = 'none';
    resultsCountLabel.textContent = `Showing ${filtered.length} available lot${filtered.length === 1 ? '' : 's'}`;

    filtered.forEach(lot => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="crop-name-cell">${escapeHtml(lot.crop)}</div>
          <div class="crop-variety">${escapeHtml(lot.variety)}</div>
        </td>
        <td>
          <strong>${lot.quantity}</strong> ${escapeHtml(lot.unit)}
        </td>
        <td>
          <div class="price-cell">${formatPrice(lot.price)} / kg</div>
          <div class="price-sub">Est. ₹${(lot.price * 100).toLocaleString('en-IN')}/quintal</div>
        </td>
        <td>
          <span>${escapeHtml(lot.location)}</span>
        </td>
        <td class="text-right">
          <button class="btn btn-gold btn-sm make-offer-btn" data-lot-id="${lot.id}">
            Make an Offer
          </button>
        </td>
      `;
      lotsTableBody.appendChild(tr);
    });

    const offerBtns = lotsTableBody.querySelectorAll('.make-offer-btn');
    offerBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const lotId = btn.getAttribute('data-lot-id');
        const foundLot = currentLots.find(l => l.id === lotId);
        if (foundLot) {
          openOfferModal(foundLot);
        }
      });
    });
  }

  // --- My Offers Logic ---
  function renderOffersTable() {
    if (!offersTableBody) return;

    offersTableBody.innerHTML = '';

    if (currentOffers.length === 0) {
      document.getElementById('offersTable').style.display = 'none';
      emptyOffersState.style.display = 'flex';
      return;
    }

    document.getElementById('offersTable').style.display = 'table';
    emptyOffersState.style.display = 'none';

    currentOffers.forEach(offer => {
      const tr = document.createElement('tr');

      let statusBadgeClass = 'status-pending';
      if (offer.status === 'Accepted – awaiting delivery') {
        statusBadgeClass = 'status-accepted';
      } else if (offer.status === 'Rejected') {
        statusBadgeClass = 'status-rejected';
      }

      tr.innerHTML = `
        <td>
          <div class="crop-name-cell">${escapeHtml(offer.crop)}</div>
          <div class="crop-variety">${offer.quantity ? `${offer.quantity} Quintals required` : ''}</div>
        </td>
        <td>
          <span class="price-cell">${formatPrice(offer.priceOffered)} / kg</span>
        </td>
        <td>
          <span class="status-badge ${statusBadgeClass}">
            <span class="status-dot"></span>
            <span>${escapeHtml(offer.status)}</span>
          </span>
        </td>
      `;

      offersTableBody.appendChild(tr);
    });
  }

  // --- Make an Offer Modal Workflow ---
  function openOfferModal(lot) {
    closeAllDropdowns();
    selectedLotForOffer = lot || currentLots[0];

    modalCropName.textContent = selectedLotForOffer.crop;
    modalAskingPrice.textContent = `${formatPrice(selectedLotForOffer.price)} / kg`;
    modalLocation.textContent = selectedLotForOffer.location;

    offerPriceInput.value = selectedLotForOffer.price.toFixed(2);
    offerQuantityInput.value = Math.min(selectedLotForOffer.quantity, 200);

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    const dateStr = targetDate.toISOString().split('T')[0];
    offerDeliveryDateInput.value = dateStr;
    offerDeliveryDateInput.min = new Date().toISOString().split('T')[0];

    offerModal.classList.add('open');
    offerModal.setAttribute('aria-hidden', 'false');
    offerPriceInput.focus();
  }

  function closeOfferModal() {
    offerModal.classList.remove('open');
    offerModal.setAttribute('aria-hidden', 'true');
    makeOfferForm.reset();
  }

  function handleOfferSubmit(e) {
    e.preventDefault();

    const price = parseFloat(offerPriceInput.value);
    const quantity = parseInt(offerQuantityInput.value, 10);
    const deliveryDate = offerDeliveryDateInput.value;

    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price per kg.');
      offerPriceInput.focus();
      return;
    }

    if (isNaN(quantity) || quantity <= 0) {
      alert('Please enter a valid quantity in quintals.');
      offerQuantityInput.focus();
      return;
    }

    if (!deliveryDate) {
      alert('Please select a target delivery date.');
      offerDeliveryDateInput.focus();
      return;
    }

    const newOffer = {
      id: 'off-' + Date.now(),
      crop: selectedLotForOffer.crop,
      priceOffered: price,
      quantity: quantity,
      status: 'Pending',
      deliveryDate: deliveryDate
    };

    currentOffers.unshift(newOffer);
    saveOffers();
    updateDashboardCounts();

    closeOfferModal();
    showToast(`Offer of ₹${price.toFixed(2)}/kg for ${selectedLotForOffer.crop} submitted!`);
    navigateToPage('my-offers');
  }

  // --- Security: HTML Escaping Helper ---
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Event Listeners Setup ---
  function initEventListeners() {
    // 1. Notification Dropdown Toggle
    if (notificationBtn && notificationsDropdown) {
      notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown(notificationsDropdown, notificationBtn);
      });
    }

    if (markAllReadBtn) {
      markAllReadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        markAllNotificationsAsRead();
      });
    }

    // 2. Profile Dropdown Toggle
    if (profileTriggerBtn && profileDropdown) {
      profileTriggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown(profileDropdown, profileTriggerBtn);
      });
    }

    // 3. Edit Profile Triggers
    if (openEditProfileBtn) {
      openEditProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditProfileModal();
      });
    }

    if (closeEditProfileBtn) closeEditProfileBtn.addEventListener('click', closeEditProfileModal);
    if (cancelEditProfileBtn) cancelEditProfileBtn.addEventListener('click', closeEditProfileModal);

    if (editProfileModal) {
      editProfileModal.addEventListener('click', (e) => {
        if (e.target === editProfileModal) {
          closeEditProfileModal();
        }
      });
    }

    if (editProfileForm) {
      editProfileForm.addEventListener('submit', handleProfileSubmit);
    }

    // 4. Payment Modal Triggers
    if (closePayModalBtn) closePayModalBtn.addEventListener('click', closePayModal);
    if (cancelPayBtn) cancelPayBtn.addEventListener('click', closePayModal);

    if (payModal) {
      payModal.addEventListener('click', (e) => {
        if (e.target === payModal) {
          closePayModal();
        }
      });
    }

    if (confirmPayBtn) {
      confirmPayBtn.addEventListener('click', handleConfirmPayment);
    }

    // 5. Profile Logout Trigger
    if (profileLogoutLink) {
      profileLogoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeAllDropdowns();
        if (confirm('Are you sure you want to sign out of KisanMitra?')) {
          showToast('Signed out. Session closed securely.');
        }
      });
    }

    // 6. Global Click Outside to Close Dropdowns
    document.addEventListener('click', (e) => {
      const isInsideNotif = notificationsDropdown && notificationsDropdown.contains(e.target);
      const isNotifBtn = notificationBtn && notificationBtn.contains(e.target);
      const isInsideProfile = profileDropdown && profileDropdown.contains(e.target);
      const isProfileBtn = profileTriggerBtn && profileTriggerBtn.contains(e.target);

      if (!isInsideNotif && !isNotifBtn && !isInsideProfile && !isProfileBtn) {
        closeAllDropdowns();
      }
    });

    // 7. Navigation items
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.getAttribute('data-page');
        if (page) navigateToPage(page);
      });
    });

    // Dashboard quick link
    if (btnBrowseDirect) {
      btnBrowseDirect.addEventListener('click', () => {
        navigateToPage('browse-lots');
      });
    }

    // Crop Search Input
    if (cropSearchInput) {
      cropSearchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        if (clearSearchBtn) {
          clearSearchBtn.style.display = val.length > 0 ? 'block' : 'none';
        }
        renderLotsTable(val);
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        cropSearchInput.value = '';
        clearSearchBtn.style.display = 'none';
        renderLotsTable('');
        cropSearchInput.focus();
      });
    }

    if (resetSearchBtn) {
      resetSearchBtn.addEventListener('click', () => {
        cropSearchInput.value = '';
        if (clearSearchBtn) clearSearchBtn.style.display = 'none';
        renderLotsTable('');
      });
    }

    // Offers page new offer
    if (btnNewOfferNav) {
      btnNewOfferNav.addEventListener('click', () => {
        openOfferModal(currentLots[0]);
      });
    }

    if (browseLotsEmptyBtn) {
      browseLotsEmptyBtn.addEventListener('click', () => {
        navigateToPage('browse-lots');
      });
    }

    // Offer modal close triggers
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeOfferModal);
    if (cancelOfferBtn) cancelOfferBtn.addEventListener('click', closeOfferModal);

    if (offerModal) {
      offerModal.addEventListener('click', (e) => {
        if (e.target === offerModal) {
          closeOfferModal();
        }
      });
    }

    // Keydown ESC to close modals or dropdowns
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (payModal && payModal.classList.contains('open')) {
          closePayModal();
        } else if (offerModal && offerModal.classList.contains('open')) {
          closeOfferModal();
        } else if (editProfileModal && editProfileModal.classList.contains('open')) {
          closeEditProfileModal();
        } else {
          closeAllDropdowns();
        }
      }
    });

    // Form submission
    if (makeOfferForm) {
      makeOfferForm.addEventListener('submit', handleOfferSubmit);
    }

    // Sidebar Logout Link
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeAllDropdowns();
        if (confirm('Are you sure you want to sign out of KisanMitra?')) {
          showToast('Signed out. Session closed securely.');
        }
      });
    }
  }

  // --- Initial Boot ---
  function init() {
    initEventListeners();
    renderProfile();
    renderNotifications();
    updateDashboardCounts();
    renderLotsTable();
    renderOffersTable();
    renderPaymentsTable();

    const savedPage = localStorage.getItem(STORAGE_KEY_ACTIVE_PAGE) || 'dashboard';
    navigateToPage(savedPage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
