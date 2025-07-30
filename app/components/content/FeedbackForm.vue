<template>
  <section
    class="feedback-form-section py-4"
    role="region"
    aria-labelledby="feedback-form-title"
  >
    <v-container>
      <div class="text-center mb-8">
        <h2
          id="feedback-form-title"
          class="text-h4 mb-4"
          style="margin-top: -40px !important"
        >
          Share Your Feedback
        </h2>
        <p class="text-body-1 text-medium-emphasis">
          We value your input. Please share your thoughts, suggestions, or
          questions with us.
        </p>
      </div>

      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-card
            variant="elevated"
            class="feedback-form-card pa-6"
            role="form"
            aria-labelledby="feedback-form-title"
          >
            <!-- Accessibility: Live region for form validation announcements -->
            <div
              id="form-status"
              class="sr-only"
              aria-live="polite"
              aria-atomic="true"
            >
              {{ formStatusMessage }}
            </div>

            <!-- Success Message -->
            <v-alert
              v-if="isSubmitted"
              type="success"
              variant="tonal"
              class="mb-6"
              role="status"
              aria-live="polite"
            >
              <template #title>
                <span class="text-h6">Thank you for your feedback!</span>
              </template>
              <p class="mb-0">
                Your message has been sent successfully. We appreciate your
                input and will review your feedback carefully.
              </p>
            </v-alert>

            <!-- Form -->
            <v-form
              v-if="!isSubmitted"
              ref="formRef"
              v-model="isFormValid"
              @submit.prevent="handleSubmit"
              novalidate
              role="form"
              aria-label="Feedback form for the Statewide Violence Prevention Plan"
            >
              <!-- Email Field -->
              <div id="email-help" class="text-caption helper-text mb-2">
                We'll use this email address to respond to your feedback if
                needed. (required field)
              </div>
              <v-text-field
                v-model="formData.email"
                label="Email Address *"
                type="email"
                variant="outlined"
                :rules="emailRules"
                required
                class="mb-4"
                aria-describedby="email-help"
                autocomplete="email"
                aria-required="true"
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-email-outline" aria-hidden="true" />
                </template>
              </v-text-field>

              <!-- First Name Field -->
              <div id="firstName-help" class="text-caption helper-text mb-2">
                Enter your first name (required field).
              </div>
              <v-text-field
                v-model="formData.firstName"
                label="First Name *"
                variant="outlined"
                :rules="nameRules"
                required
                class="mb-4"
                autocomplete="given-name"
                aria-describedby="firstName-help"
                aria-required="true"
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-account-outline" aria-hidden="true" />
                </template>
              </v-text-field>

              <!-- Last Name Field -->
              <div id="lastName-help" class="text-caption helper-text mb-2">
                Enter your last name (required field).
              </div>
              <v-text-field
                v-model="formData.lastName"
                label="Last Name *"
                variant="outlined"
                :rules="nameRules"
                required
                class="mb-4"
                autocomplete="family-name"
                aria-describedby="lastName-help"
                aria-required="true"
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-account-outline" aria-hidden="true" />
                </template>
              </v-text-field>

              <!-- Comment/Feedback Field -->
              <div id="comment-help" class="text-caption helper-text mb-2">
                Please share your comments. Minimum 10 characters, maximum 750
                characters.
              </div>
              <v-textarea
                v-model="formData.comment"
                label="Comment or Feedback *"
                variant="outlined"
                :rules="commentRules"
                required
                rows="6"
                counter="750"
                :maxlength="750"
                class="mb-6"
                aria-describedby="comment-help"
                aria-required="true"
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-message-text-outline" aria-hidden="true" />
                </template>
              </v-textarea>

              <!-- Form Actions -->
              <div
                class="d-flex flex-column flex-sm-row justify-center form-actions"
              >
                <v-btn
                  type="button"
                  variant="outlined"
                  color="secondary"
                  @click="handleClear"
                  :disabled="isSubmitting"
                  aria-label="Clear all form fields and reset the form"
                >
                  <v-icon start icon="mdi-refresh" aria-hidden="true" />
                  Clear Form
                </v-btn>

                <div class="position-relative">
                  <v-btn
                    type="submit"
                    variant="elevated"
                    :color="isFormValid && !isSubmitting ? 'primary' : 'grey'"
                    :loading="isSubmitting"
                    :disabled="!isFormValid || isSubmitting"
                    class="submit-button"
                    :class="{
                      'submit-button--disabled': !isFormValid || isSubmitting,
                    }"
                    :style="{
                      cursor: isSubmitting
                        ? 'wait'
                        : !isFormValid
                          ? 'not-allowed'
                          : 'pointer',
                    }"
                    :aria-label="submitButtonAriaLabel"
                    @mouseenter="showTooltip = true"
                    @mouseleave="hideTooltip"
                    @focus="showTooltip = true"
                    @blur="hideTooltip"
                  >
                    <v-icon
                      start
                      :icon="
                        !isFormValid && !isSubmitting ? 'mdi-lock' : 'mdi-send'
                      "
                      aria-hidden="true"
                    />
                    {{
                      !isFormValid && !isSubmitting
                        ? "Form Incomplete"
                        : "Send Feedback"
                    }}
                  </v-btn>

                  <v-tooltip
                    :model-value="showTooltip"
                    location="bottom"
                    :text="submitTooltipText"
                    activator="parent"
                    :open-delay="200"
                    :close-delay="0"
                  />
                </div>
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
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

