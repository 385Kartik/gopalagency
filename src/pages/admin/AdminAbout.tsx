import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSiteContent, AboutData, AboutStat, AboutValue, AboutMilestone } from '@/context/SiteContentContext';
import { toast } from '@/hooks/use-toast';
import { Save, Plus, Trash2, Info, BarChart3, BookOpen, Heart, Clock } from 'lucide-react';

const AdminAbout = () => {
  const { aboutData, updateAboutData } = useSiteContent();
  const [data, setData] = useState<AboutData>({ ...aboutData });

  const handleSave = () => {
    updateAboutData(data);
    toast({ title: 'About Page Updated', description: 'All changes have been saved successfully.' });
  };

  const updateStat = (index: number, field: keyof AboutStat, value: string) => {
    const updated = [...data.stats];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, stats: updated });
  };

  const addStat = () => {
    setData({ ...data, stats: [...data.stats, { label: '', value: '' }] });
  };

  const removeStat = (index: number) => {
    setData({ ...data, stats: data.stats.filter((_, i) => i !== index) });
  };

  const updateValue = (index: number, field: keyof AboutValue, value: string) => {
    const updated = [...data.values];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, values: updated });
  };

  const addValue = () => {
    setData({ ...data, values: [...data.values, { title: '', description: '' }] });
  };

  const removeValue = (index: number) => {
    setData({ ...data, values: data.values.filter((_, i) => i !== index) });
  };

  const updateMilestone = (index: number, field: keyof AboutMilestone, value: string) => {
    const updated = [...data.milestones];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, milestones: updated });
  };

  const addMilestone = () => {
    setData({ ...data, milestones: [...data.milestones, { year: '', event: '' }] });
  };

  const removeMilestone = (index: number) => {
    setData({ ...data, milestones: data.milestones.filter((_, i) => i !== index) });
  };

  const updateStoryParagraph = (index: number, value: string) => {
    const updated = [...data.storyParagraphs];
    updated[index] = value;
    setData({ ...data, storyParagraphs: updated });
  };

  const addStoryParagraph = () => {
    setData({ ...data, storyParagraphs: [...data.storyParagraphs, ''] });
  };

  const removeStoryParagraph = (index: number) => {
    setData({ ...data, storyParagraphs: data.storyParagraphs.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">About Section</h1>
          <p className="text-muted-foreground">Manage the About page content</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" /> Save All Changes
        </Button>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" /> Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Page Title</label>
            <Input value={data.heroTitle} onChange={(e) => setData({ ...data, heroTitle: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Subtitle</label>
            <Textarea value={data.heroSubtitle} onChange={(e) => setData({ ...data, heroSubtitle: e.target.value })} rows={2} />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              <Input placeholder="Value (e.g. 29+)" value={stat.value} onChange={(e) => updateStat(i, 'value', e.target.value)} className="w-40" />
              <Input placeholder="Label (e.g. Years in Business)" value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} className="flex-1" />
              <Button variant="ghost" size="icon" onClick={() => removeStat(i)} className="text-destructive shrink-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addStat} className="gap-2">
            <Plus className="h-4 w-4" /> Add Stat
          </Button>
        </CardContent>
      </Card>

      {/* Our Story */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> Our Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Section Title</label>
            <Input value={data.storyTitle} onChange={(e) => setData({ ...data, storyTitle: e.target.value })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Company Tagline</label>
              <Input value={data.companyTagline} onChange={(e) => setData({ ...data, companyTagline: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Company Location</label>
              <Input value={data.companyLocation} onChange={(e) => setData({ ...data, companyLocation: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Story Paragraphs</label>
            {data.storyParagraphs.map((para, i) => (
              <div key={i} className="flex gap-3 mb-3">
                <Textarea value={para} onChange={(e) => updateStoryParagraph(i, e.target.value)} rows={3} className="flex-1" />
                <Button variant="ghost" size="icon" onClick={() => removeStoryParagraph(i)} className="text-destructive shrink-0 mt-1">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addStoryParagraph} className="gap-2">
              <Plus className="h-4 w-4" /> Add Paragraph
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Values */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5" /> Why Choose Us / Values</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Section Title</label>
              <Input value={data.valuesTitle} onChange={(e) => setData({ ...data, valuesTitle: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Section Subtitle</label>
              <Input value={data.valuesSubtitle} onChange={(e) => setData({ ...data, valuesSubtitle: e.target.value })} />
            </div>
          </div>
          {data.values.map((val, i) => (
            <div key={i} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Value #{i + 1}</span>
                <Button variant="ghost" size="icon" onClick={() => removeValue(i)} className="text-destructive h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Input placeholder="Title" value={val.title} onChange={(e) => updateValue(i, 'title', e.target.value)} />
              <Textarea placeholder="Description" value={val.description} onChange={(e) => updateValue(i, 'description', e.target.value)} rows={2} />
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addValue} className="gap-2">
            <Plus className="h-4 w-4" /> Add Value
          </Button>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Journey / Milestones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.milestones.map((m, i) => (
            <div key={i} className="flex items-start gap-3">
              <Input placeholder="Year" value={m.year} onChange={(e) => updateMilestone(i, 'year', e.target.value)} className="w-24" />
              <Input placeholder="Event description" value={m.event} onChange={(e) => updateMilestone(i, 'event', e.target.value)} className="flex-1" />
              <Button variant="ghost" size="icon" onClick={() => removeMilestone(i)} className="text-destructive shrink-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addMilestone} className="gap-2">
            <Plus className="h-4 w-4" /> Add Milestone
          </Button>
        </CardContent>
      </Card>

      {/* Bottom Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" className="gap-2">
          <Save className="h-4 w-4" /> Save All Changes
        </Button>
      </div>
    </div>
  );
};

export default AdminAbout;
