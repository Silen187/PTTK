import React, { useState } from "react";

function LoginForm() {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (username === "" || password === "") {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("https://api-pttk2.onrender.com/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"        
        },
        mode: "cors",                           
        credentials: "include",            
        body:  new URLSearchParams({ username, password }).toString()
      });

      if (!response.ok) {
        throw new Error(`Lỗi đăng nhập! HTTP status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Login successful:", data);
      
      if (data.access_token) {
        alert("Đăng nhập thành công!");
        localStorage.setItem("authToken", data.token);
      } else {
        setError(data.message || "Đăng nhập thất bại.");
      }

    } catch (err) {
      console.error("Connection error:", err);
      setError(`Lỗi kết nối: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập tên tài khoản"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
