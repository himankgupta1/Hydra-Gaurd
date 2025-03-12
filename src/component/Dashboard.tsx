"use client";
import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import {
  Activity,
  Droplets,
  AlertTriangle,
  Settings,
  Calendar,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import SensorCard from "./SensorCard";

interface SensorData {
  id: string;
  location: string;
  type: "pressure" | "flow" | "quality"; 
  value: number;
  timestamp: string;
  status: "normal" | "warning" | "critical"; 
  prediction: {
    failureProbability: number;
    estimatedTimeToFailure: number;
    recommendedAction: string;
  };
}


const initialSensorData: SensorData[] = [
  {
    id: "1",
    location: "North Plant",
    type: "pressure",
    value: 45.2,
    timestamp: new Date().toISOString(),
    status: "normal",
    prediction: {
      failureProbability: 0.12,
      estimatedTimeToFailure: 168,
      recommendedAction: "Schedule inspection within 2 weeks",
    },
  },
  {
    id: "2",
    location: "South Pipeline",
    type: "flow",
    value: 120.5,
    timestamp: new Date().toISOString(),
    status: "warning",
    prediction: {
      failureProbability: 0.45,
      estimatedTimeToFailure: 72,
      recommendedAction: "Immediate inspection required",
    },
  },
];

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData[]>(initialSensorData);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    async function loadModel() {
      try {
        
        const newModel = tf.sequential();
        newModel.add(tf.layers.dense({ inputShape: [1], units: 1 }));
        newModel.compile({ optimizer: "sgd", loss: "meanSquaredError" });

        setModel(newModel);
        setLoading(false);
      } catch (error) {
        console.error("Error loading model:", error);
      }
    }

    loadModel();
  }, []);

  
  const processSensorData = async () => {
    if (!model) return;

    const processedData = await Promise.all(
      sensorData.map(async (sensor) => {
        const inputTensor = tf.tensor2d([[sensor.value]]);
        const outputTensor = model.predict(inputTensor) as tf.Tensor;
        const predictedValue = (await outputTensor.data())[0];

    
        let newStatus: "normal" | "warning" | "critical";
        if (predictedValue > 80) {
          newStatus = "critical";
        } else if (predictedValue > 50) {
          newStatus = "warning";
        } else {
          newStatus = "normal";
        }

        return {
          ...sensor,
          value: parseFloat(predictedValue.toFixed(2)), 
          status: newStatus,
        };
      })
    );

    setSensorData(processedData);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      
      <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplets className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold">HydroGuard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-blue-700 rounded-lg" aria-label="Settings">
              <Settings className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </nav>

      
      <main className="container mx-auto px-6 py-8">
        
        <div className="flex justify-center mb-6">
          <button
            onClick={processSensorData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Loading Model..." : "Process Data in ML model"}
          </button>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Sensors</p>
                <p className="text-2xl font-semibold">{sensorData.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Predicted Issues</p>
                <p className="text-2xl font-semibold">
                  {sensorData.filter((s) => s.status !== "normal").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Maintenance Tasks</p>
                <p className="text-2xl font-semibold">8</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Processed Sensor Data</h2>
            <div className="space-y-4">
              {sensorData.map((sensor) => (
                <SensorCard key={sensor.id} sensor={sensor} />
              ))}
            </div>
          </div>

          
          <div className="bg-gray-50 rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Failure Predictions</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
