"use client";
import React, { useState } from "react";
import {
  FileText,
  Users,
  CheckCircle,
  Search,
  Send,
  UserCheck,
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  Star,
  Briefcase,
  MapPin,
  Bell,
  MousePointer,
  Zap,
  Award,
} from "lucide-react";

interface HowItWorksProps {
  userRole?: "client" | "provider" | "visitor";
}

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  details: string[];
  highlight?: string;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ userRole = "visitor" }) => {
  const [activeTab, setActiveTab] = useState<"client" | "provider">(
    userRole === "provider" ? "provider" : "client"
  );

  const clientSteps: Step[] = [
    {
      number: 1,
      title: "Register & Create Profile",
      description: "Join our platform and set up your account",
      icon: <UserCheck className="w-8 h-8" />,
      color: "from-red-500 to-pink-500",
      gradient:
        "from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20",
      details: [
        "Quick sign-up process",
        "Complete your profile",
        "Add your location",
        "Set preferences",
      ],
      highlight: "Takes 2 minutes",
    },
    {
      number: 2,
      title: "Choose Your Method",
      description: "Two ways to find the perfect provider",
      icon: <MousePointer className="w-8 h-8" />,
      color: "from-blue-500 to-purple-500",
      gradient:
        "from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20",
      details: [
        "Browse services by category",
        "Or post a task directly",
        "View provider profiles",
        "Compare ratings & prices",
      ],
      highlight: "Your choice, your way",
    },
    {
      number: 3,
      title: "Get Matched or Browse",
      description: "Smart matching or manual selection",
      icon: <Zap className="w-8 h-8" />,
      color: "from-indigo-500 to-blue-500",
      gradient:
        "from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20",
      details: [
        "Auto-matched to nearby providers",
        "View all matched providers",
        "No match? Task goes floating",
        "All nearby providers can see it",
      ],
      highlight: "Smart AI matching",
    },
    {
      number: 4,
      title: "Request & Complete",
      description: "Select provider and get your task done",
      icon: <CheckCircle className="w-8 h-8" />,
      color: "from-green-500 to-teal-500",
      gradient:
        "from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20",
      details: [
        "Request your chosen provider",
        "Track task progress",
        "Communicate directly",
        "Rate & review after completion",
      ],
      highlight: "Secure & protected",
    },
  ];

  const providerSteps: Step[] = [
    {
      number: 1,
      title: "Register & Verify",
      description: "Create your professional provider profile",
      icon: <UserCheck className="w-8 h-8" />,
      color: "from-blue-500 to-indigo-500",
      gradient:
        "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
      details: [
        "Complete registration",
        "Add your services",
        "Upload credentials",
        "Get verified quickly",
      ],
      highlight: "Verified in 24hrs",
    },
    {
      number: 2,
      title: "Get Matched or Discover",
      description: "Receive matches and browse floating tasks",
      icon: <Bell className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
      gradient:
        "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
      details: [
        "Auto-matched to relevant tasks",
        "View floating tasks in your area",
        "See task details & budgets",
        "Filter by category & location",
      ],
      highlight: "New tasks daily",
    },
    {
      number: 3,
      title: "Express Interest",
      description: "Show clients you're interested and available",
      icon: <Send className="w-8 h-8" />,
      color: "from-amber-500 to-orange-500",
      gradient:
        "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
      details: [
        "Express interest in tasks",
        "Send personalized message",
        "Client gets notified",
        "Wait for client to request you",
      ],
      highlight: "Stand out from crowd",
    },
    {
      number: 4,
      title: "Complete & Earn",
      description: "Deliver quality service and build reputation",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500",
      gradient:
        "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      details: [
        "Accept client requests",
        "Complete the task",
        "Get paid securely",
        "Earn 5-star ratings",
      ],
      highlight: "Build your brand",
    },
  ];

  const steps = activeTab === "client" ? clientSteps : providerSteps;

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Verified & Trusted",
      description: "Background-checked providers",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Smart Matching",
      description: "AI-powered task matching",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Secure Payments",
      description: "Protected transactions",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location-Based",
      description: "Find providers nearby",
      color: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {activeTab === "client"
              ? "Two easy ways to find and hire providers"
              : "Get matched to tasks or discover opportunities"}
          </p>
        </div>

        {/* Tab Switcher - Only show for visitors */}
        {userRole === "visitor" && (
          <div className="flex justify-center mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-200 dark:border-gray-700 inline-flex">
              <button
                onClick={() => setActiveTab("client")}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "client"
                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  For Clients
                </span>
              </button>
              <button
                onClick={() => setActiveTab("provider")}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "provider"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  For Providers
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Method Cards - Only for Clients */}
        {activeTab === "client" && (
          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                  <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    Method 1: Browse Services
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Explore services by category and request providers directly
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                  <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    Method 2: Post a Task
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Post your task and get auto-matched to nearby providers
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={step.number} className="group relative">
              {/* Connecting Line - Desktop Only */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700 dark:to-transparent z-0" />
              )}

              {/* Card */}
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full">
                {/* Step Number Badge */}
                <div
                  className={`absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg transform group-hover:scale-110 transition-transform`}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-700`}
                >
                  <div
                    className={`bg-gradient-to-br ${step.color} bg-clip-text text-transparent`}
                  >
                    {step.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  {step.description}
                </p>

                {/* Highlight Badge */}
                {step.highlight && (
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-gradient-to-r ${step.gradient} border border-gray-200 dark:border-gray-700`}
                  >
                    <span
                      className={`bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}
                    >
                      ⭐ {step.highlight}
                    </span>
                  </div>
                )}

                {/* Details List */}
                <ul className="space-y-2">
                  {step.details.map((detail, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Why Choose Our Platform?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div
                  className={`p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 mb-4 ${feature.color}`}
                >
                  {feature.icon}
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA to Full Guide */}
        <div className="mt-12 text-center">
          <a
            href="/how-it-works"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            <FileText className="w-5 h-5" />
            View Complete Guide
          </a>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
