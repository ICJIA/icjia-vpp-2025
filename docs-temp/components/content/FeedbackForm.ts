/**
 * @module FeedbackForm
 * @fileoverview Vue component: FeedbackForm
 */

/**
 * FeedbackForm Component
 *
 * A comprehensive feedback form for the Violence Prevention Plan website.
 * Implements WCAG 2.1 AA accessibility standards with proper form validation,
 * screen reader support, and keyboard navigation.
 *
 * Features:
 * - Email validation with proper format checking
 * - Required field validation for all inputs
 * - Character limit enforcement for textarea (750 chars)
 * - Accessible form labels and descriptions
 * - Success state management
 * - Form reset functionality
 * - Loading states during submission
 * - Proper ARIA attributes and roles
 *
 * @component
 * @example
 * <!-- Use in Markdown content via MDC -->
 * ::FeedbackForm
 * ::
 */

import { ref, reactive, computed } from "vue";

// Form state management
const formRef = ref(null);
const isFormValid = ref(false);
const isSubmitting = ref(false);
const isSubmitted = ref(false);

// Form status feedback (replaces tooltip functionality)

// Form data
const formData = reactive({
  email: "",
  firstName: "",
  lastName: "",
  comment: "",
});

// Validation rules
const emailRules = [
  (value) => {
    if (!value) return "Email address is required";
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(value)) return "Please enter a valid email address";
    return true;
  },
];

const nameRules = [
  (value) => {
    if (!value) return "This field is required";
    if (value.length < 2) return "Name must be at least 2 characters";
    if (value.length > 50) return "Name must be less than 50 characters";
    return true;
  },
];

const commentRules = [
  (value) => {
    if (!value) return "Comment or feedback is required";
    if (value.length < 10)
      return "Please provide at least 10 characters of feedback";
    if (value.length > 750) return "Comment must be 750 characters or less";
    return true;
  },
];

/**
 * Computed property for submit button tooltip text
 * Shows form status and what's needed to submit
 */
const submitTooltipText = computed(() => {
  const tooltipText = (() => {
    if (isSubmitting.value) {
      return "Submitting your feedback...";
    }

    if (!isFormValid.value) {
      const missingFields = [];

      // Check each required field
      if (!formData.email || emailRules[0](formData.email) !== true) {
        missingFields.push("EMAIL ADDRESS");
      }
      if (!formData.firstName || nameRules[0](formData.firstName) !== true) {
        missingFields.push("FIRST NAME");
      }
      if (!formData.lastName || nameRules[0](formData.lastName) !== true) {
        missingFields.push("LAST NAME");
      }
      if (!formData.comment || commentRules[0](formData.comment) !== true) {
        missingFields.push("COMMENT");
      }

      if (missingFields.length > 0) {
        return `Please complete: ${missingFields.join(", ")}`;
      }

      return "Please complete all required fields";
    }

    return "Form is ready to submit";
  })();

  // Debug logging in development
  if (process.env.NODE_ENV === "development") {
    console.log("Submit tooltip text:", tooltipText);
    console.log("Form valid:", isFormValid.value);
    console.log("Is submitting:", isSubmitting.value);
  }

  return tooltipText;
});

/**
 * Computed property for submit button aria-label
 * Provides accessible description of button state for screen readers
 */
const submitButtonAriaLabel = computed(() => {
  if (isSubmitting.value) {
    return "Submitting your feedback, please wait";
  }

  if (!isFormValid.value) {
    const missingFields = [];

    // Check each required field for aria-label
    if (!formData.email || emailRules[0](formData.email) !== true) {
      missingFields.push("email address");
    }
    if (!formData.firstName || nameRules[0](formData.firstName) !== true) {
      missingFields.push("first name");
    }
    if (!formData.lastName || nameRules[0](formData.lastName) !== true) {
      missingFields.push("last name");
    }
    if (!formData.comment || commentRules[0](formData.comment) !== true) {
      missingFields.push("comment");
    }

    if (missingFields.length > 0) {
      return `Form incomplete. Please complete the following required fields: ${missingFields.join(", ")}`;
    }
  }

  return "Send your feedback about the violence prevention plan";
});

/**
 * Computed property for form status announcements
 * Provides screen reader announcements for form validation state changes
 */
const formStatusMessage = computed(() => {
  // Only announce when form becomes invalid after user interaction
  if (
    !isFormValid.value &&
    (formData.email ||
      formData.firstName ||
      formData.lastName ||
      formData.comment)
  ) {
    const missingFields = [];

    if (!formData.email || emailRules[0](formData.email) !== true) {
      missingFields.push("email address");
    }
    if (!formData.firstName || nameRules[0](formData.firstName) !== true) {
      missingFields.push("first name");
    }
    if (!formData.lastName || nameRules[0](formData.lastName) !== true) {
      missingFields.push("last name");
    }
    if (!formData.comment || commentRules[0](formData.comment) !== true) {
      missingFields.push("comment");
    }

    if (missingFields.length > 0) {
      return `Form validation: Please complete the following required fields: ${missingFields.join(", ")}`;
    }
  }

  return "";
});

/**
 * Stub function to simulate email sending
 * In a real implementation, this would call an API endpoint
 *
 * @param {Object} data - Form data to send
 * @returns {Promise<boolean>} - Success status
 */
async function send_email(data) {
  // Log form data for development/testing
  console.log("=== FEEDBACK FORM SUBMISSION ===");
  console.log("Email:", data.email);
  console.log("First Name:", data.firstName);
  console.log("Last Name:", data.lastName);
  console.log("Comment:", data.comment);
  console.log("Timestamp:", new Date().toISOString());
  console.log("================================");

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Always return success for this stub implementation
  return true;
}

/**
 * Handles form submission
 * Validates form, calls send_email function, and manages UI state
 */
async function handleSubmit() {
  if (!formRef.value) return;

  // Validate form
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  try {
    isSubmitting.value = true;

    // Send email (stub function)
    const success = await send_email(formData);

    if (success) {
      isSubmitted.value = true;
      // Announce success to screen readers
      if (typeof window !== "undefined") {
        const announcement =
          "Feedback form submitted successfully. Thank you for your input.";
        // Create a temporary element for screen reader announcement
        const announcer = document.createElement("div");
        announcer.setAttribute("aria-live", "polite");
        announcer.setAttribute("aria-atomic", "true");
        announcer.style.position = "absolute";
        announcer.style.left = "-10000px";
        announcer.textContent = announcement;
        document.body.appendChild(announcer);
        setTimeout(() => document.body.removeChild(announcer), 1000);
      }
    }
  } catch (error) {
    console.error("Error submitting feedback:", error);
    // In a real implementation, show error message to user
  } finally {
    isSubmitting.value = false;
  }
}

/**
 * Handles form clearing
 * Resets all form fields, validation state, and enables submit button
 */
function handleClear() {
  // Reset form data
  formData.email = "";
  formData.firstName = "";
  formData.lastName = "";
  formData.comment = "";

  // Reset form validation
  if (formRef.value) {
    formRef.value.reset();
    formRef.value.resetValidation();
  }

  // Reset form state
  isFormValid.value = false;
  isSubmitting.value = false;
  isSubmitted.value = false;

  // Announce to screen readers
  if (typeof window !== "undefined") {
    const announcement = "Form has been cleared. All fields have been reset.";
    const announcer = document.createElement("div");
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    announcer.style.position = "absolute";
    announcer.style.left = "-10000px";
    announcer.textContent = announcement;
    document.body.appendChild(announcer);
    setTimeout(() => document.body.removeChild(announcer), 1000);
  }
}
