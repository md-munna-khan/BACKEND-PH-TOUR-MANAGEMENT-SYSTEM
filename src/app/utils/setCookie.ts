import { Response } from "express";

export interface AuthCookies {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthCookie = (res: Response, tokenInfo: AuthCookies) => {
  if (tokenInfo.accessToken) {
      res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite:"none"
    });
  }
  if (tokenInfo.refreshToken) {
      res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite:"none"
    });
  }
};

// before deploy
// import { Response } from "express";

// export interface AuthCookies {
//   accessToken?: string;
//   refreshToken?: string;
// }

// export const setAuthCookie = (res: Response, tokenInfo: AuthCookies) => {
//   if (tokenInfo.accessToken) {
//       res.cookie("accessToken", tokenInfo.accessToken, {
//       httpOnly: true,
//       sameSite:false
//     });
//   }
//   if (tokenInfo.refreshToken) {
//       res.cookie("refreshToken", tokenInfo.refreshToken, {
//       httpOnly: true,
 
//        sameSite:false
//     });
//   }
// };
