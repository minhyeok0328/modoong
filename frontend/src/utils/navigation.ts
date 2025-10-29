import { NavigateFunction, NavigateOptions } from 'react-router-dom';

let navigate: NavigateFunction | null = null;

export function setNavigate(navigateFn: NavigateFunction) {
  navigate = navigateFn;
}

export function goTo(path: string, options?: NavigateOptions) {
  if (navigate) {
    navigate(path, options);
  } else {
    // Fallback if navigate isn't set yet
    window.location.href = path;
  }
}