// Tooltip state management
const showTooltip = ref(false);
let tooltipTimer = null;

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
 * Hide tooltip with auto-dismiss timer (like navbar tooltips)
 */
const hideTooltip = () => {
  // Clear any existing timer
  if (tooltipTimer) {
    clearTimeout(tooltipTimer);
    tooltipTimer = null;
  }

  // Set auto-dismiss timer for 2 seconds (matching navbar behavior)
  tooltipTimer = setTimeout(() => {
    showTooltip.value = false;
    tooltipTimer = null;
  }, 2000);
};

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
</script>

<style scoped>
.feedback-form-section {
  background: rgb(var(--v-theme-surface));
}

.feedback-form-card {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid rgba(0, 0, 0, 0.05);
  /* Enhanced background for better contrast against page backgrounds - matching homepage cards */
  background: #ffffff !important;
}

/* Dark theme card styling - matching homepage cards */
:root[data-theme="dark"] .feedback-form-card {
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
  /* Lighter surface color for better contrast against dark page backgrounds */
  background: #2a3441 !important;
}

/* Light theme styling */
:root:not([data-theme="dark"]) .feedback-form-section h2 {
  color: #000 !important; /* Pure black for maximum contrast in light mode */
}

:root:not([data-theme="dark"]) .feedback-form-section .text-body-1 {
  color: #000 !important; /* Pure black for maximum contrast in light mode */
}

:root:not([data-theme="dark"]) :deep(.v-label) {
  color: #000 !important; /* Pure black for maximum contrast in light mode */
  opacity: 0.87 !important;
}

:root:not([data-theme="dark"]) :deep(.v-field__input) {
  color: #000 !important; /* Pure black for maximum contrast in light mode */
}

:root:not([data-theme="dark"]) :deep(.v-field__input::placeholder) {
  color: #555 !important; /* Darker grey for better contrast - ensures 7.5:1+ contrast */
  opacity: 1 !important; /* Remove opacity to maintain contrast */
}

:root:not([data-theme="dark"]) :deep(.v-field__outline) {
  color: #ccc !important; /* Light grey border for light mode */
}

/* Dark theme styling */
:root[data-theme="dark"] .feedback-form-section h2 {
  color: #f1f5f9 !important; /* Light text for dark mode */
}

:root[data-theme="dark"] .feedback-form-section .text-body-1 {
  color: #cbd5e1 !important; /* Light grey text for dark mode */
}

:root[data-theme="dark"] :deep(.v-label) {
  color: #f1f5f9 !important; /* Light text for dark mode */
  opacity: 0.87 !important;
}

:root[data-theme="dark"] :deep(.v-field__input) {
  color: #f1f5f9 !important; /* Light text for dark mode */
}

:root[data-theme="dark"] :deep(.v-field__input::placeholder) {
  color: #e2e8f0 !important; /* Lighter grey for better contrast - ensures 4.5:1+ contrast */
  opacity: 1 !important; /* Remove opacity to maintain contrast */
}

:root[data-theme="dark"] :deep(.v-field__outline) {
  color: #475569 !important; /* Dark grey border for dark mode */
}

/* Remove custom focus styles to use Vuetify's native focus styling */

/* Focused and dirty label states for both themes */
:deep(.v-field--focused .v-label),
:deep(.v-field--dirty .v-label) {
  color: rgb(var(--v-theme-primary)) !important;
  opacity: 1 !important;
}

/* Light theme helper text and messages */
:root:not([data-theme="dark"]) :deep(.v-messages__message) {
  color: #000 !important; /* Pure black for maximum contrast in light mode */
  opacity: 0.87 !important;
}

:root:not([data-theme="dark"]) .helper-text {
  color: #000 !important; /* Pure black for maximum contrast in light mode */
  opacity: 0.87 !important;
}

:root:not([data-theme="dark"]) :deep(.v-counter) {
  color: #555 !important; /* Darker grey for better contrast - ensures 7.5:1+ contrast */
  opacity: 1 !important; /* Remove opacity to maintain contrast */
}

:root:not([data-theme="dark"]) :deep(.v-alert .v-alert__content) {
  color: #000 !important; /* Pure black for maximum contrast in light mode */
}

:root:not([data-theme="dark"]) :deep(.v-alert .text-h6) {
  color: #000 !important; /* Pure black for maximum contrast in light mode */
}

