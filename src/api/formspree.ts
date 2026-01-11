// Formspree integration for Bring Wagly Home form
// Handles form submission with proper loading/success/error states

export interface FormspreeSubmitData {
  bundle: string;
  qty: number;
  amount: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  address1: string;
  address2?: string;
  city: string;
  stateRegion: string;
  zip: string;
  selectedPups?: string;
}

export interface FormspreeResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Submit form data to Formspree endpoint
 * @param endpoint - Formspree form endpoint URL
 * @param data - Form data to submit
 * @returns Promise with success/error status
 */
export async function submitToFormspree(
  endpoint: string,
  data: FormspreeSubmitData
): Promise<FormspreeResponse> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || 'Failed to submit form. Please try again.'
      };
    }

    const result = await response.json();
    return {
      success: true,
      message: result.next || 'Form submitted successfully!'
    };
  } catch (error) {
    console.error('Formspree submission error:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.'
    };
  }
}
