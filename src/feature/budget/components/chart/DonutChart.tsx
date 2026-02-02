import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { getCategoryColor } from "../../constants/colors"
import type { Chart } from "../../type/budget"

interface Props{
  chartData:Chart[]
}

function DonutChart({chartData}:Props) {
  return (
     <ResponsiveContainer width="100%" height={300}>
       <PieChart>
         <Pie
           data={chartData}
           cx="50%"
           cy="50%"
           labelLine={false}
           outerRadius={100}
           innerRadius={60} 
           fill="#8884d8"
           dataKey="value"
         >
           {chartData && chartData.map((entry, index) => (
             <Cell 
               key={`cell-${index}`} 
               fill={getCategoryColor(entry.name)} 
             />
           ))}
         </Pie>
         <Tooltip
           contentStyle={{
             backgroundColor: 'white',
             border: '1px solid #bda694',
             borderRadius: '8px',
           }}
         />
         <Legend 
           verticalAlign="bottom" 
           height={36}
           formatter={(value) => <span className="text-sm">{value}</span>}
         />
       </PieChart>
     </ResponsiveContainer>
    
  )
}
export default DonutChart