/**
 * Configuration for fuel-specific visualizations
 */
export const visualizationConfig = {
  oil: {
    visualizations: [
      {
        type: 'pie',
        label: 'Top 5 Oil Consuming Countries',
        description: 'Distribution of oil consumption across top European countries',
        data: [
          { name: 'Germany', value: 112.5 },
          { name: 'France', value: 78.9 },
          { name: 'Italy', value: 71.2 },
          { name: 'Spain', value: 65.8 },
          { name: 'Netherlands', value: 48.4 }
        ]
      },
      {
        type: 'line',
        label: 'Oil Consumption Timeline',
        description: 'Historical oil consumption trends in Europe (million tonnes)',
        data: [
          { year: '2015', value: 560 },
          { year: '2016', value: 565 },
          { year: '2017', value: 575 },
          { year: '2018', value: 580 },
          { year: '2019', value: 585 },
          { year: '2020', value: 520 }
        ]
      },
      {
        type: 'bar',
        label: 'Oil Import Dependencies',
        description: 'Oil import dependency rates by country (%)',
        data: [
          { country: 'Cyprus', value: 98.8 },
          { country: 'Malta', value: 98.5 },
          { country: 'Luxembourg', value: 98.0 },
          { country: 'Ireland', value: 97.2 },
          { country: 'Belgium', value: 96.8 }
        ]
      }
    ],
    nextTopics: ['natural gas', 'renewable energy']
  },
  'natural gas': {
    visualizations: [
      {
        type: 'pie',
        label: 'Top Gas Consumers',
        description: 'Top natural gas consuming countries in Europe',
        data: [
          { name: 'Germany', value: 95.2 },
          { name: 'Italy', value: 74.3 },
          { name: 'France', value: 41.8 },
          { name: 'Netherlands', value: 39.5 },
          { name: 'Spain', value: 32.1 }
        ]
      },
      {
        type: 'area',
        label: 'Gas Supply Sources',
        description: 'Natural gas supply sources over time',
        data: [
          { year: '2015', pipeline: 350, lng: 50 },
          { year: '2016', pipeline: 360, lng: 55 },
          { year: '2017', pipeline: 370, lng: 65 },
          { year: '2018', pipeline: 380, lng: 75 },
          { year: '2019', pipeline: 350, lng: 90 },
          { year: '2020', pipeline: 320, lng: 110 }
        ]
      }
    ],
    nextTopics: ['renewable energy', 'oil']
  },
  'renewable energy': {
    visualizations: [
      {
        type: 'pie',
        label: 'Renewable Energy Mix',
        description: 'Distribution of different renewable sources',
        data: [
          { name: 'Wind', value: 36 },
          { name: 'Hydro', value: 33 },
          { name: 'Solar', value: 14 },
          { name: 'Biofuels', value: 12 },
          { name: 'Other', value: 5 }
        ]
      },
      {
        type: 'line',
        label: 'Growth Trends',
        description: 'Renewable energy growth over time',
        data: [
          { year: '2015', value: 16.7 },
          { year: '2016', value: 17.0 },
          { year: '2017', value: 17.5 },
          { year: '2018', value: 18.0 },
          { year: '2019', value: 19.7 },
          { year: '2020', value: 22.1 }
        ]
      },
      {
        type: 'bar',
        label: 'Country Leaders',
        description: 'Top countries by renewable energy share',
        data: [
          { country: 'Sweden', value: 60.1 },
          { country: 'Finland', value: 43.8 },
          { country: 'Latvia', value: 42.1 },
          { country: 'Denmark', value: 37.8 },
          { country: 'Austria', value: 36.5 }
        ]
      }
    ],
    nextTopics: ['wind power', 'solar energy']
  }
};