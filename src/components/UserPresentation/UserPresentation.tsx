import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { withBasePath } from '@/lib/nextUtils';
import { IUserDetails } from '@/interface/user';
import { useUser } from '@/store/user/useUser';
import EditEmailForm from '@/components/EditEmailForm/EditEmailForm';
import DotsLoading from '@/components/DotsLoading/DotsLoading';
import FallbackImage from '@/components/FallbackImage/FallbackImage';
import styles from './UserPresentation.module.scss';

const UserPresentation = () => {
  const user_details = useUser.use.user_details();
  const fetchUserDetails = useUser.use.fetchUserDetails();
  const loading_fetch_user_details = useUser.use.loading_fetch_user_details();
  const [userEmail, setUserEmail] = useState(user_details.email);

  useEffect(() => {
    fetchUserDetails();
    setUserEmail(user_details.email);
  }, []);
  return loading_fetch_user_details ? (
    <DotsLoading />
  ) : (
    <div className={styles.liloren__user__presentation}>
      <FallbackImage
        src={`${
          user_details.profile_picture_url
            ? user_details.profile_picture_url
            : withBasePath('/blank-profile.webp')
        }`}
        alt={'user__profpic'}
        className={'rounded-full h-[64px] w-[64px]'}
        width={64}
        height={64}
      />
      <UserInfo
        user_details={user_details}
        userEmail={userEmail}
        setUserEmail={setUserEmail}
      />
    </div>
  );
};

interface UserInfoProps {
  user_details: IUserDetails;
  userEmail: string;
  setUserEmail: Dispatch<SetStateAction<string>>;
}

const UserInfo = ({ user_details, userEmail, setUserEmail }: UserInfoProps) => {
  return (
    <div className={styles.lilOren__user__info}>
      <div className={styles.lilOren__user__name__container}>
        <span className={styles.lilOren__user__info__firstname}>
          {user_details.username}
        </span>
      </div>
      <div className="lilOren__user__phone__container"></div>
      <div className={styles.lilOren__user_email__container}>
        {user_details.email}
        <EditEmailForm userEmail={userEmail} setUserEmail={setUserEmail} />
      </div>
    </div>
  );
};

export default UserPresentation;
