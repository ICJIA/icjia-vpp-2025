<template>
  <section
    class="feedback-form-section py-8"
    role="region"
    aria-labelledby="feedback-form-title"
  >
    <v-container>
      <div class="text-center mb-8">
        <h2 id="feedback-form-title" class="text-h4 mb-4">
          Share Your Feedback
        </h2>
        <p class="text-body-1 text-medium-emphasis">
          We value your input on the Statewide Violence Prevention Plan for
          Illinois: 2025-2029. Please share your thoughts, suggestions, or
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
            >
              <!-- Email Field -->
              <v-text-field
                v-model="formData.email"
                label="Email Address"
                type="email"
                variant="outlined"
                :rules="emailRules"
                required
                class="mb-4"
                aria-describedby="email-help"
                autocomplete="email"
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-email-outline" aria-hidden="true" />
                </template>
              </v-text-field>
              <div id="email-help" class="text-caption helper-text mb-4">
                We'll use this email address to respond to your feedback if
                needed.
              </div>

              <!-- First Name Field -->
              <v-text-field
                v-model="formData.firstName"
                label="First Name"
                variant="outlined"
                :rules="nameRules"
                required
                class="mb-4"
                autocomplete="given-name"
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-account-outline" aria-hidden="true" />
                </template>
              </v-text-field>

              <!-- Last Name Field -->
              <v-text-field
                v-model="formData.lastName"
                label="Last Name"
                variant="outlined"
                :rules="nameRules"
                required
                class="mb-4"
                autocomplete="family-name"
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-account-outline" aria-hidden="true" />
                </template>
              </v-text-field>

              <!-- Comment/Feedback Field -->
              <v-textarea
                v-model="formData.comment"
                label="Comment or Feedback"
                variant="outlined"
                :rules="commentRules"
                required
                rows="6"
                counter="750"
                :maxlength="750"
                class="mb-6"
                aria-describedby="comment-help"
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-message-text-outline" aria-hidden="true" />
                </template>
              </v-textarea>
              <div id="comment-help" class="text-caption helper-text mb-4">
                Please share your thoughts, suggestions, or questions about the
                violence prevention plan. Maximum 750 characters.
              </div>

              <!-- Form Actions -->
              <div class="d-flex flex-column flex-sm-row gap-4 justify-center">
                <v-btn
                  type="button"
                  variant="outlined"
                  color="secondary"
                  @click="handleClear"
                  :disabled="isSubmitting"
                  aria-describedby="clear-help"
                >
                  <v-icon start icon="mdi-refresh" aria-hidden="true" />
                  Clear Form
                </v-btn>

                <v-btn
                  type="submit"
                  variant="elevated"
                  color="primary"
                  :loading="isSubmitting"
                  :disabled="!isFormValid || isSubmitting"
                  aria-describedby="submit-help"
                >
                  <v-icon start icon="mdi-send" aria-hidden="true" />
                  Send Feedback
                </v-btn>
              </div>

              <!-- Helper Text -->
              <div class="mt-4">
                <div id="clear-help" class="text-caption helper-text">
                  Clear form: Resets all fields and validation errors
                </div>
                <div id="submit-help" class="text-caption helper-text">
                  Send feedback: Validates and submits your message
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

import { ref, reactive } from "vue";

// Form state management
const formRef = ref(null);
const isFormValid = ref(false);
const isSubmitting = ref(false);
const isSubmitted = ref(false);

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
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  background: rgb(var(--v-theme-surface)) !important;
}

/* Ensure main heading and description have proper contrast in both themes */
.feedback-form-section h2 {
  color: rgb(var(--v-theme-on-surface)) !important;
}

.feedback-form-section .text-body-1 {
  color: rgb(var(--v-theme-on-surface-variant)) !important;
}

/* Enhanced focus styles for accessibility */
:deep(.v-field--focused) {
  box-shadow: 0 0 0 2px rgb(var(--v-theme-primary)) !important;
}

/* Ensure proper contrast for form elements */
:deep(.v-field__input) {
  color: rgb(var(--v-theme-on-surface)) !important;
}

/* Fix label visibility with theme-aware colors */
:deep(.v-label) {
  color: rgb(var(--v-theme-on-surface)) !important;
  opacity: 0.87 !important;
}

/* Ensure floating labels are visible with primary color */
:deep(.v-field--focused .v-label),
:deep(.v-field--dirty .v-label) {
  color: rgb(var(--v-theme-primary)) !important;
  opacity: 1 !important;
}

/* Fix placeholder text visibility with theme-aware colors */
:deep(.v-field__input::placeholder) {
  color: rgb(var(--v-theme-on-surface-variant)) !important;
  opacity: 0.6 !important;
}

/* Ensure field borders are visible with theme-aware colors */
:deep(.v-field__outline) {
  color: rgb(var(--v-theme-outline)) !important;
}

/* Fix helper text visibility with theme-aware colors */
:deep(.v-messages__message) {
  color: rgb(var(--v-theme-on-surface-variant)) !important;
  opacity: 0.87 !important;
}

/* Custom helper text styling for better visibility with theme-aware colors */
.helper-text {
  color: rgb(var(--v-theme-on-surface-variant)) !important;
  opacity: 0.87 !important;
}

/* Ensure input text uses theme-aware colors */
:deep(.v-field__input) {
  color: rgb(var(--v-theme-on-surface)) !important;
}

/* Fix counter text visibility with theme-aware colors */
:deep(.v-counter) {
  color: rgb(var(--v-theme-on-surface-variant)) !important;
  opacity: 0.7 !important;
}

/* Ensure alert text has proper contrast with theme-aware colors */
:deep(.v-alert .v-alert__content) {
  color: rgb(var(--v-theme-on-surface)) !important;
}

:deep(.v-alert .text-h6) {
  color: rgb(var(--v-theme-on-surface)) !important;
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
