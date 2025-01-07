import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Center from '@/components/Center';
import WhiteBox from '@/components/WhiteBox';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Title from '@/components/Title';
import styled from 'styled-components';
import axios from "axios";

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
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0); // Thay đổi điểm thưởng bằng state riêng

  useEffect(() => {
    async function fetchVouchers() {
      if (session?.user?.customer?.id) {
        try {
          const response = await axios.get(`/api/vouchers?customerId=${session.user.customer.id}`);
          setAvailableVouchers(response.data);
        } catch (error) {
          console.error("Error fetching vouchers:", error);
          setAvailableVouchers([]);
        }
      }
    }
    fetchVouchers();
  }, [session]);

  useEffect(() => {
    async function fetchLoyaltyPoints() {
      if (session?.user?.customer?.id) {
        try {
          const response = await axios.get(`/api/customers/points?customerId=${session.user.customer.id}`);
          setLoyaltyPoints(response.data.loyalty_points);
        } catch (error) {
          console.error("Error fetching loyalty points:", error);
        }
      }
    }
    fetchLoyaltyPoints();
  }, [session]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    try {
      const response = await signIn('credentials', {
        ...credentials,
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
            <LoginSection>
              <Title>Đăng nhập</Title>
              <form onSubmit={handleSubmit}>
                <Input
                  type="text"
                  name="username"
                  placeholder="Tên đăng nhập"
                  value={credentials.username}
                  onChange={handleChange}
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu"
                  value={credentials.password}
                  onChange={handleChange}
                />
                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                <Button type="submit">Đăng nhập</Button>
              </form>
              <p>
                Chưa có tài khoản?{' '}
                <Link href="/register">Đăng ký ngay</Link>
              </p>
            </LoginSection>
          ) : (
            <>
              <Title>Thông tin tài khoản</Title>
              <ul>
                <li>
                  <strong>ID:</strong> {session?.user?.id || 'Không có'}
                </li>
                <li>
                  <strong>Tên đăng nhập:</strong> {session?.user?.username || 'Không có'}
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
                <>
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
                    <li>
                      <strong>Điểm thưởng:</strong> {loyaltyPoints} {/* Sử dụng state */}
                    </li>
                    <li>
                      <strong>Khách hàng VIP:</strong>{' '}
                      {session.user.customer.is_vip ? 'Có' : 'Không'}
                    </li>
                  </ul>
                  <h3>Lịch sử VIP</h3>
                  {session?.user?.customer?.vip_history && session.user.customer.vip_history.length > 0 ? (
                    <ul>
                      {session.user.customer.vip_history.map((entry, index) => (
                        <li key={index}>
                          <strong>Lý do:</strong> {entry.promotion_reason} <br />
                          <strong>Thời gian:</strong> {new Date(entry.created_at).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Không có lịch sử VIP.</p>
                  )}
                  <h3>Voucher chưa sử dụng</h3>
                  {availableVouchers.length > 0 ? (
                    <ul>
                      {availableVouchers.map((entry, index) => (
                        <li key={index}>
                          <strong>Mã:</strong> {entry.voucher.code} <br />
                          <strong>Tiết kiệm:</strong> {entry.voucher.discount_value}$ <br />
                          <strong>Hạn sử dụng:</strong>{" "}
                          {new Date(entry.voucher.expires_at).toLocaleDateString()} <br />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Không có voucher nào chưa sử dụng.</p>
                  )}
                </>
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
