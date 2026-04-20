import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '../components/ui';
import { useProfile } from '../hooks/useProfile';
import { useApplications } from '../hooks/useApplications';
import { analyzeJob, AnalysisResult } from '../services/gemini';
import { Sparkles, FileText, Send, Save, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Apply: React.FC = () => {
  const { profile } = useProfile();
  const { addApplication } = useApplications();
  const navigate = useNavigate();
  
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAnalyze = async () => {
    if (!profile) {
      setError("Please complete your profile first.");
      return;
    }
    if (!jobDescription || !companyName || !roleTitle) {
      setError("Please fill in all job details.");
      return;
    }

    setAnalyzing(true);
    setError('');
    setResult(null);

    try {
      const data = await analyzeJob(profile, jobDescription);
      setResult(data);
    } catch (err: any) {
      setError("AI analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!result || saving) return;
    setSaving(true);
    try {
      await addApplication({
        company: companyName,
        role: roleTitle,
        jobDescription,
        matchScore: result.matchScore,
        matchReason: result.matchReason,
        coverLetter: result.coverLetter,
        resumeBullets: result.resumeBullets,
        status: 'Applied'
      });
      navigate('/history');
    } catch (err) {
      setError("Failed to save application.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-12 border-b border-black pb-8">
        <h1 className="text-4xl font-serif font-bold text-zinc-900 tracking-tight">AI Application Tailor</h1>
        <p className="mt-3 text-sm text-zinc-700">Paste a job description and get tailored application materials instantly.</p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <section className="space-y-8">
          <Card className="p-8 border-l-4 border-l-black space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-zinc-900 mb-2">Company</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full border border-black px-3 py-2.5 bg-white focus:outline-none focus:bg-zinc-100 transition-all"
                  placeholder="Google"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-900 mb-2">Role</label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full border border-black px-3 py-2.5 bg-white focus:outline-none focus:bg-zinc-100 transition-all"
                  placeholder="Senior Engineer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-900 mb-2">Job Description</label>
              <textarea
                rows={14}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full border border-black px-3 py-2.5 bg-white focus:outline-none focus:bg-zinc-100 transition-all resize-none font-mono text-xs leading-relaxed"
                placeholder="Paste the job description here..."
              />
            </div>

            {error && (
              <div className="flex items-start gap-3 border-l-4 border-l-red-900 bg-white p-4 text-sm text-red-900">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button 
              onClick={handleAnalyze} 
              disabled={analyzing} 
              className="w-full py-3.5 text-base font-bold"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Tailor Application
                </>
              )}
            </Button>
          </Card>
        </section>

        <section className="space-y-8">
          <AnimatePresence mode="wait">
            {!result && !analyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full min-h-[500px] border-2 border-black bg-[#FAF9F6] p-12 text-center"
              >
                <div className="border-2 border-black p-6 mb-6">
                  <Sparkles className="h-8 w-8 text-zinc-900 mx-auto" />
                </div>
                <h3 className="text-lg font-serif font-bold text-zinc-900">Generate content</h3>
                <p className="mt-3 text-sm text-zinc-700 max-w-sm mx-auto leading-relaxed">
                  Enter a job posting on the left to receive tailored cover letter and resume bullets.
                </p>
              </motion.div>
            )}

            {analyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <Card className="p-6 space-y-4 animate-pulse border-l-4 border-l-black">
                  <div className="h-6 w-32 bg-zinc-300" />
                  <div className="h-16 w-full bg-zinc-200" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-zinc-200" />
                    <div className="h-3 w-5/6 bg-zinc-200" />
                  </div>
                </Card>
                <Card className="p-6 animate-pulse border-l-4 border-l-black">
                  <div className="h-20 w-full bg-zinc-200" />
                </Card>
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6 pb-12"
              >
                <Card className="p-6 border-t-4 border-t-black">
                  <div className="flex items-start justify-between mb-4 border-b border-black pb-4">
                    <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Match Analysis</h3>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-4xl font-serif font-bold text-zinc-900">{result.matchScore}</span>
                      <span className="text-xs text-zinc-600 uppercase tracking-wider font-bold">score</span>
                    </div>
                  </div>
                  <p className="text-zinc-800 leading-relaxed text-sm">{result.matchReason}</p>
                </Card>

                <Card className="p-6 border-t-4 border-t-black">
                  <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-4 border-b border-black pb-4">Resume Bullets</h3>
                  <ul className="space-y-3">
                    {result.resumeBullets.map((bullet, i) => (
                      <li key={i} className="flex gap-3 text-sm text-zinc-900 bg-white p-3 border border-black">
                        <span className="font-bold text-zinc-900 shrink-0">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6 border-t-4 border-t-black">
                  <div className="flex items-center justify-between mb-4 border-b border-black pb-4">
                    <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Cover Letter</h3>
                  </div>
                  <div className="text-sm text-zinc-900 whitespace-pre-wrap leading-relaxed p-4 border border-black bg-[#FAF9F6]">
                    {result.coverLetter}
                  </div>
                </Card>

                <div className="flex items-center gap-3 pt-4 border-t border-black">
                  <Button onClick={handleSave} disabled={saving} className="flex-1 py-3 text-base font-bold">
                    {saving ? <RefreshCw className="h-5 w-5 animate-spin" /> : <><Save className="h-5 w-5" /> Save Application</>}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
                <div className="rounded-full bg-white p-4 shadow-sm mb-4">
                  <Sparkles className="h-8 w-8 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Ready to boost your chances?</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">
                  Paste a job description on the left to see match scoring and tailored content.
                </p>
              </motion.div>
            )}

            {analyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <Card className="p-6 space-y-4 animate-pulse">
                  <div className="h-8 w-32 bg-gray-200 rounded" />
                  <div className="h-20 w-full bg-gray-100 rounded" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-100 rounded" />
                    <div className="h-4 w-5/6 bg-gray-100 rounded" />
                  </div>
                </Card>
                <Card className="p-6 animate-pulse">
                  <div className="h-24 w-full bg-gray-100 rounded" />
                </Card>
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6 pb-12"
              >
                {/* Match Score */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Analysis Result</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-black text-primary-600">{result.matchScore}%</span>
                      <span className="text-xs font-semibold text-gray-400 uppercase">Match</span>
                    </div>
                  </div>
                  <p className="text-gray-800 leading-relaxed font-medium">{result.matchReason}</p>
                </Card>

                {/* Resume Bullets */}
                <Card className="p-6">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    <CheckCircle className="h-4 w-4 text-emerald-500" /> Tailored Resume Bullets
                  </h3>
                  <ul className="space-y-3">
                    {result.resumeBullets.map((bullet, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-700 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/50">
                        <span className="font-bold text-emerald-600">•</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Cover Letter */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      <FileText className="h-4 w-4 text-blue-500" /> Personalized Cover Letter
                    </h3>
                  </div>
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap font-serif bg-gray-50 p-4 rounded-lg border border-gray-100 italic leading-relaxed">
                    {result.coverLetter}
                  </div>
                </Card>

                <div className="flex items-center gap-4">
                  <Button onClick={handleSave} disabled={saving} className="flex-1 h-12 shadow-md">
                    {saving ? <RefreshCw className="h-5 w-5 animate-spin" /> : <><Save className="h-5 w-5" /> Save to Application History</>}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
};

export default Apply;
