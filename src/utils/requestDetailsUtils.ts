// Helper functions for request details
export const getStatusMessage = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'Request is pending and waiting to be accepted by a service provider.';
    case 'accepted':
      return 'Request has been accepted by Lynx Provider company. Following employee will reach out to you.';
    case 'in process':
      return 'Service provider is currently working on your request.';
    case 'completed':
      return 'Your service request has been completed successfully.';
    case 'cancelled':
      return 'This request has been cancelled.';
    case 'on hold':
      return 'Your request is temporarily on hold.';
    default:
      return 'Request status is being updated.';
  }
};

export const getProgressClass = (step: string, requestStatus: string) => {
  const status = requestStatus?.toLowerCase();

  // For cancelled requests, don't show any completed styling on previous steps
  if (status === 'cancelled') {
    switch (step) {
      case 'finding':
        return ''; // No completed class - no green checkmark
      case 'accepted':
        return ''; // No completed class - no green checkmark
      case 'arrived':
        return ''; // No completed class - no green checkmark
      case 'completed':
        return 'request-cancelled completed no-animation'; // Only the final step gets special styling
      default:
        return '';
    }
  }

  // For non-cancelled requests, normal flow
  switch (step) {
    case 'finding':
      return 'completed';
    case 'accepted':
      return ['accepted', 'in process', 'completed'].includes(status) ? 'completed' : '';
    case 'arrived':
      return ['in process', 'completed'].includes(status) ? 'completed' : '';
    case 'completed':
      return status === 'completed' ? 'completed' : '';
    default:
      return '';
  }
};

export const getStatusIcon = (requestStatus: string, statusIcon?: string) => {
  switch (requestStatus?.toLowerCase()) {
    case 'cancelled':
      return "";
    case 'accepted':
      return "";
    default:
      return statusIcon || "";
  }
};

export const getProgressFillStyle = (step: string, requestStatus: string) => {
  const status = requestStatus?.toLowerCase();
  
  // Green line for accepted step when status is accepted or beyond
  if (step === 'accepted' && ['accepted', 'in process', 'completed'].includes(status)) {
    return { '--progress-fill': '100%' } as React.CSSProperties;
  }
  
  // Green line for arrived step when status is in process or completed
  if (step === 'arrived' && ['in process', 'completed'].includes(status)) {
    return { '--progress-fill': '100%' } as React.CSSProperties;
  }
  
  // Green line for completed step when status is completed
  if (step === 'completed' && status === 'completed') {
    return { '--progress-fill': '100%' } as React.CSSProperties;
  }
  
  // Green line for completed step when status is cancelled
  if (step === 'completed' && status === 'cancelled') {
    return { '--progress-fill': '100%' } as React.CSSProperties;
  }
  
  return {};
}; 