export interface MeetingsFormData {
  meetingId?: string;
  user_id:string
  description: string,
  title: string;
  startDate: string;
  endDate: string;
  thumbnail: string | null
  total_amount?:number
}

export interface Meetings {
  meetingId?: string;
  description: string;
  title: string;
  startDate: string;
  endDate: string;
  thumbnail: string | null;
  totalAmount?: number;
}

export interface Gradient {
  from: string;
    to: string;
}

export interface Members{
  meetingId: string;
  userId: string;
  role: string;
  images: string;
}
