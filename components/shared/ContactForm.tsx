"use client";

import { useState, FormEvent } from "react";
import { ContactFormData } from "@/types";

interface ContactFormProps {
  mode: "terminal" | "gui";
  onSubmit: (data: ContactFormData) => Promise<{ success: boolean; message: string }>;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  message?: string;
}

/**
 * ContactForm component for both terminal and GUI modes
 * Implements real-time validation for name, email, and message fields
 * Requirements: 2.6, 5.2, 5.3
 */
export function ContactForm({ mode, onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Validate email format
   * Requirements: 5.2
   */
  const validateEmail = (email: string): boolean => {
    return emailRegex.test(email);
  };

  /**
   * Validate message is not empty or whitespace only
   * Requirements: 5.3
   */
  const validateMessage = (message: string): boolean => {
    return message.trim().length > 0;
  };

  /**
   * Real-time field validation
   */
  const validateField = (name: keyof ContactFormData, value: string): string | undefined => {
    switch (name) {
      case "name":
        if (!value.trim()) {
          return "Name is required";
        }
        break;
      case "email":
        if (!value.trim()) {
          return "Email is required";
        }
        if (!validateEmail(value)) {
          return "Please enter a valid email address";
        }
        break;
      case "message":
        if (!validateMessage(value)) {
          return "Message cannot be empty";
        }
        break;
    }
    return undefined;
  };

  /**
   * Handle input change with real-time validation
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    const error = validateField(name as keyof ContactFormData, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  /**
   * Validate all fields before submission
   */
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!validateMessage(formData.message)) {
      newErrors.message = "Message cannot be empty";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * Requirements: 5.1, 5.5
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const result = await onSubmit(formData);

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: result.message || "Message sent successfully!",
        });
        // Clear form on success (Requirement 5.5)
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Terminal mode styling
  const terminalStyles = {
    container: "space-y-3 font-mono text-sm sm:text-base",
    label: "text-green-400 text-sm sm:text-base",
    input:
      "w-full bg-transparent border border-green-500/30 rounded px-3 py-2 sm:px-2 sm:py-1 text-green-400 focus:outline-none focus:border-green-500 min-h-[44px] sm:min-h-0 text-base sm:text-sm touch-manipulation",
    textarea:
      "w-full bg-transparent border border-green-500/30 rounded px-3 py-2 sm:px-2 sm:py-1 text-green-400 focus:outline-none focus:border-green-500 min-h-[120px] sm:min-h-[100px] resize-y text-base sm:text-sm touch-manipulation",
    button:
      "px-4 py-2 bg-green-500/20 border border-green-500 text-green-400 rounded hover:bg-green-500/30 active:bg-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] touch-manipulation transition-colors",
    error: "text-red-400 text-xs sm:text-xs mt-1",
    success: "text-green-400 mt-2 text-sm sm:text-base",
    errorMessage: "text-red-400 mt-2 text-sm sm:text-base",
  };

  // GUI mode styling (placeholder for future implementation)
  const guiStyles = {
    container: "space-y-4",
    label: "text-gray-700 dark:text-gray-300",
    input:
      "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
    textarea:
      "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-y",
    button:
      "px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",
    error: "text-red-500 text-sm mt-1",
    success: "text-green-600 mt-2",
    errorMessage: "text-red-500 mt-2",
  };

  const styles = mode === "terminal" ? terminalStyles : guiStyles;

  return (
    <form onSubmit={handleSubmit} className={styles.container} aria-label="Contact form">
      <div>
        <label htmlFor="name" className={styles.label}>
          Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={styles.input}
          disabled={isSubmitting}
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <div id="name-error" className={styles.error} role="alert">
            {errors.name}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="email" className={styles.label}>
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
          disabled={isSubmitting}
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <div id="email-error" className={styles.error} role="alert">
            {errors.email}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="message" className={styles.label}>
          Message:
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={styles.textarea}
          disabled={isSubmitting}
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <div id="message-error" className={styles.error} role="alert">
            {errors.message}
          </div>
        )}
      </div>

      <button 
        type="submit" 
        className={styles.button} 
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>

      {submitStatus.type === "success" && (
        <div className={styles.success} role="status" aria-live="polite">
          {submitStatus.message}
        </div>
      )}
      {submitStatus.type === "error" && (
        <div className={styles.errorMessage} role="alert" aria-live="assertive">
          {submitStatus.message}
        </div>
      )}
    </form>
  );
}
