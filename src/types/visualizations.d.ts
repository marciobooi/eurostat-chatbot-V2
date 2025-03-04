export type ChartType = 'pie' | 'line' | 'bar' | 'area';

export interface DataPoint {
  name?: string;
  value?: number;
  year?: string;
  country?: string;
  pipeline?: number;
  lng?: number;
}

export interface Visualization {
  type: ChartType;
  label: string;
  description: string;
  data: DataPoint[];
}

export interface FuelVisualization {
  visualizations: Visualization[];
  nextTopics: string[];
}

export interface VisualizationConfig {
  [fuelType: string]: FuelVisualization;
}

export interface VisualizationProps {
  type: ChartType;
  data: DataPoint[];
  description?: string;
}

export interface ChartColors {
  primary: string;
  secondary: string;
  tertiary: string;
  quaternary: string;
  background: string;
  grid: string;
  text: string;
}