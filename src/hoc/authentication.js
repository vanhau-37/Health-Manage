import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";

const locationHelper = locationHelperBuilder({});

export const userIsAuthenticated = connectedRouterRedirect({
    authenticatedSelector: (state) => state.user.isLoggedIn, // Chỉ cho vào khi isLoggedIn = true
    wrapperDisplayName: "UserIsAuthenticated",
    redirectPath: "/login", // Nếu chưa login thì chuyển về login
});

export const userIsNotAuthenticated = connectedRouterRedirect({
    authenticatedSelector: (state) => !state.user.isLoggedIn, // Chỉ cho vào khi chưa đăng nhập
    wrapperDisplayName: "UserIsNotAuthenticated",
    redirectPath: (state, ownProps) =>
        locationHelper.getRedirectQueryParam(ownProps) || "/", // Nếu đang login thì đẩy về trang chủ
    allowRedirectBack: false, // Không quay lại sau khi redirect
});