/* Dark theme helper text and messages */
:root[data-theme="dark"] :deep(.v-messages__message) {
  color: #cbd5e1 !important; /* Light grey for dark mode */
  opacity: 0.87 !important;
}

:root[data-theme="dark"] .helper-text {
  color: #cbd5e1 !important; /* Light grey for dark mode */
  opacity: 0.87 !important;
}

:root[data-theme="dark"] :deep(.v-counter) {
  color: #e2e8f0 !important; /* Lighter grey for better contrast - ensures 4.5:1+ contrast */
  opacity: 1 !important; /* Remove opacity to maintain contrast */
}

:root[data-theme="dark"] :deep(.v-alert .v-alert__content) {
  color: #f1f5f9 !important; /* Light text for dark mode */
}

:root[data-theme="dark"] :deep(.v-alert .text-h6) {
  color: #f1f5f9 !important; /* Light text for dark mode */
}

/* Ensure error messages are properly themed */
:deep(.v-messages--error .v-messages__message) {
  color: rgb(var(--v-theme-error)) !important;
  opacity: 1 !important;
}

/* Ensure error state field labels are properly themed */
:deep(.v-field--error .v-label) {
  color: rgb(var(--v-theme-error)) !important;
  opacity: 1 !important;
}

/* Form actions spacing */
.form-actions {
  gap: 24px; /* 24px spacing between buttons */
}

/* Mobile spacing adjustment */
@media (max-width: 600px) {
  .form-actions {
    gap: 16px; /* Slightly less spacing on mobile */
  }
}

/* Submit button styling for better disabled state visibility */
.submit-button--disabled {
  /* Simple light grey background with dark text */
  background-color: #f5f5f5 !important; /* Light grey background */
  border-color: #f5f5f5 !important;
  box-shadow: none !important; /* Remove elevation for disabled state */
  opacity: 1 !important; /* Override Vuetify's default opacity */
  position: relative !important;
}

.submit-button--disabled :deep(.v-btn__content) {
  color: #000 !important; /* Dark black text */
}

.submit-button--disabled :deep(.v-icon) {
  color: #000 !important; /* Dark black icon */
}

/* Add a subtle "disabled" overlay effect */
.submit-button--disabled::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.05) 2px,
    rgba(0, 0, 0, 0.05) 4px
  );
  pointer-events: none;
  border-radius: inherit;
}

/* Loading state styling - light grey background with dark spinner */
.submit-button :deep(.v-btn--loading) {
  background-color: #f5f5f5 !important; /* Light grey background when loading */
  border-color: #f5f5f5 !important;
}

.submit-button :deep(.v-btn--loading .v-btn__content) {
  color: #000 !important; /* Black text when loading */
}

.submit-button :deep(.v-btn--loading .v-progress-circular) {
  color: #000 !important; /* Black spinner */
}

/* Ensure loading spinner is visible in both themes */
:deep(.v-btn--loading .v-progress-circular) {
  color: #000 !important;
}

:deep(.v-btn--loading .v-progress-circular .v-progress-circular__overlay) {
  stroke: #000 !important;
}

/* Aggressive cursor styling to override Vuetify */
.submit-button {
  cursor: pointer !important; /* Default pointer when enabled */
}

/* Force not-allowed cursor for disabled state with maximum specificity */
.submit-button--disabled,
.submit-button--disabled:hover,
.submit-button--disabled:focus,
.submit-button--disabled:active {
  cursor: not-allowed !important;
}

/* Deep selectors to override all Vuetify button elements */
.submit-button--disabled :deep(.v-btn),
.submit-button--disabled :deep(.v-btn:hover),
.submit-button--disabled :deep(.v-btn:focus),
.submit-button--disabled :deep(.v-btn:active),
.submit-button--disabled :deep(.v-btn:disabled),
.submit-button--disabled :deep(.v-btn__content),
.submit-button--disabled :deep(.v-btn__overlay),
.submit-button--disabled :deep(.v-icon),
.submit-button--disabled :deep(*) {
  cursor: not-allowed !important;
}

/* Loading state cursors */
.submit-button :deep(.v-btn--loading),
.submit-button :deep(.v-btn--loading *) {
  cursor: wait !important;
}

/* Button focus styles */
:deep(.v-btn:focus-visible) {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

/* Responsive spacing */
@media (max-width: 600px) {
  .d-flex.flex-column.flex-sm-row {
    gap: 16px !important;
  }

  .d-flex.flex-column.flex-sm-row .v-btn {
    width: 100%;
  }
}
</style>

<style>
/* Global styles to force cursor changes - highest priority */
.submit-button--disabled,
.submit-button--disabled .v-btn,
.submit-button--disabled .v-btn *,
.submit-button--disabled * {
  cursor: not-allowed !important;
}

.submit-button .v-btn--loading,
.submit-button .v-btn--loading * {
  cursor: wait !important;
}

/* Screen reader only class for accessibility announcements */
.sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}
</style>
