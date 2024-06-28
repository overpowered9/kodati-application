import { Doughnut } from 'react-chartjs-2';
import { Stats } from '@/types/product-stats';
import { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, TooltipItem } from 'chart.js';
import { colors } from '@/constants';
ChartJS.register(ArcElement, Tooltip);

const DonutChart = ({ productsStats }: { productsStats: Stats | null }) => {
  if (!productsStats) return null;

  const totalOrders = useMemo(() => {
    return productsStats.items.reduce((prev, curr) => prev + curr.orders, 0);
  }, [productsStats]);

  const data = useMemo(() => {
    return {
      datasets: [{
        data: productsStats.items.map(product => product.orders) || [],
        backgroundColor: colors,
      }],
    };
  }, [productsStats]);

  const options = useMemo(() => {
    return {
      plugins: {
        tooltip: {
          callbacks: {
            label: (context: TooltipItem<'doughnut'>) => {
              const index = context.dataIndex;
              const product = productsStats.items[index];
              const percentage = ((product.orders / totalOrders) * 100).toFixed(2);
              return `${product.title}: ${percentage}%`;
            },
          },
          bodyFont: {
            size: 14,
          },
          displayColors: true,
          titleFont: {
            size: 16,
          },
          footerFont: {
            size: 14,
          },
          padding: 12,
          cornerRadius: 6,
          backgroundColor: 'rgba(0,0,0,0.8)',
          bodyColor: '#fff',
        },
        legend: {
          display: false,
        },
      },
    };
  }, [productsStats, totalOrders]);

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-4">
        <p className="text-lg font-semibold">Products by Orders</p>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center">
        <div className="w-80 h-80 md:mr-8">
          <Doughnut data={data} options={options} />
        </div>
        <div className="mt-4 md:mt-0">
          <div className="overflow-y-auto max-h-80">
            <div className="flex justify-between border-b border-gray-300 mb-2">
              <p className="w-1/3 font-semibold">Product</p>
              <p className="w-1/3 font-semibold">Orders</p>
              <p className="w-1/3 font-semibold">Cost</p>
            </div>
            <ul className="divide-y divide-gray-300">
              {productsStats.items.map((stat, index) => (
                <li key={stat.id} className="flex justify-between py-2">
                  <div className="flex items-center w-1/3">
                    <div className="flex-shrink-0 w-4 h-4 rounded-full mr-2" style={{ backgroundColor: colors[index % colors.length] }}></div>
                    <div className="overflow-hidden overflow-ellipsis max-w-xs">
                      <p className="text-sm">{stat.title}</p>
                    </div>
                  </div>
                  <p className="mr-2">{stat.orders}</p>
                  <p className="w-1/3">{stat.cost}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;