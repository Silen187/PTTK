import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Center from '@/components/Center';
import WhiteBox from '@/components/WhiteBox';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Title from '@/components/Title';
import styled from 'styled-components';

const LoginSection = styled.div`
  margin-top: 20px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.8rem;
  margin-top: 5px;
`;

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    try {
      const response = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (response.error) {
        setErrorMessage(response.error);
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      setErrorMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  if (status === 'loading') {
    return (
      <Center>
        <WhiteBox>
          <p>Đang tải...</p>
        </WhiteBox>
      </Center>
    );
  }

  return (
    <>
      <Header />
      <Center>
        <WhiteBox>
          {!session ? (
            <>
              <Title>Đăng nhập</Title>
              <form onSubmit={handleSubmit}>
                <Input
                  type="text"
                  placeholder="Tên đăng nhập"
                  value={username}
                  onChange={(ev) => setUsername(ev.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                />
                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                <Button type="submit">Đăng nhập</Button>
              </form>
              <p>
                Chưa có tài khoản?{' '}
                <Link href="/register">Đăng ký ngay</Link>
              </p>
            </>
          ) : (
            <>
              <Title>Thông tin tài khoản</Title>
              <ul>
                <li>
                  <strong>ID:</strong> {session?.user?.id || 'Không có'}
                </li>
                <li>
                  <strong>Tên đăng nhập:</strong> {session?.user?.name || 'Không có'}
                </li>
                <li>
                  <strong>Email:</strong> {session?.user?.email || 'Không có'}
                </li>
                <li>
                  <strong>Vai trò:</strong>{' '}
                  {session?.user?.role === 'customer' ? 'Khách hàng' : 'Quản trị viên'}
                </li>
              </ul>
              <h3>Thông tin khách hàng</h3>
              {session?.user?.customer ? (
                <ul>
                  <li>
                    <strong>Họ tên:</strong> {session.user.customer.name || 'Không có'}
                  </li>
                  <li>
                    <strong>Số điện thoại:</strong> {session.user.customer.phone || 'Không có'}
                  </li>
                  <li>
                    <strong>Địa chỉ:</strong> {session.user.customer.address || 'Không có'}
                  </li>
                  <li>
                    <strong>Thành phố:</strong> {session.user.customer.city || 'Không có'}
                  </li>
                  <li>
                    <strong>Quốc gia:</strong> {session.user.customer.country || 'Không có'}
                  </li>
                </ul>
              ) : (
                <p>Không có thông tin khách hàng.</p>
              )}
              <Button onClick={handleSignOut}>Đăng xuất</Button>
            </>
          )}
        </WhiteBox>
      </Center>
    </>
  );
}
