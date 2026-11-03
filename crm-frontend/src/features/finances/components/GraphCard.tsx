import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const data = [
    { month: "Ene", facturacion: 45000, objetivo: 1000000 },
    { month: "Feb", facturacion: 85000, objetivo: 1000000 },
    { month: "Mar", facturacion: 140000, objetivo: 1000000 },
    { month: "Abr", facturacion: 215000, objetivo: 1000000 },
    { month: "May", facturacion: 295000, objetivo: 1000000 },
    { month: "Jun", facturacion: 380000, objetivo: 1000000 },
    { month: "Jul", facturacion: 470000, objetivo: 1000000 },
    { month: "Ago", facturacion: 570000, objetivo: 1000000 },
    { month: "Sep", facturacion: 660000, objetivo: 1000000 },
    { month: "Oct", facturacion: 755000, objetivo: 1000000 },
    { month: "Nov", facturacion: 870000, objetivo: 1000000 },
    { month: "Dic", facturacion: 1000000, objetivo: 1000000 },
];

export default function GraphCard() {

    return(
        <motion.div
            whileHover={{ backgroundColor: "#1b1e24" }}
            transition={{ duration: 0.2 }}
            className="flex flex-col w-[60%] bg-[#15171c] mt-8 px-3 py-2 gap-3 rounded-md shadow-lg"
        >
            <p className="text-sm font-bold">
                Facturación acumulada vs objetivo anual
            </p>

            <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 20,
                            left: 10,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid
                            stroke="#2f343e"
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="month"
                            stroke="#9aa3b2"
                            tick={{ fill: "#9aa3b2", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis
                            domain={[0, 1000000]}
                            stroke="#9aa3b2"
                            tick={{ fill: "#9aa3b2", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) =>
                                `$${value / 1000}k`
                            }
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1b1e24",
                                border: "1px solid #2f343e",
                                borderRadius: "6px",
                            }}
                            labelStyle={{
                                color: "#e7e9ee",
                            }}
                            formatter={(value) =>
                                `$${Number(value).toLocaleString("es-MX")}`
                            }
                        />

                        <Line
                            type="monotone"
                            dataKey="facturacion"
                            stroke="#5b74ff"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="objetivo"
                            stroke="#9aa3b2"
                            strokeWidth={2}
                            strokeDasharray="6 6"
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    )
}