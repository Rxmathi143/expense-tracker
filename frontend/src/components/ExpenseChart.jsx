import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";

import "./ExpenseChart.css";

function ExpenseChart({ categoryExpenses, darkMode }) {

    if (!categoryExpenses || categoryExpenses.length === 0) {
        return (
            <div className="expense-chart-empty">
                <p>No expense data available</p>
            </div>
        );
    }

    const data = categoryExpenses.map((item) => ({
        name: item.category,
        value: Number(item.amount),
    }));

    const COLORS = [
        "#ff7a00",
        "#00d9ff",
        "#a855f7",
        "#22c55e",
        "#ef4444",
        "#eab308",
        "#ec4899",
        "#6366f1",
    ];

    /*
     * Change chart text automatically according
     * to the current dashboard theme.
     */
    const textColor = darkMode ? "#ffffff" : "#111111";

    const tooltipBackground = darkMode
        ? "#181818"
        : "#ffffff";

    const tooltipTextColor = darkMode
        ? "#ffffff"
        : "#111111";

    const tooltipBorder = darkMode
        ? "1px solid rgba(255,255,255,0.15)"
        : "1px solid rgba(0,0,0,0.15)";

    return (
        <div
            className={`expense-chart-container ${
                darkMode ? "chart-dark" : "chart-light"
            }`}
        >

            <ResponsiveContainer
                width="100%"
                height={330}
            >

                <PieChart>

                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="43%"
                        outerRadius={100}
                        innerRadius={58}
                        paddingAngle={3}
                        stroke={darkMode ? "#111111" : "#ffffff"}
                        strokeWidth={2}
                    >

                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}

                    </Pie>

                    <Tooltip
                        formatter={(value) =>
                            `₹${Number(value).toLocaleString("en-IN")}`
                        }

                        contentStyle={{
                            background: tooltipBackground,
                            border: tooltipBorder,
                            borderRadius: "10px",
                            color: tooltipTextColor,
                            boxShadow: darkMode
                                ? "0 8px 25px rgba(0,0,0,0.4)"
                                : "0 8px 25px rgba(0,0,0,0.18)",
                            zIndex: 9999,
                        }}

                        itemStyle={{
                            color: tooltipTextColor,
                            fontWeight: 600,
                        }}

                        labelStyle={{
                            color: tooltipTextColor,
                            fontWeight: 700,
                        }}

                        wrapperStyle={{
                            zIndex: 9999,
                        }}
                    />

                    <Legend
                        verticalAlign="bottom"
                        align="center"
                        height={55}
                        wrapperStyle={{
                            color: textColor,
                            fontSize: "12px",
                            fontWeight: 600,
                            paddingTop: "10px",
                        }}
                        formatter={(value) => (
                            <span
                                style={{
                                    color: textColor,
                                    fontWeight: 600,
                                }}
                            >
                                {value}
                            </span>
                        )}
                    />

                </PieChart>

            </ResponsiveContainer>

        </div>
    );
}

export default ExpenseChart;