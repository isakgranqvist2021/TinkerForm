export interface StatsDto {
  currentMonth: {
    totalResponses: number;
    completedResponses: number;
  };
  previousMonth: {
    totalResponses: number;
    completedResponses: number;
  };
}
