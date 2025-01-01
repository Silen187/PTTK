import { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Center from '@/components/Center';
import WhiteBox from '@/components/WhiteBox';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Title from '@/components/Title';
import styled from 'styled-components';

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.8rem;
  margin-top: 5px;
`;

const SuccessMessage = styled.div`
  color: green;
  font-size: 0.8rem;
  margin-top: 5px;
`;

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    country: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.message || 'Đăng ký thất bại.');
      } else {
        setSuccessMessage(data.message);
        setTimeout(() => router.push('/account'), 2000); // Chuyển hướng sau 2 giây
      }
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      setErrorMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  };

  return (
    <>
      <Header />
      <Center>
        <WhiteBox>
          <Title>Đăng ký tài khoản</Title>
          <form onSubmit={handleRegister}>
            <Input
              type="text"
              placeholder="Tên đăng nhập"
              name="username"
              value={form.username}
              onChange={handleInputChange}
            />
            <Input
              type="email"
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
            />
            <Input
              type="password"
              placeholder="Mật khẩu"
              name="password"
              value={form.password}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              placeholder="Họ tên"
              name="name"
              value={form.name}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              placeholder="Số điện thoại"
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              placeholder="Địa chỉ"
              name="address"
              value={form.address}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              placeholder="Thành phố"
              name="city"
              value={form.city}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              placeholder="Quốc gia"
              name="country"
              value={form.country}
              onChange={handleInputChange}
            />
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
            <Button type="submit">Đăng ký</Button>
          </form>
        </WhiteBox>
      </Center>
    </>
  );
}
