import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Login.scss";
import { handleLoginApi } from "../../services/userService";
import { jwtDecode } from "jwt-decode";
import HomeHeader from "../HomePage/HomeHeader";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            isShowPass: true,
            errMessage: {
                email: "",
                password: "",
            },
        };
    }

    handleOnChangeUsername = (d) => {
        this.setState({
            username: d.target.value,
        });
    };
    handleOnChangePassword = (d) => {
        this.setState({
            password: d.target.value,
        });
    };

    handleLogin = async () => {
        this.setState({
            errMessage: {
                email: "",
                password: "",
            },
        });
        try {
            let response = await handleLoginApi({
                email: this.state.username,
                password: this.state.password,
            });
            if (response.status) {
                let token = response.data; // Lấy token từ API
                let userInfo = jwtDecode(token);
                this.props.userLoginSuccess(token, userInfo); // Gọi action để lưu token
            }
        } catch (e) {
            if (e.response && e.response.status === 400) {
                this.setState({
                    errMessage: {
                        email: e.response.data.errors?.Email?.[0] || "",
                        password: e.response.data.errors?.Password?.[0] || "",
                    },
                });
                if (!e.response.data.status) {
                    alert(e.response.data.message);
                }
            }
        }
    };

    handleShowPassword = (event) => {
        this.setState({
            isShowPass: !this.state.isShowPass,
        });
    };

    handleViewPage = () => {
        this.props.history.push("/register");
    };

    render() {
        return (
            <>
                <HomeHeader />
                <div className="login-backgroud">
                    <div className="login-container">
                        <div className="login-content row">
                            <div className="col-12 text-login">Login</div>
                            <div className="col-12 form-group login-input">
                                <label>Tài khoản:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập tài khoản"
                                    value={this.state.username}
                                    onChange={(d) => {
                                        this.handleOnChangeUsername(d);
                                    }}
                                />
                                <div className="col-12 err-message">
                                    {this.state.errMessage.email}
                                </div>
                            </div>
                            <div className="col-12 form-group login-input">
                                <label>Mật khẩu:</label>

                                <div className="custom-input-password">
                                    <input
                                        type={
                                            this.state.isShowPass
                                                ? "text"
                                                : "password"
                                        }
                                        className="form-control"
                                        placeholder="Nhập mật khẩu"
                                        value={this.state.password}
                                        onChange={(d) => {
                                            this.handleOnChangePassword(d);
                                        }}
                                    />
                                    <span
                                        onClick={(event) => {
                                            this.handleShowPassword(event);
                                        }}
                                    >
                                        <i
                                            className={
                                                this.state.isShowPass
                                                    ? "fa-solid fa-eye"
                                                    : "fa-solid fa-eye-slash"
                                            }
                                        ></i>
                                    </span>
                                </div>
                                <div className="col-12 err-message">
                                    {this.state.errMessage.password}
                                </div>
                            </div>
                            <div className="col-12 ">
                                <button
                                    className="btn-login"
                                    onClick={() => {
                                        this.handleLogin();
                                    }}
                                >
                                    Login
                                </button>
                            </div>
                            <div className="col-12">
                                <span
                                    className="register"
                                    onClick={() => {
                                        this.handleViewPage("/login");
                                    }}
                                >
                                    Đăng ký
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (token, userInfo) =>
            dispatch(actions.userLoginSuccess(token, userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
