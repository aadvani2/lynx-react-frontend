import { useCallback } from 'react';
import Swal from 'sweetalert2';
import { conversationService } from '../services/generalServices/conversationService';
import { useAuthStore } from '../store/authStore';

interface ChatButtonData {
  channel_name?: string;
  identity_name?: string;
  au_id?: string;
  user_type?: string;
  friendly_name?: string;
  request_id?: number;
  request_status?: string | number;
  url?: string;
}

export const useChatButton = () => {
  const { user } = useAuthStore.getState();

  const handleChatClick = useCallback(async (buttonData: ChatButtonData) => {
    const {
      channel_name,
      identity_name,
      au_id,
      user_type,
      friendly_name,
      request_id,
      request_status,
      url
    } = buttonData;

    if (!channel_name || !identity_name) {
      Swal.fire('Error', 'Missing required chat information', 'error');
      return;
    }

    // Show loading
    Swal.fire({
      title: 'Connecting to chat...',
      text: 'Please wait while we connect you.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      // Determine if this is a professional endpoint
      const isProfessional = url?.includes('/professional/join-channel') || user_type === 'provider';
      
      // Get user ID from auth store
      const userId = user?.id || au_id;
      const finalUserType = user_type || (user?.user_type || 'customer');
      const finalIdentity = identity_name || (finalUserType === 'customer' ? `C_${userId}` : finalUserType === 'provider' ? `P_${userId}` : `E_${userId}`);

      const payload = {
        channel_name: channel_name,
        identity_name: finalIdentity,
        au_id: String(userId || au_id || ''),
        user_type: finalUserType,
        friendly_name: friendly_name || `#${request_id || ''}`,
        request_id: request_id,
        request_status: request_status || 1
      };

      const response = await conversationService.joinChannel(payload, isProfessional);

      // Handle "member already exists" as success (it's not really an error)
      const isMemberExistsError = response.message?.toLowerCase().includes('member already exists') || 
                                  response.message?.toLowerCase().includes('already exists');
      
      if (!response.success && !isMemberExistsError) {
        Swal.fire('Error', response.message || 'Failed to join channel', 'error');
        return;
      }
      
      // If member already exists, that's fine - just proceed
      if (isMemberExistsError) {
        console.log('Member already exists in channel, proceeding...');
      }

      // Close loading and trigger chat widget
      Swal.close();
      
      // Trigger chat widget to open (if it exists)
      setTimeout(() => {
        const chatButton = document.getElementById('lynx-chat-button');
        if (chatButton) {
          chatButton.click();
        }
        
        // Hide contacts view and show chat view
        const contactsView = document.getElementById('lynx-contacts-view');
        const chatView = document.getElementById('lynx-chat-view');
        if (contactsView) contactsView.classList.add('d-none');
        if (chatView) chatView.classList.remove('d-none');
        
        // Set chat name
        const chatName = document.getElementById('chat-name');
        if (chatName && friendly_name) {
          chatName.textContent = friendly_name;
        }
        
        // Hide chat input if request is completed
        const chatInput = document.querySelector('.chat-msg-bottom');
        if (request_status === 'completed' || request_status === 0) {
          if (chatInput) chatInput.classList.add('d-none');
        } else {
          if (chatInput) chatInput.classList.remove('d-none');
        }
      }, 500);

    } catch (error: any) {
      console.error('Chat initialization failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to connect',
        text: error.message || 'Unable to start chat. Please try again later.',
        customClass: {
          confirmButton: 'btn btn-primary rounded-pill w-20',
        },
        buttonsStyling: false
      });
    }
  }, [user]);

  return { handleChatClick };
};

