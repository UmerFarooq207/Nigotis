"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Phone,
  MessageSquare,
  Mail,
  FacebookIcon,
  InstagramIcon,
  Send,
  MapPin,
  Clock,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Link from "next/link";
import { fetchCustom } from "@/lib/utils";

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "First name is required",
      });
      return false;
    }
    if (!formData.email.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Email is required",
      });
      return false;
    }
    if (!formData.message.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Message is required",
      });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid email address",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetchCustom("/contact", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success!",
          description: "Your message has been sent successfully.",
        });

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          countryCode: "+971",
          message: "",
        });
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    }
    setIsLoading(false);
  };

  return (
    <main className="w-full">
      {/* ── Hero Header ── */}
      <section
        className="pt-32 pb-16 px-4 lg:px-[70px] xl:px-20 2xl:px-24 text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom right, #245985 -40%, #ffffff 45%, #245985 105%)",
        }}
      >
        {/* Decorative rings */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-15vw] left-1/2 -translate-x-1/2 z-0"
        >
          {[40, 70, 100].map((size) => (
            <div
              key={size}
              className="absolute rounded-full border border-white/10"
              style={{
                width: `${size}vw`,
                height: `${size}vw`,
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#003B6D]/10 border border-[#003B6D]/25 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#26B9B3] animate-pulse" />
            <span className="text-[#003B6D] font-bold tracking-widest text-xs uppercase">
              Get in Touch
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] text-gray-900 tracking-tight">
            We&apos;d love to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#003B6D] to-[#26B9B3]">
              hear from you
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg mx-auto">
            Have a question, feedback, or need help with Nigotis? Our team is
            here for you.
          </p>
        </div>
      </section>

      {/* ── Contact Content ── */}
      <section className="py-16 px-4 lg:px-[70px] xl:px-20 2xl:px-24 bg-slate-50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8">
          {/* ── Left: Form Card (3 cols) ── */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Send us a message
              </h2>
              <p className="text-sm text-gray-500">
                Fill out the form below and we&apos;ll get back to you as soon
                as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-gray-700"
                  >
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Your first name"
                    className="rounded-xl border-gray-200 focus:border-[#26B9B3] focus:ring-[#26B9B3]/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Your last name"
                    className="rounded-xl border-gray-200 focus:border-[#26B9B3] focus:ring-[#26B9B3]/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email <span className="text-red-400">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="rounded-xl border-gray-200 focus:border-[#26B9B3] focus:ring-[#26B9B3]/20"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <PhoneInput
                  className="w-full bg-gray-200 disabled:opacity-65"
                  value={formData?.phone}
                  onChange={(phone) => {
                    setFormData((prev) => {
                      return {
                        ...prev,
                        phone: phone,
                      };
                    });
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-gray-700"
                >
                  Message <span className="text-red-400">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help..."
                  className="min-h-[130px] rounded-xl border-gray-200 focus:border-[#26B9B3] focus:ring-[#26B9B3]/20 resize-none"
                />
              </div>

              <Button
                disabled={isLoading}
                type="submit"
                className="w-full bg-gradient-to-r from-[#003B6D] to-[#26B9B3] hover:opacity-90 text-white rounded-xl py-3 font-semibold transition-opacity"
              >
                {isLoading ? (
                  "Sending..."
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* ── Right: Contact Info (2 cols) ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info card */}
            <div className="bg-[#003B6D] text-white rounded-2xl p-7 space-y-5">
              <h2 className="text-lg font-bold">
                We&apos;re always here to help
              </h2>

              <div className="space-y-3">
                {[
                  {
                    icon: Phone,
                    label: "Hotline",
                    value: "+971 56 963 6926",
                    href: "tel:+971569636926",
                  },
                  {
                    icon: MessageSquare,
                    label: "WhatsApp",
                    value: "+971 56 963 6926",
                    href: "https://wa.me/+971569636926",
                    external: true,
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    value: "raqqamiyya@gmail.com",
                    href: "mailto:raqqamiyya@gmail.com",
                  },
                ].map(({ icon: Icon, label, value, href, external }) => (
                  <a
                    key={label}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3 bg-white/10 hover:bg-white/15 p-4 rounded-xl transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#26B9B3]/20 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-[#26B9B3]" />
                    </div>
                    <div>
                      <div className="text-xs text-white/50 font-medium uppercase tracking-wide">
                        {label}
                      </div>
                      <div className="text-sm font-medium group-hover:text-[#26B9B3] transition-colors">
                        {value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Social links */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-sm font-medium mb-3 text-white/70">
                  Follow us
                </h3>
                <div className="flex gap-3">
                  {[
                    {
                      icon: FacebookIcon,
                      href: "https://www.facebook.com/share/1FJcikzvp5",
                      label: "Facebook",
                    },
                    {
                      icon: InstagramIcon,
                      href: "https://www.instagram.com/nigotis.ai",
                      label: "Instagram",
                    },
                  ].map(({ icon: Icon, href, label }) => (
                    <Link
                      key={label}
                      target="_blank"
                      href={href}
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick-info pills */}
            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  icon: Clock,
                  title: "Fast Response",
                  desc: "We typically reply within a few hours during business days.",
                },
                {
                  icon: MapPin,
                  title: "Global Support",
                  desc: "Serving businesses in 15+ countries across the globe.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#003B6D] to-[#26B9B3] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed mt-0.5">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
