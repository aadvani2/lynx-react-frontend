export interface ScheduleHistoryEntry {
  id: number;
  request_id: number;
  sender: number;
  sender_type: string;
  receiver: number;
  receiver_type: string;
  new_schedule: string;
  is_accepted: number;
  final_status: string;
  notes: string | null;
  decline_reason: string | null;
  created_at: string;
  updated_at: string;
  sender_name: string;
  receiver_name: string;
}

export interface ScheduleHistoryResponse {
  success: boolean;
  message: string;
  data: {
    user_timezone: number;
    historys: ScheduleHistoryEntry[];
  };
}
