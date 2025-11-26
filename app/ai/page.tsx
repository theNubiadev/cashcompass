"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Lightbulb,
  AlertCircle,
  TrendingDown,
  Target,
  Zap,
  Send,
  Sparkles,
  PieChart,
} from "lucide-react";
import { toast, Toaster } from "sonner";

type Insights = {
  summary: string;
  recommendations: string[];
  anomalies: string[];
  categoryBreakdown: Record<string, number>;
  topCategory: string;
  savings: string;
};

type Message = {
  id: string;
  type: "user" | "ai";
  content: string;
};

export default function AIInsights() {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const res = await fetch("/api/ai/insights", { credentials: "same-origin" });
      if (res.ok) {
        const data = await res.json();
        setInsights(data.insights);

        // Add initial AI message
        setMessages([
          {
            id: "1",
            type: "ai",
            content: data.insights.summary,
          },
        ]);
      } else {
        toast.error("Failed to load AI insights");
      }
    } catch (error) {
      console.error("Error fetching insights:", error);
      toast.error("Error loading insights");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !insights) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsSending(true);

    // Simulate AI response based on user query
    const query = inputValue.toLowerCase();
    let aiResponse = "";

    if (
      query.includes("spend") ||
      query.includes("category") ||
      query.includes("highest")
    ) {
      const breakdown = Object.entries(insights.categoryBreakdown)
        .map(([cat, amount]) => `• ${cat}: $${amount.toFixed(2)}`)
        .join("\n");
      aiResponse = `Here's your spending breakdown:\n\n${breakdown}\n\nYour highest spending is on ${insights.topCategory}. Would you like tips on reducing this category?`;
    } else if (query.includes("save") || query.includes("reduce")) {
      aiResponse = `Great question! Here are ways to save more:\n\n1. Cut discretionary spending (Entertainment, Shopping) by 10-15%\n2. Review subscriptions you might not be using\n3. Set category-specific budgets to track yourself\n4. Plan meals to reduce food spending\n\nYou could potentially save ${insights.savings} per month!`;
    } else if (query.includes("budget")) {
      aiResponse = `Your budgeting performance looks good! Focus on:\n\n✓ Tracking all expenses consistently\n✓ Reviewing your budget weekly\n✓ Adjusting categories that exceed limits\n✓ Setting savings goals\n\nWould you like help adjusting your current budget?`;
    } else if (query.includes("alert") || query.includes("anomal")) {
      if (insights.anomalies.length > 0) {
        aiResponse = `I've detected some unusual spending patterns:\n\n${insights.anomalies
          .join("\n\n")}\n\nWould you like to investigate any of these transactions?`;
      } else {
        aiResponse = `Your spending looks consistent! No major anomalies detected. Keep up the good budgeting habits! 📈`;
      }
    } else {
      aiResponse = `I can help you with:\n\n• Spending analysis by category\n• Tips to reduce expenses\n• Budget recommendations\n• Identifying unusual spending patterns\n\nFeel free to ask about any of these topics!`;
    }

    // Simulate network delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: aiResponse,
        },
      ]);
      setIsSending(false);
    }, 800);
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Loading AI insights...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <Toaster position="top-right" richColors closeButton />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 md:ml-64">
        <div className="container mx-auto p-4 md:p-6 space-y-6 pt-24 md:pt-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-linear-to-r from-emerald-500 to-teal-500 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                AI Spending Assistant
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Personalized insights powered by intelligent analysis
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Insights Cards */}
            <div className="lg:col-span-2 space-y-6">
              {insights && (
                <>
                  {/* Summary Card */}
                  <Card className="border-emerald-200 dark:border-emerald-800 bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-emerald-600" />
                        AI Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {insights.summary}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        Smart Recommendations
                      </CardTitle>
                      <CardDescription>
                        AI-powered tips to optimize your spending
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {insights.recommendations.map((rec, idx) => (
                          <div key={idx} className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Target className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-700 dark:text-gray-300">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Anomalies */}
                  {insights.anomalies.length > 0 && (
                    <Card className="border-orange-200 dark:border-orange-800">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                          Unusual Spending Detected
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {insights.anomalies.map((anomaly, idx) => (
                            <div key={idx} className="flex gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                              <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                              <p className="text-sm text-gray-700 dark:text-gray-300">{anomaly}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Potential Savings */}
                  <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingDown className="h-5 w-5 text-green-600" />
                        Potential Monthly Savings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-green-600">
                        {insights.savings}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        By optimizing your discretionary spending categories
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Category Breakdown & Chat */}
            <div className="space-y-6">
              {/* Category Breakdown */}
              {insights && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-purple-600" />
                      Spending by Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(insights.categoryBreakdown)
                        .sort(([, a], [, b]) => b - a)
                        .map(([category, amount]) => (
                          <div key={category}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                {category}
                              </span>
                              <span className="font-bold text-gray-900 dark:text-white">
                                ${amount.toFixed(2)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-emerald-600 h-2 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    (amount /
                                      Math.max(
                                        ...Object.values(insights.categoryBreakdown)
                                      )) *
                                      100,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Chat */}
              <Card className="flex flex-col h-[500px]">
                <CardHeader className="pb-4 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Ask AI Assistant
                  </CardTitle>
                  <CardDescription>Ask questions about your spending</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.type === "user"
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isSending && (
                    <div className="flex justify-start">
                      <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>

                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask about your spending..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      disabled={isSending}
                      className="text-sm"
                    />
                    <Button
                      type="submit"
                      disabled={isSending || !inputValue.trim()}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
