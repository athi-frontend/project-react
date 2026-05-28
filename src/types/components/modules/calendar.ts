export interface Activity {
  id: string;
  name: string;
  icon?: string;
}

export interface TrainingScheduleData {
  id: number;
  title: string;
  date_of_training: string;
  mode_of_training: string;
  trainer_competency: string;
  training_materials: string;
  location: string;
  trainer: number;
  trainer_first_name: string;
  trainer_last_name: string;
  status: number;
  is_training_schedule_evaluated: number;
}

export interface CalendarDay {
  date: Date;
  activities?: Activity[];
  isHighlighted?: boolean;
}

export interface CalendarProps {
  month?: Date;
  onDateClick?: (date: Date) => void;
  onActivityClick?: (activity: Activity, date: Date) => void;
  onMonthChange?: (date: Date) => void;
  activeDates?: CalendarDay[];
}

export interface CalendarState {
  currentMonth: Date;
  monthPickerAnchor: HTMLElement | null;
  isMonthPickerOpen: boolean;
  pickerYear: number;
}

export interface CalendarHandlers {
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleDateClick: (date: Date) => void;
  handleMonthPickerClose: () => void;
  handleMonthChange: (newDate: Date | null) => void;
  handlePrevYear: () => void;
  handleNextYear: () => void;
  handleMonthPickerOpen: (event: React.MouseEvent<HTMLElement>) => void;
}
