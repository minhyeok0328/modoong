import React, { forwardRef, ReactNode, HTMLAttributes, ImgHTMLAttributes, useState } from 'react';
import { FaArrowLeft, FaTimes, FaEnvelope, FaHeart, FaArrowRight } from 'react-icons/fa';
import { FiMapPin } from 'react-icons/fi';
import { Temperature } from '@/components/common';

interface ProfileCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const ProfileCardRoot = forwardRef<HTMLDivElement, ProfileCardProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative w-full h-110 rounded-3xl overflow-hidden ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ProfileCardRoot.displayName = 'ProfileCard';

// Image Component
interface ProfileCardImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'className'> {
  fallback?: ReactNode;
  className?: string;
}

const ProfileCardImage = ({
  src,
  alt = '',
  fallback,
  className = '',
  ...props
}: ProfileCardImageProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center w-full">
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover rounded-3xl ${className}`}
          {...props}
        />
      ) : fallback ? (
        <div className="w-full h-full flex items-center justify-center">{fallback}</div>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600"></div>
      )}
    </div>
  );
};
ProfileCardImage.displayName = 'ProfileCard.Image';

// Overlay Component
interface ProfileCardOverlayProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  variant?: 'gradient' | 'solid' | 'none';
}

const ProfileCardOverlay = ({
  children,
  variant = 'gradient',
  className = '',
  ...props
}: ProfileCardOverlayProps) => {
  const overlayClasses = {
    gradient: 'bg-gradient-to-t from-black/80 via-transparent to-transparent',
    solid: 'bg-black/50',
    none: '',
  };

  return (
    <div className={`absolute inset-0 ${overlayClasses[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
ProfileCardOverlay.displayName = 'ProfileCard.Overlay';

// Info Component
interface ProfileCardInfoProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  age?: string;
  disability?: string;
  distance?: string;
  sport?: string;
  mbti?: string;
  position?: 'top' | 'center' | 'bottom';
}

const ProfileCardInfo = ({
  name,
  age,
  disability,
  distance,
  sport = '탁구',
  mbti = 'ENFP',
  position = 'bottom',
  className = '',
  ...props
}: ProfileCardInfoProps) => {
  const positionClasses = {
    top: 'top-4',
    center: 'top-1/2 -translate-y-1/2',
    bottom: 'bottom-20',
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} left-0 right-0 flex flex-col text-white px-6 ${className}`}
      {...props}
    >
      <h3 className="text-2xl font-bold mb-1 flex items-center gap-3">
        {name}
        {distance && (
          <span className="flex items-center gap-1 text-sm opacity-80">
            <Temperature /><FiMapPin className="ml-2" /> {distance}
          </span>
        )}
      </h3>
      <p className="text-sm opacity-90">
        {[age, disability, sport, mbti].filter(Boolean).join(' • ')}
      </p>
    </div>
  );
};
ProfileCardInfo.displayName = 'ProfileCard.Info';

// Actions Component
interface ProfileCardActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  position?: 'top' | 'center' | 'bottom';
  layout?: 'horizontal' | 'vertical';
  gap?: string;
}

const ProfileCardActions = ({
  children,
  position = 'bottom',
  layout = 'horizontal',
  gap = 'gap-2',
  className = '',
  ...props
}: ProfileCardActionsProps) => {
  const positionClasses = {
    top: 'top-4',
    center: 'top-1/2 -translate-y-1/2',
    bottom: 'bottom-4',
  };

  const layoutClasses = {
    horizontal: 'flex-row justify-center items-center',
    vertical: 'flex-col items-center',
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} left-0 right-0 flex ${layoutClasses[layout]} ${gap} px-4 z-50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
ProfileCardActions.displayName = 'ProfileCard.Actions';

// Action Button Component
interface ProfileCardButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const ProfileCardButton = ({
  children,
  variant = 'default',
  size = 'lg',
  disabled = false,
  className = '',
  ...props
}: ProfileCardButtonProps) => {
  const sizeClasses = {
    sm: 'max-w-[40px] max-h-[40px] p-3',
    md: 'max-w-[45px] max-h-[45px] p-3',
    lg: 'max-w-[50px] max-h-[50px] p-4',
  };

  const variantClasses = {
    default: 'bg-black/50 hover:bg-black/70',
    primary: 'bg-blue-500 hover:bg-blue-600',
    secondary: 'bg-gray-500 hover:bg-gray-600',
  };

  return (
    <button
      disabled={disabled}
      className={`
        flex items-center justify-center
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        rounded-full text-white transition-colors cursor-pointer
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
ProfileCardButton.displayName = 'ProfileCard.Button';

// Icon Components for common actions
const ProfileCardPrevButton = (props: Omit<ProfileCardButtonProps, 'children'>) => (
  <ProfileCardButton {...props}>
    <FaArrowLeft className="text-2xl" />
  </ProfileCardButton>
);

const ProfileCardNextButton = (props: Omit<ProfileCardButtonProps, 'children'>) => (
  <ProfileCardButton {...props}>
    <FaArrowRight className="text-2xl" />
  </ProfileCardButton>
);

const ProfileCardCloseButton = (props: Omit<ProfileCardButtonProps, 'children'>) => (
  <ProfileCardButton {...props}>
    <FaTimes className="text-2xl" />
  </ProfileCardButton>
);

const ProfileCardMessageButton = (props: Omit<ProfileCardButtonProps, 'children'>) => (
  <ProfileCardButton {...props}>
    <FaEnvelope className="text-2xl" />
  </ProfileCardButton>
);

const ProfileCardHeartButton = (props: Omit<ProfileCardButtonProps, 'children'>) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsLiked(!isLiked);
    props.onClick?.(e);
  };

  return (
    <ProfileCardButton
      {...props}
      onClick={handleClick}
      className={`${props.className || ''} ${isLiked ? 'bg-red-500 hover:bg-red-600' : ''}`}
    >
      <FaHeart
        className={`text-2xl transition-all duration-300 ease-in-out ${
          isLiked ? 'text-white scale-110' : ''
        }`}
      />
    </ProfileCardButton>
  );
};

// Static interface for compound component
export interface ProfileCardStatic
  extends React.ForwardRefExoticComponent<ProfileCardProps & React.RefAttributes<HTMLDivElement>> {
  Image: typeof ProfileCardImage;
  Overlay: typeof ProfileCardOverlay;
  Info: typeof ProfileCardInfo;
  Actions: typeof ProfileCardActions;
  Button: typeof ProfileCardButton;
  PrevButton: typeof ProfileCardPrevButton;
  NextButton: typeof ProfileCardNextButton;
  CloseButton: typeof ProfileCardCloseButton;
  MessageButton: typeof ProfileCardMessageButton;
  HeartButton: typeof ProfileCardHeartButton;
}

// Compound component
const ProfileCard = ProfileCardRoot as ProfileCardStatic;
ProfileCard.Image = ProfileCardImage;
ProfileCard.Overlay = ProfileCardOverlay;
ProfileCard.Info = ProfileCardInfo;
ProfileCard.Actions = ProfileCardActions;
ProfileCard.Button = ProfileCardButton;
ProfileCard.PrevButton = ProfileCardPrevButton;
ProfileCard.NextButton = ProfileCardNextButton;
ProfileCard.CloseButton = ProfileCardCloseButton;
ProfileCard.MessageButton = ProfileCardMessageButton;
ProfileCard.HeartButton = ProfileCardHeartButton;

export default ProfileCard;
export { useProfileCardSwiper } from './hooks/useProfileCardSwiper';
