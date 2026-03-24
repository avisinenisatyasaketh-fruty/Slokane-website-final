# SlokaNE Website v3.0

> React 18 · Tailwind CSS · Vite · Express · **MySQL** · JWT Auth · Orders + SMS

---

## 🚀 What's New in v3.0

- ✅ **Order System** — Users can place orders for any product
- ✅ **SMS Notifications** — Customers get SMS on order placed, shipped, delivered
- ✅ **Order Tracking** — Unique tracking ID per order
- ✅ **My Account Panel** — Slide-in panel after login showing orders + profile
- ✅ **User Dropdown** — Click avatar in navbar to see account menu or logout
- ✅ **My Orders Tab** — View all orders with status badges
- ✅ **Cancel Order** — Cancel pending/confirmed orders from My Account
- ✅ **Profile Edit** — Update name and phone number from account panel

---

## ⚡ Quick Start

### Step 1 — MySQL Database

**In MySQL Workbench:** File → Open SQL Script → `backend/schema.sql` → Execute All

Or CLI:
```
mysql -u root -p < backend/schema.sql
```

### Step 2 — Configure .env

Edit `backend/.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=slokane_db
JWT_SECRET=slokane-super-secret-jwt-key-2026
ADMIN_KEY=slokane-admin-2026
FAST2SMS_KEY=         ← Get free key from fast2sms.com (optional)
PORT=3001
```

### Step 3 — Run (Windows)

**Double-click `START.bat`** — installs everything and starts both servers.

Or manually (two terminals):
```
cd backend   → npm install → npm run dev   (port 3001)
cd frontend  → npm install → npm run dev   (port 5173)
```

Open **http://localhost:5173**

---

## 📱 SMS Setup (Optional but Recommended)

1. Go to **https://www.fast2sms.com** → Sign Up free
2. Dashboard → Dev API → Copy your API key
3. Paste in `backend/.env`:  `FAST2SMS_KEY=your_key_here`
4. Restart backend

SMS is sent automatically when:
- Order is placed by customer
- Admin changes order status to: confirmed / shipped / delivered / cancelled

---

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `users` | Registered accounts (bcrypt passwords + phone) |
| `orders` | Product orders with delivery details + tracking |
| `contacts` | Contact form submissions |
| `subscribers` | Product launch notification emails |

---

## 🔌 API Reference

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/signup` | Register (name, email, phone, password) |
| POST | `/api/auth/signin` | Login → JWT token |
| GET  | `/api/auth/me` | Get profile (Bearer token) |
| PUT  | `/api/auth/profile` | Update name/phone (Bearer token) |

### Orders (Bearer token required)
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/orders` | Place new order → saves to MySQL + sends SMS |
| GET  | `/api/orders/my` | Get all my orders |
| GET  | `/api/orders/:id` | Get single order |
| PATCH | `/api/orders/:id/cancel` | Cancel order |

### Contact
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/contact` | Contact form submission |
| POST | `/api/contact/subscribe` | Product notification subscription |

### Admin (Header: `x-api-key: slokane-admin-2026`)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/admin/stats` | Full dashboard stats |
| GET | `/api/admin/orders` | All orders |
| PATCH | `/api/admin/orders/:id/status` | Update order status + SMS |
| GET | `/api/admin/contacts` | All contacts |
| GET | `/api/admin/users` | All users |
| GET | `/api/admin/subscribers` | All subscribers |

---

## 🖥️ View Database

```bash
cd backend

node view-db.js                    # summary with revenue
node view-db.js orders             # all orders
node view-db.js orders pending     # only pending orders
node view-db.js users              # all registered users
node view-db.js contacts           # all messages
node view-db.js subscribers        # all subscribers
```

---

## 📁 Project Structure

```
slokane-website/
├── START.bat                 ← Windows quick start
├── backend/
│   ├── server.js
│   ├── db.js                 ← MySQL connection pool
│   ├── schema.sql            ← Run once to create DB + tables
│   ├── .env                  ← Your credentials here
│   ├── view-db.js            ← CLI database viewer
│   └── routes/
│       ├── auth.js           ← Signup, signin, profile
│       ├── orders.js         ← Orders + SMS notifications
│       ├── contact.js        ← Contact form + subscribe
│       └── admin.js          ← Admin panel API
└── frontend/
    └── src/
        ├── App.jsx           ← Auth context, global state
        ├── components/
        │   ├── Navbar.jsx    ← User dropdown, logout
        │   ├── OrderModal.jsx ← Place order form
        │   ├── SignInModal.jsx ← Auth modal
        │   └── ...
        └── sections/
            ├── Products.jsx  ← Product cards + Order Now button
            ├── AccountPanel.jsx ← My Orders + Profile + Logout
            └── ...
```

---

© 2026 SlokaNE · Consultancy · SCM · Manufacturing · Made with ❤️ in India 🇮🇳
