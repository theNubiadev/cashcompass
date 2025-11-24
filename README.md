# 💰 CashCompass

<div align="center">
  <h3>Navigate Your Financial Journey with Confidence</h3>
  <p>A smart expense tracking and budget management application that helps you take control of your finances</p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
  ![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=flat-square&logo=mongodb)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-blue?style=flat-square&logo=tailwindcss)
  ![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)
</div>

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🎯 Overview

**CashCompass** is a full-stack expense tracking application designed to solve the common problem of not knowing where your money goes. With intelligent budget alerts, visual analytics, and comprehensive tracking features, CashCompass empowers users to make informed financial decisions.

### The Problem
Most people struggle to track their spending effectively, leading to:
- Unexpected overspending
- Lack of financial awareness
- Difficulty saving money
- Budget planning challenges

### The Solution
CashCompass provides:
- **Real-time expense tracking** with instant categorization
- **Smart budget alerts** at 80% and 100% thresholds
- **Visual analytics** to identify spending patterns
- **Multi-category management** for detailed insights

---

## ✨ Features

### Core Features
- 🔐 **Secure Authentication** - User registration and login with NextAuth.js
- 💸 **Expense Management** - Add, edit, delete, and categorize expenses
- 📊 **Budget Tracking** - Set monthly budgets per category with progress visualization
- 🔔 **Smart Alerts** - Automatic notifications when approaching or exceeding budget limits
- 📈 **Analytics Dashboard** - Interactive charts showing spending trends and patterns
- 🎨 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Fully optimized for mobile, tablet, and desktop

### Advanced Features
- 🔍 **Filter & Search** - Find expenses by date range, category, or amount
- 📤 **Data Export** - Download expense reports in CSV format
- 🏷️ **Custom Categories** - Create personalized expense categories
- 💳 **Payment Methods** - Track spending across different payment sources
- 📅 **Calendar View** - Visualize expenses on a monthly calendar
- 🎯 **Spending Insights** - AI-powered recommendations based on spending patterns

---

## 🎬 Demo

### Live Demo
🔗 [https://cashcompass.vercel.app](https://cashcompass.vercel.app)

### Test Credentials
```
Email: demo@cashcompass.com
Password: Demo123!
```

### Demo Video
📹 [Watch Demo Video](https://youtu.be/your-demo-video)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Validation**: [Zod](https://zod.dev/)

### Database
- **Database**: [MongoDB](https://www.mongodb.com/)
- **ODM**: [Mongoose](https://mongoosejs.com/)

### Utilities
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Password Hashing**: bcryptjs
- **HTTP Client**: Fetch API

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- MongoDB instance (local or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/cashcompass.git
cd cashcompass
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```
Then edit `.env.local` with your credentials (see [Environment Variables](#environment-variables))

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cashcompass?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl

# Optional: Email Service (for alerts)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@cashcompass.com
```

### Generating NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

---

## 📁 Project Structure

```
cashcompass/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.js
│   │   ├── expenses/
│   │   │   ├── route.js
│   │   │   └── [id]/
│   │   │       └── route.js
│   │   ├── budgets/
│   │   │   ├── route.js
│   │   │   └── [id]/
│   │   │       └── route.js
│   │   └── categories/
│   │       └── route.js
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.js
│   │   └── register/
│   │       └── page.js
│   ├── dashboard/
│   │   └── page.js
│   ├── expenses/
│   │   └── page.js
│   ├── budgets/
│   │   └── page.js
│   ├── analytics/
│   │   └── page.js
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   ├── expenses/
│   │   ├── ExpenseForm.jsx
│   │   ├── ExpenseList.jsx
│   │   └── ExpenseCard.jsx
│   ├── budgets/
│   │   ├── BudgetForm.jsx
│   │   ├── BudgetCard.jsx
│   │   └── BudgetProgress.jsx
│   └── charts/
│       ├── ExpenseChart.jsx
│       ├── CategoryPieChart.jsx
│       └── TrendLineChart.jsx
├── lib/
│   ├── mongodb.js       # MongoDB connection
│   ├── auth.js          # Auth utilities
│   └── utils.js         # Helper functions
├── models/
│   ├── User.js
│   ├── Expense.js
│   ├── Budget.js
│   └── Category.js
├── hooks/
│   ├── useExpenses.js
│   ├── useBudgets.js
│   └── useAnalytics.js
├── public/
│   ├── images/
│   └── icons/
├── .env.local
├── .env.example
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 🔌 API Routes

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - User login
- `GET /api/auth/signout` - User logout

### Expenses
- `GET /api/expenses` - Get all expenses (with filters)
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/[id]` - Get single expense
- `PUT /api/expenses/[id]` - Update expense
- `DELETE /api/expenses/[id]` - Delete expense

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create new budget
- `GET /api/budgets/[id]` - Get single budget
- `PUT /api/budgets/[id]` - Update budget
- `DELETE /api/budgets/[id]` - Delete budget

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create custom category

### Analytics
- `GET /api/analytics/summary` - Get spending summary
- `GET /api/analytics/trends` - Get spending trends

---

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  currency: String (default: "USD"),
  createdAt: Date,
  updatedAt: Date
}
```

### Expense Model
```javascript
{
  userId: ObjectId (ref: User),
  amount: Number (required),
  category: String (required),
  description: String,
  date: Date (required),
  paymentMethod: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Budget Model
```javascript
{
  userId: ObjectId (ref: User),
  category: String (required),
  limit: Number (required),
  month: String (format: "YYYY-MM"),
  spent: Number (calculated),
  alertSent: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Category Model
```javascript
{
  name: String (required, unique),
  icon: String,
  color: String,
  isDefault: Boolean (default: false)
}
```

---

## 📸 Screenshots

### Dashboard
![Dashboard](./public/screenshots/dashboard.png)

### Expense Tracking
![Expenses](./public/screenshots/expenses.png)

### Budget Management
![Budgets](./public/screenshots/budgets.png)

### Analytics
![Analytics](./public/screenshots/analytics.png)

---

## 🗺️ Roadmap

### Phase 1: MVP ✅
- [x] User authentication
- [x] Basic expense CRUD
- [x] Budget setting and tracking
- [x] Simple alerts

### Phase 2: Enhancement 🚧
- [ ] Recurring expenses
- [ ] Receipt upload
- [ ] Advanced filtering
- [ ] Data export (PDF)

### Phase 3: Advanced Features 📋
- [ ] Multi-currency support
- [ ] Shared budgets (family/household)
- [ ] AI spending insights
- [ ] Bank account integration
- [ ] Mobile app (React Native)

### Phase 4: Monetization 💡
- [ ] Premium features
- [ ] Financial advisor integration
- [ ] Investment tracking

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Use ESLint and Prettier configurations
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Contact

**Your Name**
- Portfolio: [yourportfolio.com](https://yourportfolio.com)
- LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/thenubiadev)

**Project Link**: [https://github.com/thenubiadev/cashcompass](https://github.com/yourusername/cashcompass)

---

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Vercel](https://vercel.com) for hosting
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for database hosting
- Icons from [Lucide](https://lucide.dev/)

---

<div align="center">
  <p>Made with ❤️ by Ajaiyeoba John </p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
