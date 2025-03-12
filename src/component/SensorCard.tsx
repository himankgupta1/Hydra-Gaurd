"use client"
import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { SensorData } from '../types';

interface SensorCardProps {
  sensor: SensorData;
}

export default function SensorCard({ sensor }: SensorCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'warning':
        return 'text-yellow-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-green-500';
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-medium">{sensor.location}</h3>
          <p className="text-sm text-gray-500">{sensor.type}</p>
        </div>
        {sensor.status === 'normal' ? (
          <CheckCircle className={`h-5 w-5 ${getStatusColor(sensor.status)}`} />
        ) : (
          <AlertCircle className={`h-5 w-5 ${getStatusColor(sensor.status)}`} />
        )}
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Current Value:</span>
          <span className="font-medium">{sensor.value}</span>
        </div>
        {sensor.prediction && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Failure Probability:</span>
              <span className="font-medium">{(sensor.prediction.failureProbability * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Time to Failure:</span>
              <span className="font-medium">{sensor.prediction.estimatedTimeToFailure}h</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}