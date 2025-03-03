export const visualizationConfig = {
  oil: {
    visualizations: [
      {
        type: 'pie',
        label: 'Top 5 Oil Consuming Countries',
        description: 'View pie chart of top 5 oil consuming countries in Europe'
      },
      {
        type: 'line',
        label: 'Oil Consumption Timeline',
        description: 'View historical oil consumption trends'
      },
      {
        type: 'bar',
        label: 'Oil Import Dependencies',
        description: 'Compare oil import dependencies across EU countries'
      }
    ],
    nextTopics: ['natural gas', 'renewable energy']
  },
  'natural gas': {
    visualizations: [
      {
        type: 'pie',
        label: 'Top Gas Consumers',
        description: 'View top natural gas consuming countries'
      },
      {
        type: 'area',
        label: 'Gas Supply Sources',
        description: 'View gas supply sources over time'
      },
      {
        type: 'line',
        label: 'Price Trends',
        description: 'Natural gas price evolution'
      }
    ],
    nextTopics: ['renewable energy', 'oil']
  },
  'renewable energy': {
    visualizations: [
      {
        type: 'pie',
        label: 'Renewable Energy Mix',
        description: 'Distribution of different renewable sources'
      },
      {
        type: 'line',
        label: 'Growth Trends',
        description: 'Renewable energy growth over time'
      },
      {
        type: 'bar',
        label: 'Country Comparison',
        description: 'Renewable energy share by country'
      }
    ],
    nextTopics: ['wind power', 'solar energy']
  }
};