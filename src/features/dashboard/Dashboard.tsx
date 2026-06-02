import totalProjectsImg from "../../assets/Total Projects.png";
import activeProjectsImg from "../../assets/Active Projects.png";
import completedProjectsImg from "../../assets/Completed Projects.png";
import totalIcon from "../../assets/Total.png";
import activeIcon from "../../assets/Active.png";
import completedIcon from "../../assets/Completed.png";
import { useEffect, useState } from "react";
import { getDashboardApi } from "../dashboard/api/DashboardApi";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Loader from "../../components/common/Loader";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const getNiceTickInterval = (maxValue: number) => {
  // if (maxValue <= 10) return 1;
  const roughInterval = maxValue / 5;
  const magnitude = 10 ** Math.floor(Math.log10(roughInterval));
  const normalized = roughInterval / magnitude;
  // if (normalized <= 1) return magnitude;
  if (normalized <= 2) return 2 * magnitude;
  if (normalized <= 5) return 5 * magnitude;
  return 10 * magnitude;
};

interface KpiTile {
  label: string;
  value: number | string;
  img: string;
  circleIcon: string;
  gradient: string;
}

interface GraphItem {
  month: string;
  active: number;
  completed: number;
}

interface DashboardData {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  graphData: GraphItem[];
}

function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const data = await getDashboardApi();

        setDashboard({
          totalProjects: data?.totalProjects ?? 0,
          activeProjects: data?.activeProjects ?? 0,
          completedProjects: data?.completedProjects ?? 0,
          graphData: Array.isArray(data?.graphData)
            ? data.graphData.map((item: Partial<GraphItem>) => ({
                month: String(item.month ?? ""),
                active: Number(item.active ?? 0),
                completed: Number(item.completed ?? 0),
              }))
            : [],
        });
      } catch (error) {
        console.error("Dashboard API Error", error);
        setDashboard({
          totalProjects: 0,
          activeProjects: 0,
          completedProjects: 0,
          graphData: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const stats: KpiTile[] = [
    {
      label: "Total Projects",
      value: dashboard?.totalProjects || 0,
      img: totalProjectsImg,
      circleIcon: totalIcon,
      gradient: "linear-gradient(90deg, #0059FF 0%, #003699 100%)",
    },
    {
      label: "Active Projects",
      value: dashboard?.activeProjects || 0,
      img: activeProjectsImg,
      circleIcon: activeIcon,
      gradient: "linear-gradient(180deg, #252D9E 0%, #0D1038 100%)",
    },
    {
      label: "Completed Projects",
      value: dashboard?.completedProjects || 0,
      img: completedProjectsImg,
      circleIcon: completedIcon,
      gradient: "linear-gradient(180deg, #4D3190 0%, #1B084A 100%)",
    },
  ];

  if (loading) return <Loader />;

  const graphData = dashboard?.graphData ?? [];
  const highestGraphValue = Math.max(
    ...graphData.flatMap((item) => [item.active, item.completed]),
    0
  );
  const yAxisStepSize = getNiceTickInterval(highestGraphValue);
  const yAxisMax =
    highestGraphValue === 0
      ? 5
      : Math.ceil(highestGraphValue / yAxisStepSize) * yAxisStepSize;
  // Two datasets – grouped bars (Active & Completed per month)
  const chartData: ChartData<"bar"> = {
    labels: graphData.map((item) => item.month),
    datasets: [
      {
        label: "Completed",
        data: graphData.map((item) => item.completed),
        backgroundColor: "#4d2d98ef",
        borderColor: "#1B084A",
        borderWidth: 2,
        borderRadius: 0,
        borderSkipped: false,
        barPercentage: 0.95,
        categoryPercentage: 0.82,
        maxBarThickness: 68,
      },
      {
        label: "Active",
        data: graphData.map((item) => item.active),
        backgroundColor: "#4e56c6fe",
        borderColor: " #0D1038",
        borderWidth: 2,
        borderRadius: 0,
        borderSkipped: false,
        barPercentage: 0.95,
        categoryPercentage: 0.82,
        maxBarThickness: 68,
      },
    ],
  };

  // Styling exactly like the image – rounded bars, Poppins font, light grid, etc.
  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Projects Insights",
        color: "#222222",
        padding: { top: 2, bottom: 12 },
        font: { family: "Poppins", size: 15, weight: 600 },
      },
      legend: {
        display: true,
        position: "top",
        align: "center",
        labels: {
          color: "#666666",
          boxHeight: 14,
          boxWidth: 42,
          useBorderRadius: false,
          padding: 18,
          font: { family: "Poppins", size: 14, weight: 400 },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#FFFFFF",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        titleColor: "#1E1E1E",
        bodyColor: "#1E1E1E",
        titleFont: { family: "Poppins", size: 12, weight: "bold" },
        bodyFont: { family: "Poppins", size: 12 },
        caretSize: 6,
        cornerRadius: 6,
        displayColors: true,
        padding: 12,
      },
    },
    layout: {
      padding: { top: 2, right: 8, bottom: 2, left: 0 },
    },
    scales: {
      x: {
        stacked: false,        // ← groups bars side‑by‑side
        border: { color: "#D6D6D6" },
        grid: {
          display: false,
          color: "rgba(0, 0, 0, 0.1)",
          drawTicks: false,
        },
        ticks: {
          color: "#666666",
          padding: 10,
          font: { family: "Poppins", size: 14, weight: 400 },
        },
      },
      y: {
        stacked: false,
        beginAtZero: true,
        max: yAxisMax,
        border: { display: true, color: "#D6D6D6" },
        grid: {
          display: true,
          color: "rgba(110, 104, 104, 0.1)",
          drawTicks: false,
        },
        ticks: {
          stepSize: yAxisStepSize,
          precision: 0,
          color: "#666666",
          padding: 10,
          font: { family: "Poppins", size: 14, weight: 400 },
        },  
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    datasets: {
      bar: {
        hoverBackgroundColor: (context) =>
          context.dataset.label === "Completed"
            ? "rgba(32, 138, 23, 0.24)"
            : "rgba(37, 45, 158, 0.24)",
        hoverBorderWidth: 2,
      },
    },
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Welcome Section */}
      <h2 className="text-lg sm:text-xl font-semibold text-[#00076F] font-[Poppins]">
        Dashboard
      </h2>

      {/* KPI Section – unchanged */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{ background: stat.gradient }}
            className="relative overflow-hidden rounded-2xl p-5 sm:p-7 text-white shadow-lg"
          >
            <img
              src={stat.img}
              alt=""
              className="pointer-events-none absolute -left-2 top-1/2 h-32 w-32 -translate-y-1/2 object-contain"
              style={{ padding: "8px", marginLeft: "18px" }}
            />
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-semibold text-white font-[Poppins]">
                  {stat.label}
                </span>
                <span className="mt-2 sm:mt-3.5 text-3xl sm:text-4xl font-semibold text-white font-[Poppins]">
                  {stat.value}
                </span>
              </div>
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full bg-white">
                <img
                  src={stat.circleIcon}
                  alt={stat.label}
                  className="h-6 w-6 object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GRAPH SECTION – Grouped bar chart (two bars per month) with image styling */}
      <div className="mt-5 overflow-hidden rounded-lg border border-[#E5E7EB] bg-white px-3 py-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:px-5">
        <div className="w-full overflow-x-auto">
          <div className="h-[430px] min-w-[980px] bg-white px-2 py-2">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
