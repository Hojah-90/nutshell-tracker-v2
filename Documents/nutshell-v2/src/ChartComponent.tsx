import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export {}; // Satisfies isolatedModules by marking this as a module

interface ChartProps {
  subjects: string[] | undefined;
  checkboxes: boolean[][] | undefined;
}

const ChartComponent: React.FC<ChartProps> = ({ subjects, checkboxes }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Validate props before attempting to render the chart
  const isValidData = (): boolean => {
    if (!subjects || !checkboxes) return false;
    if (subjects.length === 0 || checkboxes.length === 0) return false;
    if (subjects.length !== checkboxes.length) return false;
    if (!checkboxes.every(row => Array.isArray(row) && row.length === 31)) return false;
    return subjects.some(subject => subject && subject.trim() !== '');
  };

  useEffect(() => {
    if (!canvasRef.current || !isValidData()) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Type guard to ensure subjects and checkboxes are defined within this scope
    if (!subjects || !checkboxes) return; // This should never happen due to isValidData, but added for type safety
    const validData = subjects
      .map((subject, idx) => {
        if (!subject || !subject.trim() || !checkboxes[idx]) return null;
        const checkedCount = checkboxes[idx].filter(Boolean).length || 0;
        const percentage = Math.round((checkedCount / 31) * 100);
        return { subject, percentage };
      })
      .filter((item): item is { subject: string; percentage: number } => item !== null);

    if (validData.length === 0) return;

    // Prepare Chart.js data
    const data = {
      labels: validData.map(item => item.subject),
      datasets: [
        {
          label: 'Completion (%)',
          data: validData.map(item => item.percentage),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    // Chart options
    const options = {
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Completion Percentage (%)',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Subjects',
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
        },
      },
    };

    // Create the chart
    const chart = new Chart(ctx, {
      type: 'bar',
      data,
      options,
    });

    // Cleanup on unmount
    return () => chart.destroy();
  }, [subjects, checkboxes]);

  // Render fallback UI if data is invalid
  if (!isValidData()) {
    return <p className="text-center text-gray-500">No valid data available for chart</p>;
  }

  return <canvas ref={canvasRef} />;
};

export default ChartComponent;