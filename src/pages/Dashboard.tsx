import React, { useMemo } from 'react';
import { useApplications } from '../hooks/useApplications';
import { Card, Badge, Button } from '../components/ui';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { TrendingUp, Target, ListChecks, ArrowUpRight, Plus, Rocket, Star, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const Dashboard: React.FC = () => {
  const { applications, loading } = useApplications();

  const stats = useMemo(() => {
    if (!applications || applications.length === 0) return null;
    
    const total = applications.length;
    const avgScore = Math.round(applications.reduce((acc, curr) => acc + curr.matchScore, 0) / total);
    const interviews = applications.filter(a => a.status === 'Interview').length;
    const offers = applications.filter(a => a.status === 'Offer').length;

    const data = [
      { name: 'Applied', value: applications.filter(a => a.status === 'Applied').length, color: '#3B82F6' },
      { name: 'Interview', value: interviews, color: '#F59E0B' },
      { name: 'Offer', value: offers, color: '#10B981' },
      { name: 'Rejected', value: applications.filter(a => a.status === 'Rejected').length, color: '#EF4444' },
    ].filter(d => d.value > 0);

    return { total, avgScore, interviews, offers, chartData: data };
  }, [applications]);

  if (loading) return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent shadow-sm"></div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Career Dashboard</h1>
          <p className="mt-1 text-gray-500">Welcome back! Here's how your job hunt is progressing.</p>
        </div>
        <Link to="/apply">
          <Button className="h-11 px-6 text-base font-bold shadow-lg shadow-primary-200">
            <Plus className="h-5 w-5" />
            New Application
          </Button>
        </Link>
      </div>

      {!stats ? (
        <Card className="p-16 flex flex-col items-center justify-center text-center">
          <div className="h-24 w-24 bg-primary-50 rounded-full flex items-center justify-center mb-6">
            <Rocket className="h-10 w-10 text-primary-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Start your journey</h2>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            You haven't applied to any jobs yet. Complete your profile and use the AI to tailor your first application!
          </p>
          <div className="mt-8 flex gap-4">
            <Link to="/profile">
              <Button variant="secondary">Set Up Profile</Button>
            </Link>
            <Link to="/apply">
              <Button>Apply Now</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6 bg-gradient-to-br from-white to-primary-50/30">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <ListChecks className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Apps</p>
                  <p className="text-2xl font-black text-gray-900">{stats.total}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6 bg-gradient-to-br from-white to-amber-50/30">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Target className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Match</p>
                  <p className="text-2xl font-black text-gray-900">{stats.avgScore}%</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6 bg-gradient-to-br from-white to-blue-50/30">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Interviews</p>
                  <p className="text-2xl font-black text-gray-900">{stats.interviews}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-6 bg-gradient-to-br from-white to-emerald-50/30">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Flame className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Offers</p>
                  <p className="text-2xl font-black text-gray-900">{stats.offers}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 p-8 h-[400px]">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Application Status Breakdown</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 -mt-10">
                {stats.chartData.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold font-mono text-gray-500">{item.name}: {item.value}</span>
                  </div>
                ))}
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center justify-between">
              Recent Apps <Link to="/history" className="text-primary-600 hover:underline capitalize text-[11px]">View All</Link>
            </h3>
            <div className="space-y-4">
              {applications.slice(0, 4).map(app => (
                <div key={app.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900 truncate text-sm">{app.company}</p>
                    <p className="text-[10px] text-gray-500 truncate">{app.role}</p>
                  </div>
                  <div className="text-xs font-black text-gray-300 ml-4">
                    {app.matchScore}%
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-primary-600 text-white relative overflow-hidden group">
              <Rocket className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-extrabold mb-1">Tailor more, apply faster.</p>
              <p className="text-xs text-white/80 mb-4">Our AI increases response rates by up to 3x.</p>
              <Link to="/apply">
                <Button className="w-full bg-white text-primary-600 hover:bg-white/90 border-none">
                  Get Started
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
