import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginModel } from "../Interfaces/LoginModel";
import { UserService } from "../Services/UserService";

export default function Login() {
  const [formData, setFormData] = useState<LoginModel>({
    email: "",
    password: "",
  });

  const[isSubmitting,setIsSubmitting] = useState<boolean>(false);
   const navigate = useNavigate();
 
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target;
     setFormData({ ...formData, [name]: value });
   };
   async function submitForm(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setIsSubmitting(true);
      var user: LoginModel = {
        email: formData.email,
        password: formData.password,
      };
      const response = await UserService.Login(user);
      localStorage.setItem("userRole", response.userRole);  
      localStorage.setItem("id", response.userData.id!);
      localStorage.setItem("token", response.token);
      localStorage.setItem("departmentId", response.userData.departmentId!);

    if (response.userRole === "Student") 
    {
      localStorage.setItem("studentId", response.userData.id!);
      localStorage.setItem("departmentId", response.userData.departmentId!);
      navigate("/student/profile");
    }
    else if (response.userRole === "Lecture")
    {
      localStorage.setItem("lectureId", response.userData.id!);
      navigate("/lecture");
    }
    else if (response.userRole === "Receptionist")
    { 
      navigate("/reports")
    };
    }

    return (
      <>
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                <div className="card bg-bs-secondary-color text-black" style={{ borderRadius: "1rem" }}>
                  <div className="card-body p-5 text-center">
  
                    <div className="mb-md-5 mt-md-4 pb-5">
                      <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                      <form onSubmit={submitForm}>
                      <p className="text-black-50 mb-5">Please enter your email and password!</p>
  
                      <div className="form-outline form-white mb-4">
                        <input type="email" id="email" name="email" className="form-control form-control-lg"
                        value={formData.email} onChange={handleChange} />
                        <label className="form-label" htmlFor="typeEmailX">Email</label>
                      </div>
  
                      <div className="form-outline form-white mb-4">
                        <input type="password" id="password" name="password" className="form-control form-control-lg"
                        onChange={handleChange} value={formData.password} />
                        <label className="form-label" htmlFor="typePasswordX">Password</label>
                      </div>
  
                      <button className="btn btn-outline-dark  btn-lg px-5" type="submit">Login</button>
                      <br/>
                      <br/>

                    </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </>
    );
  }
  