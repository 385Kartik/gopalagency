import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSiteContent, ContactData, ContactInfoItem } from '@/context/SiteContentContext';
import { toast } from '@/hooks/use-toast';
import { Save, Plus, Trash2, Phone, MapPin, Mail, Clock, MessageSquare, Building } from 'lucide-react';

const iconMap = {
  address: MapPin,
  phone: Phone,
  email: Mail,
  hours: Clock,
};

const AdminContact = () => {
  const { contactData, updateContactData } = useSiteContent();
  const [data, setData] = useState<ContactData>({ ...contactData });

  const handleSave = () => {
    updateContactData(data);
    toast({ title: 'Contact Page Updated', description: 'All changes have been saved successfully.' });
  };

  const updateContactInfo = (index: number, field: keyof ContactInfoItem, value: any) => {
    const updated = [...data.contactInfo];
    if (field === 'details') {
      updated[index] = { ...updated[index], details: value };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setData({ ...data, contactInfo: updated });
  };

  const updateContactDetail = (infoIndex: number, detailIndex: number, value: string) => {
    const updated = [...data.contactInfo];
    const details = [...updated[infoIndex].details];
    details[detailIndex] = value;
    updated[infoIndex] = { ...updated[infoIndex], details };
    setData({ ...data, contactInfo: updated });
  };

  const addContactDetail = (infoIndex: number) => {
    const updated = [...data.contactInfo];
    updated[infoIndex] = { ...updated[infoIndex], details: [...updated[infoIndex].details, ''] };
    setData({ ...data, contactInfo: updated });
  };

  const removeContactDetail = (infoIndex: number, detailIndex: number) => {
    const updated = [...data.contactInfo];
    updated[infoIndex] = { ...updated[infoIndex], details: updated[infoIndex].details.filter((_, i) => i !== detailIndex) };
    setData({ ...data, contactInfo: updated });
  };

  const addContactInfo = () => {
    setData({
      ...data,
      contactInfo: [...data.contactInfo, { type: 'phone', title: '', details: [''] }],
    });
  };

  const removeContactInfo = (index: number) => {
    setData({ ...data, contactInfo: data.contactInfo.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contact Us Section</h1>
          <p className="text-muted-foreground">Manage the Contact page content</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" /> Save All Changes
        </Button>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Hero Section</CardTitle>
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

      {/* Contact Info Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Phone className="h-5 w-5" /> Contact Information Cards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.contactInfo.map((info, i) => {
            const Icon = iconMap[info.type] || Phone;
            return (
              <div key={i} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Card #{i + 1}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeContactInfo(i)} className="text-destructive h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Type</label>
                    <Select value={info.type} onValueChange={(val) => updateContactInfo(i, 'type', val)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="address">Address</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="hours">Business Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Title</label>
                    <Input value={info.title} onChange={(e) => updateContactInfo(i, 'title', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Details</label>
                  {info.details.map((detail, j) => (
                    <div key={j} className="flex gap-2 mb-2">
                      <Input value={detail} onChange={(e) => updateContactDetail(i, j, e.target.value)} className="flex-1" />
                      {info.details.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => removeContactDetail(i, j)} className="text-destructive shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" onClick={() => addContactDetail(i)} className="gap-1 text-xs">
                    <Plus className="h-3 w-3" /> Add Line
                  </Button>
                </div>
              </div>
            );
          })}
          <Button variant="outline" size="sm" onClick={addContactInfo} className="gap-2">
            <Plus className="h-4 w-4" /> Add Contact Card
          </Button>
        </CardContent>
      </Card>

      {/* Form Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Contact Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Form Title</label>
              <Input value={data.formTitle} onChange={(e) => setData({ ...data, formTitle: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Form Subtitle</label>
              <Input value={data.formSubtitle} onChange={(e) => setData({ ...data, formSubtitle: e.target.value })} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map & Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Map & Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Map Display Address</label>
            <Input value={data.mapAddress} onChange={(e) => setData({ ...data, mapAddress: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Google Maps Link</label>
            <Input value={data.mapLink} onChange={(e) => setData({ ...data, mapLink: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      {/* Quick Help Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5" /> Quick Help Cards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-border rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Bulk Orders Card</h4>
            <Input placeholder="Title" value={data.bulkOrderTitle} onChange={(e) => setData({ ...data, bulkOrderTitle: e.target.value })} />
            <Textarea placeholder="Description" value={data.bulkOrderDescription} onChange={(e) => setData({ ...data, bulkOrderDescription: e.target.value })} rows={2} />
          </div>
          <div className="border border-border rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Customer Support Card</h4>
            <Input placeholder="Title" value={data.supportTitle} onChange={(e) => setData({ ...data, supportTitle: e.target.value })} />
            <Textarea placeholder="Description" value={data.supportDescription} onChange={(e) => setData({ ...data, supportDescription: e.target.value })} rows={2} />
          </div>
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

export default AdminContact;
