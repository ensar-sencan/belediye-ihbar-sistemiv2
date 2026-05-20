import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface TrendChartProps {
  data: Array<{ date: string; count: number }>;
}

export function TrendChart({ data }: TrendChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
        <XAxis dataKey="date" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} />
        <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: isDark ? '#1e293b' : '#fff', 
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, 
            borderRadius: '8px',
            color: isDark ? '#f1f5f9' : '#0f172a'
          }} 
        />
        <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface CategoryChartProps {
  data: Array<{ name: string; value: number }>;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#64748b'];

export function CategoryChart({ data }: CategoryChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
        <XAxis dataKey="name" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} />
        <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: isDark ? '#1e293b' : '#fff', 
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, 
            borderRadius: '8px',
            color: isDark ? '#f1f5f9' : '#0f172a'
          }} 
        />
        <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StatusPieChart({ data }: CategoryChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie 
          data={data} 
          cx="50%" 
          cy="50%" 
          labelLine={false} 
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={80} 
          fill="#8884d8" 
          dataKey="value"
          style={{ fill: isDark ? '#f1f5f9' : '#0f172a' }}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: isDark ? '#1e293b' : '#fff', 
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, 
            borderRadius: '8px',
            color: isDark ? '#f1f5f9' : '#0f172a'
          }} 
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
