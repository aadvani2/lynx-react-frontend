export interface RequestDetailsBody {
  id: number;
  type: string;
  user_timezone: number;
  currentPage: number;
}

export interface RequestDetailsResponse {
  success: boolean;
  request_status: string;
  data: {
    request: {
      service_tier_tag: string;
      id: number;
      request_id: number;
      status: string;
      payment_status: string;
      total: number;
      payable_amount: number;
      duration: number;
      address: string;
      city: string;
      state: string;
      zip_code: string;
      contact_person: string;
      phone: string;
      dial_code: string;
      country_code: string;
      description: string;
      scheduled_date: string;
      scheduled_time: string;
      verification_code: string | null;
      notes: string;
      created_at: string;
      updated_at: string;
      accepted_time: string;
      inprocess_time: string;
      completed_time: string | null;
      cancellation_time: string | null;
      cancel_user_type: string | null;
      cancel_reason: string | null;
      customer: {
        id: number;
        name: string;
        email: string;
        phone: string;
        dial_code: string;
        country_code: string;
      };
      provider: {
        id: number;
        name: string;
        email: string;
        phone: string;
        dial_code: string;
      };
      member: {
        id: number;
        name: string;
        email: string;
        phone: string;
        dial_code: string;
        country_code: string;
        phone2: string;
        dial_code2: string;
        country_code2: string;
        image: string;
        description: string;
        birth_date: string;
        avg_rating: number;
        status: string;
        availability: number;
      };
      category_name: string;
      services_name: string;
      sub_category_name: string;
      final_status: string;
      sender: number;
      receiver: number;
      sender_type: string;
      schedule_time: string;
      schedule_msg: string;
      auth_id: number;
      auth_email: string;
      credit: number;
      payment_method_details: any;
      auto_refund_time: number;
      progress_percentage?: number;
    };
    type: string;
    currentPage: number;
    request_duration: string;
    user_timezone: number;
    status_icon: string;
    message: string;
    cancel_alert_message: string;
    channel_name: string;
    buttons: {
      btn_chat: number;
      btn_chat_send: number;
      btn_accept: number;
      btn_decline: number;
      btn_propose_schedule: number;
      btn_history: number;
      btn_cancel: number;
      btn_complete: number;
    };
    hold_req_msg: string;
  };
}
