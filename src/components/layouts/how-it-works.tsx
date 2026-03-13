"use client";
import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Users,
  Briefcase,
  Search,
  FileText,
  MapPin,
  Zap,
  Bell,
  Send,
  UserCheck,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Shield,
  Star,
  DollarSign,
  Award,
  HelpCircle,
  MousePointer,
  Eye,
  ThumbsUp,
  Calendar,
  CreditCard,
  Lock,
} from "lucide-react";

const HowItWorksPage = () => {
  const [activeRole, setActiveRole] = useState<"client" | "provider">("client");

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              How Our Platform Works
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Complete guide to connecting clients with service providers
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setActiveRole("client")}
                className={`px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  activeRole === "client"
                    ? "bg-white text-blue-600 shadow-xl"
                    : "bg-blue-700 text-white hover:bg-blue-800"
                }`}
              >
                <Users className="w-5 h-5" />
                I&apos;m a Client
              </button>
              <button
                onClick={() => setActiveRole("provider")}
                className={`px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  activeRole === "provider"
                    ? "bg-white text-blue-600 shadow-xl"
                    : "bg-blue-700 text-white hover:bg-blue-800"
                }`}
              >
                <Briefcase className="w-5 h-5" />
                I&apos;m a Provider
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        {activeRole === "client" ? <ClientGuide /> : <ProviderGuide />}
      </div>

      {/* FAQ Section */}
      <FAQSection role={activeRole} />

      {/* CTA Section */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white py-16 mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {activeRole === "client"
              ? "Post your first task or browse available services"
              : "Create your profile and start earning today"}
          </p>
          <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-xl">
            {activeRole === "client" ? "Post a Task Now" : "Become a Provider"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Client Guide Component
const ClientGuide = () => {
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);

  return (
    <div className="space-y-12">
      {/* Introduction */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Getting Started as a Client
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Our platform offers you two convenient ways to find and hire service
          providers. Whether you prefer browsing available services or posting
          your specific task, we&apos;ve made it simple and secure.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-gray-900 dark:text-white">
              Verified Providers
            </span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
            <span className="font-semibold text-gray-900 dark:text-white">
              Secure Payments
            </span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <span className="font-semibold text-gray-900 dark:text-white">
              Quality Assured
            </span>
          </div>
        </div>
      </section>

      {/* Step 1: Registration */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4 mb-6">
          <div className="shrink-0 w-12 h-12 bg-linear-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            1
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Register & Create Your Profile
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start by creating your account and setting up your profile
            </p>
          </div>
        </div>

        <div className="space-y-4 ml-16">
          <ProcessStep
            icon={<UserCheck className="w-5 h-5" />}
            title="Sign Up"
            description="Create your account with email or social login"
            color="bg-blue-50 dark:bg-blue-900/20"
          />
          <ProcessStep
            icon={<FileText className="w-5 h-5" />}
            title="Complete Profile"
            description="Add your personal details and contact information"
            color="bg-purple-50 dark:bg-purple-900/20"
          />
          <ProcessStep
            icon={<MapPin className="w-5 h-5" />}
            title="Set Your Location"
            description="Add your Ghana Post GPS address for accurate matching"
            color="bg-green-50 dark:bg-green-900/20"
          />
          <ProcessStep
            icon={<CheckCircle className="w-5 h-5" />}
            title="Verify Account"
            description="Verify your email and phone number for security"
            color="bg-amber-50 dark:bg-amber-900/20"
          />
        </div>
      </section>

      {/* Step 2: Two Methods */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            2
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Choose Your Preferred Method
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Two flexible ways to find the perfect service provider
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 ml-16">
          {/* Method 1: Browse Services */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500 rounded-xl">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                Method 1: Browse Services
              </h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Perfect when you know exactly what service you need
            </p>

            <button
              onClick={() =>
                setExpandedMethod(expandedMethod === "browse" ? null : "browse")
              }
              className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="font-semibold text-gray-900 dark:text-white">
                View Process
              </span>
              {expandedMethod === "browse" ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>

            {expandedMethod === "browse" && (
              <div className="mt-4 space-y-3">
                <DetailStep number="1" text="Browse service categories" />
                <DetailStep number="2" text="Select the service you need" />
                <DetailStep
                  number="3"
                  text="View all providers offering that service"
                />
                <DetailStep
                  number="4"
                  text="Compare profiles, ratings, and prices"
                />
                <DetailStep number="5" text="Request your chosen provider" />
                <DetailStep number="6" text="Wait for provider to accept" />
                <DetailStep
                  number="7"
                  text="Task becomes a confirmed booking"
                />
              </div>
            )}
          </div>

          {/* Method 2: Post Task */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                Method 2: Post a Task
              </h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Let our AI find the best providers for you automatically
            </p>

            <button
              onClick={() =>
                setExpandedMethod(expandedMethod === "post" ? null : "post")
              }
              className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="font-semibold text-gray-900 dark:text-white">
                View Process
              </span>
              {expandedMethod === "post" ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>

            {expandedMethod === "post" && (
              <div className="mt-4 space-y-3">
                <DetailStep number="1" text="Describe your task in detail" />
                <DetailStep number="2" text="Set your budget and timeline" />
                <DetailStep
                  number="3"
                  text="Our AI matches you with providers"
                />
                <DetailStep number="4" text="Review matched providers list" />
                <DetailStep number="5" text="Request your preferred provider" />
                <DetailStep number="6" text="Provider accepts your request" />
                <DetailStep number="7" text="Task converts to booking" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Step 3: Understanding Matching */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            3
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              How Matching Works
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Understanding the matching process and floating tasks
            </p>
          </div>
        </div>

        <div className="ml-16 space-y-6">
          {/* Matched Tasks */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3 mb-4">
              <Zap className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  When Providers Are Matched
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Our AI analyzes your task and finds providers who:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Are located in your area
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Offer the exact service you need
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Match your budget requirements
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Are available during your timeframe
                    </span>
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    ✅ You&apos;ll see a list of matched providers to choose
                    from
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Tasks */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  When No Providers Are Matched (Floating Tasks)
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Don&apos;t worry! Your task automatically becomes a
                  &quot;floating task&quot;:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Visible to ALL providers in your location
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Providers can express interest in your task
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      You get notified when providers show interest
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MousePointer className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      You can request any interested provider
                    </span>
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    💡 This ensures you always find someone to help, even for
                    unique tasks
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 4: Request & Complete */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            4
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Request Provider & Complete Task
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Final steps to get your task completed
            </p>
          </div>
        </div>

        <div className="space-y-4 ml-16">
          <ProcessStep
            icon={<Send className="w-5 h-5" />}
            title="Request Provider"
            description="Select and request your chosen provider from matched or interested list"
            color="bg-blue-50 dark:bg-blue-900/20"
          />
          <ProcessStep
            icon={<CheckCircle className="w-5 h-5" />}
            title="Provider Accepts"
            description="Wait for provider to accept your request (usually within hours)"
            color="bg-purple-50 dark:bg-purple-900/20"
          />
          <ProcessStep
            icon={<Calendar className="w-5 h-5" />}
            title="Task Converts to Booking"
            description="Once accepted, your task becomes a confirmed booking"
            color="bg-green-50 dark:bg-green-900/20"
          />
          <ProcessStep
            icon={<MessageSquare className="w-5 h-5" />}
            title="Communicate & Track"
            description="Chat with provider, track progress, and manage timeline"
            color="bg-amber-50 dark:bg-amber-900/20"
          />
          <ProcessStep
            icon={<CreditCard className="w-5 h-5" />}
            title="Complete & Pay"
            description="Once work is done, confirm completion and process payment"
            color="bg-indigo-50 dark:bg-indigo-900/20"
          />
          <ProcessStep
            icon={<Star className="w-5 h-5" />}
            title="Rate & Review"
            description="Leave a rating and review to help other clients"
            color="bg-pink-50 dark:bg-pink-900/20"
          />
        </div>
      </section>
    </div>
  );
};

// Provider Guide Component
const ProviderGuide = () => {
  return (
    <div className="space-y-12">
      {/* Introduction */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Getting Started as a Provider
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Join our platform to access thousands of clients looking for your
          services. Get matched to tasks automatically or discover floating
          opportunities in your area.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-gray-900 dark:text-white">
              Smart Matching
            </span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            <span className="font-semibold text-gray-900 dark:text-white">
              Grow Your Business
            </span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <span className="font-semibold text-gray-900 dark:text-white">
              Build Reputation
            </span>
          </div>
        </div>
      </section>

      {/* Step 1: Registration & Verification */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            1
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Register & Get Verified
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create your professional provider profile
            </p>
          </div>
        </div>

        <div className="space-y-4 ml-16">
          <ProcessStep
            icon={<UserCheck className="w-5 h-5" />}
            title="Create Account"
            description="Sign up with your email or social media"
            color="bg-blue-50 dark:bg-blue-900/20"
          />
          <ProcessStep
            icon={<Briefcase className="w-5 h-5" />}
            title="Complete Provider Profile"
            description="Add business details, services offered, and portfolio"
            color="bg-purple-50 dark:bg-purple-900/20"
          />
          <ProcessStep
            icon={<MapPin className="w-5 h-5" />}
            title="Set Service Area"
            description="Define your location and service coverage area"
            color="bg-green-50 dark:bg-green-900/20"
          />
          <ProcessStep
            icon={<FileText className="w-5 h-5" />}
            title="Upload Credentials"
            description="Add certifications, ID, and relevant documents"
            color="bg-amber-50 dark:bg-amber-900/20"
          />
          <ProcessStep
            icon={<Shield className="w-5 h-5" />}
            title="Get Verified"
            description="Our team reviews and verifies your profile (24-48 hours)"
            color="bg-indigo-50 dark:bg-indigo-900/20"
          />
        </div>
      </section>

      {/* Step 2: Getting Tasks */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            2
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Get Matched & Discover Tasks
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Two ways tasks come to you
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 ml-16">
          {/* Matched Tasks */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border-2 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-500 rounded-xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                Auto-Matched Tasks
              </h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our AI automatically matches you to relevant tasks based on:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  Your service offerings
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  Your location & coverage area
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  Your availability & schedule
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  Client&apos;s budget requirements
                </span>
              </li>
            </ul>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                ✅ You&apos;ll see these in your &quot;Matched Tasks&quot;
                section
              </p>
            </div>
          </div>

          {/* Floating Tasks */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500 rounded-xl">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                Floating Tasks
              </h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Tasks with no matched providers become floating tasks:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  Visible to all providers in the area
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Search className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  Browse by category & location
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ThumbsUp className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  Express interest in any task
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  Client gets notified of your interest
                </span>
              </li>
            </ul>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                💡 Great for expanding beyond your usual services
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: Express Interest */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            3
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Express Interest in Tasks
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Let clients know you&apos;re available and interested
            </p>
          </div>
        </div>

        <div className="ml-16 space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              How to Express Interest
            </h4>
            <div className="space-y-3">
              <DetailStep
                number="1"
                text="Browse floating tasks or matched tasks"
              />
              <DetailStep
                number="2"
                text="Review task details, budget, and timeline"
              />
              <DetailStep number="3" text="Click 'Express Interest' button" />
              <DetailStep
                number="4"
                text="Write a personalized message to the client"
              />
              <DetailStep number="5" text="Submit your interest" />
              <DetailStep
                number="6"
                text="Client receives notification about you"
              />
              <DetailStep number="7" text="Wait for client to request you" />
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Tips for Success
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Write a compelling, personalized message
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Highlight your relevant experience
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Be clear about your availability
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Respond quickly to build trust
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 4: Accept & Complete */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            4
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Accept Requests & Earn
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Complete tasks and build your reputation
            </p>
          </div>
        </div>

        <div className="space-y-4 ml-16">
          <ProcessStep
            icon={<Bell className="w-5 h-5" />}
            title="Receive Client Request"
            description="Get notified when a client requests you for their task"
            color="bg-blue-50 dark:bg-blue-900/20"
          />
          <ProcessStep
            icon={<CheckCircle className="w-5 h-5" />}
            title="Review & Accept"
            description="Review task details and accept the request if you're available"
            color="bg-purple-50 dark:bg-purple-900/20"
          />
          <ProcessStep
            icon={<Calendar className="w-5 h-5" />}
            title="Task Becomes Booking"
            description="Once you accept, the task converts to an active booking"
            color="bg-green-50 dark:bg-green-900/20"
          />
          <ProcessStep
            icon={<MessageSquare className="w-5 h-5" />}
            title="Coordinate with Client"
            description="Communicate details, confirm timeline, and clarify expectations"
            color="bg-amber-50 dark:bg-amber-900/20"
          />
          <ProcessStep
            icon={<TrendingUp className="w-5 h-5" />}
            title="Complete the Task"
            description="Deliver quality service according to the agreed terms"
            color="bg-indigo-50 dark:bg-indigo-900/20"
          />
          <ProcessStep
            icon={<DollarSign className="w-5 h-5" />}
            title="Get Paid"
            description="Receive secure payment after client confirms completion"
            color="bg-green-50 dark:bg-green-900/20"
          />
          <ProcessStep
            icon={<Star className="w-5 h-5" />}
            title="Earn Reviews"
            description="Build your reputation with 5-star ratings and reviews"
            color="bg-pink-50 dark:bg-pink-900/20"
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 md:p-12 border border-blue-200 dark:border-blue-800">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Provider Benefits
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BenefitCard
            icon={<Zap className="w-6 h-6" />}
            title="Smart Matching"
            description="Get automatically matched to relevant tasks in your area"
            color="bg-blue-500"
          />
          <BenefitCard
            icon={<Eye className="w-6 h-6" />}
            title="Discover Opportunities"
            description="Browse floating tasks and expand your service offerings"
            color="bg-purple-500"
          />
          <BenefitCard
            icon={<Shield className="w-6 h-6" />}
            title="Verified Platform"
            description="Work with verified clients on a trusted platform"
            color="bg-green-500"
          />
          <BenefitCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Secure Payments"
            description="Get paid on time with our secure payment system"
            color="bg-amber-500"
          />
          <BenefitCard
            icon={<Star className="w-6 h-6" />}
            title="Build Reputation"
            description="Earn ratings and reviews to attract more clients"
            color="bg-pink-500"
          />
          <BenefitCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Grow Business"
            description="Access thousands of clients and scale your business"
            color="bg-indigo-500"
          />
        </div>
      </section>
    </div>
  );
};

// FAQ Section Component
const FAQSection: React.FC<{ role: "client" | "provider" }> = ({ role }) => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const clientFAQs = [
    {
      question: "What happens if no providers are matched to my task?",
      answer:
        "Your task automatically becomes a 'floating task' that's visible to all providers in your location. Providers can then express interest, and you'll be notified to choose from those who showed interest.",
    },
    {
      question: "Can I request a specific provider I've worked with before?",
      answer:
        "Yes! You can browse services and request any provider directly, or if they're matched to your posted task, you can select them from the matched list.",
    },
    {
      question: "How long does it take to get matched?",
      answer:
        "Matching is instant! You'll see matched providers immediately after posting your task. If there are no matches, your task goes floating right away for providers to discover.",
    },
    {
      question:
        "What's the difference between browsing services and posting a task?",
      answer:
        "Browsing services lets you explore all providers offering specific services and request them directly. Posting a task uses our AI to automatically match you with the best providers based on your needs and location.",
    },
    {
      question: "Can I cancel a task after requesting a provider?",
      answer:
        "Yes, you can cancel before the provider accepts. Once accepted and converted to a booking, cancellation policies apply.",
    },
  ];

  const providerFAQs = [
    {
      question:
        "What's the difference between matched tasks and floating tasks?",
      answer:
        "Matched tasks are automatically assigned to you based on your profile, services, and location. Floating tasks are those with no automatic matches and are visible to all providers in the area to express interest.",
    },
    {
      question: "How do I get more matched tasks?",
      answer:
        "Keep your profile updated with accurate services, maintain high ratings, stay active on the platform, and ensure your location and availability are current.",
    },
    {
      question: "What happens after I express interest in a floating task?",
      answer:
        "The client receives a notification about your interest along with your message. They can then choose to request you or other interested providers. You'll be notified if they request you.",
    },
    {
      question: "Can I decline a client request?",
      answer:
        "Yes, but declining too many requests may affect your matching score. Only express interest or wait for matches if you're genuinely available.",
    },
    {
      question: "How quickly should I respond to tasks?",
      answer:
        "Faster response times improve your visibility and matching score. We recommend responding within a few hours for best results.",
    },
  ];

  const faqs = role === "client" ? clientFAQs : providerFAQs;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {role === "client"
              ? "Common questions from clients"
              : "Common questions from providers"}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedFAQ(expandedFAQ === index ? null : index)
                }
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                </div>
                {expandedFAQ === index ? (
                  <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                )}
              </button>
              {expandedFAQ === index && (
                <div className="px-6 pb-6">
                  <div className="ml-9 text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const ProcessStep: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}> = ({ icon, title, description, color }) => (
  <div
    className={`flex items-start gap-4 p-4 ${color} rounded-xl border border-gray-200 dark:border-gray-700`}
  >
    <div className="flex-shrink-0 mt-1">{icon}</div>
    <div>
      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
        {title}
      </h4>
      <p className="text-sm text-gray-700 dark:text-gray-300">{description}</p>
    </div>
  </div>
);

const DetailStep: React.FC<{ number: string; text: string }> = ({
  number,
  text,
}) => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
      {number}
    </div>
    <span className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
      {text}
    </span>
  </div>
);

const BenefitCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}> = ({ icon, title, description, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
    <div
      className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white mb-4`}
    >
      {icon}
    </div>
    <h4 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h4>
    <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

export default HowItWorksPage;
