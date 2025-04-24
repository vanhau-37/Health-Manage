import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Register.scss";
import { parseInt } from "lodash";
import { createUserApi } from "../../services/userService";
import { toast } from "react-toastify";
import HomeHeader from "../HomePage/HomeHeader";
class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: "",
            gender: 0,
            phoneNumber: "",
            email: "",
            password: "",
            confirmPassword: "",
            errMessage: {
                fullname: "",
                email: "",
                password: "",
                confirmpassword: "",
                phonenumber: "",
            },
        };
    }

    handleOnChangeInput = (ev, name) => {
        let copyState = { ...this.state };
        name === "gender"
            ? (copyState[name] = parseInt(ev.target.value, 10))
            : (copyState[name] = ev.target.value);
        this.setState(
            {
                ...copyState,
            },
            () => console.log(this.state)
        );
    };

    handleRegister = async () => {
        this.setState({
            errMessage: {
                fullname: "",
                email: "",
                password: "",
                confirmpassword: "",
                phonenumber: "",
            },
        });
        try {
            await createUserApi(this.state);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                this.setState({
                    errMessage: {
                        fullName:
                            error.response.data.errors?.FullName?.[0] || "",
                        email: error.response.data.errors?.Email?.[0] || "",
                        password:
                            error.response.data.errors?.Password?.[0] || "",
                        confirmPassword:
                            error.response.data.errors?.ConfirmPassword?.[0] ||
                            "",
                        phoneNumber:
                            error.response.data.errors?.PhoneNumber?.[0] || "",
                    },
                });
                if (!error.response.data.status) {
                    toast.error(error.response.data.message);
                }
            }
        }
    };

    handleViewPage = (path) => {
        this.props.history.push(path);
    };

    render() {
        return (
            <>
                <HomeHeader />
                <div className="register-backgroud">
                    <div className="register-container">
                        <div className="register-content row">
                            <div className="col-12 text-register">Register</div>
                            <div className="col-6 form-group register-input">
                                <label>Họ tên:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập họ tên"
                                    value={this.state.fullName}
                                    onChange={(ev) => {
                                        this.handleOnChangeInput(
                                            ev,
                                            "fullName"
                                        );
                                    }}
                                />
                                <div className="col-12 err-message">
                                    {this.state.errMessage.fullName}
                                </div>
                            </div>
                            <div className="col-6 form-group register-input">
                                <label>Giới tính:</label>
                                <select
                                    className="form-control"
                                    onChange={(ev) => {
                                        this.handleOnChangeInput(ev, "gender");
                                    }}
                                >
                                    <option value="0">Nam</option>
                                    <option value="1">Nữ</option>
                                    <option value="2">Khác</option>
                                </select>
                            </div>
                            <div className="col-12 form-group register-input">
                                <label>Phone:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập số điện thoại"
                                    value={this.state.phoneNumber}
                                    onChange={(ev) => {
                                        this.handleOnChangeInput(
                                            ev,
                                            "phoneNumber"
                                        );
                                    }}
                                />
                                <div className="col-12 err-message">
                                    {this.state.errMessage.phoneNumber}
                                </div>
                            </div>
                            <div className="col-12 form-group register-input">
                                <label>Tài khoản:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập tài khoản"
                                    value={this.state.email}
                                    onChange={(ev) => {
                                        this.handleOnChangeInput(ev, "email");
                                    }}
                                />
                                <div className="col-12 err-message">
                                    {this.state.errMessage.email}
                                </div>
                            </div>

                            <div className="col-12 form-group register-input">
                                <label>Mật khẩu:</label>

                                <div className="custom-input-password">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Nhập mật khẩu"
                                        value={this.state.password}
                                        onChange={(ev) => {
                                            this.handleOnChangeInput(
                                                ev,
                                                "password"
                                            );
                                        }}
                                    />
                                </div>
                                <div className="col-12 err-message">
                                    {this.state.errMessage.password}
                                </div>
                            </div>

                            <div className="col-12 form-group register-input">
                                <label>Nhập lại mật khẩu:</label>

                                <div className="custom-input-password">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Nhập mật khẩu"
                                        value={this.state.confirmPassword}
                                        onChange={(ev) => {
                                            this.handleOnChangeInput(
                                                ev,
                                                "confirmPassword"
                                            );
                                        }}
                                    />
                                </div>
                                <div className="col-12 err-message">
                                    {this.state.errMessage.confirmPassword}
                                </div>
                            </div>

                            <div className="col-12 d-flex justify-content-center">
                                <div className="col-5">
                                    <button
                                        className="btn-register  "
                                        onClick={() => {
                                            this.handleRegister();
                                        }}
                                    >
                                        Register
                                    </button>
                                </div>
                            </div>

                            <div className="col-12">
                                <span
                                    className="login"
                                    onClick={() => {
                                        this.handleViewPage("/login");
                                    }}
                                >
                                    Đăng nhập
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
        // userLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginSuccess: (token, userInfo) =>
            dispatch(actions.userLoginSuccess(token, userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
