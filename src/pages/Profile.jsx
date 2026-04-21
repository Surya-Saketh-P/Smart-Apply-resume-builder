import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/ui';
import { useProfile } from '../hooks/useProfile';
import { Save, User as UserIcon, Mail, Laptop, GraduationCap, Briefcase, Linkedin, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
const Profile = () => {
    const { profile, loading, updateProfile } = useProfile();
    const [formData, setFormData] = useState({
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
        await updateProfile({ ...formData, skills: skillsArray });
        setSaving(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };
    if (loading)
        return (<div className="flex h-[calc(100vh-64px)] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-none border-2 border-black border-t-transparent"></div>
    </div>);
    return (<div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-12 border-b border-black pb-8">
        <h1 className="text-4xl font-serif font-bold text-zinc-900 tracking-tight">Your Profile</h1>
        <p className="mt-3 text-sm text-zinc-700">Information used by AI to tailor your applications.</p>
      </div>

      <Card className="p-8 border-t-4 border-t-black">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 mb-2">
                <UserIcon className="h-4 w-4"/> Full Name
              </label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-black px-3 py-2.5 bg-white focus:outline-none focus:bg-zinc-100 transition-all" placeholder="John Doe"/>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 mb-2">
                <Mail className="h-4 w-4"/> Professional Email
              </label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border border-black px-3 py-2.5 bg-white focus:outline-none focus:bg-zinc-100 transition-all" placeholder="john@example.com"/>
            </div>
          </div>

          <div className="border-t border-black pt-8">
            <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 mb-2">
              <Laptop className="h-4 w-4"/> Skills (Comma-separated)
            </label>
            <input type="text" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} className="w-full border border-black px-3 py-2.5 bg-white focus:outline-none focus:bg-zinc-100 transition-all" placeholder="React, TypeScript, Node.js, AWS..."/>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 mb-2">
              <GraduationCap className="h-4 w-4"/> Education
            </label>
            <textarea rows={3} value={formData.education} onChange={(e) => setFormData({ ...formData, education: e.target.value })} className="w-full border border-black px-3 py-2.5 bg-white focus:outline-none focus:bg-zinc-100 transition-all resize-none" placeholder="B.Tech in Computer Science, 2024..."/>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 mb-2">
              <Briefcase className="h-4 w-4"/> Experience
            </label>
            <textarea rows={5} value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className="w-full border border-black px-3 py-2.5 bg-white focus:outline-none focus:bg-zinc-100 transition-all resize-none" placeholder="Software Engineer Intern at Google (Summer 2023)..."/>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 mb-2">
              <Linkedin className="h-4 w-4"/> LinkedIn Profile URL
            </label>
            <input type="url" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} className="w-full border border-black px-3 py-2.5 bg-white focus:outline-none focus:bg-zinc-100 transition-all" placeholder="https://linkedin.com/in/johndoe"/>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-black">
            <Button type="submit" disabled={saving} className="min-w-[120px]">
              {saving ? (<div className="h-4 w-4 animate-spin rounded-none border-2 border-white border-t-transparent"/>) : (<>
                  <Save className="h-4 w-4"/>
                  Save Profile
                </>)}
            </Button>
            
            <AnimatePresence>
              {showSuccess && (<motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-zinc-900 font-medium text-sm">
                  <Check className="h-4 w-4"/>
                  Saved
                </motion.div>)}
            </AnimatePresence>
          </div>
        </form>
      </Card>
    </div>);
};
export default Profile;
