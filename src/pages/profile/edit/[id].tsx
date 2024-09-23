import { type ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { nicknameSchema } from '@/utils/validate';

import useGetProfile from '@/hooks/profile/use-get-profile';
import { useImage } from '@/hooks/use-image';

import Input from '@/components/input';
import ProfileLayout from '@/components/layouts/profile-layout';
import Modal from '@/components/modal';

import ProfileHeader from '../components/profile-header';

import s from './style.module.scss';

import { DefaultProfile, EditIcon } from '@/assets/icons';

export default function Edit() {
  const router = useRouter();
  const { filePreview, handleChangeFile, file } = useImage();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  // const { mutate } = useUploadImg();

  const { data: profile } = useGetProfile(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<{ nickname: string }>({
    resolver: yupResolver(nicknameSchema),
    mode: 'onBlur',
    defaultValues: {
      nickname: '',
    },
  });

  const changedNickname = watch('nickname');

  const onSubmit = () => {
    // TODO:아직 api 프로필로직 확정이 안되어있어 확정후 변경
    // if (file) {
    //   mutate({
    //     photo_type: 'profile',
    //     images: [file],
    //   });
    // }
    reset();
  };

  const handleBack = () => {
    if (file || changedNickname !== '') setModalOpen((prev) => !prev);
    else router.back();
  };

  return (
    <>
      {modalOpen && (
        <Modal
          text="변경 사항이 저장되지 않았습니다"
          subText={`저장하지 않으면 닉네임이 적용되지 않습니다.\n저장하시겠습니까?`}
          leftBtnText="뒤로가기"
          rightBtnText="저장하기"
          leftBtnClick={() => router.back()}
          rightBtnClick={onSubmit}
        />
      )}
      <form className={s.editContainer} onSubmit={handleSubmit(onSubmit)}>
        <ProfileHeader
          text="프로필 수정"
          button={
            <button className={s.saveBtn} type="submit">
              저장
            </button>
          }
          iconClick={handleBack}
        />
        <div className={s.profileWrapper}>
          <figure className={s.profileImg}>
            {filePreview ? (
              <Image src={filePreview} alt="img" width={76} height={76} />
            ) : (
              <DefaultProfile />
            )}
            <label htmlFor="file">
              <EditIcon />
            </label>
            <Input type="file" id="file" onChange={handleChangeFile} />
          </figure>
          <div className={s.userInfoWrapper}>
            <div>{profile?.nickname}</div>
            <p>{profile?.selfIntroduction}</p>
          </div>
        </div>
        <Input labelText="닉네임 입력" placeholder="변경할 닉네임을 입력해주세요" {...register('nickname')} errorMessage={errors.nickname?.message} />
      </form>
    </>
  );
}

Edit.getLayout = (page: ReactNode) => <ProfileLayout>{page}</ProfileLayout>;