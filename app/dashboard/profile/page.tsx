"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'react-toastify';
import { User, Lock, Mail, Save, Edit } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    name: '',
    email: '',
    role: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (session?.user) {
      setProfile({
        id: session.user.id,
        name: session.user.name || '',
        email: session.user.email || '',
        role: session.user.role || ''
      });
    }
  }, [session]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        await update({
          ...session,
          user: {
            ...session?.user,
            name: updatedUser.name,
            email: updatedUser.email
          }
        });
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        toast.success('Password changed successfully');
        setPasswordModalOpen(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Error changing password');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            System Profile
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Manage your account settings and credentials
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-card p-6 md:p-8 rounded-[24px] shadow-lg shadow-black/5 border border-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-[20px] flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Profile Information</h2>
                    <p className="text-muted-foreground">Update your personal details</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!isEditing}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="User ID"
                    value={profile.id}
                    disabled
                  />
                  <Input
                    label="Role"
                    value={profile.role}
                    disabled
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={loading}
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Security Settings */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-[24px] shadow-lg shadow-black/5 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-500/10 rounded-[16px] flex items-center justify-center">
                  <Lock className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Security</h3>
                  <p className="text-sm text-muted-foreground">Manage your password</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-[16px]">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Email</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-[16px]">
                  <div className="flex items-center gap-3 mb-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Password</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">••••••••</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPasswordModalOpen(true)}
                    className="w-full"
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="bg-card p-6 rounded-[24px] shadow-lg shadow-black/5 border border-border mt-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Account Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Member since</span>
                  <span className="text-sm font-medium text-foreground">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last login</span>
                  <span className="text-sm font-medium text-foreground">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <span className="text-sm font-medium text-foreground capitalize">
                    {profile.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Modal */}
        <Modal
          isOpen={passwordModalOpen}
          onClose={() => setPasswordModalOpen(false)}
          title="Change Password"
          size="md"
        >
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
            />
            <Input
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
              helperText="Password must be at least 6 characters long"
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
            />
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPasswordModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
              >
                Change Password
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
