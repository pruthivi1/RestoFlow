# RestoFlow 🍽️

> A fully functional, responsive, frontend-only Restaurant Management SaaS application.

RestoFlow is a robust, client-side web application designed to simulate a complete restaurant management system. It provides distinct views for various restaurant roles, ensuring a streamlined workflow from taking orders to kitchen preparation and final billing.

## 🚀 Features

- **Multi-Role Views**:
  - **Dashboard**: High-level real-time overview of the restaurant operations.
  - **Admin**: Overview of the entire system, metrics, and system configuration.
  - **Waiter**: Order taking, table management, and order status tracking.
  - **Kitchen**: Real-time display of incoming orders to be prepared.
  - **Billing**: Checkout, payment processing, and receipt generation.
- **Frontend-Only Architecture**: Fully functional without a backend server, making it fast and easy to deploy.
- **Local State Synchronization**: Utilizes `localStorage` to simulate real-time data synchronization across different views (useful when testing with multiple browser tabs/windows).
- **Advanced State Management**: Built with `Zustand` for predictable and efficient global state handling (orders, menus, history).
- **Modern UI/UX**:
  - Crafted with **Tailwind CSS** for a highly responsive, custom SaaS-style design.
  - Fluid page transitions and micro-interactions powered by **Framer Motion**.
- **SEO Optimized**: Metatags and proper structure are managed with `react-helmet-async`.

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **SEO**: [React Helmet Async](https://github.com/staylor/react-helmet-async)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone or download the repository.
   ```bash
   git clone <repository-url>
   ```
2. Navigate into the project root directory.
   ```bash
   cd restoflow
   ```
3. Install the required dependencies.
   ```bash
   npm install
   ```

### Running the Application

To start the Vite development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the port specified in your console) to view the application in your browser.

## 📱 Layouts & Responsive Design

The application emphasizes a beautiful, premium visual language. It leverages comprehensive responsive layouts to work seamlessly across mobile devices, tablets, and full desktop/laptop displays.

## 📄 License

This project is licensed under the MIT License.
