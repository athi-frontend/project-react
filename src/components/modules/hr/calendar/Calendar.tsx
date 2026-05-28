"use client";
import React, { useState } from "react";
import { Typography, Popover } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MonthCalendar } from '@mui/x-date-pickers/MonthCalendar';
// @ts-ignore
import { DateTime } from 'luxon';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useRouter } from 'next/navigation';
import { CalendarProps, CalendarDay, Activity, TrainingScheduleData } from '@/types/components/modules/calendar';
import { useCalendarTrainingSchedule } from '@/hooks/modules/hr/useCalendar';
import { NUMBERMAP } from "@/constants/common";
import { 
  DAY_HEADERS, 
  CALENDAR_ROUTES, 
  CALENDAR_DATE_FORMATS, 
  CALENDAR_POPOVER 
} from '@/constants/modules/hr/calendar';
import {
  CalendarContainer,
  CalendarWrapper,
  CalendarHeader,
  NavigationContainer,
  NavigationButtons,
  NavButton,
  MonthYearContainer,
  MonthYearText,
  CalendarContent,
  CalendarGrid,
  ScrollableCalendarContainer,
  CalendarFullContainer,
  DayHeaderRow,
  DayHeader,
  CalendarRow,
  CalendarCell,
  HighlightedCell,
  HighlightedCellContent,
  DateNumber,
  ActivityContainer,
  ActivityList,
  ActivityItem,
  ActivityText,
  NavIconContainer,
  MonthPickerContainer,
  YearNavigationContainer,
  YearNavButton,
  YearText,
  DropdownIcon,
  monthPickerPopoverStyles,
  monthCalendarStyles,
  dateTypographyStyles,
  dateTypographyHighlightedStyles,
  highlightedCellBorderStyles,
  opacityStyles,
  yearNavIconStyles,
  navArrowIconStyles,
  calendarIconStyles,
  accessTimeIconStyles,
  activityTextHoverStyles,
  CALENDAR_DISPLAY
} from '@/styles/modules/hr/calendar'
import GlobalLoader from '@/components/shared/LoadingSpinner'
/**
    Classification : Confidential
**/

