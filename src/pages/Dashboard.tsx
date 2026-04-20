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
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex items-start justify-between mb-12 border-b border-black pb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-zinc-900 tracking-tight">Career Dashboard</h1>
          <p className="mt-3 text-sm text-zinc-700">Your job applications at a glance.</p>
        </div>
        <Link to="/apply">
          <Button className="px-8 py-3 text-base font-bold">
            <Plus className="h-5 w-5" />
            New Application
          </Button>
        </Link>
      </div>

      {!stats ? (
        <Card className="p-16 flex flex-col items-center justify-center text-center border-2 border-black">
          <div className="h-24 w-24 border-2 border-black flex items-center justify-center mb-8">
            <Rocket className="h-12 w-12 text-zinc-900" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-zinc-900">Begin your search</h2>
          <p className="mt-4 text-sm text-zinc-700 max-w-md mx-auto leading-relaxed">
            No applications yet. Set up your profile and use AI to tailor your first application.
          </p>
          <div className="mt-10 flex gap-3">
            <Link to="/profile">
              <Button variant="secondary">Configure Profile</Button>
            </Link>
            <Link to="/apply">
              <Button>Start Applying</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 divide-x divide-black border border-black">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6">
            <Card className="border-none bg-[#FAF9F6] p-0">
              <div className="flex flex-col gap-3">
                <ListChecks className="h-6 w-6 text-zinc-900" />
                <div>
                  <p className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Total</p>
                  <p className="text-3xl font-serif font-bold text-zinc-900 mt-1">{stats.total}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6">
            <Card className="border-none bg-[#FAF9F6] p-0">
              <div className="flex flex-col gap-3">
                <Target className="h-6 w-6 text-zinc-900" />
                <div>
                  <p className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Avg Match</p>
                  <p className="text-3xl font-serif font-bold text-zinc-900 mt-1">{stats.avgScore}%</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6">
            <Card className="border-none bg-[#FAF9F6] p-0">
              <div className="flex flex-col gap-3">
                <Star className="h-6 w-6 text-zinc-900" />
                <div>
                  <p className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Interviews</p>
                  <p className="text-3xl font-serif font-bold text-zinc-900 mt-1">{stats.interviews}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-6">
            <Card className="border-none bg-[#FAF9F6] p-0">
              <div className="flex flex-col gap-3">
                <Flame className="h-6 w-6 text-zinc-900" />
                <div>
                  <p className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Offers</p>
                  <p className="text-3xl font-serif font-bold text-zinc-900 mt-1">{stats.offers}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 p-8 border-l-4 border-l-black">
            <h3 className="text-sm font-bold text-zinc-700 uppercase tracking-widest mb-8 border-b border-black pb-4">Application Status</h3>
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
                    contentStyle={{ borderRadius: '0', border: '1px solid black', boxShadow: '2px 2px 0 rgba(0,0,0,1)' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 -mt-8 pt-4 border-t border-black">
                {stats.chartData.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="h-3 w-3" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-zinc-700">{item.name}: {item.value}</span>
                  </div>
                ))}
            </div>
          </Card>

          <Card className="p-8 border-r-4 border-r-black">
            <div className="flex items-center justify-between mb-6 border-b border-black pb-4">
              <h3 className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Recent</h3>
              <Link to="/history" className="text-xs font-bold text-zinc-900 hover:underline">View All</Link>
            </div>
            <div className="space-y-4 mb-8">
              {applications.slice(0, 4).map(app => (
                <div key={app.id} className="flex items-center justify-between p-3 border border-black hover:bg-zinc-100 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-zinc-900 truncate text-sm">{app.company}</p>
                    <p className="text-xs text-zinc-600 truncate mt-1">{app.role}</p>
                  </div>
                  <div className="text-lg font-serif font-bold text-zinc-900 ml-4">
                    {app.matchScore}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-2 border-black bg-white">
              <p className="text-sm font-serif font-bold text-zinc-900 mb-2">Increase response rates.</p>
              <p className="text-xs text-zinc-700 mb-6 leading-relaxed">Let AI tailor your applications to match each job description precisely.</p>
              <Link to="/apply" className="w-full">
                <Button className="w-full">Start Tailoring</Button>
              </Link>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
