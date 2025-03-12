"use client"
import React from 'react';
import { BarChart as Chart } from 'lucide-react';

export default function PredictionChart() {
  return (
    <div className="h-64 flex items-center justify-center">
      <div className="text-center text-gray-500">
        <Chart className="h-12 w-12 mx-auto mb-2" />
        <p>Prediction data visualization would go here</p>
        <p className="text-sm">Integration with real-time ML predictions required</p>
      </div>
    </div>
  );
}