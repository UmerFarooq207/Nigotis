"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function PricingIncludeModal({ isOpen, onClose, data }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed left-[30vw] top-[30vh]  w-full max-w-xl bg-white rounded-lg shadow-xl z-50"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="p-6">
              <h1 className=" font-semibold text-xl">{data?.title}</h1>
              <p className=" font-semibold text-lg">{data?.tagline}</p>
              <div className=" pl-4">
                {data?.title &&
                  data?.points.map((point, index) => {
                    return (
                      <p key={index}>
                        {index + 1}. {point}
                      </p>
                    );
                  })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
