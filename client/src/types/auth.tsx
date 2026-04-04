

export type BasicFilter = 'off' | 'low' | 'high'
export type ColorFilter = 'color' | 'gray'



export interface UserData {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  filterDark: BasicFilter,
  filterBlur: BasicFilter,
  filterColor: ColorFilter,
  createdAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  filterDark: BasicFilter,
  filterBlur: BasicFilter,
  filterColor: ColorFilter,
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const returnFilterEffects = () => {
  let classes = "";

  switch (localStorage.getItem('dark-filter')) {
    case "low":
      classes += " bg-black/40";
      break;
    case "high":
      classes += " bg-black/90";
      break;
  }

  switch (localStorage.getItem('blur-filter')) {
    case "low":
      classes += " backdrop-blur-[4px]";
      break;
    case "high":
      classes += " backdrop-blur-[10px]";
      break;
  }

  switch (localStorage.getItem('color-filter')) {
    case "gray":
      classes += " backdrop-saturate-0";
      break;
  }


  return classes.trim();
};


export type updateUserData = {
  name?: string,
  profileImage?: File,
  filterDark?: BasicFilter,
  filterBlur?: BasicFilter,
  filterColor?: ColorFilter,
}