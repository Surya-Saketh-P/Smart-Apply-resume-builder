import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/ui';
import { useProfile, UserProfile } from '../hooks/useProfile';
import { Save, User as UserIcon, Mail, Laptop, GraduationCap, Briefcase, Linkedin, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Profile: React.FC = () => {
  const { profile, loading, updateProfile } = useProfile();
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    email: '',
    skills: [],
    experience: '',
    education: '',
    linkedin: ''
  });
  const [skillsInput, setSkillsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
      setSkillsInput(profile.skills.join(', '));
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
    await updateProfile({ ...formData, skills: skillsArray });
    setSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (loading) return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Profile</h1>
        <p className="mt-2 text-gray-600">This information will be used as context for AI-generated applications.</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <UserIcon className="h-4 w-4" /> Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Mail className="h-4 w-4" /> Professional Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Laptop className="h-4 w-4" /> Skills (Comma separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
              placeholder="React, TypeScript, Node.js, AWS..."
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <GraduationCap className="h-4 w-4" /> Education
            </label>
            <textarea
              rows={3}
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 transition-all outline-none resize-none"
              placeholder="B.Tech in Computer Science, 2024..."
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Briefcase className="h-4 w-4" /> Experience
            </label>
            <textarea
              rows={5}
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 transition-all outline-none resize-none"
              placeholder="Software Engineer Intern at Google (Summer 2023)..."
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Linkedin className="h-4 w-4" /> LinkedIn Profile URL
            </label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" disabled={saving} className="min-w-[120px]">
              {saving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
            
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-emerald-600 font-medium text-sm"
                >
                  <Check className="h-4 w-4" />
                  Saved successfully
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
