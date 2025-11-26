import React from 'react';

/**
 * React 노드에서 순수 텍스트만 추출하는 함수
 */
const extractTextFromReactNode = (node: React.ReactNode): string =>
  !node
    ? ''
    : typeof node === 'string' || typeof node === 'number'
      ? String(node)
      : Array.isArray(node)
        ? node.map(extractTextFromReactNode).join('')
        : React.isValidElement(node)
          ? extractTextFromReactNode((node.props as { children?: React.ReactNode }).children)
          : '';

interface PageTitleProps {
  text: React.ReactNode;
  subText?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  'aria-label'?: string;
}

const PageTitle = React.forwardRef<HTMLHeadingElement, PageTitleProps>(
  ({ text, subText, className, size = '2xl', 'aria-label': ariaLabel }, ref) => {
    const defaultAriaLabel = React.useMemo(() => {
      if (ariaLabel) return ariaLabel;
      return extractTextFromReactNode(text);
    }, [text, ariaLabel]);

    return (
      <div className={className}>
        <h1
          ref={ref}
          tabIndex={-1}
          className={`text-${size} whitespace-pre-line font-bold text-gray-900`}
          aria-label={defaultAriaLabel}
        >
          <span aria-hidden="true">{text}</span>
        </h1>
        {subText && (
          <p className="mt-2 text-sm text-gray-500 whitespace-pre-line">
            {subText}
          </p>
        )}
      </div>
    );
  }
);

PageTitle.displayName = 'PageTitle';

export default PageTitle;
