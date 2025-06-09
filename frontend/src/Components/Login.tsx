import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginModel } from "../Interfaces/LoginModel";
import { UserService } from "../Services/UserService";

export default function Login() {
  const [formData, setFormData] = useState<LoginModel>({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user: LoginModel = {
        email: formData.email,
        password: formData.password,
      };
      const response = await UserService.Login(user);

      localStorage.setItem("userRole", response.userRole);
      localStorage.setItem("id", response.userData.id!);
      localStorage.setItem("token", response.token);
      localStorage.setItem("departmentId", response.userData.departmentId!);

      if (response.userRole === "Student") {
        localStorage.setItem("studentId", response.userData.id!);
        navigate("/student/profile");
      } else if (response.userRole === "Lecture") {
        localStorage.setItem("lectureId", response.userData.id!);
        navigate("/lecture");
      } else if (response.userRole === "Receptionist") {
        navigate("/reports");
      } else if (response.userRole === "Coordinator") {
        navigate("/CoordinatorDashboard");
      }else{
        navigate("/OrariDitor");
      }
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg,rgb(80, 76, 44), #34495e)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflowX: "hidden",
        boxSizing: "border-box",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#1f2a38",
          borderRadius: "1rem",
          padding: "2rem",
          color: "white",
          boxShadow: "0 8px 16px rgba(0,0,0,0.25)",
        }}
      >
        <h2 className="text-center fw-bold mb-4 text-uppercase">Login</h2>
        <p className="text-center text-white-50 mb-4">
          Please enter your email and password
        </p>

        <form onSubmit={submitForm}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                backgroundColor: "#34495e",
                border: "none",
                color: "white",
              }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                backgroundColor: "#34495e",
                border: "none",
                color: "white",
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-light w-100"
            disabled={isSubmitting}
            style={{
              fontWeight: "bold",
              padding: "10px",
              borderRadius: "0.5rem",
            }}
          >
            {isSubmitting ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
