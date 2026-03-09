"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, LogOut, ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AnimatedGradientBackground } from "@/components/AnimatedGradientBackground";
import { useAuthContext } from "@/contexts/AuthContext";
import { ProtectedLayout } from "@/components/ProtectedLayout";

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, logout, updateProfile, changePassword } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Profile form
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        mobile: user.mobile || "",
      });
    }
  }, [user]);

  // Handle profile update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await updateProfile(profileData);
      setMessageType("success");
      setMessage("Profile updated successfully!");
    } catch (err: any) {
      setMessageType("error");
      setMessage(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessageType("error");
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    if (passwordData.new_password.length < 8) {
      setMessageType("error");
      setMessage("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      await changePassword(
        passwordData.current_password,
        passwordData.new_password
      );
      setMessageType("success");
      setMessage("Password changed successfully!");
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err: any) {
      setMessageType("error");
      setMessage(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <ProtectedLayout>
      <main className="relative min-h-screen w-full">
        <AnimatedGradientBackground />
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <header className="border-b border-border bg-background/40 backdrop-blur-xl sticky top-0 z-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="font-bold text-lg text-foreground">DARC</span>
              </div>
              <nav className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Back
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-lg"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Logout
                </Button>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-12">
            {/* Page Title */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Account Settings
              </h1>
              <p className="text-muted-foreground">
                Manage your profile and security settings
              </p>
            </motion.div>

            {/* Message Display */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-lg border ${
                  messageType === "success"
                    ? "bg-green-600/10 border-green-600/30 text-green-600"
                    : "bg-destructive/10 border-destructive/30 text-destructive"
                }`}
              >
                {message}
              </motion.div>
            )}

            {/* Profile Settings Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <Card className="bg-background/60 backdrop-blur-xl border-border">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6">
                    Profile Information
                  </h2>

                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          First Name
                        </label>
                        <Input
                          type="text"
                          placeholder="Your first name"
                          value={profileData.first_name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              first_name: e.target.value,
                            })
                          }
                          className="rounded-lg"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Last Name
                        </label>
                        <Input
                          type="text"
                          placeholder="Your last name"
                          value={profileData.last_name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              last_name: e.target.value,
                            })
                          }
                          className="rounded-lg"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        className="rounded-lg"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Mobile Phone (Optional)
                      </label>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={profileData.mobile}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            mobile: e.target.value,
                          })
                        }
                        className="rounded-lg"
                        disabled={loading}
                      />
                    </div>

                    {user?.is_developer && (
                      <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                        <p className="text-sm text-foreground">
                          <span className="font-semibold">Developer Status:</span>{" "}
                          Active
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Total Earnings: ${typeof user?.total_earning === 'string' ? parseFloat(user.total_earning).toFixed(2) : (user?.total_earning || 0).toFixed(2)}
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Password Settings Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-background/60 backdrop-blur-xl border-border">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6">
                    Change Password
                  </h2>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your current password"
                          value={passwordData.current_password}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              current_password: e.target.value,
                            })
                          }
                          className="rounded-lg pr-10"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter your new password"
                          value={passwordData.new_password}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              new_password: e.target.value,
                            })
                          }
                          className="rounded-lg pr-10"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Must be at least 8 characters long
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Confirm New Password
                      </label>
                      <Input
                        type="password"
                        placeholder="Confirm your new password"
                        value={passwordData.confirm_password}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirm_password: e.target.value,
                          })
                        }
                        className="rounded-lg"
                        disabled={loading}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg"
                    >
                      {loading ? "Updating..." : "Change Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </ProtectedLayout>
  );
}
