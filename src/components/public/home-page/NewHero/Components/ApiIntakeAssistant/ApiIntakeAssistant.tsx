import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  aiIntakeChatService,
  type IntakeChatResponse,
  type IntakeMissingField,
} from "../../../../../../services/generalServices/aiIntakeChatService";
import { servicesService } from "../../../../../../services/generalServices/servicesService";
import { useAuthStore } from "../../../../../../store/authStore";
import { updateSessionData } from "../../../../../../utils/sessionDataManager";
import "./AIConversationAgent.css";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface ApiIntakeAssistantProps {
  zipCode: string;
  onZipCodeChange: (zipCode: string) => void;
}

export default function ApiIntakeAssistant({
  zipCode,
  onZipCodeChange,
}: ApiIntakeAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm the API Assistant. I'll help you share your issue, location, and timing so we can find the right service provider. What can I help you with in your home?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [lastResponse, setLastResponse] = useState<IntakeChatResponse | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Center chat box and focus input when component mounts
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });

      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, []);

  // Auto-scroll to bottom when messages or loading state change
  useEffect(() => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const appendMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const sendMessage = async (userMessage: string) => {
    const trimmed = userMessage.trim();
    if (!trimmed || isLoading) return;

    // Append user message
    appendMessage({ role: "user", content: trimmed });
    setInputValue("");
    setIsLoading(true);

    try {
      const payload = conversationId
        ? { conversationId, userMessage: trimmed }
        : { userMessage: trimmed };

      const response = await aiIntakeChatService.sendMessage(payload);
      setLastResponse(response);

      // Update conversationId for subsequent messages
      if (response.conversationId) {
        setConversationId(response.conversationId);
      }

      // Update collected zipcode -> sync with main zip state
      if (response.collected?.zipcode) {
        onZipCodeChange(response.collected.zipcode);
      }

      // Append assistant message
      appendMessage({ role: "assistant", content: response.botMessage });
    } catch (error) {
      console.error("Intake chat error:", error);
      const msg =
        error instanceof Error
          ? error.message
          : "Sorry, I had trouble talking to the server. Please try again.";
      appendMessage({ role: "assistant", content: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleSpListClick = async () => {
    if (!lastResponse) return;

    const { collected } = lastResponse;
    
    // Sanitize zipcode (same as SearchForm)
    const sanitizeZip = (value: string) => value.replace(/\D/g, "").slice(0, 5);
    const zipcodeValue = sanitizeZip(collected.zipcode || zipCode || "");
    
    if (zipcodeValue.length !== 5) {
      appendMessage({
        role: "assistant",
        content: "I still need your ZIP code before I can show providers.",
      });
      return;
    }

    // Extract service name from API response structure
    // API provides: serviceCategory: { id, name }, serviceSubcategory: { id, name }, service: string, service_id: number
    const serviceCategoryName = collected.serviceCategory?.name || "";
    const serviceSubcategoryName = collected.serviceSubcategory?.name || "";
    const serviceName = collected.service || "";
    
    // Build service name similar to SearchForm format: "Subcategory > Service"
    let formattedServiceName = "";
    if (serviceSubcategoryName && serviceName) {
      formattedServiceName = `${serviceSubcategoryName} > ${serviceName}`;
    } else if (serviceName) {
      formattedServiceName = serviceName;
    } else if (serviceSubcategoryName) {
      formattedServiceName = serviceSubcategoryName;
    } else if (serviceCategoryName) {
      formattedServiceName = serviceCategoryName;
    }

    if (!formattedServiceName || formattedServiceName.trim() === "") {
      appendMessage({
        role: "assistant",
        content: "I need to know what service you need before I can show providers.",
      });
      return;
    }

    // Extract service_id from API response (convert number to string)
    const serviceId = collected.service_id ? String(collected.service_id) : "";
    const isEmergency = collected.isEmergency === true;
    const when = isEmergency ? "emergency" : "schedule";
    const serviceTier = isEmergency ? 1 : 3;
    
    // Format date for service_search API
    // For emergency: always use "Now" (regardless of scheduleDate in response)
    // For scheduled: combine scheduleDate and scheduleTime
    let scheduleTime = "";
    if (isEmergency) {
      // Emergency services always use "Now" - ignore scheduleDate/scheduleTime if present
      scheduleTime = "Now";
    } else {
      // Scheduled service: need both date and time
      if (collected.scheduleDate && collected.scheduleTime) {
        // Format: "YYYY-MM-DD HH:mm" (24-hour format)
        // scheduleDate is "2025-12-20", scheduleTime is "12:00"
        scheduleTime = `${collected.scheduleDate} ${collected.scheduleTime}`;
      } else if (collected.scheduleDate) {
        // If only date is provided, use date with default time (00:00)
        scheduleTime = `${collected.scheduleDate} 00:00`;
      }
      // If neither date nor time, scheduleTime remains empty string
    }

    // Update zipCode in parent component
    onZipCodeChange(zipcodeValue);

    // Build query parameters for navigation and URL persistence (same as SearchForm)
    const queryParams = new URLSearchParams();
    queryParams.set("service", formattedServiceName);
    queryParams.set("location", zipcodeValue);
    if (serviceId) {
      queryParams.set("service_id", serviceId);
    }
    queryParams.set("when", when);
    if (when === "schedule" && scheduleTime) {
      queryParams.set("date", scheduleTime);
    }

    try {
      // Store session data before service search (same as SearchForm)
      const sessionPayload = {
        service: formattedServiceName,
        service_id: serviceId,
        zipCode: zipcodeValue,
        serviceTier: String(serviceTier),
        date: scheduleTime,
      };
      
      // Check if user is authenticated before calling API
      const isAuthenticated = useAuthStore.getState().isAuthenticated;
      if (!isAuthenticated) {
        updateSessionData(sessionPayload as any);
      } else {
        // Post-login flow: Call API
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await servicesService.storeSessionData(sessionPayload as any);
        } catch (error) {
          console.error("Error storing session data:", error);
          // Continue with search even if session storage fails
        }
      }

      // Call service_search API with actual IDs from API response
      const response = await servicesService.serviceSearch({
        service: formattedServiceName,
        service_id: serviceId,
        zipCode: zipcodeValue,
        serviceTier: String(serviceTier),
        date: scheduleTime,
      });

      // Log response for debugging (optional)
      if (response && (response.success || response.data)) {
        console.log("Service search successful", response);
      }
    } catch (error) {
      console.error("Search error:", error);
      // Continue with navigation even if API call fails
    }

    // Navigate to search results page with query params and state (same as SearchForm)
    navigate(`/search?${queryParams.toString()}`, {
      state: {
        service: formattedServiceName,
        location: zipcodeValue,
        when: when,
        service_id: serviceId,
        serviceTier: serviceTier,
        date: scheduleTime,
      },
    });
  };

  const missingFieldsLabel = (field: IntakeMissingField) => {
    switch (field) {
      case "serviceCategory":
        return "Service category";
      case "serviceSubcategory":
        return "Service subcategory";
      case "service":
        return "Service";
      case "isEmergency":
        return "Emergency vs scheduled";
      case "zipcode":
        return "ZIP code";
      case "description":
        return "Description";
      default:
        return field;
    }
  };

  const showSpListButton = lastResponse?.showSpListButton === true;

  return (
    <div ref={containerRef} className="ai-agent">
      <div
        ref={messagesContainerRef}
        className="ai-agent__messages"
        role="log"
        aria-live="polite"
      >
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`ai-agent__message ai-agent__message--${message.role}`}
          >
            {message.content}
          </div>
        ))}

        {isLoading && (
          <div className="ai-agent__message ai-agent__message--assistant ai-agent__typing">
            <span className="ai-agent__typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </span>
            Assistant is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Summary of what we have so far (optional but helpful) */}
      {lastResponse && (
        <div className="ai-agent__summary-panel">
          <div className="ai-agent__summary-row">
            <span>Service:</span>
            <strong>
              {lastResponse.collected.service ||
                lastResponse.collected.serviceSubcategory?.name ||
                lastResponse.collected.serviceCategory?.name ||
                "—"}
            </strong>
          </div>
          <div className="ai-agent__summary-row">
            <span>ZIP code:</span>
            <strong>{lastResponse.collected.zipcode || zipCode || "—"}</strong>
          </div>
          <div className="ai-agent__summary-row">
            <span>When:</span>
            <strong>
              {lastResponse.collected.isEmergency === true
                ? "Emergency"
                : lastResponse.collected.isEmergency === false
                ? "Scheduled"
                : "—"}
            </strong>
          </div>
          {Array.isArray(lastResponse.missingFields) &&
            lastResponse.missingFields.length > 0 && (
              <div className="ai-agent__summary-missing">
                <span>Still needed:</span>
                <strong>
                  {lastResponse.missingFields
                    .map((f) => missingFieldsLabel(f))
                    .join(", ")}
                </strong>
              </div>
            )}
        </div>
      )}

      {/* SP List button when conversation is complete */}
      {showSpListButton && (
        <div className="ai-agent__providers-button-wrapper">
          <button
            type="button"
            className="ai-agent__providers-button"
            onClick={handleSpListClick}
          >
            View Service Providers
          </button>
        </div>
      )}

      <form className="ai-agent__input-wrapper" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Type your response..."
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          className="ai-agent__input"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="ai-agent__send"
          disabled={!inputValue.trim() || isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
}