const Calendar: React.FC<CalendarProps> = ({
  month = new Date(),
  onDateClick,
  onActivityClick,
  onMonthChange,
  activeDates = [],
}) => {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(month);
  const [monthPickerAnchor, setMonthPickerAnchor] = useState<HTMLElement | null>(null);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(month.getFullYear());
  const [isNavigating, setIsNavigating] = useState(false);

  // Format month and year for API call
  const currentMonthStr = String(currentMonth.getMonth() + NUMBERMAP.ONE).padStart(NUMBERMAP.TWO, CALENDAR_DISPLAY.DATE_PADDING_CHAR);
  const currentYearStr = String(currentMonth.getFullYear());

  // Fetch training schedule data from API
  const { data: trainingScheduleData, isLoading: isCalendarScheduleLoading } = useCalendarTrainingSchedule(currentMonthStr, currentYearStr);

   /**
    * Function Name: generateCalendarDataFromAPI
     * Description: Converts API training data to calendar format,
     * Author: Athinarayanan,
     * Created: 09-09-2025,
     * Classification : Confidential
    **/
  const generateCalendarDataFromAPI = (apiData: any): CalendarDay[] => {
    // Handle different possible API response structures
    
    const dataArray: TrainingScheduleData[] = apiData?.data.data ?? [];

    if (dataArray.length === NUMBERMAP.ZERO) return [];

    const calendarData: CalendarDay[] = [];
    
    dataArray.forEach((schedule: TrainingScheduleData) => {
      const trainingDate = new Date(schedule.date_of_training);
      const year = trainingDate.getFullYear();
      const month = trainingDate.getMonth();
      const day = trainingDate.getDate();

      // Check if this date already exists in calendar data
      const trainingDateLuxon = DateTime.fromObject({ year, month: month + NUMBERMAP.ONE, day });
      const existingDateIndex = calendarData.findIndex(item => {
        const itemDateLuxon = DateTime.fromJSDate(item.date);
        return itemDateLuxon.hasSame(trainingDateLuxon, 'day') && 
               itemDateLuxon.hasSame(trainingDateLuxon, 'month') && 
               itemDateLuxon.hasSame(trainingDateLuxon, 'year');
      });

      const activity: Activity = {
        id: schedule.id.toString(),
        name: schedule.title,
      };

       if (existingDateIndex !== -NUMBERMAP.ONE) {
         // Add activity to existing date
         calendarData[existingDateIndex].activities ??= [];
         calendarData[existingDateIndex].activities!.push(activity);
       } else {
        // Create new date entry
        const newDate = DateTime.fromObject({ year, month: month + NUMBERMAP.ONE, day }).toJSDate();
        calendarData.push({
          date: newDate,
          isHighlighted: true,
          activities: [activity]
        });
      }
    });

    return calendarData;
  };

   /**
    * Function Name: calendarData
     * Description: Use API data if available, otherwise use provided activeDates,
     * Author: Athinarayanan,
     * Created: 09-09-2025,
     * Classification : Confidential
    **/
   const calendarData = React.useMemo(() => {
     if (activeDates.length > NUMBERMAP.ZERO) {
       return activeDates;
     }
     if (trainingScheduleData) {
       return generateCalendarDataFromAPI(trainingScheduleData);
     }
     return [];
   }, [activeDates, trainingScheduleData]);

   /**
     * Function Name: handlePrevMonth and handleNextMonth
     * Description: Handles previous and next month navigation,
     * Author: Athinarayanan,
     * Created: 09-09-2025,
     * Classification : Confidential
    **/
  const handlePrevMonth = () => {
    const currentMonthLuxon = DateTime.fromJSDate(currentMonth);
    const prevMonth = currentMonthLuxon.minus({ months: NUMBERMAP.ONE }).startOf('month').toJSDate();
    setCurrentMonth(prevMonth);
    setPickerYear(prevMonth.getFullYear());
    onMonthChange?.(prevMonth);
  };

  const handleNextMonth = () => {
    const currentMonthLuxon = DateTime.fromJSDate(currentMonth);
    const nextMonth = currentMonthLuxon.plus({ months: NUMBERMAP.ONE }).startOf('month').toJSDate();
    setCurrentMonth(nextMonth);
    setPickerYear(nextMonth.getFullYear());
    onMonthChange?.(nextMonth);
  };

    /**
    * Function Name: handleDateClick, handleActivityClick, handleActivityTitleClick
    * Description: Handles date selection and triggers callback, Handles activity selection and prevents date click, Navigates to training schedule edit page,
    * Author: Athinarayanan,
    * Created: 09-09-2025,
    * Classification : Confidential
   **/
  const handleDateClick = (date: Date) => {
    onDateClick?.(date);
  };

  const handleActivityClick = (activity: Activity, date: Date, event: React.MouseEvent) => {
    event.stopPropagation(); 
    onActivityClick?.(activity, date);
  };

  const handleActivityTitleClick = (activity: Activity, event: React.MouseEvent) => {
    event.stopPropagation(); 
    setIsNavigating(true);
    router.push(`${CALENDAR_ROUTES.TRAINING_SCHEDULE_EDIT}${activity.id}`);
  };

  /**
    * Function Name: handleMonthPickerClose
    * Description: Closes month picker and resets anchor,
    * Author: Athinarayanan,
    * Created: 09-09-2025,
    * Classification : Confidential
   **/
  const handleMonthPickerClose = () => {
    setIsMonthPickerOpen(false);
    setMonthPickerAnchor(null);
  };

  /**
    * Function Name: handleMonthChange
    * Description: Handles month change
    * Author: Athinarayanan,
    * Created: 09-09-2025,
    * Classification : Confidential
   **/
  const handleMonthChange = (newDate: Date | { toDate: () => Date } | { toJSDate: () => Date } | null) => {
    if (newDate) {
      // Handle different date types (Date, Dayjs, DateTime)
      let newDateLuxon: DateTime;
      if (newDate instanceof Date) {
        newDateLuxon = DateTime.fromJSDate(newDate);
      } else if (typeof newDate.toDate === 'function') {
        // Handle Dayjs objects
        newDateLuxon = DateTime.fromJSDate(newDate.toDate());
      } else if (typeof newDate.toJSDate === 'function') {
        // Handle Luxon DateTime objects
        newDateLuxon = newDate;
      } else {
        return;
      }
      
      const updatedDate = DateTime.fromObject({ 
        year: pickerYear, 
        month: newDateLuxon.month, 
        day: NUMBERMAP.ONE 
      }).toJSDate();
      setCurrentMonth(updatedDate);
      onMonthChange?.(updatedDate);
    }
    handleMonthPickerClose();
  };

   /**
    * Function Name: handlePrevYear, handleNextYear, handleMonthPickerOpen
    * Description: Handles year navigation (prev/next) and opens month picker with current year,
    * Author: Athinarayanan,
    * Created: 09-09-2025,
    * Classification : Confidential
   **/
  const handlePrevYear = () => {
    setPickerYear(prev => prev - NUMBERMAP.ONE);
  };

  const handleNextYear = () => {
    setPickerYear(prev => prev +  NUMBERMAP.ONE);
  };

  const handleMonthPickerOpen = (event: React.MouseEvent<HTMLElement>) => {
    setPickerYear(currentMonth.getFullYear());
    setMonthPickerAnchor(event.currentTarget);
    setIsMonthPickerOpen(true);
  };

  /**
    * Function Name: generateCalendarGrid
    * Description: Generates calendar grid with dates and activities for current month,
    * Author: Athinarayanan,
    * Created: 09-09-2025,
    * Classification : Confidential
   **/
  const generateCalendarGrid = () => {
    const currentMonthLuxon = DateTime.fromJSDate(currentMonth);
    const monthStart = currentMonthLuxon.startOf('month');
    const monthEnd = currentMonthLuxon.endOf('month');
    
    // Generate all days in the month
    const daysInMonth: Date[] = [];
    let currentDay = monthStart;
    while (currentDay <= monthEnd) {
      daysInMonth.push(currentDay.toJSDate());
      currentDay = currentDay.plus({ days: NUMBERMAP.ONE });
    }

    // Group days into weeks
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    // Add empty cells for days before the first day of the month
    const firstDayOfWeek = monthStart.weekday; // Luxon uses 1-7 for Monday-Sunday
    const adjustedFirstDay = firstDayOfWeek === NUMBERMAP.SEVEN ? NUMBERMAP.ZERO : firstDayOfWeek; // Convert to 0-6 for Sunday-Saturday
    for (let i = NUMBERMAP.ZERO; i < adjustedFirstDay; i++) {
      const prevDay = monthStart.minus({ days: adjustedFirstDay - i });
      currentWeek.push(prevDay.toJSDate());
    }

    daysInMonth.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === NUMBERMAP.SEVEN) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    // Add remaining days to complete the last week
    if (currentWeek.length > NUMBERMAP.ZERO) {
      const remainingDays = NUMBERMAP.SEVEN - currentWeek.length;
      for (let i = NUMBERMAP.ONE; i <= remainingDays; i++) {
        const nextDay = monthEnd.plus({ days: i });
        currentWeek.push(nextDay.toJSDate());
      }
      weeks.push(currentWeek);
    }

    return weeks;
  };

  /**
    * Function Name: findActivityForDate
    * Description: Finds activity for a given date,
    * Author: Athinarayanan,
    * Created: 09-09-2025,
    * Classification : Confidential
   **/
  const findActivityForDate = (date: Date) => {
    // Use current calendar data
    const dateLuxon = DateTime.fromJSDate(date);
    return calendarData.find((item: CalendarDay) => {
      const itemDateLuxon = DateTime.fromJSDate(item.date);
      return itemDateLuxon.hasSame(dateLuxon, 'day') && 
             itemDateLuxon.hasSame(dateLuxon, 'month') && 
             itemDateLuxon.hasSame(dateLuxon, 'year');
    });
  };

  /**
    * Function Name: renderCalendarCell
    * Description: Renders calendar cell with date and activities for current month,
    * Author: Athinarayanan,
    * Created: 09-09-2025,
    * Classification : Confidential
   **/
  const renderCalendarCell = (date: Date, isCurrentMonth: boolean) => {
    const dayData = findActivityForDate(date);
    const dateLuxon = DateTime.fromJSDate(date);
    const dateNumber = dateLuxon.day;

    if (!isCurrentMonth) {
      return (
        <CalendarCell key={date.toISOString()} sx={opacityStyles}>
          <Typography sx={dateTypographyStyles}>
            {dateNumber.toString().padStart(NUMBERMAP.TWO, CALENDAR_DISPLAY.DATE_PADDING_CHAR)}
          </Typography>
        </CalendarCell>
      );
    }

    if (dayData?.isHighlighted && dayData?.activities) {
      return (
        <HighlightedCell key={date.toISOString()} onClick={() => handleDateClick(date)}>
          <HighlightedCellContent>
            <DateNumber>
              <Typography sx={dateTypographyHighlightedStyles}>
                {dateNumber.toString().padStart(NUMBERMAP.TWO, CALENDAR_DISPLAY.DATE_PADDING_CHAR)}
              </Typography>
            </DateNumber>
            <ActivityContainer>
              <ActivityList>
                {dayData.activities.map((activity: Activity, index: number) => (
                  <ActivityItem 
                    key={activity.id}
                    onClick={(event) => handleActivityClick(activity, date, event)}
                  >
                    {index < NUMBERMAP.THREE && (
                    <AccessTimeIcon sx={accessTimeIconStyles} />
                  )}
                    <ActivityText
                      onClick={(event) => handleActivityTitleClick(activity, event)}
                      sx={activityTextHoverStyles}
                    >
                      {activity.name}
                    </ActivityText>
                  </ActivityItem>
                ))}
              </ActivityList>
            </ActivityContainer>
          </HighlightedCellContent>
        </HighlightedCell>
      );
    } else if (dayData?.isHighlighted) {
      return (
        <CalendarCell
          key={date.toISOString()}
          onClick={() => handleDateClick(date)}
          sx={highlightedCellBorderStyles}
        >
          <Typography sx={dateTypographyStyles}>
            {dateNumber.toString().padStart(NUMBERMAP.TWO, CALENDAR_DISPLAY.DATE_PADDING_CHAR)}
          </Typography>
        </CalendarCell>
      );
    } else {
      return (
        <CalendarCell key={date.toISOString()} onClick={() => handleDateClick(date)}>
          <Typography sx={dateTypographyStyles}>
            {dateNumber.toString().padStart(NUMBERMAP.TWO, CALENDAR_DISPLAY.DATE_PADDING_CHAR)}
          </Typography>
        </CalendarCell>
      );
    }
  };

  const calendarWeeks = generateCalendarGrid();

  // Reset navigation loading state when component unmounts
  React.useEffect(() => {
    return () => {
      setIsNavigating(false);
    };
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <GlobalLoader loading={isCalendarScheduleLoading ?? isNavigating}/>
      <CalendarContainer>
        <CalendarWrapper>
          <CalendarHeader>
            <NavigationContainer>
              <NavigationButtons>
                <NavButton onClick={handlePrevMonth}>
                  <NavIconContainer>
                    <ArrowBackIosIcon sx={navArrowIconStyles} />
                  </NavIconContainer>
                </NavButton>
                <NavButton onClick={handleNextMonth}>
                  <NavIconContainer>
                    <ArrowForwardIosIcon sx={navArrowIconStyles} />
                  </NavIconContainer>
                </NavButton>
              </NavigationButtons>
              <MonthYearContainer onClick={handleMonthPickerOpen}>
                <MonthYearText>
                  {DateTime.fromJSDate(currentMonth).toFormat(CALENDAR_DATE_FORMATS.MONTH_YEAR)}
                </MonthYearText>
                <DropdownIcon>
                  <CalendarTodayIcon sx={calendarIconStyles} />
                </DropdownIcon>
              </MonthYearContainer>
            </NavigationContainer>
          </CalendarHeader>

          <CalendarContent>
            <CalendarGrid>
              <ScrollableCalendarContainer>
                <CalendarFullContainer>
                  <DayHeaderRow>
                    {DAY_HEADERS.map((day) => (
                      <DayHeader key={day}>
                        <Typography>{day}</Typography>
                      </DayHeader>
                    ))}
                  </DayHeaderRow>

                      {calendarWeeks.map((week, weekIndex) => {
                     // Create a unique key using the first date of the week
                     const weekKey = week[NUMBERMAP.ZERO] ? `week-${week[NUMBERMAP.ZERO].getTime()}` : `week-${weekIndex}`;
                     return (
                       <CalendarRow key={weekKey}>
                         {week.map((date) => {
                           const dateLuxon = DateTime.fromJSDate(date);
                           const currentMonthLuxon = DateTime.fromJSDate(currentMonth);
                           const isCurrentMonth = dateLuxon.hasSame(currentMonthLuxon, 'month');
                           return renderCalendarCell(date, isCurrentMonth);
                         })}
                       </CalendarRow>
                     );
                   })}
                </CalendarFullContainer>
              </ScrollableCalendarContainer>
            </CalendarGrid>
          </CalendarContent>
        </CalendarWrapper>

        {/* Month Picker Popover */}
        <Popover
          open={isMonthPickerOpen}
          anchorEl={monthPickerAnchor}
          onClose={handleMonthPickerClose}
          anchorOrigin={CALENDAR_POPOVER.ANCHOR_ORIGIN}
          transformOrigin={CALENDAR_POPOVER.TRANSFORM_ORIGIN}
          sx={monthPickerPopoverStyles}
        >
          <MonthPickerContainer>
            {/* Custom Year Navigation Header */}
            <YearNavigationContainer>
              <YearNavButton
                onClick={handlePrevYear}
                size={CALENDAR_POPOVER.SMALL}
              >
                <ArrowBackIosIcon sx={yearNavIconStyles} />
              </YearNavButton>

              <YearText>
                {pickerYear}
              </YearText>

              <YearNavButton
                onClick={handleNextYear}
                size={CALENDAR_POPOVER.SMALL}
              >
                <ArrowForwardIosIcon sx={yearNavIconStyles} />
              </YearNavButton>
            </YearNavigationContainer>

            {/* Month Calendar */}
            <MonthCalendar
              value={new Date(pickerYear, currentMonth.getMonth(), NUMBERMAP.ONE)}
              onChange={handleMonthChange as any}
              sx={monthCalendarStyles}
            />
          </MonthPickerContainer>
        </Popover>
      </CalendarContainer>
    </LocalizationProvider>
  );
};

export default Calendar;
