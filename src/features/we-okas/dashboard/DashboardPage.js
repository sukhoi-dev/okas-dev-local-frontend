import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import FolderIcon from '@mui/icons-material/Folder';
import PeopleIcon from '@mui/icons-material/People';
import ApartmentIcon from '@mui/icons-material/Apartment';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PageWrapper from '../../../shared/components/PageWrapper';
import StatsCard from '../../../shared/components/StatsCard';

const projectTrend = [
  { month: 'Jan', projects: 12 }, { month: 'Feb', projects: 18 },
  { month: 'Mar', projects: 15 }, { month: 'Apr', projects: 22 },
  { month: 'May', projects: 28 }, { month: 'Jun', projects: 24 },
];

const userActivity = [
  { month: 'Jan', si: 4, pm: 6, users: 20 }, { month: 'Feb', si: 6, pm: 8, users: 25 },
  { month: 'Mar', si: 5, pm: 7, users: 22 }, { month: 'Apr', si: 8, pm: 10, users: 30 },
  { month: 'May', si: 9, pm: 12, users: 35 }, { month: 'Jun', si: 7, pm: 9, users: 28 },
];

const stats = [
  { label: 'Total Projects',       value: 128,  delta: 12,  icon: <FolderIcon />,      color: '#0094AD' },
  { label: 'System Integrators',   value: 34,   delta: 5,   icon: <EngineeringIcon />, color: '#F08100' },
  { label: 'Organizations',        value: 22,   delta: -2,  icon: <ApartmentIcon />,   color: '#7c3aed' },
  { label: 'Active Users',         value: 210,  delta: 18,  icon: <PeopleIcon />,      color: '#16a34a' },
];

export default function DashboardPage() {
  return (
    <PageWrapper title="Dashboard" subtitle="Overview of your WE.OKAS platform">
      {/* Stats Row */}
      <Grid container spacing={2.5} mb={3}>
        {stats.map((s) => (
          <Grid item xs={12} sm={6} lg={3} key={s.label}>
            <StatsCard {...s} borderColor={s.color} />
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>Project Activity</Typography>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={projectTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="projects" stroke="#0094AD" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>User Distribution</Typography>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={userActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="si"    name="SI"    fill="#0094AD" radius={[4,4,0,0]} />
                  <Bar dataKey="pm"    name="PM"    fill="#F08100" radius={[4,4,0,0]} />
                  <Bar dataKey="users" name="Users" fill="#7c3aed" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageWrapper>
  );
}
