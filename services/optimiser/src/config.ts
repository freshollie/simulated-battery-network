import process from 'process';

const config = {
  predictionsApi: process.env.PREDICTIONS_API ?? 'http://localhost:3000',
  batteryApi: process.env.BATTERY_API ?? 'http://localhost:4000',
  marketApi: process.env.MARKET_API ?? 'http://localhost:5000',
  analysisWindow: process.env.ANALYSIS_WINDOW_HOURS
    ? Number.parseInt(process.env.ANALYSIS_WINDOW_HOURS, 10)
    : 6,
};

export default config;
