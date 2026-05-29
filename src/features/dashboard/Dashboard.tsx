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
import Loader from "../../components/common/Loader";

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
    return <Loader />;
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
  const chartOptions = {
    chart: {
      type: "spline",
      backgroundColor: "transparent",
      height: 300,
      spacing: [4, 0, 4, 0],
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: graphData.map((item) => item.month),
      lineColor: "#D9D9D9",
      tickLength: 0,
      gridLineWidth: 1,
      gridLineDashStyle: "Dot",
      gridLineColor: "#E3E3E3",
      labels: {
        y: 18,
        style: {
          color: "#7A7A7A",
          fontSize: "12px",
          fontFamily: "Poppins",
        },
      },
    },
    yAxis: {
       min: 0,
      max: dynamicMax,
      tickInterval: dynamicTickInterval,
      lineWidth: 1,
      lineColor: "#D9D9D9",
      gridLineWidth: 1,
      gridLineDashStyle: "Dot",
      gridLineColor: "#DCDCDC",
      title: {
        text: "Projects",
        margin: 8,
        style: {
          color: "#1E1E1E",
          fontSize: "12px",
          fontFamily: "Poppins",
        },
      },
      labels: {
        x: -4,
        style: {
          color: "#7A7A7A",
          fontSize: "12px",
          fontFamily: "Poppins",
        },
      },
    },
    tooltip: {
      shared: true,
      backgroundColor: "#FFFFFF",
      borderColor: "#E5E7EB",
      borderRadius: 8,
      style: {
        color: "#1E1E1E",
        fontSize: "12px",
        fontFamily: "Poppins",
      },
    },
    legend: {
      align: "center",
      verticalAlign: "bottom",
      layout: "horizontal",
      symbolHeight: 6,
      symbolWidth: 14,
      symbolRadius: 6,
      itemDistance: 22,
      margin: 4,
      itemStyle: {
        color: "#5E5E5E",
        fontSize: "12px",
        fontWeight: "400",
        fontFamily: "Poppins",
      },
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      spline: {
        lineWidth: 1,
        marker: {
          enabled: true,
          radius: 3,
          lineWidth: 1,
          fillColor: "#FFFFFF",
        },
        states: {
          hover: {
            lineWidthPlus: 0,
          },
        },
      },
    },
    series: [
      {
        name: "Active",
        type: "spline",
        data: graphData.map((item) => item.active),
        color: "#252D9E",
        marker: {
          lineColor: "#252D9E",
        },
      },
      {
        name: "Completed",
        type: "spline",
        data: graphData.map((item) => item.completed),
        color: "#208A17",
        marker: {
          lineColor: "#208A17",
        },
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
                <span className="mt-2 sm:mt-[14px] text-3xl sm:text-4xl font-semibold text-white font-[Poppins]">
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
      <div className="mt-5 rounded-none bg-white border border-[#ECECEC] px-4 py-4">
        <h3 className="text-[18px] font-semibold text-[#1E1E1E] font-[Poppins] mb-3">
          Projects Insights
        </h3>

        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
        />
      </div>

</div>
       

      

    
  );
}

export default Dashboard;
