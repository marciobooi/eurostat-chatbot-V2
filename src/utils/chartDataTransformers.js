/**
 * Utility functions to transform Eurostat API data for different chart types
 */

/**
 * Transform data for pie chart visualization using nrg_bal
 */
export const transformPieChartData = (data, nrg_bal) => {
  if (!data?.value || !data?.dimension?.nrg_bal?.category?.index) {
    console.error('Invalid data structure received:', data);
    return [];
  }

  const values = data.value;
  const indexes = data.dimension.nrg_bal.category.index;
  const labels = data.dimension.nrg_bal.category.label || {};
  
  return nrg_bal.map(bal => ({
    name: labels[bal] || bal,
    value: values[indexes[bal]] || 0,
    code: bal
  }));
};

/**
 * Transform data for line chart visualization using all available years
 */
export const transformLineChartData = (data) => {
  if (!data?.value || !data?.dimension?.time?.category) {
    console.error('Invalid data structure received:', data);
    return [];
  }

  const values = data.value;
  const timeIndex = data.dimension.time.category.index;
  const timeLabels = data.dimension.time.category.label || {};
  
  return Object.entries(timeIndex).map(([year, index]) => ({
    year: timeLabels[year] || year,
    value: values[index] || 0,
    code: year
  })).sort((a, b) => a.year.localeCompare(b.year)); // Sort by year ascending
};

/**
 * Transform data for bar chart visualization using last 5 years and summing fuels
 */
export const transformBarChartData = (data) => {
  if (!data?.value || !data?.dimension?.time?.category) {
    console.error('Invalid data structure received:', data);
    return [];
  }

  const values = data.value;
  const timeIndex = data.dimension.time.category.index;
  const timeLabels = data.dimension.time.category.label || {};
  
  // Get last 5 years
  const years = Object.keys(timeIndex)
    .sort((a, b) => b.localeCompare(a)) // Sort descending
    .slice(0, 5); // Take last 5 years
  
  // Sum all fuel values for each year
  return years.map(year => {
    const yearIndex = timeIndex[year];
    const yearData = values[yearIndex] || 0;
    
    return {
      year: timeLabels[year] || year,
      value: yearData,
      code: year
    };
  }).sort((a, b) => a.year.localeCompare(b.year)); // Sort by year ascending
};