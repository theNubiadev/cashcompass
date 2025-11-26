"use client";

import Link from "next/link";
import { Navigation } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  Zap,
  Crown,
  Sparkles,
  BarChart3,
  Users,
  FileText,
  Shield,
  Headphones,
  Compass,
} from "lucide-react";
import { useState } from "react";

const plans = [
  {
    id: "free",
    name: "Starter",
    price: 0,
    period: "forever",
    description: "Perfect for getting started with budget tracking",
    icon: Compass,
    color: "from-blue-500 to-cyan-500",
    badge: null,
    cta: "Get Started",
    features: [
      { name: "1 Budget", included: true },
      { name: "5 Expenses", included: true },
      { name: "Basic Analytics", included: true },
      { name: "Expense Categories", included: true },
      { name: "CSV Export", included: true },
      { name: "Dark Mode", included: true },
      { name: "Mobile Responsive", included: true },
      { name: "Community Support", included: true },
      { name: "Multiple Budgets", included: false },
      { name: "Advanced Analytics", included: false },
      { name: "AI Insights", included: false },
      { name: "Priority Support", included: false },
      { name: "Receipt Upload", included: false },
      { name: "Custom Reports", included: false },
    ],
  },
  {
    id: "medium",
    name: "Professional",
    price: 1500,
    period: "month",
    description: "For serious budget managers and small teams",
    icon: Zap,
    color: "from-purple-500 to-pink-500",
    badge: "Most Popular",
    cta: "Start Free Trial",
    features: [
      { name: "5 Budgets", included: true },
      { name: "100 Expenses", included: true },
      { name: "Advanced Analytics", included: true },
      { name: "Expense Categories", included: true },
      { name: "CSV & JSON Export", included: true },
      { name: "Dark Mode", included: true },
      { name: "Mobile Responsive", included: true },
      { name: "Email Support", included: true },
      { name: "AI Insights", included: true },
      { name: "Receipt Upload", included: true },
      { name: "Custom Reports", included: true },
      { name: "Priority Support", included: false },
      { name: "Team Collaboration", included: false },
      { name: "API Access", included: false },
    ],
  },
  {
    id: "premium",
    name: "Enterprise",
    price: 3000,
    period: "month",
    description: "For power users and professionals",
    icon: Crown,
    color: "from-yellow-500 to-orange-500",
    badge: "Best Value",
    cta: "Contact Sales",
    features: [
      { name: "10 Budgets", included: true },
      { name: "300 Expenses", included: true },
      { name: "Advanced Analytics", included: true },
      { name: "Expense Categories", included: true },
      { name: "CSV & JSON Export", included: true },
      { name: "Dark Mode", included: true },
      { name: "Mobile Responsive", included: true },
      { name: "24/7 Priority Support", included: true },
      { name: "AI Insights", included: true },
      { name: "Receipt Upload with OCR", included: true },
      { name: "Custom Reports", included: true },
      { name: "Team Collaboration (5 members)", included: true },
      { name: "API Access", included: true },
      { name: "Advanced Security", included: true },
    ],
  },
];

const additionalFeatures = [
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Get insights into your spending patterns with advanced charts and reports",
  },
  {
    icon: Sparkles,
    title: "AI Assistant",
    description: "Receive personalized recommendations to optimize your budget",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Your data is encrypted and secure with industry-standard protection",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Invite team members and manage budgets together (Pro & Enterprise)",
  },
  {
    icon: FileText,
    title: "Custom Reports",
    description: "Generate detailed reports tailored to your needs",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description: "Get help from our support team via email or chat",
  },
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState("medium");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const getDiscountedPrice = (price: number) => {
    if (billingCycle === "yearly") {
      return Math.floor(price * 12 * 0.8); // 20% discount for yearly
    }
    return price;
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
            <div className="text-center space-y-6">
              <div className="inline-block">
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-sm px-4 py-1.5">
                  <Zap className="w-3 h-3 mr-1 inline" />
                  Simple & Transparent Pricing
                </Badge>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
                  Plans Built for Every Budget
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Choose the perfect plan to manage your finances. Start free and upgrade whenever you need more.
                </p>
              </div>

              {/* Billing Toggle */}
              <div className="flex justify-center items-center gap-4 pt-4">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    billingCycle === "monthly"
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-6 py-2 rounded-lg font-medium transition-all relative ${
                    billingCycle === "yearly"
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  Yearly
                  <Badge className="absolute -top-3 -right-3 bg-red-500 text-white text-xs">
                    Save 20%
                  </Badge>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isSelected = selectedPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`relative transition-all duration-300 ${
                    isSelected ? "md:scale-105" : ""
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  <Card
                    className={`h-full flex flex-col transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? "border-emerald-500 dark:border-emerald-400 shadow-2xl"
                        : "border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-lg"
                    }`}
                  >
                    {/* Header */}
                    <CardHeader className="pb-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${plan.color}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        {isSelected && (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                            Selected
                          </Badge>
                        )}
                      </div>

                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        {plan.description}
                      </CardDescription>

                      {/* Pricing */}
                      <div className="mt-6 space-y-2">
                        {plan.price === 0 ? (
                          <div>
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">
                              Free
                            </span>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {plan.period}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                ₦{getDiscountedPrice(plan.price).toLocaleString()}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">
                                /{plan.period}
                              </span>
                            </div>
                            {billingCycle === "yearly" && (
                              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                                Save ₦{(plan.price * 12 * 0.2).toLocaleString()} per year
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* CTA Button */}
                      <Button
                        className={`w-full mt-6 transition-all ${
                          plan.id === "free"
                            ? "bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                            : isSelected
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                      >
                        {plan.cta}
                      </Button>
                    </CardHeader>

                    {/* Features */}
                    <CardContent className="flex-1">
                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                          What&apos;s included:
                        </p>
                        <ul className="space-y-3">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              {feature.included ? (
                                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              ) : (
                                <X className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                              )}
                              <span
                                className={`text-sm ${
                                  feature.included
                                    ? "text-gray-700 dark:text-gray-300 font-medium"
                                    : "text-gray-400 dark:text-gray-500 line-through"
                                }`}
                              >
                                {feature.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for All Plans
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              We keep improving with new features that help you manage your money better
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, idx) => {
              const FeatureIcon = feature.icon;
              return (
                <Card
                  key={idx}
                  className="border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-lg transition-all"
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 w-fit rounded-lg">
                        <FeatureIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "Can I change my plan anytime?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "Is there a free trial for paid plans?",
                a: "Yes! Start with a 14-day free trial on any paid plan. No credit card required.",
              },
              {
                q: "What happens if I exceed my limit?",
                a: "You'll receive a notification. You can continue using the app and upgrade anytime without losing data.",
              },
              {
                q: "Do you offer discounts for annual billing?",
                a: "Yes! Save 20% when you choose yearly billing instead of monthly.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, bank transfers, and digital wallets.",
              },
              {
                q: "Is my data secure?",
                a: "Absolutely! We use bank-level encryption (SSL/TLS) and comply with international data protection standards.",
              },
            ].map((faq, idx) => (
              <Card
                key={idx}
                className="border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900 dark:text-white">
                    {faq.q}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-lg text-emerald-100">
              Join thousands of users who are already managing their budgets smarter
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
                asChild
              >
                <Link href="/auth/signup">Get Started for Free</Link>
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold"
                asChild
              >
                <Link href="/dashboard">View Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
