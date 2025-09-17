// src/pages/LoginAdmin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/Card";
import Input from "@/component/ui/Input";
import Button from "@/component/ui/Buttons";

export default function LoginAdmin() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.username === "admin" && formData.password === "12345") {
      alert("Login berhasil!");
      navigate("/admindashboard");
    } else {
      alert("Username atau password salah!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-poppins">
      <Card className="w-full max-w-md bg-base-card text-text-light shadow-xl rounded-2xl animate-scale-in">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-accent">
            Login Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="bg-base-dark border border-border-accent text-text-light placeholder-text-placeholder focus-visible:ring-accent-ring"
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-base-dark border border-border-accent text-text-light placeholder-text-placeholder focus-visible:ring-accent-ring"
              required
            />
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent-hover text-text-light rounded-lg py-2"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
