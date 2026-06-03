import totalProjectsImg from "../../assets/Total Projects.png";
import activeProjectsImg from "../../assets/Active Projects.png";
import completedProjectsImg from "../../assets/Completed Projects.png";
import totalIcon from "../../assets/Total.png";
import activeIcon from "../../assets/Active.png";
import completedIcon from "../../assets/Completed.png";
import { useEffect, useState } from "react";
import { getDashboardApi } from "../dashboard/api/DashboardApi";
import Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
 
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
 
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboardApi();
        setDashboard(data);
      } catch (error) {
        console.error("Dashboard API Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);
 
  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-[#00076F] font-[Poppins]">
          Dashboard
        </h2>
 
        {/* KPI Skeleton Loaders */}
        <div className="mt-3 grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl p-5 sm:p-7 bg-white border border-slate-200 shadow-lg"
            >
              <div className="relative flex items-center justify-between gap-4">
                <div className="flex flex-col gap-3 flex-1">
                  {/* Label skeleton */}
                  <div className="h-5 w-32 bg-linear-to-r from-slate-200 to-slate-100 rounded animate-pulse"></div>
                  {/* Value skeleton */}
                  <div className="h-10 w-24 bg-linear-to-r from-slate-300 to-slate-200 rounded animate-pulse"></div>
                </div>
                {/* Icon circle skeleton */}
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-slate-200 to-slate-100 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
 
        {/* Graph skeleton */}
        <div className="mt-5 rounded-none bg-white border border-[#ECECEC] px-4 py-4">
          <div className="h-6 w-40 bg-linear-to-r from-slate-300 to-slate-200 rounded mb-4 animate-pulse"></div>
          <div className="h-72 w-full bg-linear-to-r from-slate-100 to-slate-50 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }
 
  const graphData = dashboard?.graphData ?? [];
  const maxValue = Math.max(
    ...graphData.flatMap((item) => [item.active, item.completed]),
    0
  );
 
  const dynamicMax = maxValue === 0 ? 10 : Math.ceil((maxValue + 2) / 5) * 5;
 
  const dynamicTickInterval = Math.max(
    1,
    Math.ceil(dynamicMax / 5)
  );
  const chartOptions: Highcharts.Options = {
    chart: {
      type: "areaspline",
      backgroundColor: "transparent",
      height: 350,
      spacing: [10, 10, 10, 10],
    },
 
    title: {
      text: "",
    },
 
    credits: {
      enabled: false,
    },
 
    xAxis: {
      categories: graphData.map((item) => item.month),
      lineColor: "#E5E7EB",
      tickLength: 0,
      labels: {
        style: {
          color: "#6B7280",
          fontSize: "12px",
          fontFamily: "Poppins",
        },
      },
    },
 
    yAxis: {
      min: 0,
      max: dynamicMax,
      tickInterval: dynamicTickInterval,
      title: {
        text: "",
      },
      gridLineColor: "#F1F5F9",
      labels: {
        style: {
          color: "#6B7280",
          fontSize: "12px",
          fontFamily: "Poppins",
        },
      },
    },
 
    tooltip: {
      shared: true,
      borderRadius: 10,
      backgroundColor: "#FFFFFF",
      borderColor: "#E5E7EB",
    },
 
    legend: {
      align: "center",
      verticalAlign: "bottom",
      itemStyle: {
        fontSize: "13px",
        fontWeight: "500",
        fontFamily: "Poppins",
      },
    },
 
    plotOptions: {
      areaspline: {
        fillOpacity: 0.15,
        lineWidth: 3,
        marker: {
          enabled: true,
          radius: 5,
        },
      },
    },
 
    series: [
      {
        name: "Active Projects",
        type: "areaspline",
        data: graphData.map((item) => item.active),
        color: "#2563EB",
      },
      {
        name: "Completed Projects",
        type: "areaspline",
        data: graphData.map((item) => item.completed),
        color: "#22C55E",
      },
    ],
  };
 
  return (
    <div className="p-4 sm:p-6">
 
      {/* Welcome Section */}
      <h2 className="text-lg sm:text-xl font-semibold text-[#00076F] font-[Poppins]">
        Dashboard
      </h2>
 
      {/* KPI Section */}
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
 
      {/* GRAPH SECTION */}
      <div className="mt-5 rounded-xl border border-[#ECECEC] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#111827]">
              Monthly Project Trend
            </h3>
            <p className="text-sm text-[#6B7280]">
              Active vs Completed projects month wise
            </p>
          </div>
        </div>
 
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
        />
      </div>
 
    </div>
 
 
 
 
 
  );
}
 
export default Dashboard;