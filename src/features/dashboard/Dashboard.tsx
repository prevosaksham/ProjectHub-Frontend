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

interface ActiveProject {
  name: string;
  startDate: string | null;
  endDate: string | null;
  status: string;
}

interface CompletedProject {
  projectName: string;
  startDate: string | null;
  endDate: string | null;
}

interface GraphItem {
  month: string;
  active: number;
  completed: number;
  activeProject: ActiveProject[];
  completedProjects: CompletedProject[];
}

interface DashboardData {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  graphData: GraphItem[];
}

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

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
  console.log("first item:", graphData[0]);
  console.log("completedProject value:", graphData[0]?.completed);
  console.log("completed value:", graphData[0]?.completed);
  const maxValue = Math.max(
    ...graphData.flatMap((item) => [item.active, item.completed]),
    0,
  );

  const dynamicMax = maxValue === 0 ? 10 : Math.ceil((maxValue + 2) / 5) * 5;

  const dynamicTickInterval = Math.max(1, Math.ceil(dynamicMax / 5));

  const selectedMonthData = graphData.find((g) => g.month === selectedMonth);
  const activeRows = (selectedMonthData?.activeProject ?? []).map((p) => ({
    projectName: p.name,
    startDate: formatDate(p.startDate),
    endDate: formatDate(p.endDate),
    status: p.status,
  }));
  const completedRows = (selectedMonthData?.completedProjects ?? []).map(
    (p) => ({
      projectName: p.projectName,
      startDate: formatDate(p.startDate),
      endDate: formatDate(p.endDate),
      status: "COMPLETED",
    }),
  );
  const tableRows = [...activeRows, ...completedRows];

  const chartOptions: Highcharts.Options = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
      height: 350,
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
      headerFormat: "",
      formatter: function () {
        return (
          this.points
            ?.map(
              (point) =>
                `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y}</b> project${point.y === 1 ? "" : "s"}`,
            )
            .join("<br/>") || ""
        );
      },
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
      column: {
        borderRadius: 4,
        pointPadding: 0.1,
        groupPadding: 0.15,
        cursor: "pointer",
        point: {
          events: {
            click: function (this: Highcharts.Point) {
              const month = String(this.category);

              if (selectedMonth === month && panelOpen) {
                setPanelOpen(false);
                setSelectedMonth(null);
              } else {
                setSelectedMonth(month);
                setPanelOpen(true);
              }
            },
          },
        },
      },
    },

    series: [
      {
        name: "Active",
        type: "column",
        data: graphData.map((item) => item.active),
        color: "#2563EB",
      },
      {
        name: "Completed",
        type: "column",
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
      {/* <div className="mt-5 rounded-xl border border-[#ECECEC] bg-white p-5 shadow-sm" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#111827]">Monthly Project Trend</h3>
            <p className="text-sm text-[#6B7280]">Active vs Completed projects month wise</p>
          </div>
        </div>

        <div style={{ overflow: 'hidden', maxHeight: isOpen ? '400px' : '0px', transition: 'max-height 0.35s ease', flexShrink: 0 }}>
          <div style={{ borderRadius: '12px', border: '1px solid #E5E7EB', background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            <div style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#111827' }}>
                Projects — {selectedMonth}
              </h2>
              <span style={{ fontSize: '12px', background: '#EFF6FF', color: '#2563EB', borderRadius: '999px', padding: '2px 10px', fontWeight: 500 }}>
                {tableRows.length} projects
              </span>
            </div>

            <div style={{ overflowY: 'auto', maxHeight: '197px' }}>
              {tableRows.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', tableLayout: 'fixed' }}>
                  <colgroup>
                    <col style={{ width: '30%' }} />
                    <col style={{ width: '23%' }} />
                    <col style={{ width: '23%' }} />
                    <col style={{ width: '24%' }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: '#F9FAFB', position: 'sticky', top: 0, zIndex: 1 }}>
                      {['Project Name', 'Start Date', 'End Date', 'Status'].map((col) => (
                        <th key={col} style={{ padding: '8px 16px', textAlign: 'left', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((project, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #F3F4F6' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '10px 16px', fontWeight: 500, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.projectName}</td>
                        <td style={{ padding: '10px 16px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.startDate}</td>
                        <td style={{ padding: '10px 16px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.endDate}</td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ borderRadius: '999px', padding: '3px 10px', fontSize: '12px', fontWeight: 500, background: project.status === 'COMPLETED' ? '#DBEAFE' : '#DCFCE7', color: project.status === 'COMPLETED' ? '#1D4ED8' : '#15803D' }}>
                            {project.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '28px' }}>📭</span>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: '#6B7280' }}>No projects found</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>No records available for {selectedMonth}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div> */}
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
          {panelOpen && (
            <button
              onClick={() => {
                setPanelOpen(false);
                setSelectedMonth(null);
              }}
              style={{
                fontSize: "12px",
                color: "#6B7280",
                background: "#F3F4F6",
                border: "none",
                borderRadius: "999px",
                padding: "4px 12px",
                cursor: "pointer",
              }}
            >
              ✕ Close
            </button>
          )}
        </div>

        {/* Graph + Side Panel */}
        <div
          style={{ display: "flex", gap: "16px", transition: "all 0.35s ease" }}
        >
          {/* Chart — shrinks when panel open */}
          {/* <div style={{ flex: panelOpen ? 1.5 : 1, transition: 'flex 0.35s ease', minWidth: 0 }}> */}
          {/* <div style={{ flex: 1, minWidth: 0 }}>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} immutable={true}/>
          </div> */}
          <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOptions}
              immutable={true}
            />
          </div>

          {/* Side Panel */}
          <div
            style={{
              width: panelOpen ? "280px" : "0px",
              overflow: "hidden",
              // transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transition: "width 0.3s ease",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "280px",
                height: "350px",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Panel Header */}
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexShrink: 0,
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  {selectedMonth} — Projects
                </h2>
                <span
                  style={{
                    fontSize: "11px",
                    background: "#EFF6FF",
                    color: "#2563EB",
                    borderRadius: "999px",
                    padding: "2px 8px",
                    fontWeight: 500,
                  }}
                >
                  {tableRows.length} total
                </span>
              </div>

              {/* Scrollable list */}
              <div style={{ overflowY: "auto", flex: 1, padding: "8px 0" }}>
                {tableRows.length > 0 ? (
                  tableRows.map((project, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "10px 16px",
                        borderBottom: "1px solid #F3F4F6",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#F9FAFB")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#111827",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {project.projectName}
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            borderRadius: "999px",
                            padding: "2px 8px",
                            flexShrink: 0,
                            background:
                              project.status === "COMPLETED"
                                ? "#DCFCE7"
                                : "#DBEAFE",
                            color:
                              project.status === "COMPLETED"
                                ? "#15803D"
                                : "#1D4ED8",
                          }}
                        >
                          {project.status}
                        </span>
                      </div>
                      <span style={{ fontSize: "11px", color: "#9CA3AF" }}>
                        {project.startDate} → {project.endDate}
                      </span>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      height: "350px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "32px 16px",
                    }}
                  >
                    <span style={{ fontSize: "28px" }}>📭</span>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#6B7280",
                        textAlign: "center",
                      }}
                    >
                      No projects found
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "11px",
                        color: "#9CA3AF",
                        textAlign: "center",
                      }}
                    >
                      No records for {selectedMonth}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
