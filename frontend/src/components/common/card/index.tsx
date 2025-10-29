import { forwardRef, ReactNode, HTMLAttributes, ImgHTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** 배경색을 Tailwind 색상 키 혹은 커스텀 클래스로 지정합니다. 기본 yellow-400 */
  bgColorClassName?: string;
}

const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', bgColorClassName = 'bg-yellow-400', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full rounded-3xl p-4 ${bgColorClassName} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardRoot.displayName = 'Card';

// Layout Helpers -------------------------------------------------------------
interface RowProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** 수직 정렬 방법. 기본 center */
  align?: 'start' | 'center' | 'end';
}

const CardRow = ({ children, className = '', align = 'center', ...props }: RowProps) => {
  const alignClass =
    align === 'start' ? 'items-start' : align === 'end' ? 'items-end' : 'items-center';
  return (
    <div className={`flex gap-3 ${alignClass} ${className}`} {...props}>
      {children}
    </div>
  );
};
CardRow.displayName = 'Card.Row';

interface ColumnProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardColumn = ({ children, className = '', ...props }: ColumnProps) => (
  <div className={`flex flex-col gap-1 ${className}`} {...props}>
    {children}
  </div>
);
CardColumn.displayName = 'Card.Column';

// Image ----------------------------------------------------------------------
interface CardImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height'> {
  /** width & height (tailwind 클래스 기준) */
  size?: string; // e.g. "w-16 h-16"
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | '3xl';
  placeholder?: ReactNode;
}

const CardImage = ({
  size = 'w-16 h-16',
  rounded = 'lg',
  placeholder,
  className = '',
  src,
  alt = '',
  ...props
}: CardImageProps) => {
  const roundedClass = rounded === 'none' ? '' : `rounded-${rounded}`;

  if (!src) {
    return (
      <div
        className={`bg-gray-300 ${size} ${roundedClass} flex items-center justify-center ${className}`}
      >
        {placeholder || (
          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={`${size} object-cover ${roundedClass} ${className}`}
      {...props}
    />
  );
};
CardImage.displayName = 'Card.Image';

// Typography -----------------------------------------------------------------
interface TypographyProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}
const CardTitle = ({ children, className = '', ...props }: TypographyProps) => (
  <h3 className={`font-bold text-lg leading-tight ${className}`} {...props}>
    {children}
  </h3>
);
CardTitle.displayName = 'Card.Title';

const CardSubtitle = ({ children, className = '', ...props }: TypographyProps) => (
  <h4 className={`text-sm text-gray-800 leading-tight ${className}`} {...props}>
    {children}
  </h4>
);
CardSubtitle.displayName = 'Card.Subtitle';

interface ContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
const CardContent = ({ children, className = '', ...props }: ContentProps) => (
  <div className={`mt-2 text-sm text-gray-700 ${className}`} {...props}>
    {children}
  </div>
);
CardContent.displayName = 'Card.Content';

// Actions --------------------------------------------------------------------
interface ActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  vertical?: boolean;
  gap?: string; // Tailwind gap-*
}

const CardActions = ({
  children,
  className = '',
  vertical = false,
  gap = 'gap-2',
  ...props
}: ActionsProps) => (
  <div className={`mt-3 flex ${vertical ? 'flex-col' : 'flex-row'} ${gap} ${className}`} {...props}>
    {children}
  </div>
);
CardActions.displayName = 'Card.Actions';

// Footer ---------------------------------------------------------------------
interface FooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
const CardFooter = ({ children, className = '', ...props }: FooterProps) => (
  <div className={`mt-3 flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
);
CardFooter.displayName = 'Card.Footer';

// Compose --------------------------------------------------------------------
export interface CardStatic
  extends React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>> {
  Row: typeof CardRow;
  Column: typeof CardColumn;
  Image: typeof CardImage;
  Title: typeof CardTitle;
  Subtitle: typeof CardSubtitle;
  Content: typeof CardContent;
  Actions: typeof CardActions;
  Footer: typeof CardFooter;
}

const Card = CardRoot as CardStatic;

Card.Row = CardRow;
Card.Column = CardColumn;
Card.Image = CardImage;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Content = CardContent;
Card.Actions = CardActions;
Card.Footer = CardFooter;

export default Card;
