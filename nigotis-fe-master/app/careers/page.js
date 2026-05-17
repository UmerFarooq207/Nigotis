"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ApplicationForm } from "@/components/CareerApplicationForm";
import {
  Heart,
  Store,
  Bot,
  TrendingUp,
  Globe,
  Send,
  Briefcase,
  Sparkles,
  Users,
} from "lucide-react";

/* ── existing positions data kept intact ── */
const positions = [
  {
    title: "Marketing Specialist",
    description:
      "We're looking for a creative and data-driven marketing specialist to join our team.",
    tags: ["Digital Marketing", "SEO", "Content Strategy"],
    id: "marketing-specialist",
    dept: "Marketing",
  },
];

const perks = [
  {
    icon: Heart,
    title: "Meaningful Work",
    desc: "Every feature you build directly helps small business owners run their businesses with less stress.",
    color: "bg-red-50 text-red-600 border-red-100",
  },
  {
    icon: Store,
    title: "Real Business Impact",
    desc: "Your work ships to thousands of business owners managing real orders, customers, and payments every day.",
    color: "bg-orange-50 text-orange-600 border-orange-100",
  },
  {
    icon: Bot,
    title: "AI-Driven Product",
    desc: "Work with modern AI, WhatsApp integrations, and automation technology that is genuinely useful.",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    icon: TrendingUp,
    title: "Growth-Focused Team",
    desc: "We move fast, share ownership, and invest in the people who help us grow.",
    color: "bg-green-50 text-green-600 border-green-100",
  },
  {
    icon: Globe,
    title: "Flexible Culture",
    desc: "We value results over hours. Work in a way that helps you do your best thinking.",
    color: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    icon: Sparkles,
    title: "Build Something Real",
    desc: "We build simple, practical tools for real businesses — not just demos or prototypes.",
    color: "bg-teal-50 text-teal-600 border-teal-100",
  },
];

export default function CareersPage() {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <main className="w-full">
      {/* ── Hero ── */}
      <section
        className="pt-32 pb-20 px-4 lg:px-[70px] xl:px-20 2xl:px-24 text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom right, #245985 -40%, #ffffff 45%, #245985 105%)",
        }}
      >
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#003B6D]/10 border border-[#003B6D]/25 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#26B9B3] animate-pulse" />
            <span className="text-[#003B6D] font-bold tracking-widest text-xs uppercase">
              Careers at Nigotis
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.1] text-gray-900 tracking-tight">
            Build the future of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#003B6D] to-[#26B9B3]">
              small business automation
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Join Nigotis and help small businesses manage accounting, orders,
            customers, invoices, payments, and daily tasks with WhatsApp&nbsp;+&nbsp;AI.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {["WhatsApp Integration", "AI Product", "Small Business Impact", "Flat Hierarchy"].map(
              (tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-[#003B6D] bg-[#003B6D]/8 border border-[#003B6D]/20 px-3 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── Why Work With Us ── */}
      <section className="py-20 px-4 lg:px-[70px] xl:px-20 2xl:px-24 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#26B9B3]">
              Why Nigotis
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Why work with us?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              We value flat hierarchies, clear communication, and full ownership.
              Here&apos;s what makes Nigotis a great place to grow.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-4"
              >
                <div
                  className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border ${color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 text-base">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Culture ── */}
      <section className="py-16 px-4 lg:px-[70px] xl:px-20 2xl:px-24 bg-[#003B6D] text-white">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <Users className="w-10 h-10 text-[#26B9B3] mx-auto" />
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            How we work
          </h2>
          <p className="text-white/75 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            We build simple, practical tools for real businesses. That means
            we keep our process lean, our communication clear, and our focus
            on things that actually help business owners. No unnecessary
            bureaucracy — just a team that cares about the work.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {[
              "Flat team structure",
              "Clear communication",
              "Full ownership",
              "Fast shipping",
              "Customer-first thinking",
            ].map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-white bg-white/10 border border-white/20 px-3 py-1.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Roles ── */}
      <section className="py-20 px-4 lg:px-[70px] xl:px-20 2xl:px-24 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#26B9B3]">
              Open Positions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Join our team
            </h2>
          </div>

          {positions.length > 0 ? (
            <div className="space-y-4">
              {positions.map((position) => (
                <div
                  key={position.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#26B9B3] shrink-0" />
                      <h3 className="font-bold text-gray-900 text-base">
                        {position.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500">{position.description}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {position.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-medium text-[#003B6D] bg-[#003B6D]/8 border border-[#003B6D]/15 px-2.5 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={() => setSelectedPosition(position.title)}
                    className="shrink-0 bg-[#003B6D] hover:bg-[#003B6D]/90 text-white rounded-xl"
                  >
                    Apply
                  </Button>
                </div>
              ))}
            </div>
          ) : null}

          {/* Always-visible "Send your profile" empty state / fallback */}
          <div className="mt-10 border border-dashed border-gray-300 rounded-2xl p-8 text-center space-y-4 bg-slate-50">
            <Send className="w-8 h-8 text-[#26B9B3] mx-auto" />
            <h3 className="text-lg font-bold text-gray-900">
              Don&apos;t see your role listed?
            </h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              We&apos;re always looking for talented, passionate people. Send us
              your profile and we&apos;ll reach out when the right opportunity comes up.
            </p>
            <a
              href="mailto:raqqamiyya@gmail.com"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#003B6D] to-[#26B9B3] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
              Send us your profile
            </a>
          </div>
        </div>
      </section>

      {/* ── Application Dialog (unchanged logic) ── */}
      <Dialog
        open={!!selectedPosition}
        onOpenChange={() => {
          setSelectedPosition(null);
          setShowSuccess(false);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          {showSuccess ? (
            <div className="p-6 text-center space-y-4">
              <h3 className="text-xl font-semibold">Application Received</h3>
              <p className="text-muted-foreground">
                Thank you for your interest! We have received your application
                and will get back to you soon.
              </p>
              <Button
                onClick={() => {
                  setSelectedPosition(null);
                  setShowSuccess(false);
                }}
              >
                Close
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Apply for {selectedPosition}</DialogTitle>
              </DialogHeader>
              <ApplicationForm
                position={selectedPosition}
                onClose={() => setSelectedPosition(null)}
                onSuccess={() => setShowSuccess(true)}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
