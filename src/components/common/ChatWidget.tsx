import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo
} from 'react';
import { conversationService } from '../../services/generalServices/conversationService';
import { useAuthStore } from '../../store/authStore';
import { loadTwilioChat } from '../../utils/externalLoaders';

declare global {
  interface Window {
    Twilio?: any;
  }
}

type ConversationItem = {
  unique_name: string;
  friendly_name: string;
  title?: string;
  request_status?: string | number | null;
  messages_count?: number;
};

type ChatMessage = {
  sid: string;
  author: string;
  body: string;
  timestamp: string;
  attributes: Record<string, any>;
};

const fallbackAvatar =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiBmaWxsPSIjZjNmNGY2Ij48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSI0MCIgZmlsbD0iIzZiNzI4MCIvPjxwYXRoIGQ9Ik0xNjAsMTY1YzAsMCwwLTQwLTYwLTQwcy02MCw0MC02MCw0MFMxNjAsMTY1LDE2MCwxNjV6IiBmaWxsPSIjNmI3MjgwIi8+PC9zdmc+';

const ChatWidget: React.FC = () => {
  const { user } = useAuthStore();
  const [isChatMinimized, setIsChatMinimized] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationItem | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [identity, setIdentity] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isClientInitializing, setIsClientInitializing] = useState(false);

  const chatClientRef = useRef<any>(null);
  const activeChannelRef = useRef<any>(null);
  const normalMessagesRef = useRef<HTMLDivElement | null>(null);
  const fullscreenMessagesRef = useRef<HTMLDivElement | null>(null);

  const currentUserType = useMemo(() => {
    if (identity.startsWith('P_')) return 'provider';
    if (identity.startsWith('E_')) return 'employee';
    return 'customer';
  }, [identity]);

  const isComposerDisabled = useMemo(() => {
    if (!selectedConversation) return true;
    if (!activeChannelRef.current) return true;
    const status = `${selectedConversation.request_status ?? ''}`.toLowerCase();
    return status === 'completed' || status === 'cancelled' || status === '0';
  }, [selectedConversation]);

  const scrollMessagesToBottom = useCallback(() => {
    [normalMessagesRef.current, fullscreenMessagesRef.current].forEach((container) => {
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }, []);

  const fetchConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true);
      setErrorMessage(null);
      // Like Laravel: only call conversation-list, no token generation
      const response = await conversationService.getConversationList({ identity_name: '' });
      if (response?.success && response.data) {
        // Handle both response formats
        const conversations = response.data.conversations || response.data.result || response.data || [];
        const responseIdentity = response.data.identity || identity;
        const responseUserName = response.data.user_name || userName;
        
        setConversations(Array.isArray(conversations) ? conversations : []);
        if (responseIdentity) setIdentity(responseIdentity);
        if (responseUserName) setUserName(responseUserName);
      } else {
        setErrorMessage(response?.message || 'Unable to load conversations.');
        setConversations([]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setErrorMessage('Unable to load conversations.');
      setConversations([]);
    } finally {
      setIsLoadingConversations(false);
    }
  }, [identity, userName]);

  const fetchTwilioToken = useCallback(async () => {
    // Get identity from state (set by fetchConversations) or derive from user store
    let currentIdentity = identity;
    if (!currentIdentity && user?.id && user?.user_type) {
      const prefix = user.user_type === 'provider' ? 'P_' : user.user_type === 'employee' ? 'E_' : 'C_';
      currentIdentity = `${prefix}${user.id}`;
    }
    if (!currentIdentity) {
      throw new Error('Identity is missing');
    }
    // Pass identity to backend (backend can also derive it, but sending it is more explicit)
    const response = await conversationService.generateTwilioToken({ identity: currentIdentity });
    if (!response?.success || !response.token) {
      throw new Error(response?.message || 'Failed to generate chat token');
    }
    return response.token;
  }, [identity, user]);

  const ensureChatClient = useCallback(async () => {
    await loadTwilioChat();
    // Get identity from state or user store
    let currentIdentity = identity;
    if (!currentIdentity && user?.id && user?.user_type) {
      const prefix = user.user_type === 'provider' ? 'P_' : user.user_type === 'employee' ? 'E_' : 'C_';
      currentIdentity = `${prefix}${user.id}`;
    }
    if (!currentIdentity) {
      throw new Error('Identity is missing');
    }
    if (chatClientRef.current) {
      return chatClientRef.current;
    }
    if (!window.Twilio?.Chat?.Client) {
      throw new Error('Chat SDK is not available');
    }
    setIsClientInitializing(true);
    try {
      const token = await fetchTwilioToken();
      const client = await window.Twilio.Chat.Client.create(token);
      client.on('tokenAboutToExpire', async () => {
        try {
          const refreshed = await fetchTwilioToken();
          await client.updateToken(refreshed);
        } catch (tokenError) {
          console.error('Failed to refresh Twilio token', tokenError);
        }
      });
      chatClientRef.current = client;
      return client;
    } finally {
      setIsClientInitializing(false);
    }
  }, [identity, user, fetchTwilioToken]);

  const mapMessage = useCallback((message: any): ChatMessage => {
    let attributes = message.attributes || {};
    if (typeof attributes === 'string') {
      try {
        attributes = JSON.parse(attributes);
      } catch {
        attributes = {};
      }
    }
    return {
      sid: message.sid,
      author: message.author,
      body: message.body,
      timestamp:
        message.timestamp ||
        message.dateCreated?.toISOString?.() ||
        new Date().toISOString(),
      attributes
    };
  }, []);

  const loadChannelMessages = useCallback(
    async (channel: any) => {
      setIsLoadingMessages(true);
      setErrorMessage(null);
      try {
        const paginator = await channel.getMessages(50);
        setMessages(paginator.items.map(mapMessage));
        scrollMessagesToBottom();
        channel.removeAllListeners('messageAdded');
        channel.on('messageAdded', (newMessage: any) => {
          setMessages((prev) => [...prev, mapMessage(newMessage)]);
          scrollMessagesToBottom();
        });
      } catch (error) {
        console.error('Failed to load messages', error);
        setErrorMessage('Unable to load messages. Please try again.');
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [mapMessage, scrollMessagesToBottom]
  );

  const handleConversationSelect = useCallback(
    async (conversation: ConversationItem) => {
      setSelectedConversation(conversation);
      setMessages([]);
      setErrorMessage(null); // Clear any previous errors
      try {
        const client = await ensureChatClient();
        if (!client) {
          throw new Error('Unable to initialize chat client.');
        }
        let channel;
        try {
          channel = await client.getChannelByUniqueName(conversation.unique_name);
        } catch (fetchError: any) {
          // Channel might not exist, try to get it by subscribing
          console.log('Channel not found by unique name, trying to get it...', fetchError);
          throw new Error('Channel not found. Please try again.');
        }
        
        // Try to join the channel
        try {
          if (channel.channelState?.status !== 'joined') {
            await channel.join();
          }
        } catch (joinError: any) {
          // Error codes 50433 and 54205 mean "already a member" - this is fine
          const errorCode = joinError?.body?.code || joinError?.code;
          if ([50433, 54205].includes(errorCode) || joinError?.message?.toLowerCase().includes('already')) {
            // Member already exists - this is fine, just continue
            console.log('Member already in channel, continuing...');
          } else {
            // Some other error occurred
            throw joinError;
          }
        }
        
        // Set active channel and load messages
        if (activeChannelRef.current && activeChannelRef.current !== channel) {
          activeChannelRef.current.removeAllListeners('messageAdded');
        }
        activeChannelRef.current = channel;
        await loadChannelMessages(channel);
      } catch (error: any) {
        console.error('Failed to select conversation', error);
        // Don't show "member already exists" as an error
        const errorMessage = error?.message || 'Unable to open conversation.';
        if (!errorMessage.toLowerCase().includes('already exists') && 
            !errorMessage.toLowerCase().includes('member already')) {
          setErrorMessage(errorMessage);
        }
      }
    },
    [ensureChatClient, loadChannelMessages]
  );

  const handleSendMessage = useCallback(async () => {
    if (!messageText.trim() || !activeChannelRef.current || isComposerDisabled) {
      return;
    }
    const text = messageText.trim();
    setMessageText('');
    try {
      await activeChannelRef.current.sendMessage(text, {
        user_name: userName,
        identity,
        user_type: currentUserType
      });
    } catch (error) {
      console.error('Failed to send message', error);
      setErrorMessage('Unable to send message. Please try again.');
      setMessageText(text);
    }
  }, [messageText, userName, identity, currentUserType, isComposerDisabled]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours || 12;
    return `${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
  };

  const getDisplayName = (message: ChatMessage) => {
    const identityAttr = message.attributes?.identity;
    if (identityAttr === identity) {
      return '';
    }
    const userType = (message.attributes?.user_type || '').toLowerCase();
    if (userType === 'employee') {
      return 'Employee';
    }
    return message.attributes?.user_name || '';
  };

  const handleChatButtonClick = () => {
    setIsChatMinimized(false);
  };

  const handleMinimizeButtonClick = () => {
    setIsChatMinimized(true);
    setSelectedConversation(null);
    setMessages([]);
  };

  const handleExpandButtonClick = () => {
    setIsFullscreen((prev) => !prev);
  };

  const handleBackToContacts = () => {
    setSelectedConversation(null);
    setMessages([]);
  };

  // Initialize Twilio client on page load (like Laravel does)
  useEffect(() => {
    const initializeClient = async () => {
      // Get identity from user store
      if (user?.id && user?.user_type) {
        const prefix = user.user_type === 'provider' ? 'P_' : user.user_type === 'employee' ? 'E_' : 'C_';
        const currentIdentity = `${prefix}${user.id}`;
        setIdentity(currentIdentity);
        
        // Initialize Twilio client if not already initialized
        if (!chatClientRef.current && window.Twilio?.Chat?.Client) {
          try {
            await ensureChatClient();
          } catch (error) {
            console.error('Failed to initialize Twilio client:', error);
          }
        }
      }
    };
    
    initializeClient();
  }, [user, ensureChatClient]);

  // Fetch conversations when chat is opened (like Laravel - only calls conversation-list)
  useEffect(() => {
    if (!isChatMinimized) {
      fetchConversations();
    }
  }, [isChatMinimized, fetchConversations]);

  useEffect(() => {
    return () => {
      if (activeChannelRef.current) {
        activeChannelRef.current.removeAllListeners('messageAdded');
      }
      if (chatClientRef.current) {
        chatClientRef.current.removeAllListeners?.();
      }
    };
  }, []);

  useEffect(() => {
    scrollMessagesToBottom();
  }, [messages, scrollMessagesToBottom, isFullscreen]);

  const renderConversationList = (variant: 'normal' | 'fullscreen') => {
    if (isLoadingConversations) {
      return (
        <div className="d-flex align-items-center justify-content-center h-100">
          <div className="spinner-border text-primary" role="status" />
        </div>
      );
    }

    if (!conversations.length) {
      return (
        <div className="d-flex align-items-center justify-content-center h-100 text-center text-muted px-3">
          No conversations found.
        </div>
      );
    }

    const listClasses =
      variant === 'fullscreen'
        ? 'flex-grow-1 overflow-auto lynx-list-container'
        : 'flex-grow-1 overflow-auto';

    return (
      <div
        className={listClasses}
        style={variant === 'normal' ? { height: 350 } : undefined}
      >
        {conversations.map((conversation) => {
          const isActive = selectedConversation?.unique_name === conversation.unique_name;
          const subtitle =
            conversation.friendly_name || conversation.title || 'Conversation';
          return (
            <div
              key={conversation.unique_name}
              className={`lynx-list-chat-item d-flex align-items-center p-3 cursor-pointer border-bottom ${
                isActive ? 'active' : ''
              }`}
              onClick={() => handleConversationSelect(conversation)}
            >
              <div className="lynx-avatar">
                <img
                  src={fallbackAvatar}
                  alt="conversation"
                  className="rounded-circle"
                  width={48}
                  height={48}
                />
              </div>
              <div className="ms-3 flex-grow-1 overflow-hidden">
                <div className="d-flex justify-content-between align-items-center">
                  <p className="fw-semibold text-dark mb-0">
                    {conversation.title || 'Waiting for Service Partner'}
                  </p>
                </div>
                <p className="text-secondary small mb-0 text-truncate">
                  {subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMessages = (variant: 'normal' | 'fullscreen') => {
    const ref = variant === 'normal' ? normalMessagesRef : fullscreenMessagesRef;
    const containerClasses = 'lynx-messages flex-grow-1 p-3 overflow-auto';

    if (isLoadingMessages) {
      return (
        <div
          id={variant === 'normal' ? 'lynx-messages' : 'fullscreen-lynx-messages'}
          className={`${containerClasses} d-flex align-items-center justify-content-center`}
          ref={ref}
        >
          <div className="spinner-border text-primary" role="status" />
        </div>
      );
    }

    return (
      <div
        id={variant === 'normal' ? 'lynx-messages' : 'fullscreen-lynx-messages'}
        className={containerClasses}
        style={{ height: variant === 'normal' ? 320 : undefined }}
        ref={ref}
      >
        {!messages.length && !isLoadingMessages ? (
          <p className="text-dark mt-5 text-center">No messages found.</p>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.author === identity;
            const displayName = getDisplayName(message);
            return (
              <div
                key={message.sid}
                className={`d-flex mb-3 f-count ${
                  isCurrentUser ? 'justify-content-end' : ''
                }`}
              >
                <div className="align-items-start w-100 d-flex flex-column justify-content-end">
                  <div
                    className={`${
                      isCurrentUser
                        ? 'lynx-my-message chat-message-box-lynx ms-auto'
                        : 'lynx-message-oponent chat-message-box-lynx'
                    }`}
                  >
                    {!!displayName && (
                      <b className={`mb-1 fs-14 d-block ${isCurrentUser ? 'text-white' : 'text-dark'}`}>
                        {displayName}
                      </b>
                    )}
                    <p className={`mb-0 ${isCurrentUser ? 'text-white' : 'text-dark'}`}>
                      {message.body}
                    </p>
                    <p className={`small mb-0 mt-1 ms-auto chat-time ${isCurrentUser ? 'text-white' : 'text-secondary'}`}>
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderChatHeader = (variant: 'normal' | 'fullscreen') => {
    if (!selectedConversation) {
      return (
        <div className="d-flex align-items-center justify-content-between p-3 bg-yellow">
          <h2 className="fs-16 fw-semibold text-dark mb-0">Conversations</h2>
        </div>
      );
    }
    return (
      <div className="d-flex align-items-center justify-content-between p-3 bg-yellow">
        <div className="d-flex align-items-center">
          {variant === 'normal' && (
            <i
              className="uil uil-angle-left-b me-3 cursor-pointer"
              style={{ cursor: 'pointer' }}
              onClick={handleBackToContacts}
            />
          )}
          <div className="lynx-avatar">
            <img
              src={fallbackAvatar}
              alt="Chat avatar"
              className="rounded-circle"
              width={40}
              height={40}
            />
          </div>
          <div className="ms-3">
            <p className="fw-semibold text-dark mb-0">
              {selectedConversation.friendly_name || 'Conversation'}
            </p>
            <p className="fs-12 text-dark mb-0">
              {selectedConversation.title || ''}
            </p>
          </div>
        </div>
        <div className="d-flex align-items-center lynx-action-btn">
          {variant === 'normal' ? (
            <>
              <button
                id="expand-chat"
                className="btn btn-sm bg-white me-2 p-0 "
                onClick={handleExpandButtonClick}
              >
                <i className="uil uil-expand-arrows-alt" />
              </button>
              <button
                id="minimize-lynx-chat"
                className="btn btn-sm bg-white p-0 "
                onClick={handleMinimizeButtonClick}
              >
                <i className="uil uil-multiply" />
              </button>
            </>
          ) : (
            <button
              id="exit-fullscreen-lynx-chat"
              className="btn btn-sm bg-white closed-fullscreen-btn"
              onClick={handleExpandButtonClick}
            >
              <i className="uil uil-multiply" />
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderComposer = (variant: 'normal' | 'fullscreen') => (
    <div
      className={`border-top p-3 chat-msg-bottom ${
        isComposerDisabled ? 'd-none' : ''
      }`}
    >
      <div className="d-flex align-items-center">
        <input
          id={variant === 'normal' ? 'lynx-message-input' : 'fullscreen-lynx-message-input'}
          type="text"
          placeholder="Message..."
          className="form-control lynx-message-input"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isComposerDisabled}
        />
        <button
          id={variant === 'normal' ? 'send-button' : 'fullscreen-send-button'}
          className="btn btn-sm text-primary ms-2 px-2 py-1"
          onClick={handleSendMessage}
          disabled={isComposerDisabled}
        >
          <i className="uil uil-location-arrow fs-25 d-flex" style={{ lineHeight: 1 }} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div
        className="open-chat-btn position-fixed bottom-0 end-0 mb-md-3 me-md-3 mb-2 me-2 d-flex align-items-center justify-content-center "
        style={{ zIndex: 1000 }}
      >
        <button
          id="lynx-chat-button"
          className="lynx-chat-button btn btn-primary btn-icon shadow-lg"
          style={{ border: 'solid 1px #ffffff61' }}
          onClick={handleChatButtonClick}
        >
          <span className="d-flex align-items-center justify-content-center">
            <span className="d-flex position-relative me-2">
              <svg
                aria-label="Messages"
                fill="currentColor"
                height={24}
                role="img"
                viewBox="0 0 24 24"
                width={24}
              >
                <path
                  d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z"
                  fill="none"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
                <line
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  x1="7.488"
                  x2="15.515"
                  y1="12.208"
                  y2="7.641"
                />
              </svg>
            </span>
            Messages
          </span>
        </button>
      </div>

      {!isChatMinimized && (
        <div
          id="lynx-chat-container"
          className={`lynx-chat-container overflow-hidden lynx-fullscreen-animation-smooth position-fixed bottom-0 end-0 bg-white rounded-4 shadow d-flex flex-column ${
            isFullscreen ? 'lynx-fullscreen' : ''
          }`}
          style={{ width: 350 }}
        >
          {!!errorMessage && !errorMessage.toLowerCase().includes('already exists') && !errorMessage.toLowerCase().includes('member already') && (
            <div className="alert alert-danger rounded-0 mb-0">{errorMessage}</div>
          )}
          <div
            id="lynx-normal-layout"
            className={`d-flex flex-column h-100 w-100 ${isFullscreen ? 'd-none' : ''}`}
          >
            <div
              id="lynx-contacts-view"
              className={`d-flex flex-column h-100 ${
                selectedConversation ? 'd-none' : ''
              }`}
            >
              <div className="d-flex align-items-center justify-content-between p-3 bg-yellow">
                <div className="d-flex align-items-center">
                  <h2 className="fs-16 fw-semibold text-dark mb-0">Conversations</h2>
                </div>
                <div className="d-flex align-items-center lynx-action-btn">
                  <button
                    id="expand-contacts"
                    className="btn btn-sm bg-white me-2 p-0 "
                    onClick={handleExpandButtonClick}
                  >
                    <i className="uil uil-expand-arrows-alt" />
                  </button>
                  <button
                    id="lynx-contacts-minimize"
                    className="btn btn-sm bg-white p-0 "
                    onClick={handleMinimizeButtonClick}
                  >
                    <i className="uil uil-multiply" />
                  </button>
                </div>
              </div>
              {renderConversationList('normal')}
            </div>

            <div
              id="lynx-chat-view"
              className={`d-flex flex-column h-100 ${
                selectedConversation ? '' : 'd-none'
              }`}
            >
              {renderChatHeader('normal')}
              {renderMessages('normal')}
              {renderComposer('normal')}
            </div>
          </div>

          <div
            id="lynx-fullscreen-layout"
            className={`h-100 w-100 ${isFullscreen ? 'd-flex' : 'd-none'}`}
          >
            <div
              id="lynx-fullscreen-contacts"
              className="border-end border-light-subtle d-flex flex-column h-100"
              style={{ width: '20%' }}
            >
              <div className="d-flex align-items-center justify-content-between p-3 bg-yellow fullscreen-conversations-title">
                <div className="d-flex align-items-center">
                  <h2 className="fs-16 fw-semibold text-dark mb-0">Conversations</h2>
                </div>
              </div>
              {renderConversationList('fullscreen')}
            </div>
            <div
              id="lynx-fullscreen-chat"
              className="d-flex flex-column h-100"
              style={{ width: '80%' }}
            >
              {renderChatHeader('fullscreen')}
              {renderMessages('fullscreen')}
              {renderComposer('fullscreen')}
            </div>
          </div>
        </div>
      )}

      {(isClientInitializing || isLoadingConversations) && !isChatMinimized && (
        <div className="position-fixed bottom-0 end-0 me-4 mb-4">
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}
    </>
  );
};

export default ChatWidget;
