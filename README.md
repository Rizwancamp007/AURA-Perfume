# 🌸 AURA — Luxury Handcrafted Perfumes & Custom Engravings

AURA is a high-end MERN-stack e-commerce web application featuring a bespoke editorial aesthetic, interactive 3D bottle engravers, custom particle engines, and a multi-step courier checkout.

---

## ✨ Features

* **3D Interactive Bottle Engraver**: Rotate the bottle in 3D (React Three Fiber) with real-time cursor tracking. Enter custom initials and choose elegant fonts to see them projected instantly onto the glass decal.
* **Volume Selector offsets**: Select from 30ml, 50ml, or 100ml sizes with dynamic price calculations and Redux compound-key cart storage.
* **Cinematic Video Integrations**: Custom slow-motion video backgrounds for the brand statement and embedded sensory films on detail pages.
* **Multi-Step Checkout**: Integrated wizard supporting EasyPaisa, JazzCash, NayaPay, and manual Bank Transfer (with payment slip upload).
* **Admin Dashboard**: Create and update scents, track orders, moderate reviews, and verify bank transfers.
* **Realtime Order Tracking**: Live courier status updates (Placed → Confirmed → Packed → Shipped → Delivered) driven by Socket.io.
* **Botanical Flora Theme**: Animated leaves, olive branches, and pastel baby's breath blossoms drifting on scroll.

---

## 🛠 Tech Stack

* **Frontend**: React.js, Vite, Redux Toolkit, React Three Fiber (Three.js), GSAP, Tailwind CSS, Lenis.
* **Backend**: Node.js, Express, MongoDB, Socket.io, Cloudinary, Nodemailer.

---

## 🚀 Installation & Local Setup

### 1. Prerequisites
Ensure you have Node.js and MongoDB installed locally, or create an online MongoDB Atlas cluster.

### 2. Server Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Configure the `.env` file with your credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   EMAIL_USER=your_nodemailer_email
   EMAIL_PASS=your_nodemailer_password
   ```
4. Seed the database with the core perfume listings:
   ```bash
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Client Setup
1. Navigate to the client folder:
   ```bash
   cd ../client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Boot the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

---

## 📜 License & Credits

Built with 🍵 and ❤️ by **Rizwan Khan**
